import { cookies } from 'next/headers';
import type { AppLocale } from '@/lib/locale';

/** For server components: locale cookie set by middleware when visiting `/fr`, `/pt`, or `/ar` routes. */
export async function getLocaleFromCookies(): Promise<AppLocale> {
  const c = await cookies();
  const v = c.get('ams_locale')?.value;
  if (v === 'fr' || v === 'pt' || v === 'ar') return v;
  return 'en';
}
