#!/usr/bin/env node
/**
 * Single source: config/reserved-slugs.json
 * Copies (or verifies) to frontend/config/reserved-slugs.json and backend/reserved-slugs.json.
 *
 *   node scripts/sync-reserved-slugs.js           — write all three (dedupe + sort)
 *   node scripts/sync-reserved-slugs.js --check   — exit 1 if any file differs
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const source = path.join(root, 'config', 'reserved-slugs.json');
const targets = [
  path.join(root, 'frontend', 'config', 'reserved-slugs.json'),
  path.join(root, 'backend', 'reserved-slugs.json'),
];

function normalizeSlugs(data) {
  if (!Array.isArray(data)) {
    throw new Error('config/reserved-slugs.json must be a JSON array of strings');
  }
  for (const s of data) {
    if (typeof s !== 'string' || !s.trim()) {
      throw new Error('Each slug must be a non-empty string');
    }
  }
  return [...new Set(data.map((s) => s.trim()))].sort((a, b) => a.localeCompare(b));
}

function serialize(slugs) {
  return `${JSON.stringify(slugs, null, 2)}\n`;
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const raw = JSON.parse(fs.readFileSync(source, 'utf8'));
  const slugs = normalizeSlugs(raw);
  const canonical = serialize(slugs);

  if (checkOnly) {
    const files = [source, ...targets];
    for (const file of files) {
      if (!fs.existsSync(file)) {
        console.error(`Missing file: ${path.relative(root, file)}`);
        process.exit(1);
      }
      const cur = fs.readFileSync(file, 'utf8');
      if (cur !== canonical) {
        console.error(`Out of sync: ${path.relative(root, file)}`);
        console.error('Run: npm run sync:reserved-slugs (from repo root)');
        process.exit(1);
      }
    }
    console.log('reserved-slugs: OK (config, frontend, backend match)');
    return;
  }

  fs.mkdirSync(path.dirname(source), { recursive: true });
  fs.writeFileSync(source, canonical, 'utf8');
  for (const target of targets) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, canonical, 'utf8');
  }
  console.log('reserved-slugs: synced → config/, frontend/config/, backend/');
}

try {
  main();
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
}
