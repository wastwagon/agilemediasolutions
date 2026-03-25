import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="services-page-main">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Agile Press Group</span>
          <h1 className="page-hero-title">Shaping Africa&apos;s Narrative, One Publication at a Time</h1>
          <p className="page-hero-tagline">
            Agile Press Group is the publishing and editorial division of Agile Media Solutions—dedicated to creating, curating, and circulating high-quality African content that informs, inspires, and influences.
          </p>
          <p className="page-hero-tagline" style={{ marginTop: 'var(--space-md)' }}>
            We manage a bold and growing portfolio of publications, bulletins, syndication services, and special reports that serve leaders, professionals, creatives, institutions, and the public across Africa and the global diaspora. From trade to governance, from sport to hospitality—we produce powerful content platforms that centre African perspectives and elevate the voices that move the continent forward.
          </p>
        </div>
      </div>

      <section className="section section-digital" id="agile-press-group">
        <div className="section-inner animate-on-scroll">
          <h2 className="section-title digital-title">Our Editorial Vision</h2>
          <ul className="digital-list">
            <li>
              <strong>Authentic:</strong> Rooted in African stories, lived experiences, and voices
            </li>
            <li>
              <strong>Strategic:</strong> Designed to support institutions, leaders, and reform efforts
            </li>
            <li>
              <strong>Pan-African:</strong> Cross-border, multilingual, and diasporic in reach
            </li>
            <li>
              <strong>High-Quality:</strong> Driven by editorial rigour, design excellence, and insight
            </li>
            <li>
              <strong>Cross-Platform:</strong> Print, digital, podcast, video, and syndication formats
            </li>
          </ul>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-2xl)' }}>
            Flagship Publications
          </h3>
          <ul className="digital-list">
            <li>
              <strong>African Leaders Magazine</strong> — Leadership, governance, and public sector innovation
            </li>
            <li>
              <strong>Africa Sports Magazine</strong> — Performance, policy, and people in African sport
            </li>
            <li>
              <strong>Africa News Bulletin</strong> — Daily curated updates for decision-makers and institutions
            </li>
            <li>
              <strong>Africa Sportz</strong> — Youth culture, athlete branding, and sports entertainment
            </li>
            <li>
              <strong>Africa Hospitality Magazine</strong> — Tourism, investment, and travel experience insights
            </li>
            <li>
              <strong>Africa Trade Directory (optional: reposition as Africa Trade Intelligence)</strong> — Trade promotion, B2B listings, commercial diplomacy, and investment visibility
            </li>
          </ul>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            Publishing Services — Press Release Circulation &amp; Media Syndication
          </h3>
          <p className="digital-intro">
            We write, distribute, and track high-impact press releases across Africa and global media environments. Our media desk ensures your message reaches the right outlets with editorial credibility.
          </p>
          <p className="digital-list-label">Includes:</p>
          <ul className="digital-list">
            <li>Press release drafting, localization, and editing</li>
            <li>Distribution to verified pressrooms, media editors, and correspondents</li>
            <li>Placement in Agile-owned and partner publications</li>
            <li>Impact monitoring and clipping reports</li>
            <li>Syndication in Africa News Bulletin and select dailies</li>
          </ul>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            Custom Publishing for Institutions
          </h3>
          <p className="digital-intro">We co-create branded and strategic content for government ministries, corporates, development agencies, and trade platforms.</p>
          <p className="digital-list-label">Examples include:</p>
          <ul className="digital-list">
            <li>Country investment guides</li>
            <li>Ministry and agency yearbooks</li>
            <li>ESG, CSR, and donor reports</li>
            <li>Event, summit, and expo publications</li>
            <li>National brand storybooks</li>
          </ul>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            Syndication Partnerships Across Africa
          </h3>
          <p className="digital-intro">
            Agile Press Group is building a content exchange ecosystem with licensed syndication in leading media outlets across capital cities, enabling shared visibility for Africa-focused editorial content.
          </p>
          <p className="digital-intro">
            <strong>Partner Countries (initial wave):</strong> Ghana, Kenya, Nigeria, Rwanda, South Africa, Senegal, Egypt, and Côte d&apos;Ivoire.
          </p>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            Signature Editorial Products
          </h3>
          <ul className="digital-list">
            <li>Africa Media &amp; Influence Outlook (Annual report)</li>
            <li>AfCFTA Communications Trends Report</li>
            <li>Africa Public Affairs Yearbook</li>
            <li>Top 100 African CEO Brand Index</li>
            <li>Africa Elections &amp; Political Messaging Tracker</li>
          </ul>
          <p className="digital-intro">
            These flagship publications position Agile Press Group as a thought leader in strategic communications, institutional visibility, and brand power across the continent.
          </p>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            Agile Contributor Network
          </h3>
          <p className="digital-intro">
            We collaborate with a pan-African community of journalists, policy experts, creatives, and cultural commentators who contribute op-eds, field stories, essays, and investigations across our platforms.
          </p>
          <div className="section-cta-center digital-cta-buttons" style={{ justifyContent: 'flex-start', marginTop: '1rem' }}>
            <Link href="/contact#contact" className="btn btn-outline">
              Become a Contributor
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              Editorial Guidelines
            </Link>
          </div>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            Agile Content Exchange
          </h3>
          <p className="digital-intro">
            A licensing and distribution platform that allows third-party media, agencies, and institutions to access and republish Agile-owned editorial content, infographics, and special features under syndication terms.
          </p>
          <Link href="/contact#contact" className="btn btn-outline" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
            Request Access to the Exchange
          </Link>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            Editorial Training &amp; Media Development
          </h3>
          <p className="digital-intro">
            Through the Agile Press Academy, we support the next generation of African journalists, editors, and institutional media teams with capacity-building, fellowships, and short-term consulting.
          </p>
          <p className="digital-list-label">Offerings include:</p>
          <ul className="digital-list">
            <li>Media training for public information officers</li>
            <li>Writing workshops for communications teams</li>
            <li>Mentorship for early-career journalists</li>
            <li>Institutional storytelling strategy advisory</li>
          </ul>

          <h2 className="section-title digital-title" style={{ marginTop: 'var(--space-3xl)' }}>
            Let&apos;s Publish, Amplify, and Syndicate Together
          </h2>
          <p className="digital-intro">
            Agile Press Group is your partner for publishing strategy, narrative positioning, and cross-border content influence. Whether you&apos;re launching a campaign, informing public policy, or branding a nation—we&apos;re your editorial ally.
          </p>
          <div className="section-cta-center digital-cta-buttons" style={{ marginTop: 'var(--space-xl)', flexWrap: 'wrap' }}>
            <Link href="/contact#contact" className="btn btn-primary">
              Commission a Publication
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              Request Syndication Services
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              Partner on a Flagship Report
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              Advertise in Our Platforms
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
