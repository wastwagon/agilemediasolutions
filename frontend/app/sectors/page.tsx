'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionHeader from '../../components/SectionHeader';
import { useSiteSectionContent } from '@/lib/siteSectionCms';

type SectorItem = {
  id: number;
  name: string;
  description: string;
  icon?: string | null;
  order_index?: number | null;
};

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
  const [sectors, setSectors] = useState<SectorItem[]>([]);
  const copy = useSiteSectionContent('sectors.page', {
    heroLabel: 'Sectors we serve',
    heroTitle: 'Expert Communications Across Institutions, Industries, and Global Issues',
    heroTagline:
      'Agile Media Solutions delivers high-impact communications across key sectors shaping Africa and the world. We work with governments, corporations, development agencies, social investors, and cultural institutions to craft narratives that reflect their values, engage their audiences, and achieve lasting outcomes.',
    sectionLabel: 'Coverage',
    sectionTitle: 'Sectors we support',
    sectionLinkLabel: 'Discuss your mandate',
    sectionIntro: 'Our sector-specific approach ensures every message is aligned with context, policy, audience, and purpose.',
    ctaPrimary: 'Talk to a Sector Advisor',
    ctaSecondary: 'Explore Our Work',
  });

  useEffect(() => {
    const loadSectors = async () => {
      try {
        const res = await fetch('/api/sectors');
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        setSectors(data as SectorItem[]);
      } catch {
        // Keep fallback sectors when API is unavailable.
      }
    };
    loadSectors();
  }, []);

  const renderedSectors = sectors.length > 0 ? sectors : DOCUMENT_SECTORS;

  return (
    <main className="services-page-main creative-public-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">{copy.heroLabel}</span>
          <h1 className="page-hero-title">{copy.heroTitle}</h1>
          <p className="page-hero-tagline">
            {copy.heroTagline}
          </p>
        </div>
      </div>

      <section className="section section-sectors" id="sectors">
        {/* No animate-on-scroll: entire grid was opacity:0 until observer runs, which looked like a blank page below the hero. */}
        <div className="section-inner">
          <SectionHeader
            variant="inner"
            label={copy.sectionLabel}
            title={copy.sectionTitle}
            linkHref="/contact#contact"
            linkLabel={copy.sectionLinkLabel}
          />
          <div className="section-sectors-intro">
            <p className="section-text" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--space-3xl)' }}>
              {copy.sectionIntro}
            </p>
          </div>

          <div className="sectors-grid">
            {renderedSectors.map((sector) => (
              <article key={sector.name} className="sector-card">
                <div className="sector-card-icon" style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-electric-blue)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3 className="sector-card-title">{sector.name}</h3>
                <p className="sector-card-desc">{sector.description}</p>
              </article>
            ))}
          </div>

          <div className="section-cta-center" style={{ marginTop: 'var(--space-3xl)', display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
            <Link href="/contact#contact" className="btn btn-primary">
              {copy.ctaPrimary}
            </Link>
            <Link href="/case-studies" className="btn btn-outline">
              {copy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
