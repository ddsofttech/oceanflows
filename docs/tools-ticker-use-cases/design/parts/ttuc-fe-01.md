# Part plan: ttuc-fe-01 — Harden ticker and use cases on Home

## Goal
Home ships G3-accepted `ToolsTicker` and `UseCaseStack` with correct section order, accessibility patterns, reduced-motion fallbacks, and lazy demos — no prototype-only gaps.

## Acceptance criteria
| AC ID | Done when |
|---|---|
| SITE-AC-16 | After `#services`, ticker shows all 12 tools in spec order with accessible labels |
| SITE-AC-17 | Four workflows readable without interaction; CS demo matches owner intent; reduced-motion static |
| SITE-AC-N04 | `prefers-reduced-motion`: no marquee loop or abstract pulse |
| SITE-BR-06 | Text-only tool names; no logos |
| SITE-NFR-12 | Demos decorative; copy column primary |

## Read
| What | Where |
|---|---|
| Requirements | `docs/baselines/prds/PRD-v3.0/features/SITE.md` §3–7 |
| UX handoff | `ux/UX-REVIEW.md` §G; `ux/UX-BRIEF.md` §B |
| Architecture | `design/ARCHITECTURE.md` §1, ADR-1–3 |
| Components | `docs/COMPONENTS.md` ToolsTicker, UseCaseStack, CustomerSupportDemo, UseCaseDemoPlaceholder |
| Standards | `docs/ENGINEERING-STANDARDS.md` §9 tokens, catalog |

## Changes
- Expected files: `web/src/components/marketing/ToolsTicker.astro`, `UseCaseStack.astro`, `CustomerSupportDemo.astro`, `UseCaseDemoPlaceholder.astro`, `HomeMain.astro`, `web/src/styles/marketing-tools-use-cases.css`, `web/public/scripts/use-case-lazy.js`, `web/public/demos/customer-support-chat.html`
- Reuse: G3 merged implementations; `HomeMain.astro` already imports ticker (after Services) and `UseCaseStack`
- Out of bounds: inquiry API, nav section list, vendor links on ticker, replacing Sales/Ops/Automation summaries

## Security requirements
| ID | Requirement | Test |
|---|---|---|
| — | Static marketing; same-origin demo only | manual |

## Tests
| Level | What |
|---|---|
| manual | Scroll Home: Services → ticker → Approach → use cases; CS iframe loads on intersect |
| manual | OS reduce motion: static ticker + static demos |