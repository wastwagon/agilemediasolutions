'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Hero from '../components/Hero';
import CaseStudiesCarousel from '../components/CaseStudiesCarousel';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

interface Brand {
  id: number;
  name: string;
  description: string;
  image_url: string;
  website_url: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface EventData {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
}

export default function Page() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useScrollAnimations();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, servicesRes, eventsRes] = await Promise.all([
          fetch('/api/brands'),
          fetch('/api/services'),
          fetch('/api/events')
        ]);
        if (brandsRes.ok) setBrands(await brandsRes.json());
        if (servicesRes.ok) setServices(await servicesRes.json());
        if (eventsRes.ok) setEvents(await eventsRes.json());
      } catch (err) {
        console.error('Failed to fetch home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Re-run animation observer when data changes
  useEffect(() => {
    if (loading) return;
    
    const animated = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    animated.forEach((el) => observer.observe(el));
    return () => {
        animated.forEach((el) => observer.unobserve(el));
    };
  }, [loading, brands, services, events]);

  return (
    <main>
      <Hero />

      <section className="section section-who" id="who-we-are">
        <div className="section-inner section-split animate-on-scroll">
          <div className="section-content">
            <h2 className="section-title">Who We Are</h2>
            <p className="section-text">
              We are a multidisciplinary communications agency operating at the intersection of strategy, storytelling, and public influence. From presidential campaigns to global brand launches, our work blends intelligence, creativity, and execution power—helping clients lead conversations and shape change.
            </p>
            <div className="section-cta-inline">
              <Link href="/about" className="btn btn-learn">Learn More About Us</Link>
            </div>
          </div>
          <div className="section-media">
            <div className="media-placeholder media-who" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      <section className="section section-services-intro" id="what-we-do">
        <div className="section-inner section-split reverse animate-on-scroll">
          <div className="section-content">
            <h2 className="section-title">What We Do</h2>
            <p className="section-text">
              Our services span every aspect of strategic communication—from policy messaging to digital campaigns, crisis PR to institutional branding. We build the communications infrastructure that enables leadership, trust, and transformation.
            </p>
            <div className="section-cta-inline">
              <Link href="#services" className="btn btn-learn">Explore Our Services</Link>
            </div>
          </div>
          <div className="section-media">
            <div className="media-placeholder media-what-we-do" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      <section className="section section-cards" id="services">
        <div className="section-inner animate-on-scroll">
          <h2 className="section-title centered">Our services</h2>
          <p className="section-subtitle centered">
            Comprehensive communications solutions. Strategically designed. Precisely delivered.
          </p>
          <div className="cards-grid cards-services">
            {services.length > 0 ? (
              services.map((s: Service) => (
                <article key={s.id} className="card card-service animate-on-scroll">
                  <div className={`card-image-placeholder service-img-${s.icon || 'default'}`}></div>
                  <h3>{s.title}</h3>
                  <p>{s.description}<br /><Link href="/services" className="link-arrow-text">Learn more →</Link></p>
                </article>
              ))
            ) : (
              <>
                <article className="card card-service animate-on-scroll">
                  <div className="card-image-placeholder service-img-strategic"></div>
                  <h3>Strategic Communications & Narrative Building</h3>
                  <p>Tailored messaging frameworks and storytelling strategies that align with your institutional goals and public identity.<br /><Link href="/services" className="link-arrow-text">Learn more →</Link></p>
                </article>
                <article className="card card-service animate-on-scroll">
                  <div className="card-image-placeholder service-img-media-relations"></div>
                  <h3>Media Relations & Reputation Management</h3>
                  <p>Build and sustain public trust through managed perception, strong media relationships, and preparation for visibility and scrutiny.<br /><Link href="/services" className="link-arrow-text">Learn more →</Link></p>
                </article>
                <article className="card card-service animate-on-scroll">
                  <div className="card-image-placeholder service-img-campaigns"></div>
                  <h3>Campaigns, Advocacy & Stakeholder Engagement</h3>
                  <p>High-impact campaigns that mobilize audiences, shift public opinion, and influence policy or behavior.<br /><Link href="/services" className="link-arrow-text">Learn more →</Link></p>
                </article>
              </>
            )}
          </div>
          <div className="section-cta-center">
            <Link href="/services" className="btn btn-outline">View all services</Link>
            <Link href="/contact#contact" className="btn btn-outline">Request a Consultation</Link>
          </div>
        </div>
      </section>

      <section className="section section-brands" id="our-brands">
        <div className="section-inner animate-on-scroll">
          <h2 className="section-title centered">Our Brands</h2>
          <p className="section-subtitle centered">
            Media Properties That Inform, Inspire, and Influence. Agile Media Solutions owns and operates a growing portfolio of high-impact media platforms that shape public discourse, elevate African voices, and spotlight key sectors across the continent.
          </p>
          <div className="cards-grid cards-brands">
            {brands.length > 0 ? (
              brands.map((b: Brand) => (
                <article key={b.id} className="card card-brand animate-on-scroll">
                  <div className="card-image-placeholder" style={{ backgroundImage: b.image_url ? `url(${b.image_url})` : undefined, backgroundColor: '#f9f9f9' }}></div>
                  <h3>{b.name}</h3>
                  <p>{b.description}<br /><Link href="/brands" className="link-arrow-text">Learn more →</Link></p>
                </article>
              ))
            ) : (
              <>
                <article className="card card-brand animate-on-scroll">
                  <div className="card-image-placeholder brand-img-leaders"></div>
                  <h3>African Leaders Magazine</h3>
                  <p>A continental platform spotlighting leadership, policy, and governance across Africa for decision-makers and institutions.<br /><Link href="/brands" className="link-arrow-text">Learn more →</Link></p>
                </article>
                <article className="card card-brand animate-on-scroll">
                  <div className="card-image-placeholder brand-img-sports"></div>
                  <h3>Africa Sports Magazine</h3>
                  <p>Monthly insights on performance, business, and culture in African sports—celebrating athletes, rising stars, and sports diplomacy.<br /><Link href="/brands" className="link-arrow-text">Learn more →</Link></p>
                </article>
                <article className="card card-brand animate-on-scroll">
                  <div className="card-image-placeholder brand-img-news"></div>
                  <h3>Africa News Bulletin</h3>
                  <p>Daily curated updates on politics, economy, institutions, and regional affairs for decision-makers across the continent.<br /><Link href="/brands" className="link-arrow-text">Learn more →</Link></p>
                </article>
              </>
            )}
          </div>
          <div className="section-cta-center">
            <Link href="/brands" className="btn btn-outline btn-view-all-brands">View All Brands</Link>
            <Link href="/contact#contact" className="btn btn-outline">Advertise With Us</Link>
          </div>
        </div>
      </section>

      <section className="section section-events" id="events">
        <div className="section-inner animate-on-scroll">
          <h2 className="section-title centered">Signature Events</h2>
          <p className="section-subtitle centered">
            Curated Platforms That Bring Visionaries, Innovators, and Institutions Together. 
          </p>
          <div className="cards-grid cards-events">
            {events.length > 0 ? (
              events.slice(0, 3).map((e) => (
                <article key={e.id} className="card card-event animate-on-scroll">
                  <div 
                    className="card-image-placeholder" 
                    style={{ 
                      backgroundImage: e.image_url ? `url(${e.image_url})` : undefined,
                      backgroundColor: !e.image_url ? '#e5e7eb' : undefined 
                    }}
                  ></div>
                  <h3>{e.title}</h3>
                  <p>{e.description}<br /><Link href="/signature-events" className="link-arrow-text">Learn more →</Link></p>
                </article>
              ))
            ) : (
              <>
                <article className="card card-event animate-on-scroll">
                  <div className="card-image-placeholder event-img-summit"></div>
                  <h3>Africa Trade Summit</h3>
                  <p>Accelerating intra-African trade, investment, and economic transformation.<br /><Link href="/signature-events" className="link-arrow-text">Learn more →</Link></p>
                </article>
                <article className="card card-event animate-on-scroll">
                  <div className="card-image-placeholder event-img-trade-awards"></div>
                  <h3>Africa Trade Awards</h3>
                  <p>Celebrating excellence across the continent’s trade ecosystem.<br /><Link href="/signature-events" className="link-arrow-text">Learn more →</Link></p>
                </article>
                <article className="card card-event animate-on-scroll">
                  <div className="card-image-placeholder event-img-jazz"></div>
                  <h3>Afro Jazz Festival</h3>
                  <p>Celebrating the soul of Africa through music, art, and culture.<br /><Link href="/signature-events" className="link-arrow-text">Learn more →</Link></p>
                </article>
              </>
            )}
          </div>
          <div className="section-cta-center">
            <Link href="/signature-events" className="btn btn-outline">See Event Calendar</Link>
            <Link href="/partnerships" className="link-arrow">Partner With Us <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="section section-case-studies" id="case-studies">
        <div className="section-inner animate-on-scroll">
          <h2 className="section-title centered">Case Studies & Portfolio</h2>
          <p className="section-subtitle centered">Strategic Impact. Creative Execution. Measurable Results.</p>
          <CaseStudiesCarousel />
          <div className="section-cta-center">
            <Link href="/contact#contact" className="btn btn-primary">Start a Project</Link>
            <Link href="/contact#contact" className="btn btn-outline">Book a Discovery Call</Link>
          </div>
        </div>
      </section>

      <section className="section section-stay" id="stay-connected">
        <div className="section-inner section-split animate-on-scroll">
          <div className="section-content">
            <h2 className="section-title">Stay Connected</h2>
            <p className="section-tagline">Let's tell better stories—together.</p>
            <div className="section-cta-buttons">
              <Link href="/contact#contact" className="btn btn-primary">Contact Us</Link>
              <Link href="#newsletter" className="btn btn-outline">Subscribe to Newsletter</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}