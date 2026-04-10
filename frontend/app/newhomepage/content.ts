/** Static English copy for /newhomepage (no CMS). */

export const nh = {
  heroEyebrow: 'MEDIA · PR · INSTITUTIONS',
  heroMark: 'AGILE',
  heroCta: 'Get started',
  aboutLine:
    'Agile Media Solutions shapes narratives for governments, institutions, and brands across Africa and beyond.',
  sectionBlurb:
    'Focused teams, clear process, and outcomes built for complex stakeholder environments.',

  projects: [
    { title: 'Insights', tag: 'Editorial' },
    { title: 'Studio', tag: 'Creative' },
    { title: 'Brands', tag: 'Identity' },
    { title: 'Signature events', tag: 'Experiences' },
  ],

  services: [
    {
      title: 'Strategic communications',
      line: 'Positioning and narrative for high-stakes moments.',
      bullets: ['Crisis-ready messaging', 'Stakeholder mapping', 'Executive counsel'],
    },
    {
      title: 'Media relations',
      line: 'Coverage that supports credibility and reach.',
      bullets: ['Press office', 'Briefings', 'Desk-side relationships'],
    },
    {
      title: 'Digital engagement',
      line: 'Channels that move audiences to action.',
      bullets: ['Campaign architecture', 'Content systems', 'Measurement'],
    },
    {
      title: 'Issues & policy',
      line: 'Clear language for regulation and reform.',
      bullets: ['White papers', 'Multilingual rollout', 'Coalition comms'],
    },
    {
      title: 'Events & staging',
      line: 'Moments that land with press and partners.',
      bullets: ['Run-of-show', 'Broadcast support', 'VIP programmes'],
    },
    {
      title: 'Partnerships',
      line: 'Align brands with trusted platforms.',
      bullets: ['Sponsorship narrative', 'Co-marketing', 'Reporting'],
    },
  ],

  testimonials: [
    {
      quote: 'Clear, calm, and relentless on detail — exactly what we needed for a multi-country launch.',
      name: 'Programme lead',
      org: 'Regional institution',
    },
    {
      quote: 'They turned a dense policy story into something journalists actually wanted to cover.',
      name: 'Communications director',
      org: 'Public agency',
    },
    {
      quote: 'Our leadership team finally had one coherent storyline across every channel.',
      name: 'Chief of staff',
      org: 'Corporate brand',
    },
  ],

  whyUs: {
    tagline: 'Communications built for complexity.',
    stats: [
      { value: 25, suffix: '+', label: 'Markets engaged' },
      { value: 120, suffix: '+', label: 'Campaigns delivered' },
      { value: 40, suffix: '+', label: 'Specialists' },
    ],
    ctaTitle: 'Start a conversation',
    ctaSub: 'Tell us what you are building next',
    ctaHover: 'HOVER CARD',
  },

  awards: [
    { org: 'African PR', award: 'Campaign excellence', year: '2024' },
    { org: 'Industry forum', award: 'Best stakeholder programme', year: '2023' },
    { org: 'Press club', award: 'Issues communication', year: '2023' },
    { org: 'Digital council', award: 'Integrated launch', year: '2022' },
    { org: 'Civic awards', award: 'Public information', year: '2022' },
    { org: 'Summit', award: 'Event of the year', year: '2021' },
  ],

  team: [
    {
      name: 'Lead strategist',
      role: 'Founding partner',
      bio: 'Builds narrative arcs for institutions under pressure — calm process, sharp outcomes.',
    },
    {
      name: 'Editorial director',
      role: 'Content & insights',
      bio: 'Turns complex policy and data into stories editors and audiences trust.',
    },
    {
      name: 'Studio head',
      role: 'Creative & digital',
      bio: 'Unifies film, stage, and digital so every touchpoint feels like one brand.',
    },
  ],

  pricing: [
    {
      name: 'Advisory sprint',
      price: 'From $18k',
      blurb: 'Two-week narrative + channel plan for a defined moment.',
      features: ['Stakeholder interviews', 'Messaging house', '72h crisis sketch'],
    },
    {
      name: 'Campaign retainer',
      price: 'From $35k / mo',
      blurb: 'Embedded team for launches, issues, and press office rhythm.',
      features: ['Weekly war-room', 'Desk outreach', 'Reporting pack'],
      featured: true,
    },
    {
      name: 'Signature build',
      price: 'Scope-based',
      blurb: 'Event + broadcast + digital for flagship moments.',
      features: ['Run-of-show', 'Crew & staging', 'Content capture'],
    },
  ],

  faq: [
    {
      q: 'What services do you offer?',
      a: 'Strategic communications, media relations, digital engagement, issues work, events, and partnerships — as integrated programmes or focused sprints.',
    },
    {
      q: 'How long does a typical project take?',
      a: 'Sprints begin in days; sustained campaigns usually run 8–16 weeks depending on markets, approvals, and languages involved.',
    },
    {
      q: 'Do you work with custom programmes or templates?',
      a: 'Every mandate is bespoke. We reuse proven frameworks internally, but external deliverables are tailored to your institution and risk profile.',
    },
    {
      q: 'Will work be optimised for performance and clarity?',
      a: 'Yes — we design for accessibility, fast publishing workflows, and measurable reach from day one.',
    },
  ],
} as const;

export const nhMarqueeLogos = [
  '/images/sectors/sector-01.svg',
  '/images/sectors/sector-02.svg',
  '/images/sectors/sector-03.svg',
  '/images/digital/offering-01.svg',
  '/images/digital/offering-02.svg',
  '/images/studio/offering-01.svg',
  '/images/studio/offering-02.svg',
  '/images/sectors/sector-04.svg',
] as const;

export const nhHeroImage = '/images/opening-launch.webp';
