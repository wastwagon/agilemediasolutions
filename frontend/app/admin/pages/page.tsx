'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import MediaLibraryPicker from '../../../components/MediaLibraryPicker';
import AdminImageUpload from '../../../components/AdminImageUpload';
import {
  coerceBlockSectionAnchor,
  isBlockAnchorInputInvalid,
  preparePageBlockAnchorsForSave,
} from '@/lib/blockSectionAnchor';

type PageBlock =
  | { id: string; anchorId?: string; type: 'text'; heading?: string; body?: string }
  | { id: string; anchorId?: string; type: 'image'; url?: string; alt?: string; caption?: string }
  | { id: string; anchorId?: string; type: 'cta'; label?: string; href?: string; variant?: 'primary' | 'outline' };

type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
};

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function AdminPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPage, setEditingPage] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [publishedAt, setPublishedAt] = useState('');
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState('');
  const thStyle: React.CSSProperties = { position: 'sticky', top: 0, zIndex: 1, padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--color-bg-alt)' };
  const actionBtnStyle: React.CSSProperties = { background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', borderRadius: 7, cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700, lineHeight: 1.2, padding: '0.3rem 0.5rem', marginLeft: '0.45rem' };
  const compactOutlineBtnStyle: React.CSSProperties = { border: 'none', fontSize: '0.74rem', padding: '0.3rem 0.48rem', borderRadius: 8, lineHeight: 1.2 };
  const compactPrimaryBtnStyle: React.CSSProperties = { fontSize: '0.78rem', padding: '0.36rem 0.62rem', borderRadius: 9, lineHeight: 1.2 };

  const isHome = useMemo(() => slug === 'home', [slug]);

  const hasInvalidAnchors = useMemo(
    () => blocks.some((b) => isBlockAnchorInputInvalid(b.anchorId)),
    [blocks]
  );

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/pages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      } else {
        setError('Could not load pages.');
      }
    } catch (err) {
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Could not delete this page.');
      }
    } catch (err) {
      alert('Something went wrong while deleting.');
    }
  };

  const handleEdit = async (pageSlug: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/pages/${pageSlug}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEditingPage(data);
        setIsAdding(true);
        setSlug(data.slug);
        setTitle(data.title);
        setDescription(data.description || '');
        setStatus((data.status || 'draft') === 'published' ? 'published' : 'draft');
        setPublishedAt(data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : '');
        const cj = data.content_json || {};
        const cjBlocks = Array.isArray(cj.blocks) ? cj.blocks : [];
        const normalizedBlocks: PageBlock[] = cjBlocks.map((b: any) => {
          const rawAnchor = typeof b.anchorId === 'string' ? b.anchorId.trim() : '';
          const anchorId = rawAnchor ? coerceBlockSectionAnchor(rawAnchor) ?? rawAnchor : undefined;
          return {
            ...b,
            id: b.id || uid(),
            type: b.type,
            anchorId,
          };
        });
        setBlocks(normalizedBlocks);

        const hs = Array.isArray(cj.hero_slides) ? cj.hero_slides : [];
        const normalizedSlides: HeroSlide[] = hs.map((s: any) => ({
          id: s.id || uid(),
          title: (s.title || '').toString(),
          subtitle: (s.subtitle || '').toString(),
        }));
        setHeroSlides(normalizedSlides);
      }
    } catch (err) {
      alert('Could not load this page.');
    }
  };

  const handleCreateClick = () => {
    setEditingPage(null);
    setIsAdding(true);
    setSlug('');
    setTitle('');
    setDescription('');
    setStatus('draft');
    setPublishedAt('');
    setBlocks([]);
    setHeroSlides([
      {
        id: uid(),
        title: 'Powering Narratives. Elevating Voices. Driving Impact.',
        subtitle:
          'Agile Media Solutions is an international media, PR, and communications firm helping governments, institutions, brands, and movements shape the messages that move nations, markets, and minds.',
      },
    ]);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingPage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hasInvalidAnchors) {
      const first = blocks.find((x) => isBlockAnchorInputInvalid(x.anchorId));
      const el = first
        ? (document.getElementById(`page-block-anchor-input-${first.id}`) as HTMLInputElement | null)
        : null;
      if (el) {
        el.focus({ preventScroll: true });
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        document.getElementById('page-builder-anchor-errors')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    const data = {
      slug,
      title,
      description,
      status,
      published_at: status === 'published' ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()) : null,
      content_json: {
        blocks: preparePageBlockAnchorsForSave(blocks),
        ...(isHome ? { hero_slides: heroSlides.map((s) => ({ title: s.title, subtitle: s.subtitle })) } : {}),
      }
    };

    const token = localStorage.getItem('admin_token');
    const url = editingPage ? `/api/pages/${editingPage.slug}` : '/api/pages';
    const method = editingPage ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        handleCancel();
        fetchData();
      } else {
        const errData = await res.json();
        alert('Could not save: ' + (errData.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Something went wrong while saving.');
    }
  };

  if (loading && pages.length === 0) return <div className="admin-loading" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading…</div>;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>Pages</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Friendly page builder with blocks, image uploads, and hero slide management.</p>
        </div>
        {!isAdding && (
          <button onClick={handleCreateClick} className="btn btn-primary" style={compactPrimaryBtnStyle}>
            Add page
          </button>
        )}
      </div>

      {isAdding && (
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '2rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-dark-blue)' }}>
            {editingPage ? 'Edit page' : 'New page'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row-split" style={{ marginBottom: '1.5rem' }}>
              <div className={`form-group ${title ? 'has-value' : ''}`}>
                <input type="text" id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
                <label htmlFor="title">Page title</label>
                <div className="form-border"></div>
              </div>
              <div className={`form-group ${slug ? 'has-value' : ''}`}>
                <input type="text" id="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} readOnly={!!editingPage} />
                <label htmlFor="slug">URL slug (e.g. about)</label>
                <div className="form-border"></div>
              </div>
            </div>
            <div className="form-row-split" style={{ marginBottom: '1.2rem' }}>
              <div className={`form-group ${status ? 'has-value' : ''}`}>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                  style={{ width: '100%', padding: '0.8rem 0.65rem', border: '1px solid var(--color-border)', borderRadius: 8, background: '#fff' }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <label htmlFor="status" style={{ top: '-0.65rem', fontSize: '0.7rem' }}>Status</label>
                <div className="form-border"></div>
              </div>
              <div className={`form-group ${publishedAt ? 'has-value' : ''}`}>
                <input
                  type="datetime-local"
                  id="publishedAt"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  disabled={status !== 'published'}
                />
                <label htmlFor="publishedAt">Published at</label>
                <div className="form-border"></div>
              </div>
            </div>
            {slug && slug !== 'home' && (
              <div style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
                <Link
                  href={`/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ ...compactOutlineBtnStyle, textDecoration: 'none', opacity: status === 'published' ? 1 : 0.55, pointerEvents: status === 'published' ? 'auto' : 'none' }}
                  title={status === 'published' ? 'Open public page' : 'Only published pages are public'}
                >
                  Preview page
                </Link>
              </div>
            )}

            <div className={`form-group form-group-textarea ${description ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <textarea id="description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              <label htmlFor="description">Meta description</label>
              <div className="form-border"></div>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              {hasInvalidAnchors ? (
                <div
                  id="page-builder-anchor-errors"
                  role="alert"
                  style={{
                    marginBottom: '1rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 12,
                    border: '1px solid rgba(185,28,28,0.35)',
                    background: 'rgba(185,28,28,0.06)',
                    color: '#991B1B',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                  }}
                >
                  Fix or clear invalid section anchors in the blocks below before saving. Blur each anchor field to auto-format, or
                  empty the field to remove the anchor.
                </div>
              ) : null}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--color-dark-blue)' }}>Page content</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Add sections below. No JSON required.</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-outline" style={compactOutlineBtnStyle} onClick={() => setBlocks((prev) => [...prev, { id: uid(), type: 'text', heading: '', body: '' }])}>
                    + Text
                  </button>
                  <button type="button" className="btn btn-outline" style={compactOutlineBtnStyle} onClick={() => setBlocks((prev) => [...prev, { id: uid(), type: 'image', url: '', alt: '', caption: '' }])}>
                    + Image
                  </button>
                  <button type="button" className="btn btn-outline" style={compactOutlineBtnStyle} onClick={() => setBlocks((prev) => [...prev, { id: uid(), type: 'cta', label: '', href: '', variant: 'primary' }])}>
                    + Button
                  </button>
                </div>
              </div>

              {isHome && (
                <div style={{ border: '1px solid var(--color-border)', borderRadius: 14, padding: '1rem', background: 'var(--color-bg-alt)', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--color-dark-blue)', marginBottom: '0.5rem' }}>Home hero slides</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    This controls the homepage hero text rotation.
                  </div>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {heroSlides.map((s, idx) => (
                      <div key={s.id} style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 12, padding: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                          <div style={{ fontWeight: 800, color: 'var(--color-dark-blue)' }}>Slide {idx + 1}</div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              className="btn btn-outline"
                              style={compactOutlineBtnStyle}
                              onClick={() => idx > 0 && setHeroSlides((prev) => {
                                const next = [...prev];
                                [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                                return next;
                              })}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline"
                              style={compactOutlineBtnStyle}
                              onClick={() => idx < heroSlides.length - 1 && setHeroSlides((prev) => {
                                const next = [...prev];
                                [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                                return next;
                              })}
                            >
                              ↓
                            </button>
                            <button type="button" className="btn btn-outline" style={{ ...compactOutlineBtnStyle, color: '#B91C1C' }} onClick={() => setHeroSlides((prev) => prev.filter((x) => x.id !== s.id))}>
                              Delete
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                          <div className={`form-group ${s.title ? 'has-value' : ''}`}>
                            <input
                              type="text"
                              value={s.title}
                              onChange={(e) =>
                                setHeroSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)))
                              }
                            />
                            <label>Title</label>
                            <div className="form-border"></div>
                          </div>
                          <div className={`form-group form-group-textarea ${s.subtitle ? 'has-value' : ''}`}>
                            <textarea
                              rows={2}
                              value={s.subtitle}
                              onChange={(e) =>
                                setHeroSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, subtitle: e.target.value } : x)))
                              }
                            ></textarea>
                            <label>Subtitle</label>
                            <div className="form-border"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <button type="button" className="btn btn-outline" style={compactOutlineBtnStyle} onClick={() => setHeroSlides((prev) => [...prev, { id: uid(), title: '', subtitle: '' }])}>
                      + Add slide
                    </button>
                  </div>
                </div>
              )}

              {blocks.length === 0 ? (
                <div style={{ padding: '1.25rem', border: '1px dashed var(--color-border)', borderRadius: 14, color: 'var(--color-text-muted)' }}>
                  No blocks yet. Add Text, Image, or Button.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {blocks.map((b, idx) => {
                    const anchorInvalid = isBlockAnchorInputInvalid(b.anchorId);
                    return (
                    <div
                      key={b.id}
                      style={{
                        border: anchorInvalid
                          ? '1px solid rgba(185, 28, 28, 0.42)'
                          : '1px solid var(--color-border)',
                        borderRadius: 14,
                        padding: '1rem',
                        background: anchorInvalid ? 'rgba(185, 28, 28, 0.03)' : '#fff',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <div style={{ fontWeight: 800, color: 'var(--color-dark-blue)' }}>
                          {b.type === 'text' ? 'Text' : b.type === 'image' ? 'Image' : 'Button'} block
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="button" className="btn btn-outline" style={compactOutlineBtnStyle} onClick={() => idx > 0 && setBlocks((prev) => {
                            const next = [...prev];
                            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                            return next;
                          })}>↑</button>
                          <button type="button" className="btn btn-outline" style={compactOutlineBtnStyle} onClick={() => idx < blocks.length - 1 && setBlocks((prev) => {
                            const next = [...prev];
                            [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                            return next;
                          })}>↓</button>
                          <button type="button" className="btn btn-outline" style={{ ...compactOutlineBtnStyle, color: '#B91C1C' }} onClick={() => setBlocks((prev) => prev.filter((x) => x.id !== b.id))}>
                            Delete
                          </button>
                        </div>
                      </div>

                      <div
                        className={`form-group ${(b.anchorId || '') ? 'has-value' : ''}`}
                        style={{ marginBottom: '0.75rem' }}
                      >
                        <input
                          id={`page-block-anchor-input-${b.id}`}
                          type="text"
                          value={b.anchorId || ''}
                          aria-invalid={anchorInvalid}
                          aria-describedby={anchorInvalid ? `page-block-anchor-hint-${b.id}` : undefined}
                          onChange={(e) =>
                            setBlocks((prev) =>
                              prev.map((x) => (x.id === b.id ? { ...x, anchorId: e.target.value } : x))
                            )
                          }
                          onBlur={() => {
                            const v = (b.anchorId || '').trim();
                            if (!v) {
                              setBlocks((prev) =>
                                prev.map((x) => (x.id === b.id ? { ...x, anchorId: undefined } : x))
                              );
                              return;
                            }
                            const c = coerceBlockSectionAnchor(v);
                            setBlocks((prev) =>
                              prev.map((x) => (x.id === b.id ? { ...x, anchorId: c ?? undefined } : x))
                            );
                          }}
                          placeholder="e.g. pricing"
                        />
                        <label>Section anchor (optional)</label>
                        <div className="form-border"></div>
                        {anchorInvalid ? (
                          <div
                            id={`page-block-anchor-hint-${b.id}`}
                            role="alert"
                            style={{
                              fontSize: '0.78rem',
                              color: '#B91C1C',
                              marginTop: '0.35rem',
                              fontWeight: 600,
                            }}
                          >
                            This value cannot be used as a link anchor. Use letters, numbers, hyphens, and underscores—or leave
                            blank. Blur the field to auto-fix, or clear it.
                          </div>
                        ) : null}
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--color-text-muted)',
                            marginTop: anchorInvalid ? '0.25rem' : '0.35rem',
                          }}
                        >
                          Spaces become hyphens; leading digits get an <code style={{ fontSize: '0.74rem' }}>id-</code> prefix.
                          Link: <code style={{ fontSize: '0.74rem' }}>/{slug || 'page'}#your-anchor</code>
                        </div>
                      </div>

                      {b.type === 'text' && (
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                          <div className={`form-group ${(b.heading || '') ? 'has-value' : ''}`}>
                            <input
                              type="text"
                              value={b.heading || ''}
                              onChange={(e) => setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, heading: e.target.value } : x)))}
                            />
                            <label>Heading (optional)</label>
                            <div className="form-border"></div>
                          </div>
                          <div className={`form-group form-group-textarea ${(b.body || '') ? 'has-value' : ''}`}>
                            <textarea
                              rows={3}
                              value={b.body || ''}
                              onChange={(e) => setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, body: e.target.value } : x)))}
                            ></textarea>
                            <label>Body</label>
                            <div className="form-border"></div>
                          </div>
                        </div>
                      )}

                      {b.type === 'image' && (
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                          <div className={`form-group ${(b.url || '') ? 'has-value' : ''}`}>
                            <input
                              type="text"
                              value={b.url || ''}
                              onChange={(e) => setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, url: e.target.value } : x)))}
                            />
                            <label>Image URL</label>
                            <div className="form-border"></div>
                            <AdminImageUpload
                              currentUrl={b.url || ''}
                              onUploadSuccess={(url) => setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, url } : x)))}
                              label="Upload image"
                            />
                            <MediaLibraryPicker onSelect={(url) => setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, url } : x)))} buttonLabel="Choose image from library" />
                          </div>
                          <div className={`form-group ${(b.alt || '') ? 'has-value' : ''}`}>
                            <input
                              type="text"
                              value={b.alt || ''}
                              onChange={(e) => setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, alt: e.target.value } : x)))}
                            />
                            <label>Alt text (optional)</label>
                            <div className="form-border"></div>
                          </div>
                          <div className={`form-group ${(b.caption || '') ? 'has-value' : ''}`}>
                            <input
                              type="text"
                              value={b.caption || ''}
                              onChange={(e) => setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, caption: e.target.value } : x)))}
                            />
                            <label>Caption (optional)</label>
                            <div className="form-border"></div>
                          </div>
                        </div>
                      )}

                      {b.type === 'cta' && (
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                          <div className={`form-group ${(b.label || '') ? 'has-value' : ''}`}>
                            <input
                              type="text"
                              value={b.label || ''}
                              onChange={(e) => setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, label: e.target.value } : x)))}
                            />
                            <label>Button label</label>
                            <div className="form-border"></div>
                          </div>
                          <div className={`form-group ${(b.href || '') ? 'has-value' : ''}`}>
                            <input
                              type="text"
                              value={b.href || ''}
                              onChange={(e) => setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, href: e.target.value } : x)))}
                            />
                            <label>Link URL (e.g. /contact#contact)</label>
                            <div className="form-border"></div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Style</span>
                            <button
                              type="button"
                              className={`btn ${b.variant === 'primary' ? 'btn-primary' : 'btn-outline'}`}
                              onClick={() => setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, variant: 'primary' } : x)))}
                            >
                              Primary
                            </button>
                            <button
                              type="button"
                              className={`btn ${b.variant === 'outline' ? 'btn-primary' : 'btn-outline'}`}
                              onClick={() => setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, variant: 'outline' } : x)))}
                            >
                              Outline
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                  })}
                </div>
              )}

              <div style={{ marginTop: '0.9rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Tip: For images, use Upload or choose from the Media Library so you can reuse assets site-wide. Use section anchors for in-page links—you cannot save while an anchor is invalid.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleCancel} className="btn btn-outline" style={compactOutlineBtnStyle}>Cancel</button>
              <button
                type="submit"
                className="btn btn-primary"
                style={compactPrimaryBtnStyle}
                disabled={hasInvalidAnchors}
                title={hasInvalidAnchors ? 'Fix or clear invalid section anchors first' : undefined}
              >
                {editingPage ? 'Save changes' : 'Add page'}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <div style={{ padding: '1rem', background: '#FEF2F2', color: '#B91C1C', borderRadius: '8px', marginBottom: '2rem' }}>{error}</div>}

      {!isAdding && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--color-border)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)', maxHeight: '70vh' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={thStyle}>Page</th>
                <th style={thStyle}>URL</th>
                <th style={thStyle}>Last updated</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>No pages yet. Add one to get started.</td></tr>
              ) : (
                pages.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', background: '#fff' }}>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)', marginBottom: '4px', fontSize: '1.1rem' }}>{p.title}</div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.15rem 0.5rem',
                            borderRadius: 999,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: p.status === 'published' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.16)',
                            color: p.status === 'published' ? '#166534' : '#92400E',
                          }}
                        >
                          {(p.status || 'draft').toUpperCase()}
                        </span>
                        {p.published_at && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            Published {new Date(p.published_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {p.description && <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description}</div>}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.6rem', background: 'var(--color-bg-alt)', color: 'var(--color-text)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'monospace' }}>
                        /{p.slug}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                      {new Date(p.updated_at || p.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      {p.slug !== 'home' && p.status === 'published' && (
                        <Link
                          href={`/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ ...actionBtnStyle, color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-block' }}
                        >
                          View
                        </Link>
                      )}
                      <button 
                        onClick={() => handleEdit(p.slug)}
                        style={{ ...actionBtnStyle, color: 'var(--color-primary)' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        style={{ ...actionBtnStyle, color: '#B91C1C', borderColor: 'rgba(185,28,28,0.25)', background: 'rgba(185,28,28,0.04)' }}
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
