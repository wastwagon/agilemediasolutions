'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, stripLocalePrefix, type AppLocale } from '@/lib/locale';
import './LanguageSwitcher.css';

const OPTIONS: { locale: AppLocale; label: string; native: string }[] = [
  { locale: 'en', label: 'English', native: 'English' },
  { locale: 'fr', label: 'French', native: 'Français' },
  { locale: 'pt', label: 'Portuguese', native: 'Português' },
  { locale: 'ar', label: 'Arabic', native: 'العربية' },
];

function clearLocaleCookie() {
  document.cookie = 'ams_locale=; Path=/; Max-Age=0; SameSite=Lax';
}

export default function LanguageSwitcher({ variant = 'header' }: { variant?: 'header' | 'compact' }) {
  const pathname = usePathname() || '/';
  const active = getLocaleFromPathname(pathname);
  const basePath = stripLocalePrefix(pathname);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = OPTIONS.find((o) => o.locale === active) ?? OPTIONS[0];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div
      ref={rootRef}
      className={`language-switcher language-switcher--${variant}`}
    >
      <button
        type="button"
        className="language-switcher__trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="language-switcher__globe" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </span>
        <span className="language-switcher__current">{current.native}</span>
        <span className={`language-switcher__chev ${open ? 'open' : ''}`} aria-hidden>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {open && (
        <ul className="language-switcher__menu" role="listbox">
          {OPTIONS.map((opt) => {
            const href =
              opt.locale === 'en'
                ? basePath
                : `/${opt.locale}${basePath === '/' ? '' : basePath}`;
            const isActive = opt.locale === active;
            return (
              <li key={opt.locale} role="option" aria-selected={isActive}>
                <Link
                  href={href}
                  className={isActive ? 'active' : undefined}
                  onClick={() => {
                    if (opt.locale === 'en') {
                      clearLocaleCookie();
                    } else {
                      document.cookie = `ams_locale=${opt.locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
                    }
                    setOpen(false);
                  }}
                >
                  <span className="language-switcher__native">{opt.native}</span>
                  <span className="language-switcher__hint">{opt.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
