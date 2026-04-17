import type { Metadata } from 'next';

import LegalPageBody from '@/components/LegalPageBody';
import { getTermsPageMetadata } from '@/lib/i18n/legalCopy';
import { getLocaleForRsc } from '@/lib/localeRequest';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleForRsc();
  return getTermsPageMetadata(locale);
}

export default function TermsPage() {
  return <LegalPageBody variant="terms" />;
}
