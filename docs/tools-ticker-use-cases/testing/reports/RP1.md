# Test Report: release point RP1

## Metadata
- PRD version: `3.0` (`docs/baselines/prds/PRD-v3.0/features/SITE.md`)
- Test plan: `docs/tools-ticker-use-cases/testing/TEST-PLAN.md`
- Author: qa (S5.2)
- Date: 2026-11-27

## Slice checks
| Slice part | Merged commit | Date | Result | Defects |
|---|---|---|---|---|
| ttuc-fe-01 | `6bff9d212bf220308475ff35152398a42cde7fa5` (PR #23) | 2026-11-27 | **pass** | — |
| ttuc-fe-02 | `daeb543ff60a7e50c4ec9b65e2a5c0bc625e06a2` (PR #24) | 2026-11-27 | **pass** | — |

Detail: `testing/reports/ttuc-fe-01.md`, `testing/reports/ttuc-fe-02.md`

## Release test
- Build under test: `daeb543f` (integrated RP1; release branch tip includes doc-only commits after merge)
- Environment: local macOS — `astro build` + `serve dist` + Playwright chromium; PR #24 CI
- Date: 2026-11-27

| AC or requirement ID | Test or check | Result | Evidence |
|---|---|---|---|
| W-3 (TEST-PLAN §3) | Scroll Services → ticker → Approach → `#use-cases` → Contact | **pass** | E2E section order + manual scroll on local preview |
| Nav → Use cases one step | Primary nav link | **pass** | E2E `primary nav reaches anchored sections` |
| Reduce motion | Static ticker + no demo pulse | **pass** | E2E SITE-AC-N04 |
| SITE-AC-16 / SITE-AC-17 | Blocking ACs | **pass** | E2E (see slice reports) |
| SITE-BR-06 / BR-05 | Copy/logos | **pass** | ttuc-fe-01 manual + ticker e2e (0 `img`) |
| SITE-NFR-01 | 320 / 1280 no horizontal scroll | **pass** | Local viewport check on `/` |
| SITE-NFR-02 | axe serious/critical | **pass** | E2E four routes |
| SITE-NFR-04 / NFR-12 | Motion off; demos decorative | **pass** | E2E reduce-motion + fe-01 manual evidence |
| SITE-NFR-09 | Cross-browser smoke | **partial** | CI chromium only; no manual Safari/Firefox matrix |
| SITE-AC-N03 (CWV) | Lighthouse mobile lab | **not run** | TEST-PLAN §1 deferred — S5.2 |
| UQ-U4 | Full keyboard through use cases | **not run** | Baseline skip-link + mobile menu e2e only |
| SITE-AC-01 / SITE-AC-03 | Home/Services copy unchanged | **not run** | TEST-PLAN smoke deferred — spot-only |
| CS demo vs owner prototype | Line intent compare | **not run** | Carried from fe-01 deferral |

| Suite | Passed | Failed | Not run | Evidence |
|---|---|---|---|---|
| End-to-end (Playwright `site.spec.ts`) | 16 | 0 | — | Local @ `daeb543f` tree |
| Regression §4 | 16 | 0 | — | Same suite (nav, contact, theme, beacon, meta, axe, keyboard) |
| Non-functional (automated) | axe, reduce-motion | — | CWV lab | Per table above |

- Deviations from the test plan: SITE-AC-N03, UQ-U4, and CS prototype manual rows executed as deferred/not run per TEST-PLAN §1 and §7; all blocking §3 flows and §4 regression automated rows pass locally.
- Flaky tests and environment issues: merge-push `web-ci` cancelled on `daeb543f` (superseded by doc push); release evidence uses PR #24 green CI + local Playwright.

## Defects
| Defect ID | Severity | Type | Owner | Status |
|---|---|---|---|---|
| — | — | — | — | — |

## Recommendation for G6
- Recommendation: **Pass with known issues**
- Known issues proposed for acceptance:
  - **SITE-AC-N03:** Mobile CWV lab (LCP/INP/CLS) not measured this session — Important for perf sign-off; owner `qa` / preview Lighthouse before G7 if required.
  - **UQ-U4:** Full keyboard path through use-case stack not exercised — Non-blocking at RP1 per G3 deferral; baseline keyboard e2e green.
  - **SITE-AC-17 manual:** Owner CS chat prototype not line-compared — Non-blocking if decorative iframe + copy column pass (automated + fe-01 manual).
  - **SITE-NFR-09:** Cross-browser matrix not run beyond CI chromium — Non-blocking for static marketing.
- Open Blocking defects: **none**