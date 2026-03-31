'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionHeader from '../../components/SectionHeader';
import { useSiteSectionContent } from '@/lib/siteSectionCms';

type ServiceItem = {
  id: number;
  icon?: string | null;
  title: string;
  description?: string | null;
  highlights?: string | null;
  order_index?: number | null;
};

const DOCUMENT_SERVICES: { icon: string; title: string; description: string }[] = [
  {
    icon: 'strategic',
    title: 'Strategic Communications & Narrative Building',
    description:
      'We develop tailored messaging frameworks, storytelling strategies, and communication blueprints that align with your institutional goals and public identity. Includes: Message mapping, speechwriting, narrative architecture, and positioning strategies.',
  },
  {
    icon: 'media-relations',
    title: 'Media Relations & Reputation Management',
    description:
      'We help you build and sustain public trust by managing perception, cultivating media relationships, and preparing for both visibility and scrutiny. Includes: Press engagement, media training, crisis response, reputation recovery.',
  },
  {
    icon: 'campaigns',
    title: 'Campaigns, Advocacy & Stakeholder Engagement',
    description:
      'We design high-impact campaigns that mobilize audiences, shift public opinion, and influence policy or behavior. Includes: Advocacy communications, civic mobilization, stakeholder mapping, and coalition engagement.',
  },
  {
    icon: 'digital',
    title: 'Digital, Social & Multimedia Communications',
    description:
      'We deliver digital-first communications across platforms—combining content strategy, design, and audience analytics for sustained engagement. Includes: Social media strategy, influencer integration, video content, community management.',
  },
  {
    icon: 'branding',
    title: 'Branding, Design & Identity Systems',
    description:
      'We build powerful brand identities that reflect your vision and connect meaningfully with your audience. Includes: Visual identity, brand messaging, institutional rebranding, graphic design.',
  },
  {
    icon: 'events',
    title: 'Event Media & Summit Support',
    description:
      'We provide complete media support for events—from press handling and content creation to live coverage and post-event promotion. Includes: Media kits, live production, speaker preparation, and summit communications.',
  },
  {
    icon: 'esg',
    title: 'Investor, Donor & ESG Communications',
    description:
      'We help you communicate value, transparency, and vision to investors, funders, and strategic partners. Includes: ESG reports, donor briefings, impact storytelling, investor decks.',
  },
  {
    icon: 'insights',
    title: 'Insights, Monitoring & Performance Measurement',
    description:
      'We equip you with real-time intelligence and performance analysis to track progress, evaluate reach, and optimize strategies. Includes: Media monitoring, audience analytics, sentiment analysis, reporting dashboards.',
  },
  {
    icon: 'advisory',
    title: 'Advisory, Training & Institutional Capacity Building',
    description:
      'We build in-house communication capacity through advisory support, coaching, and strategic audits. Includes: Executive communications coaching, staff training, department strategy planning.',
  },
  {
    icon: 'diplomacy',
    title: 'Influence Strategy & Public Diplomacy',
    description:
      'We support governments, embassies, and regional bodies in shaping international narratives and building soft power. Includes: Diplomatic campaigns, narrative repositioning, multilateral engagement.',
  },
  {
    icon: 'ai',
    title: 'AI & Innovation Lab',
    description:
      'We leverage the latest tools in content automation, predictive analytics, and immersive media to keep our clients at the forefront of communications. Includes: AI-assisted content, AR/VR experiences, digital production systems.',
  },
  {
    icon: 'policy',
    title: 'Policy & Legislative Communications',
    description:
      'We translate complex legal and policy content into compelling public narratives that inform, engage, and persuade. Includes: Policy brief translation, public rollout strategies, legislative PR.',
  },
  {
    icon: 'market',
    title: 'Market Entry & Investor Onboarding Communications',
    description:
      'We help international brands and investors navigate new markets with culturally aware, locally resonant communications strategies. Includes: Market reputation mapping, regulator engagement messaging, localization support.',
  },
  {
    icon: 'corporate',
    title: 'Corporate Communications & Media Circulation',
    description:
      'We manage formal and institutional messaging across internal and external channels—ensuring consistency, clarity, and compliance. Includes: Press releases, internal memos, regulatory disclosures, and executive communications.',
  },
  {
    icon: 'studio',
    title: 'Studio Services: Production, Design & Content Creation',
    description:
      'Our in-house creative studio produces world-class visuals, video, photography, and multimedia content tailored to your audience and brand. Includes: Documentary production, brand videos, photography, post-production.',
  },
];

function parseHighlightsFromIncludes(description?: string | null): string[] {
  if (!description) return [];
  const idx = description.indexOf('Includes:');
  if (idx < 0) return [];
  return description
    .slice(idx + 'Includes:'.length)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function parseServiceHighlights(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function normalizeServiceIconToken(icon?: string | null) {
  if (!icon) return '';
  const trimmed = icon.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
    return '';
  }
  return trimmed
    .toLowerCase()
    .replace(/^service-img-/, '')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function resolveServiceImage(icon?: string | null) {
  if (!icon) return { imageUrl: '', imageClass: 'service-img-strategic' };
  const trimmed = icon.trim();
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
    return { imageUrl: trimmed, imageClass: '' };
  }
  const normalized = normalizeServiceIconToken(trimmed);
  return { imageUrl: '', imageClass: normalized ? `service-img-${normalized}` : 'service-img-strategic' };
}

export default function Page() {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        setServices(data as ServiceItem[]);
      } catch {
        // Keep static fallback content if API is unavailable.
      }
    };
    loadServices();
  }, []);

  const renderedServices: ServiceItem[] =
    services.length > 0
      ? services
      : DOCUMENT_SERVICES.map((s, idx) => ({
          id: -(idx + 1),
          title: s.title,
          description: s.description,
          icon: s.icon,
          order_index: idx,
        }));
  const servicesCopy = useSiteSectionContent('services.page', {
    heroLabel: 'Services',
    heroTitle: 'Comprehensive Communications Solutions. Strategically Designed. Precisely Delivered.',
    heroIntro:
      'Agile Media Solutions offers a full suite of communications, media, and public relations services designed for governments, businesses, institutions, and mission-driven organizations. Our work blends strategic thinking, creative execution, and sectoral intelligence-ensuring our clients communicate with clarity, confidence, and purpose.',
    heroSubIntro: '',
    sectionLabel: 'Capabilities',
    sectionTitle: 'Explore our integrated service offerings',
    sectionSubtitle:
      "Need help choosing the right mix? We'll assess your goals and recommend a package that delivers real-world outcomes.",
  });

  const heroContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const heroItem = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };

  const gridContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <main className="services-page-main creative-public-page">
      <div className="page-hero">
        <motion.div className="page-hero-inner" variants={heroContainer} initial="hidden" animate="show">
          <div style={{ overflow: 'hidden', paddingBottom: '4px' }}>
            <motion.span variants={heroItem} className="page-hero-label" style={{ display: 'inline-block' }}>
              {servicesCopy.heroLabel}
            </motion.span>
          </div>
          <div style={{ overflow: 'hidden', paddingBottom: '8px' }}>
            <motion.h1 variants={heroItem} className="page-hero-title">
              {servicesCopy.heroTitle}
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.p variants={heroItem} className="page-hero-tagline">
              {servicesCopy.heroIntro}
            </motion.p>
          </div>
          {servicesCopy.heroSubIntro ? (
            <div style={{ overflow: 'hidden' }}>
              <motion.p variants={heroItem} className="page-hero-tagline" style={{ marginTop: 'var(--space-md)' }}>
                {servicesCopy.heroSubIntro}
              </motion.p>
            </div>
          ) : null}
        </motion.div>
      </div>

      <section className="section section-cards">
        <div className="section-inner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              variant="inner"
              label={servicesCopy.sectionLabel}
              title={servicesCopy.sectionTitle}
              linkHref="/contact#contact"
              linkLabel="Book strategy call"
            />
          </motion.div>
          <motion.p
            className="section-subtitle centered all-services-intro"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {servicesCopy.sectionSubtitle}
          </motion.p>
          <motion.div
            className="services-grid"
            variants={gridContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
          >
            {renderedServices.map((s) => {
              const image = resolveServiceImage(s.icon);
              const highlights = parseServiceHighlights(s.highlights);
              const fallbackHighlights = highlights.length > 0 ? highlights : parseHighlightsFromIncludes(s.description);
              return (
              <motion.article key={`service-${s.id}-${s.title}`} className="service-card magnetic" variants={cardItem}>
                <div
                  className={`service-card-image ${image.imageUrl ? 'has-image' : image.imageClass}`}
                  style={
                    image.imageUrl
                      ? {
                          backgroundImage: `url(${image.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'top center',
                          backgroundRepeat: 'no-repeat',
                        }
                      : undefined
                  }
                ></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{s.title}</h3>
                  <p className="service-card-desc">{s.description || 'Comprehensive communications support tailored to your mission and audience.'}</p>
                  {fallbackHighlights.length > 0 ? (
                    <ul className="service-card-bullets">
                      {fallbackHighlights.map((item) => (
                        <li key={`${s.id}-${item}`}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </motion.article>
            )})}
          </motion.div>

          <motion.div
            className="section-cta-center services-page-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/contact#contact" className="btn btn-primary magnetic">
              Request a Consultation
            </Link>
            <Link href="/case-studies" className="btn btn-outline magnetic">
              Browse Our Case Studies
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
