import React from 'react';

export default function Page() {
  return (
    <main className="careers-page-main">
      <section className="section section-careers-page" id="careers">
        <div className="careers-hero">
          <div className="careers-hero-inner">
            <span className="careers-label">Careers</span>
            <h1 className="careers-title">Join a Team That Shapes Narratives and Moves Audiences</h1>
            <p className="careers-tagline">
              At Agile Media Solutions, we are building more than a media and communications firm—we are building a platform for influence, creativity, and purpose. We bring together storytellers, strategists, analysts, designers, producers, and policy thinkers who believe in the power of narrative to transform institutions and societies.
            </p>
            <p className="careers-intro">
              If you&apos;re driven by ideas, committed to excellence, and ready to work on high-impact projects across Africa and globally, Agile may be the place for you.
            </p>
          </div>
        </div>

        <div className="careers-content">
          <div className="careers-grid">
            <div className="careers-block careers-card">
              <h2 className="careers-heading">Why Work With Us</h2>
              <ul className="careers-list">
                <li>Work with bold clients on issues that matter</li>
                <li>Collaborate across borders, cultures, and sectors</li>
                <li>Develop creative solutions with real-world influence</li>
                <li>Build campaigns that shape conversations and policy</li>
                <li>Grow in a mission-driven, fast-moving team of global professionals</li>
              </ul>
            </div>

            <div className="careers-block careers-card">
              <h2 className="careers-heading">Who We&apos;re Looking For</h2>
              <p className="section-text">We welcome early-career and experienced professionals with expertise in:</p>
              <ul className="careers-list">
                <li>Strategic communications</li>
                <li>Public relations and media management</li>
                <li>Creative direction, content writing, and editorial</li>
                <li>Film, video, photography, and motion graphics</li>
                <li>Digital strategy and campaign management</li>
                <li>Public affairs, governance, and policy engagement</li>
                <li>Marketing, partnerships, and business development</li>
                <li>Events, production, and logistics</li>
                <li>Research, insights, and sector analysis</li>
              </ul>
            </div>

            <div className="careers-block careers-opportunities">
              <h2 className="careers-heading">Opportunities</h2>
              <ul className="careers-opportunities-grid">
                <li className="careers-opportunity-card">
                  <span className="careers-opportunity-title">Full-Time Positions</span>
                  <span className="careers-opportunity-desc">Join our leadership or delivery teams</span>
                </li>
                <li className="careers-opportunity-card">
                  <span className="careers-opportunity-title">Consultant Roster</span>
                  <span className="careers-opportunity-desc">Project-based roles across regions and specialties</span>
                </li>
                <li className="careers-opportunity-card">
                  <span className="careers-opportunity-title">Fellowships &amp; Internships</span>
                  <span className="careers-opportunity-desc">For emerging creatives, writers, and strategists</span>
                </li>
                <li className="careers-opportunity-card">
                  <span className="careers-opportunity-title">Creative Collaborators</span>
                  <span className="careers-opportunity-desc">Visual artists, animators, musicians, illustrators</span>
                </li>
              </ul>
            </div>

            <div className="careers-block careers-card careers-culture">
              <h2 className="careers-heading">The Agile Culture</h2>
              <ul className="careers-list">
                <li>Collaborative and mission-focused</li>
                <li>Flexible, fast-paced, and outcome-driven</li>
                <li>Diverse, respectful, and inclusive</li>
                <li>Invested in continuous learning and experimentation</li>
              </ul>
            </div>
          </div>

          <div className="careers-cta-strip">
            <div className="careers-cta-inner">
              <p className="careers-cta-text">Ready to apply?</p>
              <div className="careers-cta-buttons">
                <a href="/contact#contact" className="btn btn-careers-primary">
                  See Open Positions
                </a>
                <a href="/contact#contact" className="btn btn-careers-outline">
                  Join Our Talent Network
                </a>
                <a href="/about" className="btn btn-careers-outline">
                  Meet Our Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
