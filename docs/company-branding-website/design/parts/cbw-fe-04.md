# Part plan: cbw-fe-04 — Cookieless analytics

## Goal
Cloudflare Web Analytics beacon on all pages; no cookies; no consent banner for analytics.

## Acceptance criteria
| AC ID | Done when |
|---|---|
| FR-14 | Beacon present; no analytics cookies in browser storage inspection |

## Read
| What | Where |
|---|---|
| ADR/context | `design/ARCHITECTURE.md` §1 integrations |
| Privacy draft | `prototype/pages/privacy.html` (name analytics vendor) |

## Changes
- Expected files: `web/src/layouts/Base.astro` analytics slot; `PUBLIC_CF_ANALYTICS_TOKEN` or script snippet env
- Reuse: layout from `cbw-fe-01`
- Out of bounds: GA/Meta pixels

## Security requirements
| ID | Requirement | Test |
|---|---|---|
| — | Third party script SRI/hash if vendor supports | review |

## Tests
| Level | What |
|---|---|
| e2e | Network request to Cloudflare beacon on load |
| manual | Application tab: no new cookies |