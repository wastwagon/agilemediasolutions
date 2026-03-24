'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Sector {
  id: number;
  name: string;
  description: string;
  icon?: string;
}

export default function Page() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/sectors`)
      .then(res => res.json())
      .then(data => {
        setSectors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching sectors:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="services-page-main">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Sectors</span>
          <h1 className="page-hero-title">Sectors We Serve</h1>
          <p className="page-hero-tagline">Expert Communications Across Institutions, Industries, and Global Issues.</p>
        </div>
      </div>

      <section className="section section-sectors" id="sectors">
        <div className="section-inner animate-on-scroll">
          <div className="section-sectors-intro">
            <p className="section-text" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--space-3xl)' }}>
              Agile Media Solutions delivers high-impact communications across key sectors shaping Africa and the world. We work with governments, corporations, development agencies, and cultural institutions to craft narratives that reflect their values.
            </p>
          </div>

          {loading ? (
            <div className="loading-container" style={{ padding: '4rem 0' }}>
              <div className="loader"></div>
            </div>
          ) : sectors.length > 0 ? (
            <div className="sectors-grid">
              {sectors.map((sector) => (
                <article key={sector.id} className="sector-card">
                  <div className="sector-card-icon" style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-electric-blue)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-sm)', color: '#FFFFFF' }}>{sector.name}</h3>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>{sector.description}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>No sectors currently displayed. Add them via the Admin panel.</p>
            </div>
          )}

          <div className="section-cta-center" style={{marginTop: 'var(--space-3xl)', display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)'}}>
            <Link href="/contact#contact" className="btn btn-primary">Talk to a Sector Advisor</Link>
            <Link href="/case-studies" className="btn btn-outline">Explore Our Work</Link>
          </div>
        </div>
      </section>
    </main>
  );
}