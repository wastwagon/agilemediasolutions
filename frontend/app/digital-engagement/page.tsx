import React from 'react';

export default function Page() {
  return (
    <main className="services-page-main">
      
    <div className="page-hero">
      <div className="page-hero-inner">
        <span className="page-hero-label">Digital engagement</span>
        <h1 className="page-hero-title">Where Audiences Are Built, Messages Amplified, and Influence Engineered</h1>
        <p className="page-hero-tagline">
          At Agile Media Solutions, social media is not just a platform—it is a political tool, a public square, a brand amplifier, and an intelligence system. We help institutions, leaders, movements, and brands activate digital audiences with precision, creativity, and credibility.
        </p>
        <p className="page-hero-tagline" style={{ marginTop: 'var(--space-md)' }}>
          Whether you&apos;re launching a campaign, shaping perception, engaging a community, or managing risk—we turn your objectives into algorithm-friendly, influence-driven digital executions.
        </p>
      </div>
    </div>
    <section className="section section-digital" id="digital">
      <div className="section-inner animate-on-scroll">
        <h2 className="section-title digital-title">Our Digital Strategy Offerings</h2>
        <p className="digital-intro">
          From platform strategy and creative production to analytics and verification—we design digital infrastructure that matches your mandate and your audiences.
        </p>
        <h3 className="digital-offerings-heading">How we can help</h3>
        <div className="digital-offerings">
          <div className="digital-offering">
            <h4 className="digital-offering-title">Platform Strategy & Management</h4>
            <p className="digital-offering-desc">We build and manage institutional and executive presence across Twitter/X, Instagram, Facebook, LinkedIn, TikTok, YouTube, and emerging platforms. From posting plans to tone-of-voice development, we ensure your digital identity is compelling, credible, and consistent.</p>
          </div>
          <div className="digital-offering">
            <h4 className="digital-offering-title">Digital Influence Mapping & Audience Intelligence</h4>
            <p className="digital-offering-desc">We map digital ecosystems—identifying who's leading conversations, where your audiences are clustered, and what topics drive traction. Our analysis covers influencers, competitors, hashtags, and stakeholder sentiment in real time.</p>
            <p className="digital-list-label">Use cases:</p>
            <ul className="digital-list">
              <li>Policy or electoral campaigns</li>
              <li>Trade diplomacy or investment outreach</li>
              <li>Institutional positioning and reform engagement</li>
            </ul>
          </div>
          <div className="digital-offering">
            <h4 className="digital-offering-title">Executive & Institutional Social Branding</h4>
            <p className="digital-offering-desc">We help CEOs, ministers, and public institutions craft social profiles that build trust and visibility. This includes platform setup, strategic content calendars, verified identity support, and ghostwriting where required.</p>
          </div>
          <div className="digital-offering">
            <h4 className="digital-offering-title">Agile Social Studio & Visual Lab</h4>
            <p className="digital-offering-desc">Our creative studio produces short-form, high-engagement content for digital platforms, including:</p>
            <ul className="digital-list">
              <li>Social videos, reels, and motion graphics</li>
              <li>Infographics and visual explainers</li>
              <li>Carousel storytelling and quote cards</li>
              <li>Livestream and podcast snippets</li>
              <li>Captioning, subtitling, and rapid-turn content</li>
              <li>Platform-specific asset formatting (e.g. LinkedIn vs. TikTok)</li>
            </ul>
          </div>
          <div className="digital-offering">
            <h4 className="digital-offering-title">Paid Media & Performance Boosting</h4>
            <p className="digital-offering-desc">We design and execute targeted social media advertising campaigns across platforms—focused on follower growth, click-throughs, signups, or public sentiment.</p>
          </div>
          <div className="digital-offering">
            <h4 className="digital-offering-title">Crisis & Reputation Management</h4>
            <p className="digital-offering-desc">We provide institutional support during digital crises, media attacks, or misinformation events. Our response includes:</p>
            <ul className="digital-list">
              <li>Message calibration and control</li>
              <li>Real-time monitoring and sentiment tracking</li>
              <li>Influencer engagement and media briefings</li>
              <li>Post-crisis cleanup and public confidence rebuilding</li>
            </ul>
          </div>
          <div className="digital-offering">
            <h4 className="digital-offering-title">Community & Grassroots Mobilization</h4>
            <p className="digital-offering-desc">We use platforms like WhatsApp Broadcast, Telegram Channels, and Facebook Groups to reach diaspora audiences, youth voters, creative communities, and hard-to-reach publics—especially during political, civic, or cultural mobilizations.</p>
          </div>
          <div className="digital-offering">
            <h4 className="digital-offering-title">Social Media Training & Digital Capacity Building</h4>
            <p className="digital-offering-desc">Through masterclasses, playbooks, and hands-on labs, we empower:</p>
            <ul className="digital-list">
              <li>Government communications teams</li>
              <li>NGO campaigners</li>
              <li>Political campaign operatives</li>
              <li>Public figures and spokespersons</li>
              <li>Private sector PR teams</li>
            </ul>
          </div>
          <div className="digital-offering">
            <h4 className="digital-offering-title">Analytics & Data-Driven Reporting</h4>
            <p className="digital-offering-desc">Our monthly performance dashboards cover:</p>
            <ul className="digital-list">
              <li>Growth trends and engagement breakdown</li>
              <li>Best-performing content</li>
              <li>Influencer amplification metrics</li>
              <li>Geographic reach and sentiment</li>
              <li>Platform algorithm insights</li>
              <li>Strategic recommendations</li>
            </ul>
          </div>
          <div className="digital-offering">
            <h4 className="digital-offering-title">Platform Verification & Compliance</h4>
            <p className="digital-offering-desc">We help institutions and leaders secure verified accounts, meet community standards, and build secure, compliant platform identities—across global and African social platforms.</p>
          </div>
        </div>
        <div className="digital-cta-block">
          <h3 className="digital-cta-heading">Let&apos;s Go Digital with Purpose</h3>
          <p className="digital-cta-text">
            We treat digital space as infrastructure. Let Agile Media Solutions power your online influence with precision, agility, and clarity.
          </p>
          <div className="section-cta-center digital-cta-buttons">
            <a href="/contact#contact" className="btn btn-primary">
              Request a Social Media Strategy Session
            </a>
            <a href="/case-studies" className="btn btn-outline">
              View Our Digital Case Studies
            </a>
            <a href="/studio" className="btn btn-outline">
              Engage Our Studio
            </a>
          </div>
        </div>
      </div>
    </section>
  
    </main>
  );
}