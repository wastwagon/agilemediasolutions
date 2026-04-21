'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import { useSiteSectionContent } from '@/lib/siteSectionCms';

type EventItem = {
  id: number;
  title: string;
  description?: string | null;
  tagline?: string | null;
  body?: string | null;
  features?: string | null;
  audience?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  order_index?: number | null;
};

type EventDetail = {
  tagline: string;
  body: string;
  features: string;
  audience: string;
  imageClass: string;
};

const EVENT_DETAIL_FALLBACK: Record<string, EventDetail> = {
  'Africa Trade Awards': {
    tagline: "Celebrating Excellence Across the Continent's Trade Ecosystem",
    body: "The Awards recognize leading exporters, reform champions, trade institutions, and high-performing brands contributing to Africa's economic integration.",
    features: 'Exporter of the Year, Trade Enabler, Public Sector Innovator, Emerging Enterprise, Digital Trade Leader',
    audience: 'Corporates, SMEs, government agencies, financial institutions',
    imageClass: 'event-img-trade-awards',
  },
  'Africa Industry Awards': {
    tagline: "Honoring the Enterprises Building Africa's Industrial Future",
    body: "A high-level awards program spotlighting innovation, resilience, and growth in Africa's industrial and manufacturing sectors-from agribusiness and mining to energy, construction, and light industry.",
    features: 'Sector-specific categories, innovation spotlights, media coverage, investor networking',
    audience: 'Industrial firms, regulators, financiers, development agencies, media',
    imageClass: 'event-img-industry-awards',
  },
  'Africa Investment Week': {
    tagline: 'Connecting Capital to Opportunity Across African Markets',
    body: 'A dynamic, multi-day platform that brings together investors, fund managers, startups, governments, and DFIs to explore sector trends, identify opportunities, and catalyze partnerships.',
    features: 'Deal rooms, roundtables, investor briefings, country presentations, fund showcases',
    audience: 'VCs, private equity, sovereign wealth funds, investment promotion agencies',
    imageClass: 'event-img-investment-week',
  },
  'Afro Jazz Festival': {
    tagline: 'Celebrating the Soul of Africa Through Music, Art, and Culture',
    body: 'An immersive cultural experience showcasing the best of African jazz and fusion-combining live performances, visual art, food, fashion, and storytelling. The festival bridges heritage and innovation, creativity and commerce.',
    features: 'Live concerts, curated exhibitions, talent showcases, brand activations',
    audience: 'Music lovers, cultural institutions, tourism boards, creative brands',
    imageClass: 'event-img-jazz',
  },
};

const SIGNATURE_EVENTS_FALLBACK = [
  {
    title: 'Africa Trade Awards',
    imageClass: 'event-img-trade-awards',
  },
  {
    title: 'Africa Industry Awards',
    imageClass: 'event-img-industry-awards',
  },
  {
    title: 'Africa Investment Week',
    imageClass: 'event-img-investment-week',
  },
  {
    title: 'Afro Jazz Festival',
    imageClass: 'event-img-jazz',
  },
];

export default function Page() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const eventsCopy = useSiteSectionContent('signature-events.page', {
    heroLabel: 'Signature events',
    heroTitle: 'Curated Platforms That Bring Visionaries, Innovators, and Institutions Together',
    heroIntro:
      'Agile Media Solutions is not only a communications firm-we are also a convening force. Through our proprietary events, we bring together influential voices across trade, investment, culture, policy, and industry to inspire dialogue, foster partnerships, and build platforms that matter.',
    heroSubIntro: 'Our events combine powerful content, strategic visibility, high-level participation, and unforgettable experiences.',
    sectionLabel: 'Event Portfolio',
    sectionTitle: 'Signature Experiences and Convenings',
    sectionLinkLabel: 'Sponsorship options',
    ctaPrimary: 'Partner With Us',
    ctaSecondary: 'Home',
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        const filtered = (data as EventItem[]).filter(
          (ev) => typeof ev?.title === 'string' && !/^africa trade summit$/i.test(ev.title.trim())
        );
        setEvents(filtered);
      } catch {
        // Keep static fallback content when API is unavailable.
      }
    };
    loadEvents();
  }, []);

  const renderedEvents: EventItem[] =
    events.length > 0
      ? events
      : SIGNATURE_EVENTS_FALLBACK.map((item, idx) => ({
          id: -(idx + 1),
          title: item.title,
          image_url: null,
          link_url: '/contact#contact',
          order_index: idx,
        }));

  return (
    <main className="services-page-main creative-public-page signature-events-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">{eventsCopy.heroLabel}</span>
          <h1 className="page-hero-title">{eventsCopy.heroTitle}</h1>
          <p className="page-hero-tagline">
            {eventsCopy.heroIntro}
          </p>
          <p className="page-hero-tagline" style={{ marginTop: 'var(--space-md)' }}>
            {eventsCopy.heroSubIntro}
          </p>
        </div>
      </div>
      <section className="section section-cards">
        <div className="section-inner">
          <SectionHeader
            variant="inner"
            label={eventsCopy.sectionLabel}
            title={eventsCopy.sectionTitle}
            linkHref="/contact#contact"
            linkLabel={eventsCopy.sectionLinkLabel}
          />
          <div className="services-grid">
            {renderedEvents.map((e) => {
              const fallback = EVENT_DETAIL_FALLBACK[e.title] ?? {
                tagline: e.description?.trim() || 'Strategic convening platform built to connect ideas, institutions, and impact.',
                body: e.description?.trim() || 'This event is designed to drive collaboration, visibility, and outcomes across public and private sector stakeholders.',
                features: 'Panels, keynotes, showcases, and strategic networking sessions',
                audience: 'Leaders, institutions, partners, media, and investors',
                imageClass: 'event-img-trade-awards',
              };
              const detail = {
                tagline: e.tagline?.trim() || fallback.tagline,
                body: e.body?.trim() || fallback.body,
                features: e.features?.trim() || fallback.features,
                audience: e.audience?.trim() || fallback.audience,
                imageClass: fallback.imageClass,
              };
              return (
              <article key={e.id} className="service-card">
                <div
                  className={`service-card-image card-image-placeholder ${e.image_url ? 'has-image' : detail.imageClass}`}
                  style={
                    e.image_url
                      ? {
                          backgroundImage: `url(${e.image_url})`,
                          backgroundSize: 'contain',
                          backgroundPosition: 'center center',
                          backgroundRepeat: 'no-repeat',
                          backgroundColor: '#111418',
                        }
                      : undefined
                  }
                ></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{e.title}</h3>
                  <p className="service-card-desc">
                    <strong>{detail.tagline}</strong>
                  </p>
                  <p className="service-card-desc">{detail.body}</p>
                  <p className="service-card-desc">
                    <strong>Features:</strong> {detail.features}
                  </p>
                  <p className="service-card-desc">
                    <strong>Audience:</strong> {detail.audience}
                  </p>
                </div>
              </article>
            )})}
          </div>
          <div className="section-cta-center services-page-cta">
            <Link href="/contact#contact" className="btn btn-primary">
              {eventsCopy.ctaPrimary}
            </Link>
            <Link href="/" className="btn btn-outline">
              {eventsCopy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
