'use client';

import React from 'react';
import Link from 'next/link';

type PageBlock =
  | { id?: string; type: 'text'; heading?: string; body?: string }
  | { id?: string; type: 'image'; url?: string; alt?: string; caption?: string }
  | { id?: string; type: 'cta'; label?: string; href?: string; variant?: 'primary' | 'outline' };

export default function PageBlocksRenderer({ blocks }: { blocks: PageBlock[] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      {blocks.map((b, idx) => {
        const key = b.id || `${b.type}-${idx}`;

        if (b.type === 'text') {
          return (
            <section key={key} className="section" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
              <div className="section-inner">
                {b.heading ? <h2 className="section-title">{b.heading}</h2> : null}
                {b.body ? <p className="section-text">{b.body}</p> : null}
              </div>
            </section>
          );
        }

        if (b.type === 'image') {
          return (
            <section key={key} className="section" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
              <div className="section-inner">
                <figure style={{ margin: 0 }}>
                  <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)' }}>
                    {b.url ? (
                      <img
                        src={b.url}
                        alt={b.alt || ''}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    ) : null}
                  </div>
                  {b.caption ? (
                    <figcaption style={{ marginTop: '0.6rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                      {b.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </div>
            </section>
          );
        }

        if (b.type === 'cta') {
          const href = (b.href || '').trim();
          const label = (b.label || '').trim();
          if (!href || !label) return null;

          const cls = b.variant === 'outline' ? 'btn btn-outline' : 'btn btn-primary';

          return (
            <section key={key} className="section" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
              <div className="section-inner">
                <div className="section-cta-center">
                  <Link href={href} className={cls}>
                    {label}
                  </Link>
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}

