/** Physical head office — override in Admin → Site Content (Contact page, About presence). */
export const DEFAULT_HEAD_OFFICE_LINE = 'No. 5 Teinor Street - Dzorwulu, Accra - Ghana';

/** Schema.org PostalAddress for Organization JSON-LD. */
export const DEFAULT_ORGANIZATION_POSTAL_ADDRESS = {
  '@type': 'PostalAddress' as const,
  streetAddress: 'No. 5 Teinor Street',
  addressLocality: 'Dzorwulu, Accra',
  addressCountry: 'GH',
};
