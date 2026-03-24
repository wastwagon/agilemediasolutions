-- Schema and seed data for Modern Stack Postgres

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

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed an admin user (password 'admin123' hashed with bcrypt)
INSERT INTO admin_users (username, password_hash, email) 
VALUES ('admin', '$2b$10$jCdH1GjZcCXWiuLhU9tKMOZ58RhcPofWLSSfXdgDY3LMgm5xV.oei', 'admin@agilemediasolution.com')
ON CONFLICT (username) DO NOTHING;

CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  content_json JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
INSERT INTO pages (slug, title, description, content_json) 
VALUES ('home', 'Agile Media Solution | Strategic Communications & Narrative Building', 'Expert communications agency specializing in strategy, storytelling, and public influence across Africa.', '{"hero_slides": [{"title": "We build the communications infrastructure for leadership.", "subtitle": "Strategic Narrative. Global Influence. African Impact."}, {"title": "Shaping conversations that drive transformation.", "subtitle": "Excellence in Media Relations & Reputation Management."}]}')
ON CONFLICT (slug) DO NOTHING;
