import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHeader from '../../components/SectionHeader';
import { getInsightsPageDefaults, getInsightsPageMetadata } from '@/lib/i18n/pageDefaults';
import { localizeHref } from '@/lib/i18n';
import { getLocaleForRsc } from '@/lib/localeRequest';
import { getSiteSectionContent } from '@/lib/siteSectionCmsServer';
import {
  getInsightsFeaturedDefaults,
  getInsightFeaturedReadCta,
  normalizeMediaClass,
  parseInsightFeatured,
} from '@/lib/insightsFeatured';
import { getPublicInsightPosts } from '@/lib/insightPostsServer';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleForRsc();
  return getInsightsPageMetadata(locale);
}

function parseLineList(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export default async function Page() {
  const locale = await getLocaleForRsc();
  const copy = await getSiteSectionContent('insights.page', getInsightsPageDefaults(locale));
  const insightsBullets = parseLineList(copy.insightsBullets);
  const pressBullets = parseLineList(copy.pressBullets);

  const featuredFlat = await getSiteSectionContent('insights.featured', getInsightsFeaturedDefaults(locale));
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
                {copy.featuredLabel}
              </span>
              <h2 className="section-title">{copy.featuredTitle}</h2>
            </div>
            <div className="insights-featured-preview-grid">
              {featuredCards.map((item) => (
                <Link
                  key={item.slug}
                  href={localizeHref(`/insights/${item.slug}`, locale)}
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
            linkHref={localizeHref('/agile-press-group', locale)}
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
                <Link href={localizeHref('/contact#contact', locale)} className="btn btn-outline">
                  {copy.insightsCtaPrimary}
                </Link>
                <Link href={localizeHref('/contact#contact', locale)} className="btn btn-outline">
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
                <Link href={localizeHref('/contact#contact', locale)} className="btn btn-outline">
                  {copy.pressCtaPrimary}
                </Link>
                <Link href={localizeHref('/contact#contact', locale)} className="btn btn-outline">
                  {copy.pressCtaSecondary}
                </Link>
                <Link href={localizeHref('/contact#contact', locale)} className="btn btn-outline">
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
                <Link href={localizeHref('/services', locale)} className="btn btn-outline">
                  {copy.supportCtaPrimary}
                </Link>
                <Link href={localizeHref('/contact#contact', locale)} className="btn btn-outline">
                  {copy.supportCtaSecondary}
                </Link>
              </div>
            </article>
          </div>
          <p className="section-subtitle centered" style={{ marginTop: 'var(--space-xl)' }}>
            {copy.finalSubtitle}
          </p>
          <div className="section-cta-center">
            <Link href={localizeHref('/#newsletter', locale)} className="btn btn-primary">
              {copy.finalCta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
