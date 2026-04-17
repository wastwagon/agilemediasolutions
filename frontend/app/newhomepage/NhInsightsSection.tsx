'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocale } from '@/components/LocaleProvider';
import { getHomePageDefaults } from '@/lib/i18n/pageDefaults';
import {
  getInsightFeaturedReadCta,
  getInsightsFeaturedDefaults,
  normalizeMediaClass,
  parseInsightFeatured,
} from '@/lib/insightsFeatured';
import { cssBackgroundImageUrl } from '@/lib/homePageServicesDisplay';
import { withLocalePrefix } from '@/lib/locale';

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

export default function NhInsightsSection() {
  const locale = useLocale();
  const insightsCopy = useMemo(() => getHomePageDefaults(locale).insights, [locale]);
  const featured = useMemo(() => getInsightsFeaturedDefaults(locale), [locale]);
  const readCta = useMemo(() => getInsightFeaturedReadCta(featured), [featured]);

  const [apiPosts, setApiPosts] = useState<InsightListRow[] | null>(null);

  useEffect(() => {
    void fetch('/api/public/insight-posts')
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
    <section id="Insights" className="nh-insights-section" aria-labelledby="nh-insights-heading">
      <div className="max-width-large nh-insights-header">
        <div className="nh-insights-title-row" data-nh-reveal>
          <div className="nh-insights-titles">
            <p className="nh-section-kicker nh-insights-kicker">{insightsCopy.label}</p>
            <h2 id="nh-insights-heading" className="heading2 nh-insights-heading-title">
              <span className="bold-text">{insightsCopy.title}</span>
            </h2>
          </div>
          <Link
            href={withLocalePrefix(insightsCopy.linkHref || '/insights', locale)}
            className="nh-insights-updates-link w-inline-block"
          >
            {insightsCopy.linkLabel}
          </Link>
        </div>
        <p
          className="text-color-secondary max-description is-40 nh-section-blurb nh-section-blurb--align-left nh-insights-subtitle"
          data-nh-reveal
        >
          {insightsCopy.subtitle}
        </p>

        <div className="nh-insights-header-ctas" data-nh-reveal>
          <Link
            href={withLocalePrefix(insightsCopy.ctaPrimaryHref || '/agile-press-group', locale)}
            className="nh-insights-cta-primary w-inline-block"
          >
            {insightsCopy.ctaPrimary}
          </Link>
          <Link
            href={withLocalePrefix(insightsCopy.ctaSecondaryHref || '/insights', locale)}
            className="nh-services-cta-btn nh-insights-cta-secondary w-inline-block"
          >
            {insightsCopy.ctaSecondary}
          </Link>
        </div>
      </div>

      <div className="container-41 nh-insights-bento-outer">
        <div className="nh-insights-bento" data-nh-reveal>
          {cards.map((item, i) => {
            const isHero = i === 0;
            const href = withLocalePrefix(`/insights/${item.slug}`, locale);
            const mediaClassName = [
              'nh-insight-tile-media',
              isHero ? '' : 'nh-insight-tile-media--rail',
              item.imageUrl ? 'nh-insight-tile-media--image' : 'card-image-placeholder',
              !item.imageUrl ? item.mediaClass || 'home-insights-media-briefing' : '',
            ]
              .filter(Boolean)
              .join(' ');
            const mediaStyle = item.imageUrl
              ? {
                  backgroundImage: cssBackgroundImageUrl(item.imageUrl),
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat' as const,
                }
              : undefined;
            return (
              <Link
                key={item.slug}
                href={href}
                className={`nh-insight-tile w-inline-block${isHero ? ' nh-insight-tile--hero' : ' nh-insight-tile--rail'}`}
              >
                <div className={mediaClassName} style={mediaStyle} aria-hidden />
                <div className={`nh-insight-tile-body${isHero ? '' : ' nh-insight-tile-body--rail'}`}>
                  <span className="nh-insight-meta">{item.meta}</span>
                  <h3 className="nh-insight-title">{item.title}</h3>
                  <p className="paragraph nh-insight-excerpt">{item.excerpt}</p>
                  <span className="nh-insight-read">{readCta}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
