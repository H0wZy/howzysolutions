-- Messages sent through the contact form (spec 006, US6, FR-015).
-- Kept 90 days: every submission deletes what is older (src/server/contact.ts),
-- and a message can be deleted earlier on request by email.
-- ip_hash is a keyed hash, never the address. notified_at stays NULL when the
-- mail to the owner did not go out, so nothing is lost silently.
CREATE TABLE IF NOT EXISTS contact_messages (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  services    TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL,
  lang        TEXT NOT NULL DEFAULT 'en',
  ip_hash     TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  notified_at INTEGER
);
CREATE INDEX IF NOT EXISTS contact_messages_created_at ON contact_messages (created_at);
