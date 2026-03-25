'use client';

import React, { useEffect, useState } from 'react';
import AdminImageUpload from '../../../components/AdminImageUpload';
import MediaLibraryPicker from '../../../components/MediaLibraryPicker';

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingService, setEditingService] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [orderIndex, setOrderIndex] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      } else {
        setError('Could not load services.');
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

  const handleEditClick = (service: any) => {
    setEditingService(service);
    setIsAdding(true);
    setTitle(service.title);
    setDescription(service.description || '');
    setIcon(service.icon || '');
    setOrderIndex(service.order_index?.toString() || '0');
  };

  const handleCreateClick = () => {
    setEditingService(null);
    setIsAdding(true);
    setTitle('');
    setDescription('');
    setIcon('');
    setOrderIndex('0');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingService(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Could not delete this service.');
      }
    } catch (err) {
      alert('Something went wrong while deleting.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      title, description, icon, order_index: parseInt(orderIndex || '0')
    };

    const token = localStorage.getItem('admin_token');
    const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
    const method = editingService ? 'PUT' : 'POST';

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
        alert('Could not save changes.');
      }
    } catch (err) {
      alert('Something went wrong while saving.');
    }
  };

  if (loading && services.length === 0) return <div className="admin-loading" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading…</div>;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>Services</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Edit the services listed on your site.</p>
        </div>
        {!isAdding && (
          <button onClick={handleCreateClick} className="btn btn-primary">
            Add service
          </button>
        )}
      </div>

      {isAdding && (
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '2rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-dark-blue)' }}>
            {editingService ? 'Edit service' : 'New service'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className={`form-group ${title ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <input type="text" id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
              <label htmlFor="title">Title</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group form-group-textarea ${description ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              <label htmlFor="description">Description</label>
              <div className="form-border"></div>
            </div>

            <div className="form-row-split" style={{ marginBottom: '2.5rem' }}>
              <div className={`form-group ${icon ? 'has-value' : ''}`}>
                <input type="text" id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} />
                <label htmlFor="icon">Icon (name or image URL)</label>
                <div className="form-border"></div>
                <AdminImageUpload 
                  currentUrl={icon} 
                  onUploadSuccess={(url) => setIcon(url)} 
                  label="Upload icon image"
                />
                <MediaLibraryPicker onSelect={(url) => setIcon(url)} buttonLabel="Choose icon from library" />
              </div>
              <div className={`form-group ${orderIndex ? 'has-value' : ''}`}>
                <input type="number" id="orderIndex" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} />
                <label htmlFor="orderIndex">Sort order</label>
                <div className="form-border"></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleCancel} className="btn btn-outline" style={{ border: 'none' }}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingService ? 'Save changes' : 'Add service'}</button>
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
                <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', width: '80px', textAlign: 'center' }}>Order</th>
                <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service</th>
                <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Icon</th>
                <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No services yet. Add one to get started.</td></tr>
              ) : (
                services.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)', background: '#fff' }}>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {s.order_index}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)', marginBottom: '4px', fontSize: '1.1rem' }}>{s.title}</div>
                      {s.description && <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.description}</div>}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textTransform: 'capitalize', color: 'var(--color-primary)', fontWeight: 500 }}>
                      {s.icon || '-'}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleEditClick(s)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 600, marginRight: '1rem', transition: 'opacity 0.2s' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#E63946', fontSize: '0.9rem', fontWeight: 600, transition: 'opacity 0.2s' }}
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
