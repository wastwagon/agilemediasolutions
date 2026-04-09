'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  DEFAULT_AGILE_INSTAGRAM_URL,
  DEFAULT_AGILE_LINKEDIN_URL,
  DEFAULT_AGILE_X_URL,
  DEFAULT_AGILE_YOUTUBE_URL,
  DEFAULT_FACEBOOK_URL,
} from '@/lib/defaultSocialUrls';
import { parseSiteContentPairs, useSiteSectionContent } from '@/lib/siteSectionCms';
import { useLocale } from '@/components/LocaleProvider';
import { localizeHref, t } from '@/lib/i18n';

const DEFAULT_SOCIAL = [
  { left: 'Facebook', right: DEFAULT_FACEBOOK_URL },
  { left: 'X', right: DEFAULT_AGILE_X_URL },
  { left: 'Instagram', right: DEFAULT_AGILE_INSTAGRAM_URL },
  { left: 'LinkedIn', right: DEFAULT_AGILE_LINKEDIN_URL },
  { left: 'YouTube', right: DEFAULT_AGILE_YOUTUBE_URL },
];

const DEFAULT_HERO_VIDEO = 'https://www.youtube.com/watch?v=avifcv-j3Ac&t=6s';
const DEFAULT_HERO_VIDEO_FALLBACK = '/videos/homepage-hero-video.mp4';
/** Preloader-only asset; using it as the video poster makes the hero look like a static image. */
const OPENING_PRELOAD_ART = '/images/opening-launch.webp';
/** Legacy CMS poster paths (removed files). */
const LEGACY_HERO_POSTER = /hero-politics|hero-sports|hero-studio/i;

function heroVideoPosterUrl(raw: string | undefined): string | undefined {
  const t = raw?.trim() || '';
  if (!t) return undefined;
  const pathOnly = t.split('?')[0].toLowerCase();
  const preloadPath = OPENING_PRELOAD_ART.toLowerCase();
  const isOpeningStill = pathOnly === preloadPath || pathOnly.endsWith(preloadPath);
  if (isOpeningStill || LEGACY_HERO_POSTER.test(t)) return undefined;
  return t;
}

function parseYoutubeId(raw: string): string | null {
  const input = raw.trim();
  if (!input) return null;
  try {
    const u = new URL(input);
    const host = u.hostname.toLowerCase();
    if (host.includes('youtu.be')) {
      return u.pathname.replace(/^\/+/, '').split('/')[0] || null;
    }
    if (host.includes('youtube.com')) {
      if (u.pathname.startsWith('/watch')) {
        return u.searchParams.get('v');
      }
      if (u.pathname.startsWith('/embed/')) {
        return u.pathname.split('/')[2] || null;
      }
      if (u.pathname.startsWith('/shorts/')) {
        return u.pathname.split('/')[2] || null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function parseYoutubeStartSeconds(raw: string): number | null {
  try {
    const u = new URL(raw.trim());
    const t = u.searchParams.get('t') || u.searchParams.get('start');
    if (!t) return null;
    if (/^\d+$/.test(t)) return Number(t);
    const m = /^((\d+)h)?((\d+)m)?((\d+)s)?$/.exec(t);
    if (!m) return null;
    const h = Number(m[2] || '0');
    const min = Number(m[4] || '0');
    const s = Number(m[6] || '0');
    return h * 3600 + min * 60 + s;
  } catch {
    return null;
  }
}

export default function Hero() {
  const locale = useLocale();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<{ title?: string; subtitle?: string }[]>([]);

  const fallbackSlides = useMemo(
    () => [
      {
        title: t(locale, 'heroFallbackTitle'),
        subtitle: t(locale, 'heroFallbackSubtitle'),
      },
    ],
    [locale]
  );

  const heroChrome = useSiteSectionContent('home.hero', {
    kicker: t(locale, 'heroKicker'),
    videoSrc: DEFAULT_HERO_VIDEO,
    videoPoster: '',
    primaryCtaLabel: t(locale, 'heroExploreBrands'),
    primaryCtaHref: '/brands',
    socialLinks: DEFAULT_SOCIAL.map((r) => `${r.left} :: ${r.right}`).join('\n'),
  });

  const socialRows = useMemo(() => {
    const parsed = parseSiteContentPairs(heroChrome.socialLinks || '');
    return parsed.length > 0 ? parsed : DEFAULT_SOCIAL;
  }, [heroChrome.socialLinks]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch('/api/pages/home');
        if (res.ok) {
          const data = await res.json();
          if (data.content_json?.hero_slides?.length > 0) {
            setSlides(data.content_json.hero_slides);
          }
        }
      } catch (err) {
        console.error('Failed to fetch home page dynamic content', err);
      }
    };
    fetchHomeData();
  }, []);

  const activeSlides = slides.length > 0 ? slides : fallbackSlides;
  const slidesCount = activeSlides.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [slidesCount]);

  const currentData = activeSlides[currentSlide] || activeSlides[0];
  const title = currentData?.title || fallbackSlides[0]?.title || '';
  const subtitle = currentData?.subtitle || fallbackSlides[0]?.subtitle || '';

  const cmsVideoSrc = heroChrome.videoSrc?.trim() || DEFAULT_HERO_VIDEO;
  /** If Site Content points at a missing file (404), fall back to the bundled default. */
  const [heroVideoFallback, setHeroVideoFallback] = useState(false);
  useEffect(() => {
    setHeroVideoFallback(false);
  }, [cmsVideoSrc]);

  const videoSrc =
    heroVideoFallback && cmsVideoSrc !== DEFAULT_HERO_VIDEO_FALLBACK
      ? DEFAULT_HERO_VIDEO_FALLBACK
      : cmsVideoSrc;
  const youtubeId = useMemo(() => parseYoutubeId(videoSrc), [videoSrc]);
  const youtubeStart = useMemo(() => parseYoutubeStartSeconds(videoSrc), [videoSrc]);
  const youtubeEmbedSrc = useMemo(() => {
    if (!youtubeId) return '';
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      controls: '0',
      loop: '1',
      playlist: youtubeId,
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      iv_load_policy: '3',
      fs: '0',
    });
    if (youtubeStart && youtubeStart > 0) params.set('start', String(youtubeStart));
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
  }, [youtubeId, youtubeStart]);
  const poster = heroVideoPosterUrl(heroChrome.videoPoster);
  const videoKey = `${videoSrc}\0${poster ?? ''}`;

  const onVideoError = useCallback(() => {
    setHeroVideoFallback((prev) => {
      if (prev) return prev;
      return cmsVideoSrc !== DEFAULT_HERO_VIDEO_FALLBACK;
    });
  }, [cmsVideoSrc]);

  const kickPlayback = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.defaultMuted = true;
    v.muted = true;
    v.setAttribute('muted', '');
    v.playsInline = true;
    // Safari (especially iOS) expects these attributes on the element, not only JSX props.
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    void v.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (youtubeId) return;
    kickPlayback();
  }, [videoSrc, poster, kickPlayback, youtubeId]);

  useEffect(() => {
    if (youtubeId) return;
    const v = videoRef.current;
    if (!v) return;
    const onLifecycle = () => kickPlayback();
    v.addEventListener('loadedmetadata', onLifecycle);
    v.addEventListener('loadeddata', onLifecycle);
    v.addEventListener('canplay', onLifecycle);
    v.addEventListener('canplaythrough', onLifecycle);
    v.addEventListener('stalled', onLifecycle);
    v.addEventListener('suspend', onLifecycle);
    return () => {
      v.removeEventListener('loadedmetadata', onLifecycle);
      v.removeEventListener('loadeddata', onLifecycle);
      v.removeEventListener('canplay', onLifecycle);
      v.removeEventListener('canplaythrough', onLifecycle);
      v.removeEventListener('stalled', onLifecycle);
      v.removeEventListener('suspend', onLifecycle);
    };
  }, [videoSrc, poster, kickPlayback, youtubeId]);

  useEffect(() => {
    if (youtubeId) return;
    const onVis = () => {
      if (document.visibilityState === 'visible') kickPlayback();
    };
    const onShow = () => kickPlayback();
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pageshow', onShow);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pageshow', onShow);
    };
  }, [kickPlayback, youtubeId]);

  return (
    <section className="hero" id="home">
      <div className="hero-video" aria-hidden="true">
        {youtubeEmbedSrc ? (
          <iframe
            className="hero-video-el hero-video-el--embed"
            src={youtubeEmbedSrc}
            title="Hero background video"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="eager"
          />
        ) : (
          <video
            ref={videoRef}
            className="hero-video-el"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            {...(poster ? { poster } : {})}
            key={videoKey}
            onError={onVideoError}
            disablePictureInPicture
            disableRemotePlayback
            controls={false}
          />
        )}
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-noise" aria-hidden="true"></div>
      <div className="hero-content">
        <span className="hero-kicker">{heroChrome.kicker}</span>
        <h1 className="hero-headline">
          {(title.includes('. ') ? title.split('. ') : [title]).map((line: string, idx: number, arr: string[]) => (
            <span key={idx} className="hero-line-mask">
              <span className={`hero-line hero-line-${idx + 1}`}>
                {line}
                {idx < arr.length - 1 ? '.' : ''}
              </span>
            </span>
          ))}
        </h1>
        <p className="hero-description">{subtitle}</p>
        <div className="hero-cta">
          <Link href={localizeHref(heroChrome.primaryCtaHref?.trim() || '/brands', locale)} className="btn btn-hero-secondary">
            {heroChrome.primaryCtaLabel}
          </Link>
        </div>
      </div>
      <div className="hero-social-rail" aria-label={t(locale, 'ariaSocialChannels')}>
        {socialRows.map((row, idx) => {
          const href = row.right?.trim();
          if (!href) return null;
          return (
            <a key={`${row.left}-${idx}`} href={href} target="_blank" rel="noopener noreferrer">
              {row.left?.trim() || 'Link'}
            </a>
          );
        })}
      </div>
    </section>
  );
}
