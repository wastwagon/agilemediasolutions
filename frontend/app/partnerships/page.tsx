import React from 'react';

export default function Page() {
  return (
    <main className="partnerships-page-main">
      
    <section className="section section-partnerships-page" id="partnerships">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Partnerships</span>
          <h1 className="page-hero-title">Collaborating for Visibility, Influence, and Impact</h1>
          <p className="page-hero-tagline">
            Agile Media Solutions works in close partnership with institutions, businesses, governments, and creatives to co-create platforms, amplify causes, and deliver shared value. We don&apos;t just work for clients—we build strategic relationships that grow movements, markets, and messages.
          </p>
          <p className="page-hero-tagline" style={{ marginTop: 'var(--space-md)', marginBottom: '0' }}>
            Whether you are launching a campaign, hosting a global summit, expanding across regions, or creating your own branded media platform—we offer the expertise, reach, and execution power to bring your vision to life.
          </p>
        </div>
      </div>

      <div className="partnerships-content">
        <div className="partnerships-grid">
          <div className="partnerships-block partnerships-types">
            <h2 className="partnerships-heading">Types of Partnerships We Support</h2>
            <ul className="partnerships-types-grid">
              <li className="partnerships-type-card">
                <span className="partnerships-type-title">Institutional & Government Partnerships</span>
                <span className="partnerships-type-desc">Co-branded campaigns, narrative strategy, public education drives, and national visibility initiatives.</span>
              </li>
              <li className="partnerships-type-card">
                <span className="partnerships-type-title">Corporate & Brand Collaborations</span>
                <span className="partnerships-type-desc">Custom content platforms, sponsorship activations, product storytelling, and executive positioning.</span>
              </li>
              <li className="partnerships-type-card">
                <span className="partnerships-type-title">Development & Philanthropic Engagements</span>
                <span className="partnerships-type-desc">Program visibility, impact documentation, donor communications, and advocacy media.</span>
              </li>
              <li className="partnerships-type-card">
                <span className="partnerships-type-title">Media & Content Co-Productions</span>
                <span className="partnerships-type-desc">Joint ventures in content creation, special publications, brand integrations, and talent partnerships.</span>
              </li>
              <li className="partnerships-type-card">
                <span className="partnerships-type-title">Event Media Partnerships</span>
                <span className="partnerships-type-desc">Press management, stage production, and strategic amplification for high-level convenings.</span>
              </li>
              <li className="partnerships-type-card">
                <span className="partnerships-type-title">Diaspora, Arts & Cultural Platforms</span>
                <span className="partnerships-type-desc">Partnerships with festivals, exhibitions, creative collectives, and Afro-global networks.</span>
              </li>
            </ul>
          </div>

          <div className="partnerships-block partnerships-card">
            <h2 className="partnerships-heading">Partner With Us To</h2>
            <ul className="partnerships-list">
              <li>Expand your brand or institution across African and global audiences</li>
              <li>Build narrative power in a contested or complex media environment</li>
              <li>Reach strategic audiences with content that builds trust and engagement</li>
              <li>Launch or scale a campaign, media platform, or storytelling initiative</li>
              <li>Co-create publications, events, podcasts, or documentaries aligned with your mission</li>
            </ul>
          </div>

          <div className="partnerships-block partnerships-card partnerships-values">
            <h2 className="partnerships-heading">Our Partnership Values</h2>
            <ul className="partnerships-list">
              <li>Purpose-led Collaboration</li>
              <li>Shared Visibility and Voice</li>
              <li>Audience-Centric Storytelling</li>
              <li>Excellence in Execution</li>
              <li>Ethical Communications Practice</li>
            </ul>
          </div>
        </div>

        <div className="partnerships-cta-strip">
          <div className="partnerships-cta-inner">
            <p className="partnerships-cta-text">Tell us about your partnership idea.</p>
            <div className="partnerships-cta-buttons">
              <a href="/contact#contact" className="btn btn-partnerships-primary">
                Propose a Partnership
              </a>
              <a href="/contact#contact" className="btn btn-partnerships-outline">
                View Current Collaborators
              </a>
              <a href="/contact#contact" className="btn btn-partnerships-outline">
                Download Our Media Kit
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    </main>
  );
}