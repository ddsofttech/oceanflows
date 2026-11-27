# Part plan: ttuc-fe-02 — E2E and accessibility for Home changes

## Goal
Automated regression covers section order, ticker content, and axe on index with new sections; optional reduced-motion smoke.

## Acceptance criteria
| AC ID | Done when |
|---|---|
| SITE-AC-16 | E2E asserts 12 tool labels in order after Services |
| SITE-NFR-02 | axe index: 0 serious/critical (existing gate) |
| SITE-AC-17 | E2E: four use-case headings visible without activating demos |
| SITE-AC-N04 | Optional: e2e with emulated `prefers-reduced-motion: reduce` |

## Read
| What | Where |
|---|---|
| Existing e2e | `web/tests/e2e/site.spec.ts` |
| a11y gate | `docs/ENGINEERING-STANDARDS.md` §9 Accessibility |
| Part dependency | `design/parts/ttuc-fe-01.md` |
| UX deferrals | `ux/UX-REVIEW.md` UQ-U4 |

## Changes
- Expected files: `web/tests/e2e/site.spec.ts` (and helpers if needed)
- Reuse: `AxeBuilder`, `sections` nav test; extend — do not duplicate full axe suite
- Out of bounds: CWV lab scripts (QA S5); contact form tests

## Security requirements
| ID | Requirement | Test |
|---|---|---|
| — | — | — |

## Tests
| Level | What |
|---|---|
| e2e | Ticker presence + tool order; `#use-cases` four titles; nav still reaches anchors |
| e2e | axe index (unchanged threshold) after ttuc-fe-01 merges |