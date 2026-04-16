import React from 'react';
import Link from 'next/link';
import SectionHeader from '../../components/SectionHeader';
import { getSiteSectionContent } from '@/lib/siteSectionCmsServer';
import { getPublicPageContentCards } from '@/lib/pageContentCardsServer';

export const metadata = {
  title: 'Agile Studio',
  description:
    'Discover Agile Studio production services in video, photography, design, audio, and post-production for strategic communications.',
};

function parseLineList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

const DEFAULT_STUDIO_OFFERING_IMAGES = [
  '/images/studio/offering-01.svg',
  '/images/studio/offering-02.svg',
  '/images/studio/offering-03.svg',
  '/images/studio/offering-04.svg',
  '/images/studio/offering-05.svg',
  '/images/studio/offering-06.svg',
];

function cardImageUrl(imageUrl: string | null | undefined, index: number): string {
  const u = imageUrl?.trim();
  if (u) return u;
  return DEFAULT_STUDIO_OFFERING_IMAGES[index % DEFAULT_STUDIO_OFFERING_IMAGES.length];
}

export default async function Page() {
  const copy = await getSiteSectionContent('studio.page', {
    heroLabel: 'Studio',
    heroTitle: 'Where Ideas Become Content. And Content Becomes Influence.',
    heroIntro:
      'Agile Studio is the creative production and content innovation arm of Agile Media Solutions. It is where strategic vision meets visual execution-where narratives take form through world-class media production, brand storytelling, and digital experiences.',
    heroSubIntro:
      'Our studio supports both internal campaigns and external clients with turnkey creative solutions across film, design, audio, photography, and experiential content.',
    sectionLabel: 'Production Stack',
    sectionTitle: 'What We Do',
    sectionLinkLabel: 'Book the studio',
    highlightsHeading: 'Studio Highlights',
    highlightsList:
      'On-location and in-studio production\nMultilingual voiceovers and regional content adaptation\nDrone and aerial videography\nLivestream event coverage and hybrid setup support\nDigital content packaging for web, mobile, and social',
    clientsHeading: 'Studio Clients & Collaborators',
    clientsSubtitle:
      'We serve public institutions, CEOs, NGOs, influencers, creatives, campaign teams, and international brands with production work that meets strategic objectives and surpasses creative expectations.',
    ctaPrimary: 'Book the Studio',
    ctaSecondary: 'View Our Production Portfolio',
    ctaTertiary: 'Commission a Project',
  });

  const offeringCards = await getPublicPageContentCards('studio');
  const highlightsList = parseLineList(copy.highlightsList);

  return (
    <main className="services-page-main creative-public-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">{copy.heroLabel}</span>
          <h1 className="page-hero-title">{copy.heroTitle}</h1>
          <p className="page-hero-tagline">{copy.heroIntro}</p>
          <p className="page-hero-tagline" style={{ marginTop: 'var(--space-md)' }}>
            {copy.heroSubIntro}
          </p>
        </div>
      </div>

      <section className="section section-digital" id="studio">
        <div className="section-inner animate-on-scroll">
          <SectionHeader
            variant="inner"
            label={copy.sectionLabel}
            title={copy.sectionTitle}
            linkHref="/contact#contact"
            linkLabel={copy.sectionLinkLabel}
            titleClassName="digital-title"
          />

          <div className="digital-offerings">
            {offeringCards.map((card, idx) => {
              const bullets = parseLineList(card.list_items);
              return (
                <div key={card.id} className="digital-offering">
                  <div className="digital-offering-media">
                    <img
                      src={cardImageUrl(card.image_url, idx)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="digital-offering-content">
                    <h4 className="digital-offering-title">{card.title}</h4>
                    {card.body ? <p className="digital-offering-desc">{card.body}</p> : null}
                    {card.list_label?.trim() ? (
                      <p className="digital-list-label">{card.list_label.trim()}</p>
                    ) : null}
                    {bullets.length > 0 ? (
                      <ul className="digital-list">
                        {bullets.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-2xl)' }}>
            {copy.highlightsHeading}
          </h3>
          <ul className="digital-list">
            {highlightsList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            {copy.clientsHeading}
          </h3>
          <p className="digital-intro">{copy.clientsSubtitle}</p>

          <div className="section-cta-center digital-cta-buttons" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link href="/contact#contact" className="btn btn-primary">
              {copy.ctaPrimary}
            </Link>
            <Link href="/case-studies" className="btn btn-outline">
              {copy.ctaSecondary}
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              {copy.ctaTertiary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
