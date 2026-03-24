'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FALLBACK_HIGHLIGHTS = [
  { imgClass: 'highlight-img-public-sector', title: 'Public Sector Narrative Strategy', text: 'Developed an integrated communication framework for a Ministry of Trade to align investor attraction, policy messaging, and AfCFTA visibility.' },
  { imgClass: 'highlight-img-sportz', title: 'Creative Launch Campaign – Africa Sportz', text: 'Produced a youth-driven media activation to launch a new pan-African digital sports brand with over 1 million social media impressions in the first 60 days.' },
  { imgClass: 'highlight-img-summit', title: 'Summit Media Strategy – Africa Trade Summit', text: 'Delivered full press management, real-time coverage, and speaker coaching for a two-day high-level summit involving four heads of state and 500+ delegates.' },
  { imgClass: 'highlight-img-diaspora', title: 'Diaspora Engagement – Global Ghana Initiative', text: 'Created a cross-platform diaspora communications campaign blending video, testimonials, and cultural media across five countries.' },
  { imgClass: 'highlight-img-hospitality', title: 'Brand Repositioning – Africa Hospitality Magazine', text: 'Redesigned visual identity, digital rollout plan, and editorial voice to elevate the brand as the go-to regional publication for hospitality insight.' }
];

interface CaseStudy {
  id: number;
  title: string;
  description: string;
  image_url: string;
  client_name: string;
}

export default function CaseStudiesCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const res = await fetch('/api/case-studies');
        if (res.ok) {
          setCaseStudies(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch case studies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudies();
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current && trackRef.current) {
        // Calculate maximum drag constraint based on track width vs viewport width
        setWidth(trackRef.current.scrollWidth - carouselRef.current.offsetWidth + 32); 
      }
    };
    
    // Slight delay to ensure images/elements have loaded and rendered layout
    setTimeout(updateWidth, 100);
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [caseStudies, loading]);

  const displayItems = caseStudies.length > 0 ? caseStudies : FALLBACK_HIGHLIGHTS;

  return (
    <div className="carousel" ref={carouselRef} style={{ overflow: 'hidden', cursor: 'grab' }}>
      <motion.div 
        drag="x" 
        dragConstraints={{ right: 0, left: -width }} 
        whileTap={{ cursor: "grabbing" }}
        className="carousel-track" 
        ref={trackRef}
        style={{ display: 'flex', gap: '2rem', padding: '1rem 0' }}
      >
        {displayItems.map((item: any, index: number) => (
          <motion.article 
            key={item.id || index} 
            className="card card-case animate-on-scroll magnetic"
            style={{ minWidth: '320px', pointerEvents: 'auto' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
          >
            <div 
              className={`card-image-placeholder ${item.imgClass || ''}`} 
              style={{ 
                pointerEvents: 'none',
                backgroundImage: item.image_url ? `url(${item.image_url})` : undefined,
                backgroundColor: !item.image_url && !item.imgClass ? '#e5e7eb' : undefined
              }}
            ></div>
            <h3 style={{ pointerEvents: 'none' }}>{item.title}</h3>
            {item.client_name && <p style={{ pointerEvents: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Client: {item.client_name}</p>}
            <p style={{ pointerEvents: 'none' }}>{item.text || item.description}</p>
          </motion.article>
        ))}
      </motion.div>
      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6B7280', marginTop: '1rem', fontStyle: 'italic' }}>
        ← Drag to explore →
      </p>
    </div>
  );
}
