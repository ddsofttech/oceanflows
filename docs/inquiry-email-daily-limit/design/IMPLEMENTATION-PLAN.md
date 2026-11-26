# Implementation Plan

## Metadata
- Architecture version: `design/ARCHITECTURE.md` (2026-11-26, S3.1)
- G4 decision (recorded on approval): (pending S3.3)
- Author: architect (S3.2)
- Date: 2026-11-26

## 1. Slice parts

| Part ID | Slice | AC IDs | Part | Owner | Depends on | Release point | Size | Review class | Part plan |
|---|---|---|---|---|---|---|---|---|---|
| iedl-devops-01 | KV platform | NFR-11, D7 | back-end | devops | — | RP1 | S | Important | `parts/iedl-devops-01.md` |
| iedl-be-01 | Daily limit API | FR-15, BR-10–BR-14, BR-12, BR-13, NFR-11, NFR-06 | back-end | backend-developer | iedl-devops-01 | RP1 | M | Sensitive | `parts/iedl-be-01.md` |
| iedl-fe-01 | Contact UX + privacy | FR-08, FR-11, FR-15 (copy) | front-end | frontend-developer | iedl-be-01 | RP1 | S | Important | `parts/iedl-fe-01.md` |

- **Deferred:** None in scope.

## 2. Shared pieces
| Piece | Built by | Reused by |
|---|---|---|
| OpenAPI v1.1 contract | iedl-be-01 | iedl-fe-01, QA |
| `InquiryDailyLimitStore` + KV adapter | iedl-be-01 | unit tests |
| KV namespace + pepper secret | iedl-devops-01 | iedl-be-01 (runtime) |

## 3. Sequence and spikes
| Order | Part | Depends on | Parallel with | Risk |
|---|---|---|---|---|
| 1 | iedl-devops-01 | — | — | Wrong KV binding blocks prod |
| 2 | iedl-be-01 | iedl-devops-01 | — | PII/KV; contract change |
| 3 | iedl-fe-01 | iedl-be-01 | — | Copy/a11y |

No spike required; pattern is standard KV on existing Worker.

## 4. Release points
| Release point | Slice parts | What the user gets | Why |
|---|---|---|---|
| RP1 | iedl-devops-01, iedl-be-01, iedl-fe-01 | Production Worker enforces 3 inquiries/email/UTC day, IP 1/min, updated errors and privacy draft | Single cohesive abuse-control change |

## 5. CI and environments
- **Git host:** existing repo; branch `release/inquiry-email-daily-limit` → merge per team rule.
- **Pipelines:** unchanged `web-ci`; PR checks include contract tests.
- **Quality gates:** `docs/ENGINEERING-STANDARDS.md` §9 (+ §3/§6 deltas from this request).
- **Environments:** Cloudflare preview + production Worker; KV namespace shared or per-env IDs per devops guide.
- **Provision:** `iedl-devops-01` updates `web/wrangler.toml`, setup guide, `.dev.vars.example`.

## 6. Rollout
- Migrations: none (new KV keys appear on first submit).
- Feature flags: none.
- Rollout order: merge devops binding docs → implement be → fe → QA S5 → production deploy with KV ID + pepper set (D8 privacy owner sign-off before prod if text changes).