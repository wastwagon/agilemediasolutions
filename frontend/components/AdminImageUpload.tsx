'use client';

import React, { useState, useRef } from 'react';

interface AdminImageUploadProps {
  currentUrl: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
}

export default function AdminImageUpload({ currentUrl, onUploadSuccess, label = "Upload Image" }: AdminImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional validation
    if (!file.type.startsWith('image/')) {
       setError('Please select a valid image file');
       return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        // Assume data.url is returned
        onUploadSuccess(data.url);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Upload failed');
      }
    } catch (err) {
      setError('Network error during upload');
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
      {uploading && <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#2563EB' }}>Uploading...</div>}
      {error && <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#DC2626' }}>{error}</div>}
      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6B7280' }}>
         Drag & Drop or click to upload. You can also paste an external URL in the field above.
      </div>
    </div>
  );
}
