'use client';

import React, { useEffect, useState } from 'react';

interface CaseStudy {
  id: number;
  title: string;
  description: string;
  image_url: string;
  client: string;
}

export default function Page() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await fetch('/api/case-studies');
        if (res.ok) {
          setStudies(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch case studies:', err);
      }
    };
    fetchStudies();
  }, []);

  return (
    <main className="services-page-main">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Case Studies & Portfolio</span>
          <h1 className="page-hero-title">Strategic Impact. Creative Execution. Measurable Results.</h1>
          <p className="page-hero-tagline">High-level communications for clients across sectors, regions, and mandates.</p>
        </div>
      </div>
      <section className="section section-case-studies" id="case-studies">
        <div className="section-inner">
          <h2 className="section-title centered">Case Studies & Portfolio</h2>
          <p className="section-subtitle centered">Strategic Impact. Creative Execution. Measurable Results.</p>
          <p className="section-subtitle centered">Agile Media Solutions has delivered high-level communications for clients across sectors, regions, and mandates—from institutional reform campaigns to global investor engagements, from cultural showcases to public trust-building initiatives.</p>
          
          <div className="services-grid">
            {studies.length > 0 ? (
              studies.map((s) => (
                <article key={s.id} className="service-card">
                  <div 
                    className="service-card-image" 
                    style={{ 
                      backgroundImage: s.image_url ? `url(${s.image_url})` : undefined,
                      backgroundColor: !s.image_url ? '#e5e7eb' : undefined 
                    }}
                  ></div>
                  <div className="service-card-body">
                    <span className="case-tag" style={{fontSize: '0.8rem', opacity: 0.7}}>{s.client}</span>
                    <h3 className="service-card-title">{s.title}</h3>
                    <p className="service-card-desc">{s.description}</p>
                  </div>
                </article>
              ))
            ) : (
              <>
                <article className="service-card">
                  <div className="service-card-image brand-img-leaders"></div>
                  <div className="service-card-body">
                    <span className="case-tag" style={{fontSize: '0.8rem', opacity: 0.7}}>Public Sector</span>
                    <h3 className="service-card-title">Institutional Rebranding</h3>
                    <p className="service-card-desc">Redefining visibility for a regional development body.</p>
                  </div>
                </article>
              </>
            )}
          </div>
          <div className="section-cta-center services-page-cta">
            <a href="/" className="btn btn-primary">Back to Home</a>
            <a href="/contact#contact" className="btn btn-outline">Start a Project</a>
          </div>
        </div>
      </section>
    </main>
  );
}