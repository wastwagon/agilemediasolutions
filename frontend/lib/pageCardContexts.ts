export const PAGE_CARD_CONTEXT_SLUGS = ['digital-engagement', 'studio'] as const;

export type PageCardContextSlug = (typeof PAGE_CARD_CONTEXT_SLUGS)[number];

export function isPageCardContext(slug: string): slug is PageCardContextSlug {
  return (PAGE_CARD_CONTEXT_SLUGS as readonly string[]).includes(slug);
}

export const PAGE_CARD_CONTEXT_META: Record<
  PageCardContextSlug,
  { label: string; publicPath: string; adminSubtitle: string }
> = {
  'digital-engagement': {
    label: 'Digital Engagement',
    publicPath: '/digital-engagement',
    adminSubtitle: 'Cards appear in the “How we can help” grid on the Digital Engagement page. Add, reorder, or hide cards anytime.',
  },
  studio: {
    label: 'Studio cards',
    publicPath: '/studio',
    adminSubtitle: 'Cards appear in the “What We Do” grid on the Studio page. Add, reorder, or hide cards anytime.',
  },
};
