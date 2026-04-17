import type { Metadata } from 'next';
import type { PublicInsightPostDetail } from '@/lib/insightPostsServer';
import type { InsightFeaturedCard } from '@/lib/insightsFeatured';
import { absPublicUrl, publicSiteUrl } from '@/lib/publicSite';

const PUBLISHER_NAME = 'Agile Media Solutions';

function insightPath(slug: string): string {
  return `/insights/${encodeURIComponent(slug.trim())}`;
}

function ogImageFromUrl(raw: string | null | undefined): string | undefined {
  const abs = absPublicUrl(String(raw || '').trim());
  return abs || undefined;
}

function iso(d: string | null | undefined): string | undefined {
  if (!d || typeof d !== 'string') return undefined;
  const t = Date.parse(d);
  if (Number.isNaN(t)) return undefined;
  return new Date(t).toISOString();
}

export function metadataForInsightPost(slug: string, post: PublicInsightPostDetail): Metadata {
  const site = publicSiteUrl();
  const path = insightPath(slug);
  const url = `${site}${path}`;
  const title = post.title?.trim() || slug;
  const description = post.excerpt?.trim() || title;
  const ogImage = ogImageFromUrl(post.image_url);
  const publishedTime = iso(post.created_at ?? null);
  const modifiedTime = iso(post.updated_at ?? null);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: path,
      title,
      description,
      siteName: PUBLISHER_NAME,
      locale: 'en_US',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export function metadataForFeaturedInsightCard(slug: string, card: InsightFeaturedCard): Metadata {
  const path = insightPath(slug);
  const title = card.title?.trim() || slug;
  const description = card.excerpt?.trim() || title;
  const ogImage = ogImageFromUrl(card.imageUrl);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: path,
      title,
      description,
      siteName: PUBLISHER_NAME,
      locale: 'en_US',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export type InsightArticleJsonLdInput = {
  slug: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
};

/** JSON-LD @graph: WebPage, Article, BreadcrumbList — matches patterns used on CMS pages. */
export function buildInsightArticleJsonLd(input: InsightArticleJsonLdInput): Record<string, unknown> {
  const site = publicSiteUrl();
  const orgId = `${site}/#organization`;
  const path = insightPath(input.slug);
  const pageUrl = `${site}${path}`;
  const imageAbs = ogImageFromUrl(input.imageUrl);
  const pub = iso(input.datePublished ?? undefined);
  const mod = iso(input.dateModified ?? undefined);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        name: input.title,
        description: input.description || undefined,
        url: pageUrl,
        isPartOf: { '@type': 'WebSite', name: PUBLISHER_NAME, url: site },
      },
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: input.title,
        description: input.description || undefined,
        url: pageUrl,
        ...(imageAbs ? { image: [imageAbs] } : {}),
        ...(pub ? { datePublished: pub } : {}),
        ...(mod ? { dateModified: mod } : {}),
        author: { '@type': 'Organization', name: PUBLISHER_NAME, url: site },
        publisher: { '@id': orgId },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
          { '@type': 'ListItem', position: 2, name: 'Insights', item: `${site}/insights` },
          { '@type': 'ListItem', position: 3, name: input.title, item: pageUrl },
        ],
      },
    ],
  };
}
