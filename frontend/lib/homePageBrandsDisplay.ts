/** Shape returned by `GET /api/brands` (see `HomePageClient`). */
export type HomeApiBrand = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  website_url?: string;
};

export type NhBrandDisplay = {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  imageClass?: string;
};

const PLACEHOLDER_CLASSES = ['brand-img-leaders', 'brand-img-sports', 'brand-img-news'] as const;

/** Same three fallback cards as `HomePageClient` when the API returns no brands. */
const FALLBACK_BRANDS: NhBrandDisplay[] = [
  {
    id: -1,
    name: 'African Leaders Magazine',
    description:
      'A continental platform spotlighting leadership, policy, and governance across Africa.',
    imageClass: 'brand-img-leaders',
  },
  {
    id: -2,
    name: 'Africa Sports Magazine',
    description:
      'Highlighting the athletes, leagues, and moments driving Africa\'s sporting evolution.',
    imageClass: 'brand-img-sports',
  },
  {
    id: -3,
    name: 'Africa News Bulletin',
    description:
      'A daily newswire delivering curated updates on politics, economy, institutions, and regional affairs.',
    imageClass: 'brand-img-news',
  },
];

/** Up to three cards for the homepage row (API slice or localized fallbacks). */
export function selectBrandsForHomepage(apiBrands: HomeApiBrand[]): NhBrandDisplay[] {
  if (!apiBrands.length) return FALLBACK_BRANDS;
  return apiBrands.slice(0, 3).map((b, i) => {
    const url = (b.image_url || '').trim();
    return {
      id: b.id,
      name: b.name,
      description: b.description,
      imageUrl: url || undefined,
      imageClass: url ? undefined : PLACEHOLDER_CLASSES[i % PLACEHOLDER_CLASSES.length],
    };
  });
}
