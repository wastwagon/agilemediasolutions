'use client';

import Link from 'next/link';
import React, { useMemo } from 'react';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import { useLocale } from '@/components/LocaleProvider';
import { localizeHref } from '@/lib/i18n';
import { SITE_SECTION_CODE_DEFAULTS } from '@/lib/siteSectionCodeDefaultsMap';
import { parseSiteContentPairs, useSiteSectionContent } from '@/lib/siteSectionCms';
import { NEWHOMEPAGE_PATH } from '@/lib/locale';

const NH_FOOTER_NAV = [
  { label: 'Home', href: NEWHOMEPAGE_PATH },
  { label: 'Style guide', href: '/about' },
  { label: 'Tutorial', href: '/insights' },
  { label: 'Licenses', href: '/privacy' },
] as const;

const LAYOUT_FOOTER_DEFAULTS = SITE_SECTION_CODE_DEFAULTS['layout.footer'] as Record<string, string>;

/** TopBar + `Header` with `/newhomepage`-only styling (`nh-chrome-ref.css`). */
export function NhAwsaNavbar() {
  return (
    <div className="nh-chrome-stack nh-chrome-stack--concept-ref">
      <TopBar />
      <Header brandVariant="amsText" homeBasePath={NEWHOMEPAGE_PATH} />
    </div>
  );
}

/** Awsa-style minimal footer: outlined wordmark, compact nav, credits (newhomepage only). */
export function NhAwsaFooter() {
  const year = new Date().getFullYear();
  const locale = useLocale();
  const layoutFooter = useSiteSectionContent('layout.footer', LAYOUT_FOOTER_DEFAULTS);

  const footerNavItems = useMemo(() => {
    const rows = parseSiteContentPairs(layoutFooter.col1Links);
    const mapped = rows
      .filter((r) => r.left.trim() && r.right.trim())
      .map((r) => ({ label: r.left.trim(), href: r.right.trim() }));
    if (mapped.length > 0) return mapped.slice(0, 6);
    return NH_FOOTER_NAV.map((item) => ({ label: item.label, href: item.href }));
  }, [layoutFooter.col1Links]);

  const copyrightEntity = (layoutFooter.copyrightEntity || '').trim() || 'Agile Media Solutions';

  return (
    <footer className="footer nh-awsa-minimal-footer" id="footer">
      <div className="nh-awsa-minimal-footer__inner">
        <div className="nh-awsa-minimal-footer__wordmark" aria-label="Agile">
          AGILE
        </div>
        <nav className="nh-awsa-minimal-footer__nav" aria-label="Footer">
          {footerNavItems.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={localizeHref(item.href, locale)}
              className="nh-awsa-minimal-footer__link"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nh-awsa-minimal-footer__rule" aria-hidden />
        <div className="nh-awsa-minimal-footer__meta">
          <p className="nh-awsa-minimal-footer__copyright">
            © {year} {copyrightEntity}
          </p>
          <a
            className="nh-awsa-minimal-footer__credit"
            href="https://webflow.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered By Webflow
          </a>
        </div>
      </div>
    </footer>
  );
}
