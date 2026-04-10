'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { nh, nhHeroImage, nhMarqueeLogos } from './content';
import NhContactForm from './NhContactForm';
import { useNhSplitHeadlines } from './useNhSplitHeadlines';

const easeOut = [0.2, 0.8, 0.2, 1] as const;

function StatCounter({ end, suffix }: { end: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-12% 0px' });
  const [n, setN] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (reduceMotion) {
      setN(end);
      return;
    }
    let start: number | null = null;
    const duration = 1400;
    let raf = 0;
    let cancelled = false;
    const step = (t: number) => {
      if (cancelled) return;
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - (1 - p) * (1 - p);
      setN(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [isInView, end, reduceMotion]);

  return (
    <div ref={ref} className="nh-stat-num">
      <span>{n}</span>
      {suffix ? <span className="nh-stat-suf">{suffix}</span> : null}
    </div>
  );
}

function NhFaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="nh-faq-item" data-open={open}>
      <button
        type="button"
        className="nh-faq-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="nh-faq-icon" aria-hidden>
          +
        </span>
        {q}
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            className="nh-faq-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
          >
            <p>{a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const reveal = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: (typeof i === 'number' ? i : 0) * 0.06, duration: 0.55, ease: easeOut },
  }),
};

export default function NewHomePageClient() {
  const [splash, setSplash] = useState(true);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  useNhSplitHeadlines(rootRef, reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setSplash(false);
      return;
    }
    const t = window.setTimeout(() => setSplash(false), 2000);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  const heroChars = nh.heroMark.split('');

  return (
    <div ref={rootRef} className="nh-page">
      <AnimatePresence>
        {splash ? (
          <motion.div
            key="nh-splash"
            className="nh-route-preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: '-12%' }}
            transition={{ duration: 1.05, ease: easeOut }}
          >
            <motion.h2
              initial={{ scale: 0.92, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: easeOut }}
            >
              {nh.heroMark}
            </motion.h2>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <section className="nh-hero-section" aria-label="Hero">
        <div className="nh-hero-bg" style={{ backgroundImage: `url(${nhHeroImage})` }} />
        <div className="nh-hero-inner">
          <motion.p
            className="nh-eyebrow"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.6, ease: easeOut } },
            }}
          >
            {nh.heroEyebrow}
          </motion.p>
          <h1 className="nh-herotext" aria-label={nh.heroMark}>
            {heroChars.map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + i * 0.07, duration: 0.65, ease: easeOut }}
              >
                {ch}
              </motion.span>
            ))}
          </h1>
          <motion.div
            className="nh-hero-cta-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.55, ease: easeOut }}
          >
            <a className="nh-btn" href="#Contact">
              {nh.heroCta}
            </a>
          </motion.div>
        </div>
      </section>

      <section id="About" className="nh-section" aria-labelledby="nh-about-heading">
        <div className="nh-about-block">
          <motion.p
            id="nh-about-heading"
            className="nh-subhead"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-12%' }}
            variants={{
              hidden: { opacity: 0, y: 28 },
              show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeOut } },
            }}
          >
            {nh.aboutLine}
          </motion.p>
        </div>
        <div className="nh-fade-line" aria-hidden />
        <div className="nh-marquee" aria-label="Client sectors">
          <div className="nh-marquee-track">
            {[...nhMarqueeLogos, ...nhMarqueeLogos].map((src, i) => (
              <img key={`${src}-${i}`} src={src} alt="" width={120} height={42} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      <section id="Projects" className="nh-section" aria-labelledby="nh-projects-h">
        <header className="nh-section-head">
          <h2 id="nh-projects-h" data-nh-split>
            Projects
          </h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} custom={1}>
            {nh.sectionBlurb}
          </motion.p>
        </header>
        <div className="nh-projects-grid">
          {nh.projects.map((p, i) => (
            <motion.div
              key={p.title}
              className="nh-project-card"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
              variants={reveal}
              custom={i}
            >
              <span>{p.tag}</span>
              <h3>{p.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="Services" className="nh-section" aria-labelledby="nh-services-h">
        <header className="nh-section-head">
          <h2 id="nh-services-h" data-nh-split>
            Services
          </h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} custom={1}>
            {nh.sectionBlurb}
          </motion.p>
        </header>
        <div className="nh-services-grid">
          {nh.services.map((s, i) => (
            <motion.article
              key={s.title}
              className="nh-service-card"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-10%' }}
              variants={reveal}
              custom={i}
            >
              <h3>{s.title}</h3>
              <p>{s.line}</p>
              <ul className="nh-service-list">
                {s.bullets.map((b) => (
                  <li key={b}>
                    <span className="nh-check" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="Testimonials" className="nh-section" aria-labelledby="nh-test-h">
        <header className="nh-section-head">
          <h2 id="nh-test-h" data-nh-split>
            Testimonials
          </h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} custom={1}>
            {nh.sectionBlurb}
          </motion.p>
        </header>
        <div className="nh-testimonials-row">
          {nh.testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              className="nh-testimonial"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={reveal}
              custom={i}
            >
              <div className="nh-avatar" aria-hidden />
              <p>&ldquo;{t.quote}&rdquo;</p>
              <footer>
                {t.name}
                <br />
                {t.org}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      <section id="WhyUs" className="nh-section" aria-labelledby="nh-why-h">
        <header className="nh-section-head">
          <h2 id="nh-why-h" data-nh-split>
            Why us
          </h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} custom={1}>
            {nh.sectionBlurb}
          </motion.p>
        </header>
        <div className="nh-why-grid">
          <motion.div
            className="nh-why-card"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={reveal}
          >
            <p className="nh-why-label" style={{ marginTop: 0 }}>
              {nh.whyUs.tagline}
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'rgba(240,240,240,0.6)' }}>
              Communications specialists
            </p>
          </motion.div>
          {nh.whyUs.stats.map((s) => (
            <div key={s.label} className="nh-why-card">
              <StatCounter end={s.value} suffix={s.suffix} />
              <p className="nh-why-label">{s.label}</p>
            </div>
          ))}
          <motion.a className="nh-cta-tile" href="#Contact" initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal}>
            <h4>{nh.whyUs.ctaTitle}</h4>
            <p className="nh-cta-sub">{nh.whyUs.ctaSub}</p>
            <span className="nh-cta-hover">{nh.whyUs.ctaHover}</span>
          </motion.a>
        </div>
      </section>

      <section id="Awards" className="nh-section" aria-labelledby="nh-awards-h">
        <header className="nh-section-head">
          <h2 id="nh-awards-h" data-nh-split>
            Awards
          </h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} custom={1}>
            {nh.sectionBlurb}
          </motion.p>
        </header>
        <div className="nh-awards">
          <div className="nh-awards-head">
            <span>Enterprise</span>
            <span>Award</span>
            <span>Year</span>
          </div>
          {nh.awards.map((row) => (
            <div key={row.award} className="nh-awards-row">
              <span>{row.org}</span>
              <span>{row.award}</span>
              <span>{row.year}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="Team" className="nh-section" aria-labelledby="nh-team-h">
        <header className="nh-section-head">
          <h2 id="nh-team-h" data-nh-split>
            The team
          </h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} custom={1}>
            {nh.sectionBlurb}
          </motion.p>
        </header>
        <div className="nh-team-grid">
          {nh.team.map((m, i) => (
            <motion.article
              key={m.name}
              className="nh-team-card"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={reveal}
              custom={i}
            >
              <h3>{m.name}</h3>
              <p className="nh-team-role">{m.role}</p>
              <p>{m.bio}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="Pricing" className="nh-section" aria-labelledby="nh-price-h">
        <header className="nh-section-head">
          <h2 id="nh-price-h" data-nh-split>
            Pricing
          </h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} custom={1}>
            {nh.sectionBlurb}
          </motion.p>
        </header>
        <div className="nh-pricing-grid">
          {nh.pricing.map((tier) => (
            <motion.article
              key={tier.name}
              className={'featured' in tier && tier.featured ? 'nh-price-card nh-price-card--featured' : 'nh-price-card'}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={reveal}
            >
              <h3>{tier.name}</h3>
              <div className="nh-price-tag">{tier.price}</div>
              <p>{tier.blurb}</p>
              <ul>
                {tier.features.map((f) => (
                  <li key={f}>
                    <span className="nh-check" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <a className={'featured' in tier && tier.featured ? 'nh-btn nh-btn--dark' : 'nh-btn'} href="#Contact">
                Get started
              </a>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="FAQ" className="nh-section" aria-labelledby="nh-faq-h">
        <header className="nh-section-head">
          <h2 id="nh-faq-h" data-nh-split>
            FAQ
          </h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} custom={1}>
            {nh.sectionBlurb}
          </motion.p>
        </header>
        <div className="nh-faq-layout">
          <div className="nh-faq-list">
            {nh.faq.map((item) => (
              <NhFaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
          <div className="nh-faq-aside">
            <a className="nh-cta-tile" href="#Contact">
              <h4>{nh.whyUs.ctaTitle}</h4>
              <p className="nh-cta-sub">{nh.whyUs.ctaSub}</p>
              <span className="nh-cta-hover">{nh.whyUs.ctaHover}</span>
            </a>
          </div>
        </div>
      </section>

      <section id="Contact" className="nh-section" aria-labelledby="nh-contact-h">
        <header className="nh-section-head">
          <h2 id="nh-contact-h" data-nh-split>
            Contact us
          </h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} custom={1}>
            {nh.sectionBlurb}
          </motion.p>
        </header>
        <NhContactForm />
      </section>

      <div className="nh-bottom-brand" aria-hidden>
        <h2>AGILE</h2>
      </div>
    </div>
  );
}
