import type { Metadata } from 'next';

import LegalPageBody from '@/components/LegalPageBody';
import { getCookiesPageMetadata } from '@/lib/i18n/legalCopy';
import { getLocaleForRsc } from '@/lib/localeRequest';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleForRsc();
  return getCookiesPageMetadata(locale);
}

export default function CookiesPage() {
  return <LegalPageBody variant="cookies" />;
}
