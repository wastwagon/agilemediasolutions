'use client';

import React, { useState, useEffect } from 'react';

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

  const activeSlides = slides.length > 0 ? slides : [
    { title: "Powering Narratives. Elevating Voices. Driving Impact.", subtitle: "Agile Media Solutions is an international media, PR, and communications firm helping governments, institutions, brands, and movements shape the messages that move nations, markets, and minds." }
  ];

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
      <div className="hero-slideshow">
        {[...Array(slidesCount)].map((_, i) => (
          <div 
            key={i} 
            className={`hero-slide ${currentSlide === i ? 'hero-slide-active' : ''}`} 
            data-slide={i}
          ></div>
        ))}
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-headline">
          {currentData.title.split('. ').map((line: string, idx: number, arr: string[]) => (
             <span key={idx} className="hero-line-mask">
               <span className={`hero-line hero-line-${idx + 1}`}>{line}{idx < arr.length - 1 ? '.' : ''}</span>
             </span>
          ))}
        </h1>
        <p className="hero-description">{currentData.subtitle}</p>
        <div className="hero-cta">
          <a href="/contact#contact" className="btn btn-hero-primary">Work With Us</a>
          <a href="/brands" className="btn btn-hero-secondary">Explore Our Brands</a>
        </div>
      </div>
    </section>
  );
}
