/** Shown as link text on the Contact page (“Phone / WhatsApp: …” line). */
export const DEFAULT_GENERAL_PHONE_LABEL = 'Phone / WhatsApp';
export const DEFAULT_GENERAL_PHONE_DISPLAY = '+233 50 536 6200';
/** Thin top bar: full link label including number. */
export const DEFAULT_PHONE_WHATSAPP_LABEL = `${DEFAULT_GENERAL_PHONE_LABEL}: ${DEFAULT_GENERAL_PHONE_DISPLAY}`;
/** Opens WhatsApp chat (digits only, country code without +). */
export const DEFAULT_PHONE_WHATSAPP_HREF = 'https://wa.me/233505366200';
export const DEFAULT_PHONE_TEL_HREF = 'tel:+233505366200';
export const DEFAULT_PHONE_E164 = '+233505366200';

/** Older Site Content rows used this label without the number; it overrides code defaults if left in the DB. */
export const LEGACY_TOP_BAR_CONTACT_LABEL = 'Phone / WhatsApp';

function looksCorruptedTopBarLabel(value: string): boolean {
  const s = value.trim();
  if (!s) return false;
  if (s.length > 90) return true;
  if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) return true;
  if (s.includes('":{"') || s.includes('","') || s.includes('":{')) return true;
  return false;
}

/**
 * Top bar: show full number + WhatsApp link even when CMS still has the legacy short label or /contact link.
 */
export function resolveTopBarPhoneFromCms(
  contactLabel: string | undefined,
  contactHref: string | undefined
): { label: string; href: string } {
  const rawLabel = (contactLabel ?? '').trim();
  const rawHref = (contactHref ?? '').trim();
  let label = rawLabel || DEFAULT_PHONE_WHATSAPP_LABEL;
  let href = rawHref || DEFAULT_PHONE_WHATSAPP_HREF;
  if (rawLabel === LEGACY_TOP_BAR_CONTACT_LABEL) {
    label = DEFAULT_PHONE_WHATSAPP_LABEL;
  }
  if (rawHref === '/contact#contact' || rawHref === '/contact') {
    href = DEFAULT_PHONE_WHATSAPP_HREF;
  }
  if (looksCorruptedTopBarLabel(label)) {
    label = DEFAULT_PHONE_WHATSAPP_LABEL;
  }
  return { label, href };
}
