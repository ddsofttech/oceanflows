# Implementation Plan

## Metadata
- Architecture version: `design/ARCHITECTURE.md` (S3.1, 2026-11-27)
- G4 decision (recorded on approval): (pending S3.3 HITL)
- Author: architect (S3.2)
- Date: 2026-11-27

## 1. Slice parts

| Part ID | Slice | AC IDs | Part | Owner | Depends on | Release point | Size | Review class | Part plan |
|---|---|---|---|---|---|---|---|---|---|
| ttuc-fe-01 | Home ticker + use cases | SITE-AC-16, SITE-AC-17, SITE-FR-16/17, SITE-BR-05/06, SITE-NFR-04/12, SITE-AC-N04 | front-end | frontend-developer | — | RP1 | M | Important | `parts/ttuc-fe-01.md` |
| ttuc-fe-02 | Regression + a11y tests | SITE-AC-16/17, SITE-NFR-02, SITE-AC-N04 | front-end | frontend-developer | ttuc-fe-01 | RP1 | S | Routine | `parts/ttuc-fe-02.md` |

- **Deferred acceptance criteria:**
  - SITE-AC-N03 (CWV lab) — UQ-T3; measure at S5 QA, not blocking RP1 merge.
  - UQ-U4 full keyboard session — S5 QA; partial e2e if time in `ttuc-fe-02`.

## 2. Shared pieces
| Piece | Built by | Reused by |
|---|---|---|
| `marketing-tools-use-cases.css` | ttuc-fe-01 | ttuc-fe-02 (visual baselines only) |
| `use-case-lazy.js` | ttuc-fe-01 (G3) | ttuc-fe-02 e2e |
| UI catalog entries | ttuc-fe-01 | CI `ui-catalog.py --check` |

## 3. Sequence and spikes

| Order | Part | Depends on | Parallel with | Risk |
|---|---|---|---|---|
| 1 | ttuc-fe-01 | — | — | Review G3 diff for dead markup |
| 2 | ttuc-fe-02 | ttuc-fe-01 | — | Flaky iframe timing |

**Spike:** none.

## 4. Release points

| Release point | Slice parts | What the user gets | Why release here |
|---|---|---|---|
| RP1 | ttuc-fe-01, ttuc-fe-02 | Home with ticker below Services and interactive use cases; tests green | Single vertical ship for W-3 |

## 5. CI and environments (provisioned at S3.4)
- **Git host:** existing repo; branch `release/tools-ticker-use-cases` → PRs → merge to release/main per team rule.
- **Pipelines:** existing PR gates (`web/` lint, types, Playwright, `ui-catalog.py`, `sdlc-check.py`).
- **Quality gates:** `docs/ENGINEERING-STANDARDS.md` §9.
- **Environments:** Cloudflare Pages preview (unchanged); no new bindings.
- **Scaffold creator:** n/a.

## 6. Rollout
- Migrations: none.
- Feature flags: none.
- Rollout order: merge RP1 → staging preview → S5 QA → G7 if bundled with next site release.