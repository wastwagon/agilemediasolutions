require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
const { createClient } = require('redis');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { seedAgileContent } = require('./seedContent');

const app = express();

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const DATABASE_URL = process.env.DATABASE_URL;
const REDIS_URL = process.env.REDIS_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'agile_media_secret_123';

const parsedCorsOrigins =
  CORS_ORIGIN === '*'
    ? true
    : CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors({ origin: parsedCorsOrigins }));
app.use(express.json());
app.use(morgan('combined'));

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
const upload = multer({ storage: storage });

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
  await pgPool.query(`UPDATE pages SET status = 'published' WHERE status IS NULL;`);

  // Ensure default admin account exists (password: admin123)
  await pgPool.query(
    `INSERT INTO admin_users (username, password_hash, email)
     VALUES ('admin', $1, 'admin@agilemediasolution.com')
     ON CONFLICT (username) DO NOTHING`,
    ['$2b$10$jCdH1GjZcCXWiuLhU9tKMOZ58RhcPofWLSSfXdgDY3LMgm5xV.oei']
  );
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
      image_url TEXT,
      website_url TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      link_url TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS case_studies (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      client_name TEXT,
      description TEXT,
      image_url TEXT,
      content_json JSONB DEFAULT '{}',
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sectors (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await ensureMediaAssetsTable();
  await seedAgileContent(pgPool);
};

const pgPool = DATABASE_URL ? new Pool({ connectionString: DATABASE_URL }) : null;

let redisClient = null;
if (REDIS_URL) {
  redisClient = createClient({ url: REDIS_URL });
  redisClient.on('error', (err) => console.error('Redis connection error:', err));
  redisClient.connect().catch((err) => console.error('Redis initial connect failed:', err));
}

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

const getAuthUserFromRequest = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
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

  try {
    await ensureCoreSchema();
    const userResult = await pgPool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    const user = userResult.rows[0];

    // Seed password 'admin123' if first time / hashed comparison
    // In db init we seeded a hash. For this test let's accept admin/admin123
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
      return res.json({ token, username: user.username });
    }
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- CMS Content Endpoints ---

// Upload image
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
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
  try {
    const result = await pgPool.query('SELECT * FROM brands ORDER BY order_index ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/brands', authenticateToken, async (req, res) => {
  const { name, description, image_url, website_url, order_index } = req.body;
  try {
    const result = await pgPool.query(
      'INSERT INTO brands (name, description, image_url, website_url, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, image_url, website_url, order_index || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Sectors
app.get('/api/sectors', async (req, res) => {
  try {
    const result = await pgPool.query('SELECT * FROM sectors ORDER BY order_index ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/sectors', authenticateToken, async (req, res) => {
  const { name, description, icon, order_index } = req.body;
  try {
    const result = await pgPool.query(
      'INSERT INTO sectors (name, description, icon, order_index) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, icon, order_index || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/sectors/:id', authenticateToken, async (req, res) => {
  try {
    await pgPool.query('DELETE FROM sectors WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/brands/:id', authenticateToken, async (req, res) => {
  const { name, description, image_url, website_url, order_index } = req.body;
  try {
    const result = await pgPool.query(
      'UPDATE brands SET name = $1, description = $2, image_url = $3, website_url = $4, order_index = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [name, description, image_url, website_url, order_index, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Brand not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
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
  try {
    const result = await pgPool.query('SELECT * FROM services ORDER BY order_index ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/services', authenticateToken, async (req, res) => {
  const { title, description, icon, order_index } = req.body;
  try {
    const result = await pgPool.query(
      'INSERT INTO services (title, description, icon, order_index) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, icon, order_index || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/services/:id', authenticateToken, async (req, res) => {
  const { title, description, icon, order_index } = req.body;
  try {
    const result = await pgPool.query(
      'UPDATE services SET title = $1, description = $2, icon = $3, order_index = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [title, description, icon, order_index, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/services/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pgPool.query('DELETE FROM services WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Events
app.get('/api/events', async (req, res) => {
  try {
    const result = await pgPool.query('SELECT * FROM events ORDER BY order_index ASC, created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  const { title, description, image_url, link_url, order_index } = req.body;
  try {
    const result = await pgPool.query(
      'INSERT INTO events (title, description, image_url, link_url, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, image_url, link_url, order_index || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  const { title, description, image_url, link_url, order_index } = req.body;
  try {
    const result = await pgPool.query(
      'UPDATE events SET title = $1, description = $2, image_url = $3, link_url = $4, order_index = $5 WHERE id = $6 RETURNING *',
      [title, description, image_url, link_url, order_index, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
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
  try {
    const result = await pgPool.query('SELECT * FROM case_studies ORDER BY order_index ASC, created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/case-studies', authenticateToken, async (req, res) => {
  const { title, client_name, description, image_url, content_json, order_index } = req.body;
  try {
    const result = await pgPool.query(
      'INSERT INTO case_studies (title, client_name, description, image_url, content_json, order_index) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, client_name, description, image_url, content_json || {}, order_index || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/case-studies/:id', authenticateToken, async (req, res) => {
  const { title, client_name, description, image_url, content_json, order_index } = req.body;
  try {
    const result = await pgPool.query(
      'UPDATE case_studies SET title = $1, client_name = $2, description = $3, image_url = $4, content_json = $5, order_index = $6 WHERE id = $7 RETURNING *',
      [title, client_name, description, image_url, content_json, order_index, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Case study not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
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
  try {
    await ensureCoreSchema();
    const result = await pgPool.query('SELECT id, slug, title, description, status, published_at, created_at, updated_at FROM pages ORDER BY updated_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/pages/:slug', async (req, res) => {
  try {
    const user = getAuthUserFromRequest(req);
    const result = user
      ? await pgPool.query('SELECT * FROM pages WHERE slug = $1', [req.params.slug])
      : await pgPool.query("SELECT * FROM pages WHERE slug = $1 AND status = 'published'", [req.params.slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Page not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/pages', authenticateToken, async (req, res) => {
  const { slug, title, description, content_json, status, published_at } = req.body;
  try {
    const result = await pgPool.query(
      'INSERT INTO pages (slug, title, description, content_json, status, published_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [slug, title, description, content_json || {}, status || 'draft', published_at || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/pages/:slug', authenticateToken, async (req, res) => {
  const { title, description, content_json, status, published_at } = req.body;
  try {
    const result = await pgPool.query(
      'UPDATE pages SET title = $1, description = $2, content_json = $3, status = $4, published_at = $5, updated_at = NOW() WHERE slug = $6 RETURNING *',
      [title, description, content_json, status || 'draft', published_at || null, req.params.slug]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Page not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/pages/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pgPool.query('DELETE FROM pages WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Page not found' });
    res.json({ message: 'Page deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
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
    console.error('Startup migration/seed failed:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Agile Media CMS Backend running on port ${PORT}`);
  });
};

start();
