import { ABOUT_PAGE_CONTENT_DEFAULTS } from '@/lib/aboutPageContentDefaults';
import { DEFAULT_HEAD_OFFICE_LINE } from '@/lib/defaultAddress';
import {
  DEFAULT_GENERAL_PHONE_DISPLAY,
  DEFAULT_GENERAL_PHONE_LABEL,
  DEFAULT_PHONE_WHATSAPP_HREF,
  DEFAULT_PHONE_WHATSAPP_LABEL,
} from '@/lib/defaultPhoneChannel';
import {
  DEFAULT_AGILE_INSTAGRAM_URL,
  DEFAULT_AGILE_LINKEDIN_URL,
  DEFAULT_AGILE_X_URL,
  DEFAULT_AGILE_YOUTUBE_URL,
  DEFAULT_FACEBOOK_URL,
} from '@/lib/defaultSocialUrls';
import { INSIGHTS_FEATURED_DEFAULTS } from '@/lib/insightsFeatured';

const BUNDLED_HERO_VIDEO_SRC = '/videos/homepage-hero-video.mp4';

const DEFAULT_HERO_SOCIAL_LINKS = [
  `Facebook :: ${DEFAULT_FACEBOOK_URL}`,
  `X :: ${DEFAULT_AGILE_X_URL}`,
  `Instagram :: ${DEFAULT_AGILE_INSTAGRAM_URL}`,
  `LinkedIn :: ${DEFAULT_AGILE_LINKEDIN_URL}`,
  `YouTube :: ${DEFAULT_AGILE_YOUTUBE_URL}`,
].join('\n');

const FOOTER_COL1 = `Who we are :: /about
Services :: /services
Sectors :: /sectors
Studio :: /studio`;

const FOOTER_COL2 = `Agile Press Group :: /agile-press-group
Our brands :: /brands
Case studies :: /case-studies
Resources :: /insights`;

const FOOTER_COL3 = `Insights :: /insights
Digital engagement :: /digital-engagement
Events :: /signature-events
Careers :: /careers
Partnerships :: /partnerships`;

const FOOTER_COL4 = `Contact us :: /contact
Privacy policy :: /privacy
Terms of service :: /terms
Cookie notice :: /cookies`;

/**
 * Defaults that match public-site fallbacks (`useSiteSectionContent` / `getSiteSectionContent`).
 * Admin merges these into empty DB fields so editors see live copy.
 */
export const SITE_SECTION_CODE_DEFAULTS: Record<string, Record<string, string>> = {
  'home.events': {
    label: 'Flagship Convenings',
    title: 'Signature Events',
    subtitle: 'Curated Platforms That Bring Visionaries, Innovators, and Institutions Together.',
    linkLabel: 'See all events',
    ctaPrimary: 'See Event Calendar',
    ctaSecondary: 'Partner With Us',
  },
  'home.insights': {
    label: 'Press + Intelligence',
    title: 'Insights & Press Room',
    subtitle:
      'Stay updated with our bulletins, press briefings, news and thought leadership through the Agile Press Group.',
    linkLabel: 'Read updates',
    linkHref: '/insights',
    ctaPrimary: 'Visit Agile Press Group →',
    ctaPrimaryHref: '/agile-press-group',
    ctaSecondary: 'Insights & press room',
    ctaSecondaryHref: '/insights',
  },
  'home.marquee': {
    primaryLines:
      'Strategic Storytelling\nMedia Intelligence\nCampaign Architecture\nDigital Influence\nCreative Production',
    secondaryLines:
      'Institutional trust\nCross-border narrative\nExecutive visibility\nSummit & event media\nMeasured impact',
  },
  'home.whoWeAre': {
    label: 'About Agile',
    title: 'Who We Are',
    body:
      'We are a multidisciplinary communications agency operating at the intersection of strategy, storytelling, and public influence. From presidential campaigns to global brand launches, our work blends intelligence, creativity, and execution power—helping clients lead conversations and shape change.',
    ctaLabel: 'Learn More About Us →',
    ctaHref: '/about',
    imageUrl: '',
  },
  'home.servicesBand': {
    label: 'Capabilities',
    title: 'Our services',
    linkLabel: 'View all services',
    linkHref: '/services',
    subtitle:
      'Comprehensive communications solutions. Strategically designed. Precisely delivered.',
    ctaPrimaryLabel: 'View all services',
    ctaPrimaryHref: '/services',
    ctaSecondaryLabel: 'Request a Consultation',
    ctaSecondaryHref: '/contact#contact',
  },
  'home.brandsBand': {
    label: 'Media Network',
    title: 'Our Brands',
    linkLabel: 'Explore portfolio',
    linkHref: '/brands',
    subtitle:
      'Media Properties That Inform, Inspire, and Influence. Agile Media Solutions owns and operates a growing portfolio of high-impact media platforms that shape public discourse, elevate African voices, and spotlight key sectors across the continent.',
    ctaPrimaryLabel: 'View All Brands',
    ctaPrimaryHref: '/brands',
    ctaSecondaryLabel: 'Advertise With Us',
    ctaSecondaryHref: '/contact#contact',
  },
  'home.caseStudiesBand': {
    label: 'Selected Work',
    title: 'Case Studies & Campaign Highlights',
    linkLabel: 'View projects',
    linkHref: '/case-studies',
    subtitle:
      'Explore our portfolio of strategic communications projects across Africa and the global stage—from cross-border campaigns to policy communications and narrative repositioning.',
    ctaPrimaryLabel: 'See Case Studies →',
    ctaPrimaryHref: '/case-studies',
    ctaSecondaryLabel: 'Start a Project',
    ctaSecondaryHref: '/contact#contact',
  },
  'home.careersBand': {
    label: 'Talent',
    title: 'Join the Team',
    subtitle:
      "We're building a creative, strategic, and fearless team across Africa and beyond.",
    ctaPrimaryLabel: 'Explore Careers',
    ctaPrimaryHref: '/careers',
    ctaSecondaryLabel: 'Become a Contributor',
    ctaSecondaryHref: '/contact#contact',
  },
  'home.hero': {
    kicker: 'Creative Communications Studio',
    videoSrc: BUNDLED_HERO_VIDEO_SRC,
    videoPoster: '',
    primaryCtaLabel: 'Explore Our Brands',
    primaryCtaHref: '/brands',
    socialLinks: DEFAULT_HERO_SOCIAL_LINKS,
  },
  'layout.preloader': {
    splashImage: '/images/opening-launch.webp',
    displayDurationMs: '1200',
  },
  'layout.topBar': {
    email: 'info@agilemediasolutions.com',
    contactLabel: DEFAULT_PHONE_WHATSAPP_LABEL,
    contactHref: DEFAULT_PHONE_WHATSAPP_HREF,
    facebookUrl: DEFAULT_FACEBOOK_URL,
    twitterUrl: DEFAULT_AGILE_X_URL,
    instagramUrl: DEFAULT_AGILE_INSTAGRAM_URL,
    linkedinUrl: DEFAULT_AGILE_LINKEDIN_URL,
    youtubeUrl: DEFAULT_AGILE_YOUTUBE_URL,
  },
  'layout.footer': {
    impactText: 'Agile Media',
    brandingCopy:
      'We shape narratives that move institutions, markets, and culture across Africa and beyond.',
    newsletterHeading: 'Newsletter',
    newsletterBody:
      'Subscribe to the Agile Brief—our monthly roundup of ideas, strategy, and news. No spam.',
    copyrightEntity: 'Agile Media Solutions',
    col1Heading: 'Company',
    col1Links: FOOTER_COL1,
    col2Heading: 'Agile Press Group',
    col2Links: FOOTER_COL2,
    col3Heading: 'Press room',
    col3Links: FOOTER_COL3,
    col4Heading: 'Contact & legal',
    col4Links: FOOTER_COL4,
    facebookUrl: DEFAULT_FACEBOOK_URL,
    instagramUrl: DEFAULT_AGILE_INSTAGRAM_URL,
    xUrl: DEFAULT_AGILE_X_URL,
    linkedinUrl: DEFAULT_AGILE_LINKEDIN_URL,
    youtubeUrl: DEFAULT_AGILE_YOUTUBE_URL,
  },
  'services.page': {
    heroLabel: 'Services',
    heroTitle: 'Comprehensive Communications Solutions. Strategically Designed. Precisely Delivered.',
    heroIntro:
      'Agile Media Solutions offers a full suite of communications, media, and public relations services designed for governments, businesses, institutions, and mission-driven organizations. Our work blends strategic thinking, creative execution, and sectoral intelligence-ensuring our clients communicate with clarity, confidence, and purpose.',
    heroSubIntro: '',
    sectionLabel: 'Capabilities',
    sectionTitle: 'Explore our integrated service offerings',
    sectionSubtitle:
      "Need help choosing the right mix? We'll assess your goals and recommend a package that delivers real-world outcomes.",
  },
  'brands.page': {
    heroLabel: 'Our brands',
    heroTitle: 'Media Properties That Inform, Inspire, and Influence',
    heroIntro:
      'Agile Media Solutions owns and operates a growing portfolio of high-impact media platforms that shape public discourse, elevate African voices, and spotlight key sectors across the continent. Each brand is purpose-built to serve a distinct audience-from policymakers and business leaders to creatives, investors, athletes, and travelers.',
    heroSubIntro:
      'Our media properties are not only content platforms-they are strategic instruments for visibility, engagement, and storytelling.',
    sectionLabel: 'Portfolio',
    sectionTitle: 'Our Publishing and Media Platforms',
    sectionLinkLabel: 'Media partnerships',
    outro:
      "Together, these brands extend Agile Media Solutions' mission to power narratives, elevate stories, and create platforms that inform, connect, and lead.",
    ctaPrimary: 'Advertise With Us',
    ctaSecondary: 'Syndicate Our Content',
    ctaTertiary: 'Become a Contributor',
  },
  'signature-events.page': {
    heroLabel: 'Signature events',
    heroTitle: 'Curated Platforms That Bring Visionaries, Innovators, and Institutions Together',
    heroIntro:
      'Agile Media Solutions is not only a communications firm-we are also a convening force. Through our proprietary events, we bring together influential voices across trade, investment, culture, policy, and industry to inspire dialogue, foster partnerships, and build platforms that matter.',
    heroSubIntro:
      'Our events combine powerful content, strategic visibility, high-level participation, and unforgettable experiences.',
    sectionLabel: 'Event Portfolio',
    sectionTitle: 'Signature Experiences and Convenings',
    sectionLinkLabel: 'Sponsorship options',
    ctaPrimary: 'Partner With Us',
    ctaSecondary: 'Home',
  },
  'case-studies.page': {
    heroLabel: 'Case studies & portfolio',
    heroTitle: 'Strategic Impact. Creative Execution. Measurable Results.',
    heroIntro:
      'Agile Media Solutions has delivered high-level communications for clients across sectors, regions, and mandates-from institutional reform campaigns to global investor engagements, from cultural showcases to public trust-building initiatives.',
    heroSubIntro:
      'Our portfolio reflects our ability to listen deeply, think strategically, and execute with precision-regardless of scale or complexity.',
    showcaseLabel: 'Scope',
    showcaseTitle: 'What We Showcase',
    highlightsLabel: 'Featured Campaigns',
    highlightsTitle: 'Selected Highlights',
    highlightsSubtitle: 'Representative programmes from our strategic communications work.',
    finalSubtitle:
      'Let us help you tell your next success story-with strategy, creativity, and clarity of purpose.',
    ctaPrimary: 'Start a Project',
    ctaSecondary: 'Book a Discovery Call',
  },
  'about.page': { ...ABOUT_PAGE_CONTENT_DEFAULTS },
  'partnerships.page': {
    heroLabel: 'Partnerships',
    heroTitle: 'Collaborating for Visibility, Influence, and Impact',
    heroIntro:
      "Agile Media Solutions works in close partnership with institutions, businesses, governments, and creatives to co-create platforms, amplify causes, and deliver shared value. We don't just work for clients-we build strategic relationships that grow movements, markets, and messages.",
    heroSubIntro:
      'Whether you are launching a campaign, hosting a global summit, expanding across regions, or creating your own branded media platform-we offer the expertise, reach, and execution power to bring your vision to life.',
    sectionLabel: 'Collaboration',
    sectionTitle: 'Partnership pathways',
    sectionLinkLabel: 'Start a conversation',
    typesHeading: 'Types of Partnerships We Support',
    typesCards:
      'Institutional & Government Partnerships :: Co-branded campaigns, narrative strategy, public education drives, and national visibility initiatives.\nCorporate & Brand Collaborations :: Custom content platforms, sponsorship activations, product storytelling, and executive positioning.\nDevelopment & Philanthropic Engagements :: Program visibility, impact documentation, donor communications, and advocacy media.\nMedia & Content Co-Productions :: Joint ventures in content creation, special publications, brand integrations, and talent partnerships.\nEvent Media Partnerships :: Press management, stage production, and strategic amplification for high-level convenings.\nDiaspora, Arts & Cultural Platforms :: Partnerships with festivals, exhibitions, creative collectives, and Afro-global networks.',
    partnerWithUsHeading: 'Partner With Us To',
    partnerWithUsList:
      'Expand your brand or institution across African and global audiences\nBuild narrative power in a contested or complex media environment\nReach strategic audiences with content that builds trust and engagement\nLaunch or scale a campaign, media platform, or storytelling initiative\nCo-create publications, events, podcasts, or documentaries aligned with your mission',
    valuesHeading: 'Our Partnership Values',
    valuesList:
      'Purpose-led Collaboration\nShared Visibility and Voice\nAudience-Centric Storytelling\nExcellence in Execution\nEthical Communications Practice',
    ctaStripText: 'Tell us about your partnership idea.',
    ctaPrimary: 'Propose a Partnership',
    ctaSecondary: 'View Current Collaborators',
    ctaTertiary: 'Download Our Media Kit',
  },
  'contact.page': {
    heroLabel: 'Contact',
    heroTitle: "Let's Talk Strategy, Storytelling, and Solutions",
    heroIntro:
      "Whether you're ready to launch a campaign, partner on a project, or explore how Agile Media Solutions can support your brand or institution-we'd love to hear from you.",
    heroSubIntro:
      'We are available across time zones and channels to discuss ideas, opportunities, and collaborations.',
    connectionsLabel: 'Connections',
    connectionsTitle: 'Get In Touch',
    connectionsLinkLabel: 'View services',
    quickBriefLabel: 'Quick Brief',
    quickBriefTitle: 'Send a message',
    quickBriefSubtitle:
      'Use the form for campaigns, partnerships, media enquiries, or general questions.',
    generalCardTitle: 'General Inquiries',
    generalEmail: 'info@agilemediasolutions.com',
    generalPhoneLabel: DEFAULT_GENERAL_PHONE_LABEL,
    generalPhoneDisplay: DEFAULT_GENERAL_PHONE_DISPLAY,
    generalPhoneHref: DEFAULT_PHONE_WHATSAPP_HREF,
    generalHours: 'Monday-Friday, 9:00 AM-6:00 PM (GMT)',
    generalHeadOffice: DEFAULT_HEAD_OFFICE_LINE,
    generalLocations: 'Nairobi | Johannesburg',
    consultationCardTitle: 'Request a Consultation',
    consultationCardBody:
      'Interested in our services? Fill out the consultation form below and our team will reach out within 48 hours.',
    pressCardTitle: 'Media & Press Inquiries',
    pressCardBody:
      'For interviews, speaker bookings, press releases, or story access, contact us from the email above and we will route you to the press desk.',
    pressCardCta: 'Download Media Kit',
    followTitle: 'Follow Us',
    followSubtitle:
      'Stay connected for insights, event updates, behind-the-scenes content, and stories that matter-Twitter, LinkedIn, Instagram, YouTube, and Facebook.',
    socialCta: 'Social links',
    finalSubtitle: "Let's build something meaningful-together.",
    finalCta: 'Contact Us Now',
  },
  'careers.page': {
    heroLabel: 'Careers',
    heroTitle: 'Join a Team That Shapes Narratives and Moves Audiences',
    heroIntro:
      'At Agile Media Solutions, we are building more than a media and communications firm-we are building a platform for influence, creativity, and purpose. We bring together storytellers, strategists, analysts, designers, producers, and policy thinkers who believe in the power of narrative to transform institutions and societies.',
    heroSubIntro:
      "If you're driven by ideas, committed to excellence, and ready to work on high-impact projects across Africa and globally, Agile may be the place for you.",
    whyHeading: 'Why Work With Us',
    whyList:
      'Work with bold clients on issues that matter\nCollaborate across borders, cultures, and sectors\nDevelop creative solutions with real-world influence\nBuild campaigns that shape conversations and policy\nGrow in a mission-driven, fast-moving team of global professionals',
    whoHeading: "Who We're Looking For",
    whoIntro: 'We welcome early-career and experienced professionals with expertise in:',
    whoList:
      'Strategic communications\nPublic relations and media management\nCreative direction, content writing, and editorial\nFilm, video, photography, and motion graphics\nDigital strategy and campaign management\nPublic affairs, governance, and policy engagement\nMarketing, partnerships, and business development\nEvents, production, and logistics\nResearch, insights, and sector analysis',
    opportunitiesHeading: 'Opportunities',
    opportunityCards:
      'Full-Time Positions :: Join our leadership or delivery teams\nConsultant Roster :: Project-based roles across regions and specialties\nFellowships & Internships :: For emerging creatives, writers, and strategists\nCreative Collaborators :: Visual artists, animators, musicians, illustrators',
    cultureHeading: 'The Agile Culture',
    cultureList:
      'Collaborative and mission-focused\nFlexible, fast-paced, and outcome-driven\nDiverse, respectful, and inclusive\nInvested in continuous learning and experimentation',
    ctaStripText: 'Ready to apply?',
    ctaPrimary: 'See Open Positions',
    ctaSecondary: 'Join Our Talent Network',
    ctaTertiary: 'Meet Our Team',
  },
  'insights.page': {
    heroLabel: 'Insights & press room',
    heroTitle: 'Where Strategy Meets Story. And Headlines Meet Meaning.',
    heroTagline:
      'This is where Agile Media Solutions shares bold ideas, sector intelligence, creative insights, and media highlights. From original commentary to campaign coverage, this section brings together our perspective and presence in the media landscape.',
    sectionLabel: 'Editorial Desk',
    sectionTitle: 'Insights & Press Room',
    sectionLinkLabel: 'Visit press group',
    insightsHeading: 'Insights',
    insightsLead: 'Our voice. Our vision.',
    insightsBody:
      'We believe communication is a tool for shaping society-not just sharing news. Through essays, articles, and guest features, we share insights on:',
    insightsBullets:
      'Strategic communications trends across Africa and globally\nNarrative power in trade, policy, and governance\nBrand storytelling in complex or high-trust sectors\nCampaign design, media innovation, and impact communications\nLeadership messaging and institutional credibility',
    insightsCtaPrimary: 'Read Our Latest Insights',
    insightsCtaSecondary: 'Submit a Guest Article',
    pressHeading: 'Press Room',
    pressLead: 'News, launches, and media coverage.',
    pressBody: 'Stay up to date with Agile Media Solutions in the news and on the record.',
    pressBullets:
      'Announcements and client wins\nEvent media kits and summit briefings\nPress releases and thought leader mentions\nExecutive op-eds and campaign launches\nAwards, partnerships, and public recognitions',
    pressCtaPrimary: 'Browse Press Releases',
    pressCtaSecondary: 'Access Media Kits',
    pressCtaTertiary: 'Download Executive Photos and Bios',
    supportHeading: 'Media Circulation Support',
    supportBody:
      'Agile Media Solutions also facilitates press release writing, distribution, and media engagement on behalf of select clients through our Corporate Communications & Circulation Service.',
    supportCtaPrimary: 'Learn More About Media Support',
    supportCtaSecondary: 'Request Distribution Assistance',
    finalSubtitle: 'Want to be the first to receive our insights?',
    finalCta: 'Subscribe to the Agile Brief',
  },
  'insights.featured': { ...INSIGHTS_FEATURED_DEFAULTS },
  'studio.page': {
    heroLabel: 'Studio',
    heroTitle: 'Where Ideas Become Content. And Content Becomes Influence.',
    heroIntro:
      'Agile Studio is the creative production and content innovation arm of Agile Media Solutions. It is where strategic vision meets visual execution-where narratives take form through world-class media production, brand storytelling, and digital experiences.',
    heroSubIntro:
      'Our studio supports both internal campaigns and external clients with turnkey creative solutions across film, design, audio, photography, and experiential content.',
    sectionLabel: 'Production Stack',
    sectionTitle: 'What We Do',
    sectionLinkLabel: 'Book the studio',
    highlightsHeading: 'Studio Highlights',
    highlightsList:
      'On-location and in-studio production\nMultilingual voiceovers and regional content adaptation\nDrone and aerial videography\nLivestream event coverage and hybrid setup support\nDigital content packaging for web, mobile, and social',
    clientsHeading: 'Studio Clients & Collaborators',
    clientsSubtitle:
      'We serve public institutions, CEOs, NGOs, influencers, creatives, campaign teams, and international brands with production work that meets strategic objectives and surpasses creative expectations.',
    ctaPrimary: 'Book the Studio',
    ctaSecondary: 'View Our Production Portfolio',
    ctaTertiary: 'Commission a Project',
  },
  'digital-engagement.page': {
    heroLabel: 'Digital engagement',
    heroTitle: 'Where Audiences Are Built, Messages Amplified, and Influence Engineered',
    heroIntro:
      'At Agile Media Solutions, social media is not just a platform-it is a political tool, a public square, a brand amplifier, and an intelligence system. We help institutions, leaders, movements, and brands activate digital audiences with precision, creativity, and credibility.',
    heroSubIntro:
      "Whether you're launching a campaign, shaping perception, engaging a community, or managing risk-we turn your objectives into algorithm-friendly, influence-driven digital executions.",
    sectionLabel: 'Digital',
    sectionTitle: 'Our Digital Strategy Offerings',
    sectionLinkLabel: 'Request a session',
    sectionIntro:
      'From platform strategy and creative production to analytics and verification-we design digital infrastructure that matches your mandate and your audiences.',
    offeringsHeading: 'How we can help',
    ctaHeading: "Let's Go Digital with Purpose",
    ctaText:
      'We treat digital space as infrastructure. Let Agile Media Solutions power your online influence with precision, agility, and clarity.',
    ctaPrimary: 'Request a Social Media Strategy Session',
    ctaSecondary: 'View Our Digital Case Studies',
    ctaTertiary: 'Engage Our Studio',
  },
  'agile-press-group.page': {
    heroLabel: 'Agile Press Group',
    heroTitle: "Shaping Africa's Narrative, One Publication at a Time",
    heroIntro:
      'Agile Press Group is the publishing and editorial division of Agile Media Solutions-dedicated to creating, curating, and circulating high-quality African content that informs, inspires, and influences.',
    heroSubIntro:
      'We manage a bold and growing portfolio of publications, bulletins, syndication services, and special reports that serve leaders, professionals, creatives, institutions, and the public across Africa and the global diaspora. From trade to governance, from sport to hospitality-we produce powerful content platforms that centre African perspectives and elevate the voices that move the continent forward.',
    sectionLabel: 'Publishing Core',
    sectionTitle: 'Our Editorial Vision',
    sectionLinkLabel: 'Start publishing',
    visionHeading: 'Our Editorial Vision',
    visionList:
      'Authentic: Rooted in African stories, lived experiences, and voices\nStrategic: Designed to support institutions, leaders, and reform efforts\nPan-African: Cross-border, multilingual, and diasporic in reach\nHigh-Quality: Driven by editorial rigour, design excellence, and insight\nCross-Platform: Print, digital, podcast, video, and syndication formats',
    flagshipHeading: 'Flagship Publications',
    flagshipList:
      'African Leaders Magazine - Leadership, governance, and public sector innovation\nAfrica Sports Magazine - Performance, policy, and people in African sport\nAfrica News Bulletin - Daily curated updates for decision-makers and institutions\nAfrica Sportz - Youth culture, athlete branding, and sports entertainment\nAfrica Hospitality Magazine - Tourism, investment, and travel experience insights\nAfrica Trade Directory (optional: reposition as Africa Trade Intelligence) - Trade promotion, B2B listings, commercial diplomacy, and investment visibility',
    publishingServicesHeading: 'Publishing Services - Press Release Circulation & Media Syndication',
    publishingServicesIntro:
      'We write, distribute, and track high-impact press releases across Africa and global media environments. Our media desk ensures your message reaches the right outlets with editorial credibility.',
    publishingServicesIncludesLabel: 'Includes:',
    publishingServicesIncludesList:
      'Press release drafting, localization, and editing\nDistribution to verified pressrooms, media editors, and correspondents\nPlacement in Agile-owned and partner publications\nImpact monitoring and clipping reports\nSyndication in Africa News Bulletin and select dailies',
    customPublishingHeading: 'Custom Publishing for Institutions',
    customPublishingIntro:
      'We co-create branded and strategic content for government ministries, corporates, development agencies, and trade platforms.',
    customPublishingExamplesLabel: 'Examples include:',
    customPublishingExamplesList:
      'Country investment guides\nMinistry and agency yearbooks\nESG, CSR, and donor reports\nEvent, summit, and expo publications\nNational brand storybooks',
    syndicationHeading: 'Syndication Partnerships Across Africa',
    syndicationIntro:
      'Agile Press Group is building a content exchange ecosystem with licensed syndication in leading media outlets across capital cities, enabling shared visibility for Africa-focused editorial content.',
    syndicationCountries:
      "Partner Countries (initial wave): Ghana, Kenya, Nigeria, Rwanda, South Africa, Senegal, Egypt, and Cote d'Ivoire.",
    signatureProductsHeading: 'Signature Editorial Products',
    signatureProductsList:
      'Africa Media & Influence Outlook (Annual report)\nAfCFTA Communications Trends Report\nAfrica Public Affairs Yearbook\nTop 100 African CEO Brand Index\nAfrica Elections & Political Messaging Tracker',
    signatureProductsOutro:
      'These flagship publications position Agile Press Group as a thought leader in strategic communications, institutional visibility, and brand power across the continent.',
    contributorHeading: 'Agile Contributor Network',
    contributorIntro:
      'We collaborate with a pan-African community of journalists, policy experts, creatives, and cultural commentators who contribute op-eds, field stories, essays, and investigations across our platforms.',
    contributorCtaPrimary: 'Become a Contributor',
    contributorCtaSecondary: 'Editorial Guidelines',
    exchangeHeading: 'Agile Content Exchange',
    exchangeIntro:
      'A licensing and distribution platform that allows third-party media, agencies, and institutions to access and republish Agile-owned editorial content, infographics, and special features under syndication terms.',
    exchangeCta: 'Request Access to the Exchange',
    trainingHeading: 'Editorial Training & Media Development',
    trainingIntro:
      'Through the Agile Press Academy, we support the next generation of African journalists, editors, and institutional media teams with capacity-building, fellowships, and short-term consulting.',
    trainingOfferingsLabel: 'Offerings include:',
    trainingOfferingsList:
      'Media training for public information officers\nWriting workshops for communications teams\nMentorship for early-career journalists\nInstitutional storytelling strategy advisory',
    finalHeading: "Let's Publish, Amplify, and Syndicate Together",
    finalText:
      "Agile Press Group is your partner for publishing strategy, narrative positioning, and cross-border content influence. Whether you're launching a campaign, informing public policy, or branding a nation-we're your editorial ally.",
    ctaPrimary: 'Commission a Publication',
    ctaSecondary: 'Request Syndication Services',
    ctaTertiary: 'Partner on a Flagship Report',
    ctaQuaternary: 'Advertise in Our Platforms',
  },
  'sectors.page': {
    heroLabel: 'Sectors we serve',
    heroTitle: 'Expert Communications Across Institutions, Industries, and Global Issues',
    heroTagline:
      'Agile Media Solutions delivers high-impact communications across key sectors shaping Africa and the world. We work with governments, corporations, development agencies, social investors, and cultural institutions to craft narratives that reflect their values, engage their audiences, and achieve lasting outcomes.',
    sectionLabel: 'Coverage',
    sectionTitle: 'Sectors we support',
    sectionLinkLabel: 'Discuss your mandate',
    sectionIntro:
      'Our sector-specific approach ensures every message is aligned with context, policy, audience, and purpose.',
    ctaPrimary: 'Talk to a Sector Advisor',
    ctaSecondary: 'Explore Our Work',
  },
};
