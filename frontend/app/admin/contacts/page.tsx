'use client';

import React, { useEffect, useState } from 'react';
import { adminAuthHeaders, adminFetch } from '@/lib/adminApi';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  topic: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState<ContactMessage | null>(null);
  const thStyle: React.CSSProperties = { position: 'sticky', top: 0, zIndex: 1, padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--color-bg-alt)' };
  const actionBtnStyle: React.CSSProperties = { background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', borderRadius: 7, cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700, lineHeight: 1.2, padding: '0.3rem 0.5rem', marginLeft: '0.45rem' };

  const fetchContacts = async () => {
    try {
      const res = await adminFetch('/api/admin/contacts', {
        headers: adminAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      } else {
        setError('Could not load messages.');
      }
    } catch (err) {
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDetail(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [detail]);

  const handleStatusUpdate = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'new' ? 'resolved' : 'new';
    try {
      const res = await adminFetch(`/api/admin/contacts/${id}/status`, {
        method: 'PUT',
        headers: { 
          ...adminAuthHeaders(),
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchContacts();
      }
    } catch (err) {
      alert('Could not update status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await adminFetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: adminAuthHeaders(),
      });
      if (res.ok) {
        fetchContacts();
      }
    } catch (err) {
      alert('Could not delete this message.');
    }
  };

  if (loading) return <div className="admin-loading" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading…</div>;
  if (error) return <div className="admin-error" style={{ padding: '3rem', textAlign: 'center', color: '#E63946' }}>{error}</div>;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <div className="admin-header">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>Contact form</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Messages sent from the contact form on your site. Use <strong>View</strong> to read the full message and copy details.
        </p>
      </div>

      {detail ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-detail-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(15, 23, 42, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={() => setDetail(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              maxWidth: 560,
              width: '100%',
              maxHeight: 'min(88vh, 720px)',
              overflow: 'auto',
              boxShadow: '0 24px 48px rgba(15,23,42,0.18)',
              border: '1px solid var(--color-border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.35rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
              <h2 id="contact-detail-title" style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-dark-blue)' }}>
                Message from {detail.name}
              </h2>
              <button
                type="button"
                onClick={() => setDetail(null)}
                style={{ flexShrink: 0, border: 'none', background: 'rgba(0,0,0,0.06)', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div style={{ padding: '1.25rem 1.35rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Date</div>
                <div>{new Date(detail.created_at).toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Email</div>
                <a href={`mailto:${detail.email}`} style={{ color: 'var(--color-primary)', wordBreak: 'break-all' }}>{detail.email}</a>
                <button
                  type="button"
                  onClick={() => void navigator.clipboard.writeText(detail.email)}
                  style={{ ...actionBtnStyle, marginLeft: '0.5rem', marginTop: '0.35rem', display: 'inline-block' }}
                >
                  Copy email
                </button>
              </div>
              {detail.topic ? (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Topic</div>
                  <div style={{ lineHeight: 1.5 }}>{detail.topic}</div>
                </div>
              ) : null}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Message</div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--color-text)', padding: '0.85rem 1rem', background: 'var(--color-bg-alt)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                  {detail.message}
                </div>
                <button
                  type="button"
                  onClick={() => void navigator.clipboard.writeText(detail.message)}
                  style={{ ...actionBtnStyle, marginTop: '0.5rem' }}
                >
                  Copy message
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Status: <strong>{detail.status || 'new'}</strong>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--color-border)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)', maxHeight: '70vh' }}>
        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>From</th>
              <th style={thStyle}>Message</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>No messages yet.</td></tr>
            ) : (
              contacts.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)', background: c.status === 'new' ? '#fff' : '#f9fafa', transition: 'background 0.3s' }}>
                  <td style={{ padding: '1.5rem 1.2rem', fontSize: '0.9rem', verticalAlign: 'top', color: 'var(--color-text-muted)' }}>
                    {new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)', marginBottom: '4px' }}>{c.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>{c.email}</div>
                  </td>
                  <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'top', maxWidth: '360px' }}>
                    {c.topic && <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>Topic: {c.topic}</div>}
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.message}</div>
                  </td>
                  <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'top' }}>
                    <span style={{ 
                      display: 'inline-block', 
                      padding: '4px 12px', 
                      borderRadius: '50px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: c.status === 'new' ? 'rgba(214, 108, 68, 0.1)' : 'rgba(44, 80, 74, 0.1)',
                      color: c.status === 'new' ? 'var(--color-accent)' : 'var(--color-primary)'
                    }}>
                      {c.status || 'new'}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'top', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => setDetail(c)}
                      style={{ ...actionBtnStyle, color: 'var(--color-dark-blue)', display: 'block', width: '100%', marginBottom: '0.35rem', marginLeft: 0 }}
                    >
                      View
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleStatusUpdate(c.id, c.status || 'new')}
                      style={{ ...actionBtnStyle, color: 'var(--color-primary)' }}
                    >
                      {c.status === 'new' ? 'Mark as done' : 'Mark as new'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDelete(c.id)}
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
    </div>
  );
}
