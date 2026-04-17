'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useLocale } from '@/components/LocaleProvider';
import { localizeHref } from '@/lib/i18n';
import { trackAnalyticsEvent } from '@/lib/analyticsClient';

const TOPIC = 'Concept home (/newhomepage)';

export default function NhContactForm() {
  const locale = useLocale();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  const validate = () => {
    let valid = true;
    const next = { name: '', email: '', message: '' };
    if (!formData.name.trim()) {
      next.name = 'Please enter your name.';
      valid = false;
    }
    if (!formData.email.trim()) {
      next.email = 'Please enter your email.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Please enter a valid email address.';
      valid = false;
    }
    if (!formData.message.trim()) {
      next.message = 'Please enter a message.';
      valid = false;
    }
    setErrors(next);
    return valid;
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          topic: TOPIC,
          message: formData.message.trim(),
        }),
      });
      if (res.ok) {
        void trackAnalyticsEvent('contact_submit', '/newhomepage', { source: 'newhomepage_concept' });
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        window.setTimeout(() => setStatus('idle'), 8000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'name' || name === 'email' || name === 'message') {
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="form-block w-form">
      {status === 'success' ? (
        <div className="w-form-done success-message is-visible" role="status">
          <div>Message sent. We will reply within about two working days.</div>
        </div>
      ) : (
        <form className="form-wrapper" onSubmit={onSubmit} noValidate>
          <div className="field-item">
            <label htmlFor="nh-name" className="field-label">
              Name
            </label>
            <input
              id="nh-name"
              name="name"
              type="text"
              className="text-field-2 w-input"
              autoComplete="name"
              placeholder="Who are you?"
              value={formData.name}
              onChange={onChange}
              disabled={status === 'loading'}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'nh-name-err' : undefined}
            />
            {errors.name ? (
              <p id="nh-name-err" className="paragraph20px" role="alert" style={{ marginTop: 8 }}>
                {errors.name}
              </p>
            ) : null}
          </div>
          <div className="field-item">
            <label htmlFor="nh-email" className="field-label">
              Email
            </label>
            <input
              id="nh-email"
              name="email"
              type="email"
              className="text-field-2 w-input"
              autoComplete="email"
              placeholder="For direct contact"
              value={formData.email}
              onChange={onChange}
              disabled={status === 'loading'}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'nh-email-err' : undefined}
            />
            {errors.email ? (
              <p id="nh-email-err" className="paragraph20px" role="alert" style={{ marginTop: 8 }}>
                {errors.email}
              </p>
            ) : null}
          </div>
          <div className="field-item">
            <label htmlFor="nh-msg" className="field-label">
              Message
            </label>
            <textarea
              id="nh-msg"
              name="message"
              className="text-field-area w-input"
              placeholder="Goals, markets, or timing"
              maxLength={5000}
              value={formData.message}
              onChange={onChange}
              disabled={status === 'loading'}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'nh-msg-err' : undefined}
            />
            {errors.message ? (
              <p id="nh-msg-err" className="paragraph20px" role="alert" style={{ marginTop: 8 }}>
                {errors.message}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button-wrapper is-white is-form w-inline-block" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending…' : 'Submit'}
          </button>
          <div className={`w-form-fail${status === 'error' ? ' is-visible' : ''}`} role={status === 'error' ? 'alert' : undefined}>
            <div>
              Something went wrong. Try again in a moment, or use the main{' '}
              <Link href={localizeHref('/contact', locale)} className="is-white">
                contact page
              </Link>
              .
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
