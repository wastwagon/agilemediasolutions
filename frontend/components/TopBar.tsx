'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/locale';
import { localizeHref, t } from '@/lib/i18n';
import { useSiteSectionContent } from '@/lib/siteSectionCms';
import {
  DEFAULT_PHONE_WHATSAPP_HREF,
  DEFAULT_PHONE_WHATSAPP_LABEL,
  resolveTopBarPhoneFromCms,
} from '@/lib/defaultPhoneChannel';
import {
  DEFAULT_AGILE_INSTAGRAM_URL,
  DEFAULT_AGILE_LINKEDIN_URL,
  DEFAULT_AGILE_X_URL,
  DEFAULT_AGILE_YOUTUBE_URL,
  DEFAULT_FACEBOOK_URL,
} from '@/lib/defaultSocialUrls';
import './TopBar.css';

export default function TopBar() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const bar = useSiteSectionContent('layout.topBar', {
    email: 'info@agilemediasolutions.com',
    contactLabel: DEFAULT_PHONE_WHATSAPP_LABEL,
    contactHref: DEFAULT_PHONE_WHATSAPP_HREF,
    facebookUrl: DEFAULT_FACEBOOK_URL,
    twitterUrl: DEFAULT_AGILE_X_URL,
    instagramUrl: DEFAULT_AGILE_INSTAGRAM_URL,
    linkedinUrl: DEFAULT_AGILE_LINKEDIN_URL,
    youtubeUrl: DEFAULT_AGILE_YOUTUBE_URL,
  });

  const mailHref = bar.email?.trim() ? `mailto:${bar.email.trim()}` : 'mailto:info@agilemediasolutions.com';
  const emailDisplay = bar.email?.trim() || 'info@agilemediasolutions.com';
  const { href: contactHref, label: contactLabel } = resolveTopBarPhoneFromCms(bar.contactLabel, bar.contactHref);
  const contactIsHttp = /^https?:\/\//i.test(contactHref);
  const contactIsTel = /^tel:/i.test(contactHref);
  const phoneLinkStyle: React.CSSProperties = { color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' };
  const phoneIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  );

  const fb = bar.facebookUrl?.trim() || DEFAULT_FACEBOOK_URL;
  const tw = bar.twitterUrl?.trim() || DEFAULT_AGILE_X_URL;
  const ig = bar.instagramUrl?.trim() || DEFAULT_AGILE_INSTAGRAM_URL;
  const li = bar.linkedinUrl?.trim() || DEFAULT_AGILE_LINKEDIN_URL;
  const yt = bar.youtubeUrl?.trim() || DEFAULT_AGILE_YOUTUBE_URL;

  const phoneAria = `${t(locale, 'topBarPhoneAria')}: ${contactLabel.replace(/\s+/g, ' ').trim()}`;
  const localizedContactHref = localizeHref(contactHref, locale);

  return (
    <div className="top-bar">
      <div className="top-bar__contact">
        <a href={mailHref} aria-label={`${t(locale, 'topBarEmailAria')}: ${emailDisplay}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span className="top-bar__email-text">{emailDisplay}</span>
        </a>
        {contactIsHttp || contactIsTel ? (
          <a
            href={contactHref}
            {...(contactIsHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            style={phoneLinkStyle}
            aria-label={phoneAria}
          >
            {phoneIcon}
            <span className="top-bar__phone-text">{contactLabel}</span>
          </a>
        ) : (
          <Link href={localizedContactHref} style={phoneLinkStyle} aria-label={phoneAria}>
            {phoneIcon}
            <span className="top-bar__phone-text">{contactLabel}</span>
          </Link>
        )}
      </div>

      <div className="top-bar__socials">
        <a href={fb} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.8 }} aria-label="Facebook">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        </a>
        <a href={tw} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.8 }} aria-label="X">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </a>
        <a href={ig} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.8 }} aria-label="Instagram">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
        <a href={li} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.8 }} aria-label="LinkedIn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
        <a href={yt} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.8 }} aria-label="YouTube">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
