# UX Review

## A. What was reviewed
- Brief: `docs/tools-ticker-use-cases/ux/UX-BRIEF.md` (G2 D6 Approve).
- Branch: `ux/tools-ticker-use-cases` @ `34b3a60f`.
- Evidence: **owner walkthrough** — `ux/screens/`, code on branch, live `astro dev` (320/390/1200px, reduce-motion via CDP).
- Baseline: `docs/baselines/prds/PRD-v3.0/features/SITE.md` (SITE-FR-16/17, SITE-NFR-12, SITE-BR-05/06, SITE-AC-16/17).

## B. UI check results (what was built)
| Check | Tool | Result | Notes |
|---|---|---|---|
| ESLint / astro+tsc / stylelint / catalog | per UX brief §F | **Pass** | Not re-run S2.4. |
| axe (Home) | `@axe-core/playwright` | **Not run** | Proposed in `ENGINEERING-STANDARDS.md` → **Missing UI check** → `architect` S3.1. |
| a11y manual | browser tree | **Partial** | SR ticker list; demos `aria-hidden`; no keyboard session. |
| Tokens | manual | **Pass** | `marketing-tools-use-cases.css` uses product tokens. |

## C. Question results
| Question | Result | Evidence |
|---|---|---|
| UQ-T1 | **Answered** | 12 text tools, FR-16 order, readable @ 320px, no h-scroll. |
| UQ-T2 | **Answered** | Reduce motion → static flex list, 12 items. |
| UQ-T3 | **Defer G3** | Transform marquee; CWV not lab-run (SITE-AC-N03 → QA). |
| UQ-U1 | **Answered** | Four titles + hook/summary or 5 bullets without demo. |
| UQ-U2 | **Answered** | Chat file = owner source; demo `aria-hidden` + badge. |
| UQ-U3 | **Answered** | Abstract motifs + badges (SITE-BR-05). |
| UQ-U4 | **Partial** | Copy in flow; demos skipped — defer keyboard QA S5. |
| UQ-U5 | **Answered** | Static ticker + no abstract pulse under reduce motion. |
| UQ-U6 | **Answered** | Row 0 loads iframe; rows 1–3 idle off-screen at `#use-cases`. |
| UQ-U7 | **Answered** | IO unobserve after activate; iframe not torn down. |

## D. Scenario results
| Scenario | Result | Owner |
|---|---|---|
| Normal: Services → ticker → use cases | **Pass** | — |
| Alternate: nav to `#use-cases` | **Pass (partial)** | QA keyboard S5 |
| Failure: reduced motion | **Pass** | — |
| SITE-AC-16 / SITE-AC-17 | **Pass** | — |

## E. Design review
| Screen | Observation | Type | Severity | Owner |
|---|---|---|---|---|
| Tools ticker | `tools-ticker-default-*.png` shows Services, not ticker (`capture-screenshots.py` `/#services`). Live UI OK. | UX defect | **Important** | `designer`: fix script + PNGs. |
| Use cases | D4 layout, G2 CS hook + 5 bullets, motif badges; mobile stack OK in shots. | — | — | — |
| All | No axe; no reduce-motion PNGs in package. | Missing check / concern | Non-blocking | `architect` / optional `designer` |

## F. Limitations
- Not validated: SITE-AC-N03 CWV, full WCAG keyboard, iframe security.
- Simulated: chat animation, SVG pulse, marquee.

## G. Recommendation and handoff note
- Ready for G3? **Yes** (ticker PNG evidence wrong; UI not).
- Class C: none.
- Architecture: static only; lazy `use-case-lazy.js`; chat at `/demos/customer-support-chat.html`; reuse `ToolsTicker`, `UseCaseStack`, `CustomerSupportDemo`, `UseCaseDemoPlaceholder`, `marketing-tools-use-cases.css` via `HomeMain.astro`.
- Deferred: UQ-T3, UQ-U4, axe, optional reduce-motion shots.

## G3 package (HITL)
- **Preview:** `git checkout ux/tools-ticker-use-cases` → `cd web && npm run dev -- --host 127.0.0.1` → `/#use-cases`; ticker below Services.
- **Screenshots:** Trust `use-cases-{idle,active}-{mobile,desktop}.png`; fix `tools-ticker-default-*` before using as ticker evidence.
- **Recommendation:** **Approve** with live ticker check or after PNG refresh; **Revise** if screenshots must be correct pre-Approve; **Reject** if D4/CS copy wrong (not seen).
- **Decision requested:** **Approve** / **Revise** / **Reject**; accept live ticker evidence until PNG fix?