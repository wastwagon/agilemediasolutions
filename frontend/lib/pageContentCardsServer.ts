import { cache } from 'react';
import { pagesApiOrigin } from '@/lib/pagesApiOrigin';

export type PublicPageContentCard = {
  id: number;
  title: string;
  body: string | null;
  image_url: string | null;
  list_label: string | null;
  list_items: string | null;
  order_index: number;
};

export const getPublicPageContentCards = cache(async (context: string): Promise<PublicPageContentCard[]> => {
  try {
    const res = await fetch(
      `${pagesApiOrigin()}/api/public/page-content-cards/${encodeURIComponent(context)}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as PublicPageContentCard[]) : [];
  } catch {
    return [];
  }
});
