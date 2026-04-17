'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import LocaleHtmlAttributes from './LocaleHtmlAttributes';
import SiteAnalytics from './SiteAnalytics';

/**
 * Global client shell: locale on `<html>`, analytics, and pass-through for route layouts.
 * Main site chrome (TopBar, Header, footer) lives in `app/(site)/layout.tsx` via `MainSiteChrome`.
 * `/newhomepage` is outside `(site)` so it never mounts the main header.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <>
      <LocaleHtmlAttributes />
      <SiteAnalytics />
      {children}
    </>
  );
}
