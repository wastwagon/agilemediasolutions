'use client';

import React from 'react';
import Image from 'next/image';
import AdminUrlLink from './AdminUrlLink';
import { cmsImageShouldUnoptimize } from '@/lib/cmsImage';
import { blockSectionId } from '@/lib/blockSectionAnchor';

type PageBlock =
  | { id?: string; anchorId?: string; type: 'text'; heading?: string; body?: string }
  | { id?: string; anchorId?: string; type: 'image'; url?: string; alt?: string; caption?: string }
  | { id?: string; anchorId?: string; type: 'cta'; label?: string; href?: string; variant?: 'primary' | 'outline' };

export default function PageBlocksRenderer({ blocks }: { blocks: PageBlock[] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      {blocks.map((b, idx) => {
        const key = b.id || `${b.type}-${idx}`;
        const sectionId = blockSectionId(b.anchorId) ?? blockSectionId(b.id);

        if (b.type === 'text') {
          return (
            <section
              key={key}
              id={sectionId}
              className="section"
              style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}
            >
              <div className="section-inner">
                {b.heading ? <h2 className="section-title">{b.heading}</h2> : null}
                {b.body
                  ? b.body
                      .split(/\n{2,}/)
                      .map((chunk) => chunk.trim())
                      .filter(Boolean)
                      .map((chunk, pi) => (
                        <p key={pi} className="section-text" style={{ whiteSpace: 'pre-line' }}>
                          {chunk}
                        </p>
                      ))
                  : null}
              </div>
            </section>
          );
        }

        if (b.type === 'image') {
          return (
            <section
              key={key}
              id={sectionId}
              className="section"
              style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}
            >
              <div className="section-inner">
                <figure style={{ margin: 0 }}>
                  <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)' }}>
                    {b.url ? (
                      <Image
                        src={b.url}
                        alt={b.alt || ''}
                        width={1920}
                        height={1080}
                        className="page-block-image"
                        sizes="(max-width: 768px) 100vw, min(1280px, 100vw)"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                        unoptimized={cmsImageShouldUnoptimize(b.url)}
                      />
                    ) : null}
                  </div>
                  {b.caption ? (
                    <figcaption className="page-block-figcaption" style={{ marginTop: '0.6rem', fontSize: '0.95rem' }}>
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
            <section
              key={key}
              id={sectionId}
              className="section"
              style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}
            >
              <div className="section-inner">
                <div className="section-cta-center">
                  <AdminUrlLink href={href} className={cls}>
                    {label}
                  </AdminUrlLink>
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

