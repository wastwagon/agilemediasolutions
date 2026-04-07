import { absPublicUrl, publicSiteUrl } from '@/lib/publicSite';

const DEFAULT_DESC =
  'International media, PR, and communications firm helping governments, institutions, brands, and movements shape the messages that move nations, markets, and minds.';

export default function OrganizationJsonLd() {
  const base = publicSiteUrl();
  const logo = absPublicUrl('/images/agilemediasolutionslogo.png');

  const payload = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: 'Agile Media Solutions',
        url: base,
        logo: { '@type': 'ImageObject', url: logo },
        description: DEFAULT_DESC,
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: base,
        name: 'Agile Media Solutions',
        description: DEFAULT_DESC,
        publisher: { '@id': `${base}/#organization` },
        inLanguage: 'en',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
