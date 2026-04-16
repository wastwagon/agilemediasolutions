/** Awsa template copy + structure for /newhomepage (no CMS). Wordmark stays AGILE for this concept. */

export const nh = {
  heroEyebrow: 'STUDIO BASED IN CALIFORNIA',
  heroMark: 'AGILE',
  heroCta: 'Get Started',
  aboutLine: 'Powering Narratives.\nElevating Voices.\nDriving Impact.',
  aboutBody:
    'Agile Media Solutions is an international media, PR, and communications firm helping governments, institutions, brands, and movements shape the messages that move nations, markets, and minds.',
  sectionBlurb:
    'Through years of hands-on experience, we’ve built strong expertise in digital projects, applying clear, efficient methods to deliver high-quality, reliable results at every stage.',

  projects: [
    { title: 'Unleay', tag: 'Branding', coverIndex: 0 },
    { title: 'Natale', tag: 'Branding', coverIndex: 1 },
    { title: 'Veauly', tag: 'Branding', coverIndex: 2 },
    { title: 'Motion Studio', tag: 'Branding', coverIndex: 3 },
  ],

  services: [
    {
      iconIndex: 0,
      title: 'Website Creation',
      line: 'High-performance websites built to convert and scale.',
      bullets: ['Responsive layouts', 'Landing pages', 'Custom visuals & layouts'],
    },
    {
      iconIndex: 1,
      title: 'Brand Identity',
      line: 'Brands designed to stand out and stay memorable.',
      bullets: ['Logo systems & visuals', 'Packaging & brand assets', 'Tone of voice & positioning'],
    },
    {
      iconIndex: 2,
      title: 'Product Design',
      line: 'Interfaces designed for clarity, usability, and flow.',
      bullets: ['Intuitive user journeys', 'Wireframes & prototypes', 'Mobile-first experiences'],
    },
    {
      iconIndex: 3,
      title: 'Social Strategy',
      line: 'Engaging content that builds trust and visibility.',
      bullets: ['Content planning & strategy', 'Ads creatives', 'Profile Optimization'],
    },
    {
      iconIndex: 4,
      title: 'Search Visibility',
      line: 'Data-driven SEO to increase traffic and rankings.',
      bullets: ['Keyword research', 'Technical optimization', 'Authority-building backlinks'],
    },
    {
      iconIndex: 5,
      title: 'Marketing',
      line: 'Story-focused content that drives real results.',
      bullets: ['Promotional', 'Video Ads', 'Explainer content'],
    },
  ],

  testimonials: [
    {
      photoIndex: 0,
      quote:
        'The team is efficient and reliable. They delivered everything they promised. I will definitely hire them again for future projects.',
      attribution: 'Natale Founder',
    },
    {
      photoIndex: 1,
      quote:
        'The team is efficient and reliable. They delivered everything they promised. I will definitely hire them again for future projects.',
      attribution: 'Veauly Founder',
    },
    {
      photoIndex: 2,
      quote:
        'The team is efficient and reliable. They delivered everything they promised. I will definitely hire them again for future projects.',
      attribution: 'Unleay Founder',
    },
  ],

  whyUs: {
    tagline: 'webflow specialists',
    stats: [
      { value: 120, suffix: '+', label: 'Clients worldwide' },
      { value: 98, suffix: '+', label: 'projects delivered' },
      { value: 74, suffix: '', label: 'employees' },
    ],
    ctaTitle: 'Let’s build your next project',
    ctaSub: 'click for contact us',
    ctaHover: 'HOVER CARD',
  },

  awards: [
    { org: 'Pixelcraft Awards', award: 'Best User Experience', year: '2025' },
    { org: 'Codeform Awards', award: 'Front-End Engineering', year: '2024' },
    { org: 'Nexus Awards', award: 'Digital Innovation', year: '2023' },
    { org: 'Lumen Awards', award: 'Excellence in UI/UX', year: '2022' },
    { org: 'Atomic Honors', award: 'Best Performance', year: '2022' },
    { org: 'Digital Awards', award: 'Site of the Year', year: '2020' },
  ],

  teamBio:
    'A designer who blends creativity and strategy to turn bold ideas into meaningful experiences, crafting visuals that not only look good but truly connect with people.',

  team: [
    { photoIndex: 0, name: 'Felipe motive', role: 'the founder' },
    { photoIndex: 1, name: 'María motive', role: 'Creative Lead' },
    { photoIndex: 2, name: 'mara sanchez', role: 'designer' },
  ],

  pricing: [
    {
      theme: 'dark' as const,
      title: 'Subscription',
      price: '$4,899',
      priceNote: '/Monthly',
      blurb:
        'For teams needing on-demand, fast design support. Unlimited requests. One flat fee.',
      features: [
        'One task handled at a time',
        'Ongoing collaboration with expert designers',
        'Quick delivery focused on quality',
        'Endless design tasks as needed',
        'Monthly workload scaled to your needs',
        'Continuous creative oversight',
        'Choose how you stay in touch',
        'Webflow builds included at no cost',
      ],
      buttonClass: 'button whitebutton w-inline-block',
      innerBtnClass: 'btn-76-text',
      wrapClass: 'pricingbackground',
      cardClass: 'card-pricing popular',
      flexClass: 'flex-horizontal start-top dark',
      titleClass: 'main-pricing-title white pop',
      priceWrapClass: 'w-layout-vflex price-tag-under',
      priceNumClass: 'pricingnumber color-white',
      listClass: 'list-item-pricing white',
      textTone: 'white' as const,
    },
    {
      theme: 'light' as const,
      title: 'One page',
      price: '$1,480',
      priceNote: '/One Time',
      blurb: 'For founders who need a full website launched in days, not months. Clear scope Pro.',
      features: [
        'Tailored page structures from scratch',
        'Design aligned to your visual identity',
        'Optimized layouts for every screen',
        'Source files and design documentation',
        'Fast feedback cycles under 48 hours',
        'Refinements until final approval',
        'Extra pages available on request (+$200)',
        'Project-based email assistance',
      ],
      buttonClass: 'button blackbutton w-inline-block',
      innerBtnClass: 'btn-76-text onetimeplan',
      wrapClass: 'w-layout-vflex',
      innerWrapClass: 'pricingbackground _2nd',
      cardClass: 'card-pricing popular',
      flexClass: 'flex-horizontal start-top light',
      titleClass: 'main-pricing-title white pop light',
      priceWrapClass: 'w-layout-vflex price-tag-under white',
      priceNumClass: 'pricingnumber color-white non',
      listClass: 'list-item-pricing',
      textTone: 'dark' as const,
    },
  ],

  faq: [
    {
      q: 'What services do you offer?',
      a: 'We design and build custom websites focused on performance, usability, and visual impact. Our services include UI/UX design, front-end development, Webflow development, motion & interactions, and ongoing optimization.',
    },
    {
      q: 'How long does a typical project take?',
      a: 'Project timelines vary depending on scope and complexity, but most websites are completed within 4 to 8 weeks. Larger or more complex projects may require additional time.',
    },
    {
      q: 'Do you work with custom designs or templates?',
      a: 'We work exclusively with custom-designed solutions. Every project is built from scratch to align with the brand’s identity, goals, and technical needs—no generic templates.',
    },
    {
      q: 'Will my website be optimized for performance and SEO?',
      a: 'Yes. All our websites are built with performance, accessibility, and SEO best practices in mind, ensuring fast load times and strong search engine visibility from day one.',
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
