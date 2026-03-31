import React from 'react';
import Link from 'next/link';
import ContactForm from '../../components/ContactForm';
import SectionHeader from '../../components/SectionHeader';
import { getSiteSectionContent } from '@/lib/siteSectionCmsServer';

export const metadata = {
  title: 'Contact Agile Media Solutions',
  description: 'Contact Agile Media Solutions for strategic communications, media, partnerships, events, and press support.',
};

export default async function Page() {
  const copy = await getSiteSectionContent('contact.page', {
    heroLabel: 'Contact',
    heroTitle: "Let's Talk Strategy, Storytelling, and Solutions",
    heroIntro:
      "Whether you're ready to launch a campaign, partner on a project, or explore how Agile Media Solutions can support your brand or institution-we'd love to hear from you.",
    heroSubIntro: 'We are available across time zones and channels to discuss ideas, opportunities, and collaborations.',
    connectionsLabel: 'Connections',
    connectionsTitle: 'Get In Touch',
    connectionsLinkLabel: 'View services',
    quickBriefLabel: 'Quick Brief',
    quickBriefTitle: 'Send a message',
    quickBriefSubtitle: 'Use the form for campaigns, partnerships, media enquiries, or general questions.',
    generalCardTitle: 'General Inquiries',
    generalEmail: 'info@agilemediasolutions.com',
    generalHours: 'Monday-Friday, 9:00 AM-6:00 PM (GMT)',
    generalHeadOffice: 'Accra, Ghana',
    generalLocations: 'Nairobi | Johannesburg',
    consultationCardTitle: 'Request a Consultation',
    consultationCardBody: 'Interested in our services? Fill out the consultation form below and our team will reach out within 48 hours.',
    pressCardTitle: 'Media & Press Inquiries',
    pressCardBody:
      'For interviews, speaker bookings, press releases, or story access, contact us from the email above and we will route you to the press desk.',
    pressCardCta: 'Download Media Kit',
    followTitle: 'Follow Us',
    followSubtitle:
      'Stay connected for insights, event updates, behind-the-scenes content, and stories that matter-Twitter, LinkedIn, Instagram, YouTube, and Facebook.',
    socialCta: 'Social links',
    finalSubtitle: "Let's build something meaningful-together.",
    finalCta: 'Contact Us Now',
  });

  return (
    <main className="creative-public-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">{copy.heroLabel}</span>
          <h1 className="page-hero-title">{copy.heroTitle}</h1>
          <p className="page-hero-tagline">
            {copy.heroIntro}
          </p>
          <p className="page-hero-tagline" style={{ marginTop: 'var(--space-md)' }}>
            {copy.heroSubIntro}
          </p>
        </div>
      </div>

      <section className="section section-contact" id="contact">
        <div className="section-inner">
          <SectionHeader
            variant="inner"
            label={copy.connectionsLabel}
            title={copy.connectionsTitle}
            linkHref="/services"
            linkLabel={copy.connectionsLinkLabel}
          />

          <div className="insights-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
            <article className="insight-card">
              <h3>{copy.generalCardTitle}</h3>
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${copy.generalEmail}`}>{copy.generalEmail}</a>
              </p>
              <p>
                <strong>Hours:</strong> {copy.generalHours}
              </p>
              <p>
                <strong>Head Office:</strong> {copy.generalHeadOffice}
              </p>
              <p>
                <strong>Additional locations:</strong> {copy.generalLocations}
              </p>
            </article>
            <article className="insight-card">
              <h3>{copy.consultationCardTitle}</h3>
              <p>{copy.consultationCardBody}</p>
            </article>
            <article className="insight-card">
              <h3>{copy.pressCardTitle}</h3>
              <p>{copy.pressCardBody}</p>
              <Link href="#footer-social" className="btn btn-outline" style={{ marginTop: '0.75rem', display: 'inline-block' }}>
                {copy.pressCardCta}
              </Link>
            </article>
          </div>

          <SectionHeader
            variant="inner"
            layout="stack"
            label={copy.quickBriefLabel}
            title={copy.quickBriefTitle}
          />
          <p className="section-subtitle centered">{copy.quickBriefSubtitle}</p>
          <ContactForm />

          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <h3 className="section-title" style={{ fontSize: '1.25rem' }}>
              {copy.followTitle}
            </h3>
            <p className="section-subtitle centered">
              {copy.followSubtitle}
            </p>
            <Link href="#footer-social" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              {copy.socialCta}
            </Link>
          </div>

          <p className="section-subtitle centered" style={{ marginTop: 'var(--space-xl)' }}>
            {copy.finalSubtitle}
          </p>
          <div className="section-cta-center">
            <Link href="/contact#contact" className="btn btn-outline">
              {copy.finalCta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
