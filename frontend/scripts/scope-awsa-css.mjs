/**
 * Scope Webflow export under .nh-page.awsa-exact so it does not affect the main site.
 * Run from repo root: node frontend/scripts/scope-awsa-css.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PREFIX = '.nh-page.awsa-exact';
const INPUT = path.join(__dirname, '../app/newhomepage/vendor/awsa.webflow.raw.css');
const OUTPUT = path.join(__dirname, '../app/newhomepage/awsa.webflow.scoped.css');

function skipWs(css, i) {
  while (i < css.length && /\s/.test(css[i])) i++;
  return i;
}

function skipComment(css, i) {
  if (css[i] === '/' && css[i + 1] === '*') {
    i += 2;
    while (i < css.length - 1 && !(css[i] === '*' && css[i + 1] === '/')) i++;
    return i + 2;
  }
  return i;
}

function readString(css, i, quote) {
  i++;
  while (i < css.length) {
    const c = css[i];
    if (c === '\\') {
      i += 2;
      continue;
    }
    if (c === quote) return i + 1;
    i++;
  }
  return i;
}

/** Find index of `{` starting the declaration block for this rule (handles strings, parens). */
function findOpeningBrace(css, start) {
  let i = start;
  let inStr = null;
  let paren = 0;
  while (i < css.length) {
    const c = css[i];
    if (inStr) {
      if (c === '\\') {
        i += 2;
        continue;
      }
      if (c === inStr) inStr = null;
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      i++;
      continue;
    }
    if (c === '(') paren++;
    else if (c === ')') paren = Math.max(0, paren - 1);
    else if (c === '{' && paren === 0) return i;
    i++;
  }
  return -1;
}

function readBalancedBlock(css, openIdx) {
  let i = openIdx + 1;
  let depth = 1;
  let inStr = null;
  const start = i;
  while (i < css.length && depth > 0) {
    const c = css[i];
    if (inStr) {
      if (c === '\\') {
        i += 2;
        continue;
      }
      if (c === inStr) inStr = null;
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      i++;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        return { inner: css.slice(start, i), end: i + 1 };
      }
    }
    i++;
  }
  throw new Error(`Unclosed block near ${openIdx}`);
}

function scopeSelectorList(sel) {
  const parts = sel.split(',').map((s) => s.trim()).filter(Boolean);
  return parts
    .map((p) => {
      if (p === 'html' || p.startsWith('html ')) return null;
      if (p === 'body' || p === ':root') return PREFIX;
      if (p.startsWith('body ')) return `${PREFIX} ${p.slice(5)}`;
      if (p.startsWith(':root ')) return `${PREFIX} ${p.slice(6)}`;
      return `${PREFIX} ${p}`;
    })
    .filter(Boolean)
    .join(', ');
}

/**
 * Webflow exports custom properties like `--green\:` and references like `var(--green\)`.
 * PostCSS rejects those escapes; normalize to stable names so Next.js can parse the file.
 */
function normalizeWebflowCustomProps(css) {
  return css
    .replace(/--([\w-]+)\\:/g, '--$1-wf:')
    .replace(/var\((--[\w-]+)\\\)/g, 'var($1-wf)');
}

function processChunk(css) {
  let out = '';
  let i = 0;
  while (i < css.length) {
    i = skipWs(css, i);
    i = skipComment(css, i);
    if (i >= css.length) break;
    const selStart = i;
    const brace = findOpeningBrace(css, selStart);
    if (brace < 0) break;
    const rawSel = css.slice(selStart, brace).trim();
    const { inner, end } = readBalancedBlock(css, brace);
    i = end;

    if (!rawSel) continue;

    if (rawSel.startsWith('@')) {
      if (rawSel.startsWith('@keyframes') || rawSel.startsWith('@font-face')) {
        out += `${rawSel}{${inner}}`;
        continue;
      }
      if (rawSel.startsWith('@media') || rawSel.startsWith('@supports') || rawSel.startsWith('@container')) {
        out += `${rawSel}{${processChunk(inner)}}`;
        continue;
      }
      // Other @ rules: keep verbatim
      out += `${rawSel}{${inner}}`;
      continue;
    }

    if (rawSel === 'html' || rawSel.startsWith('html ')) {
      continue;
    }

    let scopedList = scopeSelectorList(rawSel);
    if (!scopedList) continue;

    out += `${scopedList}{${inner}}`;
  }
  return out;
}

const raw = fs.readFileSync(INPUT, 'utf8');
const header = `/* AUTO-GENERATED — do not edit by hand. Run: node frontend/scripts/scope-awsa-css.mjs */\n/* Source: Webflow Awsa shared CSS, scoped to ${PREFIX} */\n\n`;
const body = normalizeWebflowCustomProps(processChunk(raw));
fs.writeFileSync(OUTPUT, header + body);
console.log('Wrote', OUTPUT, 'bytes', Buffer.byteLength(header + body, 'utf8'));
