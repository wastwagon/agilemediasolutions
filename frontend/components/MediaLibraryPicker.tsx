'use client';

import React, { useEffect, useState } from 'react';
import { adminAuthHeaders, handleAdminSessionExpired, parseApiError } from '@/lib/adminApi';

type MediaAsset = {
  id: number;
  url: string;
  filename: string;
  original_name?: string | null;
};

export default function MediaLibraryPicker({
  onSelect,
  buttonLabel = 'Choose from library',
}: {
  onSelect: (url: string) => void;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const loadAssets = async (q = '') => {
    setLoading(true);
    setError('');
    try {
      const qs = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : '';
      const res = await fetch(`/api/media${qs}`, { headers: adminAuthHeaders() });
      if (!res.ok) {
        throw new Error(await parseApiError(res, 'Could not load media library', { onAuthError: handleAdminSessionExpired }));
      }
      const data = await res.json();
      setAssets(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || 'Could not load media library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadAssets(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div style={{ marginTop: '0.75rem' }}>
      <button type="button" className="btn btn-outline" onClick={() => setOpen((v) => !v)} style={{ border: 'none' }}>
        {open ? 'Close library' : buttonLabel}
      </button>

      {open && (
        <div style={{ marginTop: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 12, background: '#fff', padding: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search images..."
              style={{ flex: 1, border: '1px solid var(--color-border)', borderRadius: 8, padding: '0.5rem 0.65rem' }}
            />
            <button type="button" className="btn btn-outline" onClick={() => loadAssets(query)} style={{ border: 'none' }}>
              Search
            </button>
          </div>

          {loading ? (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Loading media...</div>
          ) : error ? (
            <div style={{ color: '#B91C1C', fontSize: '0.9rem' }}>{error}</div>
          ) : assets.length === 0 ? (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No media found.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.65rem', maxHeight: 280, overflowY: 'auto' }}>
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onSelect(asset.url);
                    setOpen(false);
                  }}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 10,
                    background: '#fff',
                    padding: '0.35rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ width: '100%', aspectRatio: '1 / 1', background: '#F7F7F7', borderRadius: 8, overflow: 'hidden', marginBottom: '0.35rem' }}>
                    <img src={asset.url} alt={asset.original_name || asset.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {asset.original_name || asset.filename}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

