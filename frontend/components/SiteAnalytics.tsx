'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trackAnalyticsEvent } from '@/lib/analyticsClient';

export default function SiteAnalytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    void trackAnalyticsEvent('page_view', pathname);
  }, [pathname]);

  return null;
}
