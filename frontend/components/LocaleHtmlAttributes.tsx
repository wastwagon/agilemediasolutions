'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/locale';

const LANG: Record<string, string> = {
  en: 'en',
  fr: 'fr',
  pt: 'pt',
  ar: 'ar',
};

export default function LocaleHtmlAttributes() {
  const pathname = usePathname() || '/';
  const locale = getLocaleFromPathname(pathname);

  useEffect(() => {
    const html = document.documentElement;
    const lang = LANG[locale] ?? 'en';
    html.setAttribute('lang', lang);
    html.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  }, [locale]);

  return null;
}
