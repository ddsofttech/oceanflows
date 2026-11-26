# Test Report: release point RP1 (in progress)

## Metadata
- PRD version: `2.0`
- Test plan: `docs/inquiry-email-daily-limit/testing/TEST-PLAN.md`
- Author: qa (S5.1 — iedl-devops-01, iedl-be-01)
- Date: 2026-11-26

## Slice checks
| Slice part | Merged commit | Date | Result (pass / fail) | Defects |
|---|---|---|---|---|
| iedl-devops-01 | `c7053160` | 2026-11-26 | pass | — |
| iedl-be-01 | `9cf0660a` | 2026-11-26 | pass | — |

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

### iedl-be-01 — evidence (TEST-PLAN §2 + §1 rows for RP1 / iedl-be-01)

| Check / AC | Result | Evidence |
|---|---|---|
| CI `web-ci` green on merge | pass | GitHub PR #16 — all gates pass (incl. `unit-tests`, `sast`, `secrets`, `playwright-smoke`) |
| Full `web` vitest suite | pass | `npm run test` @ `9cf0660a` tree — 10 files, 53 tests pass |
| Inquiry contract + rate + daily + normalize + validation + turnstile | pass | `vitest run` inquiry suites — 6 files, 38 tests pass |
| BR-13 / TM-01: 2nd same IP &lt;60s → 429 `rate_limited` | pass | `inquiry.contract.test.ts` "returns 429 rate_limited on second request in a minute"; `inquiry-rate-limit.test.ts` |
| BR-14: normalization matrix + shared counter | pass | `inquiry-email-normalize.test.ts`; contract daily cap across variants |
| BR-10 / FR-15: 4th same normalized email → `daily_limit_reached`, no Resend | pass | `inquiry.contract.test.ts` "fourth same-email POST"; `fetchMock` called 3× |
| BR-11: UTC day key / TTL helper | pass | `inquiry-daily-limit.test.ts` (`buildDailyLimitKvKey`, day segment) |
| BR-12: increment rules (validation fail, 502 after increment, no increment on cap/missing pepper) | pass | `inquiry.contract.test.ts` BR-12 cases; `inquiry-daily-limit.test.ts` store |
| NFR-06: IP before validation; spam not counted | pass | contract "IP limit before validation"; `inquiry-turnstile.test.ts` |
| FR-07 / BR-06 regression (happy path) | pass | contract "returns 200 sent on successful Resend delivery" |
| NFR-11 (CI mock store aggregate cap) | pass | `createMemoryInquiryDailyLimitStore` in contract + `inquiry-daily-limit.test.ts` |
| TM-15: hashed keys, no plaintext email in KV | pass | `hashedDailyLimitKeyPart (TM-15)` unit assertions |
| TM-03: logs exclude email/hash/key | pass | contract "does not log PII when processing (TM-03)" |
| OpenAPI v1.1 429 enums (`rate_limited`, `daily_limit_reached`) | pass | Contract response bodies match `design/contracts/inquiry-api.openapi.yaml` v1.1 `RateLimitError` (no separate schema runner in CI; behavioral contract suite) |
| TM-15 / TM-03 S4.4 security review | pass | G5 D6 Approve PR #16 per delivery board (not re-run in S5.1) |
| NFR-11 live KV / preview smoke POST | not run | H1 — same as devops slice; requires owner KV IDs + pepper on hosted Worker |
| TM-16 live `wrangler kv namespace list` | blocked (H1) | No `CLOUDFLARE_API_TOKEN` in QA environment — environment gap, not product defect |

- Deviations from test plan: Hosted KV / preview runtime checks (TEST-PLAN §1 NFR-11 manual) not executed; all CI-automated §1 rows for iedl-be-01 executed. No dedicated OpenAPI schema validator in repo — slice §2 satisfied via `inquiry.contract.test.ts` shapes vs v1.1 contract doc.
- Flaky tests and environment issues: none affecting iedl-be-01 product verdict.

## Release test
- Build under test (commit or release candidate): `9cf0660a` (merge #16 iedl-be-01); integrated HEAD `40aae49c` includes devops + backend; release E2E pending iedl-fe-01.
- Environment: local macOS; CI status via `gh pr checks 15`
- Date: 2026-11-26

*(Release test — RP1 end-to-end / regression — not started; pending iedl-fe-01 merge and slice check.)*

## Defects
| Defect ID | Severity | Type | Owner | Status |
|---|---|---|---|---|
| — | — | — | — | — |

## Recommendation for G6
- Recommendation: *(slices iedl-devops-01, iedl-be-01)* — pass for both slice checks; RP1 release recommendation pending iedl-fe-01.
- Known issues proposed for acceptance (Important or Non-blocking only): H1 — hosted KV namespace IDs and production pepper not provisioned (environment; owner human per BOARD).
- Open Blocking defects (must be none to pass): none for iedl-devops-01 or iedl-be-01 slice scope.