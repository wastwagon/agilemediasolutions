'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import {
  getInsightsFeaturedDefaults,
  getInsightFeaturedReadCta,
  normalizeMediaClass,
  parseInsightFeatured,
} from '@/lib/insightsFeatured';
import { useLocale } from '@/components/LocaleProvider';
import { localizeHref } from '@/lib/i18n';
import { useSiteSectionContent } from '@/lib/siteSectionCms';

type InsightListRow = {
  id: number;
  slug: string;
  title: string;
  meta: string | null;
  excerpt: string | null;
  image_url: string | null;
  media_class: string | null;
  order_index: number;
  category: { id: number; name: string; slug: string } | null;
};

type PreviewCard = {
  slug: string;
  meta: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  mediaClass: string;
};

export default function HomeInsightsPreview() {
  const locale = useLocale();
  const [apiPosts, setApiPosts] = useState<InsightListRow[] | null>(null);
  const featured = useSiteSectionContent('insights.featured', getInsightsFeaturedDefaults(locale));
  const readCta = useMemo(() => getInsightFeaturedReadCta(featured), [featured]);

  useEffect(() => {
    fetch('/api/public/insight-posts')
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => setApiPosts(Array.isArray(rows) ? rows : []))
      .catch(() => setApiPosts([]));
  }, []);

  const cards: PreviewCard[] = useMemo(() => {
    if (apiPosts !== null && apiPosts.length > 0) {
      return apiPosts.slice(0, 3).map((p) => {
        const kicker = [p.category?.name, p.meta].filter(Boolean).join(' · ');
        return {
          slug: p.slug,
          meta: kicker,
          title: p.title,
          excerpt: p.excerpt || '',
          imageUrl: p.image_url?.trim() || '',
          mediaClass: normalizeMediaClass(p.media_class || ''),
        };
      });
    }
    return parseInsightFeatured(featured).map((c) => ({
      slug: c.slug,
      meta: c.meta,
      title: c.title,
      excerpt: c.excerpt,
      imageUrl: c.imageUrl,
      mediaClass: c.mediaClass,
    }));
  }, [apiPosts, featured]);

  return (
    <div className="home-insights-preview-grid">
      {cards.map((item) => (
        <Link
          key={item.slug}
          href={localizeHref(`/insights/${item.slug}`, locale)}
          className="home-insights-preview-card animate-on-scroll"
        >
          {item.imageUrl ? (
            <div
              className="home-insights-preview-media home-insights-preview-media--image"
              style={{ backgroundImage: `url(${item.imageUrl})` }}
              aria-hidden="true"
            />
          ) : (
            <div
              className={`home-insights-preview-media card-image-placeholder ${item.mediaClass}`}
              aria-hidden="true"
            />
          )}
          <div className="home-insights-preview-body">
            <span className="home-insights-preview-meta">{item.meta}</span>
            <h3 className="home-insights-preview-title">{item.title}</h3>
            <p className="home-insights-preview-excerpt">{item.excerpt}</p>
            <span className="home-insights-preview-cta">{readCta}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
