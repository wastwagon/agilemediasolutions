'use client';

import React, { useEffect, useState } from 'react';

interface Brand {
  id: number;
  name: string;
  description: string;
  image_url: string;
  website_url: string;
}

export default function Page() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('/api/brands');
        if (res.ok) {
          setBrands(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch brands:', err);
      }
    };
    fetchBrands();
  }, []);

  return (
    <main className="services-page-main">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Our Brands</span>
          <h1 className="page-hero-title">Media Properties That Inform, Inspire, and Influence.</h1>
          <p className="page-hero-tagline">A growing portfolio of high-impact media platforms that shape public discourse and elevate African voices.</p>
        </div>
      </div>
      <section className="section section-cards">
        <div className="section-inner">
          <h1 className="section-title centered">Our Brands</h1>
          <p className="section-subtitle centered all-services-intro">
            Agile Media Solutions owns and operates a growing portfolio of high-impact media platforms that shape public discourse, elevate African voices, and spotlight key sectors across the continent.
          </p>
          <div className="services-grid">
            {brands.length > 0 ? (
              brands.map((b) => (
                <article key={b.id} className="service-card">
                  <div 
                    className="service-card-image" 
                    style={{ 
                      backgroundImage: b.image_url ? `url(${b.image_url})` : undefined,
                      backgroundColor: !b.image_url ? '#e5e7eb' : undefined 
                    }}
                  ></div>
                  <div className="service-card-body">
                    <h3 className="service-card-title">{b.name}</h3>
                    <p className="service-card-desc">{b.description}</p>
                    {b.website_url && (
                      <a href={b.website_url} target="_blank" rel="noopener noreferrer" className="btn-text" style={{marginTop: '1rem', display: 'inline-block'}}>Visit Website →</a>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <>
                <article className="service-card">
                  <div className="service-card-image brand-img-leaders"></div>
                  <div className="service-card-body">
                    <h3 className="service-card-title">African Leaders Magazine</h3>
                    <p className="service-card-desc">A continental platform spotlighting leadership, policy, and governance across Africa.</p>
                  </div>
                </article>
                <article className="service-card">
                  <div className="service-card-image brand-img-sports"></div>
                  <div className="service-card-body">
                    <h3 className="service-card-title">Africa Sports Magazine</h3>
                    <p className="service-card-desc">Highlighting the athletes, leagues, and moments driving Africa's sporting evolution.</p>
                  </div>
                </article>
              </>
            )}
          </div>
          <div className="section-cta-center services-page-cta">
            <a href="/" className="btn btn-primary">Back to Home</a>
            <a href="/contact#contact" className="btn btn-outline">Advertise With Us</a>
            <a href="/services" className="btn btn-outline">Explore Our Services</a>
          </div>
        </div>
      </section>
    </main>
  );
}