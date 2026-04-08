import { type AppLocale, withLocalePrefix } from '@/lib/locale';

type Messages = {
  workWithUs: string;
  toggleMenu: string;
  closeMenu: string;
  navHome: string;
  navAbout: string;
  navAboutUs: string;
  navSectors: string;
  navPartnerships: string;
  navServices: string;
  navAllServices: string;
  navDigitalEngagement: string;
  navStudio: string;
  navMediaBrands: string;
  navInsights: string;
  navPressRoom: string;
  navAgilePressGroup: string;
  navCaseStudies: string;
  navEvents: string;
  navCareers: string;
  navContact: string;
  privacy: string;
  terms: string;
  cookies: string;
  rightsReserved: string;
  newsletterHeading: string;
  newsletterBody: string;
  footerCompany: string;
  footerPressRoom: string;
  footerContactLegal: string;
  topBarEmailAria: string;
  topBarPhoneAria: string;
  learnMore: string;
  ariaMarqueeBrand: string;
  ariaMarqueeInstitutional: string;
  ariaSocialChannels: string;
  newsletterEmailLabel: string;
  newsletterSubscribe: string;
  newsletterSubscribing: string;
  newsletterSuccess: string;
  newsletterError: string;
  newsletterPrivacyPrefix: string;
  newsletterPrivacyLink: string;
  contactFieldEmail: string;
  contactFieldHours: string;
  contactFieldAddress: string;
  contactFieldLocations: string;
  heroKicker: string;
  heroExploreBrands: string;
  heroFallbackTitle: string;
  heroFallbackSubtitle: string;
  legalContactPageLink: string;
  legalContactUsLink: string;
  legalCookieNoticeLink: string;
  servicesCardFallbackDesc: string;
};

const MESSAGES: Record<AppLocale, Messages> = {
  en: {
    workWithUs: 'Work With Us',
    toggleMenu: 'Toggle Menu',
    closeMenu: 'Close menu',
    navHome: 'Home',
    navAbout: 'About',
    navAboutUs: 'About us',
    navSectors: 'Sectors',
    navPartnerships: 'Partnerships',
    navServices: 'Services',
    navAllServices: 'All services',
    navDigitalEngagement: 'Digital engagement',
    navStudio: 'Studio',
    navMediaBrands: 'Media & brands',
    navInsights: 'Insights',
    navPressRoom: 'Press room',
    navAgilePressGroup: 'Agile Press Group',
    navCaseStudies: 'Case studies',
    navEvents: 'Events',
    navCareers: 'Careers',
    navContact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
    rightsReserved: 'All rights reserved.',
    newsletterHeading: 'Newsletter',
    newsletterBody: 'Subscribe to the Agile Brief—our monthly roundup of ideas, strategy, and news. No spam.',
    footerCompany: 'Company',
    footerPressRoom: 'Press room',
    footerContactLegal: 'Contact & legal',
    topBarEmailAria: 'Email',
    topBarPhoneAria: 'Phone or WhatsApp',
    learnMore: 'Learn more →',
    ariaMarqueeBrand: 'Brand statement ticker',
    ariaMarqueeInstitutional: 'Institutional focus areas',
    ariaSocialChannels: 'Social channels',
    newsletterEmailLabel: 'Email',
    newsletterSubscribe: 'Subscribe',
    newsletterSubscribing: 'Subscribing…',
    newsletterSuccess: 'You are subscribed. Thanks.',
    newsletterError: 'Could not subscribe. Check your connection and try again.',
    newsletterPrivacyPrefix: 'We use your email only for this list. See our',
    newsletterPrivacyLink: 'privacy policy',
    contactFieldEmail: 'Email',
    contactFieldHours: 'Hours',
    contactFieldAddress: 'Address',
    contactFieldLocations: 'Additional locations',
    heroKicker: 'Creative Communications Studio',
    heroExploreBrands: 'Explore Our Brands',
    heroFallbackTitle: 'Powering Narratives. Elevating Voices. Driving Impact.',
    heroFallbackSubtitle:
      'Agile Media Solutions is an international media, PR, and communications firm helping governments, institutions, brands, and movements shape the messages that move nations, markets, and minds.',
    legalContactPageLink: 'contact page',
    legalContactUsLink: 'Contact us',
    legalCookieNoticeLink: 'cookie notice',
    servicesCardFallbackDesc:
      'Comprehensive communications support tailored to your mission and audience.',
  },
  fr: {
    workWithUs: 'Travaillez avec nous',
    toggleMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    navHome: 'Accueil',
    navAbout: 'A propos',
    navAboutUs: 'Qui sommes-nous',
    navSectors: 'Secteurs',
    navPartnerships: 'Partenariats',
    navServices: 'Services',
    navAllServices: 'Tous les services',
    navDigitalEngagement: 'Engagement digital',
    navStudio: 'Studio',
    navMediaBrands: 'Medias et marques',
    navInsights: 'Analyses',
    navPressRoom: 'Presse',
    navAgilePressGroup: 'Agile Press Group',
    navCaseStudies: 'Etudes de cas',
    navEvents: 'Evenements',
    navCareers: 'Carrieres',
    navContact: 'Contact',
    privacy: 'Confidentialite',
    terms: "Conditions d'utilisation",
    cookies: 'Cookies',
    rightsReserved: 'Tous droits reserves.',
    newsletterHeading: 'Newsletter',
    newsletterBody: "Abonnez-vous a l'Agile Brief, notre resume mensuel d'idees, de strategie et d'actualites.",
    footerCompany: 'Entreprise',
    footerPressRoom: 'Salle de presse',
    footerContactLegal: 'Contact et legal',
    topBarEmailAria: 'E-mail',
    topBarPhoneAria: 'Telephone ou WhatsApp',
    learnMore: 'En savoir plus →',
    ariaMarqueeBrand: 'Bandeau de marque',
    ariaMarqueeInstitutional: 'Domaines institutionnels',
    ariaSocialChannels: 'Reseaux sociaux',
    newsletterEmailLabel: 'E-mail',
    newsletterSubscribe: "S'abonner",
    newsletterSubscribing: 'Inscription…',
    newsletterSuccess: 'Vous etes inscrit. Merci.',
    newsletterError: "Impossible de s'inscrire. Verifiez votre connexion.",
    newsletterPrivacyPrefix: 'Nous utilisons votre e-mail uniquement pour cette liste. Consultez notre',
    newsletterPrivacyLink: 'politique de confidentialite',
    contactFieldEmail: 'E-mail',
    contactFieldHours: 'Horaires',
    contactFieldAddress: 'Adresse',
    contactFieldLocations: 'Autres bureaux',
    heroKicker: 'Studio de communication creative',
    heroExploreBrands: 'Decouvrir nos marques',
    heroFallbackTitle: 'Donner du pouvoir aux recits. Porter les voix. Creer de l impact.',
    heroFallbackSubtitle:
      "Agile Media Solutions est un cabinet international de medias, relations publiques et communication qui aide les gouvernements, institutions, marques et mouvements a faconner les messages qui font bouger les nations, les marches et les esprits.",
    legalContactPageLink: 'page contact',
    legalContactUsLink: 'Contactez-nous',
    legalCookieNoticeLink: 'notice cookies',
    servicesCardFallbackDesc:
      'Un accompagnement communication complet, adapte a votre mission et a vos publics.',
  },
  pt: {
    workWithUs: 'Trabalhe conosco',
    toggleMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    navHome: 'Inicio',
    navAbout: 'Sobre',
    navAboutUs: 'Sobre nos',
    navSectors: 'Setores',
    navPartnerships: 'Parcerias',
    navServices: 'Servicos',
    navAllServices: 'Todos os servicos',
    navDigitalEngagement: 'Engajamento digital',
    navStudio: 'Studio',
    navMediaBrands: 'Midia e marcas',
    navInsights: 'Insights',
    navPressRoom: 'Sala de imprensa',
    navAgilePressGroup: 'Agile Press Group',
    navCaseStudies: 'Estudos de caso',
    navEvents: 'Eventos',
    navCareers: 'Carreiras',
    navContact: 'Contato',
    privacy: 'Privacidade',
    terms: 'Termos',
    cookies: 'Cookies',
    rightsReserved: 'Todos os direitos reservados.',
    newsletterHeading: 'Newsletter',
    newsletterBody: 'Assine o Agile Brief, nosso resumo mensal de ideias, estrategia e noticias.',
    footerCompany: 'Empresa',
    footerPressRoom: 'Sala de imprensa',
    footerContactLegal: 'Contato e legal',
    topBarEmailAria: 'E-mail',
    topBarPhoneAria: 'Telefone ou WhatsApp',
    learnMore: 'Saiba mais →',
    ariaMarqueeBrand: 'Faixa de mensagem da marca',
    ariaMarqueeInstitutional: 'Areas de foco institucional',
    ariaSocialChannels: 'Canais sociais',
    newsletterEmailLabel: 'E-mail',
    newsletterSubscribe: 'Inscrever',
    newsletterSubscribing: 'Inscrevendo…',
    newsletterSuccess: 'Inscricao confirmada. Obrigado.',
    newsletterError: 'Nao foi possivel inscrever. Verifique sua conexao.',
    newsletterPrivacyPrefix: 'Usamos seu e-mail apenas para esta lista. Veja nossa',
    newsletterPrivacyLink: 'politica de privacidade',
    contactFieldEmail: 'E-mail',
    contactFieldHours: 'Horario',
    contactFieldAddress: 'Endereco',
    contactFieldLocations: 'Outras localidades',
    heroKicker: 'Estudio de comunicacao criativa',
    heroExploreBrands: 'Conheca nossas marcas',
    heroFallbackTitle: 'Impulsionando narrativas. Elevando vozes. Gerando impacto.',
    heroFallbackSubtitle:
      'A Agile Media Solutions e uma empresa internacional de midia, relacoes publicas e comunicacao que ajuda governos, instituicoes, marcas e movimentos a moldar as mensagens que movem nacoes, mercados e mentes.',
    legalContactPageLink: 'pagina de contato',
    legalContactUsLink: 'Entre em contato',
    legalCookieNoticeLink: 'aviso de cookies',
    servicesCardFallbackDesc:
      'Apoio de comunicacao abrangente alinhado a sua missao e ao seu publico.',
  },
  ar: {
    workWithUs: 'اعمل معنا',
    toggleMenu: 'افتح القائمة',
    closeMenu: 'اغلق القائمة',
    navHome: 'الرئيسية',
    navAbout: 'من نحن',
    navAboutUs: 'عن الشركة',
    navSectors: 'القطاعات',
    navPartnerships: 'الشراكات',
    navServices: 'الخدمات',
    navAllServices: 'كل الخدمات',
    navDigitalEngagement: 'التفاعل الرقمي',
    navStudio: 'الاستوديو',
    navMediaBrands: 'الاعلام والعلامات',
    navInsights: 'الرؤى',
    navPressRoom: 'غرفة الصحافة',
    navAgilePressGroup: 'مجموعة Agile Press',
    navCaseStudies: 'دراسات حالة',
    navEvents: 'الفعاليات',
    navCareers: 'الوظائف',
    navContact: 'اتصل بنا',
    privacy: 'الخصوصية',
    terms: 'الشروط',
    cookies: 'ملفات تعريف الارتباط',
    rightsReserved: 'جميع الحقوق محفوظة.',
    newsletterHeading: 'النشرة البريدية',
    newsletterBody: 'اشترك في Agile Brief، ملخصنا الشهري للأفكار والاستراتيجية والأخبار.',
    footerCompany: 'الشركة',
    footerPressRoom: 'غرفة الصحافة',
    footerContactLegal: 'الاتصال والقانوني',
    topBarEmailAria: 'البريد الالكتروني',
    topBarPhoneAria: 'الهاتف او واتساب',
    learnMore: 'اعرف المزيد ←',
    ariaMarqueeBrand: 'شريط عبارة العلامة',
    ariaMarqueeInstitutional: 'مجالات التركيز المؤسسي',
    ariaSocialChannels: 'قنوات التواصل الاجتماعي',
    newsletterEmailLabel: 'البريد الالكتروني',
    newsletterSubscribe: 'اشترك',
    newsletterSubscribing: 'جاري الاشتراك…',
    newsletterSuccess: 'تم الاشتراك. شكرا لك.',
    newsletterError: 'تعذر الاشتراك. تحقق من الاتصال وحاول مجددا.',
    newsletterPrivacyPrefix: 'نستخدم بريدك فقط لهذه القائمة. اطلع على',
    newsletterPrivacyLink: 'سياسة الخصوصية',
    contactFieldEmail: 'البريد',
    contactFieldHours: 'ساعات العمل',
    contactFieldAddress: 'العنوان',
    contactFieldLocations: 'مواقع اخرى',
    heroKicker: 'استوديو اتصالات ابداعية',
    heroExploreBrands: 'استكشف علاماتنا',
    heroFallbackTitle: 'نقوي السرد. نرفع الاصوات. نحقق الاثر.',
    heroFallbackSubtitle:
      'شركة Agile Media Solutions للاعلام والعلاقات العامة والاتصالات تساعد الحكومات والمؤسسات والعلامات والحركات على صياغة الرسائل التي تحرك الامم والاسواق والعقول.',
    legalContactPageLink: 'صفحة الاتصال',
    legalContactUsLink: 'راسلونا',
    legalCookieNoticeLink: 'إشعار ملفات تعريف الارتباط',
    servicesCardFallbackDesc: 'دعم اتصال شامل يتوافق مع مهمتكم وجمهوركم.',
  },
};

export function t(locale: AppLocale, key: keyof Messages): string {
  return MESSAGES[locale][key] ?? MESSAGES.en[key];
}

export function localizeHref(href: string, locale: AppLocale): string {
  if (!href || href.startsWith('#')) return href;
  if (/^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) return href;
  if (!href.startsWith('/')) return href;

  const [pathAndQuery, hash = ''] = href.split('#');
  const localizedPath = withLocalePrefix(pathAndQuery || '/', locale);
  return hash ? `${localizedPath}#${hash}` : localizedPath;
}
