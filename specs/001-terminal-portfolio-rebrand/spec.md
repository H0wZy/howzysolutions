# Feature Specification: Terminal-Minimal Portfolio Rebrand

**Feature Branch**: `claude/portfolio-frontend-redesign-ay20gi`

**Created**: 2026-08-19

**Status**: Draft

**Input**: User description: "Rebranding total do portfólio howzysolutions: substituir a experiência 3D scroll-driven atual por um site terminal-minimal (inspirado em ponytail.dev, com identidade própria), tendo como peça central um terminal interativo com comandos CLI reais sobre o autor e seus 9 projetos. Engine de comandos em TypeScript puro, renderer 2D DOM canônico e renderer 3D opt-in lazy-loaded. Conteúdo em dados tipados, bilíngue EN (canônico) + pt-BR, tema escuro padrão + claro, paleta âmbar/teal sobre preto quente, stats do WakaTime bakeados em build-time. Os 9 projetos vêm do PROJETOS.md anexado."

## Context

The portfolio currently ships a scroll-driven 3D experience whose content is three entries,
two of which are generic placeholders. Meanwhile the author has nine real repositories with
substantial, documented engineering — 646 commits across production client work, an ITSM
automation MVP with a measured golden set, a video pipeline with machine-readable contracts,
and two study projects honestly labelled as such.

The bottleneck is content and credibility, not capability. Reading those nine repositories
side by side, one trait recurs and is rare enough to be the brand: **every serious README
documents its limitations with the reason and the exit condition** — an LLM classifier built,
measured, and switched off because one of three prompt-injection vectors got through; an
accuracy drop across providers declared as expected rather than hidden as a regression; an
SLA column that renders `—` because deriving a deadline would be inventing an unauditable
number; a test suite that states what it does not cover.

This rebrand exists to make that trait the site's editorial voice and its visual form. A
terminal-minimal interface — monospace, single column, hairline rules, measured numbers, no
marketing gloss — is the honest medium for that message, and an interactive terminal that
answers real commands is the demonstration rather than the claim.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A hiring manager judges the work in two minutes (Priority: P1)

A technical hiring manager or prospective client opens the site from a link, on a phone, with
no context. Within the first screen they learn who the author is, how long he has been
building, and what he does. Scrolling, they reach a list of real projects; each states the
problem it solved, what it does, the stack, and its honest current state. They can open any
project and read enough to judge whether this person can do the job.

**Why this priority**: This is the portfolio's only job. Every visitor takes this path,
including visitors who never type a command, never change the language, and never enable
anything optional. Shipped alone — a static, content-complete, terminal-styled site with the
nine real projects — it already replaces the current site and delivers the entire business
value. Everything after it is amplification.

**Independent Test**: Load the site cold on a phone with scripting for optional features
disabled. Confirm the visitor can read the identity, the experience duration, all nine
projects with problem/solution/stack/state, and reach a contact method — without typing.

**Acceptance Scenarios**:

1. **Given** a first-time visitor on a phone, **When** the page finishes loading, **Then**
   the author's name, role, experience duration, and a one-line positioning statement are
   readable without scrolling or horizontal panning.
2. **Given** a visitor scrolling the page, **When** they reach the project section, **Then**
   all nine projects are listed with name, one-line description, primary stack, and current
   state.
3. **Given** a visitor viewing any project, **When** they open its detail, **Then** they see
   the problem it solved, what it does, its stack, how it was built, and its declared
   limitations.
4. **Given** a visitor who wants to make contact, **When** they look for a contact route,
   **Then** at least one direct method is reachable from any point on the page.

---

### User Story 2 - A developer explores by typing commands (Priority: P2)

A developer visiting the site sees a live prompt rather than a screenshot of one. They type
`help`, then `projects --list-all`, then a project name, then something the site does not
recognise, then something cheeky. Every command answers with real content drawn from the same
project records the page renders, and unrecognised input fails the way a real shell fails —
with a usable suggestion rather than a dead end.

**Why this priority**: This is the differentiator and the proof. It converts a claim about
capability into an artifact of it, and it is the reason a developer sends the link to another
developer. But it is strictly additive: US1 must already stand without it.

**Independent Test**: With US1 shipped, focus the prompt using only the keyboard, run every
documented command, run an unknown command, and confirm each returns content consistent with
what the static page shows for the same subject.

**Acceptance Scenarios**:

1. **Given** the terminal has focus, **When** the visitor types a documented command and
   submits it, **Then** the output appears below the input, the prompt stays ready, and the
   output text can be selected and copied.
2. **Given** the visitor types an unrecognised command, **When** they submit it, **Then** the
   terminal reports the command as unknown and names the command that lists what is available.
3. **Given** the visitor has run commands, **When** they press the up arrow, **Then** previous
   inputs are recalled in reverse order.
4. **Given** the visitor types a partial command, **When** they press tab, **Then** the input
   completes to the unique match, or reports the candidates when several match.
5. **Given** a visitor using a screen reader, **When** a command produces output, **Then** the
   output is announced without the visitor having to hunt for it.
6. **Given** a visitor who has never used a terminal, **When** they first see the prompt,
   **Then** an unmissable affordance tells them what to type first.

---

### User Story 3 - A Brazilian visitor reads in Portuguese (Priority: P3)

A visitor from Brazil lands on the English site and switches to Portuguese. Every piece of
prose changes — headings, project descriptions, limitations, terminal output, and error
messages alike — and the choice survives their next visit.

**Why this priority**: The author's clients so far are Brazilian businesses in Paraná, and
those readers evaluate in Portuguese. English is canonical because it widens the audience,
but a half-translated site reads worse than a monolingual one, so parity is the requirement.

**Independent Test**: Switch to Portuguese, traverse every section and run every command, and
confirm no English string remains. Reload and confirm Portuguese persists.

**Acceptance Scenarios**:

1. **Given** a visitor on the English site, **When** they switch to Portuguese, **Then** all
   visible prose changes without a page reload and without losing scroll position.
2. **Given** the site is in Portuguese, **When** the visitor runs any command, **Then** its
   output and any error message are in Portuguese.
3. **Given** a visitor who chose Portuguese, **When** they return later, **Then** the site
   opens in Portuguese.
4. **Given** any language is active, **When** assistive technology inspects the page, **Then**
   the declared document language matches the language actually shown.

---

### User Story 4 - A visitor reads in the theme they prefer (Priority: P3)

A visitor whose system is set to light appearance opens the site and gets a light presentation
that is genuinely designed rather than inverted. A visitor who prefers dark gets dark, which
is also the default when no preference is expressed. Either can override the choice, and
neither sees a flash of the wrong theme on load.

**Why this priority**: Dark is the identity, but a portfolio read in a bright office in a
theme that hurts is a portfolio that gets closed. Equal in priority to language: both are
presentation preferences that gate whether the P1 content is actually read.

**Independent Test**: Load with the system set to light, then dark, then override each way,
then reload. Confirm correct theme on first paint every time and no flash.

**Acceptance Scenarios**:

1. **Given** a visitor with no stored preference, **When** they open the site, **Then** the
   theme matches their system setting, defaulting to dark when none is expressed.
2. **Given** a visitor overrides the theme, **When** they reload, **Then** their override is
   still in effect.
3. **Given** any theme is active, **When** the page paints for the first time, **Then** no
   frame of the other theme is visible.
4. **Given** either theme, **When** text and interface borders are measured, **Then** all meet
   the accessibility contrast floor.

---

### User Story 5 - A visitor sees that the work is ongoing (Priority: P4)

A visitor sees how much time the author has actually spent coding, which languages, in which
editors, and how that time distributes across the named projects — measured, dated, and
attributed to its source, not asserted.

**Why this priority**: Turns a static résumé into live evidence, and the editor breakdown is
itself a deliberate signal about how the author works. It is P4 because the site is complete
and honest without it, and because it depends on an external service that must never be able
to break the page.

**Independent Test**: Confirm displayed figures match the source for the same period, that
every figure carries its period, and that the site renders correct previous values when the
external source is unavailable.

**Acceptance Scenarios**:

1. **Given** a visitor viewing coding statistics, **When** they read any figure, **Then** the
   period that figure covers is stated adjacent to it.
2. **Given** experience duration and tracked coding time are both shown, **When** a visitor
   reads them, **Then** their different start dates are unambiguous and neither reads as
   corroborating the other.
3. **Given** the external source is unreachable or refuses the request, **When** the site is
   built and deployed, **Then** it publishes the last known good figures and no visitor sees
   an empty, zeroed, or error state.
4. **Given** a visitor inspects everything the site delivers to their browser, **When** they
   search it, **Then** no credential for the external source is present.

---

### User Story 6 - A visitor opts into the immersive rendering (Priority: P5)

A visitor who wants spectacle chooses it explicitly. The terminal they were already using is
re-presented inside a rendered environment, still answering the same commands with the same
text. A visitor who never chooses it pays nothing for its existence.

**Why this priority**: Genuine differentiation and a live demonstration of the 3D capability
the portfolio claims — but it is decoration over a working product, and it is the one feature
whose cost, if made mandatory, would break the performance and accessibility commitments that
every other story depends on.

**Independent Test**: Measure what a visitor downloads before and after opting in; confirm the
immersive assets are absent until the choice is made. Run identical commands in both
presentations and diff the text.

**Acceptance Scenarios**:

1. **Given** a visitor who has not opted in, **When** the page loads, **Then** nothing
   required only by the immersive presentation is transferred.
2. **Given** a visitor opts in, **When** the immersive presentation appears, **Then** the same
   commands produce the same output text, still selectable and copyable.
3. **Given** a visitor's device cannot support the immersive presentation, **When** they opt
   in, **Then** they are told plainly and left on the working presentation.
4. **Given** a visitor has opted in, **When** they opt back out, **Then** they return without
   losing their session's command history.
5. **Given** a visitor who has asked their system to reduce motion, **When** any presentation
   renders, **Then** no motion is required to read or operate anything.

---

### Edge Cases

- A visitor submits an empty line, whitespace only, or an extremely long string at the prompt.
- A visitor pastes multiple lines at once into the prompt.
- A visitor runs a command that produces output longer than the viewport.
- A visitor requests a project identifier that does not exist, differing only in case, or
  differing by a single character from a real one.
- A visitor arrives on a deep link to a project that has since been renamed or removed.
- A visitor's stored language or theme preference contains a value the site no longer supports.
- The external statistics source returns a partial payload, an unexpected shape, a rate-limit
  response, or figures older than the last published ones.
- A visitor opens the site on a viewport narrow enough that a fixed-width command output would
  otherwise force horizontal scrolling of the whole page.
- A visitor navigates the entire site with a keyboard only, and must never reach a state where
  focus is trapped or invisible.
- A project has no screenshot available while others do.

## Requirements *(mandatory)*

### Functional Requirements

**Content and structure**

- **FR-001**: The site MUST present all nine projects: telasparana, selzler-construtora,
  generative-ai-e2, viralvideogen, studiobiasantos, howzysolutions, terminal, authsys, and
  skeeper-specs.
- **FR-002**: Each project record MUST carry: name, client or context, the problem it solved,
  what it does, its stack, how it was developed, its declared limitations, its current state,
  and its activity window.
- **FR-003**: Each project MUST state its current state using a defined vocabulary that
  distinguishes production work from functional-but-undeployed work from study skeletons, and
  a project's state MUST NOT overstate it. Specifically, authsys MUST be presented as a study
  skeleton and MUST NOT be presented as a working authentication system.
- **FR-004**: Every project MUST surface its declared limitations with the same prominence as
  its capabilities. A project record without stated limitations MUST be treated as incomplete
  content rather than published as flawless.
- **FR-005**: All project, biography, and skill content MUST originate from typed content
  records. Adding or editing a project MUST require editing content only.
- **FR-006**: Each project MUST be reachable by a stable, shareable address that opens
  directly to that project.
- **FR-007**: The site MUST state the author's experience duration derived from a stored start
  date of January 2023, recomputed at each build rather than stored as a fixed figure.

**Interactive terminal**

- **FR-008**: The site MUST provide an interactive terminal accepting typed commands, with
  output rendered as selectable, copyable text.
- **FR-009**: The terminal MUST support at minimum: listing available commands; reporting the
  author's version and experience duration; a short biography; listing all projects; showing
  one project by identifier; filtering projects by technology; listing the technology stack;
  showing coding statistics; changing the language; changing the theme; clearing the screen;
  and recalling command history.
- **FR-010**: Terminal command output MUST be derived from the same content records the page
  renders. A fact MUST NOT be authored twice.
- **FR-011**: Unrecognised commands MUST produce an error naming the input and directing the
  visitor to the command that lists what is available. Near-misses on a known command or a
  known project identifier SHOULD suggest the closest match.
- **FR-012**: The terminal MUST support command history recall and completion of partial input.
- **FR-013**: The terminal MUST be fully operable by keyboard and MUST announce output to
  assistive technology via a polite live region.
- **FR-014**: The terminal MUST present a visible first-use affordance stating what to type,
  so a visitor unfamiliar with a command line is never left facing a bare prompt.
- **FR-015**: Commands that change language or theme MUST produce the same result as the
  corresponding page control.

**Language**

- **FR-016**: The site MUST present all content in English by default and MUST offer Brazilian
  Portuguese as a complete alternative.
- **FR-017**: Every visitor-facing string, including terminal output and error messages, MUST
  exist in both languages. A missing translation MUST be caught before publication rather than
  degrading at runtime.
- **FR-018**: The selected language MUST persist across visits and MUST be reflected in the
  document's declared language.
- **FR-019**: Language MUST NOT be inferred from network location and locked without an
  obvious, reachable way to change it.

**Presentation**

- **FR-020**: The site MUST offer a dark and a light theme, dark being the default when no
  preference exists, following the system preference when one does, overridable by the
  visitor, and persisted.
- **FR-021**: The active theme MUST be applied before first paint.
- **FR-022**: All colour, spacing, and type values MUST resolve from a single defined token
  set. A literal colour value outside that token set MUST NOT appear in the interface.
- **FR-023**: Text MUST meet a 4.5:1 contrast ratio, and interactive control boundaries 3:1,
  in both themes.
- **FR-024**: Typefaces MUST be served from the site's own origin. No visitor request may be
  made to a third-party font, analytics, advertising, or social host.
- **FR-025**: All motion MUST be suppressible by the visitor's reduced-motion preference, and
  no information may be conveyed by motion, colour, or hover alone.

**Coding statistics**

- **FR-026**: The site MUST display measured coding activity including total tracked time, the
  language distribution, the editor distribution, the activity-category distribution, and the
  distribution across named projects.
- **FR-027**: Every displayed figure MUST state its source and the period it covers, adjacent
  to the figure.
- **FR-028**: Experience duration and tracked coding time MUST NOT be presented such that one
  appears to corroborate the other, given their different start dates.
- **FR-029**: Statistics MUST be resolved at publication time, never by a visitor's browser
  calling the external service.
- **FR-030**: No credential for the statistics source may appear in anything delivered to a
  visitor or committed to the repository.
- **FR-031**: A failed, unauthorised, rate-limited, or malformed statistics response MUST
  cause publication to proceed with the last known good figures, and MUST NOT fail the
  publication or render an empty or zeroed state.

**Immersive presentation**

- **FR-032**: The immersive presentation MUST be opt-in and MUST NOT be the state a first-time
  visitor is placed in.
- **FR-033**: Nothing required only by the immersive presentation may be transferred to a
  visitor who has not opted in.
- **FR-034**: The immersive presentation MUST answer identical commands with identical output
  text, and that text MUST remain selectable and readable by assistive technology.
- **FR-035**: When a visitor's device cannot support the immersive presentation, opting in
  MUST report that plainly and leave the visitor on the working presentation.

**Retirement of the current site**

- **FR-036**: The scroll-driven 3D experience, its placeholder project records, its
  violet/cyan glass visual language, and the prompt-dump currently serving as project
  instructions MUST be removed from the published site.
- **FR-037**: The project's own documentation MUST describe this portfolio rather than a
  framework starter template.

### Key Entities

- **Project**: A body of work by the author. Carries identity, client or context, problem,
  description, stack, development narrative, declared limitations, state, activity window,
  optional external links, and optional imagery. Related to Technology and to a measured
  activity figure.
- **Technology**: A named language, framework, service, or tool. Referenced by Projects;
  enables filtering projects by technology.
- **Author Profile**: Identity, positioning statement, biography, experience start date,
  location, and contact routes.
- **Command**: A terminal instruction. Carries its name, accepted arguments, one-line
  description in both languages, and the content it draws upon. Enumerable, so listing
  available commands is derived rather than maintained separately.
- **Locale Dictionary**: The complete set of visitor-facing strings in one language. Two
  exist; both MUST be complete.
- **Design Token**: A named presentation value with a resolution for each theme.
- **Coding Statistics Snapshot**: Measured activity resolved at publication time. Carries
  totals, distributions by language, editor, category and project, its source, its period, and
  when it was captured.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor on a mid-range phone over a typical mobile connection can
  read the author's identity and positioning within 2 seconds of opening the link.
- **SC-002**: A visitor can name what the author does and cite two real projects with their
  problem and stack within 2 minutes of landing, without typing a command.
- **SC-003**: All nine projects are reachable, each by its own shareable address, and each
  states its problem, stack, current state, and declared limitations.
- **SC-004**: A visitor operating only a keyboard can reach every interactive element,
  including the terminal, in a visible focus state, and can complete every task a pointer user
  can complete.
- **SC-005**: A screen reader user can obtain the output of any terminal command.
- **SC-006**: Every visitor-facing string is available in both languages, verified
  mechanically rather than by inspection, with zero untranslated strings on any surface.
- **SC-007**: Text and control boundaries meet their contrast floors in both themes, verified
  by measurement across the full token set.
- **SC-008**: The site paints in the correct theme on first frame, with zero frames of the
  opposite theme, across cold loads in both system settings.
- **SC-009**: A visitor who does not opt into the immersive presentation downloads no asset
  that exists only to serve it, verified by comparing transferred bytes across both paths.
- **SC-010**: The site scrolls and responds without dropped frames on a mid-range phone, in
  both presentations.
- **SC-011**: Every published figure about the author carries its source and period; an
  independent reader can determine what each number measures and over what window without
  asking.
- **SC-012**: With the statistics source made unreachable, publication still succeeds and the
  published site shows the previous figures rather than an empty or error state.
- **SC-013**: No credential appears in anything delivered to a visitor or committed to the
  repository, verified by search across both.
- **SC-014**: Adding a tenth project requires editing content records only, with no change to
  any presentational or behavioural code, and the new project appears in the list, at its own
  address, and in terminal output.
- **SC-015**: No placeholder or invented content remains: every claim on the published site
  traces to a real repository, a measured figure, or a stated fact about the author.

## Assumptions

- **Content source**: The nine project records are derived from the attached PROJETOS.md,
  which was generated from direct reading of the repositories, with commit counts and dates
  taken from git history rather than estimated. Facts not present there are omitted rather
  than invented.
- **Per-project pages**: Each project gets its own shareable address rather than living only
  inside a single scrolling page, because the original brief calls for documentation of each
  project and because a shareable per-project link is how portfolio work actually circulates.
- **Imagery is optional**: No screenshots currently exist in the repository. Every project
  layout is designed to read correctly with no image, so imagery can be added later per
  project without a layout change. "Screen demonstrations" from the original brief are
  therefore deferred rather than blocking.
- **Editor and category statistics are shown deliberately**: The author has confirmed that the
  editor distribution — which currently attributes the majority of tracked time to AI-assisted
  editors — should be published, as evidence of working fluently with AI tooling.
- **Statistics start later than the career**: Tracked activity begins March 2026 while stated
  experience begins January 2023. This gap is disclosed rather than smoothed, per FR-028.
- **Contact**: Existing public routes — email, GitHub, Linktree — are sufficient; no contact
  form, and therefore no message storage and no personal data collected from visitors.
- **No visitor data is collected**: The site sets no analytics, advertising, or social cookies,
  so no consent mechanism is required.
- **Deployment**: The site is published as static output to the existing hosting, with the
  domain howzysolutions.dev intended but not yet acquired. Domain acquisition is out of scope.
- **Statistics refresh cadence**: Figures refresh on publication, on a schedule of at most
  daily. Figures up to 24 hours old are acceptable for time-coded totals.
- **Sidecar specification mirror**: Specs under `specs/` are mirrored to a sidecar repository
  by tooling run on the author's machine. The author named the sidecar `skeeper-docs`, while
  PROJETOS.md §9 documents the existing sidecar as `skeeper-specs`; the discrepancy is
  recorded here and resolved before the mirror is configured. This is repository tooling and
  does not affect the published site.
- **Out of scope for this feature**: a content management interface, a blog, comments, search
  across projects, a contact form, and any visitor-facing backend service. The site remains
  fully static.

## Clarifications Needed

- **CL-001** [scope, privacy]: Three projects name real, identifiable client businesses —
  Telas Paraná, Selzler Arquitetura e Engenharia, and Studio Bia Santos — and the source
  material for the first two includes detailed security and compliance narrative: a
  cybersecurity and LGPD audit remediation, a specific credential-hashing migration, a
  formerly publicly-exposed internal API, and twelve audit findings. Publishing this names a
  real company's past security posture on a public page. **Which of the following applies:**
  (a) clients have consented to being named and to this level of engineering detail;
  (b) clients may be named, but security and audit specifics must be generalised;
  (c) clients must be anonymised entirely ("a 40-year-old perimeter-security company in
  Paraná"). This gates how the two strongest projects in the portfolio can be written.

- **CL-002** [scope]: PROJETOS.md documents the existing scroll-driven 3D experience as this
  repository's own delivered work — a built experience with camera control, animated point
  field, and postprocessing. FR-036 retires it from the published site. **Should that work
  be:** (a) removed entirely, surviving only in git history and as a described past state;
  (b) preserved at its own address as a demonstrable artifact linked from the howzysolutions
  project entry; or (c) folded into the opt-in immersive presentation of US6, so its
  techniques are reused rather than archived. This determines whether evidence of the 3D
  capability survives the rebrand.
