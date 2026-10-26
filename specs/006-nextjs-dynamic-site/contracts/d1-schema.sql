-- howzysolutions D1 schema, migration 0001 (spec 006, FR-007).
-- Published as next/migrations/0001_init.sql, byte for byte this file.
-- Applied with: wrangler d1 migrations apply DB --local   (then --remote after the owner creates the database)
--
-- Conventions
--   * Times are INTEGER unix seconds, UTC. The application converts; SQL never calls datetime().
--   * Enumerations are TEXT with a CHECK, because SQLite has no enum type.
--   * Booleans are not used: a state column or a nullable timestamp says more.
--   * Every access path the application uses has an index (D1 counts rows read: unindexed
--     filters scan, and the Free plan allows 5,000,000 rows read per day).
--   * Every index adds one written row per insert (Free plan: 100,000 per day). The row counts in
--     data-model.md justify each one.
--   * ip_hash is HMAC-SHA256(client ip, IP_HASH_SALT secret), hex, first 32 characters. No raw IP is stored.

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------------------------
-- Post: one row per (slug, locale). The other locale of the same slug is the twin (FR-013).
-- body_html is rendered and sanitised when the editor saves, so a public request does no Markdown
-- work (Workers Free allows 10 ms of CPU per request).
-- ---------------------------------------------------------------------------------------------
CREATE TABLE posts (
  id                      INTEGER PRIMARY KEY AUTOINCREMENT,
  slug                    TEXT    NOT NULL CHECK (slug GLOB '[a-z0-9]*' AND slug NOT GLOB '*[^a-z0-9-]*' AND length(slug) BETWEEN 1 AND 80),
  locale                  TEXT    NOT NULL CHECK (locale IN ('en', 'pt')),
  title                   TEXT    NOT NULL CHECK (length(title) BETWEEN 1 AND 140),
  summary                 TEXT    NOT NULL CHECK (length(summary) <= 300),
  body_md                 TEXT    NOT NULL,
  body_html               TEXT    NOT NULL,
  tags                    TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(tags) AND json_type(tags) = 'array'),
  hero_image_key          TEXT,
  hero_image_alt          TEXT,
  state                   TEXT    NOT NULL DEFAULT 'draft' CHECK (state IN ('draft', 'published')),
  version                 INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_at              INTEGER NOT NULL,
  updated_at              INTEGER NOT NULL,
  published_at            INTEGER,
  newsletter_sent_at      INTEGER,
  newsletter_broadcast_id TEXT,
  UNIQUE (slug, locale),
  -- a published post has a publication time
  CHECK (state = 'draft' OR published_at IS NOT NULL),
  -- an image without alt text is refused at the database too (FR-012)
  CHECK (hero_image_key IS NULL OR (hero_image_alt IS NOT NULL AND length(hero_image_alt) > 0)),
  -- a post is sent to subscribers only once it has been published
  CHECK (newsletter_sent_at IS NULL OR published_at IS NOT NULL)
);

-- index page, feed, sitemap, prev/next: published posts of a locale, newest first
CREATE INDEX idx_posts_public ON posts (state, locale, published_at DESC);
-- admin list: everything, most recently edited first
CREATE INDEX idx_posts_admin ON posts (updated_at DESC);

-- ---------------------------------------------------------------------------------------------
-- PostVersion: the editor's history and the optimistic lock's trail.
-- ---------------------------------------------------------------------------------------------
CREATE TABLE post_versions (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id   INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
  version   INTEGER NOT NULL CHECK (version >= 1),
  title     TEXT    NOT NULL,
  summary   TEXT    NOT NULL,
  body_md   TEXT    NOT NULL,
  saved_at  INTEGER NOT NULL,
  saved_by  TEXT    NOT NULL,
  UNIQUE (post_id, version)
);

-- ---------------------------------------------------------------------------------------------
-- Media: what the owner uploaded to R2 (bucket binding MEDIA, served under /media/<key>).
-- Tracked here so the admin can list uploads without an R2 list call (a Class A operation).
-- ---------------------------------------------------------------------------------------------
CREATE TABLE media (
  key           TEXT PRIMARY KEY CHECK (key NOT GLOB '*[^a-zA-Z0-9/._-]*' AND key NOT GLOB '*..*'),
  content_type  TEXT    NOT NULL CHECK (content_type IN ('image/webp', 'image/png', 'image/jpeg', 'image/avif', 'image/gif')),
  bytes         INTEGER NOT NULL CHECK (bytes BETWEEN 1 AND 5242880),
  width         INTEGER NOT NULL CHECK (width > 0),
  height        INTEGER NOT NULL CHECK (height > 0),
  uploaded_at   INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------------------------
-- Comment: plain text, moderated (User Story 3).
-- ---------------------------------------------------------------------------------------------
CREATE TABLE comments (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id       INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
  name          TEXT    NOT NULL CHECK (length(name) BETWEEN 1 AND 60),
  body          TEXT    NOT NULL CHECK (length(body) BETWEEN 1 AND 2000),
  ip_hash       TEXT    NOT NULL CHECK (length(ip_hash) = 32),
  state         TEXT    NOT NULL DEFAULT 'pending' CHECK (state IN ('pending', 'approved', 'rejected')),
  created_at    INTEGER NOT NULL,
  moderated_at  INTEGER,
  CHECK (state = 'pending' OR moderated_at IS NOT NULL)
);

-- render under a post: approved comments in time order
CREATE INDEX idx_comments_post ON comments (post_id, state, created_at);
-- rate limit (5 per 10 minutes per ip_hash): count rows since a time
CREATE INDEX idx_comments_rate ON comments (ip_hash, created_at);
-- moderation queue and the 30 day purge of rejected comments
CREATE INDEX idx_comments_state ON comments (state, moderated_at);

-- ---------------------------------------------------------------------------------------------
-- Subscriber: double opt-in newsletter (User Story 4).
-- Unsubscribing DELETES the row (data minimisation, and "removed in that request"); the
-- unsubscribed_at column of the spec's entity is therefore not stored. See data-model.md.
-- ---------------------------------------------------------------------------------------------
CREATE TABLE subscribers (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  email             TEXT    NOT NULL UNIQUE CHECK (email = lower(email) AND length(email) BETWEEN 3 AND 254 AND instr(email, '@') > 1),
  token             TEXT    NOT NULL UNIQUE CHECK (length(token) = 43),
  locale            TEXT    NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'pt')),
  state             TEXT    NOT NULL DEFAULT 'unconfirmed' CHECK (state IN ('unconfirmed', 'confirmed')),
  resend_contact_id TEXT,
  created_at        INTEGER NOT NULL,
  confirmed_at      INTEGER,
  CHECK ((state = 'confirmed') = (confirmed_at IS NOT NULL))
);

-- the 7 day purge of unconfirmed addresses; the audience for a send
CREATE INDEX idx_subscribers_state ON subscribers (state, created_at);

-- ---------------------------------------------------------------------------------------------
-- ContactMessage: User Story 6. Kept 90 days.
-- ---------------------------------------------------------------------------------------------
CREATE TABLE contact_messages (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL CHECK (length(name) BETWEEN 1 AND 100),
  email        TEXT    NOT NULL CHECK (length(email) BETWEEN 3 AND 254 AND instr(email, '@') > 1),
  body         TEXT    NOT NULL CHECK (length(body) BETWEEN 1 AND 5000),
  ip_hash      TEXT    NOT NULL CHECK (length(ip_hash) = 32),
  created_at   INTEGER NOT NULL,
  notified_at  INTEGER
);

-- rate limit (3 per hour per ip_hash) and the 90 day purge
CREATE INDEX idx_contact_rate ON contact_messages (ip_hash, created_at);
CREATE INDEX idx_contact_age ON contact_messages (created_at);

-- ---------------------------------------------------------------------------------------------
-- Outbox: work that must survive an outage of Resend (spec Edge Cases). A Cron Trigger drains it.
-- payload is JSON.
-- ---------------------------------------------------------------------------------------------
CREATE TABLE outbox (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  kind             TEXT    NOT NULL CHECK (kind IN ('confirmation_email', 'contact_notification', 'resend_contact_create', 'resend_contact_delete')),
  payload          TEXT    NOT NULL CHECK (json_valid(payload)),
  attempts         INTEGER NOT NULL DEFAULT 0,
  next_attempt_at  INTEGER NOT NULL,
  created_at       INTEGER NOT NULL,
  done_at          INTEGER,
  last_error       TEXT
);

-- the drain: due and not done
CREATE INDEX idx_outbox_due ON outbox (done_at, next_attempt_at);
