import React, { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageBlocksRenderer from '../../components/PageBlocksRenderer';
import { pagesApiOrigin } from '@/lib/pagesApiOrigin';
import { absPublicUrl, firstOgImageFromBlocks, publicSiteUrl } from '@/lib/publicSite';
import reservedSlugList from '@/config/reserved-slugs.json';

const RESERVED_SLUGS = new Set<string>(reservedSlugList as string[]);

const fetchPage = cache(async (slug: string) => {
  const res = await fetch(`${pagesApiOrigin()}/api/pages/${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) return {};

  const page = await fetchPage(slug);
  if (!page) return {};

  const title = page?.title || slug;
  const description = page?.description || `Read ${title} on Agile Media Solutions.`;
  const blocks = Array.isArray(page?.content_json?.blocks) ? page.content_json.blocks : [];
  const ogImage = firstOgImageFromBlocks(blocks);
  const ogImages = ogImage ? [{ url: ogImage }] : undefined;
  const publishedTime =
    typeof page?.published_at === 'string' && page.published_at
      ? new Date(page.published_at).toISOString()
      : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title,
      description,
      url: `/${slug}`,
      type: 'article',
      ...(ogImages ? { images: ogImages } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      title,
      description,
      card: ogImage ? 'summary_large_image' : 'summary',
      ...(ogImage ? { images: [ogImage] } : {}),
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

  const site = publicSiteUrl();
  const pageUrl = absPublicUrl(`/${slug}`);
  const publishedIso =
    typeof page?.published_at === 'string' && page.published_at
      ? new Date(page.published_at).toISOString()
      : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        name: page?.title || slug,
        description: page?.description || undefined,
        url: pageUrl,
        ...(publishedIso ? { datePublished: publishedIso } : {}),
        isPartOf: { '@type': 'WebSite', name: 'Agile Media Solutions', url: site },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${site}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page?.title || slug,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className="creative-public-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

