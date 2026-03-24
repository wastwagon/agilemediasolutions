'use client';

import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', topic: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  const validate = () => {
    let valid = true;
    const newErrors = { name: '', email: '', message: '' };
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
      valid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter a message.';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', topic: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <form className="contact-form-premium" id="contact-form" onSubmit={handleSubmit} noValidate>
      {status === 'success' ? (
        <div className="form-success-message">
          <div className="success-icon">✓</div>
          <h3>Message Sent</h3>
          <p>Thank you for reaching out. Our team will review your inquiry and get back to you within 48 hours.</p>
        </div>
      ) : (
        <>
          <div className="form-row-split">
            <div className={`form-group ${formData.name ? 'has-value' : ''} ${errors.name ? 'has-error' : ''}`}>
              <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} disabled={status === 'loading'} />
              <label htmlFor="name">Your Name</label>
              <div className="form-border"></div>
              {errors.name && <span className="form-error-msg" role="alert">{errors.name}</span>}
            </div>
            
            <div className={`form-group ${formData.email ? 'has-value' : ''} ${errors.email ? 'has-error' : ''}`}>
              <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} disabled={status === 'loading'} />
              <label htmlFor="email">Email Address</label>
              <div className="form-border"></div>
              {errors.email && <span className="form-error-msg" role="alert">{errors.email}</span>}
            </div>
          </div>

          <div className={`form-group ${formData.topic ? 'has-value' : ''}`}>
            <input type="text" id="topic" name="topic" value={formData.topic} onChange={handleChange} disabled={status === 'loading'} />
            <label htmlFor="topic">Topic (Optional)</label>
            <div className="form-border"></div>
          </div>

          <div className={`form-group form-group-textarea ${formData.message ? 'has-value' : ''} ${errors.message ? 'has-error' : ''}`}>
            <textarea id="message" name="message" required rows={4} value={formData.message} onChange={handleChange} disabled={status === 'loading'}></textarea>
            <label htmlFor="message">Your Message</label>
            <div className="form-border"></div>
            {errors.message && <span className="form-error-msg" role="alert">{errors.message}</span>}
          </div>

          <div className="form-submit-row">
            <button type="submit" className="btn btn-primary btn-submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </div>
          
          {status === 'error' && (
            <div className="form-error-global">
              An unexpected error occurred. Please try again later or contact us directly.
            </div>
          )}
        </>
      )}
    </form>
  );
}
