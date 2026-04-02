import React from 'react';
import Link from 'next/link';
import SectionHeader from '../../components/SectionHeader';
import { getSiteSectionContent } from '@/lib/siteSectionCmsServer';
import {
  INSIGHTS_FEATURED_DEFAULTS,
  getInsightFeaturedReadCta,
  normalizeMediaClass,
  parseInsightFeatured,
} from '@/lib/insightsFeatured';
import { getPublicInsightPosts } from '@/lib/insightPostsServer';

export const metadata = {
  title: 'Insights & Press Room',
  description: 'Read insights, press updates, and media resources from Agile Media Solutions and the Agile Press Group.',
};

function parseLineList(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export default async function Page() {
  const copy = await getSiteSectionContent('insights.page', {
    heroLabel: 'Insights & press room',
    heroTitle: 'Where Strategy Meets Story. And Headlines Meet Meaning.',
    heroTagline:
      'This is where Agile Media Solutions shares bold ideas, sector intelligence, creative insights, and media highlights. From original commentary to campaign coverage, this section brings together our perspective and presence in the media landscape.',
    sectionLabel: 'Editorial Desk',
    sectionTitle: 'Insights & Press Room',
    sectionLinkLabel: 'Visit press group',
    insightsHeading: 'Insights',
    insightsLead: 'Our voice. Our vision.',
    insightsBody:
      'We believe communication is a tool for shaping society-not just sharing news. Through essays, articles, and guest features, we share insights on:',
    insightsBullets:
      'Strategic communications trends across Africa and globally\nNarrative power in trade, policy, and governance\nBrand storytelling in complex or high-trust sectors\nCampaign design, media innovation, and impact communications\nLeadership messaging and institutional credibility',
    insightsCtaPrimary: 'Read Our Latest Insights',
    insightsCtaSecondary: 'Submit a Guest Article',
    pressHeading: 'Press Room',
    pressLead: 'News, launches, and media coverage.',
    pressBody: 'Stay up to date with Agile Media Solutions in the news and on the record.',
    pressBullets:
      'Announcements and client wins\nEvent media kits and summit briefings\nPress releases and thought leader mentions\nExecutive op-eds and campaign launches\nAwards, partnerships, and public recognitions',
    pressCtaPrimary: 'Browse Press Releases',
    pressCtaSecondary: 'Access Media Kits',
    pressCtaTertiary: 'Download Executive Photos and Bios',
    supportHeading: 'Media Circulation Support',
    supportBody:
      'Agile Media Solutions also facilitates press release writing, distribution, and media engagement on behalf of select clients through our Corporate Communications & Circulation Service.',
    supportCtaPrimary: 'Learn More About Media Support',
    supportCtaSecondary: 'Request Distribution Assistance',
    finalSubtitle: 'Want to be the first to receive our insights?',
    finalCta: 'Subscribe to the Agile Brief',
  });
  const insightsBullets = parseLineList(copy.insightsBullets);
  const pressBullets = parseLineList(copy.pressBullets);

  const featuredFlat = await getSiteSectionContent('insights.featured', INSIGHTS_FEATURED_DEFAULTS);
  const dbPosts = await getPublicInsightPosts();
  const featuredCards =
    dbPosts.length > 0
      ? dbPosts.map((p) => ({
          slug: p.slug,
          meta: [p.category?.name, p.meta].filter(Boolean).join(' · '),
          title: p.title,
          excerpt: p.excerpt || '',
          imageUrl: p.image_url?.trim() || '',
          mediaClass: normalizeMediaClass(p.media_class || ''),
        }))
      : parseInsightFeatured(featuredFlat);
  const featuredReadCta = getInsightFeaturedReadCta(featuredFlat);

  return (
    <main className="services-page-main creative-public-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">{copy.heroLabel}</span>
          <h1 className="page-hero-title">{copy.heroTitle}</h1>
          <p className="page-hero-tagline">
            {copy.heroTagline}
          </p>
        </div>
      </div>
      {featuredCards.length > 0 ? (
        <section className="section section-insights-featured-preview" aria-labelledby="insights-featured-heading">
          <div className="section-inner">
            <div className="insights-featured-preview-head">
              <span className="section-label" id="insights-featured-heading">
                From the desk
              </span>
              <h2 className="section-title">Featured briefings &amp; analysis</h2>
            </div>
            <div className="insights-featured-preview-grid">
              {featuredCards.map((item) => (
                <Link
                  key={item.slug}
                  href={`/insights/${item.slug}`}
                  className="insights-featured-preview-card"
                >
                  {item.imageUrl ? (
                    <div
                      className="insights-featured-preview-media insights-featured-preview-media--image"
                      style={{ backgroundImage: `url(${item.imageUrl})` }}
                      aria-hidden="true"
                    />
                  ) : (
                    <div
                      className={`insights-featured-preview-media card-image-placeholder ${item.mediaClass}`}
                      aria-hidden="true"
                    />
                  )}
                  <div className="insights-featured-preview-body">
                    <span className="insights-featured-preview-meta">{item.meta}</span>
                    <h3 className="insights-featured-preview-title">{item.title}</h3>
                    <p className="insights-featured-preview-excerpt">{item.excerpt}</p>
                    <span className="insights-featured-preview-cta">{featuredReadCta}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="section section-insights" id="insights">
        <div className="section-inner animate-on-scroll">
          <SectionHeader
            variant="inner"
            label={copy.sectionLabel}
            title={<>{copy.sectionTitle}</>}
            linkHref="/agile-press-group"
            linkLabel={copy.sectionLinkLabel}
          />
          <div className="insights-grid">
            <article className="insight-card animate-on-scroll">
              <h3>{copy.insightsHeading}</h3>
              <p>
                <strong>{copy.insightsLead}</strong>
              </p>
              <p>{copy.insightsBody}</p>
              <ul style={{ margin: '0.5rem 0 1rem', paddingLeft: '1.25rem' }}>
                {insightsBullets.map((item) => (
                  <li key={item} style={{ marginBottom: '0.35rem' }}>{item}</li>
                ))}
              </ul>
              <div className="section-cta-center" style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                <Link href="/contact#contact" className="btn btn-outline">
                  {copy.insightsCtaPrimary}
                </Link>
                <Link href="/contact#contact" className="btn btn-outline">
                  {copy.insightsCtaSecondary}
                </Link>
              </div>
            </article>
            <article className="insight-card animate-on-scroll">
              <h3>{copy.pressHeading}</h3>
              <p>
                <strong>{copy.pressLead}</strong>
              </p>
              <p>{copy.pressBody}</p>
              <ul style={{ margin: '0.5rem 0 1rem', paddingLeft: '1.25rem' }}>
                {pressBullets.map((item) => (
                  <li key={item} style={{ marginBottom: '0.35rem' }}>{item}</li>
                ))}
              </ul>
              <div className="section-cta-center" style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                <Link href="/contact#contact" className="btn btn-outline">
                  {copy.pressCtaPrimary}
                </Link>
                <Link href="/contact#contact" className="btn btn-outline">
                  {copy.pressCtaSecondary}
                </Link>
                <Link href="/contact#contact" className="btn btn-outline">
                  {copy.pressCtaTertiary}
                </Link>
              </div>
            </article>
            <article className="insight-card animate-on-scroll">
              <h3>{copy.supportHeading}</h3>
              <p>
                {copy.supportBody}
              </p>
              <div className="section-cta-center" style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                <Link href="/services" className="btn btn-outline">
                  {copy.supportCtaPrimary}
                </Link>
                <Link href="/contact#contact" className="btn btn-outline">
                  {copy.supportCtaSecondary}
                </Link>
              </div>
            </article>
          </div>
          <p className="section-subtitle centered" style={{ marginTop: 'var(--space-xl)' }}>
            {copy.finalSubtitle}
          </p>
          <div className="section-cta-center">
            <Link href="/#newsletter" className="btn btn-primary">
              {copy.finalCta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
