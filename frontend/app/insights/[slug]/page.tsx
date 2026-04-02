import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSiteSectionContent } from '@/lib/siteSectionCmsServer';
import { INSIGHTS_FEATURED_DEFAULTS, parseInsightFeatured } from '@/lib/insightsFeatured';
import { getPublicInsightPostBySlug } from '@/lib/insightPostsServer';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPublicInsightPostBySlug(slug);
  if (post) {
    return { title: post.title, description: post.excerpt || post.title };
  }
  const flat = await getSiteSectionContent('insights.featured', INSIGHTS_FEATURED_DEFAULTS);
  const card = parseInsightFeatured(flat).find((c) => c.slug === slug);
  if (!card) return { title: 'Insight' };
  return { title: card.title, description: card.excerpt || card.title };
}

function bodyParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function InsightArticlePage(props: Props) {
  const { slug } = await props.params;
  const post = await getPublicInsightPostBySlug(slug);

  if (post) {
    const rawBody = (post.body || '').trim();
    const paragraphs = bodyParagraphs(rawBody);
    const fallback = post.excerpt ? [post.excerpt] : [];
    const blocks = paragraphs.length > 0 ? paragraphs : fallback;
    const imageUrl = post.image_url?.trim() || '';

    const heroKicker = [post.category?.name, post.meta].filter(Boolean).join(' · ') || 'Insights';

    return (
      <main className="services-page-main creative-public-page">
        <div className="page-hero">
          <div className="page-hero-inner">
            <span className="page-hero-label">{heroKicker}</span>
            <h1 className="page-hero-title">{post.title}</h1>
            {post.excerpt ? <p className="page-hero-tagline">{post.excerpt}</p> : null}
          </div>
        </div>
        {imageUrl ? (
          <div
            className="insight-article-hero-image"
            style={{ backgroundImage: `url(${imageUrl})` }}
            role="img"
            aria-label=""
          />
        ) : null}
        <article className="section section-insight-article">
          <div className="section-inner insight-article-inner">
            <div className="insight-article-prose">
              {blocks.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="insight-article-footer">
              <Link href="/insights" className="btn btn-outline">
                ← All insights &amp; press room
              </Link>
              <Link href="/agile-press-group" className="btn btn-primary">
                Agile Press Group
              </Link>
            </div>
          </div>
        </article>
      </main>
    );
  }

  const flat = await getSiteSectionContent('insights.featured', INSIGHTS_FEATURED_DEFAULTS);
  const card = parseInsightFeatured(flat).find((c) => c.slug === slug);
  if (!card) notFound();

  const paragraphs = bodyParagraphs(card.body);
  const fallback = card.excerpt ? [card.excerpt] : [];
  const blocks = paragraphs.length > 0 ? paragraphs : fallback;

  return (
    <main className="services-page-main creative-public-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">{card.meta}</span>
          <h1 className="page-hero-title">{card.title}</h1>
          {card.excerpt ? <p className="page-hero-tagline">{card.excerpt}</p> : null}
        </div>
      </div>
      {card.imageUrl ? (
        <div
          className="insight-article-hero-image"
          style={{ backgroundImage: `url(${card.imageUrl})` }}
          role="img"
          aria-label=""
        />
      ) : null}
      <article className="section section-insight-article">
        <div className="section-inner insight-article-inner">
          <div className="insight-article-prose">
            {blocks.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="insight-article-footer">
            <Link href="/insights" className="btn btn-outline">
              ← All insights &amp; press room
            </Link>
            <Link href="/agile-press-group" className="btn btn-primary">
              Agile Press Group
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
