# Architecture

## Metadata
- PRD version: `3.0` (`docs/baselines/prds/PRD-v3.0/`); SITE-FR-16, SITE-FR-17, SITE-NFR-12, SITE-BR-06, SITE-AC-16/17/N03/N04
- UX handoff: `docs/tools-ticker-use-cases/ux/UX-REVIEW.md` (G3 D7 Approve); brief `ux/UX-BRIEF.md`
- Mode: existing-repo
- System architecture version: `docs/SYSTEM-ARCHITECTURE.md` (inquiry-email-daily-limit delta pending G4)
- Author: architect (S3.1)
- Date: 2026-11-27

## 1. Context
- **Constraints:** Marketing-only static site (`CTR-MARKETING-SITE`); no new APIs, auth, PII, or payments. G3 merged UI on `release/tools-ticker-use-cases` under `web/`.
- **Non-functional requirements:** SITE-NFR-01/02/03/04/12; SITE-BR-05/06; PRD W-3, C8, R9–R10.
- **Integration points:** None external. Same-origin static iframe `web/public/demos/customer-support-chat.html`.
- **Binding UX (G3):** D4 demo-left / copy-right; D5 lazy row activation; text-only ticker (Q28); CS hook + 5 bullets; decorative demos `aria-hidden` with accessible copy column.

## 2. Options
| Option | Summary | Meets requirements? | Trade-offs | Cost to reverse |
|---|---|---|---|---|
| **Extend G3 components (recommended)** | Harden `ToolsTicker`, `UseCaseStack`, demos, `use-case-lazy.js` in `HomeMain.astro` | Yes | UX already built; review churn only | Low |
| Rebuild from prototype HTML | Re-import `docs/.../prototype/` into Astro | Yes | Duplicates merged work | High |
| Client island (React) for motion | Hydrated demos | Partial | Heavier bundle; no AC needs it | Medium |

- **Recommendation:** Extend merged Astro components and CSS; delete obsolete use-case grid markup if any remains; no new npm deps.
- **Heavier choices:** None unless SITE-AC-N03 forces deferring marquee (UQ-T3 → QA).

## 3. Change to the system architecture
| Element ID | Level | Added / changed / removed | Why |
|---|---|---|---|
| CMP-TOOLS-TICKER | component | Added | SITE-FR-16, SITE-BR-06 |
| CMP-USE-CASE-STACK | component | Added | SITE-FR-17, D4 layout |
| CMP-USE-CASE-LAZY | component | Added | D5, SITE-NFR-12 |
| CMP-HOME-MAIN | component | Changed | Insert ticker; replace use-case grid | SITE-FR-16/17 |

## 4. Scale approach
| Item | Value or decision | Source |
|---|---|---|
| Expected load | Unchanged low-traffic marketing | PRD O5 |
| Data volume | Static HTML/CSS/JS; 12 tool strings; 4 workflows | SITE-FR-16/17 |
| Hot paths | Home `/` paint; IO activates ≤1 iframe + 3 SVG demos on scroll | SITE-NFR-03 |
| Storage | `web/public/demos/`, `web/public/scripts/` | G3 build |
| Pagination / limits | n/a | — |
| Caching | CDN static assets; marquee CSS animation compositor-only | UQ-T3 |
| Sync vs async | Lazy activation sync on intersection; no workers | D5 |
| Scales out | Static CDN (unchanged) | CTR-MARKETING-SITE |

## 5. Data model
n/a — no server entities. **Content contract (static):** tool list constant in `ToolsTicker.astro` matches SITE-FR-16 order; use-case copy from `HomeMain.astro` / `UseCaseStack.astro`.

## 6. Contracts
| Contract | Type | Schema link | New or changed | Compatibility |
|---|---|---|---|---|
| n/a | — | — | — | — |

- **Error model:** n/a. **Client script contract:** `[data-lazy-demo]` rows; iframe `data-src` → `src`; `prefers-reduced-motion` skips abstract `is-active`.

## 7. Failure modes and observability
| Failure | Behavior | Detection |
|---|---|---|
| IO unsupported | Activate all rows (fallback in `use-case-lazy.js`) | e2e / manual |
| Reduced motion | Static ticker list; static CS transcript; no SVG loops | e2e `prefers-reduced-motion` |
| Missing demo asset | Broken iframe region; copy column still readable | SITE-AC-17 manual |
| Marquee CLS (residual) | Transform-only animation; static fallback | SITE-AC-N03 QA lab |

Logging: no new client telemetry.

## 8. Security design items
| Threat model ID | Design item |
|---|---|
| n/a | Marketing static content; same-origin demo iframe; no form POST in demos |

Threat model skipped per delegation (no new external integration). Iframe is decorative (`aria-hidden`); no user input in demo.

## 9. Architecture decision records
### ADR-1: Productionize G3 Astro components
- Context: G3 accepted built UI on release branch.
- Decision: Harden existing files; no greenfield rewrite.
- Consequences: Slice `ttuc-fe-01` is integration/review-sized, not large migration.

### ADR-2: IntersectionObserver lazy demo activation
- Context: D5; SITE-NFR-03/12.
- Decision: Keep `use-case-lazy.js` inline script; unobserve after first intersect.
- Consequences: Off-screen demos idle; QA verifies row 0 only loads at `#use-cases`.

### ADR-3: Customer Support as same-origin static iframe
- Context: Owner prototype HTML embedded unchanged in intent.
- Decision: `CustomerSupportDemo.astro` → `/demos/customer-support-chat.html`.
- Consequences: No CSP change expected; sandbox attrs only if security review requires.

## 10. Risks and open questions
| ID | Risk or question | Change class | Severity | Owner | Next action |
|---|---|---|---|---|---|
| UQ-T3 | Marquee vs CWV | B | Non-blocking | qa | SITE-AC-N03 at S5 |
| UQ-U4 | Keyboard through decorative demos | B | Important | qa | S5 manual + optional e2e |
| UX-E1 | Ticker PNG captures wrong viewport | B | Important | designer | Fix `capture-screenshots.py` (non-blocking G4) |
| R-CWV | New CSS/JS on Home LCP | B | Non-blocking | qa | Lab measure RP1 |