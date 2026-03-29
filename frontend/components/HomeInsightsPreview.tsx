import Link from 'next/link';
import React from 'react';

const PREVIEW_ITEMS = [
  {
    href: '/insights',
    meta: 'Press briefing · Q1 2026',
    title: 'What we learned convening trade and policy leaders',
    excerpt:
      'Key takeaways from summit-side conversations on intra-African trade narratives, institutional trust, and how briefings travel across capitals.',
    mediaClass: 'home-insights-media-briefing',
  },
  {
    href: '/insights',
    meta: 'Thought leadership',
    title: 'Governance stories that earn attention—and keep it',
    excerpt:
      'Why clarity, cadence, and evidence still outperform noise in high-stakes sectors, and how we structure editorial for long-term credibility.',
    mediaClass: 'home-insights-media-editorial',
  },
  {
    href: '/agile-press-group',
    meta: 'Agile Press Group',
    title: 'Syndication that extends your reach across African media',
    excerpt:
      'How our publishing desk pairs original reporting with licensed circulation so campaigns, institutions, and brands show up where audiences already read.',
    mediaClass: 'home-insights-media-syndication',
  },
] as const;

export default function HomeInsightsPreview() {
  return (
    <div className="home-insights-preview-grid">
      {PREVIEW_ITEMS.map((item) => (
        <Link key={item.title} href={item.href} className="home-insights-preview-card animate-on-scroll">
          <div className={`home-insights-preview-media card-image-placeholder ${item.mediaClass}`} aria-hidden="true" />
          <div className="home-insights-preview-body">
            <span className="home-insights-preview-meta">{item.meta}</span>
            <h3 className="home-insights-preview-title">{item.title}</h3>
            <p className="home-insights-preview-excerpt">{item.excerpt}</p>
            <span className="home-insights-preview-cta">Read more →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
