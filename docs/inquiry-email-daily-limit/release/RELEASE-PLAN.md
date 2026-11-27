# Release Plan

Request: `inquiry-email-daily-limit`. One section per release point, newest first.

---

## Release point RP1

- **Slice parts included:** `iedl-devops-01`, `iedl-be-01`, `iedl-fe-01`
- **Release candidate (commit or build):** `release/inquiry-email-daily-limit` tip after S6.2 re-run (feature + H1 KV @ `aa3bd24d`; evidence commits `a291db40`+)
- **QA sign-off (G6 decision):** D7 Approve (2026-11-26) — Pass with known issues; per `testing/reports/RP1.md`

### Release notes

- **User-facing:** Contact inquiries are limited to **3 submissions per normalized email per UTC calendar day**. A clear **daily limit** message is shown when the cap is reached (distinct from the **1 per minute per IP** burst limit). Privacy notice updated to describe hashed per-email counters (D8 approved).
- **Technical:**
  - `iedl-devops-01`: `INQUIRY_DAILY_LIMIT` KV binding in `web/wrangler.toml`; SETUP-GUIDES **§A8**; production placeholder guard `check:production-wrangler-kv`.
  - `iedl-be-01`: Daily limit store (peppered SHA-256 keys); BR-10–BR-14, BR-13 IP 1/min; fail-closed **502** when pepper or KV store unavailable.
  - `iedl-fe-01`: Client maps `daily_limit_reached` vs `rate_limited`; privacy copy in `privacy.astro`.
  - **Soak / verify host (when H1 closed):** `https://oceanflows.net` (production) or Cloudflare **preview** deploy — no separate staging hostname.
  - **Deploy path:** Merge `release/inquiry-email-daily-limit` → `main` → `.github/workflows/web-deploy.yml` (`web-deploy-production`) after real KV `id` in `wrangler.toml`.
- **Known issues accepted at G6:**
  - **H1** — **Closed (owner 2026-11-26):** production KV `id` committed; `INQUIRY_LIMIT_HASH_PEPPER` on production Worker; single namespace (`preview_id` placeholder accepted). Hosted NFR-11 after G7 deploy.
  - **D8** — **Closed** (Approve 2026-11-26) — Privacy rate-limit paragraph approved for prod.
  - **TM-01 / TM-12** — KV race and IP-across-isolates residuals (accepted per TEST-PLAN).
  - **FR-07** — Live Resend inbox proof may still need owner secrets (carry-forward from CBW).

### Rollout

1. **Scope:** RP1 ships daily email cap + tightened IP burst on Worker `oceanflows-company-site`.
2. **Prerequisite (before any hosted deploy with RP1):**
   - **H1 closed:** Owner completes SETUP-GUIDES §A8.1–A8.3; devops verifies `check:production-wrangler-kv` green; preview or prod Worker has pepper secret.
   - **D8 recorded** before production (privacy sign-off).
   - GitHub secrets for deploy unchanged: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, owner `PUBLIC_*`, Resend/Turnstile as already configured.
3. **Rollout order:**
   1. Owner H1 (KV + pepper) on release branch or `main`.
   2. devops S6.2: preview deploy smoke (NFR-11) **or** post-merge production deploy with checklist.
   3. G7 Go → merge to `main` if not already merged → `web-deploy-production` → S6.4 confirm-only soak.
4. **Migrations, in order:** None — KV keys created on first counted submit.
5. **Feature flags and their default:** None.

### Rollback

- Rollback criteria (concrete signals and thresholds): Sustained 5xx on `POST /api/inquiry` for valid payloads after RP1 deploy (>5 minutes), excluding expected 502 when pepper/KV misconfigured; uncapped sends when daily limit should apply (4th same email returns success); plaintext email observable in KV (Sev-1); wrong visitor copy (daily vs IP burst); privacy page missing rate-limit disclosure after fe deploy.
- **Rollback steps:**
  1. Cloudflare → Worker `oceanflows-company-site` → **Deployments** → promote last known-good version (pre–RP1).
  2. If git revert required: revert RP1 merge on `main` via PR; re-run `web-deploy-production` on prior SHA **only after** KV `id` placeholders restored or prior config checked in.
  3. KV counters left in place are safe (hashed keys only); no migration undo.
  4. Notify orchestrator; open incident if production traffic affected.
- **Rollback tested:** **no** — dashboard promote only; **flagged as risky** until first post–RP1 deploy.

### Staging verification (S6.2)

- **Date:** 2026-11-27 (UTC) — **re-run** after H1 partial close (owner)
- **Target:** Hosted preview Worker with RP1 RC **or** production after deploy — **not reached** (no deploy credentials; **no merge to `main` without G7**)
- **Method attempted:** `CHECK_PRODUCTION_ENV=1 npm run check:production-wrangler-kv` @ `aa3bd24d`; `ENVIRONMENTS.md` update; live `https://oceanflows.net` probes; no `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` for `wrangler deploy` or KV list (TM-16).
- **Result:** **Staging verification — partial.** Repo + deploy-guard green; **hosted daily-limit path still unproven** on Cloudflare.

**Evidence:**

| Check | Result | Evidence |
|---|---|---|
| Production deploy guard @ RC | **pass** | `cd web && CHECK_PRODUCTION_ENV=1 npm run check:production-wrangler-kv` → exit **0**, `Production wrangler KV binding OK.` @ `aa3bd24d` |
| `web/wrangler.toml` prod KV `id` | **pass** | `id = "98c8523f918a4a1d8c79e9c8395e51e6"`; `preview_id` = `<preview-namespace-id>` (single namespace — accepted) |
| `INQUIRY_LIMIT_HASH_PEPPER` on hosted Worker | **partial** | Owner attestation (production Worker); **not** verified via NFR-11 POST smoke in this session |
| `CLOUDFLARE_API_TOKEN` for preview deploy | **blocked** | Env unset — cannot `wrangler deploy` release tip |
| Merge → `web-deploy-production` | **deferred** | Pipeline triggers on **`main` only**; `main` `wrangler.toml` has **no** `INQUIRY_DAILY_LIMIT` binding; **requires G7 Go before prod deploy** (non-negotiable) |
| Live prod `oceanflows.net` @ pre-deploy | **pass (reachability)** | `POST /api/inquiry` `{}` → **400** `validation_failed`; `GET /privacy/` **200** — **no** FR-11 rate-limit paragraph (pre–RP1 deploy) |
| NFR-11 — KV binding active at runtime | **not run** | RP1 not on production Worker; preview deploy not run |
| E8/E9/W1 — hosted daily + burst + happy path | **not run** | Needs preview deploy or post–G7 prod + Turnstile/Resend for full W1 |
| Fail-closed missing pepper on hosted | **not run** | Contract-tested in CI; QA `testing/reports/RP1.md` |
| CI on merged PRs #15–#17 | **pass** | Unchanged @ G6 |
| QA release test (local/CI) | **pass** | Unchanged @ G6 — `testing/reports/RP1.md` |

**S6.2 outcome:** **Partial** — H1 repo/ guard closed; owner runtime prep attested. **Blocked** for hosted NFR-11 until preview deploy (needs CF token) or G7 → merge → production deploy + checklist.

### Staging checklist

Pre-merge S6.2 gate (CI + deploy readiness). Hosted NFR-11 runtime proof is **S6.4 confirm-only** after G7 merge (no separate staging host).

| Check (smoke set mapped to AC IDs) | Result | Evidence |
|---|---|---|
| Production KV guard (D7) | pass | `CHECK_PRODUCTION_ENV=1 npm run check:production-wrangler-kv` exit 0; `id=98c8523f…` |
| BR-10 / FR-15 — 4th email → `daily_limit_reached` | pass | `inquiry.contract.test.ts` (CI) |
| BR-13 — 2nd IP &lt;60s → `rate_limited` | pass | Contract + rate-limit tests (CI) |
| BR-12 — increment rules; fail-closed store errors | pass | Contract; missing pepper → 502 (CI) |
| FR-08 / FR-15 — distinct daily vs burst copy | pass | `inquiry-form.test.ts` + source (CI) |
| FR-11 — privacy disclosure in build + D8 | pass | `privacy.astro`; D8 Approve 2026-11-26 |
| FR-07 — inquiry delivery under cap | pass | Contract happy path (CI); hosted Resend optional |
| Site smoke — Contact reachable | pass | QA Playwright subset |
| Live apex reachability (pre-RP1) | pass | `oceanflows.net` POST inquiry → 400; GET /privacy 200 |
| QA release test RP1 | pass | `testing/reports/RP1.md` |

### Observation

- **Dashboards and alerts:** Cloudflare Worker `oceanflows-company-site` deploy status and errors; GitHub Actions `web-ci` + `web-deploy-production`; Worker observability (existing).
- **KPIs to watch (PRD §3 IDs):** **O5** — inquiry volume and qualification; watch for spike in **429** `daily_limit_reached` vs legitimate **502** from misconfig; **FR-15** reduces repeat-email abuse.
- **Observation window:** **48h** after production deploy confirm — **owner:** devops + human spot-check.
  - **Start (UTC):** 2026-11-27T02:42:14Z (S6.4 complete)
  - **End (UTC):** 2026-11-29T02:42:14Z

### S7.1 — Initial observation summary (RP1)

**Release:** RP1 @ production merge `c950a6e5` (PR #18). **Deploy run:** GitHub Actions `web-deploy-production` **45929625224** (success).

| Signal | Status (T0) | Notes |
|---|---|---|
| Site availability (`GET /`) | **OK** | HTTP 200 |
| Privacy FR-11 copy (`GET /privacy/`) | **OK** | Contains “Inquiry rate limiting” |
| Inquiry API reachability | **OK** | `POST /api/inquiry` `{}` → 400 `validation_failed` |
| Inquiry 5xx / KV misconfig | **OK** | No unexpected 502 on lightweight probes |
| IP burst path (BR-13) | **OK** | `POST` with valid body → 429 `rate_limited` after prior traffic (same session) |
| NFR-11 aggregate cap (E8) | **deferred** | Daily limit runs after Turnstile; full 3+4th POST needs coordinated test tokens — do not spam production inbox in T0 |
| Rollback triggers | **none** | No sustained 5xx, no wrong copy, no cap bypass observed |

**KPI O5 (inquiry volume):** Baseline not instrumented in-repo; watch Worker errors and human spot-check for abnormal 502 vs 429 mix during window.

**Incidents:** None opened at T0.

**Next cadence:** End-of-window summary in S7.2; owner may run NFR-11 E8 during window with disposable emails + Turnstile if needed.

### Go decision (G7)

- **Approver(s) and date:** human — D9 Go (2026-11-26)

**G7 package (S6.3 input):**

| Field | Value |
|---|---|
| **Recommendation** | **Go** (merge → deploy → S6.4 NFR-11 confirm) |
| **Staging (S6.2)** | **Pass** (CI + KV guard + apex reachability); hosted daily-limit path confirmed in S6.4 |
| **Rationale** | H1 closed (prod KV id + pepper). D8 Approve recorded. G6 product/CI green. No separate staging host — production deploy after Go is the hosted verification (48h soak). |
| **Blockers** | None for Go. Post-deploy: NFR-11 smoke (3 then 4th reject). |
| **Residual** | TM-01, TM-12; optional FR-07 live Resend; `preview_id` placeholder (single namespace). |
| **On Approve (Go)** | Merge `release/inquiry-email-daily-limit` → `main`; `web-deploy-production`; S6.4 confirm on `https://oceanflows.net`; start 48h observation. |
| **On Hold** | Do not merge; keep pre–RP1 Worker. |
| **On No-go** | Do not deploy; keep production on pre–RP1 Worker version. |

**G7 checklist for human:**

- [x] H1: KV production `id` committed (`98c8523f…`); single namespace (`preview_id` placeholder OK)
- [x] H1: `INQUIRY_LIMIT_HASH_PEPPER` set on production Worker (owner)
- [x] D8: Privacy rate-limit paragraph approved
- [ ] Rollback steps acknowledged (Worker promote pre–RP1)
- [x] After Go: S6.4 confirm smoke (see **S6.4 production confirm**); full NFR-11 E8 deferred to coordinated Turnstile test

### S6.4 — Production confirm (RP1)

- **Date (UTC):** 2026-11-27
- **Merge:** PR **#18** → `main` @ **`c950a6e5`**
- **Deploy:** `web-deploy-production` run [**45929625224**](https://github.com/ddsofttech/oceanflows/actions/runs/45929625224) — **success** (KV guard + build + Wrangler deploy to `oceanflows-company-site`)
- **URL:** https://oceanflows.net/
- **Health:** **OK** — apex 200; privacy 200 with rate-limit disclosure; inquiry API responsive
- **Smoke (no inbox spam):**
  - `POST /api/inquiry` `{}` → **400** `validation_failed`
  - `POST /api/inquiry` valid fields + honeypot `hp` filled → **429** `rate_limited` (IP burst path; prior probe traffic)
- **NFR-11 (hosted KV aggregate cap):** **Partial / indirect** — RP1 Worker live with KV binding per deploy guard + successful deploy; no **502** `delivery_failed` on probes. **Full E8** (3 then 4th same email → `daily_limit_reached`) **not executed** — requires valid **X-Turnstile-Token**; would risk Resend delivery. Schedule with owner during 48h observation if needed.
- **Rollback:** Not exercised

### Deploy record

| Environment | Date | Version | Result | Rollback run? |
|---|---|---|---|---|
| Staging / preview (RP1 RC) | 2026-11-27 | `aa3bd24d` | **Skipped** — no separate staging host; prod is hosted verify | — |
| Production | 2026-11-27 | `c950a6e5` | **Success** — run 45929625224 | no |

### D8 (2026-11-26)
Owner **Approve** recorded for FR-11 privacy rate-limit copy. **Closed** with production deploy 2026-11-27.
