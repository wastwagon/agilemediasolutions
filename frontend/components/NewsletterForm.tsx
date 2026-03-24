'use client';

import React, { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form className="newsletter-form-premium" id="newsletter-form" onSubmit={handleSubmit}>
      {status === 'success' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', animation: 'heroLineIn 0.5s var(--ease-out) forwards' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>✓</span>
          <span style={{ fontWeight: 500 }}>Thank you for subscribing.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className={`form-group ${email ? 'has-value' : ''}`} style={{ flex: '1 1 200px' }}>
            <input 
              type="email" 
              id="newsletter-email"
              name="newsletter-email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
            />
            <label htmlFor="newsletter-email">Email Address</label>
            <div className="form-border"></div>
            {status === 'error' && <span className="form-error-msg" style={{ display: 'block', marginTop: '0.5rem' }}>Network error. Try again.</span>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={status === 'loading'} style={{ alignSelf: 'stretch' }}>
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </div>
      )}
    </form>
  );
}
