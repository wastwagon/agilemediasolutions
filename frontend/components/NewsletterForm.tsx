'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { trackAnalyticsEvent } from '@/lib/analyticsClient';
import { useLocale } from '@/components/LocaleProvider';
import { localizeHref, t } from '@/lib/i18n';

export default function NewsletterForm() {
  const locale = useLocale();
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
        void trackAnalyticsEvent('newsletter_signup', typeof window !== 'undefined' ? window.location.pathname : '/', {
          source: 'newsletter_form',
        });
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
          <span style={{ fontWeight: 500 }}>{t(locale, 'newsletterSuccess')}</span>
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
            <label htmlFor="newsletter-email">{t(locale, 'newsletterEmailLabel')}</label>
            <div className="form-border"></div>
            {status === 'error' && <span className="form-error-msg" style={{ display: 'block', marginTop: '0.5rem' }}>{t(locale, 'newsletterError')}</span>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={status === 'loading'} style={{ alignSelf: 'stretch' }}>
            {status === 'loading' ? t(locale, 'newsletterSubscribing') : t(locale, 'newsletterSubscribe')}
          </button>
        </div>
      )}
      {status !== 'success' && (
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #6b7280)', marginTop: '0.75rem', lineHeight: 1.5 }}>
          {t(locale, 'newsletterPrivacyPrefix')}{' '}
          <Link href={localizeHref('/privacy', locale)} style={{ color: 'var(--color-primary, #2C504A)', textDecoration: 'underline' }}>{t(locale, 'newsletterPrivacyLink')}</Link>
          .
        </p>
      )}
    </form>
  );
}
