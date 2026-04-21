/** Awsa template copy + structure for /newhomepage (no CMS). Wordmark stays AGILE for this concept. */

export const nh = {
  heroEyebrow: 'CREATIVE COMMUNICATIONS STUDIO',
  heroMark: 'AGILE',
  heroCta: 'Explore our Brands',
  sectionBlurb:
    'Through years of hands-on experience, we’ve built strong expertise in digital projects, applying clear, efficient methods to deliver high-quality, reliable results at every stage.',

  servicesBlurb:
    'Comprehensive Communications Solutions. Strategically Designed. Precisely Delivered.',

  projects: [
    { title: 'Unleay', tag: 'Branding', coverIndex: 0 },
    { title: 'Natale', tag: 'Branding', coverIndex: 1 },
    { title: 'Veauly', tag: 'Branding', coverIndex: 2 },
    { title: 'Motion Studio', tag: 'Branding', coverIndex: 3 },
  ],

  /** Live campaign carousel — paired with FAQ + aside in `NewHomePageClient`. */
  campaignHighlights: {
    kicker: 'LIVE CAMPAIGN HIGHLIGHTS',
    helper: 'Swipe, drag, or use arrows to explore',
    ctaCase: { label: 'See Case Studies →', href: '/case-studies' },
    ctaStart: { label: 'Start a Project', href: '#Contact' },
    /** Square aside buttons (labels only; hrefs reuse ctaCase / ctaStart). */
    squareCaseLabel: 'See case studies',
    squareStartLabel: 'Start projects',
    items: [
      {
        client: 'MINISTRY OF TRADE',
        title: 'Public Sector Narrative Strategy',
        body: 'Developed an integrated communication framework for a Ministry of Trade to align investor attraction, policy messaging, and AfCFTA visibility.',
        coverIndex: 0,
      },
      {
        client: 'AFRICA SPORTZ',
        title: 'Creative Launch Campaign – Africa Sportz',
        body: 'Produced a youth-driven media activation to launch a new pan-African digital sports brand with over 1 million social media impressions in the first 60 days.',
        coverIndex: 1,
      },
      {
        client: 'AFRICA TRADE SUMMIT',
        title: 'Summit Media Strategy – Africa Trade Summit',
        body: 'Delivered full press management, real-time coverage, and speaker coaching for a two-day high-level summit involving four heads of state and 500+ delegates.',
        coverIndex: 2,
      },
      {
        client: 'GLOBAL GHANA WEEK',
        title: 'Diaspora Engagement Initiative',
        body: 'Created a cross-platform communications campaign reconnecting diaspora audiences with trade, culture, and civic narratives ahead of a flagship national week.',
        coverIndex: 3,
      },
    ],
  },

  /** Aligned with main `/services` static grid (`DOCUMENT_SERVICES` in `ServicesPageClient.tsx`). */
  services: [
    {
      iconIndex: 0,
      title: 'Strategic Communications & Narrative Building',
      line:
        'We develop tailored messaging frameworks, storytelling strategies, and communication blueprints that align with your institutional goals and public identity.',
      bullets: ['Message mapping', 'Speechwriting', 'Narrative architecture & positioning strategies'],
    },
    {
      iconIndex: 1,
      title: 'Media Relations & Reputation Management',
      line:
        'We help you build and sustain public trust by managing perception, cultivating media relationships, and preparing for both visibility and scrutiny.',
      bullets: ['Press engagement', 'Media training', 'Crisis response & reputation recovery'],
    },
    {
      iconIndex: 2,
      title: 'Campaigns, Advocacy & Stakeholder Engagement',
      line:
        'We design high-impact campaigns that mobilize audiences, shift public opinion, and influence policy or behavior.',
      bullets: ['Advocacy communications', 'Civic mobilization', 'Stakeholder mapping & coalition engagement'],
    },
    {
      iconIndex: 3,
      title: 'Digital, Social & Multimedia Communications',
      line:
        'We deliver digital-first communications across platforms—combining content strategy, design, and audience analytics for sustained engagement.',
      bullets: ['Social media strategy', 'Influencer integration', 'Video content & community management'],
    },
    {
      iconIndex: 4,
      title: 'Branding, Design & Identity Systems',
      line:
        'We build powerful brand identities that reflect your vision and connect meaningfully with your audience.',
      bullets: ['Visual identity', 'Brand messaging', 'Institutional rebranding & graphic design'],
    },
    {
      iconIndex: 5,
      title: 'Event Media & Summit Support',
      line:
        'We provide complete media support for events—from press handling and content creation to live coverage and post-event promotion.',
      bullets: ['Media kits', 'Live production', 'Speaker preparation & summit communications'],
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
