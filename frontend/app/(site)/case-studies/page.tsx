'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import { useSiteSectionContent } from '@/lib/siteSectionCms';

interface CaseStudy {
  id: number;
  title: string;
  description: string;
  image_url: string;
  client_name?: string;
}

const SHOWCASE_ITEMS = [
  {
    title: 'Multi-Platform Campaigns',
    text: 'National, regional, and issue-based campaigns designed to shift public perception, influence behavior, and drive institutional visibility.',
  },
  {
    title: 'Leadership & Executive Communications',
    text: 'Narrative repositioning, profile elevation, and thought leadership support for government officials, CEOs, and change-makers.',
  },
  {
    title: 'Brand & Identity Projects',
    text: 'Rebrands, launches, and content refreshes for institutions, startups, and public-facing initiatives.',
  },
  {
    title: 'Events, Summits & Media Coverage',
    text: 'End-to-end media planning, content capture, speaker preparation, and post-event amplification for high-stakes convenings.',
  },
  {
    title: 'Documentary & Storytelling Production',
    text: 'Human-centered visual stories and issue-focused films for development partners, advocacy groups, and cultural institutions.',
  },
  {
    title: 'Investor, Policy & Donor Communications',
    text: 'Pitch decks, ESG reports, fundraising visuals, and policy messaging crafted to attract, inform, and inspire key stakeholders.',
  },
];

const SELECTED_HIGHLIGHTS = [
  {
    title: 'Public Sector Narrative Strategy',
    description:
      'Developed an integrated communication framework for a Ministry of Trade to align investor attraction, policy messaging, and AfCFTA visibility.',
    imgClass: 'highlight-img-public-sector',
  },
  {
    title: 'Creative Launch Campaign – Africa Sportz',
    description:
      'Produced a youth-driven media activation to launch a new pan-African digital sports brand with over 1 million social media impressions in the first 60 days.',
    imgClass: 'highlight-img-sportz',
  },
  {
    title: 'Summit Media Strategy – Africa Trade Summit',
    description:
      'Delivered full press management, real-time coverage, and speaker coaching for a two-day high-level summit involving four heads of state and 500+ delegates.',
    imgClass: 'highlight-img-summit',
  },
  {
    title: 'Diaspora Engagement – Global Ghana Initiative',
    description:
      'Created a cross-platform diaspora communications campaign blending video, testimonials, and cultural media across five countries.',
    imgClass: 'highlight-img-diaspora',
  },
  {
    title: 'Brand Repositioning – Africa Hospitality Magazine',
    description:
      'Redesigned visual identity, digital rollout plan, and editorial voice to elevate the brand as the go-to regional publication for hospitality insight.',
    imgClass: 'highlight-img-hospitality',
  },
];

export default function Page() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const caseStudiesCopy = useSiteSectionContent('case-studies.page', {
    heroLabel: 'Case studies & portfolio',
    heroTitle: 'Strategic Impact. Creative Execution. Measurable Results.',
    heroIntro:
      'Agile Media Solutions has delivered high-level communications for clients across sectors, regions, and mandates-from institutional reform campaigns to global investor engagements, from cultural showcases to public trust-building initiatives.',
    heroSubIntro:
      'Our portfolio reflects our ability to listen deeply, think strategically, and execute with precision-regardless of scale or complexity.',
    showcaseLabel: 'Scope',
    showcaseTitle: 'What We Showcase',
    highlightsLabel: 'Featured Campaigns',
    highlightsTitle: 'Selected Highlights',
    highlightsSubtitle: 'Representative programmes from our strategic communications work.',
    finalSubtitle: 'Let us help you tell your next success story-with strategy, creativity, and clarity of purpose.',
    ctaPrimary: 'Start a Project',
    ctaSecondary: 'Book a Discovery Call',
  });

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await fetch('/api/case-studies');
        if (res.ok) {
          setStudies(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch case studies:', err);
      }
    };
    fetchStudies();
  }, []);

  return (
    <main className="services-page-main creative-public-page case-studies-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">{caseStudiesCopy.heroLabel}</span>
          <h1 className="page-hero-title">{caseStudiesCopy.heroTitle}</h1>
          <p className="page-hero-tagline">
            {caseStudiesCopy.heroIntro}
          </p>
          <p className="page-hero-tagline" style={{ marginTop: 'var(--space-md)' }}>
            {caseStudiesCopy.heroSubIntro}
          </p>
        </div>
      </div>

      <section className="section section-case-studies" id="case-studies">
        <div className="section-inner">
          <SectionHeader
            variant="inner"
            label={caseStudiesCopy.showcaseLabel}
            title={caseStudiesCopy.showcaseTitle}
            linkHref="/contact#contact"
            linkLabel="Discuss your brief"
          />
          <div className="services-grid" style={{ marginBottom: 'var(--space-3xl)' }}>
            {SHOWCASE_ITEMS.map((item) => (
              <article key={item.title} className="service-card">
                <div className="service-card-body">
                  <h3 className="service-card-title">{item.title}</h3>
                  <p className="service-card-desc">{item.text}</p>
                </div>
              </article>
            ))}
          </div>

          <SectionHeader
            variant="inner"
            label={caseStudiesCopy.highlightsLabel}
            title={caseStudiesCopy.highlightsTitle}
            linkHref="/contact#contact"
            linkLabel="Start a project"
          />
          <p className="section-subtitle centered">{caseStudiesCopy.highlightsSubtitle}</p>

          <div className="services-grid">
            {studies.length > 0
              ? studies.map((s) => (
                  <article key={s.id} className="service-card">
                    <div
                      className={`service-card-image ${s.image_url ? 'has-image' : ''}`}
                      style={{
                        backgroundImage: s.image_url ? `url(${s.image_url})` : undefined,
                        backgroundSize: s.image_url ? 'contain' : undefined,
                        backgroundPosition: s.image_url ? 'center center' : undefined,
                        backgroundRepeat: s.image_url ? 'no-repeat' : undefined,
                        backgroundColor: s.image_url ? '#111418' : '#e5e7eb',
                      }}
                    ></div>
                    <div className="service-card-body">
                      {s.client_name && <span className="case-tag" style={{ fontSize: '0.8rem', opacity: 0.7 }}>{s.client_name}</span>}
                      <h3 className="service-card-title">{s.title}</h3>
                      <p className="service-card-desc">{s.description}</p>
                    </div>
                  </article>
                ))
              : SELECTED_HIGHLIGHTS.map((h) => (
                  <article key={h.title} className="service-card">
                    <div className={`service-card-image card-image-placeholder ${h.imgClass}`}></div>
                    <div className="service-card-body">
                      <h3 className="service-card-title">{h.title}</h3>
                      <p className="service-card-desc">{h.description}</p>
                    </div>
                  </article>
                ))}
          </div>

          <SectionHeader
            variant="inner"
            label="Creative Output"
            title="Visual Portfolio"
            linkHref="/insights"
            linkLabel="Insights & press"
            className="case-studies-page-subsection"
          />
          <div className="section-cta-center services-page-cta">
            <Link href="/contact#contact" className="btn btn-outline">
              Watch Campaign Reels
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              View Design Showcase
            </Link>
            <Link href="/insights" className="btn btn-outline">
              Read Full Case Studies
            </Link>
          </div>

          <p className="section-subtitle centered" style={{ marginTop: 'var(--space-xl)' }}>
            {caseStudiesCopy.finalSubtitle}
          </p>
          <div className="section-cta-center services-page-cta">
            <Link href="/contact#contact" className="btn btn-primary">
              {caseStudiesCopy.ctaPrimary}
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              {caseStudiesCopy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
