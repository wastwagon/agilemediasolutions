import type { MetadataRoute } from 'next';
import { pagesApiOrigin } from '@/lib/pagesApiOrigin';
import { publicSiteUrl } from '@/lib/publicSite';

type CmsSitemapRow = { slug: string; updated_at?: string | null };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = publicSiteUrl();
  const routes = [
    '/',
    '/about',
    '/services',
    '/sectors',
    '/brands',
    '/signature-events',
    '/studio',
    '/case-studies',
    '/insights',
    '/agile-press-group',
    '/digital-engagement',
    '/partnerships',
    '/careers',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies',
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
    lastModified: new Date(),
  }));

  let cmsEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${pagesApiOrigin()}/api/public/published-cms-pages`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const rows = (await res.json()) as CmsSitemapRow[];
      if (Array.isArray(rows)) {
        cmsEntries = rows.map((r) => ({
          url: `${siteUrl}/${encodeURIComponent(r.slug)}`,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
          lastModified: r.updated_at ? new Date(r.updated_at) : new Date(),
        }));
      }
    }
  } catch {
    /* sitemap still valid with static routes only */
  }

  return [...staticEntries, ...cmsEntries];
}
