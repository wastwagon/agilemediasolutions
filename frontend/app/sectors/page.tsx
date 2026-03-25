'use client';

import React from 'react';
import Link from 'next/link';

const DOCUMENT_SECTORS: { name: string; description: string }[] = [
  {
    name: 'Government & Public Institutions',
    description:
      'Strategic messaging, reform visibility, and public trust-building for ministries, agencies, SOEs, and state offices.',
  },
  {
    name: 'International Development & Multilaterals',
    description:
      'Donor communications, stakeholder engagement, and campaign design for UN agencies, multilaterals, and development partners.',
  },
  {
    name: 'Finance, Investment & Trade',
    description:
      'Investor-facing communications, ESG storytelling, and cross-border branding for financial institutions, DFIs, fintechs, and trade bodies.',
  },
  {
    name: 'Infrastructure, Energy & Extractives',
    description:
      'Narratives that support large-scale projects, community engagement, social license, and regulatory visibility across hard sectors.',
  },
  {
    name: 'Technology, Startups & Innovation',
    description:
      "Bold messaging and digital campaigns for startups, platforms, and innovation ecosystems—shaping Africa's tech-driven future.",
  },
  {
    name: 'Health, Education & Social Development',
    description:
      'Behavior change communication, public outreach, and institutional visibility for health systems, schools, and human capital initiatives.',
  },
  {
    name: 'Climate, Environment & Sustainability',
    description:
      "Content strategies for climate action, biodiversity, energy transition, and green finance—amplifying Africa's voice in global sustainability.",
  },
  {
    name: 'Arts, Culture & Creative Industries',
    description:
      'Creative publicity, platform building, and cultural storytelling that connect artists, curators, and institutions to local and global audiences.',
  },
  {
    name: 'Sports, Tourism & Nation Branding',
    description:
      'Public relations and promotional campaigns that elevate destinations, athletes, and national image across tourism and sport.',
  },
  {
    name: 'Hospitality, Travel & Leisure',
    description:
      'Strategic media and consumer-facing communications for hotels, resorts, tourism boards, and hospitality brands seeking global reach.',
  },
  {
    name: 'Legal, Policy & Governance',
    description:
      'Policy reform visibility, legal institution branding, and governance communication for ministries of justice, regulatory bodies, and courts.',
  },
  {
    name: 'Migration, Diaspora & Global Mobility',
    description:
      'Diaspora engagement campaigns, migration policy comms, remittance platform PR, and transnational storytelling.',
  },
  {
    name: 'Security, Peacebuilding & Conflict Communications',
    description:
      'Sensitive, high-stakes communication support for fragile contexts, peace processes, disinformation response, and conflict recovery.',
  },
  {
    name: 'Philanthropy, Foundations & Social Investment',
    description:
      'Strategic communications for foundations, CSR teams, and social investors—highlighting impact, transparency, and beneficiary engagement.',
  },
  {
    name: 'Media, Entertainment & Public Personalities',
    description:
      'Visibility campaigns, brand protection, and strategic publicity for content creators, influencers, media brands, and entertainment firms.',
  },
];

export default function Page() {
  return (
    <main className="services-page-main">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Sectors we serve</span>
          <h1 className="page-hero-title">Expert Communications Across Institutions, Industries, and Global Issues</h1>
          <p className="page-hero-tagline">
            Agile Media Solutions delivers high-impact communications across key sectors shaping Africa and the world. We work with governments, corporations, development agencies, social investors, and cultural institutions to craft narratives that reflect their values, engage their audiences, and achieve lasting outcomes.
          </p>
        </div>
      </div>

      <section className="section section-sectors" id="sectors">
        <div className="section-inner animate-on-scroll">
          <div className="section-sectors-intro">
            <p className="section-text" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--space-3xl)' }}>
              Our sector-specific approach ensures every message is aligned with context, policy, audience, and purpose.
            </p>
          </div>

          <div className="sectors-grid">
            {DOCUMENT_SECTORS.map((sector) => (
              <article key={sector.name} className="sector-card">
                <div className="sector-card-icon" style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-electric-blue)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-sm)', color: '#FFFFFF' }}>{sector.name}</h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>{sector.description}</p>
              </article>
            ))}
          </div>

          <div className="section-cta-center" style={{ marginTop: 'var(--space-3xl)', display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
            <Link href="/contact#contact" className="btn btn-primary">
              Talk to a Sector Advisor
            </Link>
            <Link href="/case-studies" className="btn btn-outline">
              Explore Our Work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
