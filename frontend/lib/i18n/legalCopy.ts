import type { Metadata } from 'next';

import type { AppLocale } from '@/lib/locale';

/** Starter legal copy — not a substitute for counsel-reviewed terms in each jurisdiction. */
export type LegalBlock = {
  heroLabel: string;
  heroTitle: string;
  heroTagline: string;
  sections: { title: string; paragraphs: string[] }[];
  disclaimer: string;
};

const PRIVACY: Record<AppLocale, LegalBlock> = {
  en: {
    heroLabel: 'Legal',
    heroTitle: 'Privacy policy',
    heroTagline:
      'Last updated: March 2026. Plain-language summary below; tailor with your lawyer for your jurisdiction.',
    sections: [
      {
        title: 'Who we are',
        paragraphs: [
          'This site is operated by Agile Media Solutions ("we", "us"). For any privacy questions, use the [[CONTACT_PAGE]].',
        ],
      },
      {
        title: 'What we collect',
        paragraphs: [
          'Contact form: name, email, optional topic, and your message—so we can reply to you.',
          'Newsletter: email address only, to send updates you signed up for.',
          'Technical data: like many sites, hosting may log IP address, browser type, and pages viewed for security and reliability.',
        ],
      },
      {
        title: 'How we use it',
        paragraphs: [
          'We use this information to respond to enquiries, send newsletters you requested, and keep the site secure. We do not sell your personal data.',
        ],
      },
      {
        title: 'How long we keep it',
        paragraphs: [
          'We keep contact and newsletter data only as long as needed for those purposes or as required by law—then we delete or anonymise it.',
        ],
      },
      {
        title: 'Your choices',
        paragraphs: [
          'You can ask to access, correct, or delete your personal data where applicable. Unsubscribe links will be included in marketing emails once you enable them in your mail tool.',
        ],
      },
      {
        title: 'Cookies',
        paragraphs: ['See our [[COOKIE_NOTICE]] for how we use cookies and similar technologies.'],
      },
    ],
    disclaimer:
      'This page is a starter template and not legal advice. Have counsel review it before relying on it for compliance.',
  },
  fr: {
    heroLabel: 'Legal',
    heroTitle: 'Politique de confidentialite',
    heroTagline:
      'Derniere mise a jour : mars 2026. Resume en langage clair ; adaptez avec votre avocat selon votre juridiction.',
    sections: [
      {
        title: 'Qui sommes-nous',
        paragraphs: [
          'Ce site est exploite par Agile Media Solutions (« nous »). Pour toute question sur la vie privee, utilisez la [[CONTACT_PAGE]].',
        ],
      },
      {
        title: 'Ce que nous collectons',
        paragraphs: [
          'Formulaire de contact : nom, e-mail, sujet facultatif et message — pour vous repondre.',
          'Newsletter : adresse e-mail uniquement, pour les mises a jour auxquelles vous avez souscrit.',
          'Donnees techniques : comme sur beaucoup de sites, l hebergement peut enregistrer IP, type de navigateur et pages consultees pour la securite.',
        ],
      },
      {
        title: 'Comment nous les utilisons',
        paragraphs: [
          'Nous utilisons ces informations pour repondre aux demandes, envoyer les newsletters demandees et securiser le site. Nous ne vendons pas vos donnees personnelles.',
        ],
      },
      {
        title: 'Combien de temps nous les conservons',
        paragraphs: [
          'Nous conservons les donnees de contact et newsletter seulement le temps necessaire a ces finalites ou la duree imposee par la loi — puis suppression ou anonymisation.',
        ],
      },
      {
        title: 'Vos choix',
        paragraphs: [
          'Vous pouvez demander l acces, la rectification ou la suppression de vos donnees lorsque la loi l permet. Les liens de desinscription figureront dans les e-mails marketing une fois configures.',
        ],
      },
      {
        title: 'Cookies',
        paragraphs: ['Voir notre [[COOKIE_NOTICE]] pour l usage des cookies et technologies similaires.'],
      },
    ],
    disclaimer:
      'Cette page est un modele de depart et ne constitue pas un avis juridique. Faites-la valider par un conseil avant toute conformite.',
  },
  pt: {
    heroLabel: 'Legal',
    heroTitle: 'Politica de privacidade',
    heroTagline:
      'Ultima atualizacao: marco de 2026. Resumo em linguagem simples; ajuste com seu advogado conforme a jurisdicao.',
    sections: [
      {
        title: 'Quem somos',
        paragraphs: [
          'Este site e operado pela Agile Media Solutions ("nos"). Para duvidas de privacidade, use a [[CONTACT_PAGE]].',
        ],
      },
      {
        title: 'O que coletamos',
        paragraphs: [
          'Formulario de contato: nome, e-mail, assunto opcional e mensagem — para podermos responder.',
          'Newsletter: apenas e-mail para enviar atualizacoes que voce solicitou.',
          'Dados tecnicos: como em muitos sites, a hospedagem pode registrar IP, tipo de navegador e paginas vistas por seguranca.',
        ],
      },
      {
        title: 'Como usamos',
        paragraphs: [
          'Usamos essas informacoes para responder solicitacoes, enviar newsletters solicitadas e manter o site seguro. Nao vendemos seus dados pessoais.',
        ],
      },
      {
        title: 'Por quanto tempo guardamos',
        paragraphs: [
          'Mantemos dados de contato e newsletter apenas pelo tempo necessario a essas finalidades ou exigido por lei — depois excluimos ou anonimizamos.',
        ],
      },
      {
        title: 'Suas escolhas',
        paragraphs: [
          'Voce pode solicitar acesso, correcao ou exclusao dos seus dados quando aplicavel. Links de descadastro constarao em e-mails de marketing quando ativados.',
        ],
      },
      {
        title: 'Cookies',
        paragraphs: ['Veja nosso [[COOKIE_NOTICE]] sobre cookies e tecnologias semelhantes.'],
      },
    ],
    disclaimer:
      'Esta pagina e um modelo inicial e nao e assessoria juridica. Revise com um advogado antes de depender dela para conformidade.',
  },
  ar: {
    heroLabel: 'قانوني',
    heroTitle: 'سياسة الخصوصية',
    heroTagline:
      'آخر تحديث: مارس 2026. ملخص مبسط؛ يجب مراجعته مع مستشاركم القانوني حسب الاختصاص.',
    sections: [
      {
        title: 'من نحن',
        paragraphs: [
          'تدير هذه المنصة شركة Agile Media Solutions (« نحن »). لأي استفسار عن الخصوصية استخدموا [[CONTACT_PAGE]].',
        ],
      },
      {
        title: 'ما الذي نجمعه',
        paragraphs: [
          'نموذج الاتصال: الاسم والبريد والموضوع اختياري والرسالة — للرد عليكم.',
          'النشرة: عنوان البريد فقط لإرسال التحديثات التي اشتركتم بها.',
          'البيانات التقنية: كغيرها من المواقع قد يسجل المضيف عنوان IP ونوع المتصفح والصفحات لأغراض الأمان.',
        ],
      },
      {
        title: 'كيف نستخدمها',
        paragraphs: [
          'نستخدم المعلومات للرد على الطلبات وإرسال النشرات التي طلبتموها وتأمين الموقع. لا نبيع بياناتكم الشخصية.',
        ],
      },
      {
        title: 'مدة الاحتفاظ',
        paragraphs: [
          'نحتفظ ببيانات الاتصال والنشرة فقط للمدة اللازمة لتلك الأغراض أو كما يقتضي القانون — ثم الحذف أو إخفاء الهوية.',
        ],
      },
      {
        title: 'خياراتكم',
        paragraphs: [
          'يمكنكم طلب الوصول أو التصحيح أو الحذف حيث ينطبق القانون. ستُضاف روابط إلغاء الاشتراك في رسائل التسويق عند تفعيلها.',
        ],
      },
      {
        title: 'ملفات تعريف الارتباط',
        paragraphs: ['اطلعوا على [[COOKIE_NOTICE]] لمعرفة الاستخدام والتقنيات المشابهة.'],
      },
    ],
    disclaimer:
      'هذه الصفحة قالب أولي وليست استشارة قانونية. يجب مراجعتها مع مستشار قبل الاعتماد عليها للامتثال.',
  },
};

const TERMS: Record<AppLocale, LegalBlock> = {
  en: {
    heroLabel: 'Legal',
    heroTitle: 'Terms of service',
    heroTagline: 'Rules for using this website. Replace placeholders with language your lawyer approves.',
    sections: [
      {
        title: 'Agreement',
        paragraphs: [
          'By using this site, you agree to these terms. If you do not agree, please do not use the site. [[CONTACT_US]] with questions.',
        ],
      },
      {
        title: 'Use of the site',
        paragraphs: [
          'You may browse the site for lawful purposes. You must not attempt to disrupt the site, scrape it in a way that harms our systems, or misuse forms and APIs.',
        ],
      },
      {
        title: 'Content',
        paragraphs: [
          'Text, images, and branding on this site belong to Agile Media Solutions or its licensors unless stated otherwise. Do not reuse them without permission.',
        ],
      },
      {
        title: 'No professional advice',
        paragraphs: [
          'Website content is for general information, not legal, financial, or other professional advice. You rely on it at your own risk.',
        ],
      },
      {
        title: 'Limitation of liability',
        paragraphs: [
          'To the fullest extent permitted by law, we are not liable for indirect or consequential loss arising from use of this site. Some jurisdictions do not allow certain limits; those limits apply only to the extent allowed.',
        ],
      },
      {
        title: 'Changes',
        paragraphs: [
          'We may update these terms from time to time. The updated version will be posted on this page with a new "last updated" note when you maintain one.',
        ],
      },
    ],
    disclaimer: 'This is a starter template, not legal advice. Have qualified counsel review before publication.',
  },
  fr: {
    heroLabel: 'Legal',
    heroTitle: 'Conditions d utilisation',
    heroTagline:
      'Regles d utilisation du site. Remplacez les formulations par celles validees par votre avocat.',
    sections: [
      {
        title: 'Accord',
        paragraphs: [
          'En utilisant ce site, vous acceptez ces conditions. Sinon, veuillez ne pas utiliser le site. [[CONTACT_US]] pour toute question.',
        ],
      },
      {
        title: 'Utilisation du site',
        paragraphs: [
          'Vous pouvez consulter le site a des fins licites. Il est interdit de perturber le site, d effectuer un scraping nuisible a nos systemes ou d abuser des formulaires et API.',
        ],
      },
      {
        title: 'Contenu',
        paragraphs: [
          'Textes, images et marque appartiennent a Agile Media Solutions ou a ses concédants sauf mention contraire. Pas de reutilisation sans autorisation.',
        ],
      },
      {
        title: 'Pas de conseil professionnel',
        paragraphs: [
          'Le contenu est d information generale, pas un conseil juridique, financier ou autre professionnel. Vous l utilisez a vos risques.',
        ],
      },
      {
        title: 'Limitation de responsabilite',
        paragraphs: [
          'Dans la mesure permise par la loi, nous ne sommes pas responsables des pertes indirectes ou consecutives liees a l utilisation du site. Certaines juridictions limitent ces exclusions.',
        ],
      },
      {
        title: 'Modifications',
        paragraphs: [
          'Nous pouvons mettre a jour ces conditions. La version mise a jour sera publiee sur cette page avec une mention de date si vous en tenez une.',
        ],
      },
    ],
    disclaimer:
      'Modele de depart, pas un avis juridique. Faites valider par un conseil avant publication.',
  },
  pt: {
    heroLabel: 'Legal',
    heroTitle: 'Termos de uso',
    heroTagline:
      'Regras para usar este site. Substitua por texto aprovado pelo seu advogado.',
    sections: [
      {
        title: 'Acordo',
        paragraphs: [
          'Ao usar o site, voce aceita estes termos. Se nao concordar, nao use o site. [[CONTACT_US]] em caso de duvidas.',
        ],
      },
      {
        title: 'Uso do site',
        paragraphs: [
          'Voce pode navegar para fins licitos. Nao pode perturbar o site, fazer scraping que prejudique nossos sistemas ou abusar de formularios e APIs.',
        ],
      },
      {
        title: 'Conteudo',
        paragraphs: [
          'Textos, imagens e marca pertencem a Agile Media Solutions ou licenciadores, salvo indicacao contraria. Nao reutilize sem permissao.',
        ],
      },
      {
        title: 'Sem assessoria profissional',
        paragraphs: [
          'O conteudo e informativo geral, nao assessoria juridica, financeira ou outra profissional. O uso e por sua conta e risco.',
        ],
      },
      {
        title: 'Limitacao de responsabilidade',
        paragraphs: [
          'Na medida maxima permitida por lei, nao respondemos por perdas indiretas ou consequenciais do uso do site. Algumas jurisdicoes limitam tais exclusoes.',
        ],
      },
      {
        title: 'Alteracoes',
        paragraphs: [
          'Podemos atualizar estes termos periodicamente. A versao atualizada sera publicada nesta pagina com nota de atualizacao quando mantida.',
        ],
      },
    ],
    disclaimer:
      'Modelo inicial, nao e assessoria juridica. Revise com advogado antes de publicar.',
  },
  ar: {
    heroLabel: 'قانوني',
    heroTitle: 'شروط الاستخدام',
    heroTagline: 'قواعد استخدام الموقع. استبدلوا الصياغة بما يوافق عليه مستشاركم.',
    sections: [
      {
        title: 'الاتفاق',
        paragraphs: [
          'باستخدامكم الموقع فإنكم توافقون على هذه الشروط. إن لم توافقوا فلا تستخدموه. [[CONTACT_US]] عند الاستفسار.',
        ],
      },
      {
        title: 'استخدام الموقع',
        paragraphs: [
          'يُسمح بالتصفح لأغراض مشروعة. يُمنع تعطيل الموقع أو جمع البيانات بشكل يضر بأنظمتنا أو إساءة النماذج والواجهات.',
        ],
      },
      {
        title: 'المحتوى',
        paragraphs: [
          'النصوص والصور والعلامة ملك لـ Agile Media Solutions أو المرخصين ما لم يُذكر غير ذلك. لا تعاد الاستخدام بلا إذن.',
        ],
      },
      {
        title: 'ليس استشارة مهنية',
        paragraphs: [
          'المحتوى للمعلومات العامة وليس استشارة قانونية أو مالية أو مهنية أخرى. تعتمدون عليه على مسؤوليتكم.',
        ],
      },
      {
        title: 'حدود المسؤولية',
        paragraphs: [
          'ضمن أقصى ما يسمح به القانون لا نتحمل الخسائر غير المباشرة أو التبعية الناتجة عن استخدام الموقع. تختلف القيود حسب الاختصاص.',
        ],
      },
      {
        title: 'التغييرات',
        paragraphs: [
          'قد نحدّث هذه الشروط من وقت لآخر. تُنشر النسخة المحدثة هنا مع إشارة «آخر تحديث» عند الاحتفاظ بها.',
        ],
      },
    ],
    disclaimer: 'قالب أولي وليست استشارة قانونية. راجعوه مع مستشار قبل النشر.',
  },
};

const COOKIES: Record<AppLocale, LegalBlock> = {
  en: {
    heroLabel: 'Legal',
    heroTitle: 'Cookie notice',
    heroTagline: 'What cookies may be used and how you can control them.',
    sections: [
      {
        title: 'What are cookies?',
        paragraphs: [
          'Cookies are small files stored on your device when you visit a site. They help the site work, remember preferences, or measure traffic.',
        ],
      },
      {
        title: 'How we use them',
        paragraphs: [
          'This site may use strictly necessary cookies so pages load and forms work, and analytics or functional cookies if you add services such as analytics providers. List specific tools here once you plug them in (e.g. Google Analytics, Meta Pixel).',
        ],
      },
      {
        title: 'Your choices',
        paragraphs: [
          'You can block or delete cookies in your browser settings. Blocking some cookies may limit how parts of the site work.',
        ],
      },
      {
        title: 'More detail',
        paragraphs: [
          'For how we treat personal data more broadly, see our [[PRIVACY_POLICY]]. Questions? [[CONTACT_US]].',
        ],
      },
    ],
    disclaimer: 'Update this page when you add third-party scripts so visitors know what runs on the site.',
  },
  fr: {
    heroLabel: 'Legal',
    heroTitle: 'Notice cookies',
    heroTagline: 'Quels cookies peuvent etre utilises et comment les controler.',
    sections: [
      {
        title: 'Que sont les cookies ?',
        paragraphs: [
          'Les cookies sont de petits fichiers enregistres sur votre appareil lors de la visite. Ils aident le site a fonctionner, memorisent des preferences ou mesurent le trafic.',
        ],
      },
      {
        title: 'Comment nous les utilisons',
        paragraphs: [
          'Le site peut utiliser des cookies strictement necessaires pour le chargement et les formulaires, et des cookies analytiques ou fonctionnels si vous ajoutez des outils (ex. analytique, pixel). Listez les outils precis une fois integres.',
        ],
      },
      {
        title: 'Vos choix',
        paragraphs: [
          'Vous pouvez bloquer ou supprimer les cookies dans les parametres du navigateur. Le blocage peut limiter certaines fonctions du site.',
        ],
      },
      {
        title: 'Plus de details',
        paragraphs: [
          'Pour le traitement des donnees personnelles au sens large, voir la [[PRIVACY_POLICY]]. Questions : [[CONTACT_PAGE]].',
        ],
      },
    ],
    disclaimer:
      'Mettez a jour cette page lorsque vous ajoutez des scripts tiers pour informer les visiteurs.',
  },
  pt: {
    heroLabel: 'Legal',
    heroTitle: 'Aviso de cookies',
    heroTagline: 'Quais cookies podem ser usados e como controla-los.',
    sections: [
      {
        title: 'O que sao cookies?',
        paragraphs: [
          'Cookies sao pequenos arquivos gravados no seu dispositivo ao visitar um site. Ajudam o site a funcionar, lembram preferencias ou medem trafego.',
        ],
      },
      {
        title: 'Como usamos',
        paragraphs: [
          'O site pode usar cookies estritamente necessarios para carregar paginas e formularios, e cookies analiticos ou funcionais se voce adicionar ferramentas. Liste as ferramentas ao integra-las.',
        ],
      },
      {
        title: 'Suas escolhas',
        paragraphs: [
          'Voce pode bloquear ou excluir cookies nas configuracoes do navegador. Bloquear alguns pode limitar partes do site.',
        ],
      },
      {
        title: 'Mais detalhes',
        paragraphs: [
          'Para dados pessoais de forma mais ampla, veja a [[PRIVACY_POLICY]]. Duvidas: [[CONTACT_PAGE]].',
        ],
      },
    ],
    disclaimer: 'Atualize esta pagina ao adicionar scripts de terceiros para informar visitantes.',
  },
  ar: {
    heroLabel: 'قانوني',
    heroTitle: 'إشعار ملفات تعريف الارتباط',
    heroTagline: 'ما قد يُستخدم من ملفات وكيف تتحكمون بها.',
    sections: [
      {
        title: 'ما هي ملفات تعريف الارتباط؟',
        paragraphs: [
          'ملفات صغيرة تُخزَّن على جهازكم عند الزيارة. تساعد الموقع على العمل أو تذكر التفضيلات أو قياس الزيارات.',
        ],
      },
      {
        title: 'كيف نستخدمها',
        paragraphs: [
          'قد يستخدم الموقع ملفات ضرورية للتشغيل والنماذج، وملفات تحليلية أو وظيفية إذا أضفتم أدواتاً خارجية. اذكروا الأدوات عند ربطها.',
        ],
      },
      {
        title: 'خياراتكم',
        paragraphs: [
          'يمكنكم حظر أو حذف الملفات من إعدادات المتصفح. قد يحد الحظر من بعض وظائف الموقع.',
        ],
      },
      {
        title: 'مزيد من التفاصيل',
        paragraphs: [
          'لمعالجة البيانات الشخصية بشكل أوسع اطلعوا على [[PRIVACY_POLICY]]. للأسئلة: [[CONTACT_PAGE]].',
        ],
      },
    ],
    disclaimer: 'حدّثوا الصفحة عند إضافة سكربتات طرف ثالث لإعلام الزوار.',
  },
};

export function getPrivacyCopy(locale: AppLocale): LegalBlock {
  return PRIVACY[locale] ?? PRIVACY.en;
}

export function getTermsCopy(locale: AppLocale): LegalBlock {
  return TERMS[locale] ?? TERMS.en;
}

export function getCookiesCopy(locale: AppLocale): LegalBlock {
  return COOKIES[locale] ?? COOKIES.en;
}

const PRIVACY_META: Record<AppLocale, Pick<Metadata, 'title' | 'description'>> = {
  en: {
    title: 'Privacy policy',
    description: 'How Agile Media Solutions handles personal data collected through this website.',
  },
  fr: {
    title: 'Politique de confidentialite',
    description:
      'Comment Agile Media Solutions traite les donnees personnelles recueillies via ce site web.',
  },
  pt: {
    title: 'Politica de privacidade',
    description:
      'Como a Agile Media Solutions trata dados pessoais coletados por este site.',
  },
  ar: {
    title: 'سياسة الخصوصية',
    description: 'كيف تتعامل Agile Media Solutions مع البيانات الشخصية المجمّعة عبر هذا الموقع.',
  },
};

const TERMS_META: Record<AppLocale, Pick<Metadata, 'title' | 'description'>> = {
  en: {
    title: 'Terms of service',
    description: 'Terms governing use of the Agile Media Solutions website.',
  },
  fr: {
    title: "Conditions d'utilisation",
    description: "Conditions regissant l'utilisation du site Agile Media Solutions.",
  },
  pt: {
    title: 'Termos de uso',
    description: 'Termos que regem o uso do site da Agile Media Solutions.',
  },
  ar: {
    title: 'شروط الاستخدام',
    description: 'الشروط التي تحكم استخدام موقع Agile Media Solutions.',
  },
};

const COOKIES_META: Record<AppLocale, Pick<Metadata, 'title' | 'description'>> = {
  en: {
    title: 'Cookie notice',
    description: 'How Agile Media Solutions uses cookies and similar technologies.',
  },
  fr: {
    title: 'Notice cookies',
    description: 'Comment Agile Media Solutions utilise les cookies et technologies similaires.',
  },
  pt: {
    title: 'Aviso de cookies',
    description: 'Como a Agile Media Solutions usa cookies e tecnologias similares.',
  },
  ar: {
    title: 'إشعار ملفات تعريف الارتباط',
    description: 'كيف تستخدم Agile Media Solutions ملفات تعريف الارتباط والتقنيات المشابهة.',
  },
};

export function getPrivacyPageMetadata(locale: AppLocale): Pick<Metadata, 'title' | 'description'> {
  return PRIVACY_META[locale] ?? PRIVACY_META.en;
}

export function getTermsPageMetadata(locale: AppLocale): Pick<Metadata, 'title' | 'description'> {
  return TERMS_META[locale] ?? TERMS_META.en;
}

export function getCookiesPageMetadata(locale: AppLocale): Pick<Metadata, 'title' | 'description'> {
  return COOKIES_META[locale] ?? COOKIES_META.en;
}
