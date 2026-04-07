'use client';

import { useEffect, useMemo, useState } from 'react';

export type SiteSectionFieldKind =
  | 'text'
  | 'textarea'
  | 'list'
  | 'pairs'
  | 'url'
  | 'image'
  | 'video'
  | 'select';

export type SiteSectionField = {
  id: string;
  label: string;
  /** Optional help shown under the field label in Site Content admin */
  description?: string;
  multiline?: boolean;
  /** When set, overrides id/label heuristics in the admin UI */
  kind?: SiteSectionFieldKind;
  options?: { value: string; label: string }[];
  pairLeftPlaceholder?: string;
  pairRightPlaceholder?: string;
};

export const INSIGHTS_MEDIA_CLASS_OPTIONS: { value: string; label: string }[] = [
  { value: 'home-insights-media-briefing', label: 'Press briefing style' },
  { value: 'home-insights-media-editorial', label: 'Editorial / thought leadership' },
  { value: 'home-insights-media-syndication', label: 'Syndication / distribution' },
];

export type SiteSectionDefinition = {
  key: string;
  title: string;
  description: string;
  fields: SiteSectionField[];
};

export const SITE_SECTION_DEFINITIONS: SiteSectionDefinition[] = [
  {
    key: 'home.events',
    title: 'Homepage Events Block',
    description: 'Edit the homepage events intro and button labels.',
    fields: [
      { id: 'label', label: 'Section label' },
      { id: 'title', label: 'Section title' },
      { id: 'subtitle', label: 'Section subtitle', multiline: true },
      { id: 'linkLabel', label: 'Top-right link label' },
      { id: 'ctaPrimary', label: 'CTA primary label' },
      { id: 'ctaSecondary', label: 'CTA secondary label' },
    ],
  },
  {
    key: 'home.insights',
    title: 'Homepage Insights & Press Room',
    description:
      'Edit the homepage “Insights & Press Room” band: headline, subtitle, links, and button targets. Preview cards are edited under “Insights featured stories”.',
    fields: [
      { id: 'label', label: 'Section label (small caps line)' },
      { id: 'title', label: 'Section title' },
      { id: 'subtitle', label: 'Section subtitle', multiline: true },
      { id: 'linkLabel', label: 'Top-right link label' },
      { id: 'linkHref', label: 'Top-right link URL (e.g. /insights)' },
      { id: 'ctaPrimary', label: 'Primary button label' },
      { id: 'ctaPrimaryHref', label: 'Primary button URL (e.g. /agile-press-group)' },
      { id: 'ctaSecondary', label: 'Secondary button label' },
      { id: 'ctaSecondaryHref', label: 'Secondary button URL (e.g. /insights)' },
    ],
  },
  {
    key: 'home.marquee',
    title: 'Homepage marquees',
    description: 'Two scrolling ticker lines on the homepage. Add one phrase per row.',
    fields: [
      {
        id: 'primaryLines',
        label: 'Primary marquee lines',
        kind: 'list',
      },
      {
        id: 'secondaryLines',
        label: 'Secondary marquee lines',
        kind: 'list',
      },
    ],
  },
  {
    key: 'home.whoWeAre',
    title: 'Homepage — Who we are',
    description: 'About band copy, CTA, and optional image (upload or library).',
    fields: [
      { id: 'label', label: 'Section label' },
      { id: 'title', label: 'Section title' },
      { id: 'body', label: 'Body paragraph', multiline: true },
      { id: 'ctaLabel', label: 'Button text' },
      { id: 'ctaHref', label: 'Button URL', kind: 'url' },
      { id: 'imageUrl', label: 'Section image', kind: 'image' },
    ],
  },
  {
    key: 'home.servicesBand',
    title: 'Homepage — Services band',
    description: 'Headlines above the expandable services list.',
    fields: [
      { id: 'label', label: 'Section label' },
      { id: 'title', label: 'Section title' },
      { id: 'linkLabel', label: 'Top-right link text' },
      { id: 'linkHref', label: 'Top-right link URL', kind: 'url' },
      { id: 'subtitle', label: 'Subtitle', multiline: true },
      { id: 'ctaPrimaryLabel', label: 'Bottom primary button text' },
      { id: 'ctaPrimaryHref', label: 'Bottom primary button URL', kind: 'url' },
      { id: 'ctaSecondaryLabel', label: 'Bottom secondary button text' },
      { id: 'ctaSecondaryHref', label: 'Bottom secondary button URL', kind: 'url' },
    ],
  },
  {
    key: 'home.brandsBand',
    title: 'Homepage — Brands band',
    description: 'Headlines above the brand cards.',
    fields: [
      { id: 'label', label: 'Section label' },
      { id: 'title', label: 'Section title' },
      { id: 'linkLabel', label: 'Top-right link text' },
      { id: 'linkHref', label: 'Top-right link URL', kind: 'url' },
      { id: 'subtitle', label: 'Subtitle', multiline: true },
      { id: 'ctaPrimaryLabel', label: 'Bottom primary button text' },
      { id: 'ctaPrimaryHref', label: 'Bottom primary button URL', kind: 'url' },
      { id: 'ctaSecondaryLabel', label: 'Bottom secondary button text' },
      { id: 'ctaSecondaryHref', label: 'Bottom secondary button URL', kind: 'url' },
    ],
  },
  {
    key: 'home.caseStudiesBand',
    title: 'Homepage — Case studies band',
    description: 'Headlines and CTAs around featured work and the carousel.',
    fields: [
      { id: 'label', label: 'Section label' },
      { id: 'title', label: 'Section title' },
      { id: 'linkLabel', label: 'Top-right link text' },
      { id: 'linkHref', label: 'Top-right link URL', kind: 'url' },
      { id: 'subtitle', label: 'Subtitle', multiline: true },
      { id: 'ctaPrimaryLabel', label: 'Primary button text' },
      { id: 'ctaPrimaryHref', label: 'Primary button URL', kind: 'url' },
      { id: 'ctaSecondaryLabel', label: 'Secondary button text' },
      { id: 'ctaSecondaryHref', label: 'Secondary button URL', kind: 'url' },
    ],
  },
  {
    key: 'home.careersBand',
    title: 'Homepage — Careers band',
    description: 'Join the team strip at the bottom of the homepage.',
    fields: [
      { id: 'label', label: 'Section label' },
      { id: 'title', label: 'Section title' },
      { id: 'subtitle', label: 'Subtitle', multiline: true },
      { id: 'ctaPrimaryLabel', label: 'Primary button text' },
      { id: 'ctaPrimaryHref', label: 'Primary button URL', kind: 'url' },
      { id: 'ctaSecondaryLabel', label: 'Secondary button text' },
      { id: 'ctaSecondaryHref', label: 'Secondary button URL', kind: 'url' },
    ],
  },
  {
    key: 'home.hero',
    title: 'Homepage — Hero (video & chrome)',
    description:
      'Hero slides (rotating headlines) stay under Admin → Pages → Home. Configure kicker, background video (upload or URL), poster frame, main CTA, and social links here.',
    fields: [
      { id: 'kicker', label: 'Kicker line (small text above headline)' },
      {
        id: 'videoSrc',
        label: 'Background video',
        kind: 'video',
      },
      {
        id: 'videoPoster',
        label: 'Video poster (optional)',
        kind: 'image',
        description:
          'Shown only before the first video frame loads. Leave empty for motion-first hero. Do not use the same image as the opening preloader.',
      },
      { id: 'primaryCtaLabel', label: 'Primary button text' },
      { id: 'primaryCtaHref', label: 'Primary button URL', kind: 'url' },
      {
        id: 'socialLinks',
        label: 'Social links (rail)',
        kind: 'pairs',
        pairLeftPlaceholder: 'e.g. Facebook',
        pairRightPlaceholder: 'https://…',
      },
    ],
  },
  {
    key: 'layout.preloader',
    title: 'Opening splash (preloader)',
    description:
      'Full-screen image shown briefly when the homepage first loads. Upload in Media Library or use a path under /images/…',
    fields: [
      {
        id: 'splashImage',
        label: 'Splash image',
        kind: 'image',
        description: 'Recommended: wide WebP or JPG (e.g. 1920×1080). Shown until the fade-out.',
      },
      {
        id: 'displayDurationMs',
        label: 'Minimum display time (milliseconds)',
        description: 'How long the splash stays visible before fading (400–8000). Default 1200.',
      },
    ],
  },
  {
    key: 'layout.topBar',
    title: 'Top bar',
    description:
      'Thin bar above the main header: email, contact link, and social icon links. The same four URLs are used in the mobile menu (hamburger) footer.',
    fields: [
      { id: 'email', label: 'Email address (shown and used for mailto)' },
      { id: 'contactLabel', label: 'Contact link text' },
      { id: 'contactHref', label: 'Contact link URL', kind: 'url' },
      { id: 'facebookUrl', label: 'Facebook URL', kind: 'url' },
      { id: 'twitterUrl', label: 'X / Twitter URL', kind: 'url' },
      { id: 'instagramUrl', label: 'Instagram URL', kind: 'url' },
      { id: 'linkedinUrl', label: 'LinkedIn URL', kind: 'url' },
      { id: 'youtubeUrl', label: 'YouTube URL', kind: 'url' },
    ],
  },
  {
    key: 'layout.footer',
    title: 'Footer',
    description:
      'Footer columns, newsletter copy, copyright line, and the four social icons at the bottom. Keep these URLs aligned with Top bar unless you intentionally want different footer links.',
    fields: [
      { id: 'impactText', label: 'Large impact word(s)' },
      { id: 'brandingCopy', label: 'Blurb under logo', multiline: true },
      { id: 'newsletterHeading', label: 'Newsletter column heading' },
      { id: 'newsletterBody', label: 'Newsletter intro', multiline: true },
      { id: 'copyrightEntity', label: 'Copyright entity name' },
      { id: 'col1Heading', label: 'Column 1 heading' },
      { id: 'col1Links', label: 'Column 1 links', kind: 'pairs', pairLeftPlaceholder: 'Link text', pairRightPlaceholder: '/path' },
      { id: 'col2Heading', label: 'Column 2 heading' },
      { id: 'col2Links', label: 'Column 2 links', kind: 'pairs' },
      { id: 'col3Heading', label: 'Column 3 heading' },
      { id: 'col3Links', label: 'Column 3 links', kind: 'pairs' },
      { id: 'col4Heading', label: 'Column 4 heading' },
      { id: 'col4Links', label: 'Column 4 links', kind: 'pairs' },
      { id: 'facebookUrl', label: 'Facebook URL', kind: 'url' },
      { id: 'instagramUrl', label: 'Instagram URL', kind: 'url' },
      { id: 'xUrl', label: 'X (Twitter) URL', kind: 'url' },
      { id: 'linkedinUrl', label: 'LinkedIn URL', kind: 'url' },
      { id: 'youtubeUrl', label: 'YouTube URL', kind: 'url' },
    ],
  },
  {
    key: 'services.page',
    title: 'Services Page',
    description: 'Edit hero and intro copy on the Services page.',
    fields: [
      { id: 'heroLabel', label: 'Hero label' },
      { id: 'heroTitle', label: 'Hero title', multiline: true },
      { id: 'heroIntro', label: 'Hero intro', multiline: true },
      { id: 'heroSubIntro', label: 'Hero sub-intro', multiline: true },
      { id: 'sectionLabel', label: 'Section label' },
      { id: 'sectionTitle', label: 'Section title' },
      { id: 'sectionSubtitle', label: 'Section subtitle', multiline: true },
    ],
  },
  {
    key: 'brands.page',
    title: 'Brands Page',
    description: 'Edit hero, section, and call-to-action copy on the Brands page.',
    fields: [
      { id: 'heroLabel', label: 'Hero label' },
      { id: 'heroTitle', label: 'Hero title', multiline: true },
      { id: 'heroIntro', label: 'Hero intro', multiline: true },
      { id: 'heroSubIntro', label: 'Hero sub-intro', multiline: true },
      { id: 'sectionLabel', label: 'Section label' },
      { id: 'sectionTitle', label: 'Section title' },
      { id: 'sectionLinkLabel', label: 'Section link label' },
      { id: 'outro', label: 'Outro paragraph', multiline: true },
      { id: 'ctaPrimary', label: 'CTA primary label' },
      { id: 'ctaSecondary', label: 'CTA secondary label' },
      { id: 'ctaTertiary', label: 'CTA tertiary label' },
    ],
  },
  {
    key: 'signature-events.page',
    title: 'Signature Events Page',
    description: 'Edit hero, section titles, and action labels on the events page.',
    fields: [
      { id: 'heroLabel', label: 'Hero label' },
      { id: 'heroTitle', label: 'Hero title', multiline: true },
      { id: 'heroIntro', label: 'Hero intro', multiline: true },
      { id: 'heroSubIntro', label: 'Hero sub-intro', multiline: true },
      { id: 'sectionLabel', label: 'Section label' },
      { id: 'sectionTitle', label: 'Section title' },
      { id: 'sectionLinkLabel', label: 'Section link label' },
      { id: 'ctaPrimary', label: 'CTA primary label' },
      { id: 'ctaSecondary', label: 'CTA secondary label' },
    ],
  },
  {
    key: 'case-studies.page',
    title: 'Case Studies Page',
    description: 'Edit key headings and call-to-action labels for case studies.',
    fields: [
      { id: 'heroLabel', label: 'Hero label' },
      { id: 'heroTitle', label: 'Hero title', multiline: true },
      { id: 'heroIntro', label: 'Hero intro', multiline: true },
      { id: 'heroSubIntro', label: 'Hero sub-intro', multiline: true },
      { id: 'showcaseLabel', label: 'Showcase section label' },
      { id: 'showcaseTitle', label: 'Showcase section title' },
      { id: 'highlightsLabel', label: 'Highlights section label' },
      { id: 'highlightsTitle', label: 'Highlights section title' },
      { id: 'highlightsSubtitle', label: 'Highlights subtitle', multiline: true },
      { id: 'finalSubtitle', label: 'Final subtitle', multiline: true },
      { id: 'ctaPrimary', label: 'Final CTA primary label' },
      { id: 'ctaSecondary', label: 'Final CTA secondary label' },
    ],
  },
  {
    key: 'about.page',
    title: 'About Page',
    description: 'Edit hero, identity, and presence copy on the About page.',
    fields: [
      { id: 'heroLabel', label: 'Hero label' },
      { id: 'heroTitle', label: 'Hero title', multiline: true },
      { id: 'heroTagline', label: 'Hero tagline', multiline: true },
      { id: 'identityLabel', label: 'Identity label' },
      { id: 'identityTitle', label: 'Identity title' },
      { id: 'identityP1', label: 'Identity paragraph 1', multiline: true },
      { id: 'identityP2', label: 'Identity paragraph 2', multiline: true },
      { id: 'ctaPrimary', label: 'CTA primary label' },
      { id: 'ctaSecondary', label: 'CTA secondary label' },
      { id: 'presenceLabel', label: 'Presence label' },
      { id: 'presenceTitle', label: 'Presence title' },
      { id: 'presenceSubtitle', label: 'Presence subtitle', multiline: true },
    ],
  },
  {
    key: 'partnerships.page',
    title: 'Partnerships Page',
    description: 'Edit hero, section headings, cards, and CTA strip copy.',
    fields: [
      { id: 'heroLabel', label: 'Hero label' },
      { id: 'heroTitle', label: 'Hero title', multiline: true },
      { id: 'heroIntro', label: 'Hero intro', multiline: true },
      { id: 'heroSubIntro', label: 'Hero sub-intro', multiline: true },
      { id: 'sectionLabel', label: 'Section label' },
      { id: 'sectionTitle', label: 'Section title' },
      { id: 'sectionLinkLabel', label: 'Section link label' },
      { id: 'typesHeading', label: 'Types heading' },
      { id: 'typesCards', label: 'Types cards', multiline: true },
      { id: 'partnerWithUsHeading', label: 'Partner-with-us heading' },
      { id: 'partnerWithUsList', label: 'Partner-with-us list', multiline: true },
      { id: 'valuesHeading', label: 'Values heading' },
      { id: 'valuesList', label: 'Values list', multiline: true },
      { id: 'ctaStripText', label: 'CTA strip text' },
      { id: 'ctaPrimary', label: 'CTA primary label' },
      { id: 'ctaSecondary', label: 'CTA secondary label' },
      { id: 'ctaTertiary', label: 'CTA tertiary label' },
    ],
  },
  {
    key: 'contact.page',
    title: 'Contact Page',
    description: 'Edit hero, contact cards, and major CTA labels on the Contact page.',
    fields: [
      { id: 'heroLabel', label: 'Hero label' },
      { id: 'heroTitle', label: 'Hero title', multiline: true },
      { id: 'heroIntro', label: 'Hero intro', multiline: true },
      { id: 'heroSubIntro', label: 'Hero sub-intro', multiline: true },
      { id: 'connectionsLabel', label: 'Connections label' },
      { id: 'connectionsTitle', label: 'Connections title' },
      { id: 'connectionsLinkLabel', label: 'Connections link label' },
      { id: 'quickBriefLabel', label: 'Quick brief label' },
      { id: 'quickBriefTitle', label: 'Quick brief title' },
      { id: 'quickBriefSubtitle', label: 'Quick brief subtitle', multiline: true },
      { id: 'generalCardTitle', label: 'General inquiries card title' },
      { id: 'generalEmail', label: 'General inquiries email' },
      {
        id: 'generalPhoneLabel',
        label: 'Phone / WhatsApp label',
        description: 'e.g. Phone / WhatsApp (colon added in layout before the number link).',
      },
      { id: 'generalPhoneDisplay', label: 'Phone / WhatsApp number (link text)' },
      { id: 'generalPhoneHref', label: 'Phone / WhatsApp link URL', kind: 'url', description: 'Usually https://wa.me/… or tel:+233…' },
      { id: 'generalHours', label: 'General inquiries hours' },
      {
        id: 'generalHeadOffice',
        label: 'General inquiries address (head office)',
        description: 'Full street address shown on the Contact page under “Address”.',
      },
      { id: 'generalLocations', label: 'General inquiries additional locations' },
      { id: 'consultationCardTitle', label: 'Consultation card title' },
      { id: 'consultationCardBody', label: 'Consultation card body', multiline: true },
      { id: 'pressCardTitle', label: 'Press card title' },
      { id: 'pressCardBody', label: 'Press card body', multiline: true },
      { id: 'pressCardCta', label: 'Press card CTA label' },
      { id: 'followTitle', label: 'Follow title' },
      { id: 'followSubtitle', label: 'Follow subtitle', multiline: true },
      { id: 'socialCta', label: 'Social CTA label' },
      { id: 'finalSubtitle', label: 'Final subtitle', multiline: true },
      { id: 'finalCta', label: 'Final CTA label' },
    ],
  },
  {
    key: 'careers.page',
    title: 'Careers Page',
    description: 'Edit hero, lists, opportunity cards, and CTA strip copy.',
    fields: [
      { id: 'heroLabel', label: 'Hero label' },
      { id: 'heroTitle', label: 'Hero title', multiline: true },
      { id: 'heroIntro', label: 'Hero intro', multiline: true },
      { id: 'heroSubIntro', label: 'Hero sub-intro', multiline: true },
      { id: 'whyHeading', label: 'Why work heading' },
      { id: 'whyList', label: 'Why-work list', multiline: true },
      { id: 'whoHeading', label: 'Who we are looking for heading' },
      { id: 'whoIntro', label: 'Who-intro text', multiline: true },
      { id: 'whoList', label: 'Who list', multiline: true },
      { id: 'opportunitiesHeading', label: 'Opportunities heading' },
      { id: 'opportunityCards', label: 'Opportunity cards', multiline: true },
      { id: 'cultureHeading', label: 'Culture heading' },
      { id: 'cultureList', label: 'Culture list', multiline: true },
      { id: 'ctaStripText', label: 'CTA strip text' },
      { id: 'ctaPrimary', label: 'CTA primary label' },
      { id: 'ctaSecondary', label: 'CTA secondary label' },
      { id: 'ctaTertiary', label: 'CTA tertiary label' },
    ],
  },
  {
    key: 'insights.page',
    title: 'Insights Page',
    description: 'Edit hero, insight cards, and final subscription copy.',
    fields: [
      { id: 'heroLabel', label: 'Hero label' },
      { id: 'heroTitle', label: 'Hero title', multiline: true },
      { id: 'heroTagline', label: 'Hero tagline', multiline: true },
      { id: 'sectionLabel', label: 'Section label' },
      { id: 'sectionTitle', label: 'Section title' },
      { id: 'sectionLinkLabel', label: 'Section link label' },
      { id: 'insightsHeading', label: 'Insights card heading' },
      { id: 'insightsLead', label: 'Insights lead sentence' },
      { id: 'insightsBody', label: 'Insights body text', multiline: true },
      { id: 'insightsBullets', label: 'Insights bullets', multiline: true },
      { id: 'insightsCtaPrimary', label: 'Insights CTA primary label' },
      { id: 'insightsCtaSecondary', label: 'Insights CTA secondary label' },
      { id: 'pressHeading', label: 'Press card heading' },
      { id: 'pressLead', label: 'Press lead sentence' },
      { id: 'pressBody', label: 'Press body text', multiline: true },
      { id: 'pressBullets', label: 'Press bullets', multiline: true },
      { id: 'pressCtaPrimary', label: 'Press CTA primary label' },
      { id: 'pressCtaSecondary', label: 'Press CTA secondary label' },
      { id: 'pressCtaTertiary', label: 'Press CTA tertiary label' },
      { id: 'supportHeading', label: 'Support card heading' },
      { id: 'supportBody', label: 'Support card body', multiline: true },
      { id: 'supportCtaPrimary', label: 'Support CTA primary label' },
      { id: 'supportCtaSecondary', label: 'Support CTA secondary label' },
      { id: 'finalSubtitle', label: 'Final subtitle', multiline: true },
      { id: 'finalCta', label: 'Final CTA label' },
    ],
  },
  {
    key: 'insights.featured',
    title: 'Insights featured stories (fallback)',
    description:
      'Used only when there are no published posts in Admin → Insights. Otherwise manage posts under Insights in the sidebar. Three card slots: homepage preview (first 3 by order), Insights page grid, and /insights/[slug] articles. URL-safe slugs; optional image URL overrides the gradient placeholder.',
    fields: [
      { id: 'readCtaLabel', label: 'Card link label (e.g. Read more →)' },
      { id: 'card1Slug', label: 'Card 1 — URL slug (e.g. trade-policy-briefing-q1)' },
      { id: 'card1Meta', label: 'Card 1 — meta / kicker line' },
      { id: 'card1Title', label: 'Card 1 — title' },
      { id: 'card1Excerpt', label: 'Card 1 — excerpt', multiline: true },
      {
        id: 'card1MediaClass',
        label: 'Card 1 — placeholder style (if no image)',
        kind: 'select',
        options: INSIGHTS_MEDIA_CLASS_OPTIONS,
      },
      { id: 'card1ImageUrl', label: 'Card 1 — image URL (optional)' },
      { id: 'card1Body', label: 'Card 1 — full article body', multiline: true },
      { id: 'card2Slug', label: 'Card 2 — URL slug' },
      { id: 'card2Meta', label: 'Card 2 — meta / kicker line' },
      { id: 'card2Title', label: 'Card 2 — title' },
      { id: 'card2Excerpt', label: 'Card 2 — excerpt', multiline: true },
      {
        id: 'card2MediaClass',
        label: 'Card 2 — placeholder style (if no image)',
        kind: 'select',
        options: INSIGHTS_MEDIA_CLASS_OPTIONS,
      },
      { id: 'card2ImageUrl', label: 'Card 2 — image URL (optional)' },
      { id: 'card2Body', label: 'Card 2 — full article body', multiline: true },
      { id: 'card3Slug', label: 'Card 3 — URL slug' },
      { id: 'card3Meta', label: 'Card 3 — meta / kicker line' },
      { id: 'card3Title', label: 'Card 3 — title' },
      { id: 'card3Excerpt', label: 'Card 3 — excerpt', multiline: true },
      {
        id: 'card3MediaClass',
        label: 'Card 3 — placeholder style (if no image)',
        kind: 'select',
        options: INSIGHTS_MEDIA_CLASS_OPTIONS,
      },
      { id: 'card3ImageUrl', label: 'Card 3 — image URL (optional)' },
      { id: 'card3Body', label: 'Card 3 — full article body', multiline: true },
    ],
  },
  {
    key: 'studio.page',
    title: 'Studio Page',
    description:
      'Edit hero, highlights, clients copy, and CTAs. The “What We Do” cards are managed under Admin → Studio cards.',
    fields: [
      { id: 'heroLabel', label: 'Hero label' },
      { id: 'heroTitle', label: 'Hero title', multiline: true },
      { id: 'heroIntro', label: 'Hero intro', multiline: true },
      { id: 'heroSubIntro', label: 'Hero sub-intro', multiline: true },
      { id: 'sectionLabel', label: 'Section label' },
      { id: 'sectionTitle', label: 'Section title' },
      { id: 'sectionLinkLabel', label: 'Section link label' },
      { id: 'highlightsHeading', label: 'Highlights heading' },
      { id: 'highlightsList', label: 'Highlights list', multiline: true },
      { id: 'clientsHeading', label: 'Clients heading' },
      { id: 'clientsSubtitle', label: 'Clients subtitle', multiline: true },
      { id: 'ctaPrimary', label: 'CTA primary label' },
      { id: 'ctaSecondary', label: 'CTA secondary label' },
      { id: 'ctaTertiary', label: 'CTA tertiary label' },
    ],
  },
  {
    key: 'digital-engagement.page',
    title: 'Digital Engagement Page',
    description:
      'Edit hero, section intro, headings, and CTAs. Offering cards (with optional bullet lists) are under Admin → Digital Engagement.',
    fields: [
      { id: 'heroLabel', label: 'Hero label' },
      { id: 'heroTitle', label: 'Hero title', multiline: true },
      { id: 'heroIntro', label: 'Hero intro', multiline: true },
      { id: 'heroSubIntro', label: 'Hero sub-intro', multiline: true },
      { id: 'sectionLabel', label: 'Section label' },
      { id: 'sectionTitle', label: 'Section title' },
      { id: 'sectionLinkLabel', label: 'Section link label' },
      { id: 'sectionIntro', label: 'Section intro', multiline: true },
      { id: 'offeringsHeading', label: 'Offerings heading' },
      { id: 'ctaHeading', label: 'CTA heading' },
      { id: 'ctaText', label: 'CTA text', multiline: true },
      { id: 'ctaPrimary', label: 'CTA primary label' },
      { id: 'ctaSecondary', label: 'CTA secondary label' },
      { id: 'ctaTertiary', label: 'CTA tertiary label' },
    ],
  },
  {
    key: 'agile-press-group.page',
    title: 'Agile Press Group Page',
    description: 'Edit hero, section content, lists, and final CTA labels.',
    fields: [
      { id: 'heroLabel', label: 'Hero label' },
      { id: 'heroTitle', label: 'Hero title', multiline: true },
      { id: 'heroIntro', label: 'Hero intro', multiline: true },
      { id: 'heroSubIntro', label: 'Hero sub-intro', multiline: true },
      { id: 'sectionLabel', label: 'Section label' },
      { id: 'sectionTitle', label: 'Section title' },
      { id: 'sectionLinkLabel', label: 'Section link label' },
      { id: 'visionHeading', label: 'Editorial vision heading' },
      { id: 'visionList', label: 'Editorial vision list', multiline: true },
      { id: 'flagshipHeading', label: 'Flagship publications heading' },
      { id: 'flagshipList', label: 'Flagship publications list', multiline: true },
      { id: 'publishingServicesHeading', label: 'Publishing services heading' },
      { id: 'publishingServicesIntro', label: 'Publishing services intro', multiline: true },
      { id: 'publishingServicesIncludesLabel', label: 'Publishing includes label' },
      { id: 'publishingServicesIncludesList', label: 'Publishing includes list', multiline: true },
      { id: 'customPublishingHeading', label: 'Custom publishing heading' },
      { id: 'customPublishingIntro', label: 'Custom publishing intro', multiline: true },
      { id: 'customPublishingExamplesLabel', label: 'Custom publishing examples label' },
      { id: 'customPublishingExamplesList', label: 'Custom publishing examples list', multiline: true },
      { id: 'syndicationHeading', label: 'Syndication heading' },
      { id: 'syndicationIntro', label: 'Syndication intro', multiline: true },
      { id: 'syndicationCountries', label: 'Syndication countries line', multiline: true },
      { id: 'signatureProductsHeading', label: 'Signature products heading' },
      { id: 'signatureProductsList', label: 'Signature products list', multiline: true },
      { id: 'signatureProductsOutro', label: 'Signature products outro', multiline: true },
      { id: 'contributorHeading', label: 'Contributor heading' },
      { id: 'contributorIntro', label: 'Contributor intro', multiline: true },
      { id: 'contributorCtaPrimary', label: 'Contributor CTA primary label' },
      { id: 'contributorCtaSecondary', label: 'Contributor CTA secondary label' },
      { id: 'exchangeHeading', label: 'Content exchange heading' },
      { id: 'exchangeIntro', label: 'Content exchange intro', multiline: true },
      { id: 'exchangeCta', label: 'Content exchange CTA label' },
      { id: 'trainingHeading', label: 'Training heading' },
      { id: 'trainingIntro', label: 'Training intro', multiline: true },
      { id: 'trainingOfferingsLabel', label: 'Training offerings label' },
      { id: 'trainingOfferingsList', label: 'Training offerings list', multiline: true },
      { id: 'finalHeading', label: 'Final heading' },
      { id: 'finalText', label: 'Final text', multiline: true },
      { id: 'ctaPrimary', label: 'CTA primary label' },
      { id: 'ctaSecondary', label: 'CTA secondary label' },
      { id: 'ctaTertiary', label: 'CTA tertiary label' },
      { id: 'ctaQuaternary', label: 'CTA quaternary label' },
    ],
  },
  {
    key: 'sectors.page',
    title: 'Sectors Page',
    description: 'Edit hero, section intro, and CTA copy on the Sectors page.',
    fields: [
      { id: 'heroLabel', label: 'Hero label' },
      { id: 'heroTitle', label: 'Hero title', multiline: true },
      { id: 'heroTagline', label: 'Hero tagline', multiline: true },
      { id: 'sectionLabel', label: 'Section label' },
      { id: 'sectionTitle', label: 'Section title' },
      { id: 'sectionLinkLabel', label: 'Section link label' },
      { id: 'sectionIntro', label: 'Section intro', multiline: true },
      { id: 'ctaPrimary', label: 'CTA primary label' },
      { id: 'ctaSecondary', label: 'CTA secondary label' },
    ],
  },
];

/** Newline-separated list values from Site Content (list fields). */
export function parseSiteContentLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export type SiteContentPairRow = { left: string; right: string };

/** `Label :: URL` rows from Site Content (pairs fields). */
export function parseSiteContentPairs(value: string): SiteContentPairRow[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [left, ...rest] = line.split('::');
      return {
        left: (left || '').trim(),
        right: rest.join('::').trim(),
      };
    })
    .filter((row) => row.left || row.right);
}

type SiteSectionsMap = Record<string, Record<string, string>>;

let publicSiteSectionsCache: SiteSectionsMap | null = null;
let publicSiteSectionsInflight: Promise<SiteSectionsMap> | null = null;

async function fetchPublicSiteSections(): Promise<SiteSectionsMap> {
  if (publicSiteSectionsCache) return publicSiteSectionsCache;
  if (publicSiteSectionsInflight) return publicSiteSectionsInflight;
  publicSiteSectionsInflight = fetch('/api/public/site-sections')
    .then((res) => (res.ok ? res.json() : {}))
    .then((data) => {
      const value = data && typeof data === 'object' ? (data as SiteSectionsMap) : {};
      publicSiteSectionsCache = value;
      return value;
    })
    .catch(() => ({} as SiteSectionsMap))
    .finally(() => {
      publicSiteSectionsInflight = null;
    });
  return publicSiteSectionsInflight;
}

export function useSiteSectionContent<T extends Record<string, string>>(
  sectionKey: string,
  defaults: T
): T {
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    fetchPublicSiteSections().then((all) => {
      if (!mounted) return;
      const value = all?.[sectionKey];
      setOverrides(value && typeof value === 'object' ? value : {});
    });
    return () => {
      mounted = false;
    };
  }, [sectionKey]);

  return useMemo(() => {
    const next: Record<string, string> = { ...defaults };
    Object.keys(defaults).forEach((k) => {
      const v = overrides[k];
      if (typeof v === 'string' && v.trim()) next[k] = v;
    });
    return next as T;
  }, [defaults, overrides]);
}
