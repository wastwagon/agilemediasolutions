'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocale } from '@/components/LocaleProvider';
import { withLocalePrefix } from '@/lib/locale';
import { nh } from './content';
import { nhTemplateProjectCovers } from './nhTemplateUrls';

const ch = nh.campaignHighlights;

/** Pixels tolerance for subpixel / rounding when detecting overflow */
const OVERFLOW_SLOP = 2;

export default function NhCampaignHighlights() {
  const locale = useLocale();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  /** `null` = not measured yet (show chrome); `false` = all cards fit — hide helper / progress / arrows */
  const [needsScrollChrome, setNeedsScrollChrome] = useState<boolean | null>(null);

  const updateProgressOnly = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max <= 0 ? 1 : el.scrollLeft / max);
  }, []);

  const syncOverflowAndProgress = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + OVERFLOW_SLOP;
    setNeedsScrollChrome(overflow);
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max <= 0 ? 1 : el.scrollLeft / max);
  }, []);

  useLayoutEffect(() => {
    syncOverflowAndProgress();
  }, [syncOverflowAndProgress]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateProgressOnly();
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => syncOverflowAndProgress());
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [updateProgressOnly, syncOverflowAndProgress]);

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.max(280, el.clientWidth * 0.82) * dir;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const showDockTop = needsScrollChrome !== false;

  return (
    <div className="nh-highlights-chassis" role="region" aria-label={ch.kicker}>
      <div className="nh-campaign-scroller-shell">
        <div ref={scrollerRef} className="nh-campaign-scroller" tabIndex={0}>
          {ch.items.map((item) => (
            <article key={item.title} className="nh-campaign-card">
              <div className="nh-campaign-card-image-wrap">
                <img
                  src={nhTemplateProjectCovers[item.coverIndex]}
                  alt=""
                  width={640}
                  height={400}
                  loading="lazy"
                  className="nh-campaign-card-image"
                  onLoad={syncOverflowAndProgress}
                />
              </div>
              <p className="nh-campaign-client">Client: {item.client}</p>
              <h3 className="nh-campaign-title">{item.title}</h3>
              <p className="nh-campaign-body">{item.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className={`nh-campaign-dock${!showDockTop ? ' nh-campaign-dock--no-scroll-ui' : ''}`}>
        {showDockTop ? (
          <div className="nh-campaign-dock-top">
            <p className="nh-campaign-helper">{ch.helper}</p>
            <div className="nh-campaign-dock-controls">
              <div className="nh-campaign-progress-track" aria-hidden>
                <div className="nh-campaign-progress-fill" style={{ width: `${Math.min(100, Math.max(10, 8 + progress * 92))}%` }} />
              </div>
              <div className="nh-campaign-nav">
                <button type="button" className="nh-campaign-nav-btn" aria-label="Previous campaigns" onClick={() => scrollByDir(-1)}>
                  <span aria-hidden>←</span>
                </button>
                <button type="button" className="nh-campaign-nav-btn" aria-label="Next campaigns" onClick={() => scrollByDir(1)}>
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="nh-campaign-dock-ctas">
          <Link href={withLocalePrefix(ch.ctaCase.href, locale)} className="nh-dock-cta nh-dock-cta--ghost">
            <span className="nh-dock-cta-triangle" aria-hidden />
            <span className="nh-dock-cta-label">{ch.squareCaseLabel}</span>
          </Link>
          <a href={ch.ctaStart.href} className="nh-dock-cta nh-dock-cta--solid">
            <span className="nh-dock-cta-triangle" aria-hidden />
            <span className="nh-dock-cta-label">{ch.squareStartLabel}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
