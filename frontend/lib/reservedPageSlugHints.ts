import reservedSlugList from '@/config/reserved-slugs.json';

/** Slugs handled by `app/<slug>/page.tsx` (or similar), not by the block-based `app/[slug]/page.tsx` CMS renderer. */
export const RESERVED_PAGE_SLUGS = new Set<string>(reservedSlugList as string[]);

/**
 * Primary Site Content section that drives on-site copy for that URL.
 * Omitted slugs: legal/static pages or no single section.
 */
export const RESERVED_SLUG_PRIMARY_SITE_SECTION: Partial<Record<string, string>> = {
  about: 'about.page',
  contact: 'contact.page',
  services: 'services.page',
  brands: 'brands.page',
  sectors: 'sectors.page',
  studio: 'studio.page',
  careers: 'careers.page',
  partnerships: 'partnerships.page',
  'case-studies': 'case-studies.page',
  'signature-events': 'signature-events.page',
  'digital-engagement': 'digital-engagement.page',
  'agile-press-group': 'agile-press-group.page',
  insights: 'insights.page',
};

export function siteContentSectionAnchorId(sectionKey: string): string {
  return `site-section-${sectionKey.replace(/\./g, '-')}`;
}
