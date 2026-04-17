import { DEFAULT_HEAD_OFFICE_LINE } from '@/lib/defaultAddress';

/** Single source for About page Site Content (`about.page`) defaults — keep in sync with admin fields. */
export const ABOUT_PAGE_CONTENT_DEFAULTS: Record<string, string> = {
  heroLabel: 'About us',
  heroTitle: 'Powering Narratives. Elevating Voices. Driving Impact.',
  heroTagline:
    'Agile Media Solutions is an international media, PR, and communications firm helping governments, institutions, brands, and movements shape the messages that move nations, markets, and minds.',
  identityLabel: 'Our Identity',
  identityTitle: 'Who We Are',
  identityP1:
    'We are a multidisciplinary communications agency operating at the intersection of strategy, storytelling, and public influence. From presidential campaigns to global brand launches, our work blends intelligence, creativity, and execution power-helping clients lead conversations and shape change.',
  identityP2:
    'Our services span every aspect of strategic communication-from policy messaging to digital campaigns, crisis PR to institutional branding. We build the communications infrastructure that enables leadership, trust, and transformation.',
  identityImageUrl: '',
  ctaPrimary: 'Explore Our Services',
  ctaSecondary: 'Work With Us',
  presenceLabel: 'Presence',
  presenceTitle: 'Where we work',
  presenceSubtitle: `Address: ${DEFAULT_HEAD_OFFICE_LINE}. Additional locations in Nairobi and Johannesburg—we are available across time zones and channels to discuss ideas, opportunities, and collaborations.`,
  metaTitle: '',
  metaDescription: '',
};
