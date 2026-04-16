import React from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import { getSiteSectionContent } from '@/lib/siteSectionCmsServer';

export const metadata = {
  title: 'Agile Press Group',
  description: 'Agile Press Group publishes and syndicates high-impact African editorial content across leadership, sport, trade, and policy.',
};

function parseLineList(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export default async function Page() {
  const copy = await getSiteSectionContent('agile-press-group.page', {
    heroLabel: 'Agile Press Group',
    heroTitle: "Shaping Africa's Narrative, One Publication at a Time",
    heroIntro:
      'Agile Press Group is the publishing and editorial division of Agile Media Solutions-dedicated to creating, curating, and circulating high-quality African content that informs, inspires, and influences.',
    heroSubIntro:
      'We manage a bold and growing portfolio of publications, bulletins, syndication services, and special reports that serve leaders, professionals, creatives, institutions, and the public across Africa and the global diaspora. From trade to governance, from sport to hospitality-we produce powerful content platforms that centre African perspectives and elevate the voices that move the continent forward.',
    sectionLabel: 'Publishing Core',
    sectionTitle: 'Our Editorial Vision',
    sectionLinkLabel: 'Start publishing',
    visionHeading: 'Our Editorial Vision',
    visionList:
      'Authentic: Rooted in African stories, lived experiences, and voices\nStrategic: Designed to support institutions, leaders, and reform efforts\nPan-African: Cross-border, multilingual, and diasporic in reach\nHigh-Quality: Driven by editorial rigour, design excellence, and insight\nCross-Platform: Print, digital, podcast, video, and syndication formats',
    flagshipHeading: 'Flagship Publications',
    flagshipList:
      'African Leaders Magazine - Leadership, governance, and public sector innovation\nAfrica Sports Magazine - Performance, policy, and people in African sport\nAfrica News Bulletin - Daily curated updates for decision-makers and institutions\nAfrica Sportz - Youth culture, athlete branding, and sports entertainment\nAfrica Hospitality Magazine - Tourism, investment, and travel experience insights\nAfrica Trade Directory (optional: reposition as Africa Trade Intelligence) - Trade promotion, B2B listings, commercial diplomacy, and investment visibility',
    publishingServicesHeading: 'Publishing Services - Press Release Circulation & Media Syndication',
    publishingServicesIntro:
      'We write, distribute, and track high-impact press releases across Africa and global media environments. Our media desk ensures your message reaches the right outlets with editorial credibility.',
    publishingServicesIncludesLabel: 'Includes:',
    publishingServicesIncludesList:
      'Press release drafting, localization, and editing\nDistribution to verified pressrooms, media editors, and correspondents\nPlacement in Agile-owned and partner publications\nImpact monitoring and clipping reports\nSyndication in Africa News Bulletin and select dailies',
    customPublishingHeading: 'Custom Publishing for Institutions',
    customPublishingIntro:
      'We co-create branded and strategic content for government ministries, corporates, development agencies, and trade platforms.',
    customPublishingExamplesLabel: 'Examples include:',
    customPublishingExamplesList:
      'Country investment guides\nMinistry and agency yearbooks\nESG, CSR, and donor reports\nEvent, summit, and expo publications\nNational brand storybooks',
    syndicationHeading: 'Syndication Partnerships Across Africa',
    syndicationIntro:
      'Agile Press Group is building a content exchange ecosystem with licensed syndication in leading media outlets across capital cities, enabling shared visibility for Africa-focused editorial content.',
    syndicationCountries: "Partner Countries (initial wave): Ghana, Kenya, Nigeria, Rwanda, South Africa, Senegal, Egypt, and Cote d'Ivoire.",
    signatureProductsHeading: 'Signature Editorial Products',
    signatureProductsList:
      'Africa Media & Influence Outlook (Annual report)\nAfCFTA Communications Trends Report\nAfrica Public Affairs Yearbook\nTop 100 African CEO Brand Index\nAfrica Elections & Political Messaging Tracker',
    signatureProductsOutro:
      'These flagship publications position Agile Press Group as a thought leader in strategic communications, institutional visibility, and brand power across the continent.',
    contributorHeading: 'Agile Contributor Network',
    contributorIntro:
      'We collaborate with a pan-African community of journalists, policy experts, creatives, and cultural commentators who contribute op-eds, field stories, essays, and investigations across our platforms.',
    contributorCtaPrimary: 'Become a Contributor',
    contributorCtaSecondary: 'Editorial Guidelines',
    exchangeHeading: 'Agile Content Exchange',
    exchangeIntro:
      'A licensing and distribution platform that allows third-party media, agencies, and institutions to access and republish Agile-owned editorial content, infographics, and special features under syndication terms.',
    exchangeCta: 'Request Access to the Exchange',
    trainingHeading: 'Editorial Training & Media Development',
    trainingIntro:
      'Through the Agile Press Academy, we support the next generation of African journalists, editors, and institutional media teams with capacity-building, fellowships, and short-term consulting.',
    trainingOfferingsLabel: 'Offerings include:',
    trainingOfferingsList:
      'Media training for public information officers\nWriting workshops for communications teams\nMentorship for early-career journalists\nInstitutional storytelling strategy advisory',
    finalHeading: "Let's Publish, Amplify, and Syndicate Together",
    finalText:
      "Agile Press Group is your partner for publishing strategy, narrative positioning, and cross-border content influence. Whether you're launching a campaign, informing public policy, or branding a nation-we're your editorial ally.",
    ctaPrimary: 'Commission a Publication',
    ctaSecondary: 'Request Syndication Services',
    ctaTertiary: 'Partner on a Flagship Report',
    ctaQuaternary: 'Advertise in Our Platforms',
  });
  const visionList = parseLineList(copy.visionList);
  const flagshipList = parseLineList(copy.flagshipList);
  const publishingIncludes = parseLineList(copy.publishingServicesIncludesList);
  const customExamples = parseLineList(copy.customPublishingExamplesList);
  const signatureProducts = parseLineList(copy.signatureProductsList);
  const trainingOfferings = parseLineList(copy.trainingOfferingsList);

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

      <section className="section section-digital" id="agile-press-group">
        <div className="section-inner animate-on-scroll">
          <SectionHeader
            variant="inner"
            label={copy.sectionLabel}
            title={copy.sectionTitle}
            linkHref="/contact#contact"
            linkLabel={copy.sectionLinkLabel}
            titleClassName="digital-title"
          />
          <h3 className="digital-offerings-heading">{copy.visionHeading}</h3>
          <ul className="digital-list">
            {visionList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-2xl)' }}>
            {copy.flagshipHeading}
          </h3>
          <ul className="digital-list">
            {flagshipList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            {copy.publishingServicesHeading}
          </h3>
          <p className="digital-intro">
            {copy.publishingServicesIntro}
          </p>
          <p className="digital-list-label">{copy.publishingServicesIncludesLabel}</p>
          <ul className="digital-list">
            {publishingIncludes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            {copy.customPublishingHeading}
          </h3>
          <p className="digital-intro">{copy.customPublishingIntro}</p>
          <p className="digital-list-label">{copy.customPublishingExamplesLabel}</p>
          <ul className="digital-list">
            {customExamples.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            {copy.syndicationHeading}
          </h3>
          <p className="digital-intro">
            {copy.syndicationIntro}
          </p>
          <p className="digital-intro">{copy.syndicationCountries}</p>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            {copy.signatureProductsHeading}
          </h3>
          <ul className="digital-list">
            {signatureProducts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="digital-intro">
            {copy.signatureProductsOutro}
          </p>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            {copy.contributorHeading}
          </h3>
          <p className="digital-intro">
            {copy.contributorIntro}
          </p>
          <div className="section-cta-center digital-cta-buttons" style={{ justifyContent: 'flex-start', marginTop: '1rem' }}>
            <Link href="/contact#contact" className="btn btn-outline">
              {copy.contributorCtaPrimary}
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              {copy.contributorCtaSecondary}
            </Link>
          </div>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            {copy.exchangeHeading}
          </h3>
          <p className="digital-intro">
            {copy.exchangeIntro}
          </p>
          <Link href="/contact#contact" className="btn btn-outline" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
            {copy.exchangeCta}
          </Link>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            {copy.trainingHeading}
          </h3>
          <p className="digital-intro">
            {copy.trainingIntro}
          </p>
          <p className="digital-list-label">{copy.trainingOfferingsLabel}</p>
          <ul className="digital-list">
            {trainingOfferings.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className="section-title digital-title" style={{ marginTop: 'var(--space-3xl)' }}>
            {copy.finalHeading}
          </h2>
          <p className="digital-intro">
            {copy.finalText}
          </p>
          <div className="section-cta-center digital-cta-buttons" style={{ marginTop: 'var(--space-xl)', flexWrap: 'wrap' }}>
            <Link href="/contact#contact" className="btn btn-primary">
              {copy.ctaPrimary}
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              {copy.ctaSecondary}
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              {copy.ctaTertiary}
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              {copy.ctaQuaternary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
