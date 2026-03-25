import Link from 'next/link';

export const metadata = {
  title: 'Terms of service',
  description: 'Terms governing use of the Agile Media Solutions website.',
};

export default function TermsPage() {
  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Legal</span>
          <h1 className="page-hero-title">Terms of service</h1>
          <p className="page-hero-tagline">Rules for using this website. Replace placeholders with language your lawyer approves.</p>
        </div>
      </div>
      <section className="section">
        <div className="section-inner" style={{ maxWidth: '42rem', margin: '0 auto', paddingBottom: '4rem' }}>
          <div className="section-text" style={{ lineHeight: 1.75 }}>
            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Agreement</h2>
            <p>
              By using this site, you agree to these terms. If you do not agree, please do not use the site.{' '}
              <Link href="/contact">Contact us</Link> with questions.
            </p>

            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Use of the site</h2>
            <p>You may browse the site for lawful purposes. You must not attempt to disrupt the site, scrape it in a way that harms our systems, or misuse forms and APIs.</p>

            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Content</h2>
            <p>Text, images, and branding on this site belong to Agile Media Solutions or its licensors unless stated otherwise. Do not reuse them without permission.</p>

            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>No professional advice</h2>
            <p>Website content is for general information, not legal, financial, or other professional advice. You rely on it at your own risk.</p>

            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Limitation of liability</h2>
            <p>To the fullest extent permitted by law, we are not liable for indirect or consequential loss arising from use of this site. Some jurisdictions do not allow certain limits; those limits apply only to the extent allowed.</p>

            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Changes</h2>
            <p>We may update these terms from time to time. The updated version will be posted on this page with a new &quot;last updated&quot; note when you maintain one.</p>

            <p style={{ marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted, #6b7280)' }}>
              This is a starter template, not legal advice. Have qualified counsel review before publication.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
