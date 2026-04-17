'use client';

import { useEffect } from 'react';
import { useLocale } from '@/components/LocaleProvider';

const LANG: Record<string, string> = {
  en: 'en',
  fr: 'fr',
  pt: 'pt',
  ar: 'ar',
};

export default function LocaleHtmlAttributes() {
  const locale = useLocale();

  useEffect(() => {
    const html = document.documentElement;
    const lang = LANG[locale] ?? 'en';
    html.setAttribute('lang', lang);
    html.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  }, [locale]);

  return null;
}
