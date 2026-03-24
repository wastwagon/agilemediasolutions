'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export default function Page() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          setServices(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    };
    fetchServices();
  }, []);

  const heroContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const heroItem = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
  };

  const gridContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className="services-page-main">
      
    <div className="page-hero">
      <motion.div className="page-hero-inner" variants={heroContainer} initial="hidden" animate="show">
        <div style={{ overflow: 'hidden', paddingBottom: '4px' }}>
          <motion.span variants={heroItem} className="page-hero-label" style={{ display: 'inline-block' }}>Services</motion.span>
        </div>
        <div style={{ overflow: 'hidden', paddingBottom: '8px' }}>
          <motion.h1 variants={heroItem} className="page-hero-title">Comprehensive Communications Solutions. Strategically Designed. Precisely Delivered.</motion.h1>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <motion.p variants={heroItem} className="page-hero-tagline">Full suite of communications, media, and public relations services for governments, businesses, and institutions.</motion.p>
        </div>
      </motion.div>
    </div>

    <section className="section section-cards">
      <div className="section-inner"> 
        <motion.h1 
          className="section-title centered"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          Comprehensive Communications Solutions. Strategically Designed. Precisely Delivered.
        </motion.h1>
        <motion.p 
          className="section-subtitle centered all-services-intro"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Agile Media Solutions offers a full suite of communications, media, and public relations services designed for governments, businesses, institutions, and mission-driven organizations. Our work blends strategic thinking, creative execution, and sectoral intelligence—ensuring our clients communicate with clarity, confidence, and purpose.
        </motion.p>
        <motion.p 
          className="section-subtitle centered"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore our integrated service offerings below.
        </motion.p>
        
        <motion.div 
          className="services-grid"
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.length > 0 ? (
            services.map((s) => (
              <motion.article key={s.id} className="service-card magnetic" variants={cardItem}>
                <div className={`service-card-image service-img-${s.icon || 'default'}`}></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{s.title}</h3>
                  <p className="service-card-desc">{s.description}</p>
                </div>
              </motion.article>
            ))
          ) : (
            <>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-strategic"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Strategic Communications & Narrative Building</h3>
                  <p className="service-card-desc">We develop tailored messaging frameworks, storytelling strategies, and communication blueprints that align with your institutional goals and public identity. Includes: Message mapping, speechwriting, narrative architecture, and positioning strategies.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-media-relations"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Media Relations & Reputation Management</h3>
                  <p className="service-card-desc">We help you build and sustain public trust by managing perception, cultivating media relationships, and preparing for both visibility and scrutiny. Includes: Press engagement, media training, crisis response, reputation recovery.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-campaigns"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Campaigns, Advocacy & Stakeholder Engagement</h3>
                  <p className="service-card-desc">We design high-impact campaigns that mobilize audiences, shift public opinion, and influence policy or behavior. Includes: Advocacy communications, civic mobilization, stakeholder mapping, and coalition engagement.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-digital"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Digital, Social & Multimedia Communications</h3>
                  <p className="service-card-desc">We deliver digital-first communications across platforms—combining content strategy, design, and audience analytics for sustained engagement. Includes: Social media strategy, influencer integration, video content, community management.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-branding"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Branding, Design & Identity Systems</h3>
                  <p className="service-card-desc">We build powerful brand identities that reflect your vision and connect meaningfully with your audience. Includes: Visual identity, brand messaging, institutional rebranding, graphic design.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-events"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Event Media & Summit Support</h3>
                  <p className="service-card-desc">We provide complete media support for events—from press handling and content creation to live coverage and post-event promotion. Includes: Media kits, live production, speaker preparation, and summit communications.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-esg"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Investor, Donor & ESG Communications</h3>
                  <p className="service-card-desc">We help you communicate value, transparency, and vision to investors, funders, and strategic partners. Includes: ESG reports, donor briefings, impact storytelling, investor decks.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-insights"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Insights, Monitoring & Performance Measurement</h3>
                  <p className="service-card-desc">We equip you with real-time intelligence and performance analysis to track progress, evaluate reach, and optimize strategies. Includes: Media monitoring, audience analytics, sentiment analysis, reporting dashboards.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-advisory"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Advisory, Training & Institutional Capacity Building</h3>
                  <p className="service-card-desc">We build in-house communication capacity through advisory support, coaching, and strategic audits. Includes: Executive communications coaching, staff training, department strategy planning.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-diplomacy"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Influence Strategy & Public Diplomacy</h3>
                  <p className="service-card-desc">We support governments, embassies, and regional bodies in shaping international narratives and building soft power. Includes: Diplomatic campaigns, narrative repositioning, multilateral engagement.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-ai"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">AI & Innovation Lab</h3>
                  <p className="service-card-desc">We leverage the latest tools in content automation, predictive analytics, and immersive media to keep our clients at the forefront of communications. Includes: AI-assisted content, AR/VR experiences, digital production systems.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-policy"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Policy & Legislative Communications</h3>
                  <p className="service-card-desc">We translate complex legal and policy content into compelling public narratives that inform, engage, and persuade. Includes: Policy brief translation, public rollout strategies, legislative PR.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-market"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Market Entry & Investor Onboarding Communications</h3>
                  <p className="service-card-desc">We help international brands and investors navigate new markets with culturally aware, locally resonant communications strategies. Includes: Market reputation mapping, regulator engagement messaging, localization support.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-corporate"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Corporate Communications & Media Circulation</h3>
                  <p className="service-card-desc">We manage formal and institutional messaging across internal and external channels—ensuring consistency, clarity, and compliance. Includes: Press releases, internal memos, regulatory disclosures, and executive communications.</p>
                </div>
              </motion.article>
              <motion.article className="service-card magnetic" variants={cardItem}>
                <div className="service-card-image service-img-studio"></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">Studio Services: Production, Design & Content Creation</h3>
                  <p className="service-card-desc">Our in-house creative studio produces world-class visuals, video, photography, and multimedia content tailored to your audience and brand. Includes: Documentary production, brand videos, photography, post-production.</p>
                </div>
              </motion.article>
            </>
          )}
        </motion.div>
        
        <motion.p 
          className="section-subtitle centered" 
          style={{marginTop: '3rem'}}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          Need help choosing the right mix? We'll assess your goals and recommend a package that delivers real-world outcomes.
        </motion.p>
        <motion.div 
          className="section-cta-center services-page-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <a href="/index#contact" className="btn btn-primary magnetic">Request a Consultation</a>
          <a href="/index#case-studies" className="btn btn-outline magnetic">Browse Our Case Studies</a>
        </motion.div>
      </div>
    </section>
  
    </main>
  );
}