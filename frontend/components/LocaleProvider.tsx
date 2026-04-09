'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, type AppLocale } from '@/lib/locale';

const LocaleContext = createContext<AppLocale>('en');

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: AppLocale;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [locale, setLocale] = useState<AppLocale>(initialLocale);

  useEffect(() => {
    setLocale(getLocaleFromPathname(pathname ?? '/'));
  }, [pathname]);

  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): AppLocale {
  return useContext(LocaleContext);
}
