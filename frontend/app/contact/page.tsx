import React from 'react';
import Link from 'next/link';
import ContactForm from '../../components/ContactForm';

export default function Page() {
  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Contact</span>
          <h1 className="page-hero-title">Let&apos;s Talk Strategy, Storytelling, and Solutions</h1>
          <p className="page-hero-tagline">
            Whether you&apos;re ready to launch a campaign, partner on a project, or explore how Agile Media Solutions can support your brand or institution—we&apos;d love to hear from you.
          </p>
          <p className="page-hero-tagline" style={{ marginTop: 'var(--space-md)' }}>
            We are available across time zones and channels to discuss ideas, opportunities, and collaborations.
          </p>
        </div>
      </div>

      <section className="section section-contact" id="contact">
        <div className="section-inner">
          <h2 className="section-title centered">Get In Touch</h2>

          <div className="insights-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
            <article className="insight-card">
              <h3>General Inquiries</h3>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:info@agilemediasolutions.com">info@agilemediasolutions.com</a>
              </p>
              <p>
                <strong>Hours:</strong> Monday–Friday, 9:00 AM–6:00 PM (GMT)
              </p>
              <p>
                <strong>Head Office:</strong> Accra, Ghana
              </p>
              <p>
                <strong>Additional locations:</strong> Nairobi | Johannesburg
              </p>
            </article>
            <article className="insight-card">
              <h3>Request a Consultation</h3>
              <p>Interested in our services? Fill out the consultation form below and our team will reach out within 48 hours.</p>
            </article>
            <article className="insight-card">
              <h3>Media &amp; Press Inquiries</h3>
              <p>For interviews, speaker bookings, press releases, or story access, contact us from the email above and we will route you to the press desk.</p>
              <Link href="#footer-social" className="btn btn-outline" style={{ marginTop: '0.75rem', display: 'inline-block' }}>
                Download Media Kit
              </Link>
            </article>
          </div>

          <h2 className="section-title centered">Send a message</h2>
          <p className="section-subtitle centered">Use the form for campaigns, partnerships, media enquiries, or general questions.</p>
          <ContactForm />

          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <h3 className="section-title" style={{ fontSize: '1.25rem' }}>
              Follow Us
            </h3>
            <p className="section-subtitle centered">
              Stay connected for insights, event updates, behind-the-scenes content, and stories that matter—Twitter, LinkedIn, Instagram, YouTube, and Facebook.
            </p>
            <Link href="#footer-social" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Social links
            </Link>
          </div>

          <p className="section-subtitle centered" style={{ marginTop: 'var(--space-xl)' }}>
            Let&apos;s build something meaningful—together.
          </p>
          <div className="section-cta-center">
            <Link href="/contact#contact" className="btn btn-outline">
              Contact Us Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
