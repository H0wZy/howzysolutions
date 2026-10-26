<!--
SYNC IMPACT REPORT
==================
Version change: 2.3.0 -> 3.0.0
Rationale: MAJOR. Five constraints that block spec 006 (Next.js dynamic site) are removed on
the owner's written authorization of 2026-10-26: "remova essa constituição que hoje nos trava.
minha autorização." The constraints named to the owner, and removed here, are: the Vite stack
pin, the "no client-side router" rule, the 125 KB initial-JavaScript ceiling with its gate and
its no-raise rule, the "the running site MUST NOT hold a credential and MUST NOT call an
authenticated third-party API" rule, and the blanket "no third-party SDKs" sentence of the
Privacy paragraph. Nothing else moves: the seven Core Principles (content as data, minimum
code, accessibility, renderer-agnostic core, bilingual parity, dark only, verified before
merge), the design direction, colour, self-hosted fonts, honesty in metrics, the LCP, CLS,
Lighthouse and 60 fps targets, the Cloudflare Web Analytics exception with its disclosure
condition, and the workflow and pull-request gates all stay as written.

Why MAJOR: compliant code is invalidated (the Vite prerender pipeline, the assets-only Worker,
the build-time-only data rule) and a NON-NEGOTIABLE-adjacent budget is dropped rather than
raised, which the previous rule forbade. The owner read the trade-off (parity work, Next
runtime weight, Workers Free limits read on 2026-10-26) before authorizing.

Amended (3.0.0):
  - Technology & Design Constraints -> Stack: Next.js App Router (React 19, TypeScript strict,
    Tailwind 4, shadcn/ui) on Cloudflare Workers with a Worker script, D1, KV and R2 bindings;
    Next's router. Spec 006 holds the migration and its parity gate.
  - Technology & Design Constraints -> Performance budgets: the JavaScript ceiling, its gate and
    the no-raise rule are removed; the figure of each build is measured and recorded in the
    spec that changes it. LCP, CLS, Lighthouse and 60 fps stay as targets.
  - Technology & Design Constraints -> Secrets & external data: credentials live only in
    Worker secrets; the Worker may call third-party APIs server-side with a cache and degrade to
    the last cached value; nothing reaches the browser, the repository or a NEXT_PUBLIC_*
    variable.
  - Technology & Design Constraints -> Privacy: third-party scripts and processors are allowed
    when the privacy policy discloses them in both locales (Turnstile, Resend); ad pixels and
    tag managers stay out.
  - CLAUDE.md and AGENTS.md of this repository: lines that restate the removed constraints are
    corrected in the same change (Governance: a conflicting guidance file is corrected).

----------------------------------------------------------------------
Previous entry
----------------------------------------------------------------------
Version change: 2.2.0 -> 2.3.0
Rationale: MINOR. One recorded exception is added to the Privacy guidance; no principle is
removed and no compliant code is invalidated. The operator decided it, on 2026-09-30.

The change: Cloudflare Web Analytics, the aggregate visit counter that the host injects at the
edge of howzysolutions.com (a script from static.cloudflareinsights.com on every page, not
present in this repository), is allowed and disclosed. It was found on 2026-09-30, while the
/vvv/live/ page was being verified on its public URL: the browser requested it although the
site's privacy policy said the site runs no analytics. The operator chose to keep it on
because they want the site's visit counts, and to make the documents say so instead of
switching it off.

What is measured and what is not: no cookie is set on the page (document.cookie empty, read in
a browser on 2026-09-30). That the counter uses no cookies or local storage and does not
fingerprint individuals is Cloudflare's own statement (cloudflare.com/web-analytics/, read
2026-09-30); this project did not measure it. It is not a claim about tracking across sites,
which Cloudflare does not make on that page.

Why an exception and not a reading: the old wording ("No third-party analytics ... MUST NOT
ship visitor data to a third party") is not met by this counter, because a page view reaches
Cloudflare. It was not reinterpreted to fit; it was amended, with the condition below.

Amended (2.3.0):
  - Technology & Design Constraints -> Privacy: the exception, and the condition that it is
    disclosed in the privacy policy in both locales (src/content/privacy.ts, section
    this-website, updated 2026-09-30). The rest of the paragraph is unchanged.
  - CLAUDE.md and AGENTS.md: the line "no analytics, no pixels" now names the exception, as the
    Governance section requires (a conflicting guidance file is corrected).

Decided the same day, recorded in the comment of src/content/privacy.ts and not repeated here:
legal basis (legitimate interest, LGPD art. 7, IX, without a formal balancing test), no retention
period declared, the transfer abroad declared and kept apart from the console, and no consent
banner because no cookie is set. Not decided: the LGPD art. 33 mechanism for the transfer.

----------------------------------------------------------------------
Previous entry
----------------------------------------------------------------------
Version change: 2.1.1 -> 2.2.0
Rationale: MINOR. The initial-JavaScript budget is raised from 120 KB to 125 KB gzipped, on
a measurement of the change that needs the room, taken before this amendment was written.
Nothing else in the budget section moves.

The change: the client is split into an entry and an app chunk (src/main.tsx, src/hydrate.tsx)
so the static documents (the legal pages and the /vvv/ showcase, which have nothing for React
to attach to) stop downloading React, the pages and the terminal. Measured 2026-09-29 on the
production build: a static document now loads 8.28 KB gzipped instead of 119.44 KB, and every
document that hydrates loads entry + app = 120.47 KB, because two files compress worse than
one (+1.03 KB); a third file cost +1.58 KB and was not adopted. At 119.44 KB the old ceiling
had 0.56 KB of headroom and could not hold the split.

125 KB is that measurement plus about 4.5 KB, not a round number picked in advance: a
proposal to raise it to 200 KB was declined because 80 KB of unmeasured room is how a budget
stops being one. The alternative that keeps 120 KB, moving the non-default GitHub years to
static JSON (about 2.4 KB), remains available and is the first thing to reach for before
this ceiling is raised again.

Amended (2.2.0):
  - Technology & Design Constraints -> Performance budgets: 120 KB -> 125 KB, with the
    measurement above. LCP, CLS and Lighthouse targets are unchanged.

----------------------------------------------------------------------
Previous entry
----------------------------------------------------------------------
Version change: 2.1.0 -> 2.1.1
Rationale: PATCH. A deployment fact corrected; no principle, budget or gate changed.
The site ships to howzysolutions.com on Cloudflare Workers (static assets, no script)
instead of the planned Vercel + howzysolutions.dev. The .com was registered on
2026-09-19; the .dev was never bought.

Amended (2.1.1):
  - Opening paragraph and Technology & Design Constraints -> Stack: domain and host.
  - Secrets & external data: the build environment named is Cloudflare Workers Builds.

----------------------------------------------------------------------
Previous entry
----------------------------------------------------------------------
Version change: 2.0.0 -> 2.1.0
Rationale: MINOR. Existing guidance materially expanded; no principle removed or redefined,
and no budget raised. The site adopts a hydrated React client, Tailwind and the shadcn
breadcrumb primitive (spec 003, FR-045), reversing the CL-002 decision that removed React
from the client in spec 001. Principle II requires a new runtime dependency to be justified
naming the rung of the ladder that failed; that justification is recorded here rather than
left in a pull request body.

The amendment this feature was planned to carry — a raised JavaScript budget — is NOT made,
because the measurement it was to be argued from falsified the projection it rested on. See
below.

Amended (2.1.0):
  - Technology & Design Constraints -> Stack: names Tailwind and the shadcn/Radix breadcrumb
    primitive as installed, hydration as shipped, and records the Principle II justification.
  - Technology & Design Constraints -> Performance budgets: the 120 KB gzipped ceiling is
    UNCHANGED. Added the measured figure behind it and the requirement that the measurement
    run as a gate on every change that adds a component (spec 003 FR-050), not as a note.

Not amended, deliberately:
  - The 120 KB initial-JavaScript budget. Spec 003 was planned around a projection of
    150.7 KB gzipped for hydration, drawn from spec 001's recorded 117.2 KB figure for
    React's client runtime. A measured spike on 2026-08-27 - the real App, hydrated, with
    Tailwind and the breadcrumb, built for production - returned 104.76 KB gzipped. The
    budget survives hydration with 15.24 KB to spare, so there is no increase to argue.
    Raising the ceiling anyway would loosen a budget against the evidence, which is worse
    than the silent raise the Governance section already forbids.
  - Principle II. Adopting these dependencies is an exception justified under its existing
    procedure, not a weakening of the rule. The honest justification is recorded in
    specs/003-cv-experience-page/plan.md Complexity Tracking: the capability was reachable
    at 0 KB, and what is bought is the toolchain rather than the feature.

----------------------------------------------------------------------
Previous entry
----------------------------------------------------------------------
Version change: 1.1.0 -> 2.0.0
Rationale: MAJOR. Principle VI redefined in a way that invalidates previously compliant
code: the fully-supported light theme (tokens, resolution, persistence, toggle) is removed
in favour of dark being the only theme, with an attempt to leave it met by an honest, in-
voice refusal instead of a real alternative palette. Principle III's contrast requirement
and two Workflow gate lines lose their "both themes" qualifier as a direct consequence.

Redefined (2.0.0):
  - Principle VI, retitled "Dark Only, By Design" — dark default + light alternative
    replaced by dark as the only theme; the light-theme half of the contract (light
    tokens, theme resolution/persistence, the real toggle) is gone, not merely deferred.

Amended as a consequence (2.0.0):
  - Principle III's contrast clause: "in both themes" dropped, one theme to verify.
  - Development Workflow & Quality Gates: "in both themes" dropped from the rendering-
    verification bullet and the pull request gate.

----------------------------------------------------------------------
Previous entry
----------------------------------------------------------------------
Version change: 1.0.0 -> 1.1.0
Rationale: MINOR. Materially expanded the Technology & Design Constraints section with
two new subsections required by the WakaTime integration. No principle removed or
redefined; existing compliant guidance is unaffected.

Added (1.1.0):
  - "Secrets & External Data" under Technology & Design Constraints — credentials are
    forbidden in the client bundle and in the repository; third-party data is baked at
    build time from a build-environment secret and committed as a last-known-good artifact.
  - "Honesty In Self-Reported Metrics" under Technology & Design Constraints — every
    number about the author MUST carry its source and its period.

----------------------------------------------------------------------
Previous entry
----------------------------------------------------------------------
Version change: (template, unversioned) -> 1.0.0
Rationale: Initial ratification. First concrete constitution for the howzysolutions
portfolio; every placeholder in the scaffold replaced with project-specific governance.

Principles defined (all new):
  I.   Content Is Data, Not Markup
  II.  Minimum Code That Works
  III. Accessible By Construction (NON-NEGOTIABLE)
  IV.  Renderer-Agnostic Core
  V.   Bilingual Parity (EN canonical, pt-BR secondary)
  VI.  Themed Through Tokens (dark default, light alternative)
  VII. Verified Before Merge

Sections added:
  - Core Principles (7 principles; scaffold ships 5 slots, expanded to 7)
  - Technology & Design Constraints  (fills [SECTION_2_NAME])
  - Development Workflow & Quality Gates  (fills [SECTION_3_NAME])
  - Governance

Sections removed: none (scaffold placeholders fully replaced).

Deferred TODOs: none. All governance dates known; 2026-08-19 is the adoption date.
-->

# howzysolutions Constitution

The public portfolio of Marcos "H0wZy" Junior — a developer portfolio that presents each
project together with its frontend, its backend, its screen demonstrations and its
documentation. It ships to `howzysolutions.com`. Its visual and editorial direction is
terminal-minimal: a developer showing work in the idiom developers read.

## Core Principles

### I. Content Is Data, Not Markup

Every project, skill, role, and biography fact MUST live in a typed data module under
`src/content/`, and MUST NOT be hardcoded into a component's JSX. A project entry is the
single source of truth consumed by every surface that renders it: the list view, the detail
page, the terminal's command output, and the site metadata.

Adding a project MUST be an edit to data only. If adding a project requires touching a
component, the data model is wrong and MUST be fixed instead of worked around.

*Rationale*: The portfolio's whole job is to grow. A schema that makes growth a one-file
edit is the difference between a site that stays current and a site that rots after three
months. It is also what makes a single project description renderable as prose, as a table
row, and as CLI stdout without duplicating the text three times.

### II. Minimum Code That Works

Before writing an abstraction, walk this ladder and stop at the first rung that holds:
does this need to exist at all; does something in this repo already do it; does the
standard library or the language do it; does a native platform feature do it
(`<details>`, `<dialog>`, `view-transition`, CSS `@media`, `Intl`); does a dependency
already installed do it; can it be one line.

A new runtime dependency MUST be justified in the pull request that introduces it, naming
the rung of the ladder that failed. "It is convenient" is not a justification. Dependencies
whose job is styling, animation easing, class-name concatenation, date formatting, icons as
a package, or state management for fewer than three consumers MUST NOT be added.

*Rationale*: A portfolio that loads slowly and depends on forty packages argues against the
developer who built it. The site is itself a work sample; restraint is the argument.

### III. Accessible By Construction (NON-NEGOTIABLE)

Every interactive surface MUST be operable by keyboard alone and MUST be intelligible to a
screen reader. Specifically:

- Interactive elements MUST be real semantic elements (`button`, `a[href]`, `input`) or
  carry a correct role plus keyboard handlers. Focus MUST be visible at all times and MUST
  NOT be removed without an equal replacement.
- The interactive terminal MUST accept typed input from a real focusable form control, MUST
  announce command output to assistive technology via a polite live region, and its output
  MUST be selectable and copyable text.
- Decorative motion MUST respect `prefers-reduced-motion: reduce`. No animation may be
  required to understand or complete anything.
- No information may exist only inside a canvas, only in colour, or only on hover.
- Text MUST meet WCAG 2.2 AA contrast (4.5:1 body, 3:1 for large text and UI borders). This
  is verified, not assumed.

*Rationale*: A terminal UI and a 3D scene are the two easiest ways to build something that
looks impressive and excludes people. Deciding this once, as a non-negotiable, is cheaper
than retrofitting it and more honest than shipping it broken.

### IV. Renderer-Agnostic Core

Interactive behaviour MUST be split into a pure core and a thin renderer. The terminal's
command engine — parsing an input line, resolving a command, producing structured output —
MUST be pure TypeScript in `src/terminal/` with no import of React, Three.js, or the DOM.
Renderers consume that core; they never own command semantics.

The DOM terminal is the canonical renderer and MUST work with JavaScript's heavy paths
unloaded. Any WebGL renderer MUST be an opt-in enhancement: dynamically imported, never in
the initial bundle, never the only way to reach a command's output, and never the surface a
first-time visitor is dropped into.

*Rationale*: One engine, many renderers means a command written once is available in the
2D terminal, the 3D terminal, and a future `npx h0wzy` — and it means the impressive
renderer can be deleted or rewritten without touching what the commands actually say.

### V. Bilingual Parity

English is the canonical language; Brazilian Portuguese is the secondary language. Every
user-visible string MUST resolve through the typed locale dictionary in `src/content/i18n/`
and MUST exist in both locales. A missing translation MUST be a TypeScript error, not a
runtime fallback to a key or to English.

The document's `lang` attribute MUST track the active locale. The selected locale MUST
persist across visits. Locale MUST NOT be inferred and locked from IP or timezone.

*Rationale*: Typing the locale dictionary is what makes "we will translate it later" a
build failure instead of a broken half-Portuguese page.

### VI. Dark Only, By Design

Dark is not the default theme; it is the only theme. There is no light mode to switch to.
An attempt to leave dark MUST be met with an honest, in-voice refusal — bilingual, per
Principle V — never with a broken or half-finished alternative palette pretending to be a
real option. All colour, spacing, radius, and type-scale values MUST still be CSS custom
properties declared in one place, and a literal colour value (hex, `rgb()`, `hsl()`, or a
named colour) in a component file remains a defect: one theme is not a licence to hardcode
it.

*Rationale*: A second theme that exists only to be technically correct — built, contrast-
verified, and never actually the one the author or a visitor prefers — is code carried for
a hypothetical user. Principle II says stop at the first rung that holds; here that rung is
"no light mode," said outright instead of shipped half-working. The token discipline stands
regardless of how many themes there are: one palette is still easier to keep consistent
from a single place than from literals scattered through components.

### VII. Verified Before Merge

`npm run build` (which typechecks) and `npm run lint` MUST both pass before any merge. A
push that breaks either is reverted or fixed, not merged and followed up.

Testing is proportional to risk, not uniform:

- Pure logic — the terminal command engine, content-schema validation, locale resolution —
  MUST have unit tests. These are the parts where a bug is silent, and they are the parts
  that are cheap to test because they are pure.
- Rendering and layout MUST be verified by running the site and looking at it, at mobile and
  desktop widths. Screenshots belong in the pull request.
- Bug fixes MUST add a test that fails before the fix when the bug is in pure logic.

TypeScript `any`, non-null assertions on values that can legitimately be absent, and
`@ts-expect-error` without an adjacent explanatory comment MUST NOT be introduced.

*Rationale*: Demanding full coverage of a portfolio would be theatre and would be abandoned
in a week. Demanding tests exactly where logic is pure and failure is invisible is a rule
that survives contact with a solo maintainer's schedule.

## Technology & Design Constraints

**Stack (3.0.0, owner's decision of 2026-10-26, spec 006).** Next.js App Router with React 19,
TypeScript strict, Tailwind 4 over the tokens declared in `src/styles/tokens.css`, and
shadcn/ui, deployed to Cloudflare Workers as a Worker with a script (vinext or the OpenNext
adapter, chosen and recorded in spec 006's plan) and the D1, KV and R2 bindings the dynamic
features need, custom domain `howzysolutions.com`. Routing is Next's. Public pages are
server-rendered so they read without JavaScript (Principle III); client components only where
there is interaction. Until spec 006 reaches parity on the 40 documents the Vite site serves
today, the Vite build stays the one deployed at the domain; the switch is one change of
`wrangler.jsonc`.

*History*: from 1.0.0 to 2.3.0 the stack was React 19 + TypeScript + Vite prerendered to
static documents with no client-side router and an assets-only Worker; the Principle II
justification for buying the React toolchain (+71.28 KB gzipped, spec 003, CL-005) is kept in
the git history of this file. The ladder of Principle II still binds every dependency that
arrives without a reason written down.

A dependency whose job is icons as a package remains forbidden. The shadcn breadcrumb generator
emits `lucide-react` imports; they are replaced with inline SVG. Measured cost of keeping them
would have been 0.52 KB gzipped — the rule is the reason, not the weight.

**Broader competencies represented in portfolio content.** Azure OpenAI and generative-AI
solutioning, Microsoft 365 and Power Platform, cloud and integration/API work, automation,
data and analytics, and interactive web/3D (React Three Fiber, Three.js). These are content
of the portfolio; they do not license adding their SDKs to this site's runtime bundle.

**Design direction.** Terminal-minimal: a single readable measure (~820px) for prose, a
monospace-forward type system, sections separated by hairline rules rather than floating
cards, and a warm near-black ground. Glassmorphism, multi-stop gradient text, neon bloom,
and decorative blur are out of the vocabulary.

**Colour identity.** A warm dark ground with one primary accent and one cool secondary
accent, low saturation, chosen so the palette is recognisably H0wZy's and not a copy of any
site it takes inspiration from. Accent colour MUST carry meaning consistently (the same
colour never means both "link" and "warning").

**Typography.** Fonts MUST be self-hosted as `woff2` under `public/fonts/` and loaded with
`font-display: swap`. Third-party font CDNs MUST NOT be used: they cost a connection, leak
visitor IPs to another party, and can go down independently of the site.

**Performance targets (3.0.0).** Measured on the production build, mobile throttling:

- Largest Contentful Paint: **≤ 1.8 s**. Cumulative Layout Shift: **≤ 0.05**.
- Lighthouse mobile: **≥ 95** Performance, **100** Accessibility.
- Every route MUST be usable at 60 fps while scrolling on a mid-range phone.
- Initial JavaScript transferred: no fixed ceiling since 3.0.0 (the owner removed the 125 KB
  budget, its gate and its no-raise rule on 2026-10-26). The figure of each build is still
  measured and recorded in the spec that changes it, so a regression is a number someone can
  read, not a surprise. Last figure under the old rule: 120.47 KB gzipped for a hydrating
  document, 8.28 KB for a static one (2026-09-29).

**Secrets & external data (3.0.0).** No API key, token, or credential may appear in the
client bundle, in a `NEXT_PUBLIC_*` or `VITE_*` variable, in any response, or anywhere in
this repository. Credentials live only in Worker secrets (`wrangler secret`) and GitHub
Actions secrets.

External data about the author (WakaTime coding statistics, GitHub activity) MAY be fetched
by the Worker at request time, server-side, with the credential read from a Worker secret,
cached (KV) for at least one hour, and never from the browser. Build-time fetching into a
committed JSON artifact remains allowed and is the fallback.

A failed, rate-limited, or unauthorized fetch MUST degrade to the last known good value
(cached or committed) with its timestamp; it MUST NOT fail the build or the request and MUST
NOT render an empty or zeroed state to a visitor.

*Rationale*: A leaked read key exposes the author's entire private coding history. The key
stays on the server; what changed on 2026-10-26 is that the server is now allowed to use it,
because the site is dynamic.

**Honesty in self-reported metrics.** Any number presented about the author — years of
experience, hours coded, project count, language share — MUST state its source and the
period it covers, adjacent to the number itself. A metric MUST NOT be presented in a way
that implies it covers a longer period, or a broader scope, than it actually does.
Independent metrics with different start dates MUST NOT be placed so that one reads as
corroborating the other.

*Rationale*: Tracked coding time begins when tracking was installed, not when the career
began. Showing the two side by side without their periods is the kind of small dishonesty
that costs all the credibility the rest of the portfolio is trying to build.

**Privacy (3.0.0).** No ad pixels, tag managers, or analytics beyond the recorded exception
below. A third-party script or processor that a feature needs (Cloudflare Turnstile on the
forms, Resend as the email processor, since spec 006) is allowed on one condition: the
privacy policy names it, what it receives and for how long, in both locales, in the same
change that ships the feature. Fonts stay self-hosted (Typography above).

*Recorded exception (2.3.0, 2026-09-30, the operator's decision):* Cloudflare Web Analytics,
the aggregate visit counter the host injects at the edge, stays on. It ships page views to
Cloudflare, so it is an exception to the sentence above and not an instance of it. It is
allowed on the condition that the privacy policy discloses it in both locales. Nothing else
is excepted: a further counter, tag manager or pixel needs its own amendment.

## Development Workflow & Quality Gates

**Spec-driven.** Non-trivial work starts as a spec-kit feature: `/speckit-specify` →
`/speckit-plan` → `/speckit-tasks` → `/speckit-implement`. Specs and plans are committed
artifacts under `specs/`, reviewed as part of the change. Bug fixes, copy edits, and
dependency bumps do not require a spec.

**Branches and commits.** Work happens on a branch off `main`; `main` MUST stay deployable.
Commits follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`) and
describe the change in the imperative.

**Pull request gates.** A pull request MUST NOT merge until: build and lint pass; the
change was rendered and inspected in both locales when it touches UI; screenshots are
attached for visual changes; new runtime dependencies are justified per Principle II; and
no principle is violated without a recorded amendment.

**Content changes.** Adding or editing a project is a data-only change under `src/content/`
and MUST update both locales in the same commit.

## Governance

This constitution supersedes ad-hoc preference and prior guidance documents. Where
`CLAUDE.md`, `.gemini/GEMINI.md`, or `README.md` conflict with this document, this document
wins and the conflicting file MUST be corrected.

**Amendment procedure.** An amendment is a pull request that edits this file, states what
changed and why, and updates the version and the Sync Impact Report at the top. Loosening a
NON-NEGOTIABLE principle or a performance budget MUST be argued explicitly in the pull
request body — a budget may be raised, but never silently.

**Versioning policy.** Semantic versioning of governance:

- **MAJOR** — a principle is removed or redefined in a way that invalidates existing
  compliant code.
- **MINOR** — a principle or section is added, or existing guidance is materially expanded.
- **PATCH** — clarification, rewording, typo, or non-semantic refinement.

**Compliance review.** Every pull request is reviewed against these principles. Complexity
that cannot be justified against Principle II MUST be removed before merge. Performance
budgets are re-measured on the production build before any deploy that changes the bundle.
This document is re-read at the start of each new feature spec.

**Version**: 2.3.0 | **Ratified**: 2026-08-19 | **Last Amended**: 2026-09-30
