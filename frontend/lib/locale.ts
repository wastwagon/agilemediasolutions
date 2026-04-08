/** Public-site locale prefixes (English uses unprefixed URLs). */
export const LOCALE_PREFIXES = ['fr', 'pt', 'ar'] as const;
export type AppLocale = 'en' | (typeof LOCALE_PREFIXES)[number];

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
