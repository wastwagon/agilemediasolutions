'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', data.username);
        // Add a slight delay for kinetic transition feel
        setTimeout(() => router.push('/admin/dashboard'), 400);
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)', // High-end neutral background
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Absolute blur overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(235, 230, 221, 0.95)', backdropFilter: 'blur(30px)' }}></div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        style={{ 
          width: '100%', 
          maxWidth: '440px', 
          background: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(24px)',
          padding: '3.5rem 3rem', 
          borderRadius: '24px', 
          boxShadow: '0 20px 60px rgba(13, 33, 59, 0.08), 0 1px 3px rgba(0,0,0,0.02)',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}
      >
        <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', marginBottom: '0.5rem', color: '#0D213B', fontWeight: 700 }}>Agile CMS</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#6B7280', fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600 }}>Administrative Control Center</p>
        </motion.div>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              style={{ color: '#d32f2f', background: 'rgba(211, 47, 47, 0.08)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 500, textAlign: 'center', border: '1px solid rgba(211, 47, 47, 0.2)' }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin}>
          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="admin-user" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</label>
              <input 
                type="text" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="admin-user"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  background: '#F9FAFB',
                  color: '#111827',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="admin-pass" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="admin-pass"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  background: '#F9FAFB',
                  color: '#111827',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '1.15rem', 
                borderRadius: '50px', 
                fontSize: '1rem',
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                background: '#2C504A', // Brand Green
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                marginTop: '1rem',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 10px 25px rgba(44, 80, 74, 0.25)',
                transition: 'transform 0.2s ease'
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard →'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </main>
  );
}
