import React from 'react';
import Link from 'next/link';
import SectionHeader from '../../components/SectionHeader';
import { getSiteSectionContent } from '@/lib/siteSectionCmsServer';

export const metadata = {
  title: 'Partnerships',
  description: 'Partner with Agile Media Solutions for campaigns, content platforms, events, and visibility initiatives across Africa and beyond.',
};

function parseLineList(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseTitledCards(value: string): Array<{ title: string; desc: string }> {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split('::');
      return {
        title: (title || '').trim(),
        desc: rest.join('::').trim(),
      };
    })
    .filter((x) => x.title && x.desc);
}

export default async function Page() {
  const copy = await getSiteSectionContent('partnerships.page', {
    heroLabel: 'Partnerships',
    heroTitle: 'Collaborating for Visibility, Influence, and Impact',
    heroIntro:
      "Agile Media Solutions works in close partnership with institutions, businesses, governments, and creatives to co-create platforms, amplify causes, and deliver shared value. We don't just work for clients-we build strategic relationships that grow movements, markets, and messages.",
    heroSubIntro:
      'Whether you are launching a campaign, hosting a global summit, expanding across regions, or creating your own branded media platform-we offer the expertise, reach, and execution power to bring your vision to life.',
    sectionLabel: 'Collaboration',
    sectionTitle: 'Partnership pathways',
    sectionLinkLabel: 'Start a conversation',
    typesHeading: 'Types of Partnerships We Support',
    typesCards:
      'Institutional & Government Partnerships :: Co-branded campaigns, narrative strategy, public education drives, and national visibility initiatives.\nCorporate & Brand Collaborations :: Custom content platforms, sponsorship activations, product storytelling, and executive positioning.\nDevelopment & Philanthropic Engagements :: Program visibility, impact documentation, donor communications, and advocacy media.\nMedia & Content Co-Productions :: Joint ventures in content creation, special publications, brand integrations, and talent partnerships.\nEvent Media Partnerships :: Press management, stage production, and strategic amplification for high-level convenings.\nDiaspora, Arts & Cultural Platforms :: Partnerships with festivals, exhibitions, creative collectives, and Afro-global networks.',
    partnerWithUsHeading: 'Partner With Us To',
    partnerWithUsList:
      'Expand your brand or institution across African and global audiences\nBuild narrative power in a contested or complex media environment\nReach strategic audiences with content that builds trust and engagement\nLaunch or scale a campaign, media platform, or storytelling initiative\nCo-create publications, events, podcasts, or documentaries aligned with your mission',
    valuesHeading: 'Our Partnership Values',
    valuesList:
      'Purpose-led Collaboration\nShared Visibility and Voice\nAudience-Centric Storytelling\nExcellence in Execution\nEthical Communications Practice',
    ctaStripText: 'Tell us about your partnership idea.',
    ctaPrimary: 'Propose a Partnership',
    ctaSecondary: 'View Current Collaborators',
    ctaTertiary: 'Download Our Media Kit',
  });
  const typesCards = parseTitledCards(copy.typesCards);
  const partnerWithUsList = parseLineList(copy.partnerWithUsList);
  const valuesList = parseLineList(copy.valuesList);

  return (
    <main className="partnerships-page-main creative-public-page">
      <section className="section section-partnerships-page" id="partnerships">
        <div className="page-hero">
          <div className="page-hero-inner">
            <span className="page-hero-label">{copy.heroLabel}</span>
            <h1 className="page-hero-title">{copy.heroTitle}</h1>
            <p className="page-hero-tagline">
              {copy.heroIntro}
            </p>
            <p className="page-hero-tagline" style={{ marginTop: 'var(--space-md)', marginBottom: '0' }}>
              {copy.heroSubIntro}
            </p>
          </div>
        </div>

        <div className="partnerships-content">
          <SectionHeader
            variant="inner"
            label={copy.sectionLabel}
            title={copy.sectionTitle}
            linkHref="/contact#contact"
            linkLabel={copy.sectionLinkLabel}
          />
          <div className="partnerships-grid">
            <div className="partnerships-block partnerships-types">
              <h2 className="partnerships-heading">{copy.typesHeading}</h2>
              <ul className="partnerships-types-grid">
                {typesCards.map((card) => (
                  <li key={card.title} className="partnerships-type-card">
                    <span className="partnerships-type-title">{card.title}</span>
                    <span className="partnerships-type-desc">{card.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="partnerships-block partnerships-card">
              <h2 className="partnerships-heading">{copy.partnerWithUsHeading}</h2>
              <ul className="partnerships-list">
                {partnerWithUsList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="partnerships-block partnerships-card partnerships-values">
              <h2 className="partnerships-heading">{copy.valuesHeading}</h2>
              <ul className="partnerships-list">
                {valuesList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="partnerships-cta-strip">
            <div className="partnerships-cta-inner">
              <p className="partnerships-cta-text">{copy.ctaStripText}</p>
              <div className="partnerships-cta-buttons">
                <Link href="/contact#contact" className="btn btn-partnerships-primary">
                  {copy.ctaPrimary}
                </Link>
                <Link href="/contact#contact" className="btn btn-partnerships-outline">
                  {copy.ctaSecondary}
                </Link>
                <Link href="/contact#contact" className="btn btn-partnerships-outline">
                  {copy.ctaTertiary}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
