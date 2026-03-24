'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleRunMigrations = async () => {
    if (!confirm('Are you sure you want to run the database migration and seeding? This will ensure all necessary tables exist and core data is seeded. Existing data will remain unaffected.')) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005'}/api/admin/run-migrations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message || 'Migration and seeding completed successfully.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to run migrations.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', fontFamily: 'Cormorant Garamond' }}>System Settings</h2>
      
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Database Maintenance</h3>
        <p style={{ color: '#4B5563', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          If auto-migration and seeding did not work during the initial setup, you can manually trigger the process here. 
          This will establish the correct database schema (creating missing tables) and seed necessary base data (such as the default admin user and initial web pages).
        </p>
        
        {message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '6px', 
            marginBottom: '1.5rem', 
            background: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
            color: message.type === 'success' ? '#065F46' : '#991B1B',
            fontWeight: 500
          }}>
            {message.text}
          </div>
        )}

        <button 
          onClick={handleRunMigrations} 
          disabled={loading}
          style={{ 
            background: '#111827', 
            color: '#fff', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '6px', 
            border: 'none', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s'
          }}
        >
          {loading ? 'Running...' : 'Run Migrations & Seeding'}
        </button>
      </div>
    </div>
  );
}
