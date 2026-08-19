# Specification Quality Checklist: Terminal-Minimal Portfolio Rebrand

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-08-19
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [ ] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

### Iteration 1 — 2026-08-19

**Passing.** 37 functional requirements, each stated as an observable behaviour of "the site"
or "the terminal" rather than of a named technology. 15 success criteria, all measurable and
free of framework, language, or service names. Six user stories, each with an independent
test and acceptance scenarios; US1 alone constitutes a shippable MVP that replaces the current
site, satisfying the template's independent-slice requirement.

**Two deliberate deviations from a naive reading of the checklist, recorded rather than
silently resolved:**

1. *Project stacks are named in Context and in the Project entity.* "Next.js", ".NET 10",
   "Postgres" and similar appear in this spec. These are not implementation choices for this
   feature — they are **content the portfolio publishes about work already built**. A
   portfolio spec that could not name the stack of the work being presented would be unable to
   describe its own subject matter. No requirement constrains how this feature is built.

2. *Terminal vocabulary is product language, not implementation.* "Command", "prompt",
   "history recall", "completion" describe the interaction model the visitor experiences,
   equivalent to naming "checkout" in a commerce spec. The spec never states how commands are
   parsed, resolved, or rendered.

**One item does not pass, by design:**

- **No [NEEDS CLARIFICATION] markers remain** — ✗. Two open clarifications are recorded in
  the spec's `Clarifications Needed` section as **CL-001** and **CL-002** rather than as
  inline markers, so they read as one reviewable block instead of being scattered through the
  requirements.

  - **CL-001 (privacy, blocking for two projects)** — Three real, identifiable client
    businesses are named, and the source material for two of them carries detailed security
    and compliance narrative including an audit remediation and a formerly exposed internal
    API. This is a third party's security posture on a public page; there is no safe default
    and it cannot be guessed. It gates how the two strongest projects can be written, so it
    blocks the content pass for `telasparana` and `selzler-construtora` — and only those.

  - **CL-002 (scope, non-blocking)** — Whether the existing scroll-driven 3D experience is
    removed, preserved at its own address, or folded into the opt-in immersive presentation.
    Genuinely forked with no dominant default, but it affects only US6 (P5), the lowest
    priority story.

**Effect on readiness.** Neither clarification blocks planning for US1–US5. CL-001 blocks
writing the final copy for two of nine project records; the other seven, the terminal, the
locale system, the token system, and the statistics pipeline are all fully specified.
CL-002 blocks only US6. Planning may proceed; both must be resolved before the affected
content and US6 are implemented.
