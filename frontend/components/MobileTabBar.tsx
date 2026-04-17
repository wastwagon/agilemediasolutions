'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { stripLocalePrefix, withLocalePrefix } from '@/lib/locale';
import { useLocale } from '@/components/LocaleProvider';
import { t } from '@/lib/i18n';
import './MobileTabBar.css';

export default function MobileTabBar() {
  const pathname = usePathname();
  const locale = useLocale();
  const plainPathname = stripLocalePrefix(pathname || '/');
  const navDir = locale === 'ar' ? 'rtl' : 'ltr';
  const tabItems = [
    { label: t(locale, 'navHome'), href: '/', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { label: t(locale, 'navSectors'), href: '/sectors', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg> },
    { label: t(locale, 'navServices'), href: '/services', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> },
    { label: t(locale, 'navEvents'), href: '/signature-events', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
    { label: t(locale, 'navContact'), href: '/contact', isContact: true, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> },
  ];

  return (
    <nav
      className="mobile-tab-bar notranslate"
      aria-label="Primary mobile navigation"
      translate="no"
      lang={locale}
      dir={navDir}
    >
      {tabItems.map((item) => {
        const hrefBase = item.isContact ? withLocalePrefix('/contact', locale) : item.href;
        const href = item.isContact ? `${hrefBase}#contact` : hrefBase;
        const basePath = hrefBase.split('#')[0];
        const isActive = plainPathname === basePath;
        return (
        <Link 
          key={item.label} 
          href={href} 
          className={`tab-item ${isActive ? 'active' : ''}`}
          aria-current={isActive ? 'page' : undefined}
        >
          <div className="tab-icon">{item.icon}</div>
          <span className="tab-label" lang={locale} dir={navDir}>{item.label}</span>
        </Link>
        );
      })}
    </nav>
  );
}
