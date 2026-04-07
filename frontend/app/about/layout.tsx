import type { Metadata } from 'next';
import { ABOUT_PAGE_CONTENT_DEFAULTS } from '@/lib/aboutPageContentDefaults';
import { getSiteSectionContent } from '@/lib/siteSectionCmsServer';

const FALLBACK_META_DESC =
  'Learn about Agile Media Solutions, an international media, PR, and communications firm serving governments, institutions, brands, and movements.';

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteSectionContent('about.page', ABOUT_PAGE_CONTENT_DEFAULTS);
  const title = (c.metaTitle || '').trim() || 'About Agile Media Solutions';
  const fromCms = (c.metaDescription || '').trim();
  const fromTagline = (c.heroTagline || '').trim().replace(/\s+/g, ' ');
  const description = (fromCms || fromTagline.slice(0, 160) || FALLBACK_META_DESC).slice(0, 160);

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description, card: 'summary_large_image' },
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
