import React from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import { getSiteSectionContent } from '@/lib/siteSectionCmsServer';
import { getPublicPageContentCards } from '@/lib/pageContentCardsServer';

export const metadata = {
  title: 'Digital Engagement & Social Media',
  description:
    'Activate digital audiences with Agile Media Solutions social media strategy, audience intelligence, crisis support, and analytics.',
};

function parseLineList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

const DEFAULT_OFFERING_IMAGES = [
  '/images/digital/offering-01.svg',
  '/images/digital/offering-02.svg',
  '/images/digital/offering-03.svg',
  '/images/digital/offering-04.svg',
  '/images/digital/offering-05.svg',
  '/images/digital/offering-06.svg',
  '/images/digital/offering-07.svg',
  '/images/digital/offering-08.svg',
  '/images/digital/offering-09.svg',
  '/images/digital/offering-10.svg',
];

function cardImageUrl(imageUrl: string | null | undefined, index: number): string {
  const u = imageUrl?.trim();
  if (u) return u;
  return DEFAULT_OFFERING_IMAGES[index % DEFAULT_OFFERING_IMAGES.length];
}

export default async function Page() {
  const copy = await getSiteSectionContent('digital-engagement.page', {
    heroLabel: 'Digital engagement',
    heroTitle: 'Where Audiences Are Built, Messages Amplified, and Influence Engineered',
    heroIntro:
      'At Agile Media Solutions, social media is not just a platform-it is a political tool, a public square, a brand amplifier, and an intelligence system. We help institutions, leaders, movements, and brands activate digital audiences with precision, creativity, and credibility.',
    heroSubIntro:
      "Whether you're launching a campaign, shaping perception, engaging a community, or managing risk-we turn your objectives into algorithm-friendly, influence-driven digital executions.",
    sectionLabel: 'Digital',
    sectionTitle: 'Our Digital Strategy Offerings',
    sectionLinkLabel: 'Request a session',
    sectionIntro:
      'From platform strategy and creative production to analytics and verification-we design digital infrastructure that matches your mandate and your audiences.',
    offeringsHeading: 'How we can help',
    ctaHeading: "Let's Go Digital with Purpose",
    ctaText:
      'We treat digital space as infrastructure. Let Agile Media Solutions power your online influence with precision, agility, and clarity.',
    ctaPrimary: 'Request a Social Media Strategy Session',
    ctaSecondary: 'View Our Digital Case Studies',
    ctaTertiary: 'Engage Our Studio',
  });

  const offeringCards = await getPublicPageContentCards('digital-engagement');

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
      <section className="section section-digital" id="digital">
        <div className="section-inner animate-on-scroll">
          <SectionHeader
            variant="inner"
            label={copy.sectionLabel}
            title={copy.sectionTitle}
            linkHref="/contact#contact"
            linkLabel={copy.sectionLinkLabel}
            titleClassName="digital-title"
          />
          <p className="digital-intro">{copy.sectionIntro}</p>
          <h3 className="digital-offerings-heading">{copy.offeringsHeading}</h3>
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
          <div className="digital-cta-block">
            <h3 className="digital-cta-heading">{copy.ctaHeading}</h3>
            <p className="digital-cta-text">{copy.ctaText}</p>
            <div className="section-cta-center digital-cta-buttons">
              <Link href="/contact#contact" className="btn btn-primary">
                {copy.ctaPrimary}
              </Link>
              <Link href="/case-studies" className="btn btn-outline">
                {copy.ctaSecondary}
              </Link>
              <Link href="/studio" className="btn btn-outline">
                {copy.ctaTertiary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
