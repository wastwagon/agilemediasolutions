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
    <main className="home-page">
      <Hero />

      <section className="section section-who" id="who-we-are">
        <div className="section-inner section-split animate-on-scroll">
          <div className="section-content">
            <h2 className="section-title">Who We Are</h2>
            <p className="section-text">
              We are a multidisciplinary communications agency operating at the intersection of strategy, storytelling, and public influence. From presidential campaigns to global brand launches, our work blends intelligence, creativity, and execution power—helping clients lead conversations and shape change.
            </p>
            <div className="section-cta-inline">
              <Link href="/about" className="btn btn-learn">Learn More About Us →</Link>
            </div>
          </div>
          <div className="section-media">
            <div className="media-placeholder media-who" aria-hidden="true"></div>
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
              services.slice(0, 4).map((s: Service) => (
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
                  <h3>Strategic Communications &amp; Narrative Building</h3>
                  <p>We develop tailored messaging frameworks, storytelling strategies, and communication blueprints that align with your institutional goals and public identity. Includes: Message mapping, speechwriting, narrative architecture, and positioning strategies.<br /><Link href="/services" className="link-arrow-text">Learn more →</Link></p>
                </article>
                <article className="card card-service animate-on-scroll">
                  <div className="card-image-placeholder service-img-media-relations"></div>
                  <h3>Media Relations &amp; Reputation Management</h3>
                  <p>We help you build and sustain public trust by managing perception, cultivating media relationships, and preparing for both visibility and scrutiny. Includes: Press engagement, media training, crisis response, reputation recovery.<br /><Link href="/services" className="link-arrow-text">Learn more →</Link></p>
                </article>
                <article className="card card-service animate-on-scroll">
                  <div className="card-image-placeholder service-img-campaigns"></div>
                  <h3>Campaigns, Advocacy &amp; Stakeholder Engagement</h3>
                  <p>We design high-impact campaigns that mobilize audiences, shift public opinion, and influence policy or behavior. Includes: Advocacy communications, civic mobilization, stakeholder mapping, and coalition engagement.<br /><Link href="/services" className="link-arrow-text">Learn more →</Link></p>
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
                  <p>A continental platform spotlighting leadership, policy, and governance across Africa.<br /><Link href="/brands" className="link-arrow-text">Learn more →</Link></p>
                </article>
                <article className="card card-brand animate-on-scroll">
                  <div className="card-image-placeholder brand-img-sports"></div>
                  <h3>Africa Sports Magazine</h3>
                  <p>Highlighting the athletes, leagues, and moments driving Africa&apos;s sporting evolution.<br /><Link href="/brands" className="link-arrow-text">Learn more →</Link></p>
                </article>
                <article className="card card-brand animate-on-scroll">
                  <div className="card-image-placeholder brand-img-news"></div>
                  <h3>Africa News Bulletin</h3>
                  <p>A daily newswire delivering curated updates on politics, economy, institutions, and regional affairs.<br /><Link href="/brands" className="link-arrow-text">Learn more →</Link></p>
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
                  <p>Accelerating Intra-African Trade, Investment, and Economic Transformation.<br /><Link href="/signature-events" className="link-arrow-text">Learn more →</Link></p>
                </article>
                <article className="card card-event animate-on-scroll">
                  <div className="card-image-placeholder event-img-trade-awards"></div>
                  <h3>Africa Trade Awards</h3>
                  <p>Celebrating Excellence Across the Continent&apos;s Trade Ecosystem.<br /><Link href="/signature-events" className="link-arrow-text">Learn more →</Link></p>
                </article>
                <article className="card card-event animate-on-scroll">
                  <div className="card-image-placeholder event-img-jazz"></div>
                  <h3>Afro Jazz Festival</h3>
                  <p>Celebrating the Soul of Africa Through Music, Art, and Culture.<br /><Link href="/signature-events" className="link-arrow-text">Learn more →</Link></p>
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
          <h2 className="section-title centered">Case Studies &amp; Campaign Highlights</h2>
          <p className="section-subtitle centered">
            Explore our portfolio of strategic communications projects across Africa and the global stage—from cross-border campaigns to policy communications and narrative repositioning.
          </p>
          <CaseStudiesCarousel />
          <div className="section-cta-center">
            <Link href="/case-studies" className="btn btn-outline">See Case Studies →</Link>
            <Link href="/contact#contact" className="btn btn-primary">Start a Project</Link>
          </div>
        </div>
      </section>

      <section className="section section-insights-home" id="insights-press">
        <div className="section-inner animate-on-scroll">
          <h2 className="section-title centered">Insights &amp; Press Room</h2>
          <p className="section-subtitle centered">
            Stay updated with our bulletins, press briefings, news and thought leadership through the Agile Press Group.
          </p>
          <div className="section-cta-center">
            <Link href="/agile-press-group" className="btn btn-primary">Visit Agile Press Group →</Link>
            <Link href="/insights" className="btn btn-outline">Insights &amp; press room</Link>
          </div>
        </div>
      </section>

      <section className="section section-careers-home" id="join-team">
        <div className="section-inner animate-on-scroll" style={{ textAlign: 'center', maxWidth: '40rem', margin: '0 auto' }}>
          <h2 className="section-title centered">Join the Team</h2>
          <p className="section-subtitle centered">
            We&apos;re building a creative, strategic, and fearless team across Africa and beyond.
          </p>
          <div className="section-cta-center">
            <Link href="/careers" className="btn btn-primary">Explore Careers</Link>
            <Link href="/contact#contact" className="btn btn-outline">Become a Contributor</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
