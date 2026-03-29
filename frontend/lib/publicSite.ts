/** Canonical public origin (no trailing slash). */
export function publicSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.agilemediasolutions.com').replace(/\/$/, '');
}

/** Turn a path or absolute URL into an absolute URL for OG / JSON-LD. */
export function absPublicUrl(pathOrUrl: string): string {
  const t = pathOrUrl.trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith('/')) return `${publicSiteUrl()}${t}`;
  return t;
}

/** First image block URL suitable for Open Graph (absolute). */
export function firstOgImageFromBlocks(blocks: unknown): string | undefined {
  if (!Array.isArray(blocks)) return undefined;
  for (const b of blocks) {
    if (!b || typeof b !== 'object') continue;
    const o = b as { type?: string; url?: string };
    if (o.type !== 'image') continue;
    const url = String(o.url || '').trim();
    if (!url) continue;
    const abs = absPublicUrl(url);
    return abs || undefined;
  }
  return undefined;
}
