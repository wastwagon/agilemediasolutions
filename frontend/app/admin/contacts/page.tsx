'use client';

import React, { useEffect, useState } from 'react';

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

  const fetchContacts = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/admin/contacts', {
        headers: { 'Authorization': `Bearer ${token}` }
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

  const handleStatusUpdate = async (id: number, currentStatus: string) => {
    const token = localStorage.getItem('admin_token');
    const newStatus = currentStatus === 'new' ? 'resolved' : 'new';
    try {
      const res = await fetch(`/api/admin/contacts/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
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
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
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
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>Messages sent from the contact form on your site.</p>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--color-border)', overflow: 'scroll', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <tr>
              <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
              <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>From</th>
              <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</th>
              <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No messages yet.</td></tr>
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
                  <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'top', maxWidth: '400px' }}>
                    {c.topic && <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>Topic: {c.topic}</div>}
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: 1.5 }}>{c.message}</div>
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
                      onClick={() => handleStatusUpdate(c.id, c.status || 'new')}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 600, marginRight: '1rem', transition: 'opacity 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {c.status === 'new' ? 'Mark as done' : 'Mark as new'}
                    </button>
                    <button 
                      onClick={() => handleDelete(c.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#E63946', fontSize: '0.9rem', fontWeight: 600, transition: 'opacity 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
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
