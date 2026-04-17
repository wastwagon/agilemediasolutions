import Link from 'next/link';
import React from 'react';

export type HomeFeaturedStudy = {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  client_name?: string;
  created_at?: string;
  updated_at?: string;
};

const FALLBACK_MEDIA = ['highlight-img-public-sector', 'highlight-img-sportz'] as const;

const STATIC_SPOTLIGHTS = [
  {
    href: '/case-studies',
    tag: 'Institutions',
    title: 'Public sector narrative strategy',
    line: 'Integrated communications for trade, policy visibility, and regional positioning.',
    mediaClass: FALLBACK_MEDIA[0],
  },
  {
    href: '/case-studies',
    tag: 'Campaigns',
    title: 'Pan-African brand launch',
    line: 'Youth-led digital activation with measurable reach across key markets.',
    mediaClass: FALLBACK_MEDIA[1],
  },
] as const;

function truncate(text: string, max: number) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

type DisplayItem = {
  href: string;
  tag: string;
  title: string;
  line: string;
  imageUrl?: string;
  mediaClass: string;
};

function buildItems(studies?: HomeFeaturedStudy[] | null): DisplayItem[] {
  if (studies && studies.length >= 2) {
    return studies.slice(0, 2).map((s, i) => {
      const trimmed = typeof s.image_url === 'string' ? s.image_url.trim() : '';
      return {
        href: '/case-studies',
        tag: s.client_name?.trim() || 'Case study',
        title: s.title,
        line: truncate(s.description, 150),
        imageUrl: trimmed || undefined,
        mediaClass: FALLBACK_MEDIA[i % FALLBACK_MEDIA.length],
      };
    });
  }
  return STATIC_SPOTLIGHTS.map((s) => ({ ...s, imageUrl: undefined }));
}

export default function HomeFeaturedWork({ studies }: { studies?: HomeFeaturedStudy[] | null }) {
  const items = buildItems(studies);

  return (
    <div className="home-featured-work-grid">
      {items.map((item, index) => (
        <Link key={`${item.tag}-${item.title}-${index}`} href={item.href} className="home-featured-work-card">
          <div
            className={`home-featured-work-media card-image-placeholder ${item.imageUrl ? 'has-image' : item.mediaClass}`}
            style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
            aria-hidden="true"
          />
          <div className="home-featured-work-body">
            <span className="home-featured-work-tag">{item.tag}</span>
            <h3 className="home-featured-work-title">{item.title}</h3>
            <p className="home-featured-work-desc">{item.line}</p>
            <span className="home-featured-work-cta">View case studies →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
