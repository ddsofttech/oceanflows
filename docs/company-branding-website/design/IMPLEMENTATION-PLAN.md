# Implementation Plan

## Metadata
- Architecture version: S3.1 `design/ARCHITECTURE.md` (2026-11-25)
- G4 decision (recorded on approval): D17 Approve (2026-11-25) — Cloudflare Pages plan locked
- Author: architect (S3.2)
- Date: 2026-11-25; revised 2026-11-25 (G4 Revise D16 — Cloudflare Pages)

## 1. Slice parts

| Part ID | Slice | AC IDs | Part | Owner | Depends on | Release point | Size | Review class | Part plan |
|---|---|---|---|---|---|---|---|---|---|
| cbw-devops-01 | Platform | NFR-05, gates | back-end | devops | — | RP0 | M | Important | `parts/cbw-devops-01.md` |
| cbw-fe-01 | Site shell | FR-01–05, FR-02, FR-12, NFR-01,04,08,10 | front-end | frontend-developer | cbw-devops-01 | RP1 | L | Important | `parts/cbw-fe-01.md` |
| cbw-be-01 | Inquiry API | FR-06–08, FR-07, BR-05–07, NFR-06 | back-end | backend-developer | cbw-devops-01 | RP1 | M | **Sensitive** | `parts/cbw-be-01.md` |
| cbw-fe-02 | Contact live | FR-06–08, FR-10, FR-13, FR-11 (links) | front-end | frontend-developer | cbw-fe-01, cbw-be-01 | RP1 | M | Important | `parts/cbw-fe-02.md` |
| cbw-fe-03 | A11y/SEO polish | NFR-02, NFR-10, FR-12 | front-end | frontend-developer | cbw-fe-01 | RP1 | S | Important | `parts/cbw-fe-03.md` |
| cbw-fe-04 | Analytics | FR-14 | front-end | frontend-developer | cbw-fe-01 | RP2 | S | Routine | `parts/cbw-fe-04.md` |
| cbw-devops-02 | Production launch | BR-09, D2, D3, D6 | back-end | devops | cbw-fe-02, cbw-fe-04 | RP2 | S | Important | `parts/cbw-devops-02.md` |

- **Deferred acceptance criteria:**
  - FR-09 section-end CTAs — G3 waiver (header + hero only).
  - FR-01 explicit “consulting first, implementation second” line — G3 defer; optional copy PR.
  - NFR-03 field CWV — measure at release (QA), not blocking RP1 staging.

## 2. Shared pieces
| Piece | Built by | Reused by |
|---|---|---|
| Astro `web/` scaffold + CI | cbw-devops-01 | all |
| Design tokens + global CSS | cbw-fe-01 | cbw-fe-02–04 |
| OpenAPI inquiry contract + handler | cbw-be-01 | cbw-fe-02 |
| Env/placeholder guard script | cbw-devops-01 | cbw-devops-02 |

## 3. Sequence and spikes

| Order | Part | Depends on | Parallel with | Risk |
|---|---|---|---|---|
| 1 | cbw-devops-01 | — | — | CI template |
| 2 | cbw-fe-01 | cbw-devops-01 | cbw-be-01 | Large migration |
| 2 | cbw-be-01 | cbw-devops-01 | cbw-fe-01 | PII/spam |
| 3 | cbw-fe-02 | cbw-fe-01, cbw-be-01 | cbw-fe-03 | Contract integration |
| 3 | cbw-fe-03 | cbw-fe-01 | cbw-fe-02 | a11y |
| 4 | cbw-fe-04 | cbw-fe-01 | cbw-devops-02 | — |
| 5 | cbw-devops-02 | cbw-fe-02, cbw-fe-04 | — | Owner placeholders |

**Spike (optional, day-boxed):** Resend sandbox send from Cloudflare Pages preview deployment — owner of `cbw-be-01`.

## 4. Release points

| Release point | Parts | What the user gets | Why |
|---|---|---|---|
| RP0 | cbw-devops-01 | CI green on empty `web/` | Gate before feature PRs |
| RP1 (staging) | cbw-fe-01, cbw-be-01, cbw-fe-02, cbw-fe-03 | Full site on Cloudflare Pages preview branch; inquiry to test inbox; booking link; privacy + 404 | End-to-end QA (S5) |
| RP2 (production) | cbw-fe-04, cbw-devops-02 | Live domain, real emails/booking, analytics, no placeholders | G7 go-live |

## 5. CI and environments (provisioned at S3.4)
- **Git host:** existing repo remote (orchestrator confirms); branch flow: feature → `ux/company-branding-website` / `main` per team rule.
- **Pipelines:** PR — lint, typecheck, unit tests, Playwright smoke, gitleaks, npm audit, `ui-catalog.py --check`, `sdlc-check.py`; main — Cloudflare Pages production deploy (Git integration or GitHub Action with Wrangler).
- **Quality gates:** `docs/ENGINEERING-STANDARDS.md` §9.
- **Environments:** Cloudflare Pages preview deployments (per branch/PR); production custom domain on Cloudflare (D2); secrets per environment in dashboard.
- **Scaffold creator:** `cbw-devops-01` adds `web/` + `wrangler.toml` + `@astrojs/cloudflare` + CI workflow.

## 6. Rollout
- Migrations: none.
- Feature flags: none; placeholder guard via env at build.
- Rollout order: RP1 staging soak → owner content/sign-off on privacy → RP2 DNS cutover → post-release observation (S6).