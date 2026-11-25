# Part plan: cbw-fe-01 — Migrate UX prototype to Astro

## Goal
Staging deploy shows single-page site with sections, theme toggle, nav, and static contact UI (submit still mock or disabled).

## Acceptance criteria
| AC ID | Done when |
|---|---|
| FR-01–05, FR-02 | Sections + nav per UX handoff |
| FR-12 | `/404` page with nav |
| NFR-01, NFR-04, NFR-08 | Responsive; reduced motion; tokens |
| NFR-10 | Title/meta on index + privacy |

## Read
| What | Where |
|---|---|
| UX branch assets | `prototype/pages/index.html`, `privacy.html`, `not-found.html` |
| Styles/scripts | `prototype/styles/site.css`, `prototype/js/theme.js`, `prototype/js/site.js` |
| Tokens | `design/tokens/design-tokens.json`, `tokens.css` |
| Components | `docs/COMPONENTS.md` |
| G3 IA | `ux/UX-REVIEW.md` human-locked checklist |

## Changes
- Expected files: `web/src/pages/index.astro`, `privacy.astro`, `404.astro`, `web/src/styles/*`, `web/public/assets/*`
- Reuse: copy/adapt prototype CSS/JS; logo/banner SVGs from `prototype/assets/`
- Out of bounds: live `/api/inquiry`, analytics, Resend

## Security requirements
| ID | Requirement | Test |
|---|---|---|
| — | No secrets in client bundle | build artifact scan |

## Tests
| Level | What |
|---|---|
| e2e | Nav anchors, theme persistence smoke |
| a11y | axe on index + privacy |