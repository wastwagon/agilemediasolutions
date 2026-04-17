import type { Metadata } from 'next';

import LegalPageBody from '@/components/LegalPageBody';
import { getPrivacyPageMetadata } from '@/lib/i18n/legalCopy';
import { getLocaleForRsc } from '@/lib/localeRequest';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleForRsc();
  return getPrivacyPageMetadata(locale);
}

export default function PrivacyPage() {
  return <LegalPageBody variant="privacy" />;
}
