'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * Catches errors in the root layout (and below). Must define its own <html> and <body>.
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '2rem',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          background: '#fdfbf7',
          color: '#1c1b1a',
        }}
      >
        <main style={{ maxWidth: '28rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', marginBottom: '0.75rem' }}>Something went wrong</h1>
          <p style={{ color: '#5a5652', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            The site could not render this page. You can try again or return to the homepage.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                cursor: 'pointer',
                padding: '0.6rem 1.1rem',
                borderRadius: '12px',
                border: '1px solid #e2ddd5',
                background: '#f3f0ea',
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
                borderRadius: '12px',
                background: '#2c504a',
                color: '#fff',
                textDecoration: 'none',
                font: 'inherit',
              }}
            >
              Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
