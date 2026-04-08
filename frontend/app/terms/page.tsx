import type { Metadata } from 'next';

import LegalPageBody from '@/components/LegalPageBody';
import { getTermsPageMetadata } from '@/lib/i18n/legalCopy';
import { getLocaleFromCookies } from '@/lib/localeServer';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  return getTermsPageMetadata(locale);
}

export default function TermsPage() {
  return <LegalPageBody variant="terms" />;
}
