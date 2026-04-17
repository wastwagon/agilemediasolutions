'use client';

import React from 'react';
import Link from 'next/link';

import type { AppLocale } from '@/lib/locale';
import { useLocale } from '@/components/LocaleProvider';
import { getCookiesCopy, getPrivacyCopy, getTermsCopy, type LegalBlock } from '@/lib/i18n/legalCopy';
import { localizeHref, t } from '@/lib/i18n';

const LEGAL_LINK_TOKEN =
  /\[\[(CONTACT_PAGE|CONTACT_US|COOKIE_NOTICE|PRIVACY_POLICY)\]\]/g;

function renderParagraphWithLinks(text: string, locale: AppLocale): React.ReactNode {
  if (!text.includes('[[')) {
    return text;
  }
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LEGAL_LINK_TOKEN.lastIndex = 0;
  while ((m = LEGAL_LINK_TOKEN.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index));
    }
    const token = m[1] as 'CONTACT_PAGE' | 'CONTACT_US' | 'COOKIE_NOTICE' | 'PRIVACY_POLICY';
    const href =
      token === 'COOKIE_NOTICE'
        ? localizeHref('/cookies', locale)
        : token === 'PRIVACY_POLICY'
          ? localizeHref('/privacy', locale)
          : localizeHref('/contact', locale);
    const label =
      token === 'COOKIE_NOTICE'
        ? t(locale, 'legalCookieNoticeLink')
        : token === 'PRIVACY_POLICY'
          ? t(locale, 'newsletterPrivacyLink')
          : token === 'CONTACT_US'
            ? t(locale, 'legalContactUsLink')
            : t(locale, 'legalContactPageLink');
    parts.push(
      <Link key={`${m.index}-${token}`} href={href}>
        {label}
      </Link>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return <>{parts}</>;
}

function LegalSections({ block, locale }: { block: LegalBlock; locale: AppLocale }) {
  return (
    <div className="section-text" style={{ lineHeight: 1.75 }}>
      {block.sections.map((section, i) => (
        <React.Fragment key={`${section.title}-${i}`}>
          <h2
            className="section-title"
            style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}
          >
            {section.title}
          </h2>
          {section.paragraphs.map((p, j) => (
            <p key={j}>{renderParagraphWithLinks(p, locale)}</p>
          ))}
        </React.Fragment>
      ))}
      <p style={{ marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted, #6b7280)' }}>
        {block.disclaimer}
      </p>
    </div>
  );
}

export type LegalPageVariant = 'privacy' | 'terms' | 'cookies';

export default function LegalPageBody({ variant }: { variant: LegalPageVariant }) {
  const locale = useLocale();
  const block: LegalBlock =
    variant === 'privacy' ? getPrivacyCopy(locale) : variant === 'terms' ? getTermsCopy(locale) : getCookiesCopy(locale);

  return (
    <main className="creative-public-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">{block.heroLabel}</span>
          <h1 className="page-hero-title">{block.heroTitle}</h1>
          <p className="page-hero-tagline">{block.heroTagline}</p>
        </div>
      </div>
      <section className="section">
        <div className="section-inner" style={{ maxWidth: '42rem', margin: '0 auto', paddingBottom: '4rem' }}>
          <LegalSections block={block} locale={locale} />
        </div>
      </section>
    </main>
  );
}
