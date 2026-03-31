import React from 'react';
import Link from 'next/link';
import { getSiteSectionContent } from '@/lib/siteSectionCmsServer';

export const metadata = {
  title: 'Careers at Agile Media Solutions',
  description: 'Join Agile Media Solutions and work with a team shaping narratives, public influence, and high-impact communications.',
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
  const copy = await getSiteSectionContent('careers.page', {
    heroLabel: 'Careers',
    heroTitle: 'Join a Team That Shapes Narratives and Moves Audiences',
    heroIntro:
      'At Agile Media Solutions, we are building more than a media and communications firm-we are building a platform for influence, creativity, and purpose. We bring together storytellers, strategists, analysts, designers, producers, and policy thinkers who believe in the power of narrative to transform institutions and societies.',
    heroSubIntro:
      "If you're driven by ideas, committed to excellence, and ready to work on high-impact projects across Africa and globally, Agile may be the place for you.",
    whyHeading: 'Why Work With Us',
    whyList:
      'Work with bold clients on issues that matter\nCollaborate across borders, cultures, and sectors\nDevelop creative solutions with real-world influence\nBuild campaigns that shape conversations and policy\nGrow in a mission-driven, fast-moving team of global professionals',
    whoHeading: "Who We're Looking For",
    whoIntro: 'We welcome early-career and experienced professionals with expertise in:',
    whoList:
      'Strategic communications\nPublic relations and media management\nCreative direction, content writing, and editorial\nFilm, video, photography, and motion graphics\nDigital strategy and campaign management\nPublic affairs, governance, and policy engagement\nMarketing, partnerships, and business development\nEvents, production, and logistics\nResearch, insights, and sector analysis',
    opportunitiesHeading: 'Opportunities',
    opportunityCards:
      'Full-Time Positions :: Join our leadership or delivery teams\nConsultant Roster :: Project-based roles across regions and specialties\nFellowships & Internships :: For emerging creatives, writers, and strategists\nCreative Collaborators :: Visual artists, animators, musicians, illustrators',
    cultureHeading: 'The Agile Culture',
    cultureList:
      'Collaborative and mission-focused\nFlexible, fast-paced, and outcome-driven\nDiverse, respectful, and inclusive\nInvested in continuous learning and experimentation',
    ctaStripText: 'Ready to apply?',
    ctaPrimary: 'See Open Positions',
    ctaSecondary: 'Join Our Talent Network',
    ctaTertiary: 'Meet Our Team',
  });
  const whyList = parseLineList(copy.whyList);
  const whoList = parseLineList(copy.whoList);
  const opportunityCards = parseTitledCards(copy.opportunityCards);
  const cultureList = parseLineList(copy.cultureList);

  return (
    <main className="careers-page-main creative-public-page">
      <section className="section section-careers-page" id="careers">
        <div className="careers-hero">
          <div className="careers-hero-inner">
            <span className="careers-label">{copy.heroLabel}</span>
            <h1 className="careers-title">{copy.heroTitle}</h1>
            <p className="careers-tagline">
              {copy.heroIntro}
            </p>
            <p className="careers-intro">
              {copy.heroSubIntro}
            </p>
          </div>
        </div>

        <div className="careers-content">
          <div className="careers-grid">
            <div className="careers-block careers-card">
              <h2 className="careers-heading">{copy.whyHeading}</h2>
              <ul className="careers-list">
                {whyList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="careers-block careers-card">
              <h2 className="careers-heading">{copy.whoHeading}</h2>
              <p className="section-text">{copy.whoIntro}</p>
              <ul className="careers-list">
                {whoList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="careers-block careers-opportunities">
              <h2 className="careers-heading">{copy.opportunitiesHeading}</h2>
              <ul className="careers-opportunities-grid">
                {opportunityCards.map((card) => (
                  <li key={card.title} className="careers-opportunity-card">
                    <span className="careers-opportunity-title">{card.title}</span>
                    <span className="careers-opportunity-desc">{card.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="careers-block careers-card careers-culture">
              <h2 className="careers-heading">{copy.cultureHeading}</h2>
              <ul className="careers-list">
                {cultureList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="careers-cta-strip">
            <div className="careers-cta-inner">
              <p className="careers-cta-text">{copy.ctaStripText}</p>
              <div className="careers-cta-buttons">
                <Link href="/contact#contact" className="btn btn-careers-primary">
                  {copy.ctaPrimary}
                </Link>
                <Link href="/contact#contact" className="btn btn-careers-outline">
                  {copy.ctaSecondary}
                </Link>
                <Link href="/about" className="btn btn-careers-outline">
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
