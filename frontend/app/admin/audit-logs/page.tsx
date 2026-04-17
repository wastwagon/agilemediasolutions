'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { adminAuthHeaders, adminFetch, handleAdminSessionExpired, parseApiError } from '@/lib/adminApi';

type AuditLogRow = {
  id: number;
  actor_user_id?: number | null;
  actor_username?: string | null;
  action_method: string;
  action_path: string;
  entity_type?: string | null;
  entity_ref?: string | null;
  status_code: number;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
};

const METHOD_OPTIONS = ['', 'POST', 'PUT', 'PATCH', 'DELETE'];

export default function AdminAuditLogsPage() {
  const [rows, setRows] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [method, setMethod] = useState('');
  const [entity, setEntity] = useState('');
  const [actor, setActor] = useState('');
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState('100');

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (method.trim()) params.set('method', method.trim().toUpperCase());
    if (entity.trim()) params.set('entity', entity.trim().toLowerCase());
    if (actor.trim()) params.set('actor', actor.trim());
    if (q.trim()) params.set('q', q.trim());
    if (limit.trim()) params.set('limit', limit.trim());
    const s = params.toString();
    return s ? `?${s}` : '';
  }, [actor, entity, limit, method, q]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminFetch(`/api/admin/audit-logs${queryString}`, {
        headers: adminAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error(
          await parseApiError(res, 'Could not load audit logs.', {
            onAuthError: handleAdminSessionExpired,
          })
        );
      }
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setRows([]);
      setError(err?.message || 'Could not load audit logs.');
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <div
        className="admin-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.4rem',
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', marginBottom: '0.45rem', color: 'var(--color-dark-blue)' }}>
            Audit logs
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            Track authenticated admin write actions across CMS modules.
          </p>
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid var(--color-border)',
          borderRadius: 14,
          padding: '0.9rem',
          marginBottom: '1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.6rem',
        }}
      >
        <select value={method} onChange={(e) => setMethod(e.target.value)} style={{ border: '1px solid var(--color-border)', borderRadius: 10, padding: '0.48rem 0.62rem' }}>
          {METHOD_OPTIONS.map((opt) => (
            <option key={opt || 'all'} value={opt}>
              {opt || 'All methods'}
            </option>
          ))}
        </select>
        <input value={entity} onChange={(e) => setEntity(e.target.value)} placeholder="Entity (e.g. services)" style={{ border: '1px solid var(--color-border)', borderRadius: 10, padding: '0.48rem 0.62rem' }} />
        <input value={actor} onChange={(e) => setActor(e.target.value)} placeholder="Actor username" style={{ border: '1px solid var(--color-border)', borderRadius: 10, padding: '0.48rem 0.62rem' }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search path/reference" style={{ border: '1px solid var(--color-border)', borderRadius: 10, padding: '0.48rem 0.62rem' }} />
        <input value={limit} onChange={(e) => setLimit(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Limit" style={{ border: '1px solid var(--color-border)', borderRadius: 10, padding: '0.48rem 0.62rem' }} />
        <button onClick={() => void fetchLogs()} className="btn btn-primary" style={{ fontSize: '0.78rem', padding: '0.36rem 0.62rem', borderRadius: 9, lineHeight: 1.2 }}>
          Refresh
        </button>
      </div>

      {error ? (
        <div style={{ marginBottom: '0.8rem', padding: '0.72rem 0.84rem', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontWeight: 700 }}>
          {error}
        </div>
      ) : null}

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--color-border)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)', maxHeight: '72vh' }}>
        <table style={{ width: '100%', minWidth: '1100px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <tr>
              <th style={{ position: 'sticky', top: 0, zIndex: 1, padding: '1rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>When</th>
              <th style={{ position: 'sticky', top: 0, zIndex: 1, padding: '1rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Actor</th>
              <th style={{ position: 'sticky', top: 0, zIndex: 1, padding: '1rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Action</th>
              <th style={{ position: 'sticky', top: 0, zIndex: 1, padding: '1rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Target</th>
              <th style={{ position: 'sticky', top: 0, zIndex: 1, padding: '1rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Status</th>
              <th style={{ position: 'sticky', top: 0, zIndex: 1, padding: '1rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>IP</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading audit logs…</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No audit logs found for current filters.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.86rem 1rem', verticalAlign: 'top', fontSize: '0.83rem', color: '#111827' }}>
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.86rem 1rem', verticalAlign: 'top', fontSize: '0.83rem' }}>
                    {row.actor_username || 'unknown'}
                  </td>
                  <td style={{ padding: '0.86rem 1rem', verticalAlign: 'top', fontSize: '0.83rem' }}>
                    <span style={{ fontWeight: 700 }}>{row.action_method}</span>
                    <div style={{ color: 'var(--color-text-muted)' }}>{row.action_path}</div>
                  </td>
                  <td style={{ padding: '0.86rem 1rem', verticalAlign: 'top', fontSize: '0.83rem' }}>
                    {row.entity_type || 'unknown'}
                    {row.entity_ref ? ` / ${row.entity_ref}` : ''}
                  </td>
                  <td style={{ padding: '0.86rem 1rem', verticalAlign: 'top', fontSize: '0.83rem' }}>{row.status_code}</td>
                  <td style={{ padding: '0.86rem 1rem', verticalAlign: 'top', fontSize: '0.83rem', color: 'var(--color-text-muted)' }}>{row.ip_address || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
