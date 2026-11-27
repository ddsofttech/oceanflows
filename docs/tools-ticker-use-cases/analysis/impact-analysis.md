# Existing-System Impact Analysis
<!-- budget: lines=50 chars=300 -->

## 1. Feature summary and baseline
- Intended outcome: Tools ticker under Services; interactive motion-rich Use cases on Home.
- Requirements baseline: PRD v2.0 approved; draft v2.1 + SITE-FR-16/17 (Proposed).
- In scope: `web/src/components/marketing/HomeMain.astro`, related CSS/JS, static assets under `web/public/`.
- Exclusions: Contact Worker, inquiry limits, nav section list except scroll targets unchanged.
- Unresolved: Q27 ticker list; Q28 trademark display — limits ticker content choice.

## 2. Impact overview
- Affected areas: Home marketing layout (between Services and Approach), Use cases section UI/motion, e2e nav tests, CWV on mobile.
- Overall risk: **Medium** (layout + client JS motion; regression on contact path low).

## 3. Requirement-to-system mapping
| Requirement ID | Affected area | Evidence | Category | Confidence | Notes |
|---|---|---|---|---|---|
| SITE-FR-16 | HomeMain.astro after `#services` | HomeMain.astro L55–275 | Create | High | New section |
| SITE-FR-17 | `#use-cases` block | HomeMain.astro L448–547; prototype HTML | Modify | High | Replace static grid |
| SITE-NFR-03/12 | CSS/JS bundles | existing site styles | Extend | Med | Measure after build |
| SITE-FR-02 | Nav / e2e | SiteHeader.astro; site.spec.ts | Extend | High | Anchor unchanged |

## 4. Classification and rationale
New ticker is a new adjacent section (Create). Use cases Extend existing four-card content with new presentation layer; reuse copy unless owner edits.

## 5. Detailed impact areas
- UI: insert section; use-case demos likely client islands or progressive enhancement.
- Tests: `web/tests/e2e/site.spec.ts` may need ticker presence assertion; visual/motion optional.
- a11y: live regions if chat demo; respect reduced motion (prototype already does).
- Performance: lazy-load demo assets; avoid blocking LCP hero.

## 6. Regression risks and scenarios
| Risk | Trigger | Consequence | Existing behavior | Test coverage | Verification |
|---|---|---|---|---|---|
| Broken section order | Bad markup | Skip Approach anchor | e2e section list | site.spec.ts | e2e + manual scroll |
| CWV regression | Heavy JS | Failed NFR-03 | Lighthouse in CI? | partial | Lab CWV on PR |
| Nav mismatch | id change | Broken `#use-cases` | e2e | site.spec.ts | e2e |

## 7. Findings and severity
| ID | Severity | Evidence | Consequence | Owner | Next action |
|---|---|---|---|---|---|
| IA-1 | Important | No third-party logo policy | Wrong ticker assets | Duong | Q28 |
| IA-2 | Non-blocking | Three use cases lack owner media | Design gap | designer | S2 T2/T3 |
| IA-3 | Non-blocking | INQ unchanged | None | — | Regression smoke Contact |

## 8. Decision requests
n/a — Q27/Q28 recorded in PRD/SITE open questions.

## 9. Implementation boundaries
- Change: Home markup/styles/scripts for ticker + use cases only.
- Unchanged: inquiry API, rate limits, other sections' copy.
- Analysis only; motion architecture is for architect after G1/G4.

## 10. Recommended next steps
1. Owner answers Q27–Q28. 2. G1 with S2 design trigger. 3. Architect plans static vs hydrated demo boundary.

## 11. Evidence index
| Claim | Path and symbol |
|---|---|
| Services end anchor | `web/src/components/marketing/HomeMain.astro` `#services` |
| Use cases grid | same file `#use-cases` |
| Chat prototype | `docs/tools-ticker-use-cases/sources/2026-11-27-customer-support-ai-assistant-chat.html` |