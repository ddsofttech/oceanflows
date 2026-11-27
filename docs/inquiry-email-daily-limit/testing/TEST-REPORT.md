# Test Report: release point RP1 (in progress)

## Metadata
- PRD version: `2.0`
- Test plan: `docs/inquiry-email-daily-limit/testing/TEST-PLAN.md`
- Author: qa (S5.1 all RP1 slices; S5.2 RP1 release test)
- Date: 2026-11-26

## Slice checks
| Slice part | Merged commit | Date | Result (pass / fail) | Defects |
|---|---|---|---|---|
| iedl-devops-01 | `c7053160` | 2026-11-26 | pass | — |
| iedl-be-01 | `9cf0660a` | 2026-11-26 | pass | — |
| iedl-fe-01 | `bf98188b` | 2026-11-26 | pass | — |

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

### iedl-fe-01 — evidence (TEST-PLAN §2)

| Check | Result | Evidence |
|---|---|---|
| CI `web-ci` green on merge PR #17 | pass | `gh pr checks 17` — all gates pass (incl. `unit-tests`, `playwright-smoke`) |
| `classifyInquiryResponse` daily vs IP (FR-08, FR-15) | pass | `vitest run tests/unit/inquiry-form.test.ts` — 6/6; maps `daily_limit_reached` → `daily-limit-reached`, `rate_limited` → `rate-limited` |
| Daily-limit UI copy distinct from burst | pass | `web/src/scripts/inquiry-form.ts` `renderStatus` — daily: “Daily inquiry limit reached”; burst: “Please wait a moment and try again.” |
| Privacy FR-11 disclosure (hashed counters, UTC day) | pass | `web/src/pages/privacy.astro` §“Inquiry rate limiting”; e2e `site.spec.ts` privacy meta `/inquiry/i` |
| Full `web` vitest @ integrated tree | pass | `npm run test` — 10 files, 55 tests pass |

- Deviations from test plan: No dedicated privacy string unit snapshot; FR-11 verified via source + e2e meta. FR-11 owner sign-off (D8) not recorded in repo — tracked as H1/G6 known issue (not blocking slice §2 code presence).
- Flaky tests and environment issues: none affecting iedl-fe-01 product verdict.

## Release test
- Build under test (commit or release candidate): `bf98188b` (merge #17 iedl-fe-01; integrated RP1 = devops `c7053160` + be `9cf0660a` + fe `bf98188b`)
- Environment: local macOS; CI via `gh pr checks 17`; vitest + Playwright against local `astro build` + `serve dist`
- Date: 2026-11-26

### RP1 flows (TEST-PLAN §3)

| AC / flow | Test or check | Result | Evidence |
|---|---|---|---|
| W1 normal inquiry under cap | `contact.spec.ts` stub 200 sent | pass | Playwright “shows success when inquiry is accepted” |
| E8 4th same email → daily limit, no success | Contract 4th POST + classifier | pass | `inquiry.contract.test.ts` “fourth same-email POST”; `inquiry-form.test.ts` FR-15 |
| E9 2nd same IP &lt;60s → burst | Contract + classifier | pass | `inquiry.contract.test.ts` BR-13; `inquiry-form.test.ts` FR-08 |
| E1 invalid email unchanged | Client + API validation | pass | `inquiry-form.test.ts` `validateInquiryClient`; `contact.spec.ts` validation_failed |
| Optional stubbed 429 in contact e2e | — | not run | TEST-PLAN optional; classifier + copy verified in unit/source |

### Regression and non-functional (TEST-PLAN §3–§4)

| Suite | Passed | Failed | Not run | Evidence |
|---|---|---|---|---|
| Inquiry regression (§4) | 44 | 0 | 0 | `vitest run tests/unit/inquiry*.test.ts` — 7 files |
| Site smoke Home → Contact / privacy | 18 | 0 | 0 | `playwright test tests/e2e/site.spec.ts tests/e2e/contact.spec.ts` |
| Full web vitest | 55 | 0 | 0 | `npm run test` |
| NFR-11 preview Worker KV + pepper smoke | — | — | H1 | No `CLOUDFLARE_API_TOKEN`; KV IDs/pepper not provisioned (same as slice checks) |
| Fail-closed KV missing on hosted Worker | — | — | H1 | Covered in CI via contract (missing pepper → 502, no increment); preview runtime not exercised |
| FR-11 D8 owner privacy approval before prod | — | — | H1 | Text present in build; human D8 sign-off not recorded for G7 |

- Deviations from test plan: E8/E9 visitor copy not exercised via stubbed 429 Playwright (optional); API + unit + distinct `renderStatus` copy used instead. All automated §4 regression rows executed. Hosted §3 NFR-11 and D8 deferred per H1.
- Flaky tests and environment issues: none affecting RP1 product verdict.

## Defects
| Defect ID | Severity | Type | Owner | Status |
|---|---|---|---|---|
| — | — | — | — | — |

## Recommendation for G6
- Recommendation: **Pass with known issues** — all three RP1 slice checks pass; automated release regression and planned local e2e pass on `bf98188b`. Not ready for production deploy until H1 hosted checks and D8 are closed (G7 scope).
- Known issues proposed for acceptance (Important or Non-blocking only):
  - **H1 — Cloudflare runtime:** `INQUIRY_DAILY_LIMIT` KV namespace IDs + `INQUIRY_LIMIT_HASH_PEPPER` on preview/prod; `wrangler kv namespace list` (TM-16); preview smoke POST (NFR-11 manual). Owner: human + `devops`. Severity: Important (environment).
  - **H1 — D8:** Privacy rate-limit paragraph owner approval before production. Owner: human (Duong). Severity: Non-blocking for G6 code completeness; **blocking for G7 prod** per TEST-PLAN §7 exit.
  - **Residual (documented):** TM-01 KV race 4th send; TM-12 IP across isolates — accepted per TEST-PLAN §1 deferred table.
- Open Blocking defects (must be none to pass): none.
- G6 decision: **D7 Approve** (2026-11-26). Known issues accepted: H1 Cloudflare runtime (Important env), H1/D8 privacy sign-off deferred to G7, TM-01/TM-12 residuals.