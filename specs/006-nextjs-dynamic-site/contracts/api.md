# Contract: HTTP endpoints

**Feature**: [spec.md](../spec.md) | **Routes**: [routes.md](./routes.md) | **Data**: [data-model.md](../data-model.md) | **Date**: 2026-10-26

Page routes (HTML) are in routes.md. This file is every endpoint that reads a request body, writes, or
returns something that is not a page: the three visitor forms, the two token pages' POST side, the admin
API, and the scheduled work. Facts about limits and vendors are from research.md (cited there with page and
date); this file does not repeat the sources, it uses the figures.

## 1. Conventions that hold for every endpoint

### 1.1 Transport

- Base path `/api`. Handlers are Next.js route handlers (`next/src/app/api/**/route.ts`), reading bindings
  through `next/src/server/env.ts` (plan.md D4).
- Request bodies: `application/json` for the admin API; `application/x-www-form-urlencoded` or
  `multipart/form-data` for the three visitor forms (so they work without JavaScript, spec US6 scenario 1);
  `multipart/form-data` for the media upload. Any other `Content-Type` answers 415 `unsupported_media_type`.
- Maximum body: 16 KiB for visitor forms, 1 MiB for admin JSON (a post is Markdown text), 5,242,880 bytes
  for the media file (the same figure as the `media.bytes` CHECK). Checked from `Content-Length` first and
  again while reading; over the limit answers 413 `payload_too_large` before any parsing.
- Methods not listed for a path answer 405 with an `Allow` header.

### 1.2 Success and error shapes (one error shape)

Success is JSON with the resource under a named key, never a bare array:

```json
{ "ok": true, "post": { "id": 12, "slug": "week-1", "version": 3 } }
```

Every failure, on every endpoint, is this one shape and nothing else (no HTML error page from `/api`):

```json
{
  "ok": false,
  "error": {
    "code": "validation_failed",
    "message": "Human sentence in the request's locale.",
    "fields": { "body": "Line 4 contains an em dash." },
    "retryAfter": 540
  }
}
```

`code` is a stable machine string from the table below. `message` is for people and is `pt` or `en`
following the `locale` field of the request, else the `Accept-Language` header, else `en`. `fields` appears
only for `validation_failed` and maps a field name to one sentence. `retryAfter` (seconds) appears only for
`rate_limited` and `unavailable`, and is also sent as the `Retry-After` header. No stack trace, SQL text or
secret name ever appears in a body (SC-005).

| Status | `code` | When |
|---|---|---|
| 400 | `bad_request` | body is not parseable as its declared type |
| 401 | `unauthorized` | admin request without a valid Access assertion |
| 403 | `forbidden` | valid assertion but `email` is not `ADMIN_EMAIL`; or Origin check failed |
| 403 | `turnstile_failed` | Turnstile token missing, rejected, expired, replayed, or siteverify unreachable (fail closed) |
| 404 | `not_found` | id, slug or token unknown |
| 405 | `method_not_allowed` | |
| 409 | `version_conflict` | optimistic lock lost; `current` carries the newer post (admin) |
| 409 | `already_sent` | newsletter for this post was already claimed |
| 409 | `published_post` | delete refused: unpublish first |
| 409 | `slug_taken` | same slug and locale exists; `suggestion` carries `<slug>-2` |
| 413 | `payload_too_large` | see 1.1 |
| 415 | `unsupported_media_type` | |
| 422 | `validation_failed` | field rules in section 2 to 4 |
| 429 | `rate_limited` | binding brake or D1 window exceeded; nothing stored |
| 500 | `internal` | unexpected; logged server-side with a request id, the body carries only `requestId` |
| 503 | `unavailable` | D1 write limit hit, D1 error on write, daily email cap reached; reads keep working |

A `Cache-Control: no-store` header is sent on every `/api` response.

### 1.3 Visitor forms without JavaScript

The three visitor forms are ordinary `<form method="post">` elements that work with scripting off. The
handler looks at the request: if `Accept` contains `application/json` (the enhanced client) it answers the
JSON above; otherwise it answers **303 See Other** to a result page (`/contact/sent/`, or the same page with
`?status=<code>` for a refusal, rendered server-side in the visitor's locale with the message). A refusal
never loses the typed text: the page is rendered again with the fields filled (except the Turnstile token).

### 1.4 Order of checks on a visitor POST

The order is part of the contract because it decides what a refusal costs and what is stored.

1. Method, `Content-Type`, size (413, 415).
2. `Origin` header, when present, must have the site's host (403 `forbidden`). A form cannot be posted from
   another origin and succeed.
3. Rate Limiting binding `RL_SUBMIT` keyed `<route>:<ip_hash>` (429). It is a burst brake only (research.md R3).
4. Field validation (422), including the dash rule (section 2.1).
5. The D1 window count for the route (429) where the route has one (comments, contact).
6. Turnstile siteverify (403). It comes after the cheap refusals so that a refused request does not burn a
   single-use token and does not spend a subrequest (Workers Free allows 50 per request).
7. The write, as one `batch()` of statements.
8. Side effects that can fail without losing the write (email) go to the `outbox` table, not into the request.

`ip_hash` is the first 32 hex characters of HMAC-SHA256 of the `CF-Connecting-IP` header with the secret
`IP_HASH_SALT` (data-model.md). Locally, where the header is absent, it is the hash of `127.0.0.1`.

### 1.5 Turnstile verification (research.md (f))

- Client sends the widget's token as the form field `cf-turnstile-response` (or the JSON property of the
  same name).
- Server `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` with `secret` (Worker secret
  `TURNSTILE_SECRET`), `response`, `remoteip` (the client IP) and `idempotency_key` (a UUID per request, so a
  retry after a network error is safe). Timeout 3 s.
- `success` false, any `error-codes`, a non-200, a timeout or malformed JSON: all answer 403
  `turnstile_failed`. The message says to reload the challenge; it does not say which code came back.
- Local development: `TURNSTILE_SECRET` is Cloudflare's published test secret (task T045 records the value
  and the page it came from; it was not read in this lane). Tests replace `verifyTurnstile` through the
  injectable function in `next/src/server/turnstile.ts`, and one test proves that a missing token never
  reaches the write (SC-007).

### 1.6 Admin authentication (research.md (e))

Every `/api/admin/*` request:

1. Reads the header `Cf-Access-Jwt-Assertion`. Missing: 401 `unauthorized`.
2. Verifies it with `jose` against the key set at `${TEAM_DOMAIN}/cdn-cgi/access/certs`, `issuer` =
   `TEAM_DOMAIN`, `audience` = `POLICY_AUD`, expiry, key chosen by `kid`. Invalid: 401.
3. Compares the `email` claim with `ADMIN_EMAIL` (lower-cased). Different: 403 `forbidden`.
4. For `POST`, `PUT`, `PATCH`, `DELETE`: requires `Content-Type: application/json` (or the multipart upload
   route) and an `Origin` header whose host equals the request host. A cross-site form post cannot satisfy
   both.

The same function (`next/src/server/access.ts`) runs in `proxy.ts` and in each handler (decision R2). In
local development with `ENVIRONMENT=development` only, the header `x-dev-admin: <ADMIN_DEV_TOKEN>` stands in
for steps 1 to 3; a test builds the production configuration and proves that header is refused.

`saved_by` in `post_versions` is the verified `email` claim, never a value from the body.

## 2. Visitor endpoints

### 2.1 Text rules shared by the forms

- Strings are trimmed; the control characters other than newline (`\n`) and tab are rejected.
- U+2013 and U+2014 are refused in comment `name` and `body` (a courtesy, data-model.md): 422 with
  `fields.body` naming the line.
- Names and bodies are stored as plain text and rendered as text (React escapes it); no HTML, no Markdown, no
  auto-linking (spec US3 scenario 4).

### 2.2 `POST /api/comments` (slice 4)

| Field | Rule |
|---|---|
| `slug` | existing published post |
| `locale` | `en` or `pt`, the post's row |
| `name` | 1 to 60 characters |
| `body` | 1 to 2000 characters |
| `cf-turnstile-response` | required |

Window (check 5): `SELECT COUNT(*) FROM comments WHERE ip_hash = ?1 AND created_at > ?2` with
`?2 = now - 600`; a count of 5 or more answers 429 with `retryAfter` set to the seconds until the oldest of
the five leaves the window. The sixth submission in ten minutes stores nothing (spec US3 scenario 3).

Success: **201**, `{ "ok": true, "comment": { "id": 31, "state": "pending" } }`. The page shows "aguardando
moderacao" or "awaiting moderation" (spec US3 scenario 1). The comment is invisible to every other reader
until approved. A post that is a draft, deleted, or in the other locale answers 404 `not_found`.

### 2.3 `POST /api/newsletter/subscribe` (slice 3)

| Field | Rule |
|---|---|
| `email` | lower-cased; 3 to 254 characters; one `@` not first; the database CHECK is the backstop |
| `locale` | `en` or `pt`; the language of the emails |
| `cf-turnstile-response` | required |

There is no `ip_hash` column on `subscribers`, so this route has no D1 window per IP. Its limits are three:
the `RL_SUBMIT` burst brake; a per-address throttle (an existing `unconfirmed` row younger than 10 minutes
does not get a new token and email, and the visitor sees the same neutral answer); and a global cap of 50
`confirmation_email` outbox rows created in any 24 hours, counted with
`SELECT COUNT(*) FROM outbox WHERE kind = 'confirmation_email' AND created_at > ?1`. The outbox is purged of
done rows after 7 days, so the count reads a few hundred rows at most. Over the cap: 503 `unavailable` with
`retryAfter`. The cap exists because Resend's free tier allows 100 emails a day (research.md (d)) and the
contact notification and the owner's own sends share it; an attacker who typed other people's addresses must
not be able to spend the whole day's allowance. (Gap recorded in plan.md: a per-IP column would be stricter;
it is not added because the schema is already tested; revisit if the cap ever trips.)

Success: **202**, the same body whether the address is new, already `unconfirmed` or already `confirmed`
(`{ "ok": true, "status": "check_your_inbox" }`), so the form never reveals who is subscribed
(data-model.md, Subscriber).

Writes: upsert of `subscribers` (fresh 43 character `base64url` token from 32 bytes of
`crypto.getRandomValues`) and one `outbox` row `confirmation_email` with `{ subscriberId, locale }`, in one
`batch()`. The email is sent by the outbox drain, at most 10 minutes later (section 5), or immediately by
`ctx.waitUntil` when the Worker has time; the visitor is told it may take a few minutes (spec Edge Cases,
Resend down).

### 2.4 `GET|POST /newsletter/confirm/{token}` and `/pt/newsletter/confirm/{token}` (slice 3)

- `GET`: if the token exists and is `unconfirmed`, renders a one-button form (works without JavaScript); an
  unknown token or an expired (purged) one renders "this link is no longer valid" with status 404. Never
  changes state (mail scanners fetch links; data-model.md).
- `POST` (no body fields; the token is in the path): sets `state = 'confirmed'`, `confirmed_at = now`, adds an
  `outbox` row `resend_contact_create`; renders "you are subscribed" with 200. Already confirmed: the same
  page, 200. Page is `noindex`.
- Rate: `RL_SUBMIT` keyed `confirm:<ip_hash>`. No Turnstile (the token is the credential, 256 bits).

### 2.5 `GET|POST /newsletter/unsubscribe/{token}` and `/pt/...` (slice 3)

- `GET`: deletes the row in that request (spec US4 scenario 4), adds `resend_contact_delete` to the outbox
  when `resend_contact_id` was set, renders "you are unsubscribed" with 200. Unknown token: the same page with
  200 (nothing to leak, and a second click must not look like an error).
- `POST` with `List-Unsubscribe=One-Click` in the form body (RFC 8058): the same effect, answers 200 empty.
- The emails sent through `/broadcasts` carry Resend's own unsubscribe URL (`{{{RESEND_UNSUBSCRIBE_URL}}}`,
  research.md (d)); the confirmation email, sent through `/emails`, carries this site's URL in the body and in
  `List-Unsubscribe` and `List-Unsubscribe-Post` headers.

### 2.6 `POST /api/contact` (slice 3)

| Field | Rule |
|---|---|
| `name` | 1 to 100 characters |
| `email` | 3 to 254 characters, one `@` not first |
| `body` | 1 to 5000 characters |
| `locale` | `en` or `pt`, picks the confirmation page |
| `cf-turnstile-response` | required |

Window (check 5): `SELECT COUNT(*) FROM contact_messages WHERE ip_hash = ?1 AND created_at > ?2` with
`?2 = now - 3600`; 3 or more answers 429. The fourth in an hour is refused (spec US6 scenario 2).

Success: with JavaScript **201** `{ "ok": true }`; without, **303** to `/contact/sent/` (or `/pt/contact/sent/`).
Writes `contact_messages` and an `outbox` row `contact_notification` in one `batch()`; `notified_at` is set
by the drain when Resend accepts the owner's email. The `Reply-To` of that email is the visitor's address; the
`From` is the verified sending domain, never the visitor's address.

## 3. Admin endpoints (all section 1.6 authentication)

Ids are the integer primary keys of the tables. Times in JSON are unix seconds, as stored.

### 3.1 Posts (slice 2)

| Method and path | Purpose | Success | Notes |
|---|---|---|---|
| `GET /api/admin/posts?state=&locale=&cursor=` | list for the admin, `updated_at DESC` (`idx_posts_admin`) | 200 `{ posts: [...], next }` | 20 per page, keyset cursor on `(updated_at, id)`; fields without `body_md`/`body_html` |
| `POST /api/admin/posts` | create a draft | 201 `{ post }` | version 1 and one `post_versions` row in one `batch()`; duplicate `(slug, locale)` answers 409 `slug_taken` with `suggestion` |
| `GET /api/admin/posts/{id}` | one post with `body_md` | 200 `{ post }` | |
| `PUT /api/admin/posts/{id}` | save | 200 `{ post }` | body carries `version`; `UPDATE ... WHERE id = ? AND version = ?`; zero rows changed answers 409 `version_conflict` with `current` (spec Edge Cases, two tabs) |
| `POST /api/admin/posts/{id}/publish` | publish | 200 `{ post }` | body `{ "checklistAccepted": true, "version": n }`; `false` or absent answers 422 (spec US2 scenario 5); sets `published_at` if null; re-renders `body_html` |
| `POST /api/admin/posts/{id}/unpublish` | back to draft | 200 `{ post }` | `published_at` kept |
| `DELETE /api/admin/posts/{id}` | delete a draft | 204 | published post answers 409 `published_post`; cascades to versions and comments |
| `GET /api/admin/posts/{id}/versions` | history | 200 `{ versions: [{version, saved_at, saved_by}] }` | last 50 |
| `GET /api/admin/posts/{id}/versions/{n}` | one version | 200 `{ version }` | with `title`, `summary`, `body_md` |
| `POST /api/admin/preview` | render Markdown for the editor preview | 200 `{ html }` | same renderer as save (decision R6); nothing stored; 1 MiB limit |
| `POST /api/admin/posts/{id}/newsletter` | send the post to confirmed subscribers | 202 `{ broadcastId }` | requires `published`; `UPDATE posts SET newsletter_sent_at = ? WHERE id = ? AND newsletter_sent_at IS NULL`, `changes = 0` answers 409 `already_sent` (spec US4 scenario 3); then creates and sends one Resend broadcast (`POST /broadcasts`, `POST /broadcasts/{id}/send`); a Resend failure after the claim clears `newsletter_sent_at` in the same request so the owner can retry, and says so |

Post body (create and save), all required unless marked:

```json
{
  "slug": "week-1", "locale": "en",
  "title": "Week 1", "summary": "One sentence, at most 300.",
  "bodyMd": "Markdown. Images as ![alt](/media/2026/10/uuid.webp).",
  "tags": ["devlog", "lei-do-corre"],
  "heroImageKey": "2026/10/uuid.webp", "heroImageAlt": "Description",
  "version": 3
}
```

(`heroImageKey` and `heroImageAlt` optional, but one without the other is 422; `version` only on save.)
Validation (422, `fields` per property): slug `^[a-z0-9][a-z0-9-]{0,79}$`; title 1 to 140; summary at most
300; U+2013 or U+2014 anywhere in `title`, `summary` or `bodyMd` is refused with the offending line number
(FR-012); an image in `bodyMd` with empty alt text is refused with its line number; raw HTML in `bodyMd` is
not refused but is removed by the sanitiser (R6) and the response carries `warnings` naming what was
removed.

### 3.2 Media (slice 2)

`POST /api/admin/media`, `multipart/form-data` with one `file` part.

- Accepted types, decided by reading the first bytes (magic numbers), not the declared type: webp, png, jpeg,
  avif, gif (the `media.content_type` CHECK). Otherwise 415.
- Over 5,242,880 bytes: 413 `payload_too_large` with the limit in the message (spec Edge Cases). The editor
  also checks in the browser before sending.
- `width` and `height` are read from the header bytes; an unreadable header is 422.
- Stores the bytes in R2 binding `MEDIA` under key `YYYY/MM/<uuid>.<ext>` and a `media` row.
- Success **201**: `{ "ok": true, "media": { "key": "2026/10/uuid.webp", "url": "/media/2026/10/uuid.webp", "width": 1280, "height": 720, "bytes": 83211, "contentType": "image/webp" } }`.
  Alt text is not collected here: it belongs to the place the image is used (`![alt](url)` or
  `heroImageAlt`).
- `GET /media/{key...}` (public, routes.md) is not under `/api`.

### 3.3 Moderation, subscribers, messages, outbox

| Method and path | Slice | Purpose | Success |
|---|---|---|---|
| `GET /api/admin/comments?state=pending&cursor=` | 4 | the queue, `idx_comments_state` | 200 `{ comments, next }` with `ip_hash` omitted |
| `POST /api/admin/comments/{id}/approve` | 4 | pending or rejected to approved | 200 `{ comment }` |
| `POST /api/admin/comments/{id}/reject` | 4 | pending or approved to rejected | 200 `{ comment }` |
| `DELETE /api/admin/comments/{id}` | 4 | always allowed | 204 |
| `GET /api/admin/subscribers?cursor=` | 3 | list and counts by state | 200 `{ subscribers, counts, next }` |
| `DELETE /api/admin/subscribers/{id}` | 3 | remove (a deletion request, FR-015) | 204 |
| `GET /api/admin/messages?cursor=` | 3 | contact messages | 200 `{ messages, next }` |
| `DELETE /api/admin/messages/{id}` | 3 | remove | 204 |
| `GET /api/admin/outbox?failed=1` | 3 | rows with `attempts >= 5` and their `last_error` | 200 `{ items }` |
| `POST /api/admin/outbox/{id}/retry` | 3 | set `next_attempt_at = now`, `attempts = 0` | 200 `{ item }` |

State changes follow the tables in data-model.md exactly; a transition not in a table (for example approving
an already approved comment) answers 200 with the unchanged row, idempotent.

## 4. Live metrics (slice 5)

No endpoint is added. The home page's server component reads KV `METRICS` (`metrics:github`,
`metrics:wakatime`), returns the stored value when `fetched_at` is under 3600 seconds old, else the stored
value plus one background refresh through `ctx.waitUntil` (data-model.md, MetricSnapshot). The refresh calls
the WakaTime and GitHub APIs from the Worker with Worker secrets `WAKATIME_API_KEY` and `GITHUB_TOKEN`. A
failed refresh writes nothing to the snapshot and sets the marker `metrics:<source>:backoff` with
`expirationTtl: 900`. No credential, and no raw upstream error text, reaches a response (SC-005).

## 5. Scheduled work (Cron Trigger)

One `scheduled` handler, cron `*/10 * * * *` (144 invocations a day against the 100,000 a day Free limit),
exported by the Worker entry that wraps the vinext `fetch` handler (plan.md D4; whether vinext lets the entry
export `scheduled` is part of spike T012). Each run:

1. **Outbox drain**: rows with `done_at IS NULL AND next_attempt_at <= now`, at most 20 per run (50
   subrequests per invocation on Free, one Resend call per row). Kinds: `confirmation_email` and
   `contact_notification` via `POST https://api.resend.com/emails`; `resend_contact_create` and
   `resend_contact_delete` via the contacts API. Success sets `done_at`; failure bumps `attempts` and
   `next_attempt_at` by the back-off in data-model.md (1 minute, 5 minutes, 30 minutes, 6 hours, 24 hours) and
   keeps `last_error`.
2. **Purges**, only in the run whose UTC time is between 03:00 and 03:09: rejected comments older than
   2,592,000 s; unconfirmed subscribers older than 604,800 s; contact messages older than 7,776,000 s; done
   outbox rows older than 604,800 s; `post_versions` beyond the last 50 per post.

Purges are `DELETE` statements and count as rows written (data-model.md, row budget).

## 6. Secrets and variables these endpoints use

| Name | Kind | Used by |
|---|---|---|
| `TURNSTILE_SECRET` | secret | section 1.5 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | public variable (the one allowed `NEXT_PUBLIC_*`, research.md (f)) | the widget |
| `IP_HASH_SALT` | secret | `ip_hash` |
| `RESEND_API_KEY` | secret | emails, broadcasts, contacts |
| `RESEND_FROM`, `OWNER_EMAIL`, `RESEND_SEGMENT_ID` | variables | sender, the owner's inbox, the segment |
| `TEAM_DOMAIN`, `POLICY_AUD`, `ADMIN_EMAIL` | variables | section 1.6 |
| `ADMIN_DEV_TOKEN`, `ENVIRONMENT` | local only (`.dev.vars`) | section 1.6 |
| `WAKATIME_API_KEY`, `GITHUB_TOKEN` | secrets | section 4 |
| `DB`, `METRICS`, `MEDIA`, `RL_SUBMIT` | bindings (D1, KV, R2, Rate Limiting) | everywhere |

`RL_SUBMIT` is declared in `wrangler.jsonc` as `"ratelimits": [{ "name": "RL_SUBMIT", "namespace_id": "1001",
"simple": { "limit": 5, "period": 60 } }]` (shape from
`https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/`, "Last updated Oct 21, 2026",
read 2026-10-26; period must be 10 or 60; Wrangler 4.36.0 or later; counts are per Cloudflare location and
approximate). The `namespace_id` is an integer the owner chooses, unique in the account.
