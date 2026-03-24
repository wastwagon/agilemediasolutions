'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ParallaxImage from '../../components/ParallaxImage';

export default function AboutPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className="page-hero-wrapper">
      <div className="page-hero">
        <motion.div className="page-hero-inner" variants={container} initial="hidden" animate="show">
          <div style={{ overflow: 'hidden', paddingBottom: '4px' }}>
            <motion.span variants={item} className="page-hero-label" style={{ display: 'inline-block' }}>Who We Are</motion.span>
          </div>
          <div style={{ overflow: 'hidden', paddingBottom: '8px' }}>
            <motion.h1 variants={item} className="page-hero-title">Powered by Narrative, Driven by Impact</motion.h1>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.p variants={item} className="page-hero-tagline">We are more than a media firm; we are architects of influence and storytellers for the modern era.</motion.p>
          </div>
        </motion.div>
      </div>

      <section className="section section-about-intro">
        <div className="section-inner">
          <div className="section-split">
            <motion.div 
              className="section-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="section-title">A Vision for Global Perspective</h2>
              <p className="section-text">Founded on the principle that every story deserves a platform that matches its weight, Agile Media Solutions provides integrated communication strategies that bridge the gap between vision and visibility.</p>
              <p className="section-text">Our teams in Accra, Nairobi, and Johannesburg work across sectors to deliver narratives that resonate globally while remaining deeply rooted in local context.</p>
            </motion.div>
            <motion.div 
              className="section-media"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ height: '600px', borderRadius: '16px', overflow: 'hidden' }}
            >
               <ParallaxImage className="media-who" offset={80} />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section section-values" style={{background: '#fff'}}>
        <div className="section-inner">
          <motion.h2 
            className="section-title centered"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Core Values
          </motion.h2>
          <motion.div 
            className="cards-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.div className="card magnetic" variants={item}>
               <h3>Integrity</h3>
               <p>We uphold the highest standards of journalistic and communication ethics, ensuring transparency across all our projects.</p>
            </motion.div>
            <motion.div className="card magnetic" variants={item}>
               <h3>Innovation</h3>
               <p>We leverage cutting-edge digital toolsets and creative storytelling techniques to stay ahead of the media curve.</p>
            </motion.div>
            <motion.div className="card magnetic" variants={item}>
               <h3>Impact</h3>
               <p>Our work is measured by the tangible change and influence it drives for our partners and their communities.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
