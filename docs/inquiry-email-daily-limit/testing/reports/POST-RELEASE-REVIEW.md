# Post-Release Review — inquiry-email-daily-limit (RP1)

## Metadata
- **Request summary:** `inquiry-email-daily-limit`
- **Release points and dates:** RP1 — production 2026-11-27 (`main` @ `c950a6e5`, deploy run 45929625224)
- **Observation windows:** Planned **48h** 2026-11-27T02:42:14Z → 2026-11-29T02:42:14Z — **closed early at human request** (S7.2 before end of S7.1)
- **Author:** devops (S7.2)

## 1. Outcomes versus success measures

| Measure (PRD §3 ID) | Target | Actual | Met? | Evidence |
|---|---|---|---|---|
| **O5** Qualified inquiries / abuse reduction | No numeric target (Q6); per-email cap supports abuse reduction | RP1 live on `https://oceanflows.net`; cap enforced in Worker + KV (CI); O5 monthly count not instrumented in-repo | **Partial (qualitative)** | PRD §3; `release/RELEASE-PLAN.md` S6.4/S7.1; no rollback triggers |
| **FR-15** 3/day per normalized email; distinct daily copy | Must | Implemented + contract/unit green; hosted **E8** (4th POST → `daily_limit_reached`) not executed in observation (Turnstile + inbox risk) | **Met (product)** / **Partial (hosted E8)** | `testing/reports/RP1.md`; S7.1 defers E8; S6.4 indirect KV health |
| **NFR-11** Cross-isolate daily cap | Must | KV binding deployed; probes no unexpected **502**; aggregate cap proven in CI mock store only | **Partial** | `inquiry.contract.test.ts`; S7.1 T0; live `POST {}` → 400 |
| **FR-11** Privacy disclosure for counters | Must | **Met** — production privacy includes “Inquiry rate limiting” | **Yes** | D8 Approve; curl/grep 2026-11-27; S6.4 |
| **FR-07** Delivery under cap | Must | **502** transient at S5.1; **human confirmed fixed** (secrets/config) | **Yes (after fix)** | `DEFECT-IEDL-PROD-502.md`; human close 2026-11-27 |
| **BR-13** IP 1/min burst | Must | **429** `rate_limited` observed prod (S5.1, S6.4, S7.1) | **Yes** | `S5.1-reported-wait-message.md`; RELEASE-PLAN S7.1 |

## 2. Health

| Signal | Result over the window | Evidence |
|---|---|---|
| Site availability | **OK** (through early close) | S7.1 T0; S7.2 curl `GET /` → 200 |
| Privacy / FR-11 | **OK** | `GET /privacy/` → 200; “Inquiry rate limiting” present |
| Inquiry API reachability | **OK** | `POST /api/inquiry` `{}` → 400 `validation_failed` |
| Unexpected 5xx / KV misconfig | **OK** after 502 fix | No sustained 5xx; S7.1; DEFECT-IEDL-PROD-502 closed |
| Rollback exercised | **No** | RELEASE-PLAN rollback criteria not met |

## 3. Incidents, defects, and rollbacks

| ID | What happened | Severity | Resolved? |
|---|---|---|---|
| **DEFECT-IEDL-PROD-502** | Prod `POST /api/inquiry` → **502** `delivery_failed` after IP cooldown (secrets/runtime config) | Important | **Yes** — human confirmed fixed 2026-11-27 |
| S5.1 “Please wait a moment” | **429** IP burst UX after QA probes; distinct from 502 | Non-blocking | Understood (BR-13) |
| — | No incidents opened; no rollback | — | — |

## 4. What worked and what failed

| Finding | Evidence |
|---|---|
| **Worked:** Single RP1 production deploy; KV guard + privacy + API probes green | S6.4; S7.1; S7.2 live checks |
| **Worked:** G6/G7 residuals (TM-01, TM-12, preview_id) accepted; no Sev-1 | G7 package; TEST-PLAN |
| **Worked:** 502 delivery defect closed with owner config fix (no code change) | DEFECT-IEDL-PROD-502 |
| **Gap:** Hosted NFR-11 **E8** (3 then 4th email) not run in observation | S7.1, S6.4 — requires Turnstile + disposable emails |
| **Gap:** O5 monthly KPI not measured in-repo post-release | PRD Q6 open |

## 5. Follow-ups

| Follow-up | Kind | Severity | Owner |
|---|---|---|---|
| Optional hosted E8 smoke (3 + 4th email → `daily_limit_reached`) with Turnstile + disposable email | debt | Non-blocking | qa + human |
| Monitor TM-01/TM-12 (KV race, IP across isolates) post-release | debt | Non-blocking | architect |
| Periodic Resend/Worker secret health check (FR-07) | fix | Non-blocking | human (owner) |
| Replace `preview_id` placeholder when second KV namespace needed | debt | Non-blocking | devops |
| O5 qualified-inquiry counting / analytics (if numeric target set in §11) | enhancement | Non-blocking | requirements-analyst → next cycle |

## 6. Recommendation for G8

- **Close the cycle** | Close with new work | Corrective work: **none required for RP1 scope**
- Why: Production RP1 is healthy after human-closed 502; PRD Must requirements are met in product and privacy; residuals are documented Non-blocking follow-ups. Human requested early close of the 48h observation window.

**G8 recommendation:** **Approve** — close request `inquiry-email-daily-limit` and route optional follow-ups through S7.4 / new requests as listed above.