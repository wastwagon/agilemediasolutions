/**
 * Document-aligned CMS seeds (idempotent: skips rows that already exist by name/title).
 */

const HOME_TITLE = 'Agile Media Solutions | Communications & media';
const HOME_DESCRIPTION =
  'Agile Media Solutions is an international media, PR, and communications firm helping governments, institutions, brands, and movements shape the messages that move nations, markets, and minds.';

const HOME_CONTENT_JSON = {
  hero_slides: [
    {
      title: 'Powering Narratives. Elevating Voices. Driving Impact.',
      subtitle: HOME_DESCRIPTION,
    },
  ],
};

const CMS_PAGE_SEEDS = [
  { slug: 'about', title: 'About', description: 'Who we are and what we stand for.' },
  { slug: 'services', title: 'Services', description: 'Our communication and media services.' },
  { slug: 'sectors', title: 'Sectors', description: 'Sectors we support across Africa and beyond.' },
  { slug: 'brands', title: 'Brands', description: 'Explore our media and publishing brands.' },
  { slug: 'signature-events', title: 'Signature Events', description: 'Events and summits powered by Agile Media.' },
  { slug: 'studio', title: 'Studio', description: 'Creative production, design, and content studio.' },
  { slug: 'case-studies', title: 'Case Studies', description: 'Selected outcomes and client impact stories.' },
  { slug: 'insights', title: 'Insights', description: 'Ideas, trends, and strategic communication perspectives.' },
  { slug: 'agile-press-group', title: 'Agile Press Group', description: 'Our publishing and media ecosystem.' },
  { slug: 'digital-engagement', title: 'Digital Engagement', description: 'Digital strategy and audience engagement services.' },
  { slug: 'partnerships', title: 'Partnerships', description: 'Collaborations and strategic partnerships.' },
  { slug: 'careers', title: 'Careers', description: 'Join our growing team.' },
  { slug: 'contact', title: 'Contact', description: 'Get in touch with Agile Media Solutions.' },
  { slug: 'privacy', title: 'Privacy Policy', description: 'How we collect and use your data.' },
  { slug: 'terms', title: 'Terms of Service', description: 'Terms governing use of our website and services.' },
  { slug: 'cookies', title: 'Cookie Notice', description: 'Cookie usage and preference information.' },
];

const SEED_SECTORS = [
  {
    name: 'Government & Public Institutions',
    description:
      'Strategic messaging, reform visibility, and public trust-building for ministries, agencies, SOEs, and state offices.',
  },
  {
    name: 'International Development & Multilaterals',
    description:
      'Donor communications, stakeholder engagement, and campaign design for UN agencies, multilaterals, and development partners.',
  },
  {
    name: 'Finance, Investment & Trade',
    description:
      'Investor-facing communications, ESG storytelling, and cross-border branding for financial institutions, DFIs, fintechs, and trade bodies.',
  },
  {
    name: 'Infrastructure, Energy & Extractives',
    description:
      'Narratives that support large-scale projects, community engagement, social license, and regulatory visibility across hard sectors.',
  },
  {
    name: 'Technology, Startups & Innovation',
    description:
      "Bold messaging and digital campaigns for startups, platforms, and innovation ecosystems—shaping Africa's tech-driven future.",
  },
  {
    name: 'Health, Education & Social Development',
    description:
      'Behavior change communication, public outreach, and institutional visibility for health systems, schools, and human capital initiatives.',
  },
  {
    name: 'Climate, Environment & Sustainability',
    description:
      "Content strategies for climate action, biodiversity, energy transition, and green finance—amplifying Africa's voice in global sustainability.",
  },
  {
    name: 'Arts, Culture & Creative Industries',
    description:
      'Creative publicity, platform building, and cultural storytelling that connect artists, curators, and institutions to local and global audiences.',
  },
  {
    name: 'Sports, Tourism & Nation Branding',
    description:
      'Public relations and promotional campaigns that elevate destinations, athletes, and national image across tourism and sport.',
  },
  {
    name: 'Hospitality, Travel & Leisure',
    description:
      'Strategic media and consumer-facing communications for hotels, resorts, tourism boards, and hospitality brands seeking global reach.',
  },
  {
    name: 'Legal, Policy & Governance',
    description:
      'Policy reform visibility, legal institution branding, and governance communication for ministries of justice, regulatory bodies, and courts.',
  },
  {
    name: 'Migration, Diaspora & Global Mobility',
    description:
      'Diaspora engagement campaigns, migration policy comms, remittance platform PR, and transnational storytelling.',
  },
  {
    name: 'Security, Peacebuilding & Conflict Communications',
    description:
      'Sensitive, high-stakes communication support for fragile contexts, peace processes, disinformation response, and conflict recovery.',
  },
  {
    name: 'Philanthropy, Foundations & Social Investment',
    description:
      'Strategic communications for foundations, CSR teams, and social investors—highlighting impact, transparency, and beneficiary engagement.',
  },
  {
    name: 'Media, Entertainment & Public Personalities',
    description:
      'Visibility campaigns, brand protection, and strategic publicity for content creators, influencers, media brands, and entertainment firms.',
  },
];

const SEED_SERVICES = [
  {
    title: 'Strategic Communications & Narrative Building',
    icon: 'strategic',
    description:
      'We develop tailored messaging frameworks, storytelling strategies, and communication blueprints that align with your institutional goals and public identity. Includes: Message mapping, speechwriting, narrative architecture, and positioning strategies.',
  },
  {
    title: 'Media Relations & Reputation Management',
    icon: 'media-relations',
    description:
      'We help you build and sustain public trust by managing perception, cultivating media relationships, and preparing for both visibility and scrutiny. Includes: Press engagement, media training, crisis response, reputation recovery.',
  },
  {
    title: 'Campaigns, Advocacy & Stakeholder Engagement',
    icon: 'campaigns',
    description:
      'We design high-impact campaigns that mobilize audiences, shift public opinion, and influence policy or behavior. Includes: Advocacy communications, civic mobilization, stakeholder mapping, and coalition engagement.',
  },
  {
    title: 'Digital, Social & Multimedia Communications',
    icon: 'digital',
    description:
      'We deliver digital-first communications across platforms—combining content strategy, design, and audience analytics for sustained engagement. Includes: Social media strategy, influencer integration, video content, community management.',
  },
  {
    title: 'Branding, Design & Identity Systems',
    icon: 'branding',
    description:
      'We build powerful brand identities that reflect your vision and connect meaningfully with your audience. Includes: Visual identity, brand messaging, institutional rebranding, graphic design.',
  },
  {
    title: 'Event Media & Summit Support',
    icon: 'events',
    description:
      'We provide complete media support for events—from press handling and content creation to live coverage and post-event promotion. Includes: Media kits, live production, speaker preparation, and summit communications.',
  },
  {
    title: 'Investor, Donor & ESG Communications',
    icon: 'esg',
    description:
      'We help you communicate value, transparency, and vision to investors, funders, and strategic partners. Includes: ESG reports, donor briefings, impact storytelling, investor decks.',
  },
  {
    title: 'Insights, Monitoring & Performance Measurement',
    icon: 'insights',
    description:
      'We equip you with real-time intelligence and performance analysis to track progress, evaluate reach, and optimize strategies. Includes: Media monitoring, audience analytics, sentiment analysis, reporting dashboards.',
  },
  {
    title: 'Advisory, Training & Institutional Capacity Building',
    icon: 'advisory',
    description:
      'We build in-house communication capacity through advisory support, coaching, and strategic audits. Includes: Executive communications coaching, staff training, department strategy planning.',
  },
  {
    title: 'Influence Strategy & Public Diplomacy',
    icon: 'diplomacy',
    description:
      'We support governments, embassies, and regional bodies in shaping international narratives and building soft power. Includes: Diplomatic campaigns, narrative repositioning, multilateral engagement.',
  },
  {
    title: 'AI & Innovation Lab',
    icon: 'ai',
    description:
      'We leverage the latest tools in content automation, predictive analytics, and immersive media to keep our clients at the forefront of communications. Includes: AI-assisted content, AR/VR experiences, digital production systems.',
  },
  {
    title: 'Policy & Legislative Communications',
    icon: 'policy',
    description:
      'We translate complex legal and policy content into compelling public narratives that inform, engage, and persuade. Includes: Policy brief translation, public rollout strategies, legislative PR.',
  },
  {
    title: 'Market Entry & Investor Onboarding Communications',
    icon: 'market',
    description:
      'We help international brands and investors navigate new markets with culturally aware, locally resonant communications strategies. Includes: Market reputation mapping, regulator engagement messaging, localization support.',
  },
  {
    title: 'Corporate Communications & Media Circulation',
    icon: 'corporate',
    description:
      'We manage formal and institutional messaging across internal and external channels—ensuring consistency, clarity, and compliance. Includes: Press releases, internal memos, regulatory disclosures, and executive communications.',
  },
  {
    title: 'Studio Services: Production, Design & Content Creation',
    icon: 'studio',
    description:
      'Our in-house creative studio produces world-class visuals, video, photography, and multimedia content tailored to your audience and brand. Includes: Documentary production, brand videos, photography, post-production.',
  },
];

const SEED_BRANDS = [
  {
    name: 'African Leaders Magazine',
    description:
      'A continental platform spotlighting leadership, policy, and governance across Africa—interviews with heads of state, CEOs, and reform champions; deep coverage of transitions, strategy, and institutional innovation.',
    order_index: 1,
  },
  {
    name: 'Africa Sports Magazine',
    description:
      "Monthly insights into performance, business, culture, and talent development in African sports—rising stars, diplomacy, and local-to-global impact.",
    order_index: 2,
  },
  {
    name: 'Africa News Bulletin',
    description:
      'Daily newswire for decision-makers: politics, economy, institutions, and regional affairs—trusted reporting across the continent.',
    order_index: 3,
  },
  {
    name: 'Africa Sportz',
    description:
      'Digital-first youth brand at the intersection of sports, style, and social—visual storytelling, influencers, and community campaigns.',
    order_index: 4,
  },
  {
    name: 'Africa Trade Directory',
    description:
      'Verified cross-border trade, listings, and investment resources—exporters, importers, logistics, trade bodies, and governments.',
    order_index: 5,
  },
  {
    name: 'Africa Hospitality Magazine',
    description:
      "Tourism, travel, and hospitality—destinations, executive interviews, investment trends, properties, and guest experience.",
    order_index: 6,
  },
  {
    name: 'Agile HR Magazine',
    description:
      'Human capital, people strategy, and workplace leadership across organisations in Africa and the diaspora.',
    order_index: 7,
  },
];

const SEED_EVENTS = [
  {
    title: 'Africa Trade Summit',
    description:
      'Accelerating intra-African trade, investment, and transformation—presidential panels, pitch rooms, trade showcases, CEO roundtables.',
    link_url: '/signature-events',
  },
  {
    title: 'Africa Trade Awards',
    description:
      "Excellence across the continent's trade ecosystem—exporters, enablers, innovators, and public-sector reform.",
    link_url: '/signature-events',
  },
  {
    title: 'Africa Industry Awards',
    description:
      'Industry and manufacturing—innovation and growth from agribusiness and mining to energy, construction, and light industry.',
    link_url: '/signature-events',
  },
  {
    title: 'Africa Investment Week',
    description:
      'Investors, fund managers, startups, governments, and DFIs—deal rooms, briefings, country presentations, fund showcases.',
    link_url: '/signature-events',
  },
  {
    title: 'Afro Jazz Festival',
    description:
      'Music, art, and culture—live jazz and fusion, exhibitions, food, fashion, and storytelling bridging heritage and innovation.',
    link_url: '/signature-events',
  },
];

const SEED_CASE_STUDIES = [
  {
    title: 'Public Sector Narrative Strategy',
    client_name: 'Ministry of Trade',
    description:
      'Developed an integrated communication framework for a Ministry of Trade to align investor attraction, policy messaging, and AfCFTA visibility.',
    order_index: 1,
  },
  {
    title: 'Creative Launch Campaign – Africa Sportz',
    client_name: 'Africa Sportz',
    description:
      'Produced a youth-driven media activation to launch a new pan-African digital sports brand with over 1 million social media impressions in the first 60 days.',
    order_index: 2,
  },
  {
    title: 'Summit Media Strategy – Africa Trade Summit',
    client_name: 'Africa Trade Summit',
    description:
      'Delivered full press management, real-time coverage, and speaker coaching for a two-day high-level summit involving four heads of state and 500+ delegates.',
    order_index: 3,
  },
  {
    title: 'Diaspora Engagement – Global Ghana Initiative',
    client_name: 'Global Ghana Initiative',
    description:
      'Created a cross-platform diaspora communications campaign blending video, testimonials, and cultural media across five countries.',
    order_index: 4,
  },
  {
    title: 'Brand Repositioning – Africa Hospitality Magazine',
    client_name: 'Africa Hospitality Magazine',
    description:
      'Redesigned visual identity, digital rollout plan, and editorial voice to elevate the brand as the go-to regional publication for hospitality insight.',
    order_index: 5,
  },
];

async function seedAgileContent(pool) {
  await pool.query(
    `INSERT INTO pages (slug, title, description, content_json)
     VALUES ('home', $1, $2, $3::jsonb)
     ON CONFLICT (slug) DO UPDATE SET
       title = EXCLUDED.title,
       description = EXCLUDED.description,
       content_json = EXCLUDED.content_json,
       updated_at = NOW()`,
    [HOME_TITLE, HOME_DESCRIPTION, JSON.stringify(HOME_CONTENT_JSON)]
  );

  for (const page of CMS_PAGE_SEEDS) {
    const content = {
      blocks: [
        {
          type: 'text',
          heading: page.title,
          body: page.description,
        },
      ],
    };
    await pool.query(
      `INSERT INTO pages (slug, title, description, content_json, status, published_at)
       SELECT $1, $2, $3, $4::jsonb, 'published', NOW()
       WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = $1)`,
      [page.slug, page.title, page.description, JSON.stringify(content)]
    );
  }

  for (let i = 0; i < SEED_SECTORS.length; i++) {
    const s = SEED_SECTORS[i];
    await pool.query(
      `INSERT INTO sectors (name, description, order_index)
       SELECT $1, $2, $3
       WHERE NOT EXISTS (SELECT 1 FROM sectors WHERE name = $1)`,
      [s.name, s.description, i + 1]
    );
  }

  for (let i = 0; i < SEED_SERVICES.length; i++) {
    const s = SEED_SERVICES[i];
    await pool.query(
      `INSERT INTO services (title, description, icon, order_index)
       SELECT $1, $2, $3, $4
       WHERE NOT EXISTS (SELECT 1 FROM services WHERE title = $1)`,
      [s.title, s.description, s.icon, i + 1]
    );
  }

  for (const b of SEED_BRANDS) {
    await pool.query(
      `INSERT INTO brands (name, description, image_url, website_url, order_index)
       SELECT $1, $2, NULL, NULL, $3
       WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = $1)`,
      [b.name, b.description, b.order_index]
    );
  }

  for (let i = 0; i < SEED_EVENTS.length; i++) {
    const e = SEED_EVENTS[i];
    await pool.query(
      `INSERT INTO events (title, description, image_url, link_url, order_index)
       SELECT $1, $2, NULL, $3, $4
       WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = $1)`,
      [e.title, e.description, e.link_url, i + 1]
    );
  }

  for (const c of SEED_CASE_STUDIES) {
    await pool.query(
      `INSERT INTO case_studies (title, client_name, description, image_url, content_json, order_index)
       SELECT $1, $2, $3, NULL, '{}'::jsonb, $4
       WHERE NOT EXISTS (SELECT 1 FROM case_studies WHERE title = $1)`,
      [c.title, c.client_name, c.description, c.order_index]
    );
  }
}

module.exports = { seedAgileContent, HOME_TITLE, HOME_DESCRIPTION, HOME_CONTENT_JSON };
