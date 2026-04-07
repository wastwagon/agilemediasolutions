'use client';

import React, { useEffect, useRef, useState } from 'react';
import { adminAuthHeaders, adminFetch, handleAdminSessionExpired, parseApiError } from '@/lib/adminApi';
import {
  ADMIN_MAX_UPLOAD_BYTES,
  ADMIN_MAX_VIDEO_UPLOAD_BYTES,
  uploadAdminImage,
  uploadAdminVideo,
  validateAdminImageFile,
  validateAdminVideoFile,
} from '@/lib/adminUpload';
import { AdminNotice, type AdminNoticeTone } from '@/components/admin/AdminNotice';

type MediaAsset = {
  id: number;
  url: string;
  filename: string;
  original_name?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  alt_text?: string | null;
  created_at: string;
};

function formatBytes(bytes?: number | null) {
  if (!bytes || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let idx = 0;
  let val = bytes;
  while (val >= 1024 && idx < units.length - 1) {
    val /= 1024;
    idx += 1;
  }
  return `${val.toFixed(val >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`;
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<{ tone: AdminNoticeTone; message: string } | null>(null);
  const [altDrafts, setAltDrafts] = useState<Record<number, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const compactPrimaryBtnStyle: React.CSSProperties = { fontSize: '0.78rem', padding: '0.36rem 0.62rem', borderRadius: 9, lineHeight: 1.2 };
  const compactOutlineBtnStyle: React.CSSProperties = { border: 'none', fontSize: '0.74rem', padding: '0.3rem 0.48rem', borderRadius: 8, lineHeight: 1.2 };

  const fetchAssets = async (query?: string) => {
    setNotice(null);
    try {
      const qs = query?.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
      const res = await adminFetch(`/api/media${qs}`, {
        headers: adminAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error(await parseApiError(res, 'Could not load media.', { onAuthError: handleAdminSessionExpired }));
      }
      const data = await res.json();
      const items = Array.isArray(data) ? data : [];
      setAssets(items);
      const nextDrafts: Record<number, string> = {};
      items.forEach((a: MediaAsset) => {
        nextDrafts[a.id] = a.alt_text || '';
      });
      setAltDrafts(nextDrafts);
    } catch (e: any) {
      setNotice({ tone: 'error', message: e?.message || 'Could not load media.' });
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!notice) return;
    if (notice.tone === 'error') return;
    const timer = window.setTimeout(() => setNotice(null), 3600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const isVideoFile = (file: File) => {
    if (file.type.startsWith('video/')) return true;
    if (!file.type && /\.(mp4|webm)$/i.test(file.name)) return true;
    return false;
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    const video = isVideoFile(file);
    const validationError = video ? validateAdminVideoFile(file) : validateAdminImageFile(file);
    if (validationError) {
      setNotice({ tone: 'error', message: validationError });
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setUploading(true);
    setNotice(null);
    try {
      if (video) {
        await uploadAdminVideo(file);
      } else {
        await uploadAdminImage(file);
      }
      await fetchAssets(q);
      setNotice({ tone: 'success', message: video ? 'Video uploaded successfully.' : 'Image uploaded successfully.' });
    } catch (e: any) {
      setNotice({ tone: 'error', message: e?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this asset? This removes it from the library and deletes the file.')) return;
    setNotice(null);
    try {
      const res = await adminFetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: adminAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error(await parseApiError(res, 'Delete failed.', { onAuthError: handleAdminSessionExpired }));
      }
      setAssets((prev) => prev.filter((a) => a.id !== id));
      setNotice({ tone: 'success', message: 'Asset deleted.' });
    } catch (e: any) {
      setNotice({ tone: 'error', message: e?.message || 'Delete failed.' });
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setNotice({ tone: 'info', message: 'Asset URL copied to clipboard.' });
    } catch {
      setNotice({ tone: 'error', message: 'Could not copy URL. Please copy manually.' });
    }
  };

  const saveAltText = async (id: number) => {
    setNotice(null);
    try {
      const res = await adminFetch(`/api/media/${id}`, {
        method: 'PUT',
        headers: {
          ...adminAuthHeaders(true),
        },
        body: JSON.stringify({ alt_text: altDrafts[id] || '' }),
      });
      if (!res.ok) {
        throw new Error(await parseApiError(res, 'Could not save alt text.', { onAuthError: handleAdminSessionExpired }));
      }
      const updated = await res.json();
      setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, alt_text: updated.alt_text } : a)));
      setNotice({ tone: 'success', message: 'Alt text saved.' });
    } catch (e: any) {
      setNotice({ tone: 'error', message: e?.message || 'Could not save alt text.' });
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', margin: 0, color: '#0D213B' }}>Media library</h1>
          <p style={{ margin: '0.5rem 0 0', color: '#6B7280' }}>
            Upload images or hero videos (MP4/WebM). Reuse everywhere — copy URLs into Site Content, Brands, Events, and Pages.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search media…"
              style={{
                width: 260,
                maxWidth: '70vw',
                padding: '0.55rem 0.75rem',
                borderRadius: 10,
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                outline: 'none',
              }}
            />
            <button
              className="btn btn-outline"
              style={compactOutlineBtnStyle}
              onClick={() => {
                setLoading(true);
                fetchAssets(q);
              }}
            >
              Search
            </button>
          </div>

          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }}
              style={{ display: 'none' }}
            />
            <button
              className="btn btn-primary"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={compactPrimaryBtnStyle}
              title={`Images: JPG, PNG, WEBP, GIF (max ${Math.floor(ADMIN_MAX_UPLOAD_BYTES / (1024 * 1024))}MB). Videos: MP4, WebM (max ${Math.floor(ADMIN_MAX_VIDEO_UPLOAD_BYTES / (1024 * 1024))}MB).`}
            >
              {uploading ? 'Uploading…' : 'Upload media'}
            </button>
          </div>
        </div>
      </div>

      {notice ? (
        <AdminNotice
          tone={notice.tone}
          message={notice.message}
          onDismiss={() => setNotice(null)}
        />
      ) : null}

      <div style={{ marginTop: '1.25rem', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(229,231,235,0.75)', borderRadius: 16, padding: '1rem' }}>
        {loading ? (
          <p style={{ margin: 0, color: '#6B7280' }}>Loading…</p>
        ) : assets.length === 0 ? (
          <p style={{ margin: 0, color: '#6B7280' }}>No media yet. Upload an image or video to get started.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.9rem' }}>
            {assets.map((a) => {
              const isVideo =
                (a.mime_type || '').startsWith('video/') || /\.(mp4|webm)(\?|$)/i.test(a.url || '');
              return (
              <div
                key={a.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  overflow: 'hidden',
                  boxShadow: '0 10px 24px -18px rgba(13,33,59,0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ aspectRatio: '4 / 3', background: '#111827' }}>
                  {isVideo ? (
                    <video
                      src={a.url}
                      muted
                      playsInline
                      preload="metadata"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <img src={a.url} alt={a.alt_text || a.original_name || a.filename} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  )}
                </div>
                <div style={{ padding: '0.75rem 0.75rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#111827',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.25,
                      minHeight: '2.05em',
                    }}
                    title={a.original_name || a.filename}
                  >
                    {a.original_name || a.filename}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#6B7280', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={a.mime_type || (isVideo ? 'video' : 'image')}>
                      {a.mime_type || (isVideo ? 'video' : 'image')}
                    </span>
                    <span>{formatBytes(a.size_bytes)}</span>
                  </div>
                  <div style={{ marginTop: '0.3rem', display: 'flex', gap: '0.45rem' }}>
                    <input
                      type="text"
                      value={altDrafts[a.id] || ''}
                      onChange={(e) => setAltDrafts((prev) => ({ ...prev, [a.id]: e.target.value }))}
                      placeholder="Alt text"
                      style={{
                        flex: 1,
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        padding: '0.35rem 0.5rem',
                        fontSize: '0.72rem',
                      }}
                    />
                    <button
                      className="btn btn-outline"
                      onClick={() => saveAltText(a.id)}
                      style={{ fontSize: '0.64rem', padding: '0.24rem 0.45rem', borderRadius: 8, minWidth: 44, lineHeight: 1.2 }}
                    >
                      Save
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                    <button
                      className="btn btn-outline"
                      onClick={() => copyUrl(a.url)}
                      style={{ flex: 1, fontSize: '0.68rem', padding: '0.3rem 0.42rem', borderRadius: 9, lineHeight: 1.2 }}
                    >
                      Copy URL
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => handleDelete(a.id)}
                      style={{
                        borderColor: 'rgba(239,68,68,0.35)',
                        color: '#B91C1C',
                        fontSize: '0.68rem',
                        padding: '0.3rem 0.42rem',
                        borderRadius: 9,
                        lineHeight: 1.2,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

