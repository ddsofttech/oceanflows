# Release Plan

Request: `inquiry-email-daily-limit`. One section per release point, newest first.

---

## Release point RP1

- **Slice parts included:** `iedl-devops-01`, `iedl-be-01`, `iedl-fe-01`
- **Release candidate (commit or build):** `06c560692756eaba76ae01e484cd239ecda3aee3` (release branch tip; integrated feature merges: devops `c7053160` + be `9cf0660a` + fe `bf98188b` via PR #15/#16/#17)
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
  - **H1** — Hosted KV namespace IDs + `INQUIRY_LIMIT_HASH_PEPPER` not provisioned; NFR-11 / TM-16 manual checks deferred (Important, environment).
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

- **Date:** 2026-11-26 (UTC)
- **Target:** Hosted preview or production Worker with RP1 RC — **not reached**
- **Method attempted:** Release plan + `ENVIRONMENTS.md` review; `CHECK_PRODUCTION_ENV=1 npm run check:production-wrangler-kv` on release branch; local `vitest` inquiry suites; no `CLOUDFLARE_API_TOKEN` / account credentials in agent environment; production URL probe not authorized in this session.
- **Result:** **Staging verification — blocked (H1)**. **Partial** corroboration from CI/QA/local only.

**Evidence:**

| Check | Result | Evidence |
|---|---|---|
| Production deploy pipeline runnable @ RC | **blocked** | `check:production-wrangler-kv` exit **1**: `INQUIRY_DAILY_LIMIT: production KV namespace id must be replaced (not a placeholder)` @ `06c56069` |
| `CLOUDFLARE_API_TOKEN` for preview deploy | **blocked** | Env unset; BOARD H1 |
| NFR-11 — KV binding + pepper on hosted Worker | **not run** | Requires H1 |
| E8/E9/W1 — hosted daily + burst + happy path | **not run** | Requires hosted Worker + optional Resend secrets |
| Fail-closed missing pepper on hosted | **not run** | Contract-tested in CI; QA `testing/reports/RP1.md` |
| CI on merged PRs #15–#17 | **pass** | `gh pr checks 17` — all gates pass (incl. unit, contract, playwright-smoke) |
| Inquiry regression (local @ RC) | **pass** | `npm run test -- --run tests/unit/inquiry*.test.ts` — 7 files, **44/44** @ 2026-11-26 |
| QA release test (local/CI) | **pass** | `testing/reports/RP1.md` — 55 vitest, 18/18 e2e subset; no product defects |

**S6.2 outcome:** **Blocked** for hosted staging (daily-limit path unproven on Cloudflare). **Partial:** automated product evidence green; environment H1 prevents deploy and manual NFR-11.

### Staging checklist

Mapped to RP1 material ACs; hosted column **blocked** until H1 (2026-11-26).

| Check (smoke set mapped to AC IDs) | Result | Evidence |
|---|---|---|
| NFR-11 — `INQUIRY_DAILY_LIMIT` bound at runtime | **blocked** | H1; `wrangler.toml` placeholders |
| TM-16 — dedicated KV namespaces + scoped token | **blocked** | H1; `wrangler kv namespace list` not run |
| BR-10 / FR-15 — 4th email → `daily_limit_reached` | **pass (CI)** | `inquiry.contract.test.ts`; not hosted |
| BR-13 — 2nd IP &lt;60s → `rate_limited` | **pass (CI)** | Contract + rate-limit tests |
| BR-12 — increment rules; fail-closed store errors | **pass (CI)** | Contract; missing pepper → 502 in tests |
| FR-08 / FR-15 — distinct daily vs burst copy | **pass (CI)** | `inquiry-form.test.ts` + source |
| FR-11 — privacy disclosure present in build | **pass (CI)** | `privacy.astro` + e2e meta; **D8 sign-off pending** |
| FR-07 — inquiry delivery under cap | **pass (CI)** | Contract happy path; hosted Resend not run |
| Site smoke — Contact reachable | **pass (CI)** | QA Playwright subset |
| Production KV guard (D7) | **pass** | Placeholder `id` **blocks** prod deploy (intended) |

### Observation

- **Dashboards and alerts:** Cloudflare Worker `oceanflows-company-site` deploy status and errors; GitHub Actions `web-ci` + `web-deploy-production`; Worker observability (existing).
- **KPIs to watch (PRD §3 IDs):** **O5** — inquiry volume and qualification; watch for spike in **429** `daily_limit_reached` vs legitimate **502** from misconfig; **FR-15** reduces repeat-email abuse.
- **Observation window:** **48h** after **G7 Go** — **owner:** devops + human spot-check; **start/end:** set when D8 approves and S6.4 completes (not started — H1 blocks G7).

### Go decision (G7)

- **Approver(s) and date:** _(pending)_

**G7 package (S6.3 input):**

| Field | Value |
|---|---|
| **Recommendation** | **Hold** |
| **Staging (S6.2)** | **Blocked** (H1); partial CI/local only |
| **Rationale** | G6 D7 accepted RP1 code with known environment gaps. Product regression and contract coverage are green in QA and local vitest. Hosted daily-limit enforcement (NFR-11, fail-closed runtime, TM-16) cannot be proven until owner completes SETUP-GUIDES §A8 and devops reruns S6.2 deploy smoke. Production deploy correctly **refuses** placeholder KV `id`. D8 privacy sign-off still required before prod per TEST-PLAN §7. |
| **Blockers (must clear for Go)** | **H1:** Create KV namespaces; set real `id`/`preview_id` in `web/wrangler.toml`; set `INQUIRY_LIMIT_HASH_PEPPER` on Worker; devops hosted smoke (4th POST + pepper present). **D8:** Owner privacy approval recorded. **S6.2:** Hosted checklist rows for NFR-11/TM-16/E8/E9 **pass**. |
| **Residual (accepted at G6 — not waived)** | TM-01, TM-12; optional FR-07 live Resend on staging. |
| **On Approve (Go)** | Merge release branch if needed; `web-deploy-production` @ green KV guard; S6.4 confirm-only on `https://oceanflows.net`; start 48h observation (S7.1). |
| **On Hold** | Remain here until H1 + D8 + green S6.2 hosted evidence. |
| **On No-go** | Do not deploy; keep production on pre–RP1 Worker version. |

**G7 checklist for human:**

- [ ] H1: KV prod + preview namespaces created and IDs committed (no placeholders)
- [ ] H1: `INQUIRY_LIMIT_HASH_PEPPER` set on preview + production Worker
- [ ] devops: S6.2 staged — NFR-11 smoke POST (3 then 4th reject); burst 429; no uncapped 4th send
- [ ] D8: Privacy rate-limit paragraph approved
- [ ] Rollback steps acknowledged (Worker promote pre–RP1)
- [ ] Resend secrets confirmed if running full W1 on hosted (optional)

### Deploy record

| Environment | Date | Version | Result | Rollback run? |
|---|---|---|---|---|
| Staging / preview (RP1 RC) | 2026-11-26 | `06c56069` | **Not deployed** — H1 | — |
| Production | — | — | **Not requested** — no G7 Go | — |