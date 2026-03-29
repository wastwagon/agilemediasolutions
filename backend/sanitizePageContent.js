/**
 * Mirrors frontend/lib/blockSectionAnchor.ts so API-saved page blocks get safe, unique anchor ids.
 */

function coerceBlockSectionAnchor(raw) {
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

function normalizePageBlocks(blocks) {
  if (!Array.isArray(blocks)) return blocks;
  const seen = new Set();
  return blocks.map((b) => {
    if (!b || typeof b !== 'object') return b;
    const raw = typeof b.anchorId === 'string' ? b.anchorId.trim() : '';
    if (!raw) {
      const { anchorId, ...rest } = b;
      return rest;
    }
    let id = coerceBlockSectionAnchor(raw);
    if (!id) {
      const { anchorId, ...rest } = b;
      return rest;
    }
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

function sanitizePageContentJson(contentJson) {
  if (!contentJson || typeof contentJson !== 'object') return contentJson || {};
  const out = { ...contentJson };
  if (Array.isArray(out.blocks)) {
    out.blocks = normalizePageBlocks(out.blocks);
  }
  return out;
}

/** Apply block anchor rules to a full page row before JSON response (read path + legacy rows). */
function pageRowWithSanitizedContent(row) {
  if (!row || typeof row !== 'object') return row;
  return {
    ...row,
    content_json: sanitizePageContentJson(row.content_json),
  };
}

module.exports = {
  sanitizePageContentJson,
  normalizePageBlocks,
  coerceBlockSectionAnchor,
  pageRowWithSanitizedContent,
};
