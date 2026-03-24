import React from 'react';

export default function Page() {
  return (
    <main className="services-page-main">
      
    <div className="page-hero">
      <div className="page-hero-inner">
        <span className="page-hero-label">Insights & Press Room</span>
        <h1 className="page-hero-title">Where Strategy Meets Story.</h1>
        <p className="page-hero-tagline">Bold ideas, sector intelligence, creative insights, and media highlights.</p>
      </div>
    </div>
    <section className="section section-insights" id="insights">
      <div className="section-inner animate-on-scroll">
        <h2 className="section-title centered">Insights & Press Room</h2>
        <p className="section-subtitle centered">Where Strategy Meets Story. And Headlines Meet Meaning.</p>
        <p className="section-subtitle centered">This is where Agile Media Solutions shares bold ideas, sector intelligence, creative insights, and media highlights. From original commentary to campaign coverage, this section brings together our perspective and presence in the media landscape.</p>
        <div className="insights-grid">
          <article className="insight-card animate-on-scroll">
            <h3>Insights</h3>
            <p><strong>Our voice. Our vision.</strong></p>
            <p>We believe communication is a tool for shaping society—not just sharing news. Through essays, articles, and guest features, we share insights on:</p>
            <ul style={{margin: '0.5rem 0 1rem', paddingLeft: '1.25rem'}}>
              <li style={{marginBottom: '0.35rem'}}>Strategic communications trends across Africa and globally</li>
              <li style={{marginBottom: '0.35rem'}}>Narrative power in trade, policy, and governance</li>
              <li style={{marginBottom: '0.35rem'}}>Brand storytelling in complex or high-trust sectors</li>
              <li style={{marginBottom: '0.35rem'}}>Campaign design, media innovation, and impact communications</li>
              <li style={{marginBottom: '0.35rem'}}>Leadership messaging and institutional credibility</li>
            </ul>
            <div className="section-cta-center" style={{flexWrap: 'wrap', justifyContent: 'flex-start'}}>
              <a href="/contact#contact" className="btn btn-outline">Read Our Latest Insights</a>
              <a href="/contact#contact" className="btn btn-outline">Submit a Guest Article</a>
            </div>
          </article>
          <article className="insight-card animate-on-scroll">
            <h3>Press Room</h3>
            <p><strong>News, launches, and media coverage.</strong></p>
            <p>Stay up to date with Agile Media Solutions in the news and on the record.</p>
            <ul style={{margin: '0.5rem 0 1rem', paddingLeft: '1.25rem'}}>
              <li style={{marginBottom: '0.35rem'}}>Announcements and client wins</li>
              <li style={{marginBottom: '0.35rem'}}>Event media kits and summit briefings</li>
              <li style={{marginBottom: '0.35rem'}}>Press releases and thought leader mentions</li>
              <li style={{marginBottom: '0.35rem'}}>Executive op-eds and campaign launches</li>
              <li style={{marginBottom: '0.35rem'}}>Awards, partnerships, and public recognitions</li>
            </ul>
            <div className="section-cta-center" style={{flexWrap: 'wrap', justifyContent: 'flex-start'}}>
              <a href="/contact#contact" className="btn btn-outline">Browse Press Releases</a>
              <a href="/contact#contact" className="btn btn-outline">Access Media Kits</a>
              <a href="/contact#contact" className="btn btn-outline">Download Executive Photos and Bios</a>
            </div>
          </article>
          <article className="insight-card animate-on-scroll">
            <h3>Media Circulation Support</h3>
            <p>Agile Media Solutions also facilitates press release writing, distribution, and media engagement on behalf of select clients through our Corporate Communications & Circulation Service.</p>
            <div className="section-cta-center" style={{flexWrap: 'wrap', justifyContent: 'flex-start'}}>
              <a href="/contact#contact" className="btn btn-outline">Learn More About Media Support</a>
              <a href="/contact#contact" className="btn btn-outline">Request Distribution Assistance</a>
            </div>
          </article>
        </div>
        <p className="section-subtitle centered" style={{marginTop: 'var(--space-xl)'}}>Want to be the first to receive our insights?</p>
        <div className="section-cta-center">
          <a href="/contact#contact" className="btn btn-primary">Subscribe to the Agile Brief – Our Monthly Roundup of Ideas, Strategy & News</a>
        </div>
      </div>
    </section>
  
    </main>
  );
}