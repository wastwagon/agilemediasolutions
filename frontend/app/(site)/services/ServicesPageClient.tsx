'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import { type AppLocale } from '@/lib/locale';
import { useLocale } from '@/components/LocaleProvider';
import { getServicesPageDefaults } from '@/lib/i18n/pageDefaults';
import { localizeHref, t } from '@/lib/i18n';
import { useSiteSectionContent } from '@/lib/siteSectionCms';

type ServiceItem = {
  id: number;
  icon?: string | null;
  title: string;
  description?: string | null;
  highlights?: string | null;
  order_index?: number | null;
};

const DOCUMENT_SERVICES: { icon: string; title: string; description: string }[] = [
  {
    icon: 'strategic',
    title: 'Strategic Communications & Narrative Building',
    description:
      'We develop tailored messaging frameworks, storytelling strategies, and communication blueprints that align with your institutional goals and public identity. Includes: Message mapping, speechwriting, narrative architecture, and positioning strategies.',
  },
  {
    icon: 'media-relations',
    title: 'Media Relations & Reputation Management',
    description:
      'We help you build and sustain public trust by managing perception, cultivating media relationships, and preparing for both visibility and scrutiny. Includes: Press engagement, media training, crisis response, reputation recovery.',
  },
  {
    icon: 'campaigns',
    title: 'Campaigns, Advocacy & Stakeholder Engagement',
    description:
      'We design high-impact campaigns that mobilize audiences, shift public opinion, and influence policy or behavior. Includes: Advocacy communications, civic mobilization, stakeholder mapping, and coalition engagement.',
  },
  {
    icon: 'digital',
    title: 'Digital, Social & Multimedia Communications',
    description:
      'We deliver digital-first communications across platforms—combining content strategy, design, and audience analytics for sustained engagement. Includes: Social media strategy, influencer integration, video content, community management.',
  },
  {
    icon: 'branding',
    title: 'Branding, Design & Identity Systems',
    description:
      'We build powerful brand identities that reflect your vision and connect meaningfully with your audience. Includes: Visual identity, brand messaging, institutional rebranding, graphic design.',
  },
  {
    icon: 'events',
    title: 'Event Media & Summit Support',
    description:
      'We provide complete media support for events—from press handling and content creation to live coverage and post-event promotion. Includes: Media kits, live production, speaker preparation, and summit communications.',
  },
  {
    icon: 'esg',
    title: 'Investor, Donor & ESG Communications',
    description:
      'We help you communicate value, transparency, and vision to investors, funders, and strategic partners. Includes: ESG reports, donor briefings, impact storytelling, investor decks.',
  },
  {
    icon: 'insights',
    title: 'Insights, Monitoring & Performance Measurement',
    description:
      'We equip you with real-time intelligence and performance analysis to track progress, evaluate reach, and optimize strategies. Includes: Media monitoring, audience analytics, sentiment analysis, reporting dashboards.',
  },
  {
    icon: 'advisory',
    title: 'Advisory, Training & Institutional Capacity Building',
    description:
      'We build in-house communication capacity through advisory support, coaching, and strategic audits. Includes: Executive communications coaching, staff training, department strategy planning.',
  },
  {
    icon: 'diplomacy',
    title: 'Influence Strategy & Public Diplomacy',
    description:
      'We support governments, embassies, and regional bodies in shaping international narratives and building soft power. Includes: Diplomatic campaigns, narrative repositioning, multilateral engagement.',
  },
  {
    icon: 'ai',
    title: 'AI & Innovation Lab',
    description:
      'We leverage the latest tools in content automation, predictive analytics, and immersive media to keep our clients at the forefront of communications. Includes: AI-assisted content, AR/VR experiences, digital production systems.',
  },
  {
    icon: 'policy',
    title: 'Policy & Legislative Communications',
    description:
      'We translate complex legal and policy content into compelling public narratives that inform, engage, and persuade. Includes: Policy brief translation, public rollout strategies, legislative PR.',
  },
  {
    icon: 'market',
    title: 'Market Entry & Investor Onboarding Communications',
    description:
      'We help international brands and investors navigate new markets with culturally aware, locally resonant communications strategies. Includes: Market reputation mapping, regulator engagement messaging, localization support.',
  },
  {
    icon: 'corporate',
    title: 'Corporate Communications & Media Circulation',
    description:
      'We manage formal and institutional messaging across internal and external channels—ensuring consistency, clarity, and compliance. Includes: Press releases, internal memos, regulatory disclosures, and executive communications.',
  },
  {
    icon: 'studio',
    title: 'Studio Services: Production, Design & Content Creation',
    description:
      'Our in-house creative studio produces world-class visuals, video, photography, and multimedia content tailored to your audience and brand. Includes: Documentary production, brand videos, photography, post-production.',
  },
];

const SERVICE_TRANSLATIONS: Record<Exclude<AppLocale, 'en'>, Record<string, { title: string; description: string }>> = {
  fr: {
    strategic: {
      title: 'Communication strategique et construction narrative',
      description:
        'Cadres de messages, storytelling et architecture narrative alignes sur vos objectifs institutionnels.',
    },
    'media-relations': {
      title: 'Relations medias et gestion de reputation',
      description: 'Visibilite, engagement presse, preparation des porte-paroles et reponse en situation sensible.',
    },
    campaigns: {
      title: 'Campagnes, plaidoyer et mobilisation',
      description: 'Conception de campagnes a fort impact pour mobiliser les publics et influencer les comportements.',
    },
    digital: {
      title: 'Communication digitale, sociale et multimedia',
      description: 'Strategie de contenu multi-plateformes, creation, analytics et animation de communaute.',
    },
    branding: {
      title: 'Branding, design et systemes d identite',
      description: 'Identites visuelles et narratives coherentes pour renforcer memorisation et confiance.',
    },
    events: {
      title: 'Couverture media d evenements et sommets',
      description: 'Accompagnement complet avant, pendant et apres evenement: presse, contenus et diffusion.',
    },
    esg: {
      title: 'Communication investisseurs, bailleurs et ESG',
      description: 'Recits d impact, transparence et argumentaires pour investisseurs et partenaires.',
    },
    insights: {
      title: 'Veille, insights et mesure de performance',
      description: 'Suivi media, analyse d audience, sentiment et tableaux de bord decisionnels.',
    },
    advisory: {
      title: 'Conseil, formation et renforcement institutionnel',
      description: 'Coaching dirigeants, formation equipes et audits strategiques de communication.',
    },
    diplomacy: {
      title: 'Strategie d influence et diplomatie publique',
      description: 'Narratifs internationaux, repositionnement et engagements multi-acteurs.',
    },
    ai: {
      title: 'Laboratoire IA et innovation',
      description: 'Automatisation de contenu, experimentation immersive et outils de production avances.',
    },
    policy: {
      title: 'Communication des politiques publiques et legislation',
      description: 'Traduction de sujets juridiques complexes en messages clairs et actionnables.',
    },
    market: {
      title: 'Entree de marche et onboarding investisseurs',
      description: 'Communication de deploiement adaptee aux contextes locaux et aux parties prenantes.',
    },
    corporate: {
      title: 'Communication corporate et circulation media',
      description: 'Messages institutionnels coherents pour canaux internes et externes.',
    },
    studio: {
      title: 'Studio: production, design et creation de contenu',
      description: 'Video, photo, design et contenus multimedia produits sur mesure pour vos audiences.',
    },
  },
  pt: {
    strategic: {
      title: 'Comunicacao estrategica e construcao de narrativa',
      description: 'Frameworks de mensagem, storytelling e arquitetura narrativa alinhados aos objetivos.',
    },
    'media-relations': {
      title: 'Relacoes com a midia e gestao de reputacao',
      description: 'Visibilidade, relacionamento com imprensa e preparo para momentos de escrutinio.',
    },
    campaigns: {
      title: 'Campanhas, advocacy e engajamento',
      description: 'Campanhas de alto impacto para mobilizar audiencias e influenciar comportamento.',
    },
    digital: {
      title: 'Comunicacao digital, social e multimidia',
      description: 'Estrategia de conteudo multiplataforma com criacao, distribuicao e analise.',
    },
    branding: {
      title: 'Branding, design e sistemas de identidade',
      description: 'Identidade visual e narrativa para fortalecer reconhecimento e confianca.',
    },
    events: {
      title: 'Suporte de midia para eventos e cúpulas',
      description: 'Gestao de imprensa, conteudo e cobertura ao vivo antes, durante e depois do evento.',
    },
    esg: {
      title: 'Comunicacao para investidores, doadores e ESG',
      description: 'Narrativas de impacto, transparencia e posicionamento para parceiros estrategicos.',
    },
    insights: {
      title: 'Insights, monitoramento e medicao de desempenho',
      description: 'Monitoramento de midia, analytics de audiencia e dashboards para tomada de decisao.',
    },
    advisory: {
      title: 'Consultoria, treinamento e fortalecimento institucional',
      description: 'Coaching executivo, formacao de equipes e planejamento estrategico.',
    },
    diplomacy: {
      title: 'Estrategia de influencia e diplomacia publica',
      description: 'Construcao de narrativas internacionais e engajamento multilateral.',
    },
    ai: {
      title: 'Laboratorio de IA e inovacao',
      description: 'Automacao de conteudo, experiencias imersivas e novos sistemas de producao.',
    },
    policy: {
      title: 'Comunicacao de politicas e legislacao',
      description: 'Transformamos conteudo tecnico em mensagens claras para publico e decisores.',
    },
    market: {
      title: 'Entrada em mercado e onboarding de investidores',
      description: 'Comunicacao adaptada ao contexto local para lancamentos e expansao.',
    },
    corporate: {
      title: 'Comunicacao corporativa e circulacao de midia',
      description: 'Mensagens institucionais consistentes em canais internos e externos.',
    },
    studio: {
      title: 'Servicos de estudio: producao, design e conteudo',
      description: 'Video, fotografia e criacao multimidia para campanhas e narrativas de marca.',
    },
  },
  ar: {
    strategic: {
      title: 'الاتصال الاستراتيجي وبناء السرد',
      description: 'نطور اطر الرسائل واستراتيجيات السرد بما يتماشى مع اهدافكم المؤسسية.',
    },
    'media-relations': {
      title: 'العلاقات الاعلامية وادارة السمعة',
      description: 'نعزز الثقة العامة عبر ادارة الظهور الاعلامي والاستعداد للحظات التدقيق.',
    },
    campaigns: {
      title: 'الحملات والمناصرة واشراك الجهات المعنية',
      description: 'نصمم حملات مؤثرة تحرك الجمهور وتدعم التغيير في السلوك والسياسات.',
    },
    digital: {
      title: 'الاتصال الرقمي والاجتماعي ومتعدد الوسائط',
      description: 'استراتيجية محتوى شاملة عبر المنصات مع تصميم وتحليل وتفاعل مجتمعي.',
    },
    branding: {
      title: 'الهوية والعلامة والتصميم',
      description: 'نبني هويات بصرية ورسائل علامة تعكس الرؤية وتتصل بالجمهور بوضوح.',
    },
    events: {
      title: 'الدعم الاعلامي للفعاليات والقمم',
      description: 'تغطية اعلامية متكاملة من التجهيز الصحفي حتى البث والترويج بعد الحدث.',
    },
    esg: {
      title: 'اتصال المستثمرين والمانحين ومعايير ESG',
      description: 'نقل القيمة والشفافية والاثر للممولين والشركاء الاستراتيجيين.',
    },
    insights: {
      title: 'الرصد والتحليلات وقياس الاداء',
      description: 'متابعة اعلامية وتحليل جمهور ومؤشرات اداء تدعم قرارات الاتصال.',
    },
    advisory: {
      title: 'الاستشارات والتدريب وبناء القدرات المؤسسية',
      description: 'تدريب الفرق وقياداتها وتعزيز الجاهزية المؤسسية في الاتصال.',
    },
    diplomacy: {
      title: 'استراتيجية التأثير والدبلوماسية العامة',
      description: 'دعم الحكومات والهيئات في صياغة روايات دولية وبناء قوة ناعمة.',
    },
    ai: {
      title: 'مختبر الذكاء الاصطناعي والابتكار',
      description: 'توظيف ادوات حديثة للأتمتة والتحليلات والتجارب الرقمية المتقدمة.',
    },
    policy: {
      title: 'اتصال السياسات والتشريعات',
      description: 'تبسيط المحتوى القانوني والسياساتي وتحويله الى رسائل عامة مؤثرة.',
    },
    market: {
      title: 'اتصال دخول الاسواق وتهيئة المستثمرين',
      description: 'استراتيجيات تواصل محلية الوقع لدعم التوسع وبناء الثقة في السوق.',
    },
    corporate: {
      title: 'الاتصال المؤسسي وتوزيع المحتوى الاعلامي',
      description: 'رسائل رسمية متسقة عبر القنوات الداخلية والخارجية.',
    },
    studio: {
      title: 'خدمات الاستوديو: انتاج وتصميم وصناعة محتوى',
      description: 'فيديو وتصوير وتصميم ومحتوى ابداعي مخصص للجمهور والهوية.',
    },
  },
};

function getDocumentServices(locale: AppLocale): { icon: string; title: string; description: string }[] {
  if (locale === 'en') return DOCUMENT_SERVICES;
  const copy = SERVICE_TRANSLATIONS[locale];
  return DOCUMENT_SERVICES.map((service) => {
    const translated = copy[service.icon];
    if (!translated) return service;
    return { ...service, title: translated.title, description: translated.description };
  });
}

const INCLUDES_MARKERS = [
  'Includes:',
  'Inclut :',
  'Inclut:',
  'Inclui:',
  'Inclui :',
  'يشمل:',
  'يتضمن:',
] as const;

function parseHighlightsFromIncludes(description?: string | null): string[] {
  if (!description) return [];
  for (const marker of INCLUDES_MARKERS) {
    const idx = description.indexOf(marker);
    if (idx >= 0) {
      return description
        .slice(idx + marker.length)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3);
    }
  }
  return [];
}

function parseServiceHighlights(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function normalizeServiceIconToken(icon?: string | null) {
  if (!icon) return '';
  const trimmed = icon.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
    return '';
  }
  return trimmed
    .toLowerCase()
    .replace(/^service-img-/, '')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function resolveServiceImage(icon?: string | null) {
  if (!icon) return { imageUrl: '', imageClass: 'service-img-strategic' };
  const trimmed = icon.trim();
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
    return { imageUrl: trimmed, imageClass: '' };
  }
  const normalized = normalizeServiceIconToken(trimmed);
  return { imageUrl: '', imageClass: normalized ? `service-img-${normalized}` : 'service-img-strategic' };
}

export default function ServicesPageClient() {
  const locale = useLocale();
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        setServices(data as ServiceItem[]);
      } catch {
        // Keep static fallback content if API is unavailable.
      }
    };
    loadServices();
  }, []);

  const renderedServices: ServiceItem[] =
    services.length > 0
      ? services
      : getDocumentServices(locale).map((s, idx) => ({
          id: -(idx + 1),
          title: s.title,
          description: s.description,
          icon: s.icon,
          order_index: idx,
        }));
  const servicesCopy = useSiteSectionContent('services.page', getServicesPageDefaults(locale));

  const heroContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const heroItem = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };

  const gridContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <main className="services-page-main creative-public-page services-main-page">
      <div className="page-hero">
        <motion.div className="page-hero-inner" variants={heroContainer} initial="hidden" animate="show">
          <div style={{ overflow: 'hidden', paddingBottom: '4px' }}>
            <motion.span variants={heroItem} className="page-hero-label" style={{ display: 'inline-block' }}>
              {servicesCopy.heroLabel}
            </motion.span>
          </div>
          <div style={{ overflow: 'hidden', paddingBottom: '8px' }}>
            <motion.h1 variants={heroItem} className="page-hero-title">
              {servicesCopy.heroTitle}
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.p variants={heroItem} className="page-hero-tagline">
              {servicesCopy.heroIntro}
            </motion.p>
          </div>
          {servicesCopy.heroSubIntro ? (
            <div style={{ overflow: 'hidden' }}>
              <motion.p variants={heroItem} className="page-hero-tagline" style={{ marginTop: 'var(--space-md)' }}>
                {servicesCopy.heroSubIntro}
              </motion.p>
            </div>
          ) : null}
        </motion.div>
      </div>

      <section className="section section-cards">
        <div className="section-inner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              variant="inner"
              label={servicesCopy.sectionLabel}
              title={servicesCopy.sectionTitle}
              linkHref={localizeHref('/contact#contact', locale)}
              linkLabel={servicesCopy.sectionLinkLabel}
            />
          </motion.div>
          <motion.p
            className="section-subtitle centered all-services-intro"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {servicesCopy.sectionSubtitle}
          </motion.p>
          <motion.div
            className="services-grid"
            variants={gridContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
          >
            {renderedServices.map((s) => {
              const image = resolveServiceImage(s.icon);
              const highlights = parseServiceHighlights(s.highlights);
              const fallbackHighlights = highlights.length > 0 ? highlights : parseHighlightsFromIncludes(s.description);
              return (
              <motion.article key={`service-${s.id}-${s.title}`} className="service-card magnetic" variants={cardItem}>
                <div
                  className={`service-card-image ${image.imageUrl ? 'has-image' : image.imageClass}`}
                  style={
                    image.imageUrl
                      ? {
                          backgroundImage: `url(${image.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'top center',
                          backgroundRepeat: 'no-repeat',
                        }
                      : undefined
                  }
                ></div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{s.title}</h3>
                  <p className="service-card-desc">{s.description || t(locale, 'servicesCardFallbackDesc')}</p>
                  {fallbackHighlights.length > 0 ? (
                    <ul className="service-card-bullets">
                      {fallbackHighlights.map((item) => (
                        <li key={`${s.id}-${item}`}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </motion.article>
            )})}
          </motion.div>

          <motion.div
            className="section-cta-center services-page-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href={localizeHref('/contact#contact', locale)} className="btn btn-primary magnetic">
              {servicesCopy.ctaPrimary}
            </Link>
            <Link href={localizeHref('/case-studies', locale)} className="btn btn-outline magnetic">
              {servicesCopy.ctaSecondary}
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
