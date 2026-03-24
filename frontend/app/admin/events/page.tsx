'use client';

import React, { useEffect, useState } from 'react';
import AdminImageUpload from '../../../components/AdminImageUpload';

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        setError('Failed to fetch events');
      }
    } catch (err) {
      setError('Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (ev: any) => {
    setEditingEvent(ev);
    setIsAdding(true);
    setTitle(ev.title);
    setDescription(ev.description || '');
    setImageUrl(ev.image_url || '');
    setLinkUrl(ev.link_url || '');
    setOrderIndex(ev.order_index?.toString() || '0');
  };

  const handleCreateClick = () => {
    setEditingEvent(null);
    setIsAdding(true);
    setTitle('');
    setDescription('');
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
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete event');
      }
    } catch (err) {
      alert('Error deleting event');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      title, description, image_url: imageUrl, link_url: linkUrl, order_index: parseInt(orderIndex || '0')
    };

    const token = localStorage.getItem('admin_token');
    const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
    const method = editingEvent ? 'PUT' : 'POST';

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
        alert('Failed to save event');
      }
    } catch (err) {
      alert('Error saving event');
    }
  };

  if (loading && events.length === 0) return <div className="admin-loading" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading events...</div>;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>Events CMS</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Manage the signature events featured on the site.</p>
        </div>
        {!isAdding && (
          <button onClick={handleCreateClick} className="btn btn-primary">
            + Add New Event
          </button>
        )}
      </div>

      {isAdding && (
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '2rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-dark-blue)' }}>
            {editingEvent ? 'Edit Event Details' : 'Create New Event'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row-split" style={{ marginBottom: '1.5rem' }}>
              <div className={`form-group ${title ? 'has-value' : ''}`}>
                <input type="text" id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
                <label htmlFor="title">Event Title</label>
                <div className="form-border"></div>
              </div>
              <div className={`form-group ${linkUrl ? 'has-value' : ''}`}>
                <input type="text" id="linkUrl" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
                <label htmlFor="linkUrl">Call to Action Link (Optional)</label>
                <div className="form-border"></div>
              </div>
            </div>

            <div className={`form-group form-group-textarea ${description ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              <label htmlFor="description">Event Description (Optional)</label>
              <div className="form-border"></div>
            </div>

            <div className="form-row-split" style={{ marginBottom: '2.5rem' }}>
              <div className={`form-group ${imageUrl ? 'has-value' : ''}`}>
                <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                <label htmlFor="imageUrl">Background Image URL</label>
                <div className="form-border"></div>
                <AdminImageUpload 
                  currentUrl={imageUrl} 
                  onUploadSuccess={(url) => setImageUrl(url)} 
                  label="Upload Event Banner"
                />
              </div>
              <div className={`form-group ${orderIndex ? 'has-value' : ''}`}>
                <input type="number" id="orderIndex" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} />
                <label htmlFor="orderIndex">Sort Order Index</label>
                <div className="form-border"></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleCancel} className="btn btn-outline" style={{ border: 'none' }}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingEvent ? 'Save Changes' : 'Publish Event'}</button>
            </div>
          </form>
        </div>
      )}

      {error && <div style={{ padding: '1rem', background: '#FEF2F2', color: '#B91C1C', borderRadius: '8px', marginBottom: '2rem' }}>{error}</div>}

      {!isAdding && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--color-border)', overflow: 'scroll', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', width: '80px', textAlign: 'center' }}>Ord</th>
                <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Banner</th>
                <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Info</th>
                <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No events configured.</td></tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid var(--color-border)', background: '#fff' }}>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {ev.order_index}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ width: '120px', height: '60px', background: 'var(--color-bg-alt)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0.5rem' }}>
                        {ev.image_url ? <img src={ev.image_url} alt={ev.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>No Image</span>}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)', marginBottom: '4px', fontSize: '1.1rem' }}>{ev.title}</div>
                      {ev.description && <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.description}</div>}
                      {ev.link_url && <a href={ev.link_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>Visit Event Page →</a>}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleEditClick(ev)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 600, marginRight: '1rem', transition: 'opacity 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(ev.id)}
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
      )}
    </div>
  );
}
