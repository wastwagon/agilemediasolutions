'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import { type AppLocale } from '@/lib/locale';
import { useLocale } from '@/components/LocaleProvider';
import { getSectorsPageDefaults } from '@/lib/i18n/pageDefaults';
import { localizeHref } from '@/lib/i18n';
import { useSiteSectionContent } from '@/lib/siteSectionCms';

type SectorItem = {
  id?: number;
  name: string;
  description: string;
  icon?: string | null;
  image_url?: string | null;
  order_index?: number | null;
};

const SECTOR_PLACEHOLDER_IMAGES = [
  '/images/sectors/sector-01.svg',
  '/images/sectors/sector-02.svg',
  '/images/sectors/sector-03.svg',
  '/images/sectors/sector-04.svg',
  '/images/sectors/sector-05.svg',
  '/images/sectors/sector-06.svg',
  '/images/sectors/sector-07.svg',
  '/images/sectors/sector-08.svg',
];

function resolveSectorCardImage(sector: SectorItem, index: number): string {
  const u = sector.image_url?.trim();
  if (u) return u;
  return SECTOR_PLACEHOLDER_IMAGES[index % SECTOR_PLACEHOLDER_IMAGES.length];
}

const DOCUMENT_SECTORS: SectorItem[] = [
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

const SECTOR_TRANSLATIONS: Record<Exclude<AppLocale, 'en'>, Record<string, { name: string; description: string }>> = {
  fr: {
    'Government & Public Institutions': {
      name: 'Gouvernement et institutions publiques',
      description:
        'Messaging strategique, visibilite des reformes et confiance publique pour ministeres, agences et entites publiques.',
    },
    'International Development & Multilaterals': {
      name: 'Developpement international et multilateraux',
      description: 'Communication bailleurs, engagement parties prenantes et campagnes pour agences et partenaires.',
    },
    'Finance, Investment & Trade': {
      name: 'Finance, investissement et commerce',
      description: 'Communication investisseurs, recits ESG et positionnement transfrontalier.',
    },
    'Infrastructure, Energy & Extractives': {
      name: 'Infrastructures, energie et extractif',
      description: 'Recits de projets, engagement communautaire et visibilite reglementaire.',
    },
    'Technology, Startups & Innovation': {
      name: 'Technologie, startups et innovation',
      description: 'Messages audacieux et campagnes digitales pour ecosystemes technologiques.',
    },
    'Health, Education & Social Development': {
      name: 'Sante, education et developpement social',
      description: 'Communication de changement comportemental et rayonnement institutionnel.',
    },
    'Climate, Environment & Sustainability': {
      name: 'Climat, environnement et durabilite',
      description: 'Strategies de contenu pour climat, biodiversite, transition energetique et finance verte.',
    },
    'Arts, Culture & Creative Industries': {
      name: 'Arts, culture et industries creatives',
      description: 'Publicite creative et recits culturels reliant artistes, institutions et publics.',
    },
    'Sports, Tourism & Nation Branding': {
      name: 'Sport, tourisme et nation branding',
      description: 'Campagnes RP pour destinations, athletes et image nationale.',
    },
    'Hospitality, Travel & Leisure': {
      name: 'Hospitalite, voyage et loisirs',
      description: 'Communication media et grand public pour marques hotellerie et tourisme.',
    },
    'Legal, Policy & Governance': {
      name: 'Juridique, politiques publiques et gouvernance',
      description: 'Visibilite des reformes et communication institutionnelle pour organes publics.',
    },
    'Migration, Diaspora & Global Mobility': {
      name: 'Migration, diaspora et mobilite globale',
      description: 'Campagnes diaspora, communication migrations et recits transnationaux.',
    },
    'Security, Peacebuilding & Conflict Communications': {
      name: 'Securite, paix et communication en contexte de conflit',
      description: 'Communication sensible pour contextes fragiles, paix et lutte contre la desinformation.',
    },
    'Philanthropy, Foundations & Social Investment': {
      name: 'Philanthropie, fondations et investissement social',
      description: 'Communication d impact, transparence et engagement des beneficiaires.',
    },
    'Media, Entertainment & Public Personalities': {
      name: 'Medias, divertissement et personnalites publiques',
      description: 'Visibilite strategique et protection de marque pour talents et medias.',
    },
  },
  pt: {
    'Government & Public Institutions': {
      name: 'Governo e instituicoes publicas',
      description: 'Mensageria estrategica e visibilidade de reformas para ministerios e agencias.',
    },
    'International Development & Multilaterals': {
      name: 'Desenvolvimento internacional e multilaterais',
      description: 'Comunicacao para doadores, parceiros e agencias multilaterais.',
    },
    'Finance, Investment & Trade': {
      name: 'Financas, investimento e comercio',
      description: 'Comunicacao para investidores, narrativas ESG e posicionamento internacional.',
    },
    'Infrastructure, Energy & Extractives': {
      name: 'Infraestrutura, energia e extrativos',
      description: 'Narrativas para grandes projetos, licenca social e visibilidade regulatoria.',
    },
    'Technology, Startups & Innovation': {
      name: 'Tecnologia, startups e inovacao',
      description: 'Campanhas digitais e mensagem para ecossistemas de inovacao.',
    },
    'Health, Education & Social Development': {
      name: 'Saude, educacao e desenvolvimento social',
      description: 'Comunicacao de mudanca de comportamento e alcance institucional.',
    },
    'Climate, Environment & Sustainability': {
      name: 'Clima, meio ambiente e sustentabilidade',
      description: 'Estrategias para clima, biodiversidade, transicao energetica e financas verdes.',
    },
    'Arts, Culture & Creative Industries': {
      name: 'Artes, cultura e industrias criativas',
      description: 'Publicidade criativa e storytelling cultural para alcance local e global.',
    },
    'Sports, Tourism & Nation Branding': {
      name: 'Esportes, turismo e marca-pais',
      description: 'Relacoes publicas para destinos, atletas e reputacao nacional.',
    },
    'Hospitality, Travel & Leisure': {
      name: 'Hospitalidade, viagens e lazer',
      description: 'Comunicacao para hotelaria, resorts e marcas de turismo.',
    },
    'Legal, Policy & Governance': {
      name: 'Juridico, politicas publicas e governanca',
      description: 'Comunicacao de reformas, instituicoes legais e orgaos reguladores.',
    },
    'Migration, Diaspora & Global Mobility': {
      name: 'Migracao, diaspora e mobilidade global',
      description: 'Campanhas para diaspora, comunicacao migratoria e narrativas transnacionais.',
    },
    'Security, Peacebuilding & Conflict Communications': {
      name: 'Seguranca, paz e comunicacao em conflitos',
      description: 'Suporte de comunicacao para contextos frageis e processos de paz.',
    },
    'Philanthropy, Foundations & Social Investment': {
      name: 'Filantropia, fundacoes e investimento social',
      description: 'Narrativas de impacto e transparencia para fundacoes e investidores sociais.',
    },
    'Media, Entertainment & Public Personalities': {
      name: 'Midia, entretenimento e personalidades publicas',
      description: 'Campanhas de visibilidade e protecao de marca para criadores e talentos.',
    },
  },
  ar: {
    'Government & Public Institutions': {
      name: 'الحكومة والمؤسسات العامة',
      description: 'رسائل استراتيجية وابراز للاصلاحات وبناء ثقة الجمهور للوزارات والهيئات.',
    },
    'International Development & Multilaterals': {
      name: 'التنمية الدولية والمؤسسات متعددة الاطراف',
      description: 'اتصال للمانحين واشراك الجهات المعنية وتصميم حملات للشركاء الدوليين.',
    },
    'Finance, Investment & Trade': {
      name: 'التمويل والاستثمار والتجارة',
      description: 'اتصال موجه للمستثمرين وسرد ESG وتموضع عابر للحدود.',
    },
    'Infrastructure, Energy & Extractives': {
      name: 'البنية التحتية والطاقة والاستخراج',
      description: 'سرد داعم للمشروعات الكبرى والمجتمعات المحلية والوضوح التنظيمي.',
    },
    'Technology, Startups & Innovation': {
      name: 'التكنولوجيا والشركات الناشئة والابتكار',
      description: 'رسائل جريئة وحملات رقمية لمنصات الابتكار والريادة.',
    },
    'Health, Education & Social Development': {
      name: 'الصحة والتعليم والتنمية الاجتماعية',
      description: 'اتصال للتغيير السلوكي والتوعية العامة وتعزيز الحضور المؤسسي.',
    },
    'Climate, Environment & Sustainability': {
      name: 'المناخ والبيئة والاستدامة',
      description: 'استراتيجيات محتوى للعمل المناخي والتنوع الحيوي والتحول الاخضر.',
    },
    'Arts, Culture & Creative Industries': {
      name: 'الفنون والثقافة والصناعات الابداعية',
      description: 'سرد ثقافي وترويج ابداعي يربط المبدعين بالجمهور محليا وعالميا.',
    },
    'Sports, Tourism & Nation Branding': {
      name: 'الرياضة والسياحة وبناء الصورة الوطنية',
      description: 'حملات علاقات عامة ترفع مكانة الوجهات والرياضيين والصورة الوطنية.',
    },
    'Hospitality, Travel & Leisure': {
      name: 'الضيافة والسفر والترفيه',
      description: 'اتصال استراتيجي لقطاعات الفنادق والمنتجعات وهيئات السياحة.',
    },
    'Legal, Policy & Governance': {
      name: 'القانون والسياسات والحوكمة',
      description: 'ابراز للاصلاحات القانونية واتصال مؤسسي للهيئات التنظيمية والقضائية.',
    },
    'Migration, Diaspora & Global Mobility': {
      name: 'الهجرة والشتات والتنقل العالمي',
      description: 'حملات للشتات واتصال سياسات الهجرة وروايات عابرة للحدود.',
    },
    'Security, Peacebuilding & Conflict Communications': {
      name: 'الامن وبناء السلام واتصال النزاعات',
      description: 'دعم اتصالي حساس للسياقات الهشة وعمليات السلام والتعافي.',
    },
    'Philanthropy, Foundations & Social Investment': {
      name: 'العمل الخيري والمؤسسات والاستثمار الاجتماعي',
      description: 'اتصال استراتيجي يبرز الاثر والشفافية ومشاركة المستفيدين.',
    },
    'Media, Entertainment & Public Personalities': {
      name: 'الاعلام والترفيه والشخصيات العامة',
      description: 'حملات ظهور وحماية علامة وترويج للشخصيات والمنصات الاعلامية.',
    },
  },
};

function getDocumentSectors(locale: AppLocale): SectorItem[] {
  if (locale === 'en') return DOCUMENT_SECTORS;
  const copy = SECTOR_TRANSLATIONS[locale];
  return DOCUMENT_SECTORS.map((sector) => {
    const translated = copy[sector.name];
    if (!translated) return sector;
    return { ...sector, name: translated.name, description: translated.description };
  });
}

export default function SectorsPageClient() {
  const locale = useLocale();
  const [sectors, setSectors] = useState<SectorItem[]>([]);
  const copy = useSiteSectionContent('sectors.page', getSectorsPageDefaults(locale));

  useEffect(() => {
    const loadSectors = async () => {
      try {
        const res = await fetch('/api/sectors');
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        setSectors(data as SectorItem[]);
      } catch {
        // Keep fallback sectors when API is unavailable.
      }
    };
    loadSectors();
  }, []);

  const renderedSectors = sectors.length > 0 ? sectors : getDocumentSectors(locale);

  return (
    <main className="services-page-main creative-public-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">{copy.heroLabel}</span>
          <h1 className="page-hero-title">{copy.heroTitle}</h1>
          <p className="page-hero-tagline">
            {copy.heroTagline}
          </p>
        </div>
      </div>

      <section className="section section-sectors" id="sectors">
        {/* No animate-on-scroll: entire grid was opacity:0 until observer runs, which looked like a blank page below the hero. */}
        <div className="section-inner">
          <SectionHeader
            variant="inner"
            label={copy.sectionLabel}
            title={copy.sectionTitle}
            linkHref={localizeHref('/contact#contact', locale)}
            linkLabel={copy.sectionLinkLabel}
          />
          <div className="section-sectors-intro">
            <p className="section-text" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--space-3xl)' }}>
              {copy.sectionIntro}
            </p>
          </div>

          <div className="sectors-grid">
            {renderedSectors.map((sector, index) => (
              <article
                key={sector.id != null ? sector.id : sector.name}
                className="sector-card"
              >
                <div className="sector-card-media">
                  <img
                    src={resolveSectorCardImage(sector, index)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="sector-card-body">
                  <h3 className="sector-card-title">{sector.name}</h3>
                  <p className="sector-card-desc">{sector.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="section-cta-center" style={{ marginTop: 'var(--space-3xl)', display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
            <Link href={localizeHref('/contact#contact', locale)} className="btn btn-primary">
              {copy.ctaPrimary}
            </Link>
            <Link href={localizeHref('/case-studies', locale)} className="btn btn-outline">
              {copy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
