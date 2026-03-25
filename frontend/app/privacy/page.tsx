import Link from 'next/link';

export const metadata = {
  title: 'Privacy policy',
  description: 'How Agile Media Solutions handles personal data collected through this website.',
};

export default function PrivacyPage() {
  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Legal</span>
          <h1 className="page-hero-title">Privacy policy</h1>
          <p className="page-hero-tagline">Last updated: March 2026. Plain-language summary below; tailor with your lawyer for your jurisdiction.</p>
        </div>
      </div>
      <section className="section">
        <div className="section-inner" style={{ maxWidth: '42rem', margin: '0 auto', paddingBottom: '4rem' }}>
          <div className="section-text" style={{ lineHeight: 1.75 }}>
            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Who we are</h2>
            <p>
              This site is operated by Agile Media Solutions (&quot;we&quot;, &quot;us&quot;). For any privacy questions, use the{' '}
              <Link href="/contact">contact page</Link>.
            </p>

            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>What we collect</h2>
            <p>
              <strong>Contact form:</strong> name, email, optional topic, and your message—so we can reply to you.
            </p>
            <p>
              <strong>Newsletter:</strong> email address only, to send updates you signed up for.
            </p>
            <p>
              <strong>Technical data:</strong> like many sites, hosting may log IP address, browser type, and pages viewed for security and reliability.
            </p>

            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>How we use it</h2>
            <p>We use this information to respond to enquiries, send newsletters you requested, and keep the site secure. We do not sell your personal data.</p>

            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>How long we keep it</h2>
            <p>We keep contact and newsletter data only as long as needed for those purposes or as required by law—then we delete or anonymise it.</p>

            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Your choices</h2>
            <p>You can ask to access, correct, or delete your personal data where applicable. Unsubscribe links will be included in marketing emails once you enable them in your mail tool.</p>

            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Cookies</h2>
            <p>
              See our <Link href="/cookies">cookie notice</Link> for how we use cookies and similar technologies.
            </p>

            <p style={{ marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted, #6b7280)' }}>
              This page is a starter template and not legal advice. Have counsel review it before relying on it for compliance.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
