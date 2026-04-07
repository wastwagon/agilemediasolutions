'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ParallaxImage from '../../components/ParallaxImage';
import Link from 'next/link';
import { DEFAULT_HEAD_OFFICE_LINE } from '@/lib/defaultAddress';
import { useSiteSectionContent } from '@/lib/siteSectionCms';

export default function AboutPage() {
  const aboutCopy = useSiteSectionContent('about.page', {
    heroLabel: 'About us',
    heroTitle: 'Powering Narratives. Elevating Voices. Driving Impact.',
    heroTagline:
      'Agile Media Solutions is an international media, PR, and communications firm helping governments, institutions, brands, and movements shape the messages that move nations, markets, and minds.',
    identityLabel: 'Our Identity',
    identityTitle: 'Who We Are',
    identityP1:
      'We are a multidisciplinary communications agency operating at the intersection of strategy, storytelling, and public influence. From presidential campaigns to global brand launches, our work blends intelligence, creativity, and execution power-helping clients lead conversations and shape change.',
    identityP2:
      'Our services span every aspect of strategic communication-from policy messaging to digital campaigns, crisis PR to institutional branding. We build the communications infrastructure that enables leadership, trust, and transformation.',
    ctaPrimary: 'Explore Our Services',
    ctaSecondary: 'Work With Us',
    presenceLabel: 'Presence',
    presenceTitle: 'Where we work',
    presenceSubtitle: `Address: ${DEFAULT_HEAD_OFFICE_LINE}. Additional locations in Nairobi and Johannesburg—we are available across time zones and channels to discuss ideas, opportunities, and collaborations.`,
  });
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <main className="page-hero-wrapper creative-public-page">
      <div className="page-hero">
        <motion.div className="page-hero-inner" variants={container} initial="hidden" animate="show">
          <div style={{ overflow: 'hidden', paddingBottom: '4px' }}>
            <motion.span variants={item} className="page-hero-label" style={{ display: 'inline-block' }}>
              {aboutCopy.heroLabel}
            </motion.span>
          </div>
          <div style={{ overflow: 'hidden', paddingBottom: '8px' }}>
            <motion.h1 variants={item} className="page-hero-title">
              {aboutCopy.heroTitle}
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.p variants={item} className="page-hero-tagline">
              {aboutCopy.heroTagline}
            </motion.p>
          </div>
        </motion.div>
      </div>

      <section className="section section-about-intro">
        <div className="section-inner">
          <div className="section-split">
            <motion.div
              className="section-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <span className="section-label">{aboutCopy.identityLabel}</span>
              <h2 className="section-title">{aboutCopy.identityTitle}</h2>
              <p className="section-text">
                {aboutCopy.identityP1}
              </p>
              <p className="section-text">
                {aboutCopy.identityP2}
              </p>
              <div className="section-cta-inline" style={{ marginTop: '1.5rem' }}>
                <Link href="/services" className="btn btn-primary">
                  {aboutCopy.ctaPrimary}
                </Link>
                <Link href="/contact#contact" className="btn btn-outline">
                  {aboutCopy.ctaSecondary}
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="section-media"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '600px', borderRadius: '16px', overflow: 'hidden' }}
            >
              <ParallaxImage className="media-who" offset={80} />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section section-values">
        <div className="section-inner">
          <span className="section-label" style={{ textAlign: 'center' }}>{aboutCopy.presenceLabel}</span>
          <motion.h2
            className="section-title centered"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {aboutCopy.presenceTitle}
          </motion.h2>
          <motion.p
            className="section-subtitle centered"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: '40rem', margin: '0 auto' }}
          >
            {aboutCopy.presenceSubtitle}
          </motion.p>
        </div>
      </section>
    </main>
  );
}
