/** Public-site locale prefixes (English uses unprefixed URLs). */
export const LOCALE_PREFIXES = ['fr', 'pt', 'ar'] as const;
export type AppLocale = 'en' | (typeof LOCALE_PREFIXES)[number];

/** Concept route is only registered at this path (no `/fr/newhomepage` page file). */
export const NEWHOMEPAGE_PATH = '/newhomepage' as const;

export function stripTrailingSlash(pathname: string): string {
  const p = pathname || '/';
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
  return p;
}

/** Read `ams_locale` from a `document.cookie`-style string (middleware + LanguageSwitcher set this). */
export function parseAmsLocaleCookie(cookieString: string): AppLocale | null {
  const m = cookieString.match(/(?:^|; )ams_locale=([^;]+)/);
  const v = m?.[1]?.trim();
  if (v === 'fr' || v === 'pt' || v === 'ar') return v;
  return null;
}

/**
 * Locale from URL prefix, or — on `/newhomepage` only — from `ams_locale` when the path is unprefixed.
 */
export function getLocaleFromPathnameOrNewhomepageCookie(
  pathname: string | null,
  cookieDocument: string | null | undefined,
): AppLocale {
  const path = pathname ?? '/';
  const norm = stripTrailingSlash(path);
  const fromPath = getLocaleFromPathname(path);
  if (fromPath !== 'en') return fromPath;
  if (norm === NEWHOMEPAGE_PATH && typeof cookieDocument === 'string') {
    const c = parseAmsLocaleCookie(cookieDocument);
    if (c) return c;
  }
  return 'en';
}

export function getLocaleFromPathname(pathname: string | null): AppLocale {
  if (!pathname) return 'en';
  const seg = pathname.split('/').filter(Boolean)[0];
  if (seg && LOCALE_PREFIXES.includes(seg as (typeof LOCALE_PREFIXES)[number])) {
    return seg as AppLocale;
  }
  return 'en';
}

/** Path without a leading /fr|/pt|/ar segment. */
export function stripLocalePrefix(pathname: string): string {
  const m = pathname.match(/^\/(fr|pt|ar)(\/.*)?$/);
  if (!m) return pathname || '/';
  const rest = m[2];
  if (!rest || rest === '/') return '/';
  return rest;
}

export function withLocalePrefix(pathname: string, locale: AppLocale): string {
  const base = stripLocalePrefix(pathname);
  if (locale === 'en') return base === '' ? '/' : base;
  const path = base === '/' ? '' : base;
  return `/${locale}${path}`;
}
