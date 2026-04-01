'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionHeader from '../../components/SectionHeader';
import { useSiteSectionContent } from '@/lib/siteSectionCms';

type BrandItem = {
  id: number;
  name: string;
  description?: string | null;
  audience?: string | null;
  format?: string | null;
  image_url?: string | null;
  website_url?: string | null;
};

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
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const brandsCopy = useSiteSectionContent('brands.page', {
    heroLabel: 'Our brands',
    heroTitle: 'Media Properties That Inform, Inspire, and Influence',
    heroIntro:
      'Agile Media Solutions owns and operates a growing portfolio of high-impact media platforms that shape public discourse, elevate African voices, and spotlight key sectors across the continent. Each brand is purpose-built to serve a distinct audience-from policymakers and business leaders to creatives, investors, athletes, and travelers.',
    heroSubIntro:
      'Our media properties are not only content platforms-they are strategic instruments for visibility, engagement, and storytelling.',
    sectionLabel: 'Portfolio',
    sectionTitle: 'Our Publishing and Media Platforms',
    sectionLinkLabel: 'Media partnerships',
    outro:
      "Together, these brands extend Agile Media Solutions' mission to power narratives, elevate stories, and create platforms that inform, connect, and lead.",
    ctaPrimary: 'Advertise With Us',
    ctaSecondary: 'Syndicate Our Content',
    ctaTertiary: 'Become a Contributor',
  });

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const res = await fetch('/api/brands');
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        setBrands(data as BrandItem[]);
      } catch {
        // Keep static fallback copy when API is unavailable.
      }
    };
    loadBrands();
  }, []);

  const renderedBrands =
    brands.length > 0
      ? brands
      : DOCUMENT_BRANDS.map((b, idx) => ({
          id: -(idx + 1),
          name: b.title,
          description: b.body,
          audience: b.audience || null,
          format: b.format || null,
          image_url: null,
          website_url: null,
        }));

  const fallbackImageClass = (name: string, idx: number) => {
    const key = name.toLowerCase();
    if (key.includes('sports') || key.includes('sportz')) return 'brand-img-sports';
    if (key.includes('news') || key.includes('bulletin') || key.includes('hospitality')) return 'brand-img-news';
    if (idx % 3 === 1) return 'brand-img-sports';
    if (idx % 3 === 2) return 'brand-img-news';
    return 'brand-img-leaders';
  };

  const normalizeWebsiteHref = (url?: string | null) => {
    if (!url) return '';
    const value = url.trim();
    if (!value) return '';
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  };

  return (
    <main className="services-page-main creative-public-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">{brandsCopy.heroLabel}</span>
          <h1 className="page-hero-title">{brandsCopy.heroTitle}</h1>
          <p className="page-hero-tagline">
            {brandsCopy.heroIntro}
          </p>
          <p className="page-hero-tagline" style={{ marginTop: 'var(--space-md)' }}>
            {brandsCopy.heroSubIntro}
          </p>
        </div>
      </div>
      <section className="section section-cards">
        <div className="section-inner">
          <SectionHeader
            variant="inner"
            label={brandsCopy.sectionLabel}
            title={brandsCopy.sectionTitle}
            linkHref="/contact#contact"
            linkLabel={brandsCopy.sectionLinkLabel}
          />
          <div className="services-grid brands-grid">
            {renderedBrands.map((b, idx) => (
              <article key={`brand-${b.id}-${b.name}`} className="service-card">
                <div
                  className={`service-card-image ${b.image_url ? 'has-image brand-logo-image' : fallbackImageClass(b.name, idx)}`}
                  style={
                    b.image_url
                      ? {
                          backgroundImage: `url(${b.image_url})`,
                          backgroundSize: 'contain',
                          backgroundPosition: 'center center',
                          backgroundRepeat: 'no-repeat',
                          backgroundColor: '#f9f9f9',
                        }
                      : undefined
                  }
                ></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{b.name}</h3>
                  <p className="service-card-desc">
                    {b.description || 'A strategic media platform built to inform and influence key audiences.'}
                  </p>
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
                  {normalizeWebsiteHref(b.website_url) && (
                    <p className="service-card-desc">
                      <Link href={normalizeWebsiteHref(b.website_url)} target="_blank" rel="noopener noreferrer" className="link-arrow-text">
                        Visit brand →
                      </Link>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="section-subtitle centered" style={{ marginTop: 'var(--space-xl)' }}>
            {brandsCopy.outro}
          </p>
          <div className="section-cta-center services-page-cta">
            <Link href="/contact#contact" className="btn btn-primary">
              {brandsCopy.ctaPrimary}
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              {brandsCopy.ctaSecondary}
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              {brandsCopy.ctaTertiary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
