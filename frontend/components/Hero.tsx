'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const FALLBACK_SLIDES = [
  {
    title: 'Powering Narratives. Elevating Voices. Driving Impact.',
    subtitle:
      'Agile Media Solutions is an international media, PR, and communications firm helping governments, institutions, brands, and movements shape the messages that move nations, markets, and minds.',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);

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

  const activeSlides = slides.length > 0 ? slides : FALLBACK_SLIDES;

  const slidesCount = activeSlides.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [slidesCount]);

  const currentData = activeSlides[currentSlide] || activeSlides[0];

  return (
    <section className="hero" id="home">
      <div className="hero-video" aria-hidden="true">
        <video
          className="hero-video-el"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero-politics.jpg"
        >
          <source src="/videos/herobannervideo.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-noise" aria-hidden="true"></div>
      <div className="hero-content">
        <span className="hero-kicker">Creative Communications Studio</span>
        <h1 className="hero-headline">
          {currentData.title.split('. ').map((line: string, idx: number, arr: string[]) => (
             <span key={idx} className="hero-line-mask">
               <span className={`hero-line hero-line-${idx + 1}`}>{line}{idx < arr.length - 1 ? '.' : ''}</span>
             </span>
          ))}
        </h1>
        <p className="hero-description">{currentData.subtitle}</p>
        <div className="hero-cta" style={{ flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          <Link href="/brands" className="btn btn-hero-secondary">Explore Our Brands</Link>
        </div>
      </div>
      <div className="hero-social-rail" aria-label="Social channels">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer">X</a>
      </div>
    </section>
  );
}
