import type { Metadata } from 'next';

import LegalPageBody from '@/components/LegalPageBody';
import { getPrivacyPageMetadata } from '@/lib/i18n/legalCopy';
import { getLocaleFromCookies } from '@/lib/localeServer';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  return getPrivacyPageMetadata(locale);
}

export default function PrivacyPage() {
  return <LegalPageBody variant="privacy" />;
}
