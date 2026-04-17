/** Shape returned by `GET /api/events` (see `HomePageClient`). */
export type HomeApiEvent = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url?: string;
};

export type NhEventDisplay = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  imageClass?: string;
};

const PLACEHOLDER_CLASSES = ['event-img-summit', 'event-img-trade-awards', 'event-img-jazz'] as const;

const FALLBACK_EVENTS: NhEventDisplay[] = [
  {
    id: -1,
    title: 'Africa Trade Summit',
    description: 'Accelerating Intra-African Trade, Investment, and Economic Transformation.',
    imageClass: 'event-img-summit',
  },
  {
    id: -2,
    title: 'Africa Trade Awards',
    description: "Celebrating Excellence Across the Continent's Trade Ecosystem.",
    imageClass: 'event-img-trade-awards',
  },
  {
    id: -3,
    title: 'Afro Jazz Festival',
    description: 'Celebrating the Soul of Africa Through Music, Art, and Culture.',
    imageClass: 'event-img-jazz',
  },
];

/** Up to three events for the homepage (API slice or static fallbacks). */
export function selectEventsForHomepage(apiEvents: HomeApiEvent[]): NhEventDisplay[] {
  if (!apiEvents.length) return FALLBACK_EVENTS;
  return apiEvents.slice(0, 3).map((e, i) => {
    const url = (e.image_url || '').trim();
    return {
      id: e.id,
      title: e.title,
      description: e.description,
      imageUrl: url || undefined,
      imageClass: url ? undefined : PLACEHOLDER_CLASSES[i % PLACEHOLDER_CLASSES.length],
    };
  });
}
