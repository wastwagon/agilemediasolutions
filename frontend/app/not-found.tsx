import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        margin: 0,
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        padding: 'var(--space-2xl, 3rem) var(--space-md, 1rem)',
        fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
        background: 'var(--color-bg, #fdfbf7)',
        color: 'var(--color-text, #1c1b1a)',
      }}
    >
      <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted, #5a5652)', marginBottom: '0.5rem' }}>
          404
        </p>
        <h1 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '0.75rem' }}>
          Page not found
        </h1>
        <p style={{ color: 'var(--color-text-muted, #5a5652)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          The page you requested does not exist or may have been moved.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.6rem 1.1rem',
            borderRadius: 'var(--radius, 12px)',
            background: 'var(--color-primary, #2c504a)',
            color: '#fff',
            textDecoration: 'none',
            font: 'inherit',
          }}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
