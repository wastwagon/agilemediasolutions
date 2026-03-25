'use client';

import React, { useEffect, useState } from 'react';
import AdminImageUpload from '../../../components/AdminImageUpload';
import MediaLibraryPicker from '../../../components/MediaLibraryPicker';

export default function AdminBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState('');
  const thStyle: React.CSSProperties = { position: 'sticky', top: 0, zIndex: 1, padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--color-bg-alt)' };
  const actionBtnStyle: React.CSSProperties = { background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, padding: '0.4rem 0.62rem', marginLeft: '0.55rem' };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/brands', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      } else {
        setError('Could not load brands.');
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

  const handleEditClick = (brand: any) => {
    setEditingBrand(brand);
    setIsAdding(true);
    setName(brand.name);
    setDescription(brand.description || '');
    setImageUrl(brand.image_url || '');
    setWebsiteUrl(brand.website_url || '');
    setOrderIndex(brand.order_index?.toString() || '0');
  };

  const handleCreateClick = () => {
    setEditingBrand(null);
    setIsAdding(true);
    setName('');
    setDescription('');
    setImageUrl('');
    setWebsiteUrl('');
    setOrderIndex('0');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingBrand(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/brands/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Could not delete this brand.');
      }
    } catch (err) {
      alert('Something went wrong while deleting.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name, description, image_url: imageUrl, website_url: websiteUrl, order_index: parseInt(orderIndex || '0')
    };

    const token = localStorage.getItem('admin_token');
    const url = editingBrand ? `/api/brands/${editingBrand.id}` : '/api/brands';
    const method = editingBrand ? 'PUT' : 'POST';

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

  if (loading && brands.length === 0) return <div className="admin-loading" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading…</div>;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>Brands</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Edit the brands shown on your site.</p>
        </div>
        {!isAdding && (
          <button onClick={handleCreateClick} className="btn btn-primary">
            Add brand
          </button>
        )}
      </div>

      {isAdding && (
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '2rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-dark-blue)' }}>
            {editingBrand ? 'Edit brand' : 'New brand'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row-split" style={{ marginBottom: '1.5rem' }}>
              <div className={`form-group ${name ? 'has-value' : ''}`}>
                <input type="text" id="name" required value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="name">Brand Name</label>
                <div className="form-border"></div>
              </div>
              <div className={`form-group ${websiteUrl ? 'has-value' : ''}`}>
                <input type="text" id="websiteUrl" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
                <label htmlFor="websiteUrl">Website (optional)</label>
                <div className="form-border"></div>
              </div>
            </div>

            <div className={`form-group form-group-textarea ${description ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              <label htmlFor="description">Description (optional)</label>
              <div className="form-border"></div>
            </div>

            <div className="form-row-split" style={{ marginBottom: '2.5rem' }}>
              <div className={`form-group ${imageUrl ? 'has-value' : ''}`}>
                <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                <label htmlFor="imageUrl">Logo image URL</label>
                <div className="form-border"></div>
                <AdminImageUpload 
                  currentUrl={imageUrl} 
                  onUploadSuccess={(url) => setImageUrl(url)} 
                  label="Upload logo"
                />
                <MediaLibraryPicker onSelect={(url) => setImageUrl(url)} buttonLabel="Choose logo from library" />
              </div>
              <div className={`form-group ${orderIndex ? 'has-value' : ''}`}>
                <input type="number" id="orderIndex" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} />
                <label htmlFor="orderIndex">Sort order</label>
                <div className="form-border"></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleCancel} className="btn btn-outline" style={{ border: 'none' }}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingBrand ? 'Save changes' : 'Add brand'}</button>
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
                <th style={thStyle}>Logo</th>
                <th style={thStyle}>Brand</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>No brands yet. Add one to get started.</td></tr>
              ) : (
                brands.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border)', background: '#fff', transition: 'background 0.2s ease' }}>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {b.order_index}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ width: '60px', height: '60px', background: 'var(--color-bg-alt)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0.5rem' }}>
                        {b.image_url ? <img src={b.image_url} alt={b.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>No Logo</span>}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)', marginBottom: '4px', fontSize: '1.1rem' }}>{b.name}</div>
                      {b.description && <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.description}</div>}
                      {b.website_url && <a href={b.website_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>Open website</a>}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleEditClick(b)}
                        style={{ ...actionBtnStyle, color: 'var(--color-primary)' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)}
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
