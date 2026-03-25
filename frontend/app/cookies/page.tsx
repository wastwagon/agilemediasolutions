import Link from 'next/link';

export const metadata = {
  title: 'Cookie notice',
  description: 'How Agile Media Solutions uses cookies and similar technologies.',
};

export default function CookiesPage() {
  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Legal</span>
          <h1 className="page-hero-title">Cookie notice</h1>
          <p className="page-hero-tagline">What cookies may be used and how you can control them.</p>
        </div>
      </div>
      <section className="section">
        <div className="section-inner" style={{ maxWidth: '42rem', margin: '0 auto', paddingBottom: '4rem' }}>
          <div className="section-text" style={{ lineHeight: 1.75 }}>
            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>What are cookies?</h2>
            <p>Cookies are small files stored on your device when you visit a site. They help the site work, remember preferences, or measure traffic.</p>

            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>How we use them</h2>
            <p>
              This site may use <strong>strictly necessary</strong> cookies so pages load and forms work, and <strong>analytics or functional</strong> cookies if you add services such as analytics providers. List specific tools here once you plug them in (e.g. Google Analytics, Meta Pixel).
            </p>

            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Your choices</h2>
            <p>You can block or delete cookies in your browser settings. Blocking some cookies may limit how parts of the site work.</p>

            <h2 className="section-title" style={{ fontSize: '1.35rem', marginTop: '2rem', marginBottom: '0.75rem' }}>More detail</h2>
            <p>
              For how we treat personal data more broadly, see our <Link href="/privacy">privacy policy</Link>. Questions?{' '}
              <Link href="/contact">Contact us</Link>.
            </p>

            <p style={{ marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted, #6b7280)' }}>
              Update this page when you add third-party scripts so visitors know what runs on the site.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
