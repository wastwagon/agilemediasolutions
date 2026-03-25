'use client';

import React from 'react';
import Link from 'next/link';

const DOCUMENT_BRANDS: { imgClass: string; title: string; body: string; audience?: string; format?: string }[] = [
  {
    imgClass: 'brand-img-leaders',
    title: 'African Leaders Magazine',
    body: 'A continental platform spotlighting leadership, policy, and governance across Africa. This flagship publication features interviews with heads of state, CEOs, reform champions, and visionary thinkers. It provides in-depth coverage of political transitions, development strategy, leadership trends, and institutional innovation.',
    audience: 'Public officials, diplomats, policy experts, academics, leadership development institutions',
    format: 'Print, digital, and summit editions',
  },
  {
    imgClass: 'brand-img-sports',
    title: 'Africa Sports Magazine',
    body: "Highlighting the athletes, leagues, and moments driving Africa's sporting evolution. Africa Sports Magazine delivers monthly insights into performance, business, culture, and talent development in African sports. It also celebrates rising stars, sports diplomacy, and local-to-global impact.",
    audience: 'Athletes, sports federations, fans, sponsors, media networks',
    format: 'Digital magazine, newsletter, special issues',
  },
  {
    imgClass: 'brand-img-news',
    title: 'Africa News Bulletin',
    body: 'A daily newswire delivering curated updates on politics, economy, institutions, and regional affairs. Focused on decision-makers and institutional audiences, this publication cuts through the noise with sharp, trusted reporting from across the continent—backed by an expert editorial team.',
    audience: 'Governments, DFIs, embassies, think tanks, corporate affairs teams',
    format: 'Email briefings, web portal, syndication feeds',
  },
  {
    imgClass: 'brand-img-sports',
    title: 'Africa Sportz',
    body: 'A digital-first youth brand at the intersection of sports, style, and social media. Africa Sportz combines athlete culture, urban identity, and viral content to engage next-generation fans through visual storytelling, influencer features, and community-based campaigns.',
    audience: 'Youth, lifestyle audiences, sports influencers, brands',
    format: 'Social-first, short-form video, branded content',
  },
  {
    imgClass: 'brand-img-leaders',
    title: 'Africa Trade Directory',
    body: "The continent's verified platform for cross-border trade, business listings, and investment resources. This digital directory connects exporters, importers, logistics providers, trade bodies, and governments—providing visibility, credibility, and market access intelligence across Africa.",
    audience: 'Businesses, chambers, ministries, trade investors, commercial attachés',
    format: 'Online directory, export guides, investor briefs',
  },
  {
    imgClass: 'brand-img-news',
    title: 'Africa Hospitality Magazine',
    body: "A content hub for Africa's tourism, travel, and hospitality sectors. The magazine features destination marketing, executive interviews, investment trends, property highlights, and guest experience stories—supporting both local tourism and global-facing hospitality brands.",
    audience: 'Hotels, tour operators, ministries of tourism, investors, travel media',
    format: 'Digital publication, spotlight campaigns, seasonal editions',
  },
  {
    imgClass: 'brand-img-leaders',
    title: 'Agile HR Magazine',
    body: 'Listed among our African-focused media platforms alongside leadership, business, sports, trade, and hospitality—dedicated to people strategy, workplace culture, and human capital at scale.',
  },
];

export default function Page() {
  return (
    <main className="services-page-main">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Our brands</span>
          <h1 className="page-hero-title">Media Properties That Inform, Inspire, and Influence</h1>
          <p className="page-hero-tagline">
            Agile Media Solutions owns and operates a growing portfolio of high-impact media platforms that shape public discourse, elevate African voices, and spotlight key sectors across the continent. Each brand is purpose-built to serve a distinct audience—from policymakers and business leaders to creatives, investors, athletes, and travelers.
          </p>
          <p className="page-hero-tagline" style={{ marginTop: 'var(--space-md)' }}>
            Our media properties are not only content platforms—they are strategic instruments for visibility, engagement, and storytelling.
          </p>
        </div>
      </div>
      <section className="section section-cards">
        <div className="section-inner">
          <div className="services-grid">
            {DOCUMENT_BRANDS.map((b) => (
              <article key={b.title} className="service-card">
                <div className={`service-card-image ${b.imgClass}`}></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{b.title}</h3>
                  <p className="service-card-desc">{b.body}</p>
                  {b.audience && (
                    <p className="service-card-desc">
                      <strong>Audience:</strong> {b.audience}
                    </p>
                  )}
                  {b.format && (
                    <p className="service-card-desc">
                      <strong>Format:</strong> {b.format}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="section-subtitle centered" style={{ marginTop: 'var(--space-xl)' }}>
            Together, these brands extend Agile Media Solutions&apos; mission to power narratives, elevate stories, and create platforms that inform, connect, and lead.
          </p>
          <div className="section-cta-center services-page-cta">
            <Link href="/contact#contact" className="btn btn-primary">
              Advertise With Us
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              Syndicate Our Content
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              Become a Contributor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
