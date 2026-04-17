/**
 * One-off / maintenance: rewrite pages.content_json with normalized block anchors (matches API read/write rules).
 * Run from backend/:  node scripts/sanitize-pages-json.js
 * Requires DATABASE_URL (e.g. from .env).
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { Pool } = require('pg');
const { sanitizePageContentJson } = require('../sanitizePageContent');

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }
  const pool = new Pool({ connectionString: DATABASE_URL });
  try {
    const { rows } = await pool.query('SELECT id, slug, content_json FROM pages');
    let updated = 0;
    for (const row of rows) {
      const sanitized = sanitizePageContentJson(row.content_json);
      if (JSON.stringify(sanitized) === JSON.stringify(row.content_json)) continue;
      await pool.query('UPDATE pages SET content_json = $1, updated_at = NOW() WHERE id = $2', [sanitized, row.id]);
      updated += 1;
      console.log('Updated', row.slug);
    }
    console.log(updated === 0 ? 'No rows needed changes.' : `Done. ${updated} page(s) updated.`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
