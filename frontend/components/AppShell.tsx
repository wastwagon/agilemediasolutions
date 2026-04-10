'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import NewsletterForm from './NewsletterForm';
import TopBar from './TopBar';
import Header from './Header';
import Preloader from './Preloader';
import SiteAnalytics from './SiteAnalytics';
import MobileTabBar from './MobileTabBar';
import LocaleHtmlAttributes from './LocaleHtmlAttributes';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { type AppLocale } from '@/lib/locale';
import { useLocale } from '@/components/LocaleProvider';
import { localizeHref, t } from '@/lib/i18n';
import { parseSiteContentPairs, useSiteSectionContent } from '@/lib/siteSectionCms';
import {
  DEFAULT_AGILE_INSTAGRAM_URL,
  DEFAULT_AGILE_LINKEDIN_URL,
  DEFAULT_AGILE_X_URL,
  DEFAULT_AGILE_YOUTUBE_URL,
  DEFAULT_FACEBOOK_URL,
} from '@/lib/defaultSocialUrls';

const COL1_DEFAULT = `Who we are :: /about
Services :: /services
Sectors :: /sectors
Studio :: /studio`;

const COL2_DEFAULT = `Agile Press Group :: /agile-press-group
Our brands :: /brands
Case studies :: /case-studies
Resources :: /insights`;

const COL3_DEFAULT = `Insights :: /insights
Digital engagement :: /digital-engagement
Events :: /signature-events
Careers :: /careers
Partnerships :: /partnerships`;

const COL4_DEFAULT = `Contact us :: /contact
Privacy policy :: /privacy
Terms of service :: /terms
Cookie notice :: /cookies`;

function FooterLinkColumn({
  heading,
  pairsRaw,
  locale,
}: {
  heading: string;
  pairsRaw: string;
  locale: AppLocale;
}) {
  const rows = parseSiteContentPairs(pairsRaw);
  return (
    <div className="footer-col">
      <h4>{heading}</h4>
      <ul>
        {rows.map((row, i) => (
          <li key={`${row.left}-${i}`}>
            <Link href={localizeHref(row.right?.trim() || '#', locale)}>{row.left || 'Link'}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function stripTrailingSlash(p: string) {
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
  return p;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathNorm = stripTrailingSlash(pathname ?? '') || '/';
  const locale = useLocale();
  const isAdminRoute = pathname?.startsWith('/admin');

  const footer = useSiteSectionContent('layout.footer', {
    impactText: 'Agile Media',
    brandingCopy: 'We shape narratives that move institutions, markets, and culture across Africa and beyond.',
    newsletterHeading: t(locale, 'newsletterHeading'),
    newsletterBody: t(locale, 'newsletterBody'),
    copyrightEntity: 'Agile Media Solutions',
    col1Heading: t(locale, 'footerCompany'),
    col1Links: COL1_DEFAULT,
    col2Heading: 'Agile Press Group',
    col2Links: COL2_DEFAULT,
    col3Heading: t(locale, 'footerPressRoom'),
    col3Links: COL3_DEFAULT,
    col4Heading: t(locale, 'footerContactLegal'),
    col4Links: COL4_DEFAULT,
    facebookUrl: DEFAULT_FACEBOOK_URL,
    instagramUrl: DEFAULT_AGILE_INSTAGRAM_URL,
    xUrl: DEFAULT_AGILE_X_URL,
    linkedinUrl: DEFAULT_AGILE_LINKEDIN_URL,
    youtubeUrl: DEFAULT_AGILE_YOUTUBE_URL,
  });

  useScrollAnimations(!isAdminRoute && pathNorm !== '/newhomepage', pathname ?? '');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  const year = new Date().getFullYear();
  const skipGlobalPreloader = pathNorm === '/newhomepage';
  const fb = footer.facebookUrl?.trim() || DEFAULT_FACEBOOK_URL;
  const ig = footer.instagramUrl?.trim() || DEFAULT_AGILE_INSTAGRAM_URL;
  const x = footer.xUrl?.trim() || DEFAULT_AGILE_X_URL;
  const li = footer.linkedinUrl?.trim() || DEFAULT_AGILE_LINKEDIN_URL;
  const yt = footer.youtubeUrl?.trim() || DEFAULT_AGILE_YOUTUBE_URL;

  return (
    <>
      <LocaleHtmlAttributes />
      <SiteAnalytics />
      {!skipGlobalPreloader ? <Preloader /> : null}
      <TopBar />
      <Header />
      <div className="public-shell">{children}</div>
      <footer className="footer" id="footer">
        <div className="footer-impact-text">{footer.impactText}</div>
        <div className="footer-top">
          <div className="footer-inner">
            <div className="footer-branding">
              <Link href={localizeHref('/', locale)} className="footer-logo" aria-label="Agile Media Solutions home">
                <img src="/images/agilemediasolutionslogo.png" alt="Agile Media Solutions" />
              </Link>
              <p className="footer-branding-copy">{footer.brandingCopy}</p>
            </div>
            <div className="footer-columns">
              <FooterLinkColumn heading={footer.col1Heading} pairsRaw={footer.col1Links} locale={locale} />
              <FooterLinkColumn heading={footer.col2Heading} pairsRaw={footer.col2Links} locale={locale} />
              <FooterLinkColumn heading={footer.col3Heading} pairsRaw={footer.col3Links} locale={locale} />
              <FooterLinkColumn heading={footer.col4Heading} pairsRaw={footer.col4Links} locale={locale} />
              <div className="footer-col footer-newsletter" id="newsletter">
                <h4>{footer.newsletterHeading}</h4>
                <p>{footer.newsletterBody}</p>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-inner footer-bottom-inner">
            <p className="copyright">
              © {year} {footer.copyrightEntity}. {t(locale, 'rightsReserved')}
            </p>
            <div className="footer-legal">
              <Link href={localizeHref('/privacy', locale)}>{t(locale, 'privacy')}</Link>
              <Link href={localizeHref('/terms', locale)}>{t(locale, 'terms')}</Link>
              <Link href={localizeHref('/cookies', locale)}>{t(locale, 'cookies')}</Link>
            </div>
            <div className="footer-social" id="footer-social">
              <a href={fb} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href={ig} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href={x} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              <a href={li} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"></path>
                </svg>
              </a>
              <a href={yt} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <MobileTabBar />
    </>
  );
}
