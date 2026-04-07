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
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { parseSiteContentPairs, useSiteSectionContent } from '@/lib/siteSectionCms';

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
}: {
  heading: string;
  pairsRaw: string;
}) {
  const rows = parseSiteContentPairs(pairsRaw);
  return (
    <div className="footer-col">
      <h4>{heading}</h4>
      <ul>
        {rows.map((row, i) => (
          <li key={`${row.left}-${i}`}>
            <Link href={row.right?.trim() || '#'}>{row.left || 'Link'}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  const footer = useSiteSectionContent('layout.footer', {
    impactText: 'Agile Media',
    brandingCopy: 'We shape narratives that move institutions, markets, and culture across Africa and beyond.',
    newsletterHeading: 'Newsletter',
    newsletterBody:
      'Subscribe to the Agile Brief—our monthly roundup of ideas, strategy, and news. No spam.',
    copyrightEntity: 'Agile Media Solutions',
    col1Heading: 'Company',
    col1Links: COL1_DEFAULT,
    col2Heading: 'Agile Press Group',
    col2Links: COL2_DEFAULT,
    col3Heading: 'Press room',
    col3Links: COL3_DEFAULT,
    col4Heading: 'Contact & legal',
    col4Links: COL4_DEFAULT,
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    xUrl: 'https://x.com',
    linkedinUrl: 'https://linkedin.com',
  });

  useScrollAnimations(!isAdminRoute, pathname ?? '');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  const year = new Date().getFullYear();
  const fb = footer.facebookUrl?.trim() || 'https://facebook.com';
  const ig = footer.instagramUrl?.trim() || 'https://instagram.com';
  const x = footer.xUrl?.trim() || 'https://x.com';
  const li = footer.linkedinUrl?.trim() || 'https://linkedin.com';

  return (
    <>
      <SiteAnalytics />
      <Preloader />
      <TopBar />
      <Header />
      <div className="public-shell">{children}</div>
      <footer className="footer" id="footer">
        <div className="footer-impact-text">{footer.impactText}</div>
        <div className="footer-top">
          <div className="footer-inner">
            <div className="footer-branding">
              <Link href="/" className="footer-logo" aria-label="Agile Media Solutions home">
                <img src="/images/agilemediasolutionslogo.png" alt="Agile Media Solutions" />
              </Link>
              <p className="footer-branding-copy">{footer.brandingCopy}</p>
            </div>
            <div className="footer-columns">
              <FooterLinkColumn heading={footer.col1Heading} pairsRaw={footer.col1Links} />
              <FooterLinkColumn heading={footer.col2Heading} pairsRaw={footer.col2Links} />
              <FooterLinkColumn heading={footer.col3Heading} pairsRaw={footer.col3Links} />
              <FooterLinkColumn heading={footer.col4Heading} pairsRaw={footer.col4Links} />
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
              © {year} {footer.copyrightEntity}. All rights reserved.
            </p>
            <div className="footer-legal">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/cookies">Cookies</Link>
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
            </div>
          </div>
        </div>
      </footer>
      <MobileTabBar />
    </>
  );
}
