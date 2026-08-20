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

- [x] No [NEEDS CLARIFICATION] markers remain
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

**All items pass as of iteration 2.**

### Iteration 2 — 2026-08-19

Both open clarifications were answered by the author and written into the spec as dated
decisions under `Clarifications Resolved`. The final checklist item now passes.

- **CL-001 → name and detail in full.** Clients are named and the security and audit
  narrative is published at full strength. The concern that this publishes a third party's
  past security posture was raised with three alternatives before the decision; the author
  chose full detail. Recorded in the spec together with a standing obligation to generalise
  on request, which FR-005 makes a data-only edit.

- **CL-002 → absorbed into US6.** The existing animated point field and postprocessing glow
  are carried into the opt-in immersive presentation rather than deleted or archived. This
  added **FR-038** and revised **FR-036**, which no longer retires the 3D rendering work —
  only the scroll-driven navigation model, the violet/cyan glass language, the placeholder
  records, and the prompt-dump. Functional requirements: 37 → 38.

A third answer, outside the two markers, corrected the sidecar repository from `skeeper-docs`
to the existing `skeeper-specs`, and the assumption now also carries that sidecar's two
recorded operational constraints (HTTPS remotes, LF line endings).

**Readiness**: 16 of 16 items pass. No open questions. Ready for `/speckit-plan`.
