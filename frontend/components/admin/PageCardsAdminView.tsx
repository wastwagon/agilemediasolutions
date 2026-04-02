'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminEditorCard, AdminFormActions } from '@/components/admin/AdminFormUi';
import { AdminErrorBanner, AdminLoadingState, AdminPageHeader } from '@/components/admin/AdminPageUi';
import AdminImageUpload from '@/components/AdminImageUpload';
import MediaLibraryPicker from '@/components/MediaLibraryPicker';
import { usePageContentCardsResource } from '@/hooks/usePageContentCardsResource';
import { adminActionBtnStyle, adminThStyle } from '@/lib/adminTableStyles';
import type { PageCardContextSlug } from '@/lib/pageCardContexts';
import { PAGE_CARD_CONTEXT_META } from '@/lib/pageCardContexts';
import type { PageContentCard, PageContentCardPayload } from '@/types/adminEntities';

const MSGS = {
  loadError: 'Could not load cards.',
  connectError: 'Could not connect to the server.',
  deleteError: 'Could not delete this card.',
  saveError: 'Could not save changes.',
} as const;

export default function PageCardsAdminView({ context }: { context: PageCardContextSlug }) {
  const meta = PAGE_CARD_CONTEXT_META[context];
  const { items: cards, loading, error, deleteItem, saveItem } = usePageContentCardsResource(context, MSGS);

  const [editing, setEditing] = useState<PageContentCard | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [listLabel, setListLabel] = useState('');
  const [listItems, setListItems] = useState('');
  const [published, setPublished] = useState(true);
  const [orderIndex, setOrderIndex] = useState('0');

  const resetForm = () => {
    setTitle('');
    setBody('');
    setImageUrl('');
    setListLabel('');
    setListItems('');
    setPublished(true);
    setOrderIndex('0');
  };

  const handleEditClick = (card: PageContentCard) => {
    setEditing(card);
    setIsAdding(true);
    setTitle(card.title);
    setBody(card.body || '');
    setImageUrl(card.image_url || '');
    setListLabel(card.list_label || '');
    setListItems(card.list_items || '');
    setPublished(card.published);
    setOrderIndex(card.order_index?.toString() || '0');
  };

  const handleCreateClick = () => {
    setEditing(null);
    setIsAdding(true);
    resetForm();
    setOrderIndex(String((cards[cards.length - 1]?.order_index ?? -1) + 1));
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditing(null);
    resetForm();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this card? It will disappear from the public page.')) return;
    const err = await deleteItem(id);
    if (err) alert(err);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: PageContentCardPayload = {
      title,
      body,
      image_url: imageUrl,
      list_label: listLabel,
      list_items: listItems,
      published,
      order_index: parseInt(orderIndex || '0', 10),
    };
    const err = await saveItem(payload, editing?.id);
    if (err) {
      alert(err);
      return;
    }
    handleCancel();
  };

  const sortedPreview = useMemo(
    () => [...cards].sort((a, b) => a.order_index - b.order_index || a.id - b.id),
    [cards]
  );

  if (loading && cards.length === 0) return <AdminLoadingState />;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <AdminPageHeader
        title={meta.label}
        subtitle={meta.adminSubtitle}
        addLabel="Add card"
        isAdding={isAdding}
        onAdd={handleCreateClick}
      />
      <p style={{ margin: '-0.35rem 0 1.35rem', fontSize: '0.88rem', fontWeight: 600 }}>
        <Link
          href={meta.publicPath}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(44, 80, 74, 0.35)',
          }}
        >
          Open public page →
        </Link>
      </p>

      <AdminErrorBanner message={error} />

      {isAdding && (
        <AdminEditorCard title={editing ? 'Edit card' : 'New card'}>
          <form onSubmit={handleSubmit}>
            <div className={`form-group ${title ? 'has-value' : ''}`} style={{ marginBottom: '1.2rem' }}>
              <input type="text" id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
              <label htmlFor="title">Card title</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group form-group-textarea ${body ? 'has-value' : ''}`} style={{ marginBottom: '1.2rem' }}>
              <textarea id="body" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
              <label htmlFor="body">Description</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group ${imageUrl ? 'has-value' : ''}`} style={{ marginBottom: '1.2rem' }}>
              <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <label htmlFor="imageUrl">Image URL (optional — uses page default pattern if empty)</label>
              <div className="form-border"></div>
              <AdminImageUpload currentUrl={imageUrl} onUploadSuccess={(url) => setImageUrl(url)} label="Upload image" />
              <MediaLibraryPicker onSelect={(url) => setImageUrl(url)} buttonLabel="Choose from library" />
            </div>

            <div className={`form-group ${listLabel ? 'has-value' : ''}`} style={{ marginBottom: '1.2rem' }}>
              <input type="text" id="listLabel" value={listLabel} onChange={(e) => setListLabel(e.target.value)} />
              <label htmlFor="listLabel">Bullet list label (optional, e.g. “Use cases:”)</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group form-group-textarea ${listItems ? 'has-value' : ''}`} style={{ marginBottom: '1.2rem' }}>
              <textarea
                id="listItems"
                rows={6}
                value={listItems}
                onChange={(e) => setListItems(e.target.value)}
                placeholder="One bullet per line (optional)"
              />
              <label htmlFor="listItems">Bullet list items</label>
              <div className="form-border"></div>
            </div>

            <div className="form-row-split" style={{ marginBottom: '2rem' }}>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  style={{ width: '1.1rem', height: '1.1rem' }}
                />
                <label htmlFor="published" style={{ position: 'static', transform: 'none', fontWeight: 600 }}>
                  Published (visible on the site)
                </label>
              </div>
              <div className={`form-group ${orderIndex ? 'has-value' : ''}`}>
                <input type="number" id="orderIndex" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} />
                <label htmlFor="orderIndex">Sort order (lower first)</label>
                <div className="form-border"></div>
              </div>
            </div>

            <AdminFormActions onCancel={handleCancel} submitLabel={editing ? 'Save changes' : 'Add card'} />
          </form>
        </AdminEditorCard>
      )}

      {!isAdding && (
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            overflowX: 'auto',
            boxShadow: 'var(--shadow-sm)',
            maxHeight: '72vh',
          }}
        >
          <table style={{ width: '100%', minWidth: '880px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ ...adminThStyle, width: '72px', textAlign: 'center' }}>Order</th>
                <th style={{ ...adminThStyle, width: '100px' }}>Image</th>
                <th style={adminThStyle}>Card</th>
                <th style={{ ...adminThStyle, width: '100px' }}>Status</th>
                <th style={{ ...adminThStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPreview.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    No cards yet. Add one, or run a fresh database seed to load defaults.
                  </td>
                </tr>
              ) : (
                sortedPreview.map((card) => (
                  <tr key={card.id} style={{ borderBottom: '1px solid var(--color-border)', background: '#fff' }}>
                    <td
                      style={{
                        padding: '1rem 1.2rem',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        color: 'var(--color-text-muted)',
                        fontWeight: 600,
                      }}
                    >
                      {card.order_index}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', verticalAlign: 'middle' }}>
                      {card.image_url ? (
                        <img
                          src={card.image_url}
                          alt=""
                          style={{
                            width: '88px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            background: 'var(--color-bg-alt)',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Default</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-dark-blue)', marginBottom: '0.25rem' }}>{card.title}</div>
                      {card.body ? (
                        <div
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--color-text-muted)',
                            maxWidth: '520px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {card.body}
                        </div>
                      ) : null}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', verticalAlign: 'middle', fontWeight: 600, fontSize: '0.85rem' }}>
                      {card.published ? (
                        <span style={{ color: '#115e59' }}>Live</span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>Hidden</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleEditClick(card)}
                        style={{ ...adminActionBtnStyle, color: 'var(--color-primary)' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(card.id)}
                        style={{
                          ...adminActionBtnStyle,
                          color: '#B91C1C',
                          borderColor: 'rgba(185,28,28,0.25)',
                          background: 'rgba(185,28,28,0.04)',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
