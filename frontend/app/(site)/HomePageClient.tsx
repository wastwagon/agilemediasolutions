'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Hero from '../components/Hero';
import CaseStudiesCarousel from '../components/CaseStudiesCarousel';
import SectionHeader from '../components/SectionHeader';
import HomeFeaturedWork, { type HomeFeaturedStudy } from '../components/HomeFeaturedWork';
import HomeInsightsPreview from '../components/HomeInsightsPreview';
import { parseSiteContentLines, useSiteSectionContent } from '@/lib/siteSectionCms';
import { withLocalePrefix, type AppLocale } from '@/lib/locale';
import { useLocale } from '@/components/LocaleProvider';
import { localizeHref, t } from '@/lib/i18n';
import {
  getHomePageDefaults,
  getFallbackHomeServices,
  getServiceHighlightDefaults,
} from '@/lib/i18n/pageDefaults';

interface Brand {
  id: number;
  name: string;
  description: string;
  image_url: string;
  website_url: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  highlights?: string | null;
  icon: string;
}

/** Safe `url("…")` for CSS background-image (handles quotes in query strings). */
function cssBackgroundImageUrl(raw: string | undefined): string | undefined {
  const u = (raw || '').trim();
  if (!u) return undefined;
  const safe = u.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `url("${safe}")`;
}

function parseServiceHighlights(value: string | null | undefined, locale: AppLocale): string[] {
  const fallback = getServiceHighlightDefaults(locale);
  if (!value) return fallback;
  const items = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return items.length > 0 ? items : fallback;
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

interface EventData {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
}

export default function HomePageClient() {
  const locale = useLocale();
  const hd = getHomePageDefaults(locale);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [caseStudiesHome, setCaseStudiesHome] = useState<HomeFeaturedStudy[]>([]);
  const [activeServiceIdx, setActiveServiceIdx] = useState<number | null>(0);

  const homeEventsCopy = useSiteSectionContent('home.events', hd.events);

  const homeMarquee = useSiteSectionContent('home.marquee', hd.marquee);

  const homeWhoWeAre = useSiteSectionContent('home.whoWeAre', hd.whoWeAre);

  const homeServicesBand = useSiteSectionContent('home.servicesBand', hd.servicesBand);

  const homeBrandsBand = useSiteSectionContent('home.brandsBand', hd.brandsBand);

  const homeCaseStudiesBand = useSiteSectionContent('home.caseStudiesBand', hd.caseStudiesBand);

  const homeCareersBand = useSiteSectionContent('home.careersBand', hd.careersBand);

  const homeInsightsCopy = useSiteSectionContent('home.insights', hd.insights);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, servicesRes, eventsRes, caseRes] = await Promise.all([
          fetch('/api/brands'),
          fetch('/api/services'),
          fetch('/api/events'),
          fetch('/api/case-studies'),
        ]);
        if (brandsRes.ok) setBrands(await brandsRes.json());
        if (servicesRes.ok) setServices(await servicesRes.json());
        if (eventsRes.ok) setEvents(await eventsRes.json());
        if (caseRes.ok) {
          const list = await caseRes.json();
          if (Array.isArray(list)) setCaseStudiesHome(list);
        }
      } catch (err) {
        console.error('Failed to fetch home page data:', err);
      }
    };
    fetchData();
  }, []);

  const fallbackHomeServices: Service[] = getFallbackHomeServices(locale);

  const homeServices = (() => {
    const primary = services.slice(0, 4);
    if (primary.length >= 4) return primary;

    const existingTitles = new Set(primary.map((s) => s.title.trim().toLowerCase()));
    const fill = fallbackHomeServices.filter((s) => !existingTitles.has(s.title.trim().toLowerCase())).slice(0, 4 - primary.length);
    return [...primary, ...fill];
  })();

  useEffect(() => {
    if (activeServiceIdx !== null && activeServiceIdx > homeServices.length - 1) {
      setActiveServiceIdx(0);
    }
  }, [activeServiceIdx, homeServices.length]);

  const marqueePrimaryItems = parseSiteContentLines(homeMarquee.primaryLines);
  const marqueeSecondaryItems = parseSiteContentLines(homeMarquee.secondaryLines);

  const renderMarqueeSpans = (lines: string[]) => {
    const out: React.ReactNode[] = [];
    lines.forEach((line, i) => {
      out.push(
        <span key={`t-${i}`}>{line}</span>,
        <span key={`b-${i}`}>•</span>
      );
    });
    return [...out, ...out];
  };

  const whoWeAreMediaBg = cssBackgroundImageUrl(homeWhoWeAre.imageUrl);

  return (
    <main className="home-page creative-home">
      <Hero />

      <section className="creative-marquee" aria-label={t(locale, 'ariaMarqueeBrand')}>
        <div className="creative-marquee-track">
          {marqueePrimaryItems.length > 0 ? renderMarqueeSpans(marqueePrimaryItems) : null}
        </div>
      </section>

      <section className="section section-who creative-section-band" id="who-we-are">
        <div className="section-inner section-split animate-on-scroll">
          <div className="section-content">
            <span className="section-label">{homeWhoWeAre.label}</span>
            <h2 className="section-title">{homeWhoWeAre.title}</h2>
            <p className="section-text">{homeWhoWeAre.body}</p>
            <div className="section-cta-inline">
              <Link href={localizeHref(homeWhoWeAre.ctaHref || '/about', locale)} className="btn btn-learn">
                {homeWhoWeAre.ctaLabel}
              </Link>
            </div>
          </div>
          <div className="section-media">
            <div
              className={`media-placeholder ${whoWeAreMediaBg ? 'has-image' : 'media-who'}`}
              style={
                whoWeAreMediaBg
                  ? {
                      backgroundImage: whoWeAreMediaBg,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }
                  : undefined
              }
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <section
        className="creative-marquee creative-marquee--reverse creative-marquee--quiet"
        aria-label={t(locale, 'ariaMarqueeInstitutional')}
      >
        <div className="creative-marquee-track creative-marquee-track--reverse">
          {marqueeSecondaryItems.length > 0 ? renderMarqueeSpans(marqueeSecondaryItems) : null}
        </div>
      </section>

      <section className="section section-cards creative-section-band-alt" id="services">
        <div className="section-inner animate-on-scroll">
          <SectionHeader
            variant="home"
            label={homeServicesBand.label}
            title={homeServicesBand.title}
            linkHref={localizeHref(homeServicesBand.linkHref || '/services', locale)}
            linkLabel={homeServicesBand.linkLabel}
          />
          <p className="section-subtitle">{homeServicesBand.subtitle}</p>
          <div className="services-template-panel">
            {homeServices.map((s, idx) => {
              const isActive = idx === activeServiceIdx;
              const image = resolveServiceImage(s.icon);
              const highlights = parseServiceHighlights(s.highlights, locale);
              return (
                <article key={`${s.id}-${s.title}`} className={`service-template-row ${isActive ? 'is-active' : ''}`}>
                  <button
                    type="button"
                    className="service-template-trigger"
                    onClick={() => setActiveServiceIdx((prev) => (prev === idx ? null : idx))}
                    aria-expanded={isActive}
                  >
                    <span className="service-template-index">{String(idx + 1).padStart(2, '0')}</span>
                    <h3 className="service-template-title">{s.title}</h3>
                    <span className="service-template-toggle" aria-hidden="true">{isActive ? '−' : '+'}</span>
                  </button>
                  <div className="service-template-content">
                    <div className="service-template-copy">
                      <p>{s.description}</p>
                      <ul>
                        {highlights.map((item) => (
                          <li key={`${s.id}-${item}`}>{item}</li>
                        ))}
                      </ul>
                      <Link href={withLocalePrefix('/services', locale)} className="link-arrow-text">{t(locale, 'learnMore')}</Link>
                    </div>
                    <div
                      className={`service-template-image card-image-placeholder ${image.imageUrl ? 'has-image' : image.imageClass}`}
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
                      aria-hidden="true"
                    ></div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="section-cta-center">
            <Link href={localizeHref(homeServicesBand.ctaPrimaryHref || '/services', locale)} className="btn btn-outline">
              {homeServicesBand.ctaPrimaryLabel}
            </Link>
            <Link href={localizeHref(homeServicesBand.ctaSecondaryHref || '/contact#contact', locale)} className="btn btn-outline">
              {homeServicesBand.ctaSecondaryLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-brands creative-section-band" id="our-brands">
        <div className="section-inner animate-on-scroll">
          <SectionHeader
            variant="home"
            label={homeBrandsBand.label}
            title={homeBrandsBand.title}
            linkHref={localizeHref(homeBrandsBand.linkHref || '/brands', locale)}
            linkLabel={homeBrandsBand.linkLabel}
          />
          <p className="section-subtitle">{homeBrandsBand.subtitle}</p>
          <div className="cards-grid cards-brands">
            {brands.length > 0 ? (
              brands.map((b: Brand) => (
                <article key={b.id} className="card card-brand animate-on-scroll">
                  <div
                    className={`card-image-placeholder ${b.image_url ? 'has-image brand-logo-image' : ''}`}
                    style={{
                      backgroundImage: b.image_url ? `url(${b.image_url})` : undefined,
                      backgroundColor: '#f9f9f9',
                    }}
                  ></div>
                  <h3>{b.name}</h3>
                  <p>{b.description}<br /><Link href={withLocalePrefix('/brands', locale)} className="link-arrow-text">{t(locale, 'learnMore')}</Link></p>
                </article>
              ))
            ) : (
              <>
                <article className="card card-brand animate-on-scroll">
                  <div className="card-image-placeholder brand-img-leaders"></div>
                  <h3>African Leaders Magazine</h3>
                  <p>A continental platform spotlighting leadership, policy, and governance across Africa.<br /><Link href={withLocalePrefix('/brands', locale)} className="link-arrow-text">{t(locale, 'learnMore')}</Link></p>
                </article>
                <article className="card card-brand animate-on-scroll">
                  <div className="card-image-placeholder brand-img-sports"></div>
                  <h3>Africa Sports Magazine</h3>
                  <p>Highlighting the athletes, leagues, and moments driving Africa&apos;s sporting evolution.<br /><Link href={withLocalePrefix('/brands', locale)} className="link-arrow-text">{t(locale, 'learnMore')}</Link></p>
                </article>
                <article className="card card-brand animate-on-scroll">
                  <div className="card-image-placeholder brand-img-news"></div>
                  <h3>Africa News Bulletin</h3>
                  <p>A daily newswire delivering curated updates on politics, economy, institutions, and regional affairs.<br /><Link href={withLocalePrefix('/brands', locale)} className="link-arrow-text">{t(locale, 'learnMore')}</Link></p>
                </article>
              </>
            )}
          </div>
          <div className="section-cta-center">
            <Link href={localizeHref(homeBrandsBand.ctaPrimaryHref || '/brands', locale)} className="btn btn-outline btn-view-all-brands">
              {homeBrandsBand.ctaPrimaryLabel}
            </Link>
            <Link href={localizeHref(homeBrandsBand.ctaSecondaryHref || '/contact#contact', locale)} className="btn btn-outline">
              {homeBrandsBand.ctaSecondaryLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-events creative-section-band-alt" id="events">
        <div className="section-inner animate-on-scroll">
          <SectionHeader
            variant="home"
            label={homeEventsCopy.label}
            title={homeEventsCopy.title}
            linkHref={withLocalePrefix('/signature-events', locale)}
            linkLabel={homeEventsCopy.linkLabel}
          />
          <p className="section-subtitle">{homeEventsCopy.subtitle}</p>
          <div className="cards-grid cards-events">
            {events.length > 0 ? (
              events.slice(0, 3).map((e) => (
                <article key={e.id} className="card card-event animate-on-scroll">
                  <div 
                    className={`card-image-placeholder ${e.image_url ? 'has-image' : ''}`}
                    style={{ 
                      backgroundImage: e.image_url ? `url(${e.image_url})` : undefined,
                      backgroundSize: e.image_url ? 'cover' : undefined,
                      backgroundPosition: e.image_url ? 'center' : undefined,
                      backgroundRepeat: e.image_url ? 'no-repeat' : undefined,
                      backgroundColor: !e.image_url ? '#e5e7eb' : undefined 
                    }}
                  ></div>
                  <h3>{e.title}</h3>
                  <p>{e.description}<br /><Link href={withLocalePrefix('/signature-events', locale)} className="link-arrow-text">{t(locale, 'learnMore')}</Link></p>
                </article>
              ))
            ) : (
              <>
                <article className="card card-event animate-on-scroll">
                  <div className="card-image-placeholder event-img-summit"></div>
                  <h3>Africa Trade Summit</h3>
                  <p>Accelerating Intra-African Trade, Investment, and Economic Transformation.<br /><Link href={withLocalePrefix('/signature-events', locale)} className="link-arrow-text">{t(locale, 'learnMore')}</Link></p>
                </article>
                <article className="card card-event animate-on-scroll">
                  <div className="card-image-placeholder event-img-trade-awards"></div>
                  <h3>Africa Trade Awards</h3>
                  <p>Celebrating Excellence Across the Continent&apos;s Trade Ecosystem.<br /><Link href={withLocalePrefix('/signature-events', locale)} className="link-arrow-text">{t(locale, 'learnMore')}</Link></p>
                </article>
                <article className="card card-event animate-on-scroll">
                  <div className="card-image-placeholder event-img-jazz"></div>
                  <h3>Afro Jazz Festival</h3>
                  <p>Celebrating the Soul of Africa Through Music, Art, and Culture.<br /><Link href={withLocalePrefix('/signature-events', locale)} className="link-arrow-text">{t(locale, 'learnMore')}</Link></p>
                </article>
              </>
            )}
          </div>
          <div className="section-cta-center">
            <Link href={withLocalePrefix('/signature-events', locale)} className="btn btn-outline">{homeEventsCopy.ctaPrimary}</Link>
            <Link href={withLocalePrefix('/partnerships', locale)} className="link-arrow">{homeEventsCopy.ctaSecondary} <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="section section-case-studies creative-section-band" id="case-studies">
        <div className="section-inner animate-on-scroll">
          <SectionHeader
            variant="home"
            label={homeCaseStudiesBand.label}
            title={homeCaseStudiesBand.title}
            linkHref={localizeHref(homeCaseStudiesBand.linkHref || '/case-studies', locale)}
            linkLabel={homeCaseStudiesBand.linkLabel}
          />
          <p className="section-subtitle">{homeCaseStudiesBand.subtitle}</p>
          <HomeFeaturedWork studies={caseStudiesHome} />
          <CaseStudiesCarousel />
          <div className="section-cta-center">
            <Link href={localizeHref(homeCaseStudiesBand.ctaPrimaryHref || '/case-studies', locale)} className="btn btn-outline">
              {homeCaseStudiesBand.ctaPrimaryLabel}
            </Link>
            <Link href={localizeHref(homeCaseStudiesBand.ctaSecondaryHref || '/contact#contact', locale)} className="btn btn-primary">
              {homeCaseStudiesBand.ctaSecondaryLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-insights-home creative-section-band-alt" id="insights-press">
        <div className="section-inner animate-on-scroll">
          <SectionHeader
            variant="home"
            label={homeInsightsCopy.label}
            title={<>{homeInsightsCopy.title}</>}
            linkHref={localizeHref(homeInsightsCopy.linkHref || '/insights', locale)}
            linkLabel={homeInsightsCopy.linkLabel}
          />
          <p className="section-subtitle">{homeInsightsCopy.subtitle}</p>
          <div className="section-cta-center">
            <Link href={localizeHref(homeInsightsCopy.ctaPrimaryHref || '/agile-press-group', locale)} className="btn btn-primary">
              {homeInsightsCopy.ctaPrimary}
            </Link>
            <Link href={localizeHref(homeInsightsCopy.ctaSecondaryHref || '/insights', locale)} className="btn btn-outline">
              {homeInsightsCopy.ctaSecondary}
            </Link>
          </div>
          <HomeInsightsPreview />
        </div>
      </section>

      <section className="section section-careers-home creative-section-band" id="join-team">
        <div className="section-inner animate-on-scroll" style={{ textAlign: 'center', maxWidth: '40rem', margin: '0 auto' }}>
          <SectionHeader
            variant="home"
            layout="stack"
            label={homeCareersBand.label}
            title={homeCareersBand.title}
            titleClassName="centered"
          />
          <p className="section-subtitle centered">{homeCareersBand.subtitle}</p>
          <div className="section-cta-center">
            <Link href={localizeHref(homeCareersBand.ctaPrimaryHref || '/careers', locale)} className="btn btn-primary">
              {homeCareersBand.ctaPrimaryLabel}
            </Link>
            <Link href={localizeHref(homeCareersBand.ctaSecondaryHref || '/contact#contact', locale)} className="btn btn-outline">
              {homeCareersBand.ctaSecondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
