import type { MetadataRoute } from 'next';
import { publicSiteUrl } from '@/lib/publicSite';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = publicSiteUrl();

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin'] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
