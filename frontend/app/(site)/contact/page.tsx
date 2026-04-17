import React from 'react';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import SectionHeader from '@/components/SectionHeader';
import {
  DEFAULT_GENERAL_PHONE_DISPLAY,
  DEFAULT_GENERAL_PHONE_LABEL,
  DEFAULT_PHONE_WHATSAPP_HREF,
} from '@/lib/defaultPhoneChannel';
import { getSiteSectionContent } from '@/lib/siteSectionCmsServer';
import { getLocaleForRsc } from '@/lib/localeRequest';
import { getContactPageDefaults } from '@/lib/i18n/pageDefaults';
import { localizeHref, t } from '@/lib/i18n';

export const metadata = {
  title: 'Contact Agile Media Solutions',
  description: 'Contact Agile Media Solutions for strategic communications, media, partnerships, events, and press support.',
};

export default async function Page() {
  const locale = await getLocaleForRsc();
  const copy = await getSiteSectionContent('contact.page', getContactPageDefaults(locale));

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
            linkHref={localizeHref('/services', locale)}
            linkLabel={copy.connectionsLinkLabel}
          />

          <div className="insights-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
            <article className="insight-card">
              <h3>{copy.generalCardTitle}</h3>
              <p>
                <strong>{t(locale, 'contactFieldEmail')}:</strong>{' '}
                <a href={`mailto:${copy.generalEmail}`}>{copy.generalEmail}</a>
              </p>
              {(copy.generalPhoneDisplay || '').trim() ? (
                <p>
                  <strong>{(copy.generalPhoneLabel || DEFAULT_GENERAL_PHONE_LABEL).trim()}:</strong>{' '}
                  <a
                    href={(copy.generalPhoneHref || DEFAULT_PHONE_WHATSAPP_HREF).trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {(copy.generalPhoneDisplay || DEFAULT_GENERAL_PHONE_DISPLAY).trim()}
                  </a>
                </p>
              ) : null}
              <p>
                <strong>{t(locale, 'contactFieldHours')}:</strong> {copy.generalHours}
              </p>
              <p>
                <strong>{t(locale, 'contactFieldAddress')}:</strong> {copy.generalHeadOffice}
              </p>
              <p>
                <strong>{t(locale, 'contactFieldLocations')}:</strong> {copy.generalLocations}
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
            <Link href={localizeHref('/contact#contact', locale)} className="btn btn-outline">
              {copy.finalCta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
