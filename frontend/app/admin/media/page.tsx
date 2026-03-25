'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);
  const [altDrafts, setAltDrafts] = useState<Record<number, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const token = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null), []);

  const fetchAssets = async (query?: string) => {
    setError(null);
    try {
      const qs = query?.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
      const res = await fetch(`/api/media${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Could not load media.');
      const data = await res.json();
      const items = Array.isArray(data) ? data : [];
      setAssets(items);
      const nextDrafts: Record<number, string> = {};
      items.forEach((a: MediaAsset) => {
        nextDrafts[a.id] = a.alt_text || '';
      });
      setAltDrafts(nextDrafts);
    } catch (e: any) {
      setError(e?.message || 'Could not load media.');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) throw new Error('Upload failed.');
      await fetchAssets(q);
    } catch (e: any) {
      setError(e?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this asset? This removes it from the library and deletes the file.')) return;
    setError(null);
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed.');
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch (e: any) {
      setError(e?.message || 'Delete failed.');
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
  };

  const saveAltText = async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alt_text: altDrafts[id] || '' }),
      });
      if (!res.ok) throw new Error('Could not save alt text.');
      const updated = await res.json();
      setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, alt_text: updated.alt_text } : a)));
    } catch (e: any) {
      setError(e?.message || 'Could not save alt text.');
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', margin: 0, color: '#0D213B' }}>Media library</h1>
          <p style={{ margin: '0.5rem 0 0', color: '#6B7280' }}>
            Upload once. Reuse everywhere. Copy URLs into Brands, Events, Case Studies, and Pages.
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
              accept="image/*"
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
            >
              {uploading ? 'Uploading…' : 'Upload image'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: '1rem', background: 'rgba(211, 47, 47, 0.08)', border: '1px solid rgba(211, 47, 47, 0.18)', padding: '0.85rem 1rem', borderRadius: 12, color: '#9A3412' }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '1.25rem', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(229,231,235,0.75)', borderRadius: 16, padding: '1rem' }}>
        {loading ? (
          <p style={{ margin: 0, color: '#6B7280' }}>Loading…</p>
        ) : assets.length === 0 ? (
          <p style={{ margin: 0, color: '#6B7280' }}>No media yet. Upload an image to get started.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.9rem' }}>
            {assets.map((a) => (
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
                <div style={{ aspectRatio: '4 / 3', background: '#F3F4F6' }}>
                  {/* backend serves /uploads */}
                  <img src={a.url} alt={a.alt_text || a.original_name || a.filename} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ padding: '0.75rem 0.75rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.original_name || a.filename}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.mime_type || 'image'}</span>
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
                        fontSize: '0.75rem',
                      }}
                    />
                    <button className="btn btn-outline" onClick={() => saveAltText(a.id)} style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}>
                      Save
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                    <button className="btn btn-outline" onClick={() => copyUrl(a.url)} style={{ flex: 1 }}>
                      Copy URL
                    </button>
                    <button className="btn btn-outline" onClick={() => handleDelete(a.id)} style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#B91C1C' }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

