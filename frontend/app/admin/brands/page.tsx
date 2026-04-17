'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import AdminImageUpload from '../../../components/AdminImageUpload';
import AdminUrlLink from '../../../components/AdminUrlLink';
import MediaLibraryPicker from '../../../components/MediaLibraryPicker';
import { AdminEditorCard, AdminFormActions } from '@/components/admin/AdminFormUi';
import { AdminErrorBanner, AdminLoadingState, AdminPageHeader } from '@/components/admin/AdminPageUi';
import { adminActionBtnStyle, adminThStyle } from '@/lib/adminTableStyles';
import { useAdminCrudResource } from '@/hooks/useAdminCrudResource';
import type { Brand, BrandPayload } from '@/types/adminEntities';

export default function AdminBrands() {
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const {
    items: brands,
    loading,
    error,
    deleteItem,
    saveItem,
  } = useAdminCrudResource<Brand, BrandPayload>('/api/brands', {
    loadError: 'Could not load brands.',
    connectError: 'Could not connect to the server.',
    deleteError: 'Could not delete this brand.',
    saveError: 'Could not save changes.',
  });

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('');
  const [format, setFormat] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState('');

  const handleEditClick = (brand: Brand) => {
    setEditingBrand(brand);
    setIsAdding(true);
    setName(brand.name);
    setDescription(brand.description || '');
    setAudience(brand.audience || '');
    setFormat(brand.format || '');
    setImageUrl(brand.image_url || '');
    setWebsiteUrl(brand.website_url || '');
    setOrderIndex(brand.order_index?.toString() || '0');
  };

  const handleCreateClick = () => {
    setEditingBrand(null);
    setIsAdding(true);
    setName('');
    setDescription('');
    setAudience('');
    setFormat('');
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
    const err = await deleteItem(id);
    if (err) alert(err);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: BrandPayload = {
      name,
      description,
      audience,
      format,
      image_url: imageUrl,
      website_url: websiteUrl,
      order_index: parseInt(orderIndex || '0')
    };

    const err = await saveItem(data, editingBrand?.id);
    if (err) {
      alert(err);
      return;
    }
    handleCancel();
  };

  if (loading && brands.length === 0) return <AdminLoadingState />;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <AdminPageHeader
        title="Brands"
        subtitle="Edit the brands shown on your site."
        addLabel="Add brand"
        isAdding={isAdding}
        onAdd={handleCreateClick}
      />

      {isAdding && (
        <AdminEditorCard title={editingBrand ? 'Edit brand' : 'New brand'}>
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

            <div className={`form-group ${audience ? 'has-value' : ''}`} style={{ marginBottom: '1.2rem' }}>
              <input type="text" id="audience" value={audience} onChange={(e) => setAudience(e.target.value)} />
              <label htmlFor="audience">Audience (optional)</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group ${format ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <input type="text" id="format" value={format} onChange={(e) => setFormat(e.target.value)} />
              <label htmlFor="format">Format (optional)</label>
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

            <AdminFormActions
              onCancel={handleCancel}
              submitLabel={editingBrand ? 'Save changes' : 'Add brand'}
            />
          </form>
        </AdminEditorCard>
      )}

      <AdminErrorBanner message={error} />

      {!isAdding && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--color-border)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)', maxHeight: '70vh' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ ...adminThStyle, width: '80px', textAlign: 'center' }}>Order</th>
                <th style={adminThStyle}>Logo</th>
                <th style={adminThStyle}>Brand</th>
                <th style={{ ...adminThStyle, textAlign: 'right' }}>Actions</th>
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
                        {b.image_url ? (
                          <Image
                            src={b.image_url}
                            alt={b.name}
                            width={48}
                            height={48}
                            unoptimized
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>No Logo</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)', marginBottom: '4px', fontSize: '1.1rem' }}>{b.name}</div>
                      {b.description && <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.description}</div>}
                      {(b.audience || b.format) && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                          {b.audience ? `Audience: ${b.audience}` : ''}
                          {b.audience && b.format ? ' | ' : ''}
                          {b.format ? `Format: ${b.format}` : ''}
                        </div>
                      )}
                      {b.website_url && (
                        <AdminUrlLink href={b.website_url}>Open website</AdminUrlLink>
                      )}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleEditClick(b)}
                        style={{ ...adminActionBtnStyle, color: 'var(--color-primary)' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)}
                        style={{ ...adminActionBtnStyle, color: '#B91C1C', borderColor: 'rgba(185,28,28,0.25)', background: 'rgba(185,28,28,0.04)' }}
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
