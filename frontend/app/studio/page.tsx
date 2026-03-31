import React from 'react';
import Link from 'next/link';
import SectionHeader from '../../components/SectionHeader';
import { getSiteSectionContent } from '@/lib/siteSectionCmsServer';

export const metadata = {
  title: 'Agile Studio',
  description: 'Discover Agile Studio production services in video, photography, design, audio, and post-production for strategic communications.',
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
      return { title: (title || '').trim(), desc: rest.join('::').trim() };
    })
    .filter((x) => x.title && x.desc);
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
    offeringCards:
      'Video Production & Direction :: Documentaries, campaign videos, investor pitches, and brand films-crafted for impact and produced to global standards.\nPhotography & Content Capture :: Professional event coverage, studio photography, behind-the-scenes, and portrait sessions for brands, leaders, and creatives.\nDesign & Visual Identity Systems :: Logos, branding kits, infographics, social media templates, publications, and design systems aligned with your strategic message.\nAnimation & Motion Graphics :: Explainer videos, title sequences, motion branding, and creative visuals that bring abstract messages to life.\nAudio Production & Podcasts :: Scripted and unscripted podcast production, audio interviews, and thematic sound design for campaign and media use.\nEditing & Post-Production :: Full-suite editing, sound mixing, subtitling, formatting, and localization for digital, broadcast, and event use.',
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
  const offeringCards = parseTitledCards(copy.offeringCards);
  const highlightsList = parseLineList(copy.highlightsList);

  return (
    <main className="services-page-main creative-public-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">{copy.heroLabel}</span>
          <h1 className="page-hero-title">{copy.heroTitle}</h1>
          <p className="page-hero-tagline">
            {copy.heroIntro}
          </p>
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
            {offeringCards.map((card) => (
              <div key={card.title} className="digital-offering">
                <h4 className="digital-offering-title">{card.title}</h4>
                <p className="digital-offering-desc">{card.desc}</p>
              </div>
            ))}
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
          <p className="digital-intro">
            {copy.clientsSubtitle}
          </p>

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
