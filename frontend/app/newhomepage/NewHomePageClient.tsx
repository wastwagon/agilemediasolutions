'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { nh, nhMarqueeLogos } from './content';
import NhContactForm from './NhContactForm';
import NhFaqItem from './NhFaqItem';
import { nhServiceIconSvgs } from './nhServiceIcons';
import {
  nhTemplateGreenCheck,
  nhTemplateProjectCovers,
  nhTemplateTeamPhotos,
  nhTemplateWhyMark,
} from './nhTemplateUrls';
import { useNhScrollReveals } from './useNhScrollReveals';
import { useNhSplitHeadlines } from './useNhSplitHeadlines';
import { NhAwsaFooter, NhAwsaNavbar } from './NhAwsaBars';

const easeOut = [0.2, 0.8, 0.2, 1] as const;

function SectionHead({ headingId, title }: { headingId: string; title: string }) {
  return (
    <div className="header-section">
      <h2 id={headingId} className="heading2 slide-left-2">
        <span className="bold-text">
          {title}
        </span>
      </h2>
      <p className="text-color-secondary slide-right max-description is-40 nh-section-blurb" data-nh-reveal>
        {nh.sectionBlurb}
      </p>
    </div>
  );
}

function NewHomePageInner({ reduceMotion }: { reduceMotion: boolean | null }) {
  const [splash, setSplash] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  useNhSplitHeadlines(rootRef, reduceMotion);
  useNhScrollReveals(rootRef, reduceMotion);

  const onHashNavCapture = useCallback(
    (e: React.MouseEvent) => {
      if (reduceMotion) return;
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    },
    [reduceMotion],
  );

  useEffect(() => {
    if (reduceMotion) {
      setSplash(false);
      return;
    }
    const t = window.setTimeout(() => setSplash(false), 2000);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  useEffect(() => {
    if (splash) return;
    void import('gsap/ScrollTrigger').then((mod) => {
      mod.ScrollTrigger.refresh();
    });
  }, [splash]);

  const heroChars = nh.heroMark.split('');

  return (
    <div
      ref={rootRef}
      className="nh-page awsa-exact page-wrap"
      onClickCapture={onHashNavCapture}
    >
      <NhAwsaNavbar />

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
              className="heading2"
              initial={{ scale: 0.92, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: easeOut }}
            >
              {nh.heroMark}
            </motion.h2>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <section className="hero-section-2" aria-label="Hero">
        <div className="hero-wrapper-2">
          <div className="containertexthero">
            <p className="textsecondaryhero">{nh.heroEyebrow}</p>
            <h1 className="herotext" aria-label={nh.heroMark}>
              {reduceMotion ? (
                nh.heroMark
              ) : (
                heroChars.map((ch, i) => (
                  <motion.span
                    key={`${ch}-${i}`}
                    initial={{ opacity: 0, y: 36 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.06, duration: 0.55, ease: easeOut }}
                  >
                    {ch}
                  </motion.span>
                ))
              )}
            </h1>
            <div className="containercalltoaction">
              <a href="#Contact" className="button whitebutton w-inline-block">
                {nh.heroCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="About" className="about" aria-labelledby="nh-about-heading">
        <div className="header-section nh-about-head">
          <p id="nh-about-heading" className="subhead-main _80">
            {nh.aboutLine}
          </p>
          <p className="text-color-secondary max-description is-40 nh-section-blurb nh-about-body">
            {nh.aboutBody}
          </p>
        </div>
        <div className="line-divider" aria-hidden />
        <div className="marquee" aria-label="Sectors">
          <div className="marqueelogos">
            <div className="nh-marquee-track">
              {[...nhMarqueeLogos, ...nhMarqueeLogos].map((src, i) => (
                <img key={`${src}-${i}`} src={src} alt="" width={120} height={42} loading="lazy" />
              ))}
            </div>
          </div>
          <div className="fade-gradient nh-marquee-fade" aria-hidden />
        </div>
      </section>

      <section id="Projects" className="paddingtop paddingworkssection" aria-labelledby="nh-projects-heading">
        <div className="max-width-large align-center">
          <SectionHead headingId="nh-projects-heading" title="Projects" />
        </div>
        <div className="containerworks">
          <div className="worksgrid">
            {nh.projects.map((p) => (
              <div key={p.title} className="collection-item workscontainer" data-nh-reveal>
                <a href="#Contact" className="project-link w-inline-block">
                  <img
                    className="project-thumbnail-2"
                    src={nhTemplateProjectCovers[p.coverIndex]}
                    alt=""
                    width={800}
                    height={600}
                    loading="lazy"
                  />
                  <div className="divmid" aria-hidden>
                    <h3 className="heading-2">{p.title}</h3>
                  </div>
                  <div className="project-content">
                    <div className="project-content-footer">
                      <div className="workstitle textsmall">{p.tag}</div>
                      <div className="workstitle textsmall">{p.title}</div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="Services" className="section-home-services" aria-labelledby="nh-services-heading">
        <div className="max-width-large align-center">
          <SectionHead headingId="nh-services-heading" title="Services" />
        </div>
        <div className="service-grid">
          {nh.services.map((s) => (
            <article key={s.title} className="service-card" data-nh-reveal>
              <div className="service_content-2">
                <div className="service-detail-div">
                  <div className="service-icon-box">{nhServiceIconSvgs[s.iconIndex]}</div>
                  <h3 className="titleservices">{s.title}</h3>
                  <p className="paragraph">{s.line}</p>
                  <div className="service-list-detail-div">
                    {s.bullets.map((b) => (
                      <div key={b} className="service-list-div">
                        <img className="service-check-icon" src={nhTemplateGreenCheck} alt="" width={24} height={24} />
                        <div className="paragraph">{b}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="WhyUs" className="whyus" aria-labelledby="nh-why-heading">
        <div className="max-width-large align-center">
          <SectionHead headingId="nh-why-heading" title="Why us" />
        </div>
        <div className="containerwhyus" data-nh-reveal>
          <div className="card-item" style={{ gridColumn: '1', gridRow: '1 / span 2' }}>
            <div className="divwhyus" style={{ position: 'relative', width: '100%', minHeight: '200px' }}>
              <div className="divabsolutefirst">
                <img className="imagelogowebflow" src={nhTemplateWhyMark} alt="" width={90} height={30} />
                <p className="bold-text-2">{nh.whyUs.tagline}</p>
              </div>
            </div>
          </div>
          {nh.whyUs.stats.map((s, idx) => {
            const col = idx === 0 ? 2 : idx === 1 ? 3 : 2;
            const row = idx === 2 ? 2 : 1;
            return (
            <div
              key={s.label}
              className="card-item"
              style={{
                gridColumn: col,
                gridRow: row,
              }}
            >
              <div className="divwhyus" style={{ position: 'relative', width: '100%' }}>
                <div className="numberstatdiv">
                  <p className="number white numberanimation">{s.value}</p>
                  {s.suffix ? <div className="stat-2">{s.suffix}</div> : null}
                </div>
                <p className="paragraph bold-text-3">{s.label}</p>
              </div>
            </div>
            );
          })}
          <a
            href="#Contact"
            className="card-item"
            style={{ gridColumn: '3', gridRow: '2', textDecoration: 'none', color: 'inherit' }}
          >
            <div className="divwhyus" style={{ position: 'relative', width: '100%', minHeight: '200px' }}>
              <div className="divabsolutesecondary">
                <h4 className="heading4">{nh.whyUs.ctaTitle}</h4>
                <p className="paragraph bold-text-5">{nh.whyUs.ctaSub}</p>
                <p className="hovermessage">{nh.whyUs.ctaHover}</p>
              </div>
            </div>
          </a>
        </div>
      </section>

      <section id="Awards" className="awards" aria-labelledby="nh-awards-heading">
        <div className="max-width-large align-center">
          <SectionHead headingId="nh-awards-heading" title="Awards" />
        </div>
        <div className="awardscontainergeneral">
          <div className="detailsawards nh-awards-stack" data-nh-reveal>
            {nh.awards.map((row) => (
              <div key={`${row.org}-${row.award}`} className="awardindividual nh-award-row">
                <div className="containindividual">
                  <span className="bold-text-8">{row.org}</span>
                </div>
                <div className="containindividual">
                  <span className="bold-text-9">{row.award}</span>
                </div>
                <div className="containindividual">
                  <span className="bold-text-10">{row.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="Team" className="teamsection" aria-labelledby="nh-team-heading">
        <div className="max-width-large align-center">
          <SectionHead headingId="nh-team-heading" title="The team" />
        </div>
        <div className="three-column-grid nh-team-cols">
          {nh.team.map((m) => (
            <div key={m.name} className="nh-team-member" data-nh-reveal>
              <div className="teamimagewrap" tabIndex={0}>
                <img className="member-image" src={nhTemplateTeamPhotos[m.photoIndex]} alt="" width={480} height={600} loading="lazy" />
                <div className="member-image-cover" aria-hidden>
                  <p className="paragraph">{nh.teamBio}</p>
                </div>
              </div>
              <div className="titulartextteam">{m.name}</div>
              <div className="space-top-small">
                <span>{m.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="FAQ" className="faqsection" aria-labelledby="nh-faq-heading">
        <div className="max-width-large align-center">
          <SectionHead headingId="nh-faq-heading" title="FAQ" />
        </div>
        <div className="container-41">
          <div className="faq-grid" data-nh-reveal>
            <div className="accordion-wrapper">
              {nh.faq.map((item) => (
                <NhFaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
            <div className="calltoactionfaq">
              <a href="#Contact" className="card-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="divwhyus" style={{ position: 'relative', width: '100%', minHeight: '200px' }}>
                  <div className="divabsolutesecondary">
                    <h4 className="heading4">{nh.whyUs.ctaTitle}</h4>
                    <p className="paragraph bold-text-5">{nh.whyUs.ctaSub}</p>
                    <p className="hovermessage">{nh.whyUs.ctaHover}</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="Contact" className="contactsection" aria-labelledby="nh-contact-heading">
        <div className="container-main">
          <div className="max-width-large align-center">
            <SectionHead headingId="nh-contact-heading" title="Contact us" />
          </div>
          <div className="contactwrapper" data-nh-reveal>
            <div className="marketingcontactus">
              <div className="marketingdiv" aria-hidden />
            </div>
            <div className="contactform">
              <NhContactForm />
            </div>
          </div>
        </div>
      </section>

      <NhAwsaFooter />
    </div>
  );
}

export default function NewHomePageClient() {
  const reduceMotion = useReducedMotion();
  return <NewHomePageInner reduceMotion={reduceMotion} />;
}
