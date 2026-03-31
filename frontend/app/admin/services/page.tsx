'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import AdminImageUpload from '../../../components/AdminImageUpload';
import MediaLibraryPicker from '../../../components/MediaLibraryPicker';
import { AdminEditorCard, AdminFormActions } from '@/components/admin/AdminFormUi';
import { AdminErrorBanner, AdminLoadingState, AdminPageHeader } from '@/components/admin/AdminPageUi';
import { adminActionBtnStyle, adminThStyle } from '@/lib/adminTableStyles';
import { useAdminCrudResource } from '@/hooks/useAdminCrudResource';
import type { Service, ServicePayload } from '@/types/adminEntities';

export default function AdminServices() {
  const looksLikeImageUrl = (value?: string | null) => {
    if (!value) return false;
    const v = value.trim().toLowerCase();
    return v.startsWith('/uploads/') || v.startsWith('http://') || v.startsWith('https://') || v.startsWith('data:image/');
  };

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const {
    items: services,
    loading,
    error,
    deleteItem,
    saveItem,
  } = useAdminCrudResource<Service, ServicePayload>('/api/services', {
    loadError: 'Could not load services.',
    connectError: 'Could not connect to the server.',
    deleteError: 'Could not delete this service.',
    saveError: 'Could not save changes.',
  });

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState('');
  const [icon, setIcon] = useState('');
  const [orderIndex, setOrderIndex] = useState('');

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setIsAdding(true);
    setTitle(service.title);
    setDescription(service.description || '');
    setHighlights(service.highlights || '');
    setIcon(service.icon || '');
    setOrderIndex(service.order_index?.toString() || '0');
  };

  const handleCreateClick = () => {
    setEditingService(null);
    setIsAdding(true);
    setTitle('');
    setDescription('');
    setHighlights('');
    setIcon('');
    setOrderIndex('0');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingService(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    const err = await deleteItem(id);
    if (err) alert(err);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: ServicePayload = {
      title,
      description,
      highlights,
      icon,
      order_index: parseInt(orderIndex || '0'),
    };

    const err = await saveItem(data, editingService?.id);
    if (err) {
      alert(err);
      return;
    }
    handleCancel();
  };

  if (loading && services.length === 0) return <AdminLoadingState />;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <AdminPageHeader
        title="Services"
        subtitle="Edit the services listed on your site."
        addLabel="Add service"
        isAdding={isAdding}
        onAdd={handleCreateClick}
      />

      {isAdding && (
        <AdminEditorCard title={editingService ? 'Edit service' : 'New service'}>
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

            <div className={`form-group form-group-textarea ${highlights ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <textarea
                id="highlights"
                rows={4}
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                placeholder="One bullet point per line"
              ></textarea>
              <label htmlFor="highlights">Homepage bullet highlights</label>
              <div className="form-border"></div>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Add one line per bullet (example: Strategy and planning).
              </p>
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

            <AdminFormActions
              onCancel={handleCancel}
              submitLabel={editingService ? 'Save changes' : 'Add service'}
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
                <th style={adminThStyle}>Service</th>
                <th style={adminThStyle}>Icon</th>
                <th style={{ ...adminThStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>No services yet. Add one to get started.</td></tr>
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
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', color: 'var(--color-primary)', fontWeight: 500 }}>
                      {looksLikeImageUrl(s.icon) ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                          <div
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '10px',
                              background: 'var(--color-bg-alt)',
                              border: '1px solid var(--color-border)',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Image
                              src={s.icon as string}
                              alt={`${s.title} icon`}
                              width={44}
                              height={44}
                              unoptimized
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Featured image</span>
                        </div>
                      ) : (
                        <span style={{ textTransform: 'capitalize' }}>{s.icon || '-'}</span>
                      )}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleEditClick(s)}
                        style={{ ...adminActionBtnStyle, color: 'var(--color-primary)' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id)}
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
