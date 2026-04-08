import {
  DEFAULT_GENERAL_PHONE_DISPLAY,
  DEFAULT_GENERAL_PHONE_LABEL,
  DEFAULT_PHONE_WHATSAPP_HREF,
} from '@/lib/defaultPhoneChannel';
import { DEFAULT_HEAD_OFFICE_LINE } from '@/lib/defaultAddress';
import type { AppLocale } from '@/lib/locale';

/** Home page `useSiteSectionContent` defaults by locale (CMS overrides still win). */
export function getHomePageDefaults(locale: AppLocale) {
  return HOMES[locale] ?? HOMES.en;
}

export function getServiceHighlightDefaults(locale: AppLocale): string[] {
  return SERVICE_HIGHLIGHTS[locale] ?? SERVICE_HIGHLIGHTS.en;
}

export type FallbackService = {
  id: number;
  title: string;
  description: string;
  highlights: string;
  icon: string;
};

export function getFallbackHomeServices(locale: AppLocale): FallbackService[] {
  return FALLBACK_SERVICES[locale] ?? FALLBACK_SERVICES.en;
}

const SERVICE_HIGHLIGHTS: Record<AppLocale, string[]> = {
  en: ['Strategy and planning', 'Execution and media support', 'Monitoring and optimization'],
  fr: ['Strategie et planification', 'Execution et accompagnement medias', 'Suivi et optimisation'],
  pt: ['Estrategia e planejamento', 'Execucao e apoio de midia', 'Monitoramento e otimizacao'],
  ar: ['الاستراتيجية والتخطيط', 'التنفيذ ودعم الاعلام', 'المراقبة والتحسين'],
};

const FALLBACK_SERVICES: Record<AppLocale, FallbackService[]> = {
  en: [
    {
      id: 1,
      title: 'Strategic Communications & Narrative Building',
      description:
        'We develop tailored messaging frameworks, storytelling strategies, and communication blueprints that align with your institutional goals and public identity.',
      highlights: SERVICE_HIGHLIGHTS.en.join('\n'),
      icon: 'strategic',
    },
    {
      id: 2,
      title: 'Media Relations & Reputation Management',
      description:
        'We help you build and sustain public trust by managing perception, cultivating media relationships, and preparing for both visibility and scrutiny.',
      highlights: SERVICE_HIGHLIGHTS.en.join('\n'),
      icon: 'media-relations',
    },
    {
      id: 3,
      title: 'Campaigns, Advocacy & Stakeholder Engagement',
      description:
        'We design high-impact campaigns that mobilize audiences, shift public opinion, and influence policy or behavior across sectors.',
      highlights: SERVICE_HIGHLIGHTS.en.join('\n'),
      icon: 'campaigns',
    },
    {
      id: 4,
      title: 'Digital, Social & Multimedia Communications',
      description:
        'We deliver digital-first communications across platforms, combining strategy, design, and audience analytics for sustained engagement.',
      highlights: SERVICE_HIGHLIGHTS.en.join('\n'),
      icon: 'digital',
    },
  ],
  fr: [
    {
      id: 1,
      title: 'Communication strategique et construction de recit',
      description:
        'Nous developpons des cadres de message, des strategies de storytelling et des plans de communication alignes sur vos objectifs institutionnels et votre identite publique.',
      highlights: SERVICE_HIGHLIGHTS.fr.join('\n'),
      icon: 'strategic',
    },
    {
      id: 2,
      title: 'Relations medias et gestion de reputation',
      description:
        'Nous vous aidons a construire et maintenir la confiance du public en pilotant la perception, en cultivant les relations medias et en preparant visibilite et controverse.',
      highlights: SERVICE_HIGHLIGHTS.fr.join('\n'),
      icon: 'media-relations',
    },
    {
      id: 3,
      title: 'Campagnes, plaidoyer et engagement des parties prenantes',
      description:
        'Nous concevons des campagnes a fort impact qui mobilisent les publics, deplacent l opinion et influencent les politiques ou les comportements sectoriels.',
      highlights: SERVICE_HIGHLIGHTS.fr.join('\n'),
      icon: 'campaigns',
    },
    {
      id: 4,
      title: 'Communication numerique, sociale et multimedia',
      description:
        'Nous deployons une communication digital-first sur les plateformes, en combinant strategie, design et analyse d audience pour un engagement durable.',
      highlights: SERVICE_HIGHLIGHTS.fr.join('\n'),
      icon: 'digital',
    },
  ],
  pt: [
    {
      id: 1,
      title: 'Comunicacao estrategica e construcao de narrativa',
      description:
        'Desenvolvemos frameworks de mensagens, estrategias de storytelling e planos de comunicacao alinhados aos seus objetivos institucionais e identidade publica.',
      highlights: SERVICE_HIGHLIGHTS.pt.join('\n'),
      icon: 'strategic',
    },
    {
      id: 2,
      title: 'Relacoes com a midia e gestao de reputacao',
      description:
        'Ajudamos a construir e sustentar confianca publica gerindo percepcao, cultivando relacoes com a midia e preparando visibilidade e escrutinio.',
      highlights: SERVICE_HIGHLIGHTS.pt.join('\n'),
      icon: 'media-relations',
    },
    {
      id: 3,
      title: 'Campanhas, advocacy e engajamento de stakeholders',
      description:
        'Projetamos campanhas de alto impacto que mobilizam audiencias, mudam opiniao publica e influenciam politicas ou comportamentos entre setores.',
      highlights: SERVICE_HIGHLIGHTS.pt.join('\n'),
      icon: 'campaigns',
    },
    {
      id: 4,
      title: 'Comunicacao digital, social e multimidia',
      description:
        'Entregamos comunicacao digital-first em plataformas, combinando estrategia, design e analise de audiencia para engajamento continuo.',
      highlights: SERVICE_HIGHLIGHTS.pt.join('\n'),
      icon: 'digital',
    },
  ],
  ar: [
    {
      id: 1,
      title: 'الاتصالات الاستراتيجية وبناء السرد',
      description:
        'نطور اطر رسائل واستراتيجيات سرد وخطط اتصال تتماشى مع اهدافكم المؤسسية وهويتكم العامة.',
      highlights: SERVICE_HIGHLIGHTS.ar.join('\n'),
      icon: 'strategic',
    },
    {
      id: 2,
      title: 'العلاقات الاعلامية وادارة السمعة',
      description:
        'نساعدكم على بناء الثقة والحفاظ عليها عبر ادارة التصور وتعزيز علاقات الاعلام والاستعداد للظهور وللتدقيق.',
      highlights: SERVICE_HIGHLIGHTS.ar.join('\n'),
      icon: 'media-relations',
    },
    {
      id: 3,
      title: 'الحملات والدعوة ومشاركة اصحاب المصلحة',
      description:
        'نصمم حملات عالية الاثر تعبئ الجمهور وتغير الراي العام وتؤثر في السياسات او السلوك عبر القطاعات.',
      highlights: SERVICE_HIGHLIGHTS.ar.join('\n'),
      icon: 'campaigns',
    },
    {
      id: 4,
      title: 'الاتصال الرقمي والاجتماعي والوسائط المتعددة',
      description:
        'نقدم اتصالا رقميا اولا عبر المنصات، بدمج الاستراتيجية والتصميم وتحليل الجمهور لاشتغال مستدام.',
      highlights: SERVICE_HIGHLIGHTS.ar.join('\n'),
      icon: 'digital',
    },
  ],
};

type HomeBundle = {
  events: Record<string, string>;
  marquee: Record<string, string>;
  whoWeAre: Record<string, string>;
  servicesBand: Record<string, string>;
  brandsBand: Record<string, string>;
  caseStudiesBand: Record<string, string>;
  careersBand: Record<string, string>;
  insights: Record<string, string>;
};

const HOMES: Record<AppLocale, HomeBundle> = {
  en: {
    events: {
      label: 'Flagship Convenings',
      title: 'Signature Events',
      subtitle: 'Curated Platforms That Bring Visionaries, Innovators, and Institutions Together.',
      linkLabel: 'See all events',
      ctaPrimary: 'See Event Calendar',
      ctaSecondary: 'Partner With Us',
    },
    marquee: {
      primaryLines:
        'Strategic Storytelling\nMedia Intelligence\nCampaign Architecture\nDigital Influence\nCreative Production',
      secondaryLines:
        'Institutional trust\nCross-border narrative\nExecutive visibility\nSummit & event media\nMeasured impact',
    },
    whoWeAre: {
      label: 'About Agile',
      title: 'Who We Are',
      body:
        'We are a multidisciplinary communications agency operating at the intersection of strategy, storytelling, and public influence. From presidential campaigns to global brand launches, our work blends intelligence, creativity, and execution power—helping clients lead conversations and shape change.',
      ctaLabel: 'Learn More About Us →',
      ctaHref: '/about',
      imageUrl: '',
    },
    servicesBand: {
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
    brandsBand: {
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
    caseStudiesBand: {
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
    careersBand: {
      label: 'Talent',
      title: 'Join the Team',
      subtitle:
        "We're building a creative, strategic, and fearless team across Africa and beyond.",
      ctaPrimaryLabel: 'Explore Careers',
      ctaPrimaryHref: '/careers',
      ctaSecondaryLabel: 'Become a Contributor',
      ctaSecondaryHref: '/contact#contact',
    },
    insights: {
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
  },
  fr: {
    events: {
      label: 'Rendez-vous phares',
      title: 'Evenements signature',
      subtitle: 'Des plateformes qui reunissent visionnaires, innovateurs et institutions.',
      linkLabel: 'Tous les evenements',
      ctaPrimary: 'Voir le calendrier',
      ctaSecondary: 'Devenir partenaire',
    },
    marquee: {
      primaryLines:
        'Storytelling strategique\nIntelligence media\nArchitecture de campagne\nInfluence digitale\nProduction creative',
      secondaryLines:
        'Confiance institutionnelle\nRecit transfrontalier\nVisibilite executive\nMedias de sommets\nImpact mesure',
    },
    whoWeAre: {
      label: 'A propos d Agile',
      title: 'Qui sommes-nous',
      body:
        'Nous sommes une agence pluridisciplinaire au croisement de la strategie, du recit et de l influence publique. Des campagnes presidentielles aux lancements de marques mondiales, notre travail allie intelligence, creativite et execution pour aider nos clients a piloter la conversation et le changement.',
      ctaLabel: 'En savoir plus →',
      ctaHref: '/about',
      imageUrl: '',
    },
    servicesBand: {
      label: 'Expertises',
      title: 'Nos services',
      linkLabel: 'Tous les services',
      linkHref: '/services',
      subtitle: 'Des solutions de communication completes. Pensees strategiquement. Livrees avec precision.',
      ctaPrimaryLabel: 'Tous les services',
      ctaPrimaryHref: '/services',
      ctaSecondaryLabel: 'Demander une consultation',
      ctaSecondaryHref: '/contact#contact',
    },
    brandsBand: {
      label: 'Reseau media',
      title: 'Nos marques',
      linkLabel: 'Voir le portfolio',
      linkHref: '/brands',
      subtitle:
        'Des medias qui informent, inspirent et influencent. Agile Media Solutions possede et exploite un portfolio croissant de plateformes a fort impact qui faconnent le debat public et mettent en lumiere les secteurs cles sur le continent.',
      ctaPrimaryLabel: 'Toutes les marques',
      ctaPrimaryHref: '/brands',
      ctaSecondaryLabel: 'Annoncer avec nous',
      ctaSecondaryHref: '/contact#contact',
    },
    caseStudiesBand: {
      label: 'Projets choisis',
      title: 'Etudes de cas et temps forts',
      linkLabel: 'Voir les projets',
      linkHref: '/case-studies',
      subtitle:
        'Decouvrez nos projets de communication strategique en Afrique et a l international—campagnes transfrontalieres, communication publique et repositionnement narratif.',
      ctaPrimaryLabel: 'Voir les etudes de cas →',
      ctaPrimaryHref: '/case-studies',
      ctaSecondaryLabel: 'Lancer un projet',
      ctaSecondaryHref: '/contact#contact',
    },
    careersBand: {
      label: 'Talents',
      title: 'Rejoindre l equipe',
      subtitle:
        'Nous construisons une equipe creative, strategique et audacieuse en Afrique et au-dela.',
      ctaPrimaryLabel: 'Carrieres',
      ctaPrimaryHref: '/careers',
      ctaSecondaryLabel: 'Devenir contributeur',
      ctaSecondaryHref: '/contact#contact',
    },
    insights: {
      label: 'Presse et veille',
      title: 'Analyses et salle de presse',
      subtitle:
        'Bulletins, points presse, actualites et leadership d opinion via le groupe Agile Press.',
      linkLabel: 'Lire les mises a jour',
      linkHref: '/insights',
      ctaPrimary: 'Agile Press Group →',
      ctaPrimaryHref: '/agile-press-group',
      ctaSecondary: 'Analyses et presse',
      ctaSecondaryHref: '/insights',
    },
  },
  pt: {
    events: {
      label: 'Encontros principais',
      title: 'Eventos signature',
      subtitle: 'Plataformas que reúnem visionários, inovadores e instituições.',
      linkLabel: 'Ver todos os eventos',
      ctaPrimary: 'Ver calendário',
      ctaSecondary: 'Ser parceiro',
    },
    marquee: {
      primaryLines:
        'Storytelling estrategico\nInteligencia de midia\nArquitetura de campanha\nInfluencia digital\nProducao criativa',
      secondaryLines:
        'Confianca institucional\nNarrativa transfronteirica\nVisibilidade executiva\nMidia de eventos\nImpacto mensurado',
    },
    whoWeAre: {
      label: 'Sobre a Agile',
      title: 'Quem somos',
      body:
        'Somos uma agencia multidisciplinar na intersecao de estrategia, narrativa e influencia publica. De campanhas presidenciais a lancamentos globais de marcas, unimos inteligencia, criatividade e execucao para liderar conversas e mudancas.',
      ctaLabel: 'Saiba mais →',
      ctaHref: '/about',
      imageUrl: '',
    },
    servicesBand: {
      label: 'Capacidades',
      title: 'Nossos servicos',
      linkLabel: 'Ver todos os servicos',
      linkHref: '/services',
      subtitle: 'Solucoes de comunicacao completas. Desenhadas com estrategia. Entregues com precisao.',
      ctaPrimaryLabel: 'Ver todos os servicos',
      ctaPrimaryHref: '/services',
      ctaSecondaryLabel: 'Solicitar consulta',
      ctaSecondaryHref: '/contact#contact',
    },
    brandsBand: {
      label: 'Rede de midia',
      title: 'Nossas marcas',
      linkLabel: 'Ver portfolio',
      linkHref: '/brands',
      subtitle:
        'Propriedades de midia que informam, inspiram e influenciam. A Agile Media Solutions possui e opera um portfolio crescente de plataformas de alto impacto.',
      ctaPrimaryLabel: 'Ver todas as marcas',
      ctaPrimaryHref: '/brands',
      ctaSecondaryLabel: 'Anuncie conosco',
      ctaSecondaryHref: '/contact#contact',
    },
    caseStudiesBand: {
      label: 'Trabalhos selecionados',
      title: 'Estudos de caso em destaque',
      linkLabel: 'Ver projetos',
      linkHref: '/case-studies',
      subtitle:
        'Explore nosso portfolio de comunicacao estrategica na Africa e globalmente—campanhas transfronteiricas, comunicacao publica e reposicionamento narrativo.',
      ctaPrimaryLabel: 'Ver estudos de caso →',
      ctaPrimaryHref: '/case-studies',
      ctaSecondaryLabel: 'Iniciar um projeto',
      ctaSecondaryHref: '/contact#contact',
    },
    careersBand: {
      label: 'Talentos',
      title: 'Junte-se ao time',
      subtitle:
        'Estamos construindo um time criativo, estrategico e corajoso na Africa e alem.',
      ctaPrimaryLabel: 'Carreiras',
      ctaPrimaryHref: '/careers',
      ctaSecondaryLabel: 'Ser colaborador',
      ctaSecondaryHref: '/contact#contact',
    },
    insights: {
      label: 'Imprensa e inteligencia',
      title: 'Insights e sala de imprensa',
      subtitle:
        'Boletins, briefings, noticias e thought leadership pelo Agile Press Group.',
      linkLabel: 'Ler atualizacoes',
      linkHref: '/insights',
      ctaPrimary: 'Agile Press Group →',
      ctaPrimaryHref: '/agile-press-group',
      ctaSecondary: 'Insights e imprensa',
      ctaSecondaryHref: '/insights',
    },
  },
  ar: {
    events: {
      label: 'التجمعات الرائدة',
      title: 'فعاليات مميزة',
      subtitle: 'منصات تجمع رواد الابتكار والمؤسسات في مكان واحد.',
      linkLabel: 'كل الفعاليات',
      ctaPrimary: 'التقويم',
      ctaSecondary: 'الشراكة معنا',
    },
    marquee: {
      primaryLines:
        'سرد استراتيجي\nذكاء اعلامي\nهندسة الحملات\nتأثير رقمي\nانتاج ابداعي',
      secondaryLines:
        'ثقة مؤسسية\nسرد عابر للحدود\nظهور تنفيذي\nاعلام القمم\nاثر قابل للقياس',
    },
    whoWeAre: {
      label: 'عن Agile',
      title: 'من نحن',
      body:
        'نحن وكالة متعددة التخصصات عند تقاطع الاستراتيجية والسرد والتأثير العام. من الحملات الرئاسية الى اطلاق العلامات عالميا، نمزج الذكاء والابداع والتنفيذ لمساعدة العملاء على قيادة الحوار والتغيير.',
      ctaLabel: 'اعرف المزيد ←',
      ctaHref: '/about',
      imageUrl: '',
    },
    servicesBand: {
      label: 'القدرات',
      title: 'خدماتنا',
      linkLabel: 'كل الخدمات',
      linkHref: '/services',
      subtitle: 'حلول اتصال شاملة. مصممة استراتيجيا. ومقدمة بدقة.',
      ctaPrimaryLabel: 'كل الخدمات',
      ctaPrimaryHref: '/services',
      ctaSecondaryLabel: 'طلب استشارة',
      ctaSecondaryHref: '/contact#contact',
    },
    brandsBand: {
      label: 'شبكة الاعلام',
      title: 'علاماتنا',
      linkLabel: 'استكشف المحفظة',
      linkHref: '/brands',
      subtitle:
        'منصات اعلامية تعلم وتلهم وتؤثر. تمتلك Agile Media Solutions وتدير محفظة متنامية من المنصات عالية الاثر.',
      ctaPrimaryLabel: 'كل العلامات',
      ctaPrimaryHref: '/brands',
      ctaSecondaryLabel: 'اعلن معنا',
      ctaSecondaryHref: '/contact#contact',
    },
    caseStudiesBand: {
      label: 'اعمال مختارة',
      title: 'دراسات حالة ومقتطفات حملات',
      linkLabel: 'المشاريع',
      linkHref: '/case-studies',
      subtitle:
        'استكشف محفظتنا عبر افريقيا والعالم—حملات عابرة للحدود واتصال سياسي واعادة تموضع للسرد.',
      ctaPrimaryLabel: 'دراسات الحالة ←',
      ctaPrimaryHref: '/case-studies',
      ctaSecondaryLabel: 'ابدأ مشروعا',
      ctaSecondaryHref: '/contact#contact',
    },
    careersBand: {
      label: 'المواهب',
      title: 'انضم للفريق',
      subtitle: 'نبني فريقا مبدعا واستراتيجيا وجريئا عبر افريقيا وخارجها.',
      ctaPrimaryLabel: 'الوظائف',
      ctaPrimaryHref: '/careers',
      ctaSecondaryLabel: 'كن مساهما',
      ctaSecondaryHref: '/contact#contact',
    },
    insights: {
      label: 'الصحافة والذكاء',
      title: 'الرؤى وغرفة الصحافة',
      subtitle: 'نشرات وموجزات صحفية واخبار ورؤى عبر مجموعة Agile Press.',
      linkLabel: 'التحديثات',
      linkHref: '/insights',
      ctaPrimary: 'مجموعة Agile Press ←',
      ctaPrimaryHref: '/agile-press-group',
      ctaSecondary: 'الرؤى والصحافة',
      ctaSecondaryHref: '/insights',
    },
  },
};

export function getAboutPageDefaults(locale: AppLocale): Record<string, string> {
  return ABOUT_DEFAULTS[locale] ?? ABOUT_DEFAULTS.en;
}

const ABOUT_DEFAULTS: Record<AppLocale, Record<string, string>> = {
  en: {
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
  },
  fr: {
    heroLabel: 'A propos',
    heroTitle: 'Donner du pouvoir aux recits. Porter les voix. Creer de l impact.',
    heroTagline:
      "Agile Media Solutions est un cabinet international de medias, relations publiques et communication qui aide les gouvernements, institutions, marques et mouvements a faconner les messages qui font bouger les nations, les marches et les esprits.",
    identityLabel: 'Notre identite',
    identityTitle: 'Qui sommes-nous',
    identityP1:
      'Nous sommes une agence de communication pluridisciplinaire au carrefour de la strategie, du recit et de l influence publique. Des campagnes presidentielles aux lancements mondiaux de marques, notre travail allie intelligence, creativite et execution pour aider nos clients a mener la conversation et le changement.',
    identityP2:
      'Nos services couvrent toute la communication strategique—du message politique aux campagnes numeriques, de la gestion de crise au branding institutionnel. Nous construisons l infrastructure de communication qui permet leadership, confiance et transformation.',
    identityImageUrl: '',
    ctaPrimary: 'Decouvrir nos services',
    ctaSecondary: 'Travaillez avec nous',
    presenceLabel: 'Presence',
    presenceTitle: 'Ou nous travaillons',
    presenceSubtitle: `Adresse : ${DEFAULT_HEAD_OFFICE_LINE}. Autres bureaux : Nairobi et Johannesburg — disponibles sur plusieurs fuseaux et canaux pour echanger sur vos idees et collaborations.`,
    metaTitle: '',
    metaDescription: '',
  },
  pt: {
    heroLabel: 'Sobre',
    heroTitle: 'Impulsionando narrativas. Elevando vozes. Gerando impacto.',
    heroTagline:
      'A Agile Media Solutions e uma empresa internacional de midia, relacoes publicas e comunicacao que ajuda governos, instituicoes, marcas e movimentos a moldar as mensagens que movem nacoes, mercados e mentes.',
    identityLabel: 'Nossa identidade',
    identityTitle: 'Quem somos',
    identityP1:
      'Somos uma agencia multidisciplinar na intersecao de estrategia, narrativa e influencia publica. De campanhas presidenciais a lancamentos globais, unimos inteligencia, criatividade e execucao para liderar conversas e mudancas.',
    identityP2:
      'Nossos servicos cobrem toda a comunicacao estrategica—da mensagem politica a campanhas digitais, de PR de crise a branding institucional. Construimos a infraestrutura de comunicacao que viabiliza lideranca, confianca e transformacao.',
    identityImageUrl: '',
    ctaPrimary: 'Explorar servicos',
    ctaSecondary: 'Trabalhe conosco',
    presenceLabel: 'Presenca',
    presenceTitle: 'Onde atuamos',
    presenceSubtitle: `Endereco: ${DEFAULT_HEAD_OFFICE_LINE}. Outras localidades: Nairobi e Joanesburgo — disponiveis em varios fusos e canais para conversar sobre ideias e parcerias.`,
    metaTitle: '',
    metaDescription: '',
  },
  ar: {
    heroLabel: 'من نحن',
    heroTitle: 'نقوي السرد. نرفع الاصوات. نحقق الاثر.',
    heroTagline:
      'شركة Agile Media Solutions للاعلام والعلاقات العامة والاتصالات تساعد الحكومات والمؤسسات والعلامات والحركات على صياغة الرسائل التي تحرك الامم والاسواق والعقول.',
    identityLabel: 'هويتنا',
    identityTitle: 'من نحن',
    identityP1:
      'نحن وكالة اتصالات متعددة التخصصات عند تقاطع الاستراتيجية والسرد والتأثير العام. من الحملات الرئاسية الى اطلاق العلامات عالميا، نمزج الذكاء والابداع والتنفيذ لمساعدة العملاء على قيادة الحوار والتغيير.',
    identityP2:
      'تمتد خدماتنا على كامل الاتصال الاستراتيجي—من رسائل السياسة الى الحملات الرقمية ومن الاعلام في الازمات الى هوية المؤسسات. نبني البنية التحتية للاتصال التي تمكّن القيادة والثقة والتحول.',
    identityImageUrl: '',
    ctaPrimary: 'استكشف خدماتنا',
    ctaSecondary: 'اعمل معنا',
    presenceLabel: 'الحضور',
    presenceTitle: 'اين نعمل',
    presenceSubtitle: `العنوان: ${DEFAULT_HEAD_OFFICE_LINE}. مواقع اخرى: نيروبي وجوهانسبرغ — متاحون عبر المناطق الزمنية والقنوات لمناقشة الافكار والشراكات.`,
    metaTitle: '',
    metaDescription: '',
  },
};

export function getContactPageDefaults(locale: AppLocale): Record<string, string> {
  return CONTACT_DEFAULTS[locale] ?? CONTACT_DEFAULTS.en;
}

const CONTACT_DEFAULTS: Record<AppLocale, Record<string, string>> = {
  en: {
    heroLabel: 'Contact',
    heroTitle: "Let's Talk Strategy, Storytelling, and Solutions",
    heroIntro:
      "Whether you're ready to launch a campaign, partner on a project, or explore how Agile Media Solutions can support your brand or institution-we'd love to hear from you.",
    heroSubIntro: 'We are available across time zones and channels to discuss ideas, opportunities, and collaborations.',
    connectionsLabel: 'Connections',
    connectionsTitle: 'Get In Touch',
    connectionsLinkLabel: 'View services',
    quickBriefLabel: 'Quick Brief',
    quickBriefTitle: 'Send a message',
    quickBriefSubtitle: 'Use the form for campaigns, partnerships, media enquiries, or general questions.',
    generalCardTitle: 'General Inquiries',
    generalEmail: 'info@agilemediasolutions.com',
    generalPhoneLabel: DEFAULT_GENERAL_PHONE_LABEL,
    generalPhoneDisplay: DEFAULT_GENERAL_PHONE_DISPLAY,
    generalPhoneHref: DEFAULT_PHONE_WHATSAPP_HREF,
    generalHours: 'Monday-Friday, 9:00 AM-6:00 PM (GMT)',
    generalHeadOffice: DEFAULT_HEAD_OFFICE_LINE,
    generalLocations: 'Nairobi | Johannesburg',
    consultationCardTitle: 'Request a Consultation',
    consultationCardBody: 'Interested in our services? Fill out the consultation form below and our team will reach out within 48 hours.',
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
  fr: {
    heroLabel: 'Contact',
    heroTitle: 'Parlons strategie, recit et solutions',
    heroIntro:
      'Que vous lanciez une campagne, cherchiez un partenaire de projet ou exploriez comment Agile Media Solutions peut soutenir votre marque ou institution — ecrivez-nous.',
    heroSubIntro:
      'Nous sommes disponibles sur plusieurs fuseaux et canaux pour echanger sur idees, opportunites et collaborations.',
    connectionsLabel: 'Connexions',
    connectionsTitle: 'Entrer en contact',
    connectionsLinkLabel: 'Voir les services',
    quickBriefLabel: 'Brief rapide',
    quickBriefTitle: 'Envoyer un message',
    quickBriefSubtitle: 'Utilisez le formulaire pour campagnes, partenariats, demandes medias ou questions generales.',
    generalCardTitle: 'Demandes generales',
    generalEmail: 'info@agilemediasolutions.com',
    generalPhoneLabel: DEFAULT_GENERAL_PHONE_LABEL,
    generalPhoneDisplay: DEFAULT_GENERAL_PHONE_DISPLAY,
    generalPhoneHref: DEFAULT_PHONE_WHATSAPP_HREF,
    generalHours: 'Lundi-vendredi, 9h00-18h00 (GMT)',
    generalHeadOffice: DEFAULT_HEAD_OFFICE_LINE,
    generalLocations: 'Nairobi | Johannesburg',
    consultationCardTitle: 'Demander une consultation',
    consultationCardBody:
      'Interesse par nos services ? Remplissez le formulaire ci-dessous et notre equipe repond sous 48 heures.',
    pressCardTitle: 'Medias et presse',
    pressCardBody:
      'Pour interviews, intervenants, communiques ou acces aux sujets, ecrivez-nous sur l e-mail ci-dessus — nous orientons vers le service presse.',
    pressCardCta: 'Kit media',
    followTitle: 'Suivez-nous',
    followSubtitle:
      'Actualites, evenements, coulisses et recits sur X, LinkedIn, Instagram, YouTube et Facebook.',
    socialCta: 'Reseaux sociaux',
    finalSubtitle: 'Construisons quelque chose de significatif — ensemble.',
    finalCta: 'Contactez-nous',
  },
  pt: {
    heroLabel: 'Contato',
    heroTitle: 'Vamos falar de estrategia, narrativa e solucoes',
    heroIntro:
      'Se voce vai lancar uma campanha, buscar parceria de projeto ou entender como a Agile Media Solutions pode apoiar sua marca ou instituicao — fale conosco.',
    heroSubIntro: 'Atendemos em varios fusos e canais para ideias, oportunidades e colaboracoes.',
    connectionsLabel: 'Conexoes',
    connectionsTitle: 'Fale conosco',
    connectionsLinkLabel: 'Ver servicos',
    quickBriefLabel: 'Brief rapido',
    quickBriefTitle: 'Enviar mensagem',
    quickBriefSubtitle: 'Use o formulario para campanhas, parcerias, midia ou duvidas gerais.',
    generalCardTitle: 'Informacoes gerais',
    generalEmail: 'info@agilemediasolutions.com',
    generalPhoneLabel: DEFAULT_GENERAL_PHONE_LABEL,
    generalPhoneDisplay: DEFAULT_GENERAL_PHONE_DISPLAY,
    generalPhoneHref: DEFAULT_PHONE_WHATSAPP_HREF,
    generalHours: 'Segunda a sexta, 9h-18h (GMT)',
    generalHeadOffice: DEFAULT_HEAD_OFFICE_LINE,
    generalLocations: 'Nairobi | Joanesburgo',
    consultationCardTitle: 'Solicitar consulta',
    consultationCardBody:
      'Interessado nos servicos? Preencha o formulario abaixo e nossa equipe responde em ate 48 horas.',
    pressCardTitle: 'Midia e imprensa',
    pressCardBody:
      'Para entrevistas, palestrantes, releases ou acesso a pautas, escreva no e-mail acima — encaminhamos ao time de imprensa.',
    pressCardCta: 'Kit de midia',
    followTitle: 'Acompanhe',
    followSubtitle:
      'Atualizacoes, eventos, bastidores e historias no X, LinkedIn, Instagram, YouTube e Facebook.',
    socialCta: 'Redes sociais',
    finalSubtitle: 'Vamos construir algo significativo — juntos.',
    finalCta: 'Fale agora',
  },
  ar: {
    heroLabel: 'اتصل بنا',
    heroTitle: 'لنتحدث عن الاستراتيجية والسرد والحلول',
    heroIntro:
      'سواء اردتم اطلاق حملة او الشراكة في مشروع او استكشاف كيف تدعم Agile Media Solutions علامتكم او مؤسستكم — نسعد بسماعكم.',
    heroSubIntro: 'نوفر التوفر عبر المناطق الزمنية والقنوات لمناقشة الافكار والفرص والتعاون.',
    connectionsLabel: 'التواصل',
    connectionsTitle: 'تواصل معنا',
    connectionsLinkLabel: 'عرض الخدمات',
    quickBriefLabel: 'نبذة سريعة',
    quickBriefTitle: 'ارسال رسالة',
    quickBriefSubtitle: 'استخدموا النموذج للحملات والشراكات واستفسارات الاعلام او الاسئلة العامة.',
    generalCardTitle: 'استفسارات عامة',
    generalEmail: 'info@agilemediasolutions.com',
    generalPhoneLabel: DEFAULT_GENERAL_PHONE_LABEL,
    generalPhoneDisplay: DEFAULT_GENERAL_PHONE_DISPLAY,
    generalPhoneHref: DEFAULT_PHONE_WHATSAPP_HREF,
    generalHours: 'الاثنين-الجمعة، 9:00-18:00 (GMT)',
    generalHeadOffice: DEFAULT_HEAD_OFFICE_LINE,
    generalLocations: 'نيروبي | جوهانسبرغ',
    consultationCardTitle: 'طلب استشارة',
    consultationCardBody: 'مهتمون بخدماتنا؟ عبئوا النموذج ادناه وسيتواصل فريقنا خلال 48 ساعة.',
    pressCardTitle: 'الاعلام والصحافة',
    pressCardBody:
      'للمقابلات والمتحدثين والبيانات الصحفية او الوصول للمواضيع، راسلونا عبر البريد اعلاه وسنوصلكم لمكتب الصحافة.',
    pressCardCta: 'حزمة اعلامية',
    followTitle: 'تابعونا',
    followSubtitle: 'للتحديثات والفعاليات وما وراء الكواليس على منصات التواصل.',
    socialCta: 'روابط التواصل',
    finalSubtitle: 'لنبني معا عملا ذا معنى.',
    finalCta: 'تواصل الان',
  },
};

/** Services listing page — `useSiteSectionContent('services.page', …)` defaults. */
export function getServicesPageDefaults(locale: AppLocale): Record<string, string> {
  return SERVICES_PAGE[locale] ?? SERVICES_PAGE.en;
}

const SERVICES_PAGE: Record<AppLocale, Record<string, string>> = {
  en: {
    heroLabel: 'Services',
    heroTitle: 'Comprehensive Communications Solutions. Strategically Designed. Precisely Delivered.',
    heroIntro:
      'Agile Media Solutions offers a full suite of communications, media, and public relations services designed for governments, businesses, institutions, and mission-driven organizations. Our work blends strategic thinking, creative execution, and sectoral intelligence—ensuring our clients communicate with clarity, confidence, and purpose.',
    heroSubIntro: '',
    sectionLabel: 'Capabilities',
    sectionTitle: 'Explore our integrated service offerings',
    sectionSubtitle:
      "Need help choosing the right mix? We'll assess your goals and recommend a package that delivers real-world outcomes.",
    sectionLinkLabel: 'Book strategy call',
    ctaPrimary: 'Request a Consultation',
    ctaSecondary: 'Browse Our Case Studies',
  },
  fr: {
    heroLabel: 'Services',
    heroTitle: 'Des solutions de communication completes. Pensees strategiquement. Livrees avec precision.',
    heroIntro:
      'Agile Media Solutions propose un eventail de services de communication, medias et relations publiques pour les gouvernements, entreprises, institutions et organisations a mission. Notre travail combine strategie, creation et intelligence sectorielle — pour une communication claire, assuree et engagee.',
    heroSubIntro: '',
    sectionLabel: 'Capacites',
    sectionTitle: 'Decouvrez nos offres integrees',
    sectionSubtitle:
      'Besoin d aide pour choisir le bon mix ? Nous evaluons vos objectifs et recommandons un dispositif qui produit des resultats concrets.',
    sectionLinkLabel: 'Reserver un echange strategique',
    ctaPrimary: 'Demander une consultation',
    ctaSecondary: 'Voir nos etudes de cas',
  },
  pt: {
    heroLabel: 'Servicos',
    heroTitle: 'Solucoes integrais de comunicacao. Desenhadas com estrategia. Entregues com precisao.',
    heroIntro:
      'A Agile Media Solutions oferece comunicacao, midia e relacoes publicas para governos, empresas, instituicoes e organizacoes de missao. Unimos pensamento estrategico, execucao criativa e inteligencia setorial — para clareza, confianca e proposito na comunicacao.',
    heroSubIntro: '',
    sectionLabel: 'Capacidades',
    sectionTitle: 'Explore nossas ofertas integradas',
    sectionSubtitle:
      'Precisa de ajuda para escolher o mix certo? Avaliamos seus objetivos e indicamos um pacote com resultados reais.',
    sectionLinkLabel: 'Agendar conversa estrategica',
    ctaPrimary: 'Solicitar uma consulta',
    ctaSecondary: 'Ver estudos de caso',
  },
  ar: {
    heroLabel: 'الخدمات',
    heroTitle: 'حلول اتصال شاملة. تصميم استراتيجي. تنفيذ دقيق.',
    heroIntro:
      'تقدم Agile Media Solutions مجموعة كاملة من خدمات الاتصال والاعلام والعلاقات العامة للحكومات والشركات والمؤسسات ومنظمات المهام. نمزج التفكير الاستراتيجي والتنفيذ الابداعي والفهم القطاعي — ليتواصل عملاؤنا بوضوح وثقة وهدف.',
    heroSubIntro: '',
    sectionLabel: 'القدرات',
    sectionTitle: 'استكشفوا عروضنا المتكاملة',
    sectionSubtitle:
      'تحتاجون لمساعدة في اختيار المزيج المناسب؟ نقيّم اهدافكم ونوصي بحزمة تحقق نتائج عملية.',
    sectionLinkLabel: 'حجز جلسة استراتيجية',
    ctaPrimary: 'طلب استشارة',
    ctaSecondary: 'تصفح دراسات الحالة',
  },
};

/** Sectors listing page — `useSiteSectionContent('sectors.page', …)` defaults. */
export function getSectorsPageDefaults(locale: AppLocale): Record<string, string> {
  return SECTORS_PAGE[locale] ?? SECTORS_PAGE.en;
}

const SECTORS_PAGE: Record<AppLocale, Record<string, string>> = {
  en: {
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
  fr: {
    heroLabel: 'Secteurs',
    heroTitle: 'Une expertise communication pour institutions, industries et enjeux mondiaux',
    heroTagline:
      'Agile Media Solutions deploie une communication a fort impact dans les secteurs qui faconnent l Afrique et le monde. Avec les gouvernements, entreprises, bailleurs, investisseurs sociaux et institutions culturelles, nous construisons des recits fideles a leurs valeurs et a leurs publics.',
    sectionLabel: 'Couverture',
    sectionTitle: 'Secteurs accompagnes',
    sectionLinkLabel: 'Parler de votre mandat',
    sectionIntro:
      'Notre approche sectorielle aligne chaque message sur le contexte, les politiques, les publics et les objectifs.',
    ctaPrimary: 'Parler a un conseiller sectoriel',
    ctaSecondary: 'Decouvrir nos realisations',
  },
  pt: {
    heroLabel: 'Setores',
    heroTitle: 'Comunicacao de excelencia para instituicoes, industrias e agendas globais',
    heroTagline:
      'A Agile Media Solutions entrega comunicacao de alto impacto nos setores que moldam a Africa e o mundo. Trabalhamos com governos, empresas, agencias de desenvolvimento, investidores sociais e instituicoes culturais para narrativas alinhadas a valores, publicos e resultados duradouros.',
    sectionLabel: 'Abrangencia',
    sectionTitle: 'Setores que atendemos',
    sectionLinkLabel: 'Falar sobre seu mandato',
    sectionIntro:
      'A abordagem por setor garante mensagens alinhadas a contexto, politica, publico e proposito.',
    ctaPrimary: 'Falar com um assessor de setor',
    ctaSecondary: 'Explorar nosso trabalho',
  },
  ar: {
    heroLabel: 'القطاعات',
    heroTitle: 'اتصالات متخصصة عبر المؤسسات والصناعات والقضايا العالمية',
    heroTagline:
      'تقدم Agile Media Solutions اتصالا مؤثرا في القطاعات التي تشكل افريقيا والعالم. نعمل مع الحكومات والشركات وجهات التنمية والمستثمرين الاجتماعيين والمؤسسات الثقافية لصياغة سرد يعكس القيم ويصل للجمهور ويحقق نتائج مستدامة.',
    sectionLabel: 'التغطية',
    sectionTitle: 'القطاعات التي ندعمها',
    sectionLinkLabel: 'مناقشة التكليف',
    sectionIntro:
      'نهجنا القطاعي يضمن توافق كل رسالة مع السياق والسياسة والجمهور والهدف.',
    ctaPrimary: 'الحديث مع مستشار قطاع',
    ctaSecondary: 'استكشاف اعمالنا',
  },
};

/** Insights page — `getSiteSectionContent('insights.page', …)` defaults. */
export function getInsightsPageDefaults(locale: AppLocale): Record<string, string> {
  return INSIGHTS_PAGE[locale] ?? INSIGHTS_PAGE.en;
}

export function getInsightsPageMetadata(locale: AppLocale): { title: string; description: string } {
  return INSIGHTS_META[locale] ?? INSIGHTS_META.en;
}

const INSIGHTS_META: Record<AppLocale, { title: string; description: string }> = {
  en: {
    title: 'Insights & Press Room',
    description: 'Read insights, press updates, and media resources from Agile Media Solutions and the Agile Press Group.',
  },
  fr: {
    title: 'Analyses et salle de presse',
    description:
      'Analyses, communiques et ressources medias d Agile Media Solutions et de l Agile Press Group.',
  },
  pt: {
    title: 'Insights e sala de imprensa',
    description:
      'Insights, atualizacoes de imprensa e recursos de midia da Agile Media Solutions e do Agile Press Group.',
  },
  ar: {
    title: 'الرؤى وغرفة الصحافة',
    description: 'رؤى وتحديثات صحفية وموارد اعلامية من Agile Media Solutions ومجموعة Agile Press.',
  },
};

const INSIGHTS_PAGE: Record<AppLocale, Record<string, string>> = {
  en: {
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
      'We believe communication is a tool for shaping society—not just sharing news. Through essays, articles, and guest features, we share insights on:',
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
    featuredLabel: 'From the desk',
    featuredTitle: 'Featured briefings & analysis',
  },
  fr: {
    heroLabel: 'Analyses et presse',
    heroTitle: 'Quand la strategie rencontre le recit. Et les titres du sens.',
    heroTagline:
      'Ici Agile Media Solutions partage idees, intelligence sectorielle, analyses creatives et faits medias. Des commentaires aux campagnes, retrouvez notre regard et notre presence dans le paysage media.',
    sectionLabel: 'Redaction',
    sectionTitle: 'Analyses et salle de presse',
    sectionLinkLabel: 'Voir le groupe presse',
    insightsHeading: 'Analyses',
    insightsLead: 'Notre voix. Notre vision.',
    insightsBody:
      'La communication faconne la societe, pas seulement l information. A travers essais, articles et contributions, nous explorons :',
    insightsBullets:
      'Tendances de communication strategique en Afrique et dans le monde\nPouvoir narratif dans le commerce, les politiques et la gouvernance\nStorytelling de marque dans des secteurs sensibles ou exigeants\nConception de campagnes, innovation media et communication d impact\nMessages de direction et credibilite institutionnelle',
    insightsCtaPrimary: 'Lire nos dernieres analyses',
    insightsCtaSecondary: 'Proposer un article invite',
    pressHeading: 'Salle de presse',
    pressLead: 'Actualites, lancements et couverture medias.',
    pressBody: 'Suivez Agile Media Solutions dans l actualite et sur le terrain mediatique.',
    pressBullets:
      'Annonces et victoires clients\nKits medias d evenements et briefings de sommets\nCommuniques et prises de parole\nTribunes et lancements de campagnes\nPrix, partenariats et reconnaissances',
    pressCtaPrimary: 'Parcourir les communiques',
    pressCtaSecondary: 'Acceder aux kits medias',
    pressCtaTertiary: 'Photos et biographies dirigeants',
    supportHeading: 'Diffusion et accompagnement medias',
    supportBody:
      'Agile Media Solutions accompagne aussi redaction et diffusion de communiques et engagement medias pour certains clients via notre service Communication corporate et diffusion.',
    supportCtaPrimary: 'En savoir plus sur l accompagnement',
    supportCtaSecondary: 'Demander une aide a la diffusion',
    finalSubtitle: 'Vous voulez recevoir nos analyses en premier ?',
    finalCta: "S'abonner a l'Agile Brief",
    featuredLabel: 'Du bureau',
    featuredTitle: 'Analyses et briefings a la une',
  },
  pt: {
    heroLabel: 'Insights e imprensa',
    heroTitle: 'Onde estrategia encontra narrativa. E manchetes ganham significado.',
    heroTagline:
      'Aqui a Agile Media Solutions compartilha ideias, inteligencia setorial, insights criativos e destaques de midia. De comentarios a cobertura de campanhas — nossa perspectiva e presenca no ecossistema de midia.',
    sectionLabel: 'Mesa editorial',
    sectionTitle: 'Insights e sala de imprensa',
    sectionLinkLabel: 'Visitar grupo de imprensa',
    insightsHeading: 'Insights',
    insightsLead: 'Nossa voz. Nossa visao.',
    insightsBody:
      'Comunicacao molda sociedade — nao e so noticia. Em artigos e colaboracoes, refletimos sobre:',
    insightsBullets:
      'Tendencias de comunicacao estrategica na Africa e no mundo\nPoder narrativo em comercio, politicas e governanca\nStorytelling de marca em setores complexos ou de alta confianca\nDesign de campanhas, inovacao em midia e comunicacao de impacto\nMensagens de lideranca e credibilidade institucional',
    insightsCtaPrimary: 'Ler nossos ultimos insights',
    insightsCtaSecondary: 'Enviar artigo convidado',
    pressHeading: 'Sala de imprensa',
    pressLead: 'Noticias, lancamentos e cobertura.',
    pressBody: 'Acompanhe a Agile Media Solutions na midia e nos registros publicos.',
    pressBullets:
      'Anuncios e conquistas de clientes\nKits de midia de eventos e briefings de summits\nReleases e mencoes a lideres\nArtigos de executivos e lancamentos de campanhas\nPremios, parcerias e reconhecimentos',
    pressCtaPrimary: 'Ver releases',
    pressCtaSecondary: 'Acessar kits de midia',
    pressCtaTertiary: 'Baixar fotos e biografias',
    supportHeading: 'Apoio a circulacao na midia',
    supportBody:
      'A Agile Media Solutions tambem apoia redacao e distribuicao de releases e engajamento com a midia para clientes selecionados pelo servico de Comunicacao corporativa e circulacao.',
    supportCtaPrimary: 'Saiba mais sobre o apoio a midia',
    supportCtaSecondary: 'Pedir ajuda em distribuicao',
    finalSubtitle: 'Quer receber nossos insights em primeira mao?',
    finalCta: 'Assinar o Agile Brief',
    featuredLabel: 'Da mesa',
    featuredTitle: 'Briefings e analises em destaque',
  },
  ar: {
    heroLabel: 'الرؤى وغرفة الصحافة',
    heroTitle: 'حيث تلتقي الاستراتيجية بالسرد. وتكتسب العناوين معنى.',
    heroTagline:
      'هنا تشارك Agile Media Solutions افكارا ورؤى قطاعية وتحليلات ابداعية وتغطيات اعلامية. من التعليق الى تغطية الحملات — منظورنا وحضورنا في المشهد الاعلامي.',
    sectionLabel: 'محرر الرأي',
    sectionTitle: 'الرؤى وغرفة الصحافة',
    sectionLinkLabel: 'زيارة مجموعة الصحافة',
    insightsHeading: 'الرؤى',
    insightsLead: 'صوتنا. رؤيتنا.',
    insightsBody:
      'نعتبر الاتصال أداة لتشكيل المجتمع لا لنقل الاخبار فقط. عبر المقالات والمساهمات نناقش:',
    insightsBullets:
      'اتجاهات الاتصال الاستراتيجي في افريقيا والعالم\nقوة السرد في التجارة والسياسات والحوكمة\nسرد العلامات في قطاعات معقدة أو عالية الثقة\nتصميم الحملات والابتكار الاعلامي واتصال الاثر\nرسائل القيادة والمصداقية المؤسسية',
    insightsCtaPrimary: 'اقرأوا احدث الرؤى',
    insightsCtaSecondary: 'تقديم مقال ضيف',
    pressHeading: 'غرفة الصحافة',
    pressLead: 'اخبار واطلاقات وتغطية اعلامية.',
    pressBody: 'تابعوا Agile Media Solutions في الاخبار والسجل العلني.',
    pressBullets:
      'اعلانات ونجاحات عملاء\nحزم اعلامية للفعاليات وملخصات القمم\nبيانات صحفية وذكر للقادة\nمقالات تنفيذية واطلاق حملات\nجوائز وشراكات وتكريمات',
    pressCtaPrimary: 'تصفح البيانات الصحفية',
    pressCtaSecondary: 'الوصول لحزم الاعلام',
    pressCtaTertiary: 'تحميل صور وتعريف للقادة',
    supportHeading: 'دعم التوزيع الاعلامي',
    supportBody:
      'تسهل Agile Media Solutions ايضا كتابة البيانات الصحفية وتوزيعها والتفاعل مع الاعلام لعملاء مختارين عبر خدمة الاتصال المؤسسي والتوزيع.',
    supportCtaPrimary: 'المزيد عن دعم الاعلام',
    supportCtaSecondary: 'طلب مساعدة في التوزيع',
    finalSubtitle: 'تريدون ان تصلكم الرؤى اولا؟',
    finalCta: 'الاشتراك في Agile Brief',
    featuredLabel: 'من المكتب',
    featuredTitle: 'موجزات وتحليلات مميزة',
  },
};
