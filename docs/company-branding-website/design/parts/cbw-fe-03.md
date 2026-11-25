# Part plan: cbw-fe-03 — Accessibility and SEO polish

## Goal
WCAG-oriented fixes from UX review gaps; unique meta per route; not-found mobile header parity (optional UX defect).

## Acceptance criteria
| AC ID | Done when |
|---|---|
| NFR-02 | axe serious/critical = 0 on index, privacy, 404, contact states |
| NFR-10 | Unique title + description index/privacy |
| FR-12 | 404 navigable |
| UQ2 (defer) | 404 mobile menu if time within size budget |

## Read
| What | Where |
|---|---|
| UX defects | `ux/UX-REVIEW.md` §E (not-found) |
| a11y gate | `docs/ENGINEERING-STANDARDS.md` §9 |
| Focus/nav | `prototype/js/site.js` |

## Changes
- Expected files: layout meta component; `404.astro` header parity; focus/contrast CSS tweaks
- Reuse: existing `cbw-fe-01` components
- Out of bounds: copy changes beyond a11y labels

## Security requirements
| ID | Requirement | Test |
|---|---|---|
| — | — | — |

## Tests
| Level | What |
|---|---|
| e2e | Keyboard nav main flows |
| a11y | axe-full on four routes |