import type { AppLocale } from '@/lib/locale';
import { getFallbackHomeServices, getServiceHighlightDefaults } from '@/lib/i18n/pageDefaults';

/** Shape used by `/api/services` and `getFallbackHomeServices`. */
export type HomePageServiceSource = {
  id: number;
  title: string;
  description: string;
  highlights?: string | null;
  icon: string;
};

export function parseHomeServiceHighlights(value: string | null | undefined, locale: AppLocale): string[] {
  const fallback = getServiceHighlightDefaults(locale);
  if (!value) return fallback;
  const items = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return items.length > 0 ? items : fallback;
}

/** Same merge as `HomePageClient`: up to four rows, API first then localized fallbacks. */
export function mergeHomeServicesForDisplay(
  apiServices: HomePageServiceSource[],
  locale: AppLocale,
): HomePageServiceSource[] {
  const fallbackHomeServices = getFallbackHomeServices(locale);
  const primary = apiServices.slice(0, 4);
  if (primary.length >= 4) return primary;

  const existingTitles = new Set(primary.map((s) => s.title.trim().toLowerCase()));
  const fill = fallbackHomeServices
    .filter((s) => !existingTitles.has(s.title.trim().toLowerCase()))
    .slice(0, 4 - primary.length);
  return [...primary, ...fill];
}

export function normalizeServiceIconToken(icon?: string | null) {
  if (!icon) return '';
  const trimmed = icon.trim();
  if (!trimmed) return '';
  if (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/')
  ) {
    return '';
  }
  return trimmed
    .toLowerCase()
    .replace(/^service-img-/, '')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/** Safe `url("…")` for CSS `background-image` (handles quotes in query strings). */
export function cssBackgroundImageUrl(raw: string | undefined): string | undefined {
  const u = (raw || '').trim();
  if (!u) return undefined;
  const safe = u.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `url("${safe}")`;
}

export function resolveServiceImage(icon?: string | null) {
  if (!icon) return { imageUrl: '', imageClass: 'service-img-strategic' };
  const trimmed = icon.trim();
  if (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/')
  ) {
    return { imageUrl: trimmed, imageClass: '' };
  }
  const normalized = normalizeServiceIconToken(trimmed);
  return { imageUrl: '', imageClass: normalized ? `service-img-${normalized}` : 'service-img-strategic' };
}
