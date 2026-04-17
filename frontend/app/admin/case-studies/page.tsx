'use client';

import React, { useEffect, useState } from 'react';
import AdminImageUpload from '../../../components/AdminImageUpload';
import MediaLibraryPicker from '../../../components/MediaLibraryPicker';
import { adminAuthHeaders, adminFetch } from '@/lib/adminApi';

export default function AdminCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCase, setEditingCase] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState('');
  const thStyle: React.CSSProperties = { position: 'sticky', top: 0, zIndex: 1, padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--color-bg-alt)' };
  const actionBtnStyle: React.CSSProperties = { background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', borderRadius: 7, cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700, lineHeight: 1.2, padding: '0.3rem 0.5rem', marginLeft: '0.45rem' };
  const compactOutlineBtnStyle: React.CSSProperties = { border: 'none', fontSize: '0.74rem', padding: '0.3rem 0.48rem', borderRadius: 8, lineHeight: 1.2 };
  const compactPrimaryBtnStyle: React.CSSProperties = { fontSize: '0.78rem', padding: '0.36rem 0.62rem', borderRadius: 9, lineHeight: 1.2 };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/case-studies', {
        headers: adminAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setCaseStudies(data);
      } else {
        setError('Could not load case studies.');
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

  const handleEditClick = (c: any) => {
    setEditingCase(c);
    setIsAdding(true);
    setTitle(c.title);
    setClientName(c.client_name || '');
    setDescription(c.description || '');
    setImageUrl(c.image_url || '');
    setOrderIndex(c.order_index?.toString() || '0');
  };

  const handleCreateClick = () => {
    setEditingCase(null);
    setIsAdding(true);
    setTitle('');
    setClientName('');
    setDescription('');
    setImageUrl('');
    setOrderIndex('0');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingCase(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    try {
      const res = await adminFetch(`/api/case-studies/${id}`, {
        method: 'DELETE',
        headers: adminAuthHeaders(),
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Could not delete this case study.');
      }
    } catch (err) {
      alert('Something went wrong while deleting.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      title, client_name: clientName, description, image_url: imageUrl, order_index: parseInt(orderIndex || '0')
    };

    const url = editingCase ? `/api/case-studies/${editingCase.id}` : '/api/case-studies';
    const method = editingCase ? 'PUT' : 'POST';

    try {
      const res = await adminFetch(url, {
        method,
        headers: { 
          ...adminAuthHeaders(),
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

  if (loading && caseStudies.length === 0) return <div className="admin-loading" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading…</div>;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>Case studies</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Edit case studies shown on your site.</p>
        </div>
        {!isAdding && (
          <button onClick={handleCreateClick} className="btn btn-primary" style={compactPrimaryBtnStyle}>
            Add case study
          </button>
        )}
      </div>

      {isAdding && (
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '2rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-dark-blue)' }}>
            {editingCase ? 'Edit case study' : 'New case study'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row-split" style={{ marginBottom: '1.5rem' }}>
              <div className={`form-group ${title ? 'has-value' : ''}`}>
                <input type="text" id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
                <label htmlFor="title">Title</label>
                <div className="form-border"></div>
              </div>
              <div className={`form-group ${clientName ? 'has-value' : ''}`}>
                <input type="text" id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                <label htmlFor="clientName">Client name (optional)</label>
                <div className="form-border"></div>
              </div>
            </div>

            <div className={`form-group form-group-textarea ${description ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              <label htmlFor="description">Summary (optional)</label>
              <div className="form-border"></div>
            </div>

            <div className="form-row-split" style={{ marginBottom: '2.5rem' }}>
              <div className={`form-group ${imageUrl ? 'has-value' : ''}`}>
                <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                <label htmlFor="imageUrl">Image URL</label>
                <div className="form-border"></div>
                <AdminImageUpload 
                  currentUrl={imageUrl} 
                  onUploadSuccess={(url) => setImageUrl(url)} 
                  label="Upload image"
                />
                <MediaLibraryPicker onSelect={(url) => setImageUrl(url)} buttonLabel="Choose image from library" />
              </div>
              <div className={`form-group ${orderIndex ? 'has-value' : ''}`}>
                <input type="number" id="orderIndex" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} />
                <label htmlFor="orderIndex">Sort order</label>
                <div className="form-border"></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleCancel} className="btn btn-outline" style={compactOutlineBtnStyle}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={compactPrimaryBtnStyle}>{editingCase ? 'Save changes' : 'Add case study'}</button>
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
                <th style={{ ...thStyle, width: '80px', textAlign: 'center' }}>Order</th>
                <th style={thStyle}>Image</th>
                <th style={thStyle}>Details</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {caseStudies.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>No case studies yet. Add one to get started.</td></tr>
              ) : (
                caseStudies.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)', background: '#fff' }}>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {c.order_index}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ width: '120px', height: '60px', background: 'var(--color-bg-alt)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0.5rem' }}>
                        {c.image_url ? <img src={c.image_url} alt={c.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>No Image</span>}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)', marginBottom: '4px', fontSize: '1.1rem' }}>{c.title}</div>
                      {c.client_name && <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-gray)', marginBottom: '4px' }}>Client — {c.client_name}</div>}
                      {c.description && <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.description}</div>}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleEditClick(c)}
                        style={{ ...actionBtnStyle, color: 'var(--color-primary)' }}
                      >
                        Edit
                      </button>
                      <button 
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
      )}
    </div>
  );
}
