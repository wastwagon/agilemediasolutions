/**
 * Use Next/Image optimization for same-origin URLs and relative paths; skip optimizer for
 * remote CDNs or unknown hosts (avoids remotePatterns sprawl).
 */
export function cmsImageShouldUnoptimize(src: string): boolean {
  const t = src.trim();
  if (!t || t.startsWith('data:') || t.startsWith('blob:')) return true;
  if (t.startsWith('/')) return false;

  const siteRaw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') || '';
  if (!/^https?:\/\//i.test(t)) return true;

  try {
    const normalized = t.startsWith('//') ? `https:${t}` : t;
    const img = new URL(normalized);
    if (!siteRaw) return true;
    const base = new URL(siteRaw.includes('://') ? siteRaw : `https://${siteRaw}`);
    if (img.hostname !== base.hostname) return true;
    if (img.protocol !== base.protocol) return true;
    return false;
  } catch {
    return true;
  }
}
