import React from 'react';
import Link from 'next/link';
import SectionHeader from '../../components/SectionHeader';

export default function Page() {
  return (
    <main className="services-page-main creative-public-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Insights &amp; press room</span>
          <h1 className="page-hero-title">Where Strategy Meets Story. And Headlines Meet Meaning.</h1>
          <p className="page-hero-tagline">
            This is where Agile Media Solutions shares bold ideas, sector intelligence, creative insights, and media highlights. From original commentary to campaign coverage, this section brings together our perspective and presence in the media landscape.
          </p>
        </div>
      </div>
      <section className="section section-insights" id="insights">
        <div className="section-inner animate-on-scroll">
          <SectionHeader
            variant="inner"
            label="Editorial Desk"
            title={<>Insights &amp; Press Room</>}
            linkHref="/agile-press-group"
            linkLabel="Visit press group"
          />
          <div className="insights-grid">
            <article className="insight-card animate-on-scroll">
              <h3>Insights</h3>
              <p>
                <strong>Our voice. Our vision.</strong>
              </p>
              <p>We believe communication is a tool for shaping society—not just sharing news. Through essays, articles, and guest features, we share insights on:</p>
              <ul style={{ margin: '0.5rem 0 1rem', paddingLeft: '1.25rem' }}>
                <li style={{ marginBottom: '0.35rem' }}>Strategic communications trends across Africa and globally</li>
                <li style={{ marginBottom: '0.35rem' }}>Narrative power in trade, policy, and governance</li>
                <li style={{ marginBottom: '0.35rem' }}>Brand storytelling in complex or high-trust sectors</li>
                <li style={{ marginBottom: '0.35rem' }}>Campaign design, media innovation, and impact communications</li>
                <li style={{ marginBottom: '0.35rem' }}>Leadership messaging and institutional credibility</li>
              </ul>
              <div className="section-cta-center" style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                <Link href="/contact#contact" className="btn btn-outline">
                  Read Our Latest Insights
                </Link>
                <Link href="/contact#contact" className="btn btn-outline">
                  Submit a Guest Article
                </Link>
              </div>
            </article>
            <article className="insight-card animate-on-scroll">
              <h3>Press Room</h3>
              <p>
                <strong>News, launches, and media coverage.</strong>
              </p>
              <p>Stay up to date with Agile Media Solutions in the news and on the record.</p>
              <ul style={{ margin: '0.5rem 0 1rem', paddingLeft: '1.25rem' }}>
                <li style={{ marginBottom: '0.35rem' }}>Announcements and client wins</li>
                <li style={{ marginBottom: '0.35rem' }}>Event media kits and summit briefings</li>
                <li style={{ marginBottom: '0.35rem' }}>Press releases and thought leader mentions</li>
                <li style={{ marginBottom: '0.35rem' }}>Executive op-eds and campaign launches</li>
                <li style={{ marginBottom: '0.35rem' }}>Awards, partnerships, and public recognitions</li>
              </ul>
              <div className="section-cta-center" style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                <Link href="/contact#contact" className="btn btn-outline">
                  Browse Press Releases
                </Link>
                <Link href="/contact#contact" className="btn btn-outline">
                  Access Media Kits
                </Link>
                <Link href="/contact#contact" className="btn btn-outline">
                  Download Executive Photos and Bios
                </Link>
              </div>
            </article>
            <article className="insight-card animate-on-scroll">
              <h3>Media Circulation Support</h3>
              <p>
                Agile Media Solutions also facilitates press release writing, distribution, and media engagement on behalf of select clients through our Corporate Communications &amp; Circulation Service.
              </p>
              <div className="section-cta-center" style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                <Link href="/services" className="btn btn-outline">
                  Learn More About Media Support
                </Link>
                <Link href="/contact#contact" className="btn btn-outline">
                  Request Distribution Assistance
                </Link>
              </div>
            </article>
          </div>
          <p className="section-subtitle centered" style={{ marginTop: 'var(--space-xl)' }}>
            Want to be the first to receive our insights?
          </p>
          <div className="section-cta-center">
            <Link href="/#newsletter" className="btn btn-primary">
              Subscribe to the Agile Brief
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
