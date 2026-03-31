import React from 'react';
import Link from 'next/link';
import SectionHeader from '../../components/SectionHeader';
import { getSiteSectionContent } from '@/lib/siteSectionCmsServer';

export const metadata = {
  title: 'Digital Engagement & Social Media',
  description: 'Activate digital audiences with Agile Media Solutions social media strategy, audience intelligence, crisis support, and analytics.',
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
    offeringCards:
      "Platform Strategy & Management :: We build and manage institutional and executive presence across Twitter/X, Instagram, Facebook, LinkedIn, TikTok, YouTube, and emerging platforms. From posting plans to tone-of-voice development, we ensure your digital identity is compelling, credible, and consistent.\nDigital Influence Mapping & Audience Intelligence :: We map digital ecosystems-identifying who's leading conversations, where your audiences are clustered, and what topics drive traction. Our analysis covers influencers, competitors, hashtags, and stakeholder sentiment in real time.\nExecutive & Institutional Social Branding :: We help CEOs, ministers, and public institutions craft social profiles that build trust and visibility. This includes platform setup, strategic content calendars, verified identity support, and ghostwriting where required.\nAgile Social Studio & Visual Lab :: Our creative studio produces short-form, high-engagement content for digital platforms.\nPaid Media & Performance Boosting :: We design and execute targeted social media advertising campaigns across platforms-focused on follower growth, click-throughs, signups, or public sentiment.\nCrisis & Reputation Management :: We provide institutional support during digital crises, media attacks, or misinformation events.\nCommunity & Grassroots Mobilization :: We use platforms like WhatsApp Broadcast, Telegram Channels, and Facebook Groups to reach diaspora audiences, youth voters, creative communities, and hard-to-reach publics-especially during political, civic, or cultural mobilizations.\nSocial Media Training & Digital Capacity Building :: Through masterclasses, playbooks, and hands-on labs, we empower teams with practical social capability.\nAnalytics & Data-Driven Reporting :: Our monthly performance dashboards cover growth, engagement, reach, and strategic recommendations.\nPlatform Verification & Compliance :: We help institutions and leaders secure verified accounts, meet community standards, and build secure, compliant platform identities-across global and African social platforms.",
    influenceUseCasesLabel: 'Use cases:',
    influenceUseCasesList:
      'Policy or electoral campaigns\nTrade diplomacy or investment outreach\nInstitutional positioning and reform engagement',
    socialStudioList:
      'Social videos, reels, and motion graphics\nInfographics and visual explainers\nCarousel storytelling and quote cards\nLivestream and podcast snippets\nCaptioning, subtitling, and rapid-turn content\nPlatform-specific asset formatting (e.g. LinkedIn vs. TikTok)',
    crisisList:
      'Message calibration and control\nReal-time monitoring and sentiment tracking\nInfluencer engagement and media briefings\nPost-crisis cleanup and public confidence rebuilding',
    trainingList:
      'Government communications teams\nNGO campaigners\nPolitical campaign operatives\nPublic figures and spokespersons\nPrivate sector PR teams',
    analyticsList:
      'Growth trends and engagement breakdown\nBest-performing content\nInfluencer amplification metrics\nGeographic reach and sentiment\nPlatform algorithm insights\nStrategic recommendations',
    ctaHeading: "Let's Go Digital with Purpose",
    ctaText:
      'We treat digital space as infrastructure. Let Agile Media Solutions power your online influence with precision, agility, and clarity.',
    ctaPrimary: 'Request a Social Media Strategy Session',
    ctaSecondary: 'View Our Digital Case Studies',
    ctaTertiary: 'Engage Our Studio',
  });
  const offeringCards = parseTitledCards(copy.offeringCards);
  const influenceUseCases = parseLineList(copy.influenceUseCasesList);
  const socialStudioList = parseLineList(copy.socialStudioList);
  const crisisList = parseLineList(copy.crisisList);
  const trainingList = parseLineList(copy.trainingList);
  const analyticsList = parseLineList(copy.analyticsList);

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
        <p className="digital-intro">
          {copy.sectionIntro}
        </p>
        <h3 className="digital-offerings-heading">{copy.offeringsHeading}</h3>
        <div className="digital-offerings">
          {offeringCards.map((card, idx) => (
            <div key={card.title} className="digital-offering">
              <h4 className="digital-offering-title">{card.title}</h4>
              <p className="digital-offering-desc">{card.desc}</p>
              {idx === 1 && influenceUseCases.length > 0 ? (
                <>
                  <p className="digital-list-label">{copy.influenceUseCasesLabel}</p>
                  <ul className="digital-list">
                    {influenceUseCases.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </>
              ) : null}
              {idx === 3 && socialStudioList.length > 0 ? (
                <ul className="digital-list">
                  {socialStudioList.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
              {idx === 5 && crisisList.length > 0 ? (
                <ul className="digital-list">
                  {crisisList.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
              {idx === 7 && trainingList.length > 0 ? (
                <ul className="digital-list">
                  {trainingList.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
              {idx === 8 && analyticsList.length > 0 ? (
                <ul className="digital-list">
                  {analyticsList.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
        <div className="digital-cta-block">
          <h3 className="digital-cta-heading">{copy.ctaHeading}</h3>
          <p className="digital-cta-text">
            {copy.ctaText}
          </p>
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