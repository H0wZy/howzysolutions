# Data model: Next.js dynamic site

**Feature**: [spec.md](./spec.md) | **Schema**: [contracts/d1-schema.sql](./contracts/d1-schema.sql) | **Date**: 2026-10-26

The SQL in `contracts/d1-schema.sql` is the migration `next/migrations/0001_init.sql`, byte for byte (FR-007).
It was loaded into SQLite 3.50.4 (Python `sqlite3`, not D1 itself) on 2026-10-26 and 17 inserts were run
against it; the refusals below were observed, not assumed. D1 is SQLite, but the first run on D1 is task T053.

Conventions: times are unix seconds, UTC (`INTEGER`); enumerations are `TEXT` with a `CHECK`; every
filter the application runs has an index; `ip_hash` is the first 32 hex characters of
HMAC-SHA256(client IP, `IP_HASH_SALT`), never a raw address (a Worker secret; rotating it resets rate
limits and nothing else).

## Entities

### Post (`posts`)

One row per `(slug, locale)`. Two rows with the same slug and different locales are twins (FR-013): the
public page of a locale that has no published row says so and links to the other (spec US2 scenario 4).
A slug is therefore unique within a locale, and "slug collision" (spec Edge Cases) means the same slug in
the same locale, resolved by proposing `<slug>-2`.

| Column | Type | Rule |
|---|---|---|
| id | INTEGER PK | autoincrement |
| slug | TEXT | `[a-z0-9-]`, 1 to 80 characters, starts with a letter or digit |
| locale | TEXT | `en` or `pt` |
| title | TEXT | 1 to 140 |
| summary | TEXT | at most 300; used by the index, the feed and the meta description |
| body_md | TEXT | the editor's Markdown; refused if it contains U+2013 or U+2014 (FR-012, checked in the application and mirrored by a test, not by SQL) |
| body_html | TEXT | rendered and sanitised at save time, so public requests do no Markdown work |
| tags | TEXT | JSON array of strings (`json_valid` and `json_type = 'array'` are checked) |
| hero_image_key | TEXT NULL | key in the `media` table |
| hero_image_alt | TEXT NULL | required (non-empty) when an image is set, checked by the database |
| state | TEXT | `draft` or `published` |
| version | INTEGER | starts at 1, +1 per save; the optimistic lock |
| created_at, updated_at | INTEGER | |
| published_at | INTEGER NULL | set on first publish; required when `state = 'published'` |
| newsletter_sent_at | INTEGER NULL | set once, in the same statement that claims the send |
| newsletter_broadcast_id | TEXT NULL | Resend broadcast id |

Indexes: `UNIQUE(slug, locale)`; `idx_posts_public (state, locale, published_at DESC)` serves the index,
the feed, the sitemap and previous/next (query plan observed: `SEARCH posts USING INDEX idx_posts_public
(state=? AND locale=?)`); `idx_posts_admin (updated_at DESC)` serves the admin list.

Images inside `body_md` are `![alt](/media/<key>)`. The editor refuses an image with empty alt text before
saving (FR-012); the hero image is the one the database also checks.

#### Post state machine

```text
            save (version+1)                      save (version+1)
          +------------------+                  +------------------+
          v                  |                  v                  |
 (new) --create--> DRAFT ----+--publish--> PUBLISHED ---------------+
                     ^                        |
                     +------unpublish---------+
 DRAFT --delete--> (gone)        PUBLISHED --delete: refused (unpublish first)
```

| From | Event | To | Effects |
|---|---|---|---|
| none | create | draft | row, version 1, one `post_versions` row |
| draft | save | draft | `UPDATE ... SET ..., version = version + 1 WHERE id = ? AND version = ?`; zero rows changed means 409 and the newer version is shown (spec Edge Cases); one `post_versions` row |
| draft | publish | published | the editor shows the devlog checklist once (spec US2 scenario 5) and records the tick; `published_at = now` if null; body re-rendered |
| published | save | published | same as draft save; `published_at` unchanged |
| published | unpublish | draft | `published_at` kept (the post returns to its place when republished) |
| draft | delete | gone | cascades to `post_versions` and `comments` |
| published | delete | refused | the owner unpublishes first, so a deletion is never one click from a live page |
| published | send newsletter | published | `UPDATE posts SET newsletter_sent_at = ? WHERE id = ? AND newsletter_sent_at IS NULL`; changes = 0 means "already sent" (spec US4 scenario 3) |

Public queries never read `body_md`. They select `slug, locale, title, summary, body_html, tags,
hero_image_key, hero_image_alt, published_at, updated_at` for `state = 'published'`.

### PostVersion (`post_versions`)

| Column | Type | Rule |
|---|---|---|
| id | INTEGER PK | |
| post_id | INTEGER | FK to `posts(id)`, `ON DELETE CASCADE` |
| version | INTEGER | `UNIQUE(post_id, version)` |
| title, summary, body_md | TEXT | the content at that version |
| saved_at | INTEGER | |
| saved_by | TEXT | the Access `email` claim |

The history is read in the admin only. Retention: the last 50 versions per post (pruned in the same batch
as a save), which bounds rows at about 50 per post per locale.

### Media (`media`, supporting table, not in the spec's entity list)

R2 holds the bytes; this table holds what the admin needs without an R2 `list` (a Class A operation, 1
million per month free). `key` is `YYYY/MM/<uuid>.<ext>`, and the check refuses `..` and any character
outside `[a-zA-Z0-9/._-]`. `bytes` is at most 5,242,880 (the 5 MB limit of the spec's Edge Cases, enforced
before upload in the browser and again by the route, then by this check). Content types: webp, png, jpeg,
avif, gif. `width` and `height` are read from the file header on upload and give the `<img>` its intrinsic
size (CLS target of 0.05).

### Comment (`comments`)

| Column | Type | Rule |
|---|---|---|
| id | INTEGER PK | |
| post_id | INTEGER | FK, `ON DELETE CASCADE` |
| name | TEXT | 1 to 60 |
| body | TEXT | 1 to 2000, plain text; rendered as text with line breaks only (spec US3 scenario 4) |
| ip_hash | TEXT | 32 hex characters |
| state | TEXT | `pending` (default), `approved`, `rejected` |
| created_at | INTEGER | |
| moderated_at | INTEGER NULL | required unless `state = 'pending'` |

Indexes: `idx_comments_post (post_id, state, created_at)` (render approved comments);
`idx_comments_rate (ip_hash, created_at)` (the query plan observed for the rate check is `SEARCH comments
USING COVERING INDEX idx_comments_rate`, so counting costs index reads only);
`idx_comments_state (state, moderated_at)` (the moderation queue and the purge).

Rate limit (spec US3 scenario 3): `SELECT COUNT(*) FROM comments WHERE ip_hash = ?1 AND created_at > ?2`
with `?2 = now - 600`; refuse with 429 when the count is 5 or more. Refused attempts are not stored.

| From | Event | To | Effects |
|---|---|---|---|
| none | submit (Turnstile ok, under the rate limit) | pending | row; the visitor sees "aguardando moderacao" / "awaiting moderation" |
| pending | approve | approved | `moderated_at = now`; the post page shows it |
| pending | reject | rejected | `moderated_at = now`; hidden |
| approved | reject | rejected | the owner changes their mind |
| rejected | approve | approved | undo within the 30 day window |
| rejected | purge | gone | `DELETE ... WHERE state = 'rejected' AND moderated_at < now - 2592000` (30 days), run by the Cron Trigger |
| any | delete (owner) | gone | the owner can always delete |

### Subscriber (`subscribers`)

| Column | Type | Rule |
|---|---|---|
| id | INTEGER PK | |
| email | TEXT UNIQUE | lower-cased by the application and checked by `email = lower(email)`; 3 to 254; contains `@` after the first character |
| token | TEXT UNIQUE | 43 characters: 32 bytes from `crypto.getRandomValues`, base64url, no padding |
| locale | TEXT | `en` or `pt`; the language of the emails |
| state | TEXT | `unconfirmed` (default) or `confirmed` |
| resend_contact_id | TEXT NULL | the contact in the Resend segment |
| created_at | INTEGER | |
| confirmed_at | INTEGER NULL | `state = 'confirmed'` if and only if this is set (checked) |

Deviation from the spec's entity: no `unsubscribed_at`. Unsubscribing deletes the row (spec US4 scenario 4:
"the address is removed in that request"), which is also the least personal data kept (FR-015). A person
who unsubscribes and later subscribes again is a new row.

| From | Event | To | Effects |
|---|---|---|---|
| none | subscribe (Turnstile ok) | unconfirmed | row with a fresh token; `outbox` row `confirmation_email`; an existing unconfirmed address gets a new token and a new email (rate limited), a confirmed one gets the same neutral page ("check your inbox"), so the form does not reveal who is subscribed |
| unconfirmed | `POST /newsletter/confirm/<token>` | confirmed | `confirmed_at = now`; `outbox` row `resend_contact_create` |
| unconfirmed | 7 days pass | gone | purge: `DELETE ... WHERE state = 'unconfirmed' AND created_at < now - 604800` |
| any | unsubscribe (`GET` or `POST /newsletter/unsubscribe/<token>`) | gone | row deleted in the request; `outbox` row `resend_contact_delete` if a contact id exists |

Why confirm is a POST behind a GET page: mail security scanners fetch links, and a GET that confirms would
let a scanner confirm a stranger's address. The GET shows a one-button form that works without JavaScript.
Unsubscribe is a GET that acts immediately because the spec says so and a scanner unsubscribing someone is
the safe failure; the email also carries `List-Unsubscribe` and `List-Unsubscribe-Post:
List-Unsubscribe=One-Click` (RFC 8058) pointing at the same URL for a `POST`.

### ContactMessage (`contact_messages`)

`name` 1 to 100, `email` 3 to 254, `body` 1 to 5000, `ip_hash`, `created_at`, `notified_at NULL`
(set when the owner's email was accepted by Resend). Indexes: `idx_contact_rate (ip_hash, created_at)` for
3 per hour and `idx_contact_age (created_at)` for the 90 day purge (`DELETE ... WHERE created_at < now -
7776000`). `notified_at IS NULL` plus an `outbox` row means "stored, email pending" (Resend down).

### Outbox (`outbox`, supporting table)

Implements the spec's "queued (Cloudflare Queues or a retry row)" edge case as a retry row. Cloudflare
Queues is available on Free (10,000 operations per day, `/queues/platform/pricing/`) but needs a consumer in
the Worker entry; a table drained by the same Cron Trigger that does the purges needs nothing extra.

| Column | Meaning |
|---|---|
| kind | `confirmation_email`, `contact_notification`, `resend_contact_create`, `resend_contact_delete` |
| payload | JSON (`json_valid` checked) |
| attempts, next_attempt_at | back-off: 1 minute, 5 minutes, 30 minutes, 6 hours, 24 hours, then `last_error` is kept and the owner sees it in the admin |
| done_at | set on success; done rows are purged after 7 days |

Index `idx_outbox_due (done_at, next_attempt_at)` (query plan observed: `SEARCH outbox USING INDEX
idx_outbox_due (done_at=? AND next_attempt_at<?)`).

### MetricSnapshot (KV, not D1)

Namespace binding `METRICS`. Two keys: `metrics:github` and `metrics:wakatime`. Value (JSON, at most a few
KB, the cap is 25 MiB):

```ts
type MetricSnapshot = {
  source: 'github' | 'wakatime'
  payload: unknown          // the same shape as src/content/{github,wakatime}.generated.json
  fetched_at: number        // unix seconds of the last SUCCESSFUL fetch; shown to the visitor
}
```

Rules (FR-011, constitution 3.0.0 "Secrets & external data"): the cache is fresh for 3600 seconds; a stale
read triggers one background refresh (`ctx.waitUntil`); a failed refresh writes nothing to the snapshot, so
the last good value and its `fetched_at` keep being served; the build-time committed JSON is the value
before the first success. KV budget on Free (1,000 writes per day): one write per source per hour on
success is 48 per day; failures are throttled by a marker key `metrics:<source>:backoff` with
`expirationTtl: 900`, at most 96 more writes per source per day, so the worst case is 48 + 192 = 240 writes
per day, under 1,000 with room for nothing else being written to this namespace (rate limits are not KV, see
research.md R3).

## Row and cost budget (Workers Free: 5 M reads and 100,000 writes per day)

Assumptions are the owner's expected traffic in spec SC-006 and are stated, not measured:

| Operation | Rows written (table + indexes) | Rows read |
|---|---|---|
| Public devlog index (`idx_posts_public`) | 0 | at most the page size (10) |
| Public post page | 0 | 1 post + 1 neighbours query (2 rows) + approved comments (index range) |
| Comment submit | 1 + 3 indexes = 4 | rate check (index count, at most 5 rows) + the post lookup |
| Subscribe | 1 + 3 indexes (email, token, state) + 1 outbox row + its index = 6 | 1 |
| Publish a post | about 4 (posts row, the public index entry, 1 version row, its unique index); not measured | 1 |
| Daily Cron (purges, outbox drain) | deletes count as written rows: bounded by what expires | index ranges |

Even 1,000 comment submissions in a day is 4,000 writes, 4% of the daily budget. The budget is not the
risk; Turnstile and the moderation queue are (spec US3).

## Application-side validation that the database does not do

- U+2013 and U+2014 in `body_md`, `title`, `summary`, comment `name` and `body` are refused (FR-012 for posts;
  for comments the rule is a courtesy and returns 422 naming the line).
- `email` syntax beyond the `@` check is validated in the route; deliverability is proven by the
  confirmation round trip, not by a regex.
- `body_html` is produced only by the sanitising renderer (decision R6); no route writes it from request
  input directly.
