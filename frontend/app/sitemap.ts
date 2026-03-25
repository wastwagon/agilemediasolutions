import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.agilemediasolutions.com';
  const routes = [
    '/', '/about', '/services', '/sectors', '/brands', '/signature-events', '/studio',
    '/case-studies', '/insights', '/agile-press-group', '/digital-engagement',
    '/partnerships', '/careers', '/contact', '/privacy', '/terms', '/cookies'
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
    lastModified: new Date(),
  }));
}
