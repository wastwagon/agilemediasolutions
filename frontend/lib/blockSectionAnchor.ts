/**
 * Valid fragment / section id for CMS blocks (letter-first, safe for CSS/HTML).
 */
export function blockSectionId(raw?: string): string | undefined {
  if (!raw || typeof raw !== 'string') return undefined;
  const s = raw.trim().replace(/\s+/g, '-');
  if (!s) return undefined;
  return /^[A-Za-z][A-Za-z0-9_-]*$/.test(s) ? s : undefined;
}

/**
 * Turn editor input into a valid anchor when possible (spaces → hyphens, strip junk;
 * if the value would not start with a letter, prefix `id-`).
 */
export function coerceBlockSectionAnchor(raw: string): string | undefined {
  if (!raw || typeof raw !== 'string') return undefined;
  let s = raw
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9_-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^[-_]+/, '')
    .replace(/[-_]+$/, '');
  if (!s) return undefined;
  if (!/^[A-Za-z]/.test(s)) s = `id-${s}`;
  return /^[A-Za-z][A-Za-z0-9_-]*$/.test(s) ? s : undefined;
}

/** True when non-empty input cannot be coerced to a valid section id (shown in admin). */
export function isBlockAnchorInputInvalid(raw: string | undefined): boolean {
  const t = (raw || '').trim();
  if (!t) return false;
  return coerceBlockSectionAnchor(t) === undefined;
}

export function preparePageBlockAnchorsForSave<T extends { anchorId?: string }>(blocks: T[]): T[] {
  const seen = new Set<string>();
  return blocks.map((b) => {
    const raw = (b.anchorId || '').trim();
    if (!raw) return { ...b, anchorId: undefined };
    let id = coerceBlockSectionAnchor(raw);
    if (!id) return { ...b, anchorId: undefined };
    let n = id;
    let k = 2;
    while (seen.has(n)) {
      n = `${id}-${k}`;
      k += 1;
    }
    seen.add(n);
    return { ...b, anchorId: n };
  });
}
