require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
const { createClient } = require('redis');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { seedAgileContent } = require('./seedContent');
const { sanitizePageContentJson, pageRowWithSanitizedContent } = require('./sanitizePageContent');
const RESERVED_APP_SLUGS = require(path.join(__dirname, 'reserved-slugs.json'));

const app = express();

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = (process.env.CORS_ORIGIN || '').trim();
const DATABASE_URL = process.env.DATABASE_URL;
const REDIS_URL = process.env.REDIS_URL;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DEFAULT_DEV_JWT_SECRET = 'agile_media_secret_123';
const JWT_SECRET = (process.env.JWT_SECRET || '').trim() || DEFAULT_DEV_JWT_SECRET;
const INSECURE_JWT_SECRETS = new Set([
  DEFAULT_DEV_JWT_SECRET,
  'agile_media_change_me_in_production',
  'change-me-to-a-long-random-secret',
]);
const SHOULD_SEED_DEFAULT_ADMIN =
  !IS_PRODUCTION && process.env.SEED_DEFAULT_ADMIN === 'true';
const LOGIN_WINDOW_MS = Math.max(60_000, parseInt(process.env.LOGIN_WINDOW_MS || '900000', 10));
const LOGIN_MAX_ATTEMPTS = Math.max(1, parseInt(process.env.LOGIN_MAX_ATTEMPTS || '5', 10));
const LOGIN_LOCK_MS = Math.max(60_000, parseInt(process.env.LOGIN_LOCK_MS || '900000', 10));
const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_CSRF_COOKIE = 'admin_csrf';
const ADMIN_COOKIE_SAME_SITE = IS_PRODUCTION ? 'strict' : 'lax';

if (IS_PRODUCTION && INSECURE_JWT_SECRETS.has(JWT_SECRET)) {
  console.error(
    'Fatal: JWT_SECRET must be set to a strong random value in production (Coolify: Environment Variables for the backend service). Empty or default secrets are rejected.'
  );
  process.exit(1);
}

if (IS_PRODUCTION && (!CORS_ORIGIN || CORS_ORIGIN === '*')) {
  console.error(
    'Fatal: CORS_ORIGIN must be set to your public site origin(s), comma-separated (e.g. https://agile-media.com). It cannot be empty or * in production.'
  );
  process.exit(1);
}

if (IS_PRODUCTION && process.env.SEED_DEFAULT_ADMIN === 'true') {
  console.warn('Warning: SEED_DEFAULT_ADMIN=true is ignored in production for safety.');
}

const parsedCorsOrigins =
  !CORS_ORIGIN
    ? true
    : CORS_ORIGIN === '*'
    ? true
    : CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
if (IS_PRODUCTION) {
  app.set('trust proxy', 1);
}
app.use(cors({ origin: parsedCorsOrigins, credentials: true }));
app.use(express.json());
app.use(morgan('combined'));

const loginAttemptStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of loginAttemptStore.entries()) {
    const expiredLock = entry.lockedUntil && now > entry.lockedUntil;
    const staleWindow = now - entry.windowStartedAt > LOGIN_WINDOW_MS * 2;
    if (expiredLock || staleWindow) loginAttemptStore.delete(key);
  }
}, 60_000).unref?.();

const getLoginAttemptKey = (req) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const username = String(req.body?.username || '').trim().toLowerCase();
  return `${ip}::${username}`;
};

const readLoginAttemptState = (key) => {
  const now = Date.now();
  const state = loginAttemptStore.get(key);
  if (!state) return { count: 0, windowStartedAt: now, lockedUntil: 0 };
  if (now - state.windowStartedAt > LOGIN_WINDOW_MS) {
    return { count: 0, windowStartedAt: now, lockedUntil: state.lockedUntil || 0 };
  }
  return state;
};

const recordLoginFailure = (key) => {
  const now = Date.now();
  const state = readLoginAttemptState(key);
  const nextCount = state.count + 1;
  if (nextCount >= LOGIN_MAX_ATTEMPTS) {
    loginAttemptStore.set(key, {
      count: 0,
      windowStartedAt: now,
      lockedUntil: now + LOGIN_LOCK_MS,
    });
    return;
  }
  loginAttemptStore.set(key, {
    count: nextCount,
    windowStartedAt: state.windowStartedAt,
    lockedUntil: state.lockedUntil || 0,
  });
};

const clearLoginAttemptState = (key) => {
  loginAttemptStore.delete(key);
};

const parseCookies = (req) => {
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader || typeof cookieHeader !== 'string') return {};
  const cookies = {};
  for (const part of cookieHeader.split(';')) {
    const [rawKey, ...rest] = part.trim().split('=');
    if (!rawKey) continue;
    cookies[rawKey] = decodeURIComponent(rest.join('=') || '');
  }
  return cookies;
};

const createCsrfToken = () => crypto.randomBytes(24).toString('hex');

const setCsrfCookie = (res, token) => {
  res.cookie(ADMIN_CSRF_COOKIE, token, {
    httpOnly: false,
    sameSite: ADMIN_COOKIE_SAME_SITE,
    secure: IS_PRODUCTION,
    maxAge: 8 * 60 * 60 * 1000,
    path: '/',
  });
};

const ensureCsrfCookie = (req, res) => {
  const cookies = parseCookies(req);
  const existing = cookies[ADMIN_CSRF_COOKIE];
  if (typeof existing === 'string' && existing.trim()) return existing.trim();
  const nextToken = createCsrfToken();
  setCsrfCookie(res, nextToken);
  return nextToken;
};

const isMutationMethod = (method) => {
  const normalized = String(method || '').toUpperCase();
  return normalized !== 'GET' && normalized !== 'HEAD' && normalized !== 'OPTIONS';
};

const isCsrfRequestValid = (req) => {
  const cookies = parseCookies(req);
  const cookieToken = cookies[ADMIN_CSRF_COOKIE];
  const headerToken = req.headers['x-csrf-token'];
  if (typeof cookieToken !== 'string' || !cookieToken.trim()) return false;
  if (typeof headerToken !== 'string' || !headerToken.trim()) return false;
  return cookieToken === headerToken;
};

const SENSITIVE_AUDIT_KEYS = new Set([
  'password',
  'password_hash',
  'token',
  'csrf',
  'csrfToken',
]);

const truncateAuditText = (value, max = 400) => {
  const text = String(value ?? '');
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
};

const redactAuditPayload = (value, depth = 0) => {
  if (value === null || value === undefined) return value;
  if (depth >= 4) return '[truncated-depth]';
  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => redactAuditPayload(item, depth + 1));
  }
  if (typeof value === 'object') {
    const next = {};
    for (const [key, val] of Object.entries(value)) {
      if (SENSITIVE_AUDIT_KEYS.has(key)) {
        next[key] = '[redacted]';
        continue;
      }
      next[key] = redactAuditPayload(val, depth + 1);
    }
    return next;
  }
  if (typeof value === 'string') return truncateAuditText(value, 600);
  return value;
};

const deriveAuditTarget = (req) => {
  const routePath = String(req.path || '').replace(/^\/api\//, '');
  const [entityType = 'unknown'] = routePath.split('/');
  const entityRef = req.params?.id || req.params?.slug || req.params?.key || null;
  return { entityType, entityRef: entityRef ? String(entityRef) : null };
};

const writeAdminAuditLog = async (req, res, user, payload) => {
  if (!pgPool || !user) return;
  try {
    const { entityType, entityRef } = deriveAuditTarget(req);
    await pgPool.query(
      `INSERT INTO admin_audit_logs
       (actor_user_id, actor_username, action_method, action_path, entity_type, entity_ref, status_code, ip_address, user_agent, request_payload)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        user.id ?? null,
        user.username ?? null,
        String(req.method || '').toUpperCase(),
        String(req.originalUrl || req.path || ''),
        entityType,
        entityRef,
        Number.isInteger(res.statusCode) ? res.statusCode : 0,
        truncateAuditText(req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '', 120),
        truncateAuditText(req.headers['user-agent'] || '', 300),
        payload || null,
      ]
    );
  } catch (err) {
    console.error('Audit log write failed:', err.message);
  }
};

const attachAdminAuditLogger = (req, res, user) => {
  if (!isMutationMethod(req.method)) return;
  if (res.locals.__adminAuditAttached) return;
  res.locals.__adminAuditAttached = true;
  const payload = redactAuditPayload(req.body || null);
  res.on('finish', () => {
    void writeAdminAuditLog(req, res, user, payload);
  });
};

const getTokenCandidatesFromRequest = (req) => {
  const tokens = [];
  const cookies = parseCookies(req);
  const cookieToken = cookies[ADMIN_SESSION_COOKIE];
  if (typeof cookieToken === 'string' && cookieToken.trim()) tokens.push(cookieToken.trim());
  return tokens;
};

const getVerifiedAuthUser = (req) => {
  const tokens = getTokenCandidatesFromRequest(req);
  for (const token of tokens) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      // try next token candidate
    }
  }
  return null;
};

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const parseRequiredText = (value, field, max = 500) => {
  if (typeof value !== 'string') throw new ValidationError(`${field} must be a string`);
  const trimmed = value.trim();
  if (!trimmed) throw new ValidationError(`${field} is required`);
  if (trimmed.length > max) throw new ValidationError(`${field} is too long`);
  return trimmed;
};

const parseOptionalText = (value, field, max = 5000) => {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw new ValidationError(`${field} must be a string`);
  const trimmed = value.trim();
  if (trimmed.length > max) throw new ValidationError(`${field} is too long`);
  return trimmed || null;
};

const parseOptionalUrlLike = (value, field) => {
  const parsed = parseOptionalText(value, field, 2000);
  if (!parsed) return null;
  const isAllowedPath = parsed.startsWith('/');
  const isAllowedHttp = /^https?:\/\//i.test(parsed);
  if (!isAllowedPath && !isAllowedHttp) {
    throw new ValidationError(`${field} must be a valid URL or relative path`);
  }
  return parsed;
};

const parseOrderIndex = (value) => {
  if (value === undefined || value === null || value === '') return 0;
  const n = Number.parseInt(String(value), 10);
  if (!Number.isFinite(n) || n < 0 || n > 100000) {
    throw new ValidationError('order_index must be an integer between 0 and 100000');
  }
  return n;
};

const parseInsightSlug = (value) => {
  const raw = parseRequiredText(value, 'slug', 180);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw)) {
    throw new ValidationError('slug must use lowercase letters, numbers, and hyphens only');
  }
  return raw;
};

const parsePublishedFlag = (value) => {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  if (typeof value === 'string') {
    const s = value.trim().toLowerCase();
    if (s === 'true' || s === '1' || s === 'yes' || s === 'on') return true;
    if (s === 'false' || s === '0' || s === 'no') return false;
  }
  return Boolean(value);
};

const resolveInsightCategoryId = async (pool, value) => {
  if (!pool) throw new ValidationError('Database not available');
  if (value === undefined || value === null || value === '') return null;
  const n = Number.parseInt(String(value), 10);
  if (!Number.isFinite(n) || n < 1) {
    throw new ValidationError('category_id must be a positive integer or empty');
  }
  const r = await pool.query('SELECT id FROM insight_categories WHERE id = $1', [n]);
  if (r.rows.length === 0) throw new ValidationError('Category not found');
  return n;
};

const shapeInsightPostRow = (row) => {
  if (!row) return row;
  const category =
    row.category_id != null && row.category_name != null
      ? { id: row.category_id, name: row.category_name, slug: row.category_slug }
      : null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    meta: row.meta,
    excerpt: row.excerpt,
    body: row.body,
    image_url: row.image_url,
    media_class: row.media_class,
    published: row.published,
    order_index: row.order_index,
    category_id: row.category_id ?? null,
    category,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Serve static uploaded files
app.use('/uploads', express.static(uploadDir));

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + ext);
  }
});
const MAX_UPLOAD_SIZE_BYTES = parseInt(process.env.MAX_UPLOAD_SIZE_BYTES || '10485760', 10); // 10MB default
const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const upload = multer({
  storage,
  limits: {
    fileSize: Number.isFinite(MAX_UPLOAD_SIZE_BYTES) && MAX_UPLOAD_SIZE_BYTES > 0 ? MAX_UPLOAD_SIZE_BYTES : 10485760,
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_UPLOAD_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Unsupported file type. Please upload JPG, PNG, WEBP, or GIF.'));
  },
});

const MAX_VIDEO_UPLOAD_SIZE_BYTES = parseInt(process.env.MAX_VIDEO_UPLOAD_SIZE_BYTES || '52428800', 10); // 50MB default
const ALLOWED_VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/webm']);
const uploadVideo = multer({
  storage,
  limits: {
    fileSize:
      Number.isFinite(MAX_VIDEO_UPLOAD_SIZE_BYTES) && MAX_VIDEO_UPLOAD_SIZE_BYTES > 0
        ? MAX_VIDEO_UPLOAD_SIZE_BYTES
        : 52428800,
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_VIDEO_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Unsupported file type. Please upload MP4 or WebM.'));
  },
});

const ensureCoreSchema = async () => {
  if (!pgPool) return;
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS pages (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      content_json JSONB NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'published',
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Ensure new columns exist for older deployments
  await pgPool.query(`ALTER TABLE pages ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';`);
  await pgPool.query(`ALTER TABLE pages ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;`);
  await pgPool.query(`ALTER TABLE pages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`);
  await pgPool.query(`ALTER TABLE pages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`);
  await pgPool.query(`UPDATE pages SET status = 'published' WHERE status IS NULL;`);

  if (SHOULD_SEED_DEFAULT_ADMIN) {
    // Local-development bootstrap only. Disable in production by default.
    await pgPool.query(
      `INSERT INTO admin_users (username, password_hash, email)
       VALUES ('admin', $1, 'admin@agilemediasolution.com')
       ON CONFLICT (username) DO NOTHING`,
      ['$2b$10$jCdH1GjZcCXWiuLhU9tKMOZ58RhcPofWLSSfXdgDY3LMgm5xV.oei']
    );
  }
};

const ensureMediaAssetsTable = async () => {
  if (!pgPool) return;
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS media_assets (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL UNIQUE,
      filename TEXT NOT NULL,
      original_name TEXT,
      mime_type TEXT,
      size_bytes BIGINT,
      alt_text TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

const ensureSiteSectionsTable = async () => {
  if (!pgPool) return;
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS site_sections (
      section_key TEXT PRIMARY KEY,
      content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

const ALLOWED_PAGE_CARD_CONTEXTS = new Set(['digital-engagement', 'studio']);

const parsePageCardContext = (value, field = 'context') => {
  const raw = parseRequiredText(value, field, 80);
  if (!ALLOWED_PAGE_CARD_CONTEXTS.has(raw)) {
    throw new ValidationError(`${field} must be one of: ${[...ALLOWED_PAGE_CARD_CONTEXTS].join(', ')}`);
  }
  return raw;
};

const shapePageContentCardRow = (row) => {
  if (!row) return row;
  return {
    id: row.id,
    context: row.context,
    title: row.title,
    body: row.body,
    image_url: row.image_url,
    list_label: row.list_label,
    list_items: row.list_items,
    published: row.published,
    order_index: row.order_index,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

const ensurePageContentCardsTable = async () => {
  if (!pgPool) return;
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS page_content_cards (
      id SERIAL PRIMARY KEY,
      context TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT,
      image_url TEXT,
      list_label TEXT,
      list_items TEXT,
      published BOOLEAN NOT NULL DEFAULT TRUE,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pgPool.query(
    `CREATE INDEX IF NOT EXISTS page_content_cards_context_published_order_idx ON page_content_cards (context, published, order_index);`
  );
};

const ensureAdminAuditLogsTable = async () => {
  if (!pgPool) return;
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS admin_audit_logs (
      id BIGSERIAL PRIMARY KEY,
      actor_user_id BIGINT,
      actor_username TEXT,
      action_method TEXT NOT NULL,
      action_path TEXT NOT NULL,
      entity_type TEXT,
      entity_ref TEXT,
      status_code INTEGER NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      request_payload JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

const ensureSiteAnalyticsTable = async () => {
  if (!pgPool) return;
  // One statement per round-trip (avoids multi-statement edge cases with some pools / proxies).
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS site_analytics_events (
      id BIGSERIAL PRIMARY KEY,
      event_type TEXT NOT NULL,
      path TEXT NOT NULL,
      referrer TEXT,
      session_key TEXT,
      user_agent TEXT,
      meta_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pgPool.query(
    `CREATE INDEX IF NOT EXISTS site_analytics_events_created_idx ON site_analytics_events (created_at DESC);`
  );
  await pgPool.query(
    `CREATE INDEX IF NOT EXISTS site_analytics_events_type_created_idx ON site_analytics_events (event_type, created_at DESC);`
  );
  await pgPool.query(
    `CREATE INDEX IF NOT EXISTS site_analytics_events_path_created_idx ON site_analytics_events (path, created_at DESC);`
  );
};

/** Ensures Insights tables exist (init.sql historically omitted them; some DBs only ran Docker init). */
const ensureInsightsSchema = async () => {
  if (!pgPool) return;
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS insight_categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS insight_posts (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      meta TEXT,
      excerpt TEXT,
      body TEXT,
      image_url TEXT,
      media_class TEXT,
      published BOOLEAN NOT NULL DEFAULT TRUE,
      order_index INTEGER NOT NULL DEFAULT 0,
      category_id INTEGER REFERENCES insight_categories(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pgPool.query(`ALTER TABLE insight_categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`);
  await pgPool.query(`ALTER TABLE insight_posts ADD COLUMN IF NOT EXISTS media_class TEXT;`);
  await pgPool.query(`ALTER TABLE insight_posts ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT TRUE;`);
  await pgPool.query(
    `ALTER TABLE insight_posts ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES insight_categories(id) ON DELETE SET NULL;`
  );
};

const ensureAppSchemaAndSeed = async () => {
  if (!pgPool) return;
  await ensureCoreSchema();
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      topic TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS brands (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      audience TEXT,
      format TEXT,
      image_url TEXT,
      website_url TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      highlights TEXT,
      icon TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      tagline TEXT,
      body TEXT,
      features TEXT,
      audience TEXT,
      image_url TEXT,
      link_url TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS case_studies (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      client_name TEXT,
      description TEXT,
      image_url TEXT,
      content_json JSONB DEFAULT '{}',
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sectors (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      image_url TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await ensureInsightsSchema();
  await pgPool.query(`ALTER TABLE brands ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`);
  await pgPool.query(`ALTER TABLE brands ADD COLUMN IF NOT EXISTS audience TEXT;`);
  await pgPool.query(`ALTER TABLE brands ADD COLUMN IF NOT EXISTS format TEXT;`);
  await pgPool.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`);
  await pgPool.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS highlights TEXT;`);
  await pgPool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`);
  await pgPool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS tagline TEXT;`);
  await pgPool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS body TEXT;`);
  await pgPool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS features TEXT;`);
  await pgPool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS audience TEXT;`);
  await pgPool.query(`ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`);
  await pgPool.query(`ALTER TABLE sectors ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`);
  await pgPool.query(`ALTER TABLE sectors ADD COLUMN IF NOT EXISTS image_url TEXT;`);
  await ensureMediaAssetsTable();
  await ensureSiteSectionsTable();
  await ensurePageContentCardsTable();
  await ensureAdminAuditLogsTable();
  await ensureSiteAnalyticsTable();
  await seedAgileContent(pgPool);
};

const pgPool = DATABASE_URL ? new Pool({ connectionString: DATABASE_URL }) : null;

const ANALYTICS_ALLOWED_EVENTS = new Set([
  'page_view',
  'newsletter_signup',
  'contact_submit',
  'cta_click',
  'outbound_link',
]);
const ANALYTICS_RATE_WINDOW_MS = 60_000;
const ANALYTICS_RATE_MAX = 100;
const analyticsRateBuckets = new Map();

const getClientIp = (req) => {
  const fwd = (req.headers['x-forwarded-for'] || '').toString().split(',')[0].trim();
  return fwd || req.socket?.remoteAddress || 'unknown';
};

const allowAnalyticsRequest = (ip) => {
  const now = Date.now();
  let b = analyticsRateBuckets.get(ip);
  if (!b || now - b.start > ANALYTICS_RATE_WINDOW_MS) {
    b = { start: now, count: 0 };
    analyticsRateBuckets.set(ip, b);
  }
  b.count += 1;
  return b.count <= ANALYTICS_RATE_MAX;
};

setInterval(() => {
  const now = Date.now();
  for (const [ip, b] of analyticsRateBuckets.entries()) {
    if (now - b.start > ANALYTICS_RATE_WINDOW_MS * 2) analyticsRateBuckets.delete(ip);
  }
}, 120_000).unref?.();

let redisClient = null;
if (REDIS_URL) {
  redisClient = createClient({ url: REDIS_URL });
  redisClient.on('error', (err) => console.error('Redis connection error:', err));
  redisClient.connect().catch((err) => console.error('Redis initial connect failed:', err));
}

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const user = getVerifiedAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (isMutationMethod(req.method) && !isCsrfRequestValid(req)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  attachAdminAuditLogger(req, res, user);
  req.user = user;
  next();
};

const getAuthUserFromRequest = (req) => {
  return getVerifiedAuthUser(req);
};

// Health Check
app.get('/api/health', async (req, res) => {
  const result = { status: 'ok' };
  try {
    if (pgPool) {
      await pgPool.query('SELECT 1');
      result.postgres = 'up';
    }
    if (redisClient) {
      await redisClient.ping();
      result.redis = 'up';
    }
  } catch (err) {
    result.status = 'degraded';
  }
  res.json(result);
});

// Schema readiness check (useful for remote deploy debugging)
app.get('/api/health/schema', async (req, res) => {
  if (!pgPool) return res.status(500).json({ ok: false, error: 'Database not available' });
  try {
    const checks = await Promise.all([
      pgPool.query(`SELECT to_regclass('public.admin_users') AS reg`),
      pgPool.query(`SELECT to_regclass('public.pages') AS reg`),
      pgPool.query(
        `SELECT column_name
         FROM information_schema.columns
         WHERE table_name = 'pages' AND column_name IN ('status', 'published_at')`
      ),
    ]);

    const adminUsersExists = !!checks[0].rows?.[0]?.reg;
    const pagesExists = !!checks[1].rows?.[0]?.reg;
    const pageColumns = (checks[2].rows || []).map((r) => r.column_name);
    const hasStatus = pageColumns.includes('status');
    const hasPublishedAt = pageColumns.includes('published_at');

    res.json({
      ok: adminUsersExists && pagesExists && hasStatus && hasPublishedAt,
      admin_users: adminUsersExists,
      pages: pagesExists,
      pages_columns: {
        status: hasStatus,
        published_at: hasPublishedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });
  const attemptKey = getLoginAttemptKey(req);
  const attemptState = readLoginAttemptState(attemptKey);
  const now = Date.now();
  if (attemptState.lockedUntil && now < attemptState.lockedUntil) {
    const retryAfter = Math.ceil((attemptState.lockedUntil - now) / 1000);
    res.setHeader('Retry-After', retryAfter.toString());
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }

  try {
    await ensureCoreSchema();
    const userResult = await pgPool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    const user = userResult.rows[0];

    // Seed password 'admin123' if first time / hashed comparison
    // In db init we seeded a hash. For this test let's accept admin/admin123
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      clearLoginAttemptState(attemptKey);
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
      const csrfToken = createCsrfToken();
      res.cookie(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: ADMIN_COOKIE_SAME_SITE,
        secure: IS_PRODUCTION,
        maxAge: 8 * 60 * 60 * 1000,
        path: '/',
      });
      setCsrfCookie(res, csrfToken);
      return res.json({ username: user.username, csrfToken });
    }
    recordLoginFailure(attemptKey);
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    recordLoginFailure(attemptKey);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const csrfToken = ensureCsrfCookie(req, res);
  res.json({
    authenticated: true,
    user: req.user?.username || null,
    csrfToken,
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(ADMIN_SESSION_COOKIE, {
    httpOnly: true,
    sameSite: ADMIN_COOKIE_SAME_SITE,
    secure: IS_PRODUCTION,
    path: '/',
  });
  res.clearCookie(ADMIN_CSRF_COOKIE, {
    httpOnly: false,
    sameSite: ADMIN_COOKIE_SAME_SITE,
    secure: IS_PRODUCTION,
    path: '/',
  });
  res.json({ ok: true });
});

// --- CMS Content Endpoints ---

// Upload image
app.post('/api/upload', authenticateToken, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: `File too large. Maximum allowed size is ${Math.floor(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024))}MB.`,
      });
    }
    if (err) {
      return res.status(400).json({ error: err.message || 'Invalid upload request.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Construct the URL path the frontend will use to fetch the image
    const fileUrl = `/uploads/${req.file.filename}`;
    // Persist to media library if DB is available
    if (!pgPool) {
      return res.status(201).json({ url: fileUrl });
    }

    ensureMediaAssetsTable()
      .then(() => pgPool.query(
      `INSERT INTO media_assets (url, filename, original_name, mime_type, size_bytes)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (url) DO UPDATE SET
         original_name = EXCLUDED.original_name,
         mime_type = EXCLUDED.mime_type,
         size_bytes = EXCLUDED.size_bytes
       RETURNING *`,
      [fileUrl, req.file.filename, req.file.originalname, req.file.mimetype, req.file.size]
    ))
      .then((result) => res.status(201).json({ url: fileUrl, asset: result.rows[0] }))
      .catch(() => res.status(201).json({ url: fileUrl }));
  });
});

// Upload hero / CMS video (MP4, WebM)
app.post('/api/upload-video', authenticateToken, (req, res) => {
  uploadVideo.single('video')(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: `File too large. Maximum allowed size is ${Math.floor(MAX_VIDEO_UPLOAD_SIZE_BYTES / (1024 * 1024))}MB.`,
      });
    }
    if (err) {
      return res.status(400).json({ error: err.message || 'Invalid upload request.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    if (!pgPool) {
      return res.status(201).json({ url: fileUrl });
    }

    ensureMediaAssetsTable()
      .then(() =>
        pgPool.query(
          `INSERT INTO media_assets (url, filename, original_name, mime_type, size_bytes)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (url) DO UPDATE SET
             original_name = EXCLUDED.original_name,
             mime_type = EXCLUDED.mime_type,
             size_bytes = EXCLUDED.size_bytes
           RETURNING *`,
          [fileUrl, req.file.filename, req.file.originalname, req.file.mimetype, req.file.size]
        )
      )
      .then((result) => res.status(201).json({ url: fileUrl, asset: result.rows[0] }))
      .catch(() => res.status(201).json({ url: fileUrl }));
  });
});

// Media library
app.get('/api/media', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });
  try {
    await ensureMediaAssetsTable();
    const q = (req.query.q || '').toString().trim();
    const limit = Math.min(parseInt((req.query.limit || '200').toString(), 10) || 200, 500);

    const result = q
      ? await pgPool.query(
          `SELECT * FROM media_assets
           WHERE (original_name ILIKE $1 OR url ILIKE $1 OR filename ILIKE $1)
           ORDER BY created_at DESC
           LIMIT $2`,
          [`%${q}%`, limit]
        )
      : await pgPool.query(`SELECT * FROM media_assets ORDER BY created_at DESC LIMIT $1`, [limit]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/media/:id', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });
  try {
    await ensureMediaAssetsTable();
    const result = await pgPool.query('DELETE FROM media_assets WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Media asset not found' });

    const asset = result.rows[0];
    // Best-effort file delete (only for local uploads)
    if (asset?.filename) {
      const fp = path.join(uploadDir, asset.filename);
      fs.unlink(fp, () => {});
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/media/:id', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });
  try {
    await ensureMediaAssetsTable();
    const { alt_text } = req.body || {};
    const result = await pgPool.query(
      'UPDATE media_assets SET alt_text = $1 WHERE id = $2 RETURNING *',
      [alt_text || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Media asset not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Site sections (copy/content CMS for static-marketing sections)
app.get('/api/site-sections', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });
  try {
    await ensureSiteSectionsTable();
    const result = await pgPool.query('SELECT section_key, content_json, updated_at FROM site_sections ORDER BY section_key ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/site-sections/:key', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });
  const key = (req.params.key || '').trim().toLowerCase();
  const contentJson = req.body?.content_json;
  if (!key) return res.status(400).json({ error: 'Missing section key' });
  if (!contentJson || typeof contentJson !== 'object' || Array.isArray(contentJson)) {
    return res.status(400).json({ error: 'content_json must be an object' });
  }
  try {
    await ensureSiteSectionsTable();
    const sanitizedContent = {};
    for (const [k, v] of Object.entries(contentJson)) {
      if (typeof v !== 'string') continue;
      sanitizedContent[k] = parseOptionalText(v, `content_json.${k}`, 12000) || '';
    }
    const result = await pgPool.query(
      `INSERT INTO site_sections (section_key, content_json, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (section_key)
       DO UPDATE SET content_json = EXCLUDED.content_json, updated_at = NOW()
       RETURNING section_key, content_json, updated_at`,
      [key, JSON.stringify(sanitizedContent)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/site-sections', async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    await ensureSiteSectionsTable();
    const result = await pgPool.query('SELECT section_key, content_json FROM site_sections');
    const map = {};
    for (const row of result.rows) {
      map[row.section_key] = row.content_json || {};
    }
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// First-party analytics (self-hosted; no third-party scripts)
app.post('/api/public/analytics', async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Analytics unavailable' });
  const ip = getClientIp(req);
  if (!allowAnalyticsRequest(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  const body = req.body || {};
  const eventType = String(body.eventType || '').trim();
  if (!ANALYTICS_ALLOWED_EVENTS.has(eventType)) {
    return res.status(400).json({ error: 'Invalid event type' });
  }
  let path = String(body.path || '').trim();
  if (!path.startsWith('/')) path = '/';
  if (path.length > 1024) path = path.slice(0, 1024);
  let referrer = body.referrer != null ? String(body.referrer).trim() : '';
  if (referrer.length > 1500) referrer = referrer.slice(0, 1500);
  const sessionKey = body.sessionKey != null ? String(body.sessionKey).trim().slice(0, 80) : '';
  const ua = (req.headers['user-agent'] || '').toString().slice(0, 400);
  let meta = body.meta;
  if (meta == null || typeof meta !== 'object' || Array.isArray(meta)) meta = {};
  const metaJson = JSON.stringify(meta).length > 4000 ? '{}' : JSON.stringify(meta);

  try {
    await ensureSiteAnalyticsTable();
    await pgPool.query(
      `INSERT INTO site_analytics_events (event_type, path, referrer, session_key, user_agent, meta_json)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
      [eventType, path, referrer || null, sessionKey || null, ua || null, metaJson]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not record event' });
  }
});

// Newsletter
app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });

  try {
    await pgPool.query('INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email]);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }
});

// Brands
app.get('/api/brands', async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    const result = await pgPool.query('SELECT * FROM brands ORDER BY order_index ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/brands', authenticateToken, async (req, res) => {
  const { name, description, audience, format, image_url, website_url, order_index } = req.body || {};
  try {
    const safeName = parseRequiredText(name, 'name', 180);
    const safeDescription = parseOptionalText(description, 'description', 6000);
    const safeAudience = parseOptionalText(audience, 'audience', 1200);
    const safeFormat = parseOptionalText(format, 'format', 1200);
    const safeImageUrl = parseOptionalUrlLike(image_url, 'image_url');
    const safeWebsiteUrl = parseOptionalUrlLike(website_url, 'website_url');
    const safeOrderIndex = parseOrderIndex(order_index);
    const result = await pgPool.query(
      'INSERT INTO brands (name, description, audience, format, image_url, website_url, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [safeName, safeDescription, safeAudience, safeFormat, safeImageUrl, safeWebsiteUrl, safeOrderIndex]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Sectors
app.get('/api/sectors', async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    const result = await pgPool.query('SELECT * FROM sectors ORDER BY order_index ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/sectors', authenticateToken, async (req, res) => {
  const { name, description, icon, image_url, order_index } = req.body || {};
  try {
    const safeName = parseRequiredText(name, 'name', 180);
    const safeDescription = parseOptionalText(description, 'description', 6000);
    const safeIcon = parseOptionalText(icon, 'icon', 2000);
    const safeImageUrl = parseOptionalUrlLike(image_url, 'image_url');
    const safeOrderIndex = parseOrderIndex(order_index);
    const result = await pgPool.query(
      'INSERT INTO sectors (name, description, icon, image_url, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [safeName, safeDescription, safeIcon, safeImageUrl, safeOrderIndex]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/sectors/:id', authenticateToken, async (req, res) => {
  try {
    await pgPool.query('DELETE FROM sectors WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/sectors/:id', authenticateToken, async (req, res) => {
  const { name, description, icon, image_url, order_index } = req.body || {};
  try {
    const safeName = parseRequiredText(name, 'name', 180);
    const safeDescription = parseOptionalText(description, 'description', 6000);
    const safeIcon = parseOptionalText(icon, 'icon', 2000);
    const safeImageUrl = parseOptionalUrlLike(image_url, 'image_url');
    const safeOrderIndex = parseOrderIndex(order_index);
    const result = await pgPool.query(
      'UPDATE sectors SET name = $1, description = $2, icon = $3, image_url = $4, order_index = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [safeName, safeDescription, safeIcon, safeImageUrl, safeOrderIndex, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Sector not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/brands/:id', authenticateToken, async (req, res) => {
  const { name, description, audience, format, image_url, website_url, order_index } = req.body || {};
  try {
    const safeName = parseRequiredText(name, 'name', 180);
    const safeDescription = parseOptionalText(description, 'description', 6000);
    const safeAudience = parseOptionalText(audience, 'audience', 1200);
    const safeFormat = parseOptionalText(format, 'format', 1200);
    const safeImageUrl = parseOptionalUrlLike(image_url, 'image_url');
    const safeWebsiteUrl = parseOptionalUrlLike(website_url, 'website_url');
    const safeOrderIndex = parseOrderIndex(order_index);
    const result = await pgPool.query(
      'UPDATE brands SET name = $1, description = $2, audience = $3, format = $4, image_url = $5, website_url = $6, order_index = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
      [safeName, safeDescription, safeAudience, safeFormat, safeImageUrl, safeWebsiteUrl, safeOrderIndex, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Brand not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/brands/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pgPool.query('DELETE FROM brands WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Brand not found' });
    res.json({ message: 'Brand deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Services
app.get('/api/services', async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    const result = await pgPool.query('SELECT * FROM services ORDER BY order_index ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/services', authenticateToken, async (req, res) => {
  const { title, description, highlights, icon, order_index } = req.body || {};
  try {
    const safeTitle = parseRequiredText(title, 'title', 220);
    const safeDescription = parseOptionalText(description, 'description', 6000);
    const safeHighlights = parseOptionalText(highlights, 'highlights', 6000);
    const safeIcon = parseOptionalText(icon, 'icon', 2000);
    const safeOrderIndex = parseOrderIndex(order_index);
    const result = await pgPool.query(
      'INSERT INTO services (title, description, highlights, icon, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [safeTitle, safeDescription, safeHighlights, safeIcon, safeOrderIndex]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/services/:id', authenticateToken, async (req, res) => {
  const { title, description, highlights, icon, order_index } = req.body || {};
  try {
    const safeTitle = parseRequiredText(title, 'title', 220);
    const safeDescription = parseOptionalText(description, 'description', 6000);
    const safeHighlights = parseOptionalText(highlights, 'highlights', 6000);
    const safeIcon = parseOptionalText(icon, 'icon', 2000);
    const safeOrderIndex = parseOrderIndex(order_index);
    const result = await pgPool.query(
      'UPDATE services SET title = $1, description = $2, highlights = $3, icon = $4, order_index = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [safeTitle, safeDescription, safeHighlights, safeIcon, safeOrderIndex, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/services/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pgPool.query('DELETE FROM services WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Insight categories (admin CRUD; public GET for filters / display)
app.get('/api/insight-categories', async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    await ensureInsightsSchema();
    const result = await pgPool.query(
      'SELECT * FROM insight_categories ORDER BY order_index ASC, name ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/insight-categories', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  const { name, slug, order_index } = req.body || {};
  try {
    await ensureInsightsSchema();
    const safeName = parseRequiredText(name, 'name', 200);
    const safeSlug = parseInsightSlug(slug);
    const safeOrderIndex = parseOrderIndex(order_index);
    const result = await pgPool.query(
      'INSERT INTO insight_categories (name, slug, order_index) VALUES ($1, $2, $3) RETURNING *',
      [safeName, safeSlug, safeOrderIndex]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    if (err.code === '23505') return res.status(409).json({ error: 'Slug already in use' });
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/insight-categories/:id', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  const { name, slug, order_index } = req.body || {};
  try {
    await ensureInsightsSchema();
    const safeName = parseRequiredText(name, 'name', 200);
    const safeSlug = parseInsightSlug(slug);
    const safeOrderIndex = parseOrderIndex(order_index);
    const result = await pgPool.query(
      'UPDATE insight_categories SET name = $1, slug = $2, order_index = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [safeName, safeSlug, safeOrderIndex, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Category not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    if (err.code === '23505') return res.status(409).json({ error: 'Slug already in use' });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/insight-categories/:id', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    await ensureInsightsSchema();
    const result = await pgPool.query('DELETE FROM insight_categories WHERE id = $1 RETURNING *', [
      req.params.id,
    ]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const INSIGHT_POST_ADMIN_SELECT = `
  SELECT ip.id, ip.slug, ip.title, ip.meta, ip.excerpt, ip.body, ip.image_url, ip.media_class,
         ip.published, ip.order_index, ip.created_at, ip.updated_at, ip.category_id,
         ic.name AS category_name, ic.slug AS category_slug
  FROM insight_posts ip
  LEFT JOIN insight_categories ic ON ic.id = ip.category_id
`;

// Insight posts (blog / press desk — admin list requires auth; public read is separate)
app.get('/api/insight-posts', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    await ensureInsightsSchema();
    const result = await pgPool.query(
      `${INSIGHT_POST_ADMIN_SELECT} ORDER BY ip.order_index ASC, ip.created_at DESC`
    );
    res.json(result.rows.map(shapeInsightPostRow));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/insight-posts', async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    await ensureInsightsSchema();
    const result = await pgPool.query(
      `SELECT ip.id, ip.slug, ip.title, ip.meta, ip.excerpt, ip.image_url, ip.media_class,
              ip.order_index, ip.created_at, ip.updated_at, ip.category_id,
              ic.name AS category_name, ic.slug AS category_slug
       FROM insight_posts ip
       LEFT JOIN insight_categories ic ON ic.id = ip.category_id
       WHERE ip.published = true
       ORDER BY ip.order_index ASC, ip.created_at DESC`
    );
    res.json(result.rows.map(shapeInsightPostRow));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/insight-posts/:slug', async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    await ensureInsightsSchema();
    const slug = parseInsightSlug(String(req.params.slug || ''));
    const result = await pgPool.query(
      `${INSIGHT_POST_ADMIN_SELECT} WHERE ip.slug = $1 AND ip.published = true`,
      [slug]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(shapeInsightPostRow(result.rows[0]));
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/insight-posts', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  const { slug, title, meta, excerpt, body, image_url, media_class, published, order_index, category_id } =
    req.body || {};
  try {
    await ensureInsightsSchema();
    const safeSlug = parseInsightSlug(slug);
    const safeTitle = parseRequiredText(title, 'title', 300);
    const safeMeta = parseOptionalText(meta, 'meta', 400);
    const safeExcerpt = parseOptionalText(excerpt, 'excerpt', 2000);
    const safeBody = parseOptionalText(body, 'body', 120000);
    const safeImageUrl = parseOptionalUrlLike(image_url, 'image_url');
    const safeMediaClass = parseOptionalText(media_class, 'media_class', 120);
    const safePublished = parsePublishedFlag(published);
    const safeOrderIndex = parseOrderIndex(order_index);
    const safeCategoryId = await resolveInsightCategoryId(pgPool, category_id);
    const insert = await pgPool.query(
      `INSERT INTO insight_posts (slug, title, meta, excerpt, body, image_url, media_class, published, order_index, category_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        safeSlug,
        safeTitle,
        safeMeta,
        safeExcerpt,
        safeBody,
        safeImageUrl,
        safeMediaClass,
        safePublished,
        safeOrderIndex,
        safeCategoryId,
      ]
    );
    const full = await pgPool.query(`${INSIGHT_POST_ADMIN_SELECT} WHERE ip.id = $1`, [insert.rows[0].id]);
    res.status(201).json(shapeInsightPostRow(full.rows[0]));
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    if (err.code === '23505') return res.status(409).json({ error: 'Slug already in use' });
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/insight-posts/:id', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  const { slug, title, meta, excerpt, body, image_url, media_class, published, order_index, category_id } =
    req.body || {};
  try {
    await ensureInsightsSchema();
    const safeSlug = parseInsightSlug(slug);
    const safeTitle = parseRequiredText(title, 'title', 300);
    const safeMeta = parseOptionalText(meta, 'meta', 400);
    const safeExcerpt = parseOptionalText(excerpt, 'excerpt', 2000);
    const safeBody = parseOptionalText(body, 'body', 120000);
    const safeImageUrl = parseOptionalUrlLike(image_url, 'image_url');
    const safeMediaClass = parseOptionalText(media_class, 'media_class', 120);
    const safePublished = parsePublishedFlag(published);
    const safeOrderIndex = parseOrderIndex(order_index);
    const safeCategoryId = await resolveInsightCategoryId(pgPool, category_id);
    const result = await pgPool.query(
      `UPDATE insight_posts
       SET slug = $1, title = $2, meta = $3, excerpt = $4, body = $5, image_url = $6, media_class = $7, published = $8, order_index = $9, category_id = $10, updated_at = NOW()
       WHERE id = $11
       RETURNING id`,
      [
        safeSlug,
        safeTitle,
        safeMeta,
        safeExcerpt,
        safeBody,
        safeImageUrl,
        safeMediaClass,
        safePublished,
        safeOrderIndex,
        safeCategoryId,
        req.params.id,
      ]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Insight post not found' });
    const full = await pgPool.query(`${INSIGHT_POST_ADMIN_SELECT} WHERE ip.id = $1`, [req.params.id]);
    res.json(shapeInsightPostRow(full.rows[0]));
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    if (err.code === '23505') return res.status(409).json({ error: 'Slug already in use' });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/insight-posts/:id', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    await ensureInsightsSchema();
    const result = await pgPool.query('DELETE FROM insight_posts WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Insight post not found' });
    res.json({ message: 'Insight post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Page content cards (Digital Engagement, Studio, etc. — admin CRUD + public read)
app.get('/api/page-content-cards', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });
  try {
    await ensurePageContentCardsTable();
    const ctx = req.query?.context;
    if (typeof ctx !== 'string' || !ctx.trim()) {
      return res.status(400).json({ error: 'Query parameter context is required' });
    }
    const safeContext = parsePageCardContext(ctx.trim(), 'context');
    const result = await pgPool.query(
      `SELECT * FROM page_content_cards WHERE context = $1 ORDER BY order_index ASC, id ASC`,
      [safeContext]
    );
    res.json(result.rows.map(shapePageContentCardRow));
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/page-content-cards/:context', async (req, res) => {
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });
  try {
    await ensurePageContentCardsTable();
    const safeContext = parsePageCardContext(req.params.context, 'context');
    const result = await pgPool.query(
      `SELECT id, title, body, image_url, list_label, list_items, order_index
       FROM page_content_cards
       WHERE context = $1 AND published = true
       ORDER BY order_index ASC, id ASC`,
      [safeContext]
    );
    res.json(result.rows.map(shapePageContentCardRow));
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/page-content-cards', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });
  const { context, title, body, image_url, list_label, list_items, published, order_index } = req.body || {};
  try {
    await ensurePageContentCardsTable();
    const safeContext = parsePageCardContext(context, 'context');
    const safeTitle = parseRequiredText(title, 'title', 400);
    const safeBody = parseOptionalText(body, 'body', 12000);
    const safeImageUrl = parseOptionalUrlLike(image_url, 'image_url');
    const safeListLabel = parseOptionalText(list_label, 'list_label', 200);
    const safeListItems = parseOptionalText(list_items, 'list_items', 12000);
    const safePublished = parsePublishedFlag(published);
    const safeOrderIndex = parseOrderIndex(order_index);
    const insert = await pgPool.query(
      `INSERT INTO page_content_cards (context, title, body, image_url, list_label, list_items, published, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [safeContext, safeTitle, safeBody, safeImageUrl, safeListLabel, safeListItems, safePublished, safeOrderIndex]
    );
    res.status(201).json(shapePageContentCardRow(insert.rows[0]));
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/page-content-cards/:id', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });
  const { title, body, image_url, list_label, list_items, published, order_index } = req.body || {};
  try {
    await ensurePageContentCardsTable();
    const safeTitle = parseRequiredText(title, 'title', 400);
    const safeBody = parseOptionalText(body, 'body', 12000);
    const safeImageUrl = parseOptionalUrlLike(image_url, 'image_url');
    const safeListLabel = parseOptionalText(list_label, 'list_label', 200);
    const safeListItems = parseOptionalText(list_items, 'list_items', 12000);
    const safePublished = parsePublishedFlag(published);
    const safeOrderIndex = parseOrderIndex(order_index);
    const result = await pgPool.query(
      `UPDATE page_content_cards
       SET title = $1, body = $2, image_url = $3, list_label = $4, list_items = $5, published = $6, order_index = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [safeTitle, safeBody, safeImageUrl, safeListLabel, safeListItems, safePublished, safeOrderIndex, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Card not found' });
    res.json(shapePageContentCardRow(result.rows[0]));
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/page-content-cards/:id', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });
  try {
    await ensurePageContentCardsTable();
    const result = await pgPool.query('DELETE FROM page_content_cards WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Card not found' });
    res.json({ message: 'Card deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Events
app.get('/api/events', async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    const result = await pgPool.query('SELECT * FROM events ORDER BY order_index ASC, created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  const { title, description, tagline, body, features, audience, image_url, link_url, order_index } = req.body || {};
  try {
    const safeTitle = parseRequiredText(title, 'title', 220);
    const safeDescription = parseOptionalText(description, 'description', 3000);
    const safeTagline = parseOptionalText(tagline, 'tagline', 1200);
    const safeBody = parseOptionalText(body, 'body', 9000);
    const safeFeatures = parseOptionalText(features, 'features', 4000);
    const safeAudience = parseOptionalText(audience, 'audience', 4000);
    const safeImageUrl = parseOptionalUrlLike(image_url, 'image_url');
    const safeLinkUrl = parseOptionalUrlLike(link_url, 'link_url');
    const safeOrderIndex = parseOrderIndex(order_index);
    const result = await pgPool.query(
      'INSERT INTO events (title, description, tagline, body, features, audience, image_url, link_url, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [safeTitle, safeDescription, safeTagline, safeBody, safeFeatures, safeAudience, safeImageUrl, safeLinkUrl, safeOrderIndex]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  const { title, description, tagline, body, features, audience, image_url, link_url, order_index } = req.body || {};
  try {
    const safeTitle = parseRequiredText(title, 'title', 220);
    const safeDescription = parseOptionalText(description, 'description', 3000);
    const safeTagline = parseOptionalText(tagline, 'tagline', 1200);
    const safeBody = parseOptionalText(body, 'body', 9000);
    const safeFeatures = parseOptionalText(features, 'features', 4000);
    const safeAudience = parseOptionalText(audience, 'audience', 4000);
    const safeImageUrl = parseOptionalUrlLike(image_url, 'image_url');
    const safeLinkUrl = parseOptionalUrlLike(link_url, 'link_url');
    const safeOrderIndex = parseOrderIndex(order_index);
    const result = await pgPool.query(
      'UPDATE events SET title = $1, description = $2, tagline = $3, body = $4, features = $5, audience = $6, image_url = $7, link_url = $8, order_index = $9, updated_at = NOW() WHERE id = $10 RETURNING *',
      [safeTitle, safeDescription, safeTagline, safeBody, safeFeatures, safeAudience, safeImageUrl, safeLinkUrl, safeOrderIndex, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pgPool.query('DELETE FROM events WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Case Studies
app.get('/api/case-studies', async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    const result = await pgPool.query('SELECT * FROM case_studies ORDER BY order_index ASC, created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/case-studies', authenticateToken, async (req, res) => {
  const { title, client_name, description, image_url, content_json, order_index } = req.body || {};
  try {
    const safeTitle = parseRequiredText(title, 'title', 220);
    const safeClientName = parseOptionalText(client_name, 'client_name', 220);
    const safeDescription = parseOptionalText(description, 'description', 9000);
    const safeImageUrl = parseOptionalUrlLike(image_url, 'image_url');
    const safeOrderIndex = parseOrderIndex(order_index);
    const safeContentJson = content_json && typeof content_json === 'object' && !Array.isArray(content_json) ? content_json : {};
    const result = await pgPool.query(
      'INSERT INTO case_studies (title, client_name, description, image_url, content_json, order_index) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [safeTitle, safeClientName, safeDescription, safeImageUrl, safeContentJson, safeOrderIndex]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/case-studies/:id', authenticateToken, async (req, res) => {
  const { title, client_name, description, image_url, content_json, order_index } = req.body || {};
  try {
    const safeTitle = parseRequiredText(title, 'title', 220);
    const safeClientName = parseOptionalText(client_name, 'client_name', 220);
    const safeDescription = parseOptionalText(description, 'description', 9000);
    const safeImageUrl = parseOptionalUrlLike(image_url, 'image_url');
    const safeOrderIndex = parseOrderIndex(order_index);
    const safeContentJson =
      content_json && typeof content_json === 'object' && !Array.isArray(content_json) ? content_json : {};
    const result = await pgPool.query(
      'UPDATE case_studies SET title = $1, client_name = $2, description = $3, image_url = $4, content_json = $5, order_index = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [safeTitle, safeClientName, safeDescription, safeImageUrl, safeContentJson, safeOrderIndex, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Case study not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/case-studies/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pgPool.query('DELETE FROM case_studies WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Case study not found' });
    res.json({ message: 'Case study deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Pages
app.get('/api/pages', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    await ensureCoreSchema();
    const result = await pgPool.query('SELECT id, slug, title, description, status, published_at, created_at, updated_at FROM pages ORDER BY updated_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/pages/:slug', async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    const user = getAuthUserFromRequest(req);
    const result = user
      ? await pgPool.query('SELECT * FROM pages WHERE slug = $1', [req.params.slug])
      : await pgPool.query("SELECT * FROM pages WHERE slug = $1 AND status = 'published'", [req.params.slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Page not found' });
    res.json(pageRowWithSanitizedContent(result.rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/pages', authenticateToken, async (req, res) => {
  const { slug, title, description, content_json, status, published_at } = req.body;
  const contentJson = sanitizePageContentJson(content_json);
  try {
    const result = await pgPool.query(
      'INSERT INTO pages (slug, title, description, content_json, status, published_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [slug, title, description, contentJson, status || 'draft', published_at || null]
    );
    res.status(201).json(pageRowWithSanitizedContent(result.rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/pages/:slug', authenticateToken, async (req, res) => {
  const { title, description, content_json, status, published_at } = req.body;
  const contentJson = sanitizePageContentJson(content_json);
  try {
    const result = await pgPool.query(
      'UPDATE pages SET title = $1, description = $2, content_json = $3, status = $4, published_at = $5, updated_at = NOW() WHERE slug = $6 RETURNING *',
      [title, description, contentJson, status || 'draft', published_at || null, req.params.slug]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Page not found' });
    res.json(pageRowWithSanitizedContent(result.rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/pages/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pgPool.query('DELETE FROM pages WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Page not found' });
    res.json({ message: 'Page deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/** Published CMS pages whose slugs are not taken by static Next routes (for sitemap, SEO). */
app.get('/api/public/published-cms-pages', async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  try {
    await ensureCoreSchema();
    const result = await pgPool.query(
      `SELECT slug, updated_at FROM pages
       WHERE status = 'published' AND NOT (slug = ANY($1::text[]))
       ORDER BY slug ASC`,
      [RESERVED_APP_SLUGS]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Contact
app.post('/api/contact', async (req, res) => {
  const { name, email, message, topic } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
  try {
    await pgPool.query('INSERT INTO contact_messages (name, email, topic, message) VALUES ($1, $2, $3, $4)', [name, email, topic, message]);
    res.status(201).json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Internal error' }); }
});

app.get('/api/admin/contacts', authenticateToken, async (req, res) => {
  try {
    const result = await pgPool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/analytics/summary', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  const daysRaw = Number.parseInt(String(req.query?.days || '30'), 10);
  const days = Number.isFinite(daysRaw) ? Math.min(Math.max(daysRaw, 1), 90) : 30;
  try {
    await ensureSiteAnalyticsTable();
    const [totals, topPaths, byDay, conversions] = await Promise.all([
      pgPool.query(
        `SELECT event_type, COUNT(*)::int AS c
         FROM site_analytics_events
         WHERE created_at >= NOW() - ($1::int * INTERVAL '1 day')
         GROUP BY event_type`,
        [days]
      ),
      pgPool.query(
        `SELECT path, COUNT(*)::int AS c
         FROM site_analytics_events
         WHERE created_at >= NOW() - ($1::int * INTERVAL '1 day')
           AND event_type = 'page_view'
         GROUP BY path
         ORDER BY c DESC
         LIMIT 25`,
        [days]
      ),
      pgPool.query(
        `SELECT (created_at AT TIME ZONE 'UTC')::date AS d, COUNT(*)::int AS c
         FROM site_analytics_events
         WHERE created_at >= NOW() - ($1::int * INTERVAL '1 day')
         GROUP BY 1
         ORDER BY 1 ASC`,
        [days]
      ),
      pgPool.query(
        `SELECT event_type, COUNT(*)::int AS c
         FROM site_analytics_events
         WHERE created_at >= NOW() - ($1::int * INTERVAL '1 day')
           AND event_type IN ('newsletter_signup','contact_submit','cta_click','outbound_link')
         GROUP BY event_type`,
        [days]
      ),
    ]);
    const byType = {};
    for (const row of totals.rows || []) {
      byType[row.event_type] = row.c;
    }
    const conv = {};
    for (const row of conversions.rows || []) {
      conv[row.event_type] = row.c;
    }
    res.json({
      rangeDays: days,
      byType,
      conversions: conv,
      topPaths: topPaths.rows || [],
      byDay: (byDay.rows || []).map((r) => ({ day: r.d, count: r.c })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/analytics/events', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(503).json({ error: 'Database not available' });
  const limitRaw = Number.parseInt(String(req.query?.limit || '150'), 10);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 500) : 150;
  const offsetRaw = Number.parseInt(String(req.query?.offset || '0'), 10);
  const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;
  const eventType = String(req.query?.eventType || '').trim();
  try {
    await ensureSiteAnalyticsTable();
    const result =
      eventType && ANALYTICS_ALLOWED_EVENTS.has(eventType)
        ? await pgPool.query(
            `SELECT id, event_type, path, referrer, session_key, meta_json, created_at
             FROM site_analytics_events
             WHERE event_type = $3
             ORDER BY created_at DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset, eventType]
          )
        : await pgPool.query(
            `SELECT id, event_type, path, referrer, session_key, meta_json, created_at
             FROM site_analytics_events
             ORDER BY created_at DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
          );
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/audit-logs', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });
  try {
    await ensureAdminAuditLogsTable();
    const method = String(req.query?.method || '').trim().toUpperCase();
    const entity = String(req.query?.entity || '').trim().toLowerCase();
    const search = String(req.query?.q || '').trim();
    const actor = String(req.query?.actor || '').trim();
    const limitRaw = Number.parseInt(String(req.query?.limit || '100'), 10);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 500) : 100;

    const where = [];
    const values = [];
    if (method) {
      values.push(method);
      where.push(`action_method = $${values.length}`);
    }
    if (entity) {
      values.push(entity);
      where.push(`entity_type = $${values.length}`);
    }
    if (actor) {
      values.push(`%${actor}%`);
      where.push(`actor_username ILIKE $${values.length}`);
    }
    if (search) {
      values.push(`%${search}%`);
      const idx = values.length;
      where.push(`(action_path ILIKE $${idx} OR entity_ref ILIKE $${idx} OR actor_username ILIKE $${idx})`);
    }

    values.push(limit);
    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
    const result = await pgPool.query(
      `SELECT id, actor_user_id, actor_username, action_method, action_path, entity_type, entity_ref, status_code, ip_address, user_agent, created_at
       FROM admin_audit_logs
       ${whereSql}
       ORDER BY created_at DESC
       LIMIT $${values.length}`,
      values
    );
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Could not load audit logs' });
  }
});

app.put('/api/admin/contacts/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Missing status' });
  try {
    const result = await pgPool.query(
      'UPDATE contact_messages SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Message not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pgPool.query('DELETE FROM contact_messages WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// System / Settings
app.post('/api/admin/run-migrations', authenticateToken, async (req, res) => {
  if (!pgPool) return res.status(500).json({ error: 'Database not available' });
  try {
    await ensureAppSchemaAndSeed();
    res.json({ success: true, message: 'Migration and seeding completed successfully.' });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

const start = async () => {
  try {
    await ensureAppSchemaAndSeed();
    console.log('Database schema checked and CMS seed ensured.');
  } catch (err) {
    console.error('Startup migration/seed failed:', err?.message || err);
    console.error(
      IS_PRODUCTION
        ? 'Continuing anyway so /api/health can pass; fix DB connectivity or SQL errors and redeploy, or run Admin → Run migrations when the API is up.'
        : 'Dev mode: server still starting.'
    );
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Agile Media CMS Backend listening on 0.0.0.0:${PORT}`);
  });
};

start();
