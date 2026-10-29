# Feature Specification: Next.js dynamic site

**Feature Branch**: `006-nextjs-dynamic-site`

**Created**: 2026-10-26

**Status**: Draft (owner's decision recorded; constitution 3.0.0 amended 2026-10-26)

**Input**: User description (2026-10-26, chat): "Eu gostaria de trocar para Next.js com React e shadcn, usar a mesma stack que o GPT usou, que no caso seria a última versão de cada stack. refatorar inteiramente." and, after the trade-off was read: "gostaria de migrar pra nextjs e fazer o site dinamico então [...] Eu gostaria de colocar todas essas features que você citou no site dinâmico. Inclusive, eu vou fazer devlog semanalmente do jogo que eu estou desenvolvendo, o Lei do Corre."

**Clarifications recorded, not asked**: the owner read the cost of the migration before deciding (8 pages, 19 components, 24 test files, 373 tests, 40 prerendered documents, 121.42 of 125 KB JavaScript, an assets-only Worker) and chose it for two reasons: to work in Next.js with shadcn, and to have a site that changes without a rebuild. The "features cited" are the five below. The devlog is the weekly development log of the game "Lei do Corre: Juice City" (Unreal 5.8, private repository `H0wZy/lei-do-corre-ue`).

## Why this exists

The current site is a static artefact: every change is a commit, a build and a deploy. A weekly devlog, reader comments, a newsletter and a contact form need a server, a database and an authenticated editor. The owner also wants the site itself to be a Next.js and shadcn piece of work. This spec moves the site to Next.js on Cloudflare Workers and adds the dynamic features in slices that each ship on their own, with the Vite site staying live until the new one reaches parity.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parity: the same site, served by Next.js (Priority: P1)

A visitor opens any of the 40 documents the site serves today (`/`, `/pt/`, `/works/`, `/works/<id>/`, `/vvv/`, `/mcp/`, `/cv/`, `/privacy-policy/`, `/terms/` and their `/pt/` twins) and gets the same content, in the same language, at the same URL, with JavaScript disabled too. Nothing moved, nothing lost.

**Why this priority**: the migration is only safe if it changes the stack and not the site. Parity is the gate that lets the Vite deployment be switched off.

**Independent Test**: a script crawls the Vite build and the Next build for the same 40 URLs and diffs the visible text of each pair after whitespace normalisation; zero differences, every `<html lang>` equal, every `<title>` equal, `sitemap.xml` and `robots.txt` byte-equal except for the build stamp.

**Acceptance Scenarios**:

1. **Given** the 40 URLs of `public/sitemap.xml` today, **When** each is requested from the Next deployment, **Then** each answers 200 with the same visible text and the same `lang`.
2. **Given** a browser with scripting disabled, **When** any of the 40 URLs loads, **Then** the full content is in the first response (server-rendered), not an empty shell.
3. **Given** the CV, MCP and privacy pages, which are generated from data at build time today, **When** the Next build runs, **Then** the same generators feed them and `cv.md`, `mcp.md` and the PDF keep their URLs.

---

### User Story 2 - Weekly devlog with a logged-in editor (Priority: P1)

The owner opens `/admin/devlog`, signs in, writes a post in Markdown with a preview, attaches images, saves it as a draft and publishes it. Readers open `/devlog/` and `/devlog/<slug>/` (and `/pt/...`) and read it. An RSS feed and the sitemap pick it up without a build.

**Why this priority**: the devlog is the first content the owner will add every week; it is the reason the site becomes dynamic.

**Independent Test**: publish a post through the editor on a preview deployment; the public page, the index, the RSS feed and the sitemap show it within one request, with no deploy in between.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor, **When** they request `/admin/devlog`, **Then** they are sent to the sign-in and nothing of the editor is in the response.
2. **Given** the owner signed in, **When** they save a draft, **Then** the draft is not reachable publicly and is listed in the admin with its state.
3. **Given** a published post, **When** `/devlog/<slug>/` is requested, **Then** the post renders server-side with its title, date, body, images with `alt`, and links to the previous and next posts.
4. **Given** a post written in Portuguese only, **When** `/devlog/<slug>/` (English) is requested, **Then** the page says the post is in Portuguese and links to `/pt/devlog/<slug>/` (no silent machine translation).
5. **Given** the devlog rules the owner set for the public (2026-10-13), **When** a post is published, **Then** the editor has shown the checklist once: first person, no em dash or en dash, no game spoilers beyond the agreed beginning, no code of the game.

---

### User Story 3 - Comments with moderation (Priority: P2)

A reader leaves a comment under a devlog post with a name and the text. The comment waits in a moderation queue; the owner approves or rejects it in the admin; approved comments render under the post.

**Why this priority**: it makes the devlog a conversation, but it is the feature that attracts spam and abuse, so it ships after the editor and behind moderation.

**Independent Test**: post a comment on a preview deployment; it is invisible until approved; a Turnstile failure or a rate-limit hit refuses it with a clear message.

**Acceptance Scenarios**:

1. **Given** a reader, **When** they submit a comment, **Then** the server verifies the Turnstile token, stores the comment as pending, and shows "aguardando moderação" / "awaiting moderation".
2. **Given** a pending comment, **When** the owner approves it, **Then** it renders under the post with name and date; rejected comments are deleted after 30 days.
3. **Given** the same IP sending more than 5 comments in 10 minutes, **When** the sixth arrives, **Then** it is refused with 429 and nothing is stored.
4. **Given** a comment body, **When** it renders, **Then** it is plain text with line breaks only: no HTML, no links auto-made clickable, no embeds.

---

### User Story 4 - Newsletter with double opt-in (Priority: P2)

A reader types an email in the newsletter box; they receive a confirmation email; after confirming, they are a subscriber. When the owner publishes a devlog post, the admin offers to send it to subscribers as an email; every email carries a one-click unsubscribe.

**Why this priority**: the weekly devlog needs a channel that is not an algorithm; email is the owner's own list.

**Independent Test**: subscribe with a test address on a preview deployment, confirm, publish a post, send; the email arrives with the post and an unsubscribe link that works.

**Acceptance Scenarios**:

1. **Given** an email typed in the box, **When** submitted, **Then** the server verifies Turnstile, stores the address as unconfirmed with a random token, and sends one confirmation email through Resend.
2. **Given** an unconfirmed address, **When** 7 days pass without confirmation, **Then** it is deleted.
3. **Given** a published post, **When** the owner chooses "send", **Then** one Resend broadcast goes to confirmed subscribers, once; a second click says it was already sent.
4. **Given** an unsubscribe link, **When** clicked, **Then** the address is removed in that request, with no sign-in.
5. **Given** the privacy policy, **When** the newsletter ships, **Then** the policy names Resend as the email processor, in both locales, in the same change.

---

### User Story 5 - Live metrics with a server-side cache (Priority: P3)

The home page's GitHub activity and WakaTime numbers refresh on their own (at most once an hour) instead of at build time, with the credential held only as a Worker secret.

**Why this priority**: it removes the daily rebuild that exists only to refresh numbers, but the numbers are already acceptable one day old, so it comes after the content features.

**Independent Test**: change nothing and request the home page twice an hour apart; the WakaTime figure moves; the credential appears in no response and in no client bundle.

**Acceptance Scenarios**:

1. **Given** a request for the home page, **When** the cache (KV) holds values younger than 1 hour, **Then** no third-party call is made.
2. **Given** a WakaTime or GitHub call that fails or is rate-limited, **When** the page renders, **Then** it shows the last cached values with their timestamp, never zeros, never an error to the visitor.
3. **Given** any response of the site, **When** inspected, **Then** no API key or token is present (constitution: secrets never leave the server).

---

### User Story 6 - Contact form (Priority: P3)

A visitor sends a message with name, email and text. The owner receives it by email and it is stored for 90 days.

**Independent Test**: submit the form on a preview deployment; the message arrives at the owner's inbox through Resend and the visitor sees a confirmation; a missing Turnstile token refuses it.

**Acceptance Scenarios**:

1. **Given** a valid submission, **When** sent, **Then** the server verifies Turnstile, stores the message, emails the owner, and answers with a confirmation page that works without JavaScript.
2. **Given** more than 3 submissions from one IP in an hour, **When** the fourth arrives, **Then** it is refused with 429.

---

### Edge Cases

- The editor's session expires mid-post: the draft is saved locally in the browser every 30 s and offered back on the next sign-in.
- Two tabs edit the same post: the second save refuses with the newer version shown (optimistic version column).
- An image larger than 5 MB: refused before upload, with the limit stated.
- A post slug collides: the editor proposes `<slug>-2`.
- D1 Free daily write limit reached (100,000 rows/day, enforced since 2026-09-01): comments and subscriptions answer "try again tomorrow" with 503; reads keep working because posts are served from the cached render.
- Resend down: the confirmation is queued (Cloudflare Queues or a retry row) and the visitor is told the email will arrive later.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST be a Next.js App Router application (React 19, TypeScript strict, Tailwind 4, shadcn/ui) deployed to Cloudflare Workers. The deployment path is vinext (Cloudflare's recommended path, read 2026-10-26) unless `npx vinext check` reports a gap the site needs, in which case the OpenNext adapter is used; the choice and the check's output are recorded in `plan.md`.
- **FR-002**: Every version pinned is a stable release, exact in `package.json`, with a genuine lockfile; no beta or canary. The versions used are recorded in `plan.md` with their release dates.
- **FR-003**: The 40 documents of today's `sitemap.xml` MUST keep their URLs, trailing slashes, `lang`, titles and visible text (User Story 1). New routes: `/devlog/`, `/devlog/<slug>/`, `/devlog/feed.xml`, `/contact/`, `/newsletter/confirm/<token>`, `/newsletter/unsubscribe/<token>`, `/admin/*`, and their `/pt/` twins where public.
- **FR-004**: Public pages MUST be server-rendered (static where the content is static, dynamic where it is not) so that they read without JavaScript; client components only where there is interaction.
- **FR-005**: Content that is data today (`src/content/**`) MUST stay data, consumed by the new renderers; the CV, MCP and build-stamp generators keep running at build time.
- **FR-006**: Admin routes MUST require authentication. Phase 1 uses Cloudflare Access (Zero Trust, the owner's Google account, the `Cf-Access-Jwt-Assertion` verified by the Worker); when the vvv Keycloak (spec 049, `auth.howzysolutions.com`) is in production, the admin MAY switch to OIDC against it, as its own task. No password is stored by this site.
- **FR-007**: Persistent data lives in D1 (posts, post versions, comments, subscribers, contact messages), images in R2 served under `/media/`, caches in KV. Schema migrations are files under `migrations/`, applied by `wrangler d1 migrations apply`.
- **FR-008**: Every form that a visitor can submit (comment, newsletter, contact) MUST verify a Cloudflare Turnstile token server-side and MUST be rate-limited per IP (Cloudflare rate limiting binding or a KV counter).
- **FR-009**: Emails (confirmation, broadcast, contact notification) go through Resend from a verified sending domain; the API key is a Worker secret.
- **FR-010**: Third-party credentials (Resend, WakaTime, GitHub) live only in Worker secrets; nothing in the client bundle, nothing in the repository, nothing in a `NEXT_PUBLIC_*` variable.
- **FR-011**: Live metrics are fetched by the Worker, cached in KV for 1 hour, and degrade to the last cached value with its timestamp.
- **FR-012**: Devlog posts MUST render Markdown through a sanitising renderer (no raw HTML from posts), with images carrying `alt` text required by the editor, and MUST pass the no-dash check (U+2013, U+2014 refused by the editor with the offending line shown).
- **FR-013**: Bilingual parity holds for the site's chrome and for every page that exists in both locales; a devlog post may exist in one language, and the other locale's page says so and links across.
- **FR-014**: The JavaScript budget gate, the contrast gate and the visible-text parity check run in CI and fail the build; CI deploys only from `main`, and a preview deployment is built for every branch.
- **FR-015**: Comments, subscribers and contact messages are personal data: the privacy policy is updated in both locales in the same change that ships each feature, naming the processor (Cloudflare, Resend), the retention (comments until deleted by the owner, rejected ones 30 days, unconfirmed subscriptions 7 days, contact messages 90 days) and the way to ask for deletion.
- **FR-016**: Until parity is reached and the owner says "pode trocar", the Vite site stays the one served at `howzysolutions.com`; the Next site is reachable on a preview hostname only. The switch is one change of `wrangler.jsonc` routes, reversible in one deploy.

### Key Entities

- **Post**: slug, locale, title, body (Markdown), summary, state (draft, published), published_at, updated_at, version, tags (for example `devlog`, `lei-do-corre`), hero image.
- **PostVersion**: post, version, body, saved_at (the editor's history and the optimistic lock).
- **Comment**: post, name, body, ip_hash, state (pending, approved, rejected), created_at, moderated_at.
- **Subscriber**: email, token, state (unconfirmed, confirmed), created_at, confirmed_at, unsubscribed_at.
- **ContactMessage**: name, email, body, ip_hash, created_at, notified_at.
- **MetricSnapshot** (KV): source (github, wakatime), payload, fetched_at.

## Success Criteria *(mandatory)*

- **SC-001**: The 40-URL parity diff reports zero text differences and zero `lang` or `title` differences before the switch.
- **SC-002**: A devlog post goes from "publish" clicked to visible on `/devlog/<slug>/`, in the index, in the feed and in the sitemap in under 5 seconds, with no build or deploy.
- **SC-003**: Lighthouse mobile on `/`, `/pt/`, `/devlog/` and one post: Performance at least 95, Accessibility 100 (the constitution's figures), measured on the production build.
- **SC-004**: Initial JavaScript transferred on a static document and on a hydrating document is measured on the parity build and recorded in `plan.md` next to the Vite figures (8.28 KB and 120.47 KB gzipped); there is no ceiling since constitution 3.0.0, but the number is read before the switch.
- **SC-005**: Zero credentials in any response or bundle, verified by a CI grep over the built output for every secret name and value pattern.
- **SC-006**: A month of the owner's expected traffic stays inside the Workers Free plan (100,000 requests/day, D1 5 M reads/day and 100,000 writes/day); the plan is Free unless a measured month says otherwise.
- **SC-007**: Every visitor form refuses submissions without a valid Turnstile token and over the rate limit, proven by tests.

## Assumptions

- Cloudflare account: Workers, D1, KV, R2, Turnstile, Access and Queues are available on the Free plan at the limits read on 2026-10-26 (Workers 100,000 requests/day and 10 ms CPU per request; D1 5 M reads and 100,000 writes per day, 5 GB; Access free for up to 50 users). Workers Paid is US$ 5/month if a limit is hit.
- Resend: the owner has a Resend account connected (MCP available in the orchestrator's sessions); the sending domain is verified before User Story 4 ships. Resend's free tier (3,000 emails/month, 100/day as of the last reading; to be re-read in `plan.md`) covers a weekly devlog to a small list.
- The GPT package `VVV-Mythic-Dither-Final/web` (Next.js 16.4.3, React 19.3.1, Tailwind 4.3.3, shadcn 4.22.1) is a reference for stack and components, not a build to copy: it was never built and has no genuine lockfile.
- The Mythic Dither showcase section shipped in Vite on branch `lane/vvv-mythic-dither` (2026-10-26) carries over as data (`src/content/showcase-vvv.ts`) and images (`public/vvv/mythic/`); only its JSX and CSS are rewritten.
- The devlog's public rules are the owner's of 2026-10-13: first person, natural tone, never an em dash or en dash, only the agreed beginning of the story, never the game's code.

## Constitution Check

Done on 2026-10-26 as constitution 3.0.0, on the owner's written authorization ("remova essa constituição que hoje nos trava. minha autorização."): the Vite stack pin, the "no client-side router" rule, the 125 KB JavaScript ceiling with its gate and no-raise rule, the "no credential at runtime" rule and the blanket "no third-party SDK" sentence are removed. What stays and binds this feature: the seven Core Principles (content as data, minimum code, accessibility, renderer-agnostic core, bilingual parity, dark only, verified before merge), self-hosted fonts, the design direction, honesty in metrics, the LCP, CLS, Lighthouse and 60 fps targets, the privacy-policy disclosure condition for Turnstile and Resend, and the pull-request gates. The JavaScript figure of the parity build is measured and recorded in `plan.md` (no ceiling, but a number someone can read).

## Out of scope

- Machine translation of devlog posts.
- A public comment account system (comments are name plus text, moderated).
- Analytics beyond Cloudflare Web Analytics.
- Moving the vvv product's own web app (`vvv/web/`, spec 049) to Next.js: that app stays Vite by its own spec.
- Porting the GPT package's Next.js pages as they are (they are a reference, not a build).

## Delivery order (each slice ships on its own, Vite stays live)

1. Parity: Next.js skeleton on Workers, all 40 documents, generators, gates, preview deployment, constitution amendments 1 to 3 measured and written.
2. Devlog public pages and the admin editor behind Cloudflare Access (D1, R2).
3. Newsletter and contact (Resend, Turnstile, privacy policy update).
4. Comments with moderation.
5. Live metrics (KV cache, secrets).
6. The switch: `wrangler.jsonc` routes to the Next Worker; the Vite Worker kept deployable for one week, then removed.
7. Optional: admin sign-in through the vvv Keycloak when spec 049 is in production.
