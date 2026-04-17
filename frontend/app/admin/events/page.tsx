'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import AdminImageUpload from '../../../components/AdminImageUpload';
import AdminUrlLink from '../../../components/AdminUrlLink';
import MediaLibraryPicker from '../../../components/MediaLibraryPicker';
import { AdminEditorCard, AdminFormActions } from '@/components/admin/AdminFormUi';
import { AdminErrorBanner, AdminLoadingState, AdminPageHeader } from '@/components/admin/AdminPageUi';
import { adminActionBtnStyle, adminThStyle } from '@/lib/adminTableStyles';
import { useAdminCrudResource } from '@/hooks/useAdminCrudResource';
import type { EventItem, EventPayload } from '@/types/adminEntities';

export default function AdminEvents() {
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const {
    items: events,
    loading,
    error,
    deleteItem,
    saveItem,
  } = useAdminCrudResource<EventItem, EventPayload>('/api/events', {
    loadError: 'Could not load events.',
    connectError: 'Could not connect to the server.',
    deleteError: 'Could not delete this event.',
    saveError: 'Could not save changes.',
  });

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagline, setTagline] = useState('');
  const [body, setBody] = useState('');
  const [features, setFeatures] = useState('');
  const [audience, setAudience] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState('');

  const handleEditClick = (ev: EventItem) => {
    setEditingEvent(ev);
    setIsAdding(true);
    setTitle(ev.title);
    setDescription(ev.description || '');
    setTagline(ev.tagline || '');
    setBody(ev.body || '');
    setFeatures(ev.features || '');
    setAudience(ev.audience || '');
    setImageUrl(ev.image_url || '');
    setLinkUrl(ev.link_url || '');
    setOrderIndex(ev.order_index?.toString() || '0');
  };

  const handleCreateClick = () => {
    setEditingEvent(null);
    setIsAdding(true);
    setTitle('');
    setDescription('');
    setTagline('');
    setBody('');
    setFeatures('');
    setAudience('');
    setImageUrl('');
    setLinkUrl('');
    setOrderIndex('0');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingEvent(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const err = await deleteItem(id);
    if (err) alert(err);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: EventPayload = {
      title,
      description,
      tagline,
      body,
      features,
      audience,
      image_url: imageUrl,
      link_url: linkUrl,
      order_index: parseInt(orderIndex || '0')
    };

    const err = await saveItem(data, editingEvent?.id);
    if (err) {
      alert(err);
      return;
    }
    handleCancel();
  };

  if (loading && events.length === 0) return <AdminLoadingState />;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <AdminPageHeader
        title="Events"
        subtitle="Edit events shown on the Signature Events page."
        addLabel="Add event"
        isAdding={isAdding}
        onAdd={handleCreateClick}
      />

      {isAdding && (
        <AdminEditorCard title={editingEvent ? 'Edit event' : 'New event'}>
          <form onSubmit={handleSubmit}>
            <div className="form-row-split" style={{ marginBottom: '1.5rem' }}>
              <div className={`form-group ${title ? 'has-value' : ''}`}>
                <input type="text" id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
                <label htmlFor="title">Event Title</label>
                <div className="form-border"></div>
              </div>
              <div className={`form-group ${linkUrl ? 'has-value' : ''}`}>
                <input type="text" id="linkUrl" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
                <label htmlFor="linkUrl">Link (optional)</label>
                <div className="form-border"></div>
              </div>
            </div>

            <div className={`form-group form-group-textarea ${description ? 'has-value' : ''}`} style={{ marginBottom: '1.2rem' }}>
              <textarea id="description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              <label htmlFor="description">Homepage Summary (optional)</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group ${tagline ? 'has-value' : ''}`} style={{ marginBottom: '1.2rem' }}>
              <input type="text" id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
              <label htmlFor="tagline">Tagline (Signature events page)</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group form-group-textarea ${body ? 'has-value' : ''}`} style={{ marginBottom: '1.2rem' }}>
              <textarea id="body" rows={3} value={body} onChange={(e) => setBody(e.target.value)}></textarea>
              <label htmlFor="body">Body (Signature events page)</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group ${features ? 'has-value' : ''}`} style={{ marginBottom: '1.2rem' }}>
              <input type="text" id="features" value={features} onChange={(e) => setFeatures(e.target.value)} />
              <label htmlFor="features">Features (optional)</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group ${audience ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <input type="text" id="audience" value={audience} onChange={(e) => setAudience(e.target.value)} />
              <label htmlFor="audience">Audience (optional)</label>
              <div className="form-border"></div>
            </div>

            <div className="form-row-split" style={{ marginBottom: '2.5rem' }}>
              <div className={`form-group ${imageUrl ? 'has-value' : ''}`}>
                <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                <label htmlFor="imageUrl">Image URL</label>
                <div className="form-border"></div>
                <AdminImageUpload 
                  currentUrl={imageUrl} 
                  onUploadSuccess={(url) => setImageUrl(url)} 
                  label="Upload image"
                />
                <MediaLibraryPicker onSelect={(url) => setImageUrl(url)} buttonLabel="Choose image from library" />
              </div>
              <div className={`form-group ${orderIndex ? 'has-value' : ''}`}>
                <input type="number" id="orderIndex" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} />
                <label htmlFor="orderIndex">Sort order</label>
                <div className="form-border"></div>
              </div>
            </div>

            <AdminFormActions
              onCancel={handleCancel}
              submitLabel={editingEvent ? 'Save changes' : 'Add event'}
            />
          </form>
        </AdminEditorCard>
      )}

      <AdminErrorBanner message={error} />

      {!isAdding && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--color-border)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)', maxHeight: '70vh' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ ...adminThStyle, width: '80px', textAlign: 'center' }}>Order</th>
                <th style={adminThStyle}>Image</th>
                <th style={adminThStyle}>Event</th>
                <th style={{ ...adminThStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>No events yet. Add one to get started.</td></tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid var(--color-border)', background: '#fff' }}>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {ev.order_index}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ width: '120px', height: '60px', background: 'var(--color-bg-alt)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0.5rem' }}>
                        {ev.image_url ? (
                          <Image
                            src={ev.image_url}
                            alt={ev.title}
                            width={110}
                            height={55}
                            unoptimized
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>No Image</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)', marginBottom: '4px', fontSize: '1.1rem' }}>{ev.title}</div>
                      {(ev.tagline || ev.description) && (
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px', maxWidth: '460px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ev.tagline || ev.description}
                        </div>
                      )}
                      {ev.link_url && <AdminUrlLink href={ev.link_url}>Open link</AdminUrlLink>}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleEditClick(ev)}
                        style={{ ...adminActionBtnStyle, color: 'var(--color-primary)' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(ev.id)}
                        style={{ ...adminActionBtnStyle, color: '#B91C1C', borderColor: 'rgba(185,28,28,0.25)', background: 'rgba(185,28,28,0.04)' }}
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
