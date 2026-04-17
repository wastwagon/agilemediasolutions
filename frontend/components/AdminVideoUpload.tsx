'use client';

import React, { useState, useRef } from 'react';
import { ADMIN_MAX_VIDEO_UPLOAD_BYTES, uploadAdminVideo, validateAdminVideoFile } from '@/lib/adminUpload';

interface AdminVideoUploadProps {
  currentUrl: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
}

export default function AdminVideoUpload({ currentUrl, onUploadSuccess, label = 'Upload video' }: AdminVideoUploadProps) {
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

    const validationError = validateAdminVideoFile(file);
    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const url = await uploadAdminVideo(file);
      onUploadSuccess(url);
      setSuccess('Upload complete.');
    } catch (err: any) {
      setError(err?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem', padding: '1rem', background: '#F3F4F6', borderRadius: '8px', border: '1px dashed #D1D5DB' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        {currentUrl && (
          <div style={{ width: 120, maxWidth: '100%', borderRadius: '8px', overflow: 'hidden', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB' }}>
            <video src={currentUrl} muted playsInline preload="metadata" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>{label}</label>
          <input
            type="file"
            accept="video/mp4,video/webm"
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
        Allowed: MP4, WebM. Max size: {Math.floor(ADMIN_MAX_VIDEO_UPLOAD_BYTES / (1024 * 1024))}MB.
      </div>
    </div>
  );
}
