'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AdminImageUpload from '../../../components/AdminImageUpload';
import MediaLibraryPicker from '../../../components/MediaLibraryPicker';
import { AdminEditorCard, AdminFormActions } from '@/components/admin/AdminFormUi';
import { AdminErrorBanner, AdminLoadingState, AdminPageHeader } from '@/components/admin/AdminPageUi';
import { adminActionBtnStyle, adminThStyle } from '@/lib/adminTableStyles';
import { useAdminCrudResource } from '@/hooks/useAdminCrudResource';
import type {
  InsightCategory,
  InsightCategoryPayload,
  InsightPost,
  InsightPostPayload,
} from '@/types/adminEntities';

export default function AdminInsightsPage() {
  const looksLikeImageUrl = (value?: string | null) => {
    if (!value) return false;
    const v = value.trim().toLowerCase();
    return v.startsWith('/uploads/') || v.startsWith('http://') || v.startsWith('https://') || v.startsWith('data:image/');
  };

  const [editing, setEditing] = useState<InsightPost | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const {
    items: posts,
    loading: postsLoading,
    error: postsError,
    deleteItem,
    saveItem,
  } = useAdminCrudResource<InsightPost, InsightPostPayload>('/api/insight-posts', {
    loadError: 'Could not load insight posts.',
    connectError: 'Could not connect to the server.',
    deleteError: 'Could not delete this post.',
    saveError: 'Could not save changes.',
  });

  const [editingCategory, setEditingCategory] = useState<InsightCategory | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const {
    items: categories,
    loading: categoriesLoading,
    error: categoriesError,
    deleteItem: deleteCategory,
    saveItem: saveCategory,
  } = useAdminCrudResource<InsightCategory, InsightCategoryPayload>('/api/insight-categories', {
    loadError: 'Could not load categories.',
    connectError: 'Could not connect to the server.',
    deleteError: 'Could not delete this category.',
    saveError: 'Could not save category.',
  });

  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [meta, setMeta] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mediaClass, setMediaClass] = useState('home-insights-media-briefing');
  const [published, setPublished] = useState(true);
  const [orderIndex, setOrderIndex] = useState('0');
  const [categoryId, setCategoryId] = useState('');

  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catOrderIndex, setCatOrderIndex] = useState('0');

  const handleEditClick = (post: InsightPost) => {
    setIsAddingCategory(false);
    setEditingCategory(null);
    setEditing(post);
    setIsAdding(true);
    setSlug(post.slug);
    setTitle(post.title);
    setMeta(post.meta || '');
    setExcerpt(post.excerpt || '');
    setBody(post.body || '');
    setImageUrl(post.image_url || '');
    setMediaClass(post.media_class || 'home-insights-media-briefing');
    setPublished(post.published !== false);
    setOrderIndex(post.order_index?.toString() || '0');
    setCategoryId(post.category_id != null ? String(post.category_id) : '');
  };

  const handleCreateClick = () => {
    setIsAddingCategory(false);
    setEditingCategory(null);
    setEditing(null);
    setIsAdding(true);
    setSlug('');
    setTitle('');
    setMeta('');
    setExcerpt('');
    setBody('');
    setImageUrl('');
    setMediaClass('home-insights-media-briefing');
    setPublished(true);
    setOrderIndex(String((posts[posts.length - 1]?.order_index ?? 0) + 1));
    setCategoryId('');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this insight post? It will disappear from the site.')) return;
    const err = await deleteItem(id);
    if (err) alert(err);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: InsightPostPayload = {
      slug,
      title,
      meta,
      excerpt,
      body,
      image_url: imageUrl,
      media_class: mediaClass,
      published,
      order_index: parseInt(orderIndex || '0', 10),
      category_id: categoryId === '' ? null : parseInt(categoryId, 10),
    };
    const err = await saveItem(data, editing?.id);
    if (err) {
      alert(err);
      return;
    }
    handleCancel();
  };

  const handleEditCategoryClick = (c: InsightCategory) => {
    setIsAdding(false);
    setEditing(null);
    setEditingCategory(c);
    setIsAddingCategory(true);
    setCatName(c.name);
    setCatSlug(c.slug);
    setCatOrderIndex(c.order_index?.toString() || '0');
  };

  const handleCreateCategoryClick = () => {
    setIsAdding(false);
    setEditing(null);
    setEditingCategory(null);
    setIsAddingCategory(true);
    setCatName('');
    setCatSlug('');
    setCatOrderIndex(String((categories[categories.length - 1]?.order_index ?? 0) + 1));
  };

  const handleCancelCategory = () => {
    setIsAddingCategory(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Delete this category? Posts using it will have the category cleared.')) return;
    const err = await deleteCategory(id);
    if (err) alert(err);
  };

  const handleSubmitCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: InsightCategoryPayload = {
      name: catName,
      slug: catSlug,
      order_index: parseInt(catOrderIndex || '0', 10),
    };
    const err = await saveCategory(data, editingCategory?.id);
    if (err) {
      alert(err);
      return;
    }
    handleCancelCategory();
  };

  if (postsLoading && posts.length === 0) return <AdminLoadingState />;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <AdminPageHeader
        title="Insights & blog"
        subtitle="Manage categories first, then assign a category on each post. Categories control grouping; the kicker line is optional extra detail."
        addLabel="Add insight post"
        isAdding={isAdding}
        onAdd={handleCreateClick}
      />
      <p style={{ margin: '-0.35rem 0 1.35rem', fontSize: '0.88rem', fontWeight: 600 }}>
        <Link
          href="/insights"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-primary)', textDecoration: 'none', borderBottom: '1px solid rgba(44, 80, 74, 0.35)' }}
        >
          Open public Insights page →
        </Link>
      </p>

      <AdminErrorBanner message={categoriesError} />
      <AdminErrorBanner message={postsError} />

      {isAddingCategory ? (
        <AdminEditorCard title={editingCategory ? 'Edit category' : 'New category'}>
          <form onSubmit={handleSubmitCategory}>
            <div className={`form-group ${catName ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <input type="text" id="catName" required value={catName} onChange={(e) => setCatName(e.target.value)} />
              <label htmlFor="catName">Display name</label>
              <div className="form-border"></div>
            </div>
            <div className={`form-group ${catSlug ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                id="catSlug"
                required
                value={catSlug}
                onChange={(e) =>
                  setCatSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/_/g, '-')
                      .replace(/[^a-z0-9-]/g, '')
                  )
                }
              />
              <label htmlFor="catSlug">URL slug (internal id)</label>
              <div className="form-border"></div>
            </div>
            <div className={`form-group ${catOrderIndex ? 'has-value' : ''}`} style={{ marginBottom: '2rem' }}>
              <input type="number" id="catOrderIndex" value={catOrderIndex} onChange={(e) => setCatOrderIndex(e.target.value)} />
              <label htmlFor="catOrderIndex">Sort order</label>
              <div className="form-border"></div>
            </div>
            <AdminFormActions onCancel={handleCancelCategory} submitLabel={editingCategory ? 'Save category' : 'Add category'} />
          </form>
        </AdminEditorCard>
      ) : (
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            overflowX: 'auto',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.75rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.2rem',
              borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-bg-alt)',
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Insight categories</h2>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Used in the post editor dropdown. Deleting a category removes it from posts automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateCategoryClick}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid rgba(44, 80, 74, 0.35)',
                background: 'rgba(44, 80, 74, 0.08)',
                color: '#115e59',
                cursor: 'pointer',
              }}
            >
              Add category
            </button>
          </div>
          <table style={{ width: '100%', minWidth: '520px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ ...adminThStyle, width: '72px', textAlign: 'center' }}>Order</th>
                <th style={adminThStyle}>Name</th>
                <th style={adminThStyle}>Slug</th>
                <th style={{ ...adminThStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoriesLoading && categories.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Loading categories…
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    No categories yet. Add one so you can tag posts.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)', background: '#fff' }}>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {c.order_index}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '1rem 1.2rem', fontSize: '0.85rem', color: 'var(--color-primary)' }}>{c.slug}</td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleEditCategoryClick(c)}
                        style={{ ...adminActionBtnStyle, color: 'var(--color-primary)' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c.id)}
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

      {isAdding && (
        <AdminEditorCard title={editing ? 'Edit insight post' : 'New insight post'}>
          <form onSubmit={handleSubmit}>
            <div className={`form-group ${slug ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                id="slug"
                required
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/_/g, '-')
                      .replace(/[^a-z0-9-]/g, '')
                  )
                }
                placeholder="e.g. q1-trade-briefing"
              />
              <label htmlFor="slug">URL slug</label>
              <div className="form-border"></div>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Lowercase, hyphens only. Public URL: /insights/your-slug
              </p>
            </div>

            <div className={`form-group ${title ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <input type="text" id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
              <label htmlFor="title">Title</label>
              <div className="form-border"></div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="categoryId" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--color-text-muted)' }}>
                Category
              </label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '28rem',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.95rem',
                  background: '#fff',
                }}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p style={{ margin: '0.45rem 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Choose from categories you added above. Shown on cards together with the kicker line.
              </p>
            </div>

            <div className={`form-group ${meta ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <input type="text" id="meta" value={meta} onChange={(e) => setMeta(e.target.value)} />
              <label htmlFor="meta">Kicker / meta line (optional, e.g. Press briefing · Q1 2026)</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group form-group-textarea ${excerpt ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <textarea id="excerpt" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
              <label htmlFor="excerpt">Excerpt (cards & SEO)</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group form-group-textarea ${body ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <textarea
                id="body"
                rows={14}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Full article. Separate paragraphs with a blank line."
              />
              <label htmlFor="body">Full body</label>
              <div className="form-border"></div>
            </div>

            <div className="form-row-split" style={{ marginBottom: '1.5rem' }}>
              <div className={`form-group ${imageUrl ? 'has-value' : ''}`}>
                <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                <label htmlFor="imageUrl">Cover image URL (optional)</label>
                <div className="form-border"></div>
                <AdminImageUpload currentUrl={imageUrl} onUploadSuccess={(url) => setImageUrl(url)} label="Upload cover" />
                <MediaLibraryPicker onSelect={(url) => setImageUrl(url)} buttonLabel="Choose from library" />
              </div>
              <div className={`form-group ${mediaClass ? 'has-value' : ''}`}>
                <input type="text" id="mediaClass" value={mediaClass} onChange={(e) => setMediaClass(e.target.value)} />
                <label htmlFor="mediaClass">Placeholder style if no image</label>
                <div className="form-border"></div>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  home-insights-media-briefing, home-insights-media-editorial, or home-insights-media-syndication
                </p>
              </div>
            </div>

            <div className="form-row-split" style={{ marginBottom: '2.5rem' }}>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  style={{ width: '1.1rem', height: '1.1rem' }}
                />
                <label htmlFor="published" style={{ position: 'static', transform: 'none', fontWeight: 600 }}>
                  Published (visible on the public site)
                </label>
              </div>
              <div className={`form-group ${orderIndex ? 'has-value' : ''}`}>
                <input type="number" id="orderIndex" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} />
                <label htmlFor="orderIndex">Sort order (lower first)</label>
                <div className="form-border"></div>
              </div>
            </div>

            <AdminFormActions onCancel={handleCancel} submitLabel={editing ? 'Save changes' : 'Publish post'} />
          </form>
        </AdminEditorCard>
      )}

      {!isAdding && !isAddingCategory && (
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            overflowX: 'auto',
            boxShadow: 'var(--shadow-sm)',
            maxHeight: '70vh',
          }}
        >
          <table style={{ width: '100%', minWidth: '960px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ ...adminThStyle, width: '72px', textAlign: 'center' }}>Order</th>
                <th style={adminThStyle}>Cover</th>
                <th style={adminThStyle}>Post</th>
                <th style={{ ...adminThStyle, width: '140px' }}>Category</th>
                <th style={{ ...adminThStyle, width: '100px' }}>Status</th>
                <th style={{ ...adminThStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    No posts yet. Add one to appear on the homepage and /insights.
                  </td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', background: '#fff' }}>
                    <td
                      style={{
                        padding: '1.5rem 1.2rem',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        color: 'var(--color-text-muted)',
                        fontWeight: 600,
                      }}
                    >
                      {p.order_index}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div
                        style={{
                          width: '120px',
                          height: '60px',
                          background: 'var(--color-bg-alt)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          padding: '0.5rem',
                        }}
                      >
                        {looksLikeImageUrl(p.image_url) ? (
                          <Image
                            src={p.image_url as string}
                            alt={p.title}
                            width={110}
                            height={55}
                            unoptimized
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Gradient</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)', marginBottom: '4px', fontSize: '1.05rem' }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600 }}>/{p.slug}</div>
                      {p.excerpt ? (
                        <div
                          style={{
                            fontSize: '0.88rem',
                            color: 'var(--color-text-muted)',
                            maxWidth: '480px',
                            marginTop: '0.35rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {p.excerpt}
                        </div>
                      ) : null}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', fontSize: '0.88rem', fontWeight: 600 }}>
                      {p.category?.name ?? '—'}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: p.published ? 'rgba(44, 80, 74, 0.12)' : 'rgba(185, 28, 28, 0.08)',
                          color: p.published ? '#166534' : '#B91C1C',
                        }}
                      >
                        {p.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      {p.published ? (
                        <Link
                          href={`/insights/${encodeURIComponent(p.slug)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            ...adminActionBtnStyle,
                            color: '#0f766e',
                            textDecoration: 'none',
                            display: 'inline-block',
                            marginRight: '0.35rem',
                          }}
                        >
                          View
                        </Link>
                      ) : (
                        <span
                          title="Publish this post to make it visible on the public site"
                          style={{
                            ...adminActionBtnStyle,
                            color: 'var(--color-text-muted)',
                            cursor: 'default',
                            opacity: 0.75,
                            marginRight: '0.35rem',
                          }}
                        >
                          View
                        </span>
                      )}
                      <button type="button" onClick={() => handleEditClick(p)} style={{ ...adminActionBtnStyle, color: 'var(--color-primary)' }}>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
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
