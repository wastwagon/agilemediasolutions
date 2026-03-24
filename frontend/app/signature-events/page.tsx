'use client';
import React, { useEffect, useState } from 'react';

interface EventData {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
}

export default function Page() {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          setEvents(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <main className="services-page-main">
      
    <div className="page-hero">
      <div className="page-hero-inner">
        <span className="page-hero-label">Events</span>
        <h1 className="page-hero-title">Signature Events</h1>
        <p className="page-hero-tagline">Curated platforms bringing together visionaries, innovators, and institutions across trade, investment, culture, and industry.</p>
      </div>
    </div>
    <section className="section section-cards">
      <div className="section-inner">
        <h1 className="section-title centered">Signature Events</h1>
        <p className="section-subtitle centered all-services-intro">
          Curated Platforms That Bring Visionaries, Innovators, and Institutions Together. Agile Media Solutions is not only a communications firm—we are also a convening force. Through our proprietary events, we bring together influential voices across trade, investment, culture, policy, and industry to inspire dialogue, foster partnerships, and build platforms that matter.
        </p>
        <p className="section-subtitle centered">Our events combine powerful content, strategic visibility, high-level participation, and unforgettable experiences. Explore our signature events below.</p>
        <div className="services-grid">
          {events.length > 0 ? (
            events.map((e) => (
              <article key={e.id} className="service-card">
                <div 
                  className="service-card-image" 
                  style={{ 
                    backgroundImage: e.image_url ? `url(${e.image_url})` : undefined, 
                    backgroundColor: !e.image_url ? '#e5e7eb' : undefined 
                  }}
                ></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{e.title}</h3>
                  <p className="service-card-desc">{e.description}</p>
                </div>
              </article>
            ))
          ) : (
            <>
              <article className="service-card">
                <div className="service-card-image"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Africa Trade Summit</h3>
                  <p className="service-card-desc">Accelerating Intra-African Trade, Investment, and Economic Transformation. An annual flagship gathering of business leaders, policymakers, trade agencies, and investors. The Summit drives practical discussions around cross-border commerce, industrialization, trade finance, AfCFTA implementation, and private sector collaboration. Features: Presidential panels, investment pitch rooms, trade showcases, CEO roundtables. Audience: Governments, DFIs, SMEs, multinationals, logistics and infrastructure players.</p>
                </div>
              </article>
              <article className="service-card">
                <div className="service-card-image"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Africa Trade Awards</h3>
                  <p className="service-card-desc">Celebrating Excellence Across the Continent's Trade Ecosystem. Held as part of the Africa Trade Summit, the Awards recognize leading exporters, reform champions, trade institutions, and high-performing brands contributing to Africa's economic integration. Categories: Exporter of the Year, Trade Enabler, Public Sector Innovator, Emerging Enterprise, Digital Trade Leader. Audience: Corporates, SMEs, government agencies, financial institutions.</p>
                </div>
              </article>
              <article className="service-card">
                <div className="service-card-image"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Africa Industry Awards</h3>
                  <p className="service-card-desc">Honoring the Enterprises Building Africa's Industrial Future. A high-level awards program spotlighting innovation, resilience, and growth in Africa's industrial and manufacturing sectors—from agribusiness and mining to energy, construction, and light industry. Features: Sector-specific categories, innovation spotlights, media coverage, investor networking. Audience: Industrial firms, regulators, financiers, development agencies, media.</p>
                </div>
              </article>
              <article className="service-card">
                <div className="service-card-image"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Africa Investment Week</h3>
                  <p className="service-card-desc">Connecting Capital to Opportunity Across African Markets. A dynamic, multi-day platform that brings together investors, fund managers, startups, governments, and DFIs to explore sector trends, identify opportunities, and catalyze partnerships. Features: Deal rooms, roundtables, investor briefings, country presentations, fund showcases. Audience: VCs, private equity, sovereign wealth funds, investment promotion agencies.</p>
                </div>
              </article>
              <article className="service-card">
                <div className="service-card-image"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Afro Jazz Festival</h3>
                  <p className="service-card-desc">Celebrating the Soul of Africa Through Music, Art, and Culture. An immersive cultural experience showcasing the best of African jazz and fusion—combining live performances, visual art, food, fashion, and storytelling. The festival bridges heritage and innovation, creativity and commerce. Features: Live concerts, curated exhibitions, talent showcases, brand activations. Audience: Music lovers, cultural institutions, tourism boards, creative brands.</p>
                </div>
              </article>
            </>
          )}
        </div>
        <div className="section-cta-center services-page-cta">
          <a href="/index" className="btn btn-primary">Back to Home</a>
          <a href="/index#events" className="btn btn-outline">View Events on Home</a>
          <a href="/contact#contact" className="btn btn-outline">Contact Us</a>
        </div>
      </div>
    </section>
  
    </main>
  );
}