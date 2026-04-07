import { cache } from 'react';
import { pagesApiOrigin } from '@/lib/pagesApiOrigin';

export type PublicInsightCategory = {
  id: number;
  name: string;
  slug: string;
};

export type PublicInsightPostListItem = {
  id: number;
  slug: string;
  title: string;
  meta: string | null;
  excerpt: string | null;
  image_url: string | null;
  media_class: string | null;
  order_index: number;
  category_id: number | null;
  category: PublicInsightCategory | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type PublicInsightPostDetail = PublicInsightPostListItem & {
  body: string | null;
};

export const getPublicInsightPosts = cache(async (): Promise<PublicInsightPostListItem[]> => {
  try {
    const res = await fetch(`${pagesApiOrigin()}/api/public/insight-posts`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as PublicInsightPostListItem[]) : [];
  } catch {
    return [];
  }
});

export const getPublicInsightPostBySlug = cache(
  async (slug: string): Promise<PublicInsightPostDetail | null> => {
    if (!slug?.trim()) return null;
    try {
      const enc = encodeURIComponent(slug.trim());
      const res = await fetch(`${pagesApiOrigin()}/api/public/insight-posts/${enc}`, {
        cache: 'no-store',
      });
      if (!res.ok) return null;
      return (await res.json()) as PublicInsightPostDetail;
    } catch {
      return null;
    }
  }
);
