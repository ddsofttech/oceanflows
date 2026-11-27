# Release Plan

Request: `inquiry-email-daily-limit`. One section per release point, newest first.

---

## Release point RP1

- **Slice parts included:** `iedl-devops-01`, `iedl-be-01`, `iedl-fe-01`
- **Release candidate (commit or build):** `9bede8424940f186e8437f9be3ba814f7cd0c4c2` (release branch tip incl. S6.2 evidence; feature + H1 KV @ `aa3bd24d`)
- **QA sign-off (G6 decision):** D7 Approve (2026-11-26) — Pass with known issues; per `testing/reports/RP1.md`

### Release notes

- **User-facing:** Contact inquiries are limited to **3 submissions per normalized email per UTC calendar day**. A clear **daily limit** message is shown when the cap is reached (distinct from the **1 per minute per IP** burst limit). Privacy notice updated to describe hashed per-email counters (subject to owner D8 sign-off).
- **Technical:**
  - `iedl-devops-01`: `INQUIRY_DAILY_LIMIT` KV binding in `web/wrangler.toml`; SETUP-GUIDES **§A8**; production placeholder guard `check:production-wrangler-kv`.
  - `iedl-be-01`: Daily limit store (peppered SHA-256 keys); BR-10–BR-14, BR-13 IP 1/min; fail-closed **502** when pepper or KV store unavailable.
  - `iedl-fe-01`: Client maps `daily_limit_reached` vs `rate_limited`; privacy copy in `privacy.astro`.
  - **Soak / verify host (when H1 closed):** `https://oceanflows.net` (production) or Cloudflare **preview** deploy — no separate staging hostname.
  - **Deploy path:** Merge `release/inquiry-email-daily-limit` → `main` → `.github/workflows/web-deploy.yml` (`web-deploy-production`) after real KV `id` in `wrangler.toml`.
- **Known issues accepted at G6:**
  - **H1** — **Partially closed (owner 2026-11-26):** production KV `id` committed; `INQUIRY_LIMIT_HASH_PEPPER` on production Worker; single namespace ( `preview_id` placeholder accepted). **Open:** hosted NFR-11 / TM-16 smoke; RP1 not deployed to `oceanflows.net` until merge + G7.
  - **D8** — Privacy rate-limit paragraph not owner-signed for prod (Non-blocking at G6; **blocking at G7**).
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

- **Rollback criteria (concrete signals and thresholds):**
  - Sustained **5xx** on `POST /api/inquiry` for valid payloads after RP1 deploy (>5 minutes), excluding expected **502** when H1 misconfigured;
  - Uncapped sends when daily limit should apply (4th same email returns success);
  - Plaintext email observable in KV (incident — Sev-1 route);
  - Wrong visitor copy (daily cap shows IP burst message or vice versa) on Contact;
  - Privacy page missing rate-limit disclosure after fe deploy.
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

Mapped to RP1 material ACs; hosted column **blocked** until preview/prod deploy (2026-11-27).

| Check (smoke set mapped to AC IDs) | Result | Evidence |
|---|---|---|
| NFR-11 — `INQUIRY_DAILY_LIMIT` bound at runtime | **blocked** | No hosted deploy; prod Worker pre–RP1 |
| TM-16 — dedicated KV namespaces + scoped token | **blocked** | `wrangler kv namespace list` not run (no API token) |
| BR-10 / FR-15 — 4th email → `daily_limit_reached` | **pass (CI)** | `inquiry.contract.test.ts`; not hosted |
| BR-13 — 2nd IP &lt;60s → `rate_limited` | **pass (CI)** | Contract + rate-limit tests |
| BR-12 — increment rules; fail-closed store errors | **pass (CI)** | Contract; missing pepper → 502 in tests |
| FR-08 / FR-15 — distinct daily vs burst copy | **pass (CI)** | `inquiry-form.test.ts` + source |
| FR-11 — privacy disclosure present in build | **pass (CI)** | `privacy.astro` + e2e meta; **D8 sign-off pending** |
| FR-07 — inquiry delivery under cap | **pass (CI)** | Contract happy path; hosted Resend not run |
| Site smoke — Contact reachable | **pass (CI)** | QA Playwright subset |
| Production KV guard (D7) | **pass** | Real prod `id` **allows** deploy pipeline guard; merge still gated by G7 |

### Observation

- **Dashboards and alerts:** Cloudflare Worker `oceanflows-company-site` deploy status and errors; GitHub Actions `web-ci` + `web-deploy-production`; Worker observability (existing).
- **KPIs to watch (PRD §3 IDs):** **O5** — inquiry volume and qualification; watch for spike in **429** `daily_limit_reached` vs legitimate **502** from misconfig; **FR-15** reduces repeat-email abuse.
- **Observation window:** **48h** after **G7 Go** — **owner:** devops + human spot-check; **start/end:** set when D8 approves and S6.4 completes (not started — D8 + hosted S6.2 block G7).

### Go decision (G7)

- **Approver(s) and date:** _(pending)_

**G7 package (S6.3 input):**

| Field | Value |
|---|---|
| **Recommendation** | **Hold** |
| **Staging (S6.2)** | **Partial** — guard green; hosted NFR-11 not run |
| **Rationale** | H1 **partially closed:** prod KV `id` in git, deploy guard pass, owner pepper on Worker. RP1 is **not** live on `oceanflows.net` (`main` undeployed). Without CF credentials, devops could not preview-deploy release tip; merge/deploy to production remains **post–G7** only. **D8** not in `DECISION-LOG.md` (Next ID still D8). G6 product/CI evidence unchanged. |
| **Blockers (must clear for Go)** | **S6.2:** Hosted NFR-11 (+ optional E8/E9) **pass** — preview deploy from release tip or post-merge prod smoke. **D8:** Owner privacy approval row in DECISION-LOG. **TM-16:** Optional `wrangler kv namespace list` when token available. **H1 residual:** Acceptable if smoke proves binding + pepper. |
| **Residual (accepted at G6 — not waived)** | TM-01, TM-12; optional FR-07 live Resend on staging; `preview_id` placeholder. |
| **On Approve (Go)** | Merge `release/inquiry-email-daily-limit` → `main`; `web-deploy-production` @ release tip; S6.4 confirm-only on `https://oceanflows.net`; start 48h observation (S7.1). |
| **On Hold** | Remain here until **D8** + hosted S6.2 checklist (NFR-11 minimum). |
| **On No-go** | Do not deploy; keep production on pre–RP1 Worker version. |

**G7 checklist for human:**

- [x] H1: KV production `id` committed (`98c8523f…`); single namespace (`preview_id` placeholder OK)
- [x] H1: `INQUIRY_LIMIT_HASH_PEPPER` set on production Worker (owner; verify via NFR-11 smoke)
- [ ] devops: S6.2 staged — NFR-11 smoke POST (3 then 4th reject); burst 429; no uncapped 4th send
- [ ] D8: Privacy rate-limit paragraph approved
- [ ] Rollback steps acknowledged (Worker promote pre–RP1)
- [ ] Resend secrets confirmed if running full W1 on hosted (optional)

### Deploy record

| Environment | Date | Version | Result | Rollback run? |
|---|---|---|---|---|
| Staging / preview (RP1 RC) | 2026-11-27 | `aa3bd24d` | **Not deployed** — no CF token; await G7 or owner preview deploy | — |
| Production | — | — | **Not requested** — no G7 Go | — |