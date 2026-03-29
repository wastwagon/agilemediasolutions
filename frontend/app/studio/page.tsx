import React from 'react';
import Link from 'next/link';
import SectionHeader from '../../components/SectionHeader';

export default function Page() {
  return (
    <main className="services-page-main creative-public-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Studio</span>
          <h1 className="page-hero-title">Where Ideas Become Content. And Content Becomes Influence.</h1>
          <p className="page-hero-tagline">
            Agile Studio is the creative production and content innovation arm of Agile Media Solutions. It is where strategic vision meets visual execution—where narratives take form through world-class media production, brand storytelling, and digital experiences.
          </p>
          <p className="page-hero-tagline" style={{ marginTop: 'var(--space-md)' }}>
            Our studio supports both internal campaigns and external clients with turnkey creative solutions across film, design, audio, photography, and experiential content.
          </p>
        </div>
      </div>

      <section className="section section-digital" id="studio">
        <div className="section-inner animate-on-scroll">
          <SectionHeader
            variant="inner"
            label="Production Stack"
            title="What We Do"
            linkHref="/contact#contact"
            linkLabel="Book the studio"
            titleClassName="digital-title"
          />

          <div className="digital-offerings">
            <div className="digital-offering">
              <h4 className="digital-offering-title">Video Production &amp; Direction</h4>
              <p className="digital-offering-desc">
                Documentaries, campaign videos, investor pitches, and brand films—crafted for impact and produced to global standards.
              </p>
            </div>
            <div className="digital-offering">
              <h4 className="digital-offering-title">Photography &amp; Content Capture</h4>
              <p className="digital-offering-desc">
                Professional event coverage, studio photography, behind-the-scenes, and portrait sessions for brands, leaders, and creatives.
              </p>
            </div>
            <div className="digital-offering">
              <h4 className="digital-offering-title">Design &amp; Visual Identity Systems</h4>
              <p className="digital-offering-desc">
                Logos, branding kits, infographics, social media templates, publications, and design systems aligned with your strategic message.
              </p>
            </div>
            <div className="digital-offering">
              <h4 className="digital-offering-title">Animation &amp; Motion Graphics</h4>
              <p className="digital-offering-desc">Explainer videos, title sequences, motion branding, and creative visuals that bring abstract messages to life.</p>
            </div>
            <div className="digital-offering">
              <h4 className="digital-offering-title">Audio Production &amp; Podcasts</h4>
              <p className="digital-offering-desc">
                Scripted and unscripted podcast production, audio interviews, and thematic sound design for campaign and media use.
              </p>
            </div>
            <div className="digital-offering">
              <h4 className="digital-offering-title">Editing &amp; Post-Production</h4>
              <p className="digital-offering-desc">
                Full-suite editing, sound mixing, subtitling, formatting, and localization for digital, broadcast, and event use.
              </p>
            </div>
          </div>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-2xl)' }}>
            Studio Highlights
          </h3>
          <ul className="digital-list">
            <li>On-location and in-studio production</li>
            <li>Multilingual voiceovers and regional content adaptation</li>
            <li>Drone and aerial videography</li>
            <li>Livestream event coverage and hybrid setup support</li>
            <li>Digital content packaging for web, mobile, and social</li>
          </ul>

          <h3 className="digital-offerings-heading" style={{ marginTop: 'var(--space-xl)' }}>
            Studio Clients &amp; Collaborators
          </h3>
          <p className="digital-intro">
            We serve public institutions, CEOs, NGOs, influencers, creatives, campaign teams, and international brands with production work that meets strategic objectives and surpasses creative expectations.
          </p>

          <div className="section-cta-center digital-cta-buttons" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link href="/contact#contact" className="btn btn-primary">
              Book the Studio
            </Link>
            <Link href="/case-studies" className="btn btn-outline">
              View Our Production Portfolio
            </Link>
            <Link href="/contact#contact" className="btn btn-outline">
              Commission a Project
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
