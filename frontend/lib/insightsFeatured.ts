import type { AppLocale } from '@/lib/locale';

export type InsightFeaturedCard = {
  slug: string;
  meta: string;
  title: string;
  excerpt: string;
  mediaClass: string;
  body: string;
  imageUrl: string;
};

/** Defaults for CMS `insights.featured` — homepage cards and /insights/[slug] articles. */
export const INSIGHTS_FEATURED_DEFAULTS: Record<string, string> = {
  readCtaLabel: 'Read more →',
  card1Slug: 'trade-policy-briefing-q1',
  card1Meta: 'Press briefing · Q1 2026',
  card1Title: 'What we learned convening trade and policy leaders',
  card1Excerpt:
    'Key takeaways from summit-side conversations on intra-African trade narratives, institutional trust, and how briefings travel across capitals.',
  card1MediaClass: 'home-insights-media-briefing',
  card1ImageUrl: '',
  card1Body: `Across a packed quarter of convenings with trade negotiators, policy leads, and institutional partners, a few themes kept surfacing: audiences are tired of slogans, hungry for evidence, and quicker than ever to test whether a narrative matches what they see on the ground.

We saw the strongest briefings win when they paired clear stakes with credible third-party anchors—data, practitioner voices, and timelines that leaders could actually use in their own rooms. Trust moved not from volume of messaging but from consistency between what was said in public and what stakeholders heard in smaller sessions.

For teams preparing the next cycle of engagements, the takeaway is practical: design briefing arcs that travel—from prepared remarks to corridor conversations to follow-up notes—so the same story deepens instead of fragmenting as it crosses capitals.`,

  card2Slug: 'governance-stories-attention',
  card2Meta: 'Thought leadership',
  card2Title: 'Governance stories that earn attention—and keep it',
  card2Excerpt:
    'Why clarity, cadence, and evidence still outperform noise in high-stakes sectors, and how we structure editorial for long-term credibility.',
  card2MediaClass: 'home-insights-media-editorial',
  card2ImageUrl: '',
  card2Body: `In high-stakes sectors, attention is easy to rent and hard to own. Governance and policy audiences in particular reward narratives that respect their time: a sharp thesis, a transparent method, and a steady publishing cadence that proves you are in the conversation for the long haul—not only when you need something.

We structure editorial programs around three layers: a flagship point of view that states where you stand, proof assets that show your work (briefings, data slices, and subject-matter explainers), and human stories that make abstract policy tangible for broader publics. That mix keeps specialist readers engaged while still giving general outlets something they can carry.

The through-line is credibility. When institutions publish only in moments of crisis, audiences learn to expect spin. When they publish regularly—and invite scrutiny—they earn the right to be heard when it matters most.`,

  card3Slug: 'syndication-african-media',
  card3Meta: 'Agile Press Group',
  card3Title: 'Syndication that extends your reach across African media',
  card3Excerpt:
    'How our publishing desk pairs original reporting with licensed circulation so campaigns, institutions, and brands show up where audiences already read.',
  card3MediaClass: 'home-insights-media-syndication',
  card3ImageUrl: '',
  card3Body: `Distribution is not an afterthought; it is part of the story design. The Agile Press Group combines original reporting and partner-ready formats with licensed circulation across trusted African media networks, so your message appears in the publications audiences already rely on—not only on owned channels.

We work with desks and editors to adapt tone and length for each outlet while preserving factual integrity and a single strategic spine. That means fewer “one-size” press releases and more assets that editors can actually use: concise briefings, Q&As, visuals, and localized angles where they add value.

If you are planning a launch, a policy milestone, or a sustained thought-leadership arc, start with the end readership in mind: where they read, who they trust, and what proof they need before they amplify your narrative.`,
};

const INSIGHTS_FEATURED_OVERRIDES: Partial<Record<Exclude<AppLocale, 'en'>, Partial<Record<string, string>>>> = {
  fr: {
    readCtaLabel: 'Lire plus →',
    card1Meta: 'Briefing presse · T1 2026',
    card1Title: 'Ce que nous retenons des rencontres commerce et politiques publiques',
    card1Excerpt:
      'Lecons clefs sur les recits du commerce intra-africain, la confiance institutionnelle et la circulation des briefings.',
    card2Meta: 'Leadership d idee',
    card2Title: 'Des recits de gouvernance qui captent l attention durablement',
    card2Excerpt:
      'Pourquoi clarte, cadence et preuve restent determinantes dans les secteurs sensibles.',
    card3Title: 'Une syndication qui etend votre portee dans les medias africains',
    card3Excerpt:
      'Comment notre desk combine production originale et circulation licenciee pour toucher les audiences actives.',
  },
  pt: {
    readCtaLabel: 'Ler mais →',
    card1Meta: 'Briefing de imprensa · T1 2026',
    card1Title: 'O que aprendemos ao reunir liderancas de comercio e politica',
    card1Excerpt:
      'Principais aprendizados sobre narrativas de comercio intra-africano e confianca institucional.',
    card2Meta: 'Lideranca de pensamento',
    card2Title: 'Narrativas de governanca que conquistam atencao e continuidade',
    card2Excerpt:
      'Por que clareza, cadencia e evidencia ainda superam o ruido em setores de alta exposicao.',
    card3Title: 'Sindicacao que amplia seu alcance na midia africana',
    card3Excerpt:
      'Como combinamos conteudo original e circulacao licenciada para chegar onde o publico ja le.',
  },
  ar: {
    readCtaLabel: 'اقرأ المزيد ←',
    card1Meta: 'موجز صحفي · الربع الاول 2026',
    card1Title: 'ما تعلمناه من جمع قادة التجارة والسياسات',
    card1Excerpt:
      'خلاصات حول سرد التجارة داخل افريقيا والثقة المؤسسية وانتقال الرسائل بين العواصم.',
    card2Meta: 'قيادة فكرية',
    card2Title: 'سرديات الحوكمة التي تجذب الانتباه وتحافظ عليه',
    card2Excerpt:
      'لماذا تبقى الوضوحية والنسق والادلة اقوى من الضجيج في القطاعات الحساسة.',
    card3Title: 'نشر موسع يمد حضوركم عبر الاعلام الافريقي',
    card3Excerpt:
      'كيف يجمع فريقنا بين المحتوى الاصلي والتوزيع المرخّص للوصول الى جماهير قائمة بالفعل.',
  },
};

export function getInsightsFeaturedDefaults(locale: AppLocale): Record<string, string> {
  if (locale === 'en') return INSIGHTS_FEATURED_DEFAULTS;
  return { ...INSIGHTS_FEATURED_DEFAULTS, ...(INSIGHTS_FEATURED_OVERRIDES[locale] ?? {}) };
}

export function normalizeMediaClass(raw: string): string {
  const t = raw.trim();
  if (!t) return 'home-insights-media-briefing';
  if (t.startsWith('home-insights-media-')) return t;
  const map: Record<string, string> = {
    briefing: 'home-insights-media-briefing',
    editorial: 'home-insights-media-editorial',
    syndication: 'home-insights-media-syndication',
  };
  return map[t.toLowerCase()] ?? t;
}

export function parseInsightFeatured(content: Record<string, string>): InsightFeaturedCard[] {
  const cards: InsightFeaturedCard[] = [];
  for (let i = 1; i <= 3; i++) {
    const slug = (content[`card${i}Slug`] ?? '').trim();
    if (!slug) continue;
    cards.push({
      slug,
      meta: (content[`card${i}Meta`] ?? '').trim(),
      title: (content[`card${i}Title`] ?? '').trim(),
      excerpt: (content[`card${i}Excerpt`] ?? '').trim(),
      mediaClass: normalizeMediaClass(content[`card${i}MediaClass`] ?? ''),
      body: (content[`card${i}Body`] ?? '').trim(),
      imageUrl: (content[`card${i}ImageUrl`] ?? '').trim(),
    });
  }
  return cards;
}

export function getInsightFeaturedReadCta(content: Record<string, string>): string {
  const v = (content.readCtaLabel ?? '').trim();
  return v || INSIGHTS_FEATURED_DEFAULTS.readCtaLabel;
}
