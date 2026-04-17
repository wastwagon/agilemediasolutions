/**
 * Webflow template CDN assets (Awsa demo) — swap for self-hosted files when your license requires it.
 * @see https://awsatemplate.webflow.io/
 */

const WF = 'https://cdn.prod.website-files.com/696959e4ed1e5a9d6799a34f';
const WF354 = 'https://cdn.prod.website-files.com/696959e4ed1e5a9d6799a354';

/** Same full-bleed photo as template hero + service cards */
export const nhTemplateHeroPhoto = `${WF}/69696db7e6e52df7c5c8bbbb_sufyan-crKFSTKufs8-unsplash.jpg`;

/** /newhomepage “Who we are” framed feature (laptop / studio reference) — self-hosted under `public/images`. */
export const nhWhoWeAreFeatureImage = '/images/nh-who-we-are-feature.png';

export const nhTemplateGreenCheck = `${WF}/696959e4ed1e5a9d6799a646_Green.svg`;

export const nhTemplateWhyMark = `${WF}/696bb304de90df35108904f5_873b2844beae0745a40f102e88979efa_Mark_Logo_White.png`;

/** Contact column visual (template `.marketingdiv`) */
export const nhTemplateContactVisual = `${WF}/696959e4ed1e5a9d6799a5e1_683aff1469d09089843bf689_E-Commerce%20%20Website%20Design.avif`;

/** Project thumbnails (template CMS order: Unleay, Natale, Veauly, Motion Studio) */
export const nhTemplateProjectCovers = [
  `${WF354}/696ab84fa809cb2e2f48606f_ChatGPT%20Image%2016%20ene%202026%2C%2019_14_27.png`,
  `${WF354}/696ab8c6b84dfffe07b570e6_ChatGPT%20Image%2016%20ene%202026%2C%2019_16_30.png`,
  `${WF354}/696ab7d887ef9b4badefe3e9_ChatGPT%20Image%2016%20ene%202026%2C%2019_12_37.png`,
  `${WF354}/696abbc5834f798d8a602790_ChatGPT%20Image%2016%20ene%202026%2C%2019_29_18.png`,
] as const;

export const nhTemplateTestimonialPhotos = [
  `${WF}/696959e4ed1e5a9d6799a76f_avatar-sophie-moore-testimonials-webflow-cloneable-template-brix-templates.jpg`,
  `${WF}/696959e4ed1e5a9d6799a62f_avatar-mike-warren-testimonials-webflow-cloneable-template-brix-templates.jpg`,
  `${WF}/696959e4ed1e5a9d6799a770_avatar-adam-smith-testimonials-webflow-cloneable-template-brix-templates.jpg`,
] as const;

export const nhTemplateTeamPhotos = [
  `${WF}/696959e4ed1e5a9d6799a64a_2dZbAn2T48PE4uLkIMcKmgOE.avif`,
  `${WF}/696959e4ed1e5a9d6799a64d_90COyTxcjHBBHhSI1zLPGjEEBGs.avif`,
  `${WF}/696959e4ed1e5a9d6799a5c3_x8Vvbn6HKQypY84DLO7MftOuFQ.avif`,
] as const;

/** FAQ accordion “+” icon (Awsa template asset) */
export const nhTemplateFaqToggle = `${WF}/696c3dcdf363a8a5472023dd_3acfd1c7302ef94626bbfe5aeb6776fc_add-plus-svgrepo-com.svg`;
