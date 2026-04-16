import { headers } from 'next/headers';

import { AMS_PATHNAME_HEADER } from '@/lib/amsPathnameHeader';
import { getLocaleFromPathname, NEWHOMEPAGE_PATH, stripTrailingSlash, type AppLocale } from '@/lib/locale';
import { getLocaleFromCookies } from '@/lib/localeServer';

/**
 * Locale for SSR that matches `usePathname()` after `NextResponse.rewrite` strips the prefix.
 */
export async function getLocaleForRsc(): Promise<AppLocale> {
  const h = await headers();
  const raw = h.get(AMS_PATHNAME_HEADER)?.trim();
  if (raw) {
    const norm = stripTrailingSlash(raw);
    if (norm === NEWHOMEPAGE_PATH) {
      const fromCookie = await getLocaleFromCookies();
      if (fromCookie !== 'en') return fromCookie;
    }
    return getLocaleFromPathname(raw);
  }
  return getLocaleFromCookies();
}
