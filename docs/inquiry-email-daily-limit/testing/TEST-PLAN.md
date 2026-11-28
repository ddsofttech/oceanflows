# Test Plan

## Metadata
- PRD version: `2.0` (`docs/baselines/prds/PRD-v2.0.md`)
- Implementation plan: `docs/inquiry-email-daily-limit/design/IMPLEMENTATION-PLAN.md` (2026-11-26)
- Author: qa (S3.5)
- Date: 2026-11-26

## 1. Coverage
| AC or requirement ID | Slice part | Release point | Method (automated / manual / exploratory) | Test or check | Level (unit / integration / end-to-end) |
|---|---|---|---|---|---|
| BR-13 / TM-01 | iedl-be-01 | RP1 | automated | Second valid POST same IP within 60s → HTTP 429, body `error: rate_limited`; no Resend/inbox delivery. Update `inquiry-rate-limit.test.ts` + `inquiry.contract.test.ts` (was 5/min). | unit / contract |
| BR-14 | iedl-be-01 | RP1 | automated | Normalization matrix: trim, lowercase, plus-tag strip, Gmail/googlemail dot collapse; shared counter across variants (4th blocked). `inquiry-email-normalize` unit + contract. | unit / contract |
| BR-11 | iedl-be-01 | RP1 | automated | KV TTL / key date segment matches UTC calendar day; counter resets after simulated day boundary (unit TTL helper or mocked clock). | unit |
| BR-12 | iedl-be-01 | RP1 | automated | Increment on valid non-spam POST before Resend; no increment on 400 validation failure; no increment on daily-cap 429; increment retained when Resend returns 502 (per ARCHITECTURE §5). | unit / contract |
| BR-10 | iedl-be-01 | RP1 | automated | Max 3 counted submissions per normalized email per UTC day; 4th → 429 `daily_limit_reached`, no delivery. | contract |
| FR-15 | iedl-be-01, iedl-fe-01 | RP1 | automated + manual | Contract 4th rejection; client `classifyInquiryResponse` maps `daily_limit_reached`; Contact shows daily-limit copy, not IP burst (FR-08 posture). | unit / contract / manual |
| NFR-11 | iedl-be-01 | RP1 | automated | `InquiryDailyLimitStore` mock or multi-call contract proving aggregate cap across logical isolates (same store instance in tests). Optional mock KV namespace in vitest. | unit / integration |
| NFR-11 | iedl-devops-01 | RP1 | manual | Preview/prod Worker has `INQUIRY_DAILY_LIMIT` binding + pepper set; smoke POST after deploy. | manual |
| FR-11 (this request) | iedl-fe-01 | RP1 | manual | Privacy page states hashed per-email counters and UTC-day retention; owner sign-off (D8) before production. | manual |
| FR-08 (inquiry errors) | iedl-fe-01 | RP1 | automated | IP 429 still shows burst copy; daily 429 shows distinct copy; field errors unchanged. `inquiry-form.test.ts`. | unit |
| TM-15 | iedl-be-01 | RP1 | automated + review | No plaintext email in KV keys/values; pepper required in prod; unit assertions + S4.4 code review. | unit / review |
| TM-03 | iedl-be-01 | RP1 | review | Daily-limit log events exclude email/hash/key. | review |
| TM-16 | iedl-devops-01 | RP1 | manual | Dedicated KV namespace; scoped deploy token per setup guide checklist. | manual |
| NFR-06 / BR-07 | iedl-be-01 | RP1 | automated | Spam path (honeypot / Turnstile) still 200 `rejected`, no delivery; not counted toward daily cap (ARCHITECTURE §5). Regression: `inquiry-turnstile.test.ts`, contract spam cases. | unit / contract |
| FR-07 / BR-06 | iedl-be-01 | RP1 | automated | Successful inquiry under cap still delivers and returns success shape (regression). | contract |
| NFR-06 (check order) | iedl-be-01 | RP1 | automated | IP limit before validation; daily after spam guards (ARCHITECTURE §6). Contract ordering tests or dedicated unit. | unit / contract |

- Deferred criteria, with owners:
| ID | Reason | Owner |
|---|---|---|
| Full site FR-01–FR-14, NFR-01–NFR-10 | Out of scope for this request; unchanged except privacy copy | qa (spot-check only at RP1 release smoke) |
| TM-01 (KV race 4th send) | Accepted residual risk (ADR-5); no automated assertion | architect |
| TM-12 (IP across isolates) | Accepted residual; not regressing global IP accuracy | architect |
| Concurrent production isolate race | Not reproducible in CI without load harness | qa — monitor `inquiry.sent` post-release (exploratory) |

## 2. Slice checks
| Slice part | Checks run when it merges |
|---|---|
| iedl-devops-01 | `web/wrangler.toml` documents `INQUIRY_DAILY_LIMIT` binding; `.dev.vars.example` includes pepper placeholder; setup guide section present; local `wrangler kv namespace list` (or CI doc check) passes owner checklist TM-16. **Blocking:** missing binding name in wrangler for preview/prod paths used by QA. |
| iedl-be-01 | CI green: `web` unit + contract suite including updated IP limit (1/60s), daily cap 4th POST, BR-14 normalization, BR-12 increment rules, OpenAPI contract test vs `design/contracts/inquiry-api.openapi.yaml` v1.1. **Blocking:** any failing contract or security-tagged test; API returns wrong `error` enum on 429. |
| iedl-fe-01 | CI green: `inquiry-form.test.ts` daily vs IP classification; privacy page contains rate-limit paragraph (content snapshot or string test). **Blocking:** daily-limit API error shows IP burst copy; missing privacy disclosure text in code. |

## 3. Release tests
| Release point | End-to-end flows | Regression set | Non-functional checks |
|---|---|---|---|
| RP1 (iedl-devops-01 + iedl-be-01 + iedl-fe-01) | **W1 normal:** valid inquiry under cap → confirmation. **E8:** same normalized email 4th time same UTC day → daily-limit message, no success. **E9:** second POST same IP &lt;60s → burst message. **E1:** invalid email unchanged. Optional: `contact.spec.ts` with stubbed 429 bodies if stable. | Inquiry regression (§4); smoke: Home → Contact navigation still works (`site.spec.ts` / `contact.spec.ts` subset). | NFR-11 binding on preview Worker; fail-closed if KV missing (502/503, no uncapped send) — preview manual or integration; FR-11 owner approval recorded (D8) before prod. |

## 4. Regression set *(existing-repo)*
| Area from the impact analysis | Existing behavior that must not change | Test |
|---|---|---|
| Inquiry validation | BR-05 / FR-08 field errors, values retained | `inquiry.validation.test.ts`, contract 400 cases |
| Spam controls | BR-07 honeypot / Turnstile reject without delivery | `inquiry-turnstile.test.ts`, contract spam |
| Successful delivery | BR-06 / FR-07 under limits | `inquiry.contract.test.ts` happy path |
| OpenAPI shape | 400/502/200 shapes unchanged except 429 enum extension | Contract tests vs OpenAPI v1.1 |
| IP limit ordering | IP checked before body validation (abuse path) | Contract / handler unit (regression AC from impact §6) |
| Contact UI (non-error) | Form fields, submit flow, a11y labels | `inquiry-form.test.ts`; optional `contact.spec.ts` |
| Privacy / footer links | FR-11 link still present | Manual or existing e2e if present |
| Site-wide | No unrelated section breakage | `site.spec.ts` smoke (navigation, Contact reachable) |

## 5. Non-functional checks
| Requirement ID | Measure | Environment | Method |
|---|---|---|---|
| NFR-11 | Same email capped across Worker isolates (aggregate ≤3/day) | CI (mock store / mock KV) | Automated contract + store interface tests |
| NFR-11 | KV binding present at runtime | Cloudflare preview | Manual deploy smoke POST |
| NFR-06 | Spam not delivered; HTTPS only | CI | Existing contract + e2e |
| NFR-05 | No new backend beyond Worker + KV binding | Review | Architecture checklist at release |
| TM-15 | No plaintext email in KV | CI + S4.4 | Unit + security review |

- Untestable requirements (no measure):
| ID | Note |
|---|---|
| NFR-03, NFR-01, NFR-02 | Not materially changed by this request; no re-baseline performance/a11y gate for RP1 |
| O5 (qualified inquiry rate) | Business KPI; not validated in this release test |

## 6. Environments and data
| Environment | Used for | Test data |
|---|---|---|
| Local / CI (`vitest`) | Unit, contract, form classifier | Synthetic emails; mock `InquiryDailyLimitStore` / in-memory KV adapter; no Resend (mocked) |
| Cloudflare preview Worker | Slice check smoke (post devops + be) | Dedicated test emails; avoid owner inbox unless Resend test mode configured |
| Production | Release test after G7 only | Owner-approved smoke email; D8 privacy sign-off required |

## 7. Entry and exit criteria
- Entry (slice check / release test):
  - Slice check: PR merged to `release/inquiry-email-daily-limit`; CI pipeline `web-ci` green on merge commit.
  - Release test (RP1): All three slice parts merged and slice-checked; preview Worker has KV binding + pepper; D8 privacy approval recorded for prod.
- Exit: which failures are blocking; which may be accepted as known issues:
  - **Blocking:** Any failing material AC row in §1 for merged parts; regression failures in §4 inquiry path; KV missing in preview/prod (uncapped or fail-open); wrong visitor copy for daily vs IP limit; plaintext email in KV; missing FR-11 privacy text in build.
  - **Non-blocking (known):** Rare 4th delivery under KV race (TM-01 residual); IP burst not global across isolates (TM-12); flaky e2e contact stubs — quarantine with owner, do not waive product AC.

## 8. Out of scope
| Check | Why |
|---|---|
| Full WCAG audit on Contact | NFR-02 unchanged; inquiry copy change is spot-checked only |
| Load test of KV at scale | Low-traffic site; architect scale table §4 |
| Admin UI to reset counters | PRD §4 out of scope |
| Cal.com, analytics, other sections | Not touched by slice parts |
| Legal compliance sign-off of privacy | Owner/legal outside QA; QA verifies text presence and D8 record |