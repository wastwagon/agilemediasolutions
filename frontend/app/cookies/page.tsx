import type { Metadata } from 'next';

import LegalPageBody from '@/components/LegalPageBody';
import { getCookiesPageMetadata } from '@/lib/i18n/legalCopy';
import { getLocaleFromCookies } from '@/lib/localeServer';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  return getCookiesPageMetadata(locale);
}

export default function CookiesPage() {
  return <LegalPageBody variant="cookies" />;
}
