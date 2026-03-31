'use client';

import React, { useState, useRef } from 'react';
import { ADMIN_MAX_UPLOAD_BYTES, uploadAdminImage, validateAdminImageFile } from '@/lib/adminUpload';

interface AdminImageUploadProps {
  currentUrl: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
}

export default function AdminImageUpload({ currentUrl, onUploadSuccess, label = "Upload image" }: AdminImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(''), 2800);
    return () => window.clearTimeout(timer);
  }, [success]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateAdminImageFile(file);
    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const url = await uploadAdminImage(file);
      onUploadSuccess(url);
      setSuccess('Upload complete.');
    } catch (err: any) {
      setError(err?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      // Reset input value to allow uploading the same file again if needed
      if(fileInputRef.current) {
         fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem', padding: '1rem', background: '#F3F4F6', borderRadius: '8px', border: '1px dashed #D1D5DB' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {currentUrl && (
            <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB' }}>
                <img src={currentUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
        )}
        <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>{label}</label>
            <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                disabled={uploading}
                style={{ fontSize: '0.9rem', width: '100%' }}
            />
        </div>
      </div>
      {uploading && <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#2563EB' }}>Uploading…</div>}
      {success && <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#166534' }}>{success}</div>}
      {error && <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#DC2626' }}>{error}</div>}
      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6B7280' }}>
        Allowed: JPG, PNG, WEBP, GIF. Max size: {Math.floor(ADMIN_MAX_UPLOAD_BYTES / (1024 * 1024))}MB.
      </div>
    </div>
  );
}
