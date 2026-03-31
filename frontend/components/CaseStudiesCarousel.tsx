'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const FALLBACK_HIGHLIGHTS = [
  { imgClass: 'highlight-img-public-sector', title: 'Public Sector Narrative Strategy', text: 'Developed an integrated communication framework for a Ministry of Trade to align investor attraction, policy messaging, and AfCFTA visibility.' },
  { imgClass: 'highlight-img-sportz', title: 'Creative Launch Campaign - Africa Sportz', text: 'Produced a youth-driven media activation to launch a new pan-African digital sports brand with over 1 million social media impressions in the first 60 days.' },
  { imgClass: 'highlight-img-summit', title: 'Summit Media Strategy - Africa Trade Summit', text: 'Delivered full press management, real-time coverage, and speaker coaching for a two-day high-level summit involving four heads of state and 500+ delegates.' },
  { imgClass: 'highlight-img-diaspora', title: 'Diaspora Engagement - Global Ghana Initiative', text: 'Created a cross-platform diaspora communications campaign blending video, testimonials, and cultural media across five countries.' },
  { imgClass: 'highlight-img-hospitality', title: 'Brand Repositioning - Africa Hospitality Magazine', text: 'Redesigned visual identity, digital rollout plan, and editorial voice to elevate the brand as the go-to regional publication for hospitality insight.' },
];

interface CaseStudy {
  id: number;
  title: string;
  description: string;
  image_url: string;
  client_name: string;
}

type DisplayItem = {
  id: string;
  title: string;
  text: string;
  imageUrl?: string;
  imgClass?: string;
  clientName?: string;
};

export default function CaseStudiesCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const res = await fetch('/api/case-studies');
        if (res.ok) setCaseStudies(await res.json());
      } catch (err) {
        console.error('Failed to fetch case studies:', err);
      }
    };
    fetchCaseStudies();
  }, []);

  const items: DisplayItem[] = useMemo(() => {
    if (caseStudies.length > 0) {
      return caseStudies.map((item) => ({
        id: `case-${item.id}`,
        title: item.title,
        text: item.description,
        imageUrl: item.image_url || undefined,
        clientName: item.client_name || undefined,
      }));
    }

    return FALLBACK_HIGHLIGHTS.map((item, index) => ({
      id: `fallback-${index}`,
      title: item.title,
      text: item.text,
      imgClass: item.imgClass,
    }));
  }, [caseStudies]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateState = () => {
      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const left = Math.max(0, viewport.scrollLeft);
      setCanPrev(left > 4);
      setCanNext(left < maxScroll - 4);
      setProgress(maxScroll > 0 ? Math.min(1, left / maxScroll) : 0);
    };

    updateState();
    viewport.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);
    return () => {
      viewport.removeEventListener('scroll', updateState);
      window.removeEventListener('resize', updateState);
    };
  }, [items.length]);

  const slide = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const step = Math.max(320, Math.round(viewport.clientWidth * 0.84));
    viewport.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  return (
    <div className="case-carousel">
      <div className="case-carousel-head">
        <p className="case-carousel-eyebrow">Live Campaign Highlights</p>
        <div className="case-carousel-controls">
          <button
            type="button"
            aria-label="Show previous case studies"
            className="case-carousel-btn"
            onClick={() => slide(-1)}
            disabled={!canPrev}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Show next case studies"
            className="case-carousel-btn"
            onClick={() => slide(1)}
            disabled={!canNext}
          >
            →
          </button>
        </div>
      </div>

      <div className="case-carousel-viewport" ref={viewportRef}>
        <div className="case-carousel-track">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              className="case-carousel-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: 'easeOut' }}
            >
              <div
                className={`case-carousel-media card-image-placeholder ${item.imageUrl ? 'has-image' : item.imgClass || ''}`}
                style={{
                  backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined,
                  backgroundColor: !item.imageUrl && !item.imgClass ? '#1f2937' : undefined,
                  backgroundSize: item.imageUrl ? 'cover' : undefined,
                  backgroundPosition: item.imageUrl ? 'top center' : undefined,
                  backgroundRepeat: item.imageUrl ? 'no-repeat' : undefined,
                }}
                aria-hidden="true"
              />
              <div className="case-carousel-body">
                <div className="case-carousel-meta">
                  <span className="case-carousel-client">{item.clientName ? `Client: ${item.clientName}` : 'Featured project'}</span>
                </div>
                <h3 className="case-carousel-title">{item.title}</h3>
                <p className="case-carousel-text">{item.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="case-carousel-foot">
        <div className="case-carousel-progress" aria-hidden="true">
          <span style={{ width: `${Math.max(12, progress * 100)}%` }} />
        </div>
        <p className="case-carousel-hint">Swipe, drag, or use arrows to explore</p>
      </div>
    </div>
  );
}
