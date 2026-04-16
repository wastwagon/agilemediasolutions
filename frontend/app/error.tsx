'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        <h1 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: '1.75rem', marginBottom: '0.75rem' }}>
          Something went wrong
        </h1>
        <p style={{ color: 'var(--color-text-muted, #5a5652)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          This page hit an unexpected error. You can try again or return to the homepage.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              cursor: 'pointer',
              padding: '0.6rem 1.1rem',
              borderRadius: 'var(--radius, 12px)',
              border: '1px solid var(--color-border, #e2ddd5)',
              background: 'var(--color-bg-alt, #f3f0ea)',
              color: 'inherit',
              font: 'inherit',
            }}
          >
            Try again
          </button>
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
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
