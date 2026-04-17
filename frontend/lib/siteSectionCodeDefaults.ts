import { SITE_SECTION_CODE_DEFAULTS } from '@/lib/siteSectionCodeDefaultsMap';

export { SITE_SECTION_CODE_DEFAULTS };

type SectionContentMap = Record<string, Record<string, string>>;

/** Fill blank fields only so saved CMS values always win. */
export function mergeSiteSectionCodeDefaults(next: SectionContentMap): SectionContentMap {
  const out: SectionContentMap = { ...next };
  for (const [sectionKey, codeDefaults] of Object.entries(SITE_SECTION_CODE_DEFAULTS)) {
    const row = out[sectionKey];
    if (!row) continue;
    const merged = { ...row };
    for (const [fieldId, value] of Object.entries(codeDefaults)) {
      if (!String(merged[fieldId] ?? '').trim()) merged[fieldId] = value;
    }
    out[sectionKey] = merged;
  }
  return out;
}
