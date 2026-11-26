# Test Report: release point RP1 (in progress)

## Metadata
- PRD version: `2.0`
- Test plan: `docs/inquiry-email-daily-limit/testing/TEST-PLAN.md`
- Author: qa (S5.1 — iedl-devops-01)
- Date: 2026-11-26

## Slice checks
| Slice part | Merged commit | Date | Result (pass / fail) | Defects |
|---|---|---|---|---|
| iedl-devops-01 | `c7053160` | 2026-11-26 | pass | — |

### iedl-devops-01 — evidence (TEST-PLAN §2)

| Check | Result | Evidence |
|---|---|---|
| `web/wrangler.toml` documents `INQUIRY_DAILY_LIMIT` binding | pass | `binding = "INQUIRY_DAILY_LIMIT"` with `id` / `preview_id` placeholders and comment ref to SETUP-GUIDES §A8 |
| `web/.dev.vars.example` pepper placeholder | pass | `INQUIRY_LIMIT_HASH_PEPPER=` present |
| `web/.env.example` pepper placeholder | pass | `INQUIRY_LIMIT_HASH_PEPPER=` present |
| Setup guide §A8 (D7, TM-16) | pass | `docs/company-branding-website/delivery/SETUP-GUIDES.md` §A8.1–A8.5 |
| Production placeholder guard (D7) | pass | `CHECK_PRODUCTION_ENV=1 npm run check:production-wrangler-kv` → exit 1 with placeholder error; without env → skip exit 0 |
| Unit: `check-production-wrangler-kv` | pass | `vitest run tests/unit/check-production-wrangler-kv.test.ts` — 4/4 |
| CI on merge PR | pass | GitHub PR #15 — `web-ci` gates green (incl. unit-tests) |
| `wrangler kv namespace list` / TM-16 live checklist | blocked (H1) | No `CLOUDFLARE_API_TOKEN` in QA environment — not a product defect |
| Preview/prod runtime KV + pepper (NFR-11 manual, TEST-PLAN §1) | not run | Deferred until H1 (owner KV IDs + `INQUIRY_LIMIT_HASH_PEPPER`) |

- Deviations from test plan: Hosted Cloudflare checks from §1 (NFR-11 manual, TM-16 list) deferred per H1; slice §2 doc/script/unit checks executed in full.
- Flaky tests and environment issues: `tsx` IPC listen `EPERM` under default sandbox when running `check:production-wrangler-kv` — reran outside sandbox; not product-related.

## Release test
- Build under test (commit or release candidate): `c7053160` (merge #15); integrated HEAD includes devops changes (`c7053160` ancestor of current tree).
- Environment: local macOS; CI status via `gh pr checks 15`
- Date: 2026-11-26

*(Release test — RP1 end-to-end / regression — not started; pending iedl-be-01, iedl-fe-01 merge and slice checks.)*

## Defects
| Defect ID | Severity | Type | Owner | Status |
|---|---|---|---|---|
| — | — | — | — | — |

## Recommendation for G6
- Recommendation: *(slice iedl-devops-01 only)* — pass for slice check; RP1 release recommendation pending.
- Known issues proposed for acceptance (Important or Non-blocking only): H1 — hosted KV namespace IDs and production pepper not provisioned (environment; owner human per BOARD).
- Open Blocking defects (must be none to pass): none for iedl-devops-01 slice scope.