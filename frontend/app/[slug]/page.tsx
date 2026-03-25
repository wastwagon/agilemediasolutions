import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageBlocksRenderer from '../../components/PageBlocksRenderer';

const RESERVED_SLUGS = new Set([
  'admin',
  'about',
  'services',
  'sectors',
  'brands',
  'signature-events',
  'studio',
  'case-studies',
  'insights',
  'agile-press-group',
  'digital-engagement',
  'partnerships',
  'careers',
  'contact',
  'privacy',
  'terms',
  'cookies',
]);

async function fetchPage(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/pages/${slug}`, {
    // ensure dynamic on server
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) return {};

  const page = await fetchPage(slug);
  if (!page) return {};

  const title = page?.title || slug;
  const description = page?.description || `Read ${title} on Agile Media Solutions.`;

  return {
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title,
      description,
      url: `/${slug}`,
      type: 'article',
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    },
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Avoid letting CMS override core routes that already exist
  if (RESERVED_SLUGS.has(slug)) notFound();

  const page = await fetchPage(slug);
  if (!page) notFound();

  const blocks = Array.isArray(page?.content_json?.blocks) ? page.content_json.blocks : [];

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">{page?.title || slug}</span>
          <h1 className="page-hero-title">{page?.title || slug}</h1>
          {page?.description ? <p className="page-hero-tagline">{page.description}</p> : null}
        </div>
      </div>

      <PageBlocksRenderer blocks={blocks} />
    </main>
  );
}

