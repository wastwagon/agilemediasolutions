'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { trackAnalyticsEvent } from '@/lib/analyticsClient';

const easeOut = [0.2, 0.8, 0.2, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

const TOPIC = 'Concept home (/newhomepage)';

export default function NhContactForm() {
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
    <div className="nh-contact-wrap">
      <motion.form
        className="nh-form"
        onSubmit={onSubmit}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={reveal}
        noValidate
      >
        {status === 'success' ? (
          <div className="nh-form-success" role="status">
            <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--nh-white)' }}>Message sent</p>
            <p style={{ margin: '0.75rem 0 0', color: 'rgba(240,240,240,0.75)' }}>
              Thanks for writing in. We will read your message and reply within about two working days.
            </p>
          </div>
        ) : (
          <>
            <div className="nh-field">
              <label htmlFor="nh-name">Your name</label>
              <input
                id="nh-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Who are you?"
                value={formData.name}
                onChange={onChange}
                disabled={status === 'loading'}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'nh-name-err' : undefined}
              />
              {errors.name ? (
                <p id="nh-name-err" className="nh-form-error" role="alert" style={{ marginTop: '0.35rem' }}>
                  {errors.name}
                </p>
              ) : null}
            </div>
            <div className="nh-field">
              <label htmlFor="nh-email">Your email</label>
              <input
                id="nh-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="For direct contact"
                value={formData.email}
                onChange={onChange}
                disabled={status === 'loading'}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'nh-email-err' : undefined}
              />
              {errors.email ? (
                <p id="nh-email-err" className="nh-form-error" role="alert" style={{ marginTop: '0.35rem' }}>
                  {errors.email}
                </p>
              ) : null}
            </div>
            <div className="nh-field">
              <label htmlFor="nh-msg">Your message</label>
              <textarea
                id="nh-msg"
                name="message"
                placeholder="Goals, markets, or timing"
                maxLength={5000}
                value={formData.message}
                onChange={onChange}
                disabled={status === 'loading'}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'nh-msg-err' : undefined}
              />
              {errors.message ? (
                <p id="nh-msg-err" className="nh-form-error" role="alert" style={{ marginTop: '0.35rem' }}>
                  {errors.message}
                </p>
              ) : null}
            </div>
            <div className="nh-form-actions">
              <button type="submit" className="nh-btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Submit'}
              </button>
            </div>
            {status === 'error' ? (
              <p className="nh-form-error" role="alert">
                Something went wrong. Try again in a moment, or use the main{' '}
                <Link href="/contact" style={{ color: 'var(--nh-green)' }}>
                  contact page
                </Link>
                .
              </p>
            ) : null}
          </>
        )}
      </motion.form>
      <motion.div
        className="nh-contact-deco"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: easeOut }}
        aria-hidden
      />
    </div>
  );
}
