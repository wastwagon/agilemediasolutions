'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ParallaxImage from '@/components/ParallaxImage';
import Link from 'next/link';
import { withLocalePrefix } from '@/lib/locale';
import { useLocale } from '@/components/LocaleProvider';
import { localizeHref } from '@/lib/i18n';
import { getAboutPageDefaults } from '@/lib/i18n/pageDefaults';
import { useSiteSectionContent } from '@/lib/siteSectionCms';

export default function AboutPage() {
  const locale = useLocale();
  const aboutCopy = useSiteSectionContent('about.page', getAboutPageDefaults(locale));
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
                <Link href={withLocalePrefix('/services', locale)} className="btn btn-primary">
                  {aboutCopy.ctaPrimary}
                </Link>
                <Link href={localizeHref('/contact#contact', locale)} className="btn btn-outline">
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
              <ParallaxImage
                className="media-who"
                offset={80}
                src={aboutCopy.identityImageUrl?.trim() || undefined}
              />
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
