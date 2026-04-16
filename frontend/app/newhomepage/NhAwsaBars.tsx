'use client';

import Link from 'next/link';
import React from 'react';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import { useLocale } from '@/components/LocaleProvider';
import { localizeHref, t } from '@/lib/i18n';
import { NEWHOMEPAGE_PATH } from '@/lib/locale';
import { nh } from './content';

const CONCEPT_HOME = NEWHOMEPAGE_PATH;

export function NhAwsaNavbar() {
  return (
    <div className="nh-main-header-inherit">
      <TopBar />
      <Header />
    </div>
  );
}

export function NhAwsaFooter() {
  const year = new Date().getFullYear();
  const locale = useLocale();

  return (
    <section className="footer">
      <div className="w-clearfix container-4">
        <h1 className="herotext">{nh.heroMark}</h1>
        <div className="footer-wrapper-three">
          <div className="footer-block-three">
            <Link href={CONCEPT_HOME} className="nav-link">
              Home
            </Link>
            <Link href={localizeHref('/', locale)} className="nav-link">
              Main site
            </Link>
            <Link href={localizeHref('/privacy', locale)} className="nav-link">
              {t(locale, 'privacy')}
            </Link>
            <Link href={localizeHref('/terms', locale)} className="nav-link">
              {t(locale, 'terms')}
            </Link>
            <Link href={localizeHref('/cookies', locale)} className="nav-link">
              {t(locale, 'cookies')}
            </Link>
          </div>
        </div>
        <div className="footer-divider-two" />
        <div className="footer-bottom-2">
          <div className="footer-copyright">
            © {year} Agile Media Solutions ·{' '}
            <Link href={localizeHref('/contact', locale)} className="nav-link">
              {t(locale, 'navContact')}
            </Link>
          </div>
          <div className="footer-webflow">
            <div className="textsmall">Concept clone · Awsa Webflow layout</div>
          </div>
        </div>
      </div>
    </section>
  );
}
