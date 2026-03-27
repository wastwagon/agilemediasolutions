'use client';

import React from 'react';
import Link from 'next/link';

const SIGNATURE_EVENTS = [
  {
    title: 'Africa Trade Summit',
    tagline: 'Accelerating Intra-African Trade, Investment, and Economic Transformation',
    body: 'An annual flagship gathering of business leaders, policymakers, trade agencies, and investors. The Summit drives practical discussions around cross-border commerce, industrialization, trade finance, AfCFTA implementation, and private sector collaboration.',
    features: 'Presidential panels, investment pitch rooms, trade showcases, CEO roundtables',
    audience: 'Governments, DFIs, SMEs, multinationals, logistics and infrastructure players',
    imageClass: 'event-img-summit',
  },
  {
    title: 'Africa Trade Awards',
    tagline: "Celebrating Excellence Across the Continent's Trade Ecosystem",
    body: "Held as part of the Africa Trade Summit, the Awards recognize leading exporters, reform champions, trade institutions, and high-performing brands contributing to Africa's economic integration.",
    features: 'Exporter of the Year, Trade Enabler, Public Sector Innovator, Emerging Enterprise, Digital Trade Leader',
    audience: 'Corporates, SMEs, government agencies, financial institutions',
    imageClass: 'event-img-trade-awards',
  },
  {
    title: 'Africa Industry Awards',
    tagline: "Honoring the Enterprises Building Africa's Industrial Future",
    body: "A high-level awards program spotlighting innovation, resilience, and growth in Africa's industrial and manufacturing sectors—from agribusiness and mining to energy, construction, and light industry.",
    features: 'Sector-specific categories, innovation spotlights, media coverage, investor networking',
    audience: 'Industrial firms, regulators, financiers, development agencies, media',
    imageClass: 'event-img-industry-awards',
  },
  {
    title: 'Africa Investment Week',
    tagline: 'Connecting Capital to Opportunity Across African Markets',
    body: 'A dynamic, multi-day platform that brings together investors, fund managers, startups, governments, and DFIs to explore sector trends, identify opportunities, and catalyze partnerships.',
    features: 'Deal rooms, roundtables, investor briefings, country presentations, fund showcases',
    audience: 'VCs, private equity, sovereign wealth funds, investment promotion agencies',
    imageClass: 'event-img-summit',
  },
  {
    title: 'Afro Jazz Festival',
    tagline: 'Celebrating the Soul of Africa Through Music, Art, and Culture',
    body: 'An immersive cultural experience showcasing the best of African jazz and fusion—combining live performances, visual art, food, fashion, and storytelling. The festival bridges heritage and innovation, creativity and commerce.',
    features: 'Live concerts, curated exhibitions, talent showcases, brand activations',
    audience: 'Music lovers, cultural institutions, tourism boards, creative brands',
    imageClass: 'event-img-jazz',
  },
];

export default function Page() {
  return (
    <main className="services-page-main creative-public-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Signature events</span>
          <h1 className="page-hero-title">Curated Platforms That Bring Visionaries, Innovators, and Institutions Together</h1>
          <p className="page-hero-tagline">
            Agile Media Solutions is not only a communications firm—we are also a convening force. Through our proprietary events, we bring together influential voices across trade, investment, culture, policy, and industry to inspire dialogue, foster partnerships, and build platforms that matter.
          </p>
          <p className="page-hero-tagline" style={{ marginTop: 'var(--space-md)' }}>
            Our events combine powerful content, strategic visibility, high-level participation, and unforgettable experiences.
          </p>
        </div>
      </div>
      <section className="section section-cards">
        <div className="section-inner">
          <div className="inner-section-head">
            <div>
              <span className="section-label">Event Portfolio</span>
              <h2 className="section-title">Signature Experiences and Convenings</h2>
            </div>
            <Link href="/contact#contact" className="inner-section-link">Sponsorship options</Link>
          </div>
          <div className="services-grid">
            {SIGNATURE_EVENTS.map((e) => (
              <article key={e.title} className="service-card">
                <div className={`service-card-image card-image-placeholder ${e.imageClass}`}></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{e.title}</h3>
                  <p className="service-card-desc">
                    <strong>{e.tagline}</strong>
                  </p>
                  <p className="service-card-desc">{e.body}</p>
                  <p className="service-card-desc">
                    <strong>Features:</strong> {e.features}
                  </p>
                  <p className="service-card-desc">
                    <strong>Audience:</strong> {e.audience}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="section-cta-center services-page-cta">
            <Link href="/contact#contact" className="btn btn-primary">
              Partner With Us
            </Link>
            <Link href="/" className="btn btn-outline">
              Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
