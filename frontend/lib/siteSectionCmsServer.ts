import { cache } from 'react';
import { pagesApiOrigin } from '@/lib/pagesApiOrigin';

type SiteSectionsMap = Record<string, Record<string, string>>;

const fetchPublicSiteSections = cache(async (): Promise<SiteSectionsMap> => {
  try {
    const res = await fetch(`${pagesApiOrigin()}/api/public/site-sections`, {
      cache: 'no-store',
    });
    if (!res.ok) return {};
    const data = await res.json();
    return data && typeof data === 'object' ? (data as SiteSectionsMap) : {};
  } catch {
    return {};
  }
});

export async function getSiteSectionContent<T extends Record<string, string>>(
  sectionKey: string,
  defaults: T
): Promise<T> {
  const all = await fetchPublicSiteSections();
  const override = all?.[sectionKey];
  if (!override || typeof override !== 'object') return defaults;
  const next: Record<string, string> = { ...defaults };
  Object.keys(defaults).forEach((k) => {
    const v = override[k];
    if (typeof v === 'string' && v.trim()) next[k] = v;
  });
  return next as T;
}
