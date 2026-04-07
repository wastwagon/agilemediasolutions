'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { adminAuthHeaders, adminFetch, handleAdminSessionExpired, parseApiError } from '@/lib/adminApi';
import { AdminErrorBanner, AdminLoadingState, AdminPageHeader } from '@/components/admin/AdminPageUi';

type Summary = {
  rangeDays: number;
  byType: Record<string, number>;
  conversions: Record<string, number>;
  topPaths: { path: string; c: number }[];
  byDay: { day: string; count: number }[];
};

type EventRow = {
  id: string;
  event_type: string;
  path: string;
  referrer: string | null;
  session_key: string | null;
  meta_json: Record<string, unknown> | null;
  created_at: string;
};

const DAY_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
];

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState('30');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sumRes, evRes] = await Promise.all([
        adminFetch(`/api/admin/analytics/summary?days=${encodeURIComponent(days)}`, {
          headers: adminAuthHeaders(),
        }),
        adminFetch('/api/admin/analytics/events?limit=200', {
          headers: adminAuthHeaders(),
        }),
      ]);
      if (!sumRes.ok) {
        throw new Error(
          await parseApiError(sumRes, 'Could not load analytics summary.', { onAuthError: handleAdminSessionExpired })
        );
      }
      if (!evRes.ok) {
        throw new Error(
          await parseApiError(evRes, 'Could not load recent events.', { onAuthError: handleAdminSessionExpired })
        );
      }
      setSummary(await sumRes.json());
      const evData = await evRes.json();
      setEvents(Array.isArray(evData) ? evData : []);
    } catch (e: any) {
      setSummary(null);
      setEvents([]);
      setError(e?.message || 'Could not load analytics.');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  const pageViews = summary?.byType?.page_view ?? 0;
  const conversionTotal = useMemo(() => {
    if (!summary?.conversions) return 0;
    return Object.values(summary.conversions).reduce((a, b) => a + b, 0);
  }, [summary]);

  if (loading && !summary) return <AdminLoadingState />;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <AdminPageHeader
        title="Site analytics"
        subtitle="First-party activity: page views, newsletter signups, and contact submissions. No third-party trackers."
        addLabel="Refresh"
        isAdding={false}
        onAdd={() => void load()}
      />

      <AdminErrorBanner message={error} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', alignItems: 'center' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
          Range
          <select
            value={days}
            onChange={(e) => setDays(e.target.value)}
            style={{
              marginLeft: '0.5rem',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              padding: '0.45rem 0.6rem',
            }}
          >
            {DAY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {summary ? (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={cardStyle}>
              <div style={cardLabel}>Page views</div>
              <div style={cardValue}>{pageViews.toLocaleString()}</div>
            </div>
            <div style={cardStyle}>
              <div style={cardLabel}>Conversion events</div>
              <div style={cardValue}>{conversionTotal.toLocaleString()}</div>
              <div style={cardHint}>Newsletter, contact, CTAs (range)</div>
            </div>
            <div style={cardStyle}>
              <div style={cardLabel}>Newsletter signups</div>
              <div style={cardValue}>{(summary.conversions?.newsletter_signup ?? 0).toLocaleString()}</div>
            </div>
            <div style={cardStyle}>
              <div style={cardLabel}>Contact submissions</div>
              <div style={cardValue}>{(summary.conversions?.contact_submit ?? 0).toLocaleString()}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <div style={panelStyle}>
              <h2 style={panelTitle}>Top pages</h2>
              <p style={panelSub}>By page_view in selected range</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {(summary.topPaths || []).slice(0, 15).map((row) => (
                  <li
                    key={row.path}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      padding: '0.45rem 0',
                      borderBottom: '1px solid var(--color-border)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <span style={{ wordBreak: 'break-all' }}>{row.path}</span>
                    <span style={{ fontWeight: 700, flexShrink: 0 }}>{row.c}</span>
                  </li>
                ))}
                {(!summary.topPaths || summary.topPaths.length === 0) && (
                  <li style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No page views yet in this range.</li>
                )}
              </ul>
            </div>
            <div style={panelStyle}>
              <h2 style={panelTitle}>Events by type</h2>
              <p style={panelSub}>All tracked types in range</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {Object.entries(summary.byType || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([k, v]) => (
                    <li
                      key={k}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.45rem 0',
                        borderBottom: '1px solid var(--color-border)',
                        fontSize: '0.88rem',
                      }}
                    >
                      <span>{k}</span>
                      <span style={{ fontWeight: 700 }}>{v}</span>
                    </li>
                  ))}
                {Object.keys(summary.byType || {}).length === 0 && (
                  <li style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No data yet.</li>
                )}
              </ul>
            </div>
          </div>

          <div style={panelStyle}>
            <h2 style={panelTitle}>Daily volume</h2>
            <p style={panelSub}>UTC dates · all event types</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'flex-end' }}>
              {(summary.byDay || []).map((d) => {
                const max = Math.max(...(summary.byDay || []).map((x) => x.count), 1);
                const h = Math.max(4, Math.round((d.count / max) * 48));
                return (
                  <div key={d.day} style={{ textAlign: 'center', width: 36 }}>
                    <div
                      style={{
                        height: 52,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}
                      title={`${d.day}: ${d.count}`}
                    >
                      <div
                        style={{
                          width: 22,
                          height: h,
                          background: 'linear-gradient(180deg, #0F766E, #134E4A)',
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                      {String(d.day).slice(5)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}

      <div style={{ ...panelStyle, marginTop: '1.75rem' }}>
        <h2 style={panelTitle}>Recent events</h2>
        <p style={panelSub}>Latest 200 rows · session keys are anonymous browser IDs</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>
                <th style={thStyle}>Time (UTC)</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Path</th>
                <th style={thStyle}>Meta</th>
              </tr>
            </thead>
            <tbody>
              {events.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={tdStyle}>{new Date(r.created_at).toISOString().replace('T', ' ').slice(0, 19)}</td>
                  <td style={tdStyle}>{r.event_type}</td>
                  <td style={tdStyle}>{r.path}</td>
                  <td style={tdStyle}>
                    <code style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
                      {r.meta_json && Object.keys(r.meta_json).length ? JSON.stringify(r.meta_json) : '—'}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && !loading && (
            <p style={{ color: 'var(--color-text-muted)', padding: '1rem 0' }}>No events recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid var(--color-border)',
  borderRadius: 14,
  padding: '1.1rem 1.2rem',
};

const cardLabel: React.CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--color-text-muted)',
  marginBottom: '0.35rem',
};

const cardValue: React.CSSProperties = {
  fontSize: '1.85rem',
  fontWeight: 700,
  color: 'var(--color-dark-blue)',
};

const cardHint: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--color-text-muted)',
  marginTop: '0.35rem',
};

const panelStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid var(--color-border)',
  borderRadius: 14,
  padding: '1.15rem 1.25rem',
};

const panelTitle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.15rem',
  fontWeight: 700,
  color: 'var(--color-dark-blue)',
};

const panelSub: React.CSSProperties = {
  margin: '0.25rem 0 0.85rem',
  fontSize: '0.82rem',
  color: 'var(--color-text-muted)',
};

const thStyle: React.CSSProperties = { padding: '0.5rem 0.35rem', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '0.45rem 0.35rem', verticalAlign: 'top' };
