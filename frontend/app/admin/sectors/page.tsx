'use client';

import React, { useState } from 'react';
import { AdminEditorCard, AdminFormActions } from '@/components/admin/AdminFormUi';
import { AdminErrorBanner, AdminLoadingState, AdminPageHeader } from '@/components/admin/AdminPageUi';
import AdminImageUpload from '@/components/AdminImageUpload';
import MediaLibraryPicker from '@/components/MediaLibraryPicker';
import { adminActionBtnStyle, adminThStyle } from '@/lib/adminTableStyles';
import { useAdminCrudResource } from '@/hooks/useAdminCrudResource';
import type { Sector, SectorPayload } from '@/types/adminEntities';

export default function AdminSectors() {
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const {
    items: sectors,
    loading,
    error,
    deleteItem,
    saveItem,
  } = useAdminCrudResource<Sector, SectorPayload>('/api/sectors', {
    loadError: 'Could not load sectors.',
    connectError: 'Could not connect to the server.',
    deleteError: 'Could not delete this sector.',
    saveError: 'Could not save changes.',
  });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState('');

  const handleEditClick = (sector: Sector) => {
    setEditingSector(sector);
    setIsAdding(true);
    setName(sector.name);
    setDescription(sector.description || '');
    setIcon(sector.icon || '');
    setImageUrl(sector.image_url || '');
    setOrderIndex(sector.order_index?.toString() || '0');
  };

  const handleCreateClick = () => {
    setEditingSector(null);
    setIsAdding(true);
    setName('');
    setDescription('');
    setIcon('');
    setImageUrl('');
    setOrderIndex('0');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingSector(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sector?')) return;
    const err = await deleteItem(id);
    if (err) alert(err);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: SectorPayload = {
      name,
      description,
      icon,
      image_url: imageUrl,
      order_index: parseInt(orderIndex || '0', 10),
    };
    const err = await saveItem(payload, editingSector?.id);
    if (err) {
      alert(err);
      return;
    }
    handleCancel();
  };

  if (loading && sectors.length === 0) return <AdminLoadingState />;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <AdminPageHeader
        title="Sectors"
        subtitle="Manage sectors on /sectors. Card images appear on the public grid; leave empty to use rotating placeholders."
        addLabel="Add sector"
        isAdding={isAdding}
        onAdd={handleCreateClick}
      />

      {isAdding && (
        <AdminEditorCard title={editingSector ? 'Edit sector' : 'New sector'}>
          <form onSubmit={handleSubmit}>
            <div className={`form-group ${name ? 'has-value' : ''}`} style={{ marginBottom: '1.2rem' }}>
              <input type="text" id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              <label htmlFor="name">Sector name</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group form-group-textarea ${description ? 'has-value' : ''}`} style={{ marginBottom: '1.2rem' }}>
              <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              <label htmlFor="description">Description</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group ${imageUrl ? 'has-value' : ''}`} style={{ marginBottom: '1.2rem' }}>
              <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <label htmlFor="imageUrl">Card image URL (optional)</label>
              <div className="form-border"></div>
              <AdminImageUpload currentUrl={imageUrl} onUploadSuccess={(url) => setImageUrl(url)} label="Upload image" />
              <MediaLibraryPicker onSelect={(url) => setImageUrl(url)} buttonLabel="Choose from library" />
            </div>

            <div className="form-row-split" style={{ marginBottom: '1.8rem' }}>
              <div className={`form-group ${icon ? 'has-value' : ''}`}>
                <input type="text" id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} />
                <label htmlFor="icon">Icon token (optional, legacy)</label>
                <div className="form-border"></div>
              </div>
              <div className={`form-group ${orderIndex ? 'has-value' : ''}`}>
                <input type="number" id="orderIndex" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} />
                <label htmlFor="orderIndex">Sort order</label>
                <div className="form-border"></div>
              </div>
            </div>

            <AdminFormActions
              onCancel={handleCancel}
              submitLabel={editingSector ? 'Save changes' : 'Add sector'}
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
                <th style={{ ...adminThStyle, width: '100px' }}>Image</th>
                <th style={adminThStyle}>Sector</th>
                <th style={adminThStyle}>Icon</th>
                <th style={{ ...adminThStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sectors.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>No sectors yet. Add one to get started.</td></tr>
              ) : (
                sectors.map((sector) => (
                  <tr key={sector.id} style={{ borderBottom: '1px solid var(--color-border)', background: '#fff' }}>
                    <td style={{ padding: '1.2rem', verticalAlign: 'middle', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {sector.order_index}
                    </td>
                    <td style={{ padding: '1.2rem', verticalAlign: 'middle' }}>
                      {sector.image_url ? (
                        <img
                          src={sector.image_url}
                          alt=""
                          style={{
                            width: '88px',
                            height: '55px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            background: 'var(--color-bg-alt)',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Placeholder</span>
                      )}
                    </td>
                    <td style={{ padding: '1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)', marginBottom: '4px', fontSize: '1rem' }}>{sector.name}</div>
                      {sector.description && <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', maxWidth: '460px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sector.description}</div>}
                    </td>
                    <td style={{ padding: '1.2rem', verticalAlign: 'middle', color: 'var(--color-primary)', fontSize: '0.88rem' }}>
                      {sector.icon || '-'}
                    </td>
                    <td style={{ padding: '1.2rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <button
                        onClick={() => handleEditClick(sector)}
                        style={{ ...adminActionBtnStyle, color: 'var(--color-primary)' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sector.id)}
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
