import React from 'react';
import MainSiteChrome from '@/components/MainSiteChrome';

export default function SiteChromeLayout({ children }: { children: React.ReactNode }) {
  return <MainSiteChrome>{children}</MainSiteChrome>;
}
