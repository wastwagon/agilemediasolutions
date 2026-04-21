'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { useLocale } from '@/components/LocaleProvider';
import { t } from '@/lib/i18n';
import {
  getContactPageDefaults,
  getHomePageDefaults,
  getNewHomepageFaqDefaults,
  getNewHomepageWhyUsBentoDefaults,
} from '@/lib/i18n/pageDefaults';
import { parseSiteContentPairs, useSiteSectionContent } from '@/lib/siteSectionCms';
// import { selectBrandsForHomepage, type HomeApiBrand } from '@/lib/homePageBrandsDisplay';
// import { selectEventsForHomepage, type HomeApiEvent } from '@/lib/homePageEventsDisplay';
// import { cssBackgroundImageUrl } from '@/lib/homePageServicesDisplay';
import type { HomeApiBrand } from '@/lib/homePageBrandsDisplay';
import { withLocalePrefix, type AppLocale } from '@/lib/locale';
import { nh, nhMarqueeLogos } from './content';
import NhContactForm from './NhContactForm';
import { nhTemplateProjectCovers, nhTemplateWhyMark } from './nhTemplateUrls';
import { useNhScrollReveals } from './useNhScrollReveals';
import { useNhSplitHeadlines } from './useNhSplitHeadlines';
import { NhAwsaFooter, NhAwsaNavbar } from './NhAwsaBars';
import NhFaqItem from './NhFaqItem';
type NhAwardRow = { org: string; award: string; year: string; key: string };

function brandWebsiteLabel(websiteUrl: string | undefined): string {
  const w = (websiteUrl || '').trim();
  if (!w) return '—';
  try {
    if (/^https?:\/\//i.test(w)) {
      const host = new URL(w).hostname.replace(/^www\./i, '');
      return host || '—';
    }
  } catch {
    /* invalid URL */
  }
  return '—';
}

const NH_BRANDS_TABLE_FALLBACK: NhAwardRow[] = [
  {
    key: 'fb-al',
    org: 'African Leaders Magazine',
    award: 'Continental platform spotlighting leadership, policy, and governance across Africa.',
    year: 'Print + digital',
  },
  {
    key: 'fb-as',
    org: 'Africa Sports Magazine',
    award: "Athletes, leagues, and moments driving Africa's sporting evolution.",
    year: 'Digital',
  },
  {
    key: 'fb-anb',
    org: 'Africa News Bulletin',
    award: 'Curated updates on politics, economy, institutions, and regional affairs.',
    year: 'Daily wire',
  },
  {
    key: 'fb-ah',
    org: 'Africa Hospitality Magazine',
    award: 'Hotels, destinations, and travel brands reaching regional and global audiences.',
    year: 'Print + digital',
  },
  {
    key: 'fb-ap',
    org: 'Agile Press Group',
    award: 'Bulletins, syndication, and editorial desks amplifying institutional and civic narratives.',
    year: 'Syndication',
  },
];

type NhProjectGridCard = {
  key: string;
  title: string;
  tag: string;
  imageSrc: string;
  href: string;
  external: boolean;
};

function SectionHead({
  headingId,
  title,
  kicker,
  blurb,
  blurbAlign = 'center',
}: {
  headingId: string;
  title: string;
  /** Small uppercase line above the main title (e.g. section group label). */
  kicker?: string;
  /** Overrides `nh.sectionBlurb` when set. Pass `""` to omit the blurb paragraph. */
  blurb?: string;
  blurbAlign?: 'left' | 'center';
}) {
  const blurbText = blurb !== undefined ? blurb : nh.sectionBlurb;
  const showBlurb = blurbText.trim().length > 0;
  return (
    <div className="header-section">
      <h2 id={headingId} className={`heading2 slide-left-2${kicker ? ' nh-heading-with-kicker' : ''}`}>
        {kicker ? <span className="nh-section-kicker">{kicker}</span> : null}
        <span className="bold-text">{title}</span>
      </h2>
      {showBlurb ? (
        <p
          className={`text-color-secondary slide-right max-description is-40 nh-section-blurb${
            blurbAlign === 'left' ? ' nh-section-blurb--align-left' : ''
          }`}
          data-nh-reveal
        >
          {blurbText}
        </p>
      ) : null}
    </div>
  );
}

function NewHomePageInner({ reduceMotion }: { reduceMotion: boolean | null }) {
  const locale = useLocale();
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
    void import('gsap/ScrollTrigger').then((mod) => {
      mod.ScrollTrigger.refresh();
    });
  }, []);

  // const servicesBand = useMemo(() => getHomePageDefaults(locale).servicesBand, [locale]);
  // const brandsBand = useMemo(() => getHomePageDefaults(locale).brandsBand, [locale]);
  // const eventsCopy = useMemo(() => getHomePageDefaults(locale).events, [locale]);
  const contactCopy = useMemo(() => getContactPageDefaults(locale), [locale]);

  // const [apiBrands, setApiBrands] = useState<HomeApiBrand[]>([]);
  // const [apiEvents, setApiEvents] = useState<HomeApiEvent[]>([]);

  // useEffect(() => {
  //   let cancelled = false;
  //   void fetch('/api/brands')
  //     .then((r) => (r.ok ? r.json() : []))
  //     .then((list) => {
  //       if (!cancelled && Array.isArray(list)) setApiBrands(list);
  //     })
  //     .catch(() => {});
  //   return () => {
  //     cancelled = true;
  //   };
  // }, []);

  // useEffect(() => {
  //   let cancelled = false;
  //   void fetch('/api/events')
  //     .then((r) => (r.ok ? r.json() : []))
  //     .then((list) => {
  //       if (!cancelled && Array.isArray(list)) setApiEvents(list);
  //     })
  //     .catch(() => {});
  //   return () => {
  //     cancelled = true;
  //   };
  // }, []);

  // const nhBrandCards = useMemo(() => selectBrandsForHomepage(apiBrands), [apiBrands]);
  // const nhEventCards = useMemo(() => selectEventsForHomepage(apiEvents), [apiEvents]);

  const whyUsBentoDefaults = useMemo(() => getNewHomepageWhyUsBentoDefaults(), []);
  const whyUsBento = useSiteSectionContent('newhomepage.whyUsBento', whyUsBentoDefaults);
  const nhWhyUsStatRows = useMemo(
    () => [
      { value: whyUsBento.stat1Value, suffix: whyUsBento.stat1Suffix, label: whyUsBento.stat1Label },
      { value: whyUsBento.stat2Value, suffix: whyUsBento.stat2Suffix, label: whyUsBento.stat2Label },
      { value: whyUsBento.stat3Value, suffix: whyUsBento.stat3Suffix, label: whyUsBento.stat3Label },
    ],
    [
      whyUsBento.stat1Label,
      whyUsBento.stat1Suffix,
      whyUsBento.stat1Value,
      whyUsBento.stat2Label,
      whyUsBento.stat2Suffix,
      whyUsBento.stat2Value,
      whyUsBento.stat3Label,
      whyUsBento.stat3Suffix,
      whyUsBento.stat3Value,
    ],
  );
  const whyUsSpecialtyMarkSrc =
    typeof whyUsBento.specialtyMarkUrl === 'string' && whyUsBento.specialtyMarkUrl.trim().length > 0
      ? whyUsBento.specialtyMarkUrl.trim()
      : nhTemplateWhyMark;

  const homeDefaults = useMemo(() => getHomePageDefaults(locale), [locale]);
  const homeWhoWeAre = useSiteSectionContent('home.whoWeAre', homeDefaults.whoWeAre);
  const homeBrandsBand = useSiteSectionContent('home.brandsBand', homeDefaults.brandsBand);
  const homeServicesBand = useSiteSectionContent('home.servicesBand', homeDefaults.servicesBand);

  const [projectsBrands, setProjectsBrands] = useState<HomeApiBrand[]>([]);

  useEffect(() => {
    let cancelled = false;
    void fetch('/api/brands')
      .then((r) => (r.ok ? r.json() : []))
      .then((brands) => {
        if (cancelled) return;
        if (Array.isArray(brands)) setProjectsBrands(brands);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const brandsTableRows: NhAwardRow[] = useMemo(() => {
    if (projectsBrands.length > 0) {
      return projectsBrands.slice(0, 12).map((b) => ({
        org: (b.name || '').trim() || 'Brand',
        award: (b.description || '').trim() || '—',
        year: brandWebsiteLabel(b.website_url),
        key: `brand-${b.id}`,
      }));
    }
    return NH_BRANDS_TABLE_FALLBACK;
  }, [projectsBrands]);

  const brandsTableIntro =
    (homeBrandsBand.subtitle || '').trim() ||
    'Media properties that inform, inspire, and influence—owned and operated by Agile Media Solutions.';

  const newhomepageFaqDefaults = useMemo(() => getNewHomepageFaqDefaults(), []);
  const newhomepageFaq = useSiteSectionContent('newhomepage.faq', newhomepageFaqDefaults);
  const faqAccordionItems = useMemo(() => {
    const rows = parseSiteContentPairs(newhomepageFaq.qaPairs);
    const mapped = rows
      .filter((r) => r.left.trim())
      .map((r) => ({ q: r.left.trim(), a: r.right.trim() || '—' }));
    if (mapped.length > 0) return mapped;
    return nh.faq.map((item) => ({ q: item.q, a: item.a }));
  }, [newhomepageFaq.qaPairs]);

  const projectGridCards: NhProjectGridCard[] = useMemo(() => {
    const tag = (homeServicesBand.label || '').trim() || 'Service';
    return nh.services.map((s, i) => ({
      key: `nh-service-${i}`,
      title: s.title,
      tag,
      imageSrc: nhTemplateProjectCovers[s.iconIndex % nhTemplateProjectCovers.length],
      href: withLocalePrefix('/services', locale),
      external: false,
    }));
  }, [homeServicesBand.label, locale]);

  const aboutMarqueeItems = useMemo(() => {
    const withImages = projectsBrands.filter((b) => (b.image_url || '').trim().length > 0);
    if (withImages.length > 0) {
      return withImages.map((b) => ({
        key: `brand-${b.id}`,
        src: (b.image_url || '').trim(),
        alt: (b.name || '').trim(),
      }));
    }
    return nhMarqueeLogos.map((src, i) => ({ key: `tpl-${i}`, src, alt: '' }));
  }, [projectsBrands]);

  return (
    <div className="nh-root">
      <NhAwsaNavbar />
      <div
        ref={rootRef}
        className="nh-page awsa-exact page-wrap"
        onClickCapture={onHashNavCapture}
      >
      <section className="hero-section-2 nh-hero-visual-only" aria-label="Introduction">
        <div className="hero-wrapper-2" aria-hidden />
      </section>

      <section id="About" className="about" aria-labelledby="nh-about-heading">
        <div className="nh-about-stack" data-nh-reveal>
          {(homeBrandsBand.label || '').trim() ? (
            <p className="nh-about-kicker">{homeBrandsBand.label.trim()}</p>
          ) : null}
          <h2 id="nh-about-heading" className="subhead-main _80 nh-about-title">
            {(homeBrandsBand.title || '').trim() || 'Our brands'}
          </h2>
        </div>
        <div className="marquee nh-about-marquee" aria-label={(homeBrandsBand.title || '').trim() || 'Brands'}>
          <div className="marqueelogos">
            <div className="nh-marquee-track">
              {[...aboutMarqueeItems, ...aboutMarqueeItems].map((item, i) => (
                <img
                  key={`${item.key}-${i}`}
                  src={item.src}
                  alt={item.alt}
                  width={140}
                  height={48}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
          <div className="fade-gradient nh-marquee-fade nh-about-marquee-fade" aria-hidden />
        </div>
      </section>

      <section id="Projects" className="paddingtop paddingworkssection" aria-labelledby="nh-projects-heading">
        <div className="max-width-large align-center">
          <SectionHead
            headingId="nh-projects-heading"
            kicker={(homeServicesBand.label || '').trim() || 'CAPABILITIES'}
            title={(homeServicesBand.title || '').trim() || 'OUR SERVICES'}
            blurb={(homeServicesBand.subtitle || '').trim() || nh.servicesBlurb}
            blurbAlign="center"
          />
        </div>
        <div className="containerworks">
          <div className="worksgrid">
            {projectGridCards.map((p) => {
              const inner = (
                <>
                  <img className="project-thumbnail-2" src={p.imageSrc} alt="" width={800} height={600} loading="lazy" />
                  <div className="divmid" aria-hidden>
                    <h3 className="heading-2">{p.title}</h3>
                  </div>
                  <div className="project-content">
                    <div className="project-content-footer">
                      <div className="workstitle textsmall">{p.tag}</div>
                      <div className="workstitle textsmall">{p.title}</div>
                    </div>
                  </div>
                </>
              );
              return (
                <div key={p.key} className="collection-item workscontainer" data-nh-reveal>
                  {p.external ? (
                    <a
                      href={p.href}
                      className="project-link w-inline-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {inner}
                    </a>
                  ) : p.href.startsWith('#') ? (
                    <a href={p.href} className="project-link w-inline-block">
                      {inner}
                    </a>
                  ) : (
                    <Link href={p.href} className="project-link w-inline-block">
                      {inner}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/*
      <section id="Brands" className="nh-brands-section" aria-labelledby="nh-brands-heading">
        <div className="max-width-large nh-brands-header">
          <div className="nh-brands-title-row" data-nh-reveal>
            <div className="nh-brands-titles">
              <p className="nh-section-kicker nh-brands-kicker">{brandsBand.label}</p>
              <h2 id="nh-brands-heading" className="heading2 nh-brands-heading-title">
                <span className="bold-text">{brandsBand.title}</span>
              </h2>
            </div>
            <Link
              href={withLocalePrefix(brandsBand.linkHref || '/brands', locale)}
              className="nh-brands-portfolio-link w-inline-block"
            >
              {brandsBand.linkLabel}
            </Link>
          </div>
          <p
            className="text-color-secondary max-description is-40 nh-section-blurb nh-section-blurb--align-left nh-brands-subtitle"
            data-nh-reveal
          >
            {brandsBand.subtitle}
          </p>
        </div>

        <div className="container-41 nh-brands-strips-outer">
          <div className="nh-brands-strips">
            {nhBrandCards.map((b, i) => (
              <article
                key={b.id}
                className={`nh-brand-strip${i % 2 === 1 ? ' nh-brand-strip--reverse' : ''}`}
                data-nh-reveal
              >
                <div
                  className={[
                    'nh-brand-strip-media',
                    'card-image-placeholder',
                    b.imageUrl ? 'has-image' : '',
                    b.imageUrl ? '' : b.imageClass || '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={
                    b.imageUrl
                      ? {
                          backgroundImage: cssBackgroundImageUrl(b.imageUrl),
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }
                      : undefined
                  }
                  aria-hidden
                />
                <div className="nh-brand-strip-copy">
                  <p className="nh-brand-strip-index" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="nh-brand-strip-title">{b.name}</h3>
                  <p className="paragraph nh-brand-strip-desc">{b.description}</p>
                  <Link href={withLocalePrefix('/brands', locale)} className="nh-brand-strip-cta w-inline-block">
                    {t(locale, 'learnMore')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="nh-services-cta-row nh-brands-cta-row" data-nh-reveal>
          <Link
            href={withLocalePrefix(brandsBand.ctaPrimaryHref || '/brands', locale)}
            className="nh-services-cta-btn w-inline-block"
          >
            {brandsBand.ctaPrimaryLabel}
          </Link>
          <Link
            href={withLocalePrefix(brandsBand.ctaSecondaryHref || '/contact#contact', locale)}
            className="nh-services-cta-btn w-inline-block"
          >
            {brandsBand.ctaSecondaryLabel}
          </Link>
        </div>
      </section>
      */}

      <section id="WhyUs" className="whyus" aria-labelledby="nh-why-heading" aria-label="About Agile, who we are">
        <div className="max-width-large align-center">
          <SectionHead
            headingId="nh-why-heading"
            kicker="ABOUT AGILE"
            title="WHO WE ARE"
            blurb={homeWhoWeAre.body}
            blurbAlign="left"
          />
        </div>

        <div className="containerwhyus nh-whyus-bento" data-nh-reveal>
          <div className="card-item" style={{ gridColumn: '1', gridRow: '1 / span 2' }}>
            <div className="divwhyus" style={{ position: 'relative', width: '100%', minHeight: '200px' }}>
              <div className="divabsolutefirst">
                <img className="imagelogowebflow" src={whyUsSpecialtyMarkSrc} alt="" width={90} height={30} />
                <p className="bold-text-2">{whyUsBento.specialtyTagline}</p>
              </div>
            </div>
          </div>
          {nhWhyUsStatRows.map((s, idx) => {
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
                <h4 className="heading4">{whyUsBento.ctaTitle}</h4>
                {whyUsBento.ctaSub.trim() ? (
                  <p className="paragraph bold-text-5">{whyUsBento.ctaSub}</p>
                ) : null}
                <p className="hovermessage">{whyUsBento.ctaHover}</p>
              </div>
            </div>
          </a>
        </div>
      </section>

      <section
        id="Brands"
        className="awards nh-awards-section nh-brands-table-section"
        aria-labelledby="nh-brands-table-heading"
      >
        <div className="nh-awards-header-row" data-nh-reveal>
          <h2 id="nh-brands-table-heading" className="heading2 nh-awards-page-title">
            <span className="bold-text">{(homeBrandsBand.title || '').trim() || 'Our brands'}</span>
          </h2>
          <p className="text-color-secondary nh-awards-intro">{brandsTableIntro}</p>
        </div>
        <div className="awardscontainergeneral nh-awards-table-outer">
          <div className="detailsawards nh-awards-stack" data-nh-reveal>
            <div className="awardindividual nh-award-row nh-awards-colhead" role="row">
              <div className="containindividual" role="columnheader">
                <span className="nh-awards-th">Brand</span>
              </div>
              <div className="containindividual" role="columnheader">
                <span className="nh-awards-th">Description</span>
              </div>
              <div className="containindividual" role="columnheader">
                <span className="nh-awards-th">Website</span>
              </div>
            </div>
            {brandsTableRows.map((row) => (
              <div key={row.key} className="awardindividual nh-award-row" role="row">
                <div className="containindividual">
                  <span className="bold-text-8">{row.org}</span>
                </div>
                <div className="containindividual">
                  <span className="bold-text-9">{row.award}</span>
                </div>
                <div className="containindividual nh-awards-year-cell">
                  <span className="bold-text-10">{row.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="FAQ" className="faqsection nh-faq-qa-section" aria-labelledby="nh-faq-heading">
        <div className="container-41 nh-faq-qa-container" data-nh-reveal>
          <div className="faq-grid nh-faq-qa-grid">
            <div className="nh-faq-qa-col nh-faq-qa-col--left">
              <h2 id="nh-faq-heading" className="heading2 nh-faq-qa-title">
                <span className="bold-text">FAQ</span>
              </h2>
              <div className="accordion-wrapper nh-faq-accordion-list">
                {faqAccordionItems.map((item) => (
                  <NhFaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
            <div className="nh-faq-qa-col nh-faq-qa-col--right">
              <p className="text-color-secondary nh-faq-qa-blurb">{homeWhoWeAre.body}</p>
              <div className="calltoactionfaq nh-faq-qa-cta">
                <a href="#Contact" className="nh-faq-qa-cta-link w-inline-block">
                  <div className="divwhyus nh-faq-qa-cta-inner">
                    <div className="divabsolutesecondary">
                      <h4 className="heading4">{whyUsBento.ctaTitle}</h4>
                      {whyUsBento.ctaSub.trim() ? (
                        <p className="paragraph bold-text-5">{whyUsBento.ctaSub}</p>
                      ) : null}
                      <p className="hovermessage">{whyUsBento.ctaHover}</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="Contact" className="contactsection nh-contact-section" aria-labelledby="nh-contact-heading">
        <div className="container-main">
          <div className="nh-contact-header-row" data-nh-reveal>
            <h2 id="nh-contact-heading" className="heading2 nh-contact-page-title">
              <span className="bold-text">{t(locale, 'legalContactUsLink')}</span>
            </h2>
            <p className="text-color-secondary nh-contact-page-intro">{contactCopy.heroIntro}</p>
          </div>
          <div className="contactwrapper nh-contact-split" data-nh-reveal>
            <div className="marketingcontactus nh-contact-visual-column">
              <div className="marketingdiv" aria-hidden />
            </div>
            <div className="contactform nh-contact-form-column">
              <p className="paragraph nh-contact-form-eyebrow">{contactCopy.quickBriefLabel}</p>
              <h3 className="nh-contact-form-title">{contactCopy.quickBriefTitle}</h3>
              <p className="text-color-secondary nh-contact-form-subtitle">{contactCopy.quickBriefSubtitle}</p>
              <NhContactForm />
            </div>
          </div>
        </div>
      </section>

      <NhAwsaFooter />
      </div>
    </div>
  );
}

export default function NewHomePageClient() {
  const reduceMotion = useReducedMotion();
  return <NewHomePageInner reduceMotion={reduceMotion} />;
}
