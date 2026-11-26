# Release Plan

Request: `company-branding-website`. One section per release point, newest first.

---

## Release point RP1

- **Slice parts included:** `cbw-fe-01`, `cbw-be-01`, `cbw-fe-02`, `cbw-fe-03`
- **Release candidate (commit or build):** `8f974c6089fc60cbf57384e4bb2c4ee1caa4e363` (PR #6 merge to `ux/company-branding-website`)
- **QA sign-off (G6 decision):** D20 Approve (2026-11-25) — “live URL: oceanflows.net, approve G6” per human; QA package `testing/reports/RP1.md`

### Release notes

- **User-facing:** Full marketing site (Home, Services, Approach, About, Contact), inquiry form, privacy page, custom 404, booking link when configured.
- **Technical:**
  - Astro 5 on `@astrojs/cloudflare`; inquiry API via Worker runtime; CI `web-ci` on feature merges.
  - Hosted target **accepted at G6:** `https://oceanflows.net` (production custom domain used as RP1 soak host; RP2 still covers analytics, placeholder guard, and formal production sign-off per IMPLEMENTATION-PLAN).
  - Deploy path: Cloudflare **Worker application** `oceanflows-company-site` (Workers Builds / `npx wrangler deploy`); see `delivery/CLOUDFLARE-PAGES-SETUP.md`.
- **Known issues accepted at G6:** SR-01 (rate-limit residual), SR-02 (subject CRLF), FR-07/Resend live inbox not proven in QA, owner content sign-off gaps (FR-03/05/NFR-07), G3 waivers — per `testing/reports/RP1.md`.

### Rollout

1. **Scope:** RP1 engineering release on hosted URL `https://oceanflows.net` (same host as future RP2; no separate “preview-only” domain).
2. **Prerequisite (G6 / H2):** GitHub secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` set; Worker Builds or Wrangler deploy from `ux/company-branding-website`.
3. **Already completed (G6 evidence):** All four RP1 parts merged; integrated RC `8f974c60` — merge CI [45708536952](https://github.com/ddsofttech/oceanflows/actions/runs/45708536952) success; QA 25/25 unit, 17/17 Playwright on local build.
4. **S6.2 devops verify:** See staging section below — **Pass** (2026-11-26 UTC rerun after D22 DNS fix).
5. **Migrations, in order:** None.
6. **Feature flags and their default:** None; placeholder guard via build/env (full production guard in RP2 / `cbw-devops-02`).

### Rollback

- Rollback criteria (concrete signals and thresholds): Home or contact section returns 5xx for more than 5 minutes after an RP1 deploy; browser certificate error on apex; inquiry API sustained 5xx on valid submissions; or axe serious or critical regression on home, privacy, 404, or contact after deploy.
  - Home or `/contact` returns 5xx for >5 minutes after a deploy attributed to RP1 RC; or
  - HTTPS not enforced (browser shows certificate error on apex); or
  - Inquiry API returns sustained 5xx on valid submissions during soak; or
  - Regression vs QA axe serious/critical on home/privacy/404/contact after deploy.
- **Rollback steps:**
  1. Cloudflare dashboard → Worker `oceanflows-company-site` → **Deployments** → promote previous active version (or Workers Builds rollback).
  2. If bad release came from GitHub Action `web-deploy-production`, re-run prior successful workflow or revert merge on integration branch and redeploy.
  3. If DNS/custom-domain misconfiguration: detach/repair custom hostname in Worker **Settings → Domains & Routes**; do not patch app code outside PR process.
  4. Notify orchestrator; record incident if production traffic impacted (RP1 soak on live domain).
- **Rollback tested:** **no** — dashboard rollback only; acceptable for RP1 soak. Pointer: Rollback section above (Worker deployment promote).

### Staging verification (S6.2)

- **Date:** 2026-11-26 (UTC rerun; prior 2026-11-25 attempt **Fail** on DNS — superseded)
- **Target URL:** `https://oceanflows.net`
- **Method:** `dig @1.1.1.1` + `dig +trace`; `curl` with browser User-Agent; TLS cert inspect via `openssl s_client`. No deploy performed this step — verify only (D22: DNS/custom domain fixed).
- **Result:** **Staging verification — Pass** (apex reachable; HTTPS and RP1 smoke checklist green).

**Evidence (authoritative for S6.2):**

| Check | Result | Evidence |
|---|---|---|
| DNS apex `oceanflows.net` | **pass** | `A` → `104.21.8.238`, `172.67.158.30`; `AAAA` → Cloudflare anycast; `dig +trace` returns signed A at `terin.ns.cloudflare.com` |
| DNS `www.oceanflows.net` | **N/A** | No `A`/`CNAME` at `@1.1.1.1`; custom `www` not configured on Worker — out of RP1 apex scope |
| HTTPS home | **pass** | `curl https://oceanflows.net/` → **HTTP 200**, `ssl_verify_result=0`; cert `CN=oceanflows.net`, Google Trust Services, valid 2026-11-25 → 2027-02-23 |
| `/privacy` | **pass** | **HTTP 200**; HTML title “Privacy notice — DD Software Solutions Inc.” |
| Smoke 404 | **pass** | `GET /does-not-exist-rp1-smoke` → **HTTP 404**; custom 404 page with `primary-nav` links |
| Contact / inquiry API | **pass** | Home `#contact` includes `data-inquiry-form` + `POST /api/inquiry` → **HTTP 400** on empty JSON (handler reachable; not live send) |
| HTTP apex (note) | **pass with note** | `http://oceanflows.net/` returns **200** without redirect; **HTTPS works** (NFR-06 for RP1). Full HTTP→HTTPS enforce deferred to RP2 / `cbw-devops-02` |
| QA RC build (corroborating) | **pass** | `testing/reports/RP1.md` @ `8f974c60` — 17/17 e2e, merge CI green |

### Staging checklist

Mapped to PRD / TEST-PLAN RP1 smoke; **hosted column green** (2026-11-26).

| Check (smoke set mapped to AC IDs) | Result | Evidence |
|---|---|---|
| NFR-06 — HTTPS on home | pass | TLS 200 on `https://oceanflows.net/` |
| FR-01–05 — home loads marketing content | pass | 200; marketing title and section anchors in HTML |
| FR-12 — unknown URL shows 404 + nav | pass | 404 on `/does-not-exist-rp1-smoke`; nav present |
| FR-11 — `/privacy` loads | pass | 200 |
| FR-06–08 — contact form present on site | pass | Inquiry form on home; `/api/inquiry` responds 400 (validation) |
| NFR-05 — Cloudflare Worker host | pass | Apex on Cloudflare anycast; Worker `oceanflows-company-site` (owner deploy) |
| TM-04 — no secrets in deploy artifact | pass — CI gate | `gate / secrets` on merge CI |
| Playwright integrated (local build) | pass | QA / RC `8f974c60` |

**S6.2 outcome:** **Pass** — hosted staging green after D22 DNS fix. **Non-blocking:** `www` hostname not published; HTTP not forced to HTTPS until RP2.

### Observation

- **Dashboards and alerts:** Cloudflare Worker `oceanflows-company-site` build/deploy status; GitHub Actions `web-ci` on `ux/company-branding-website`; optional Worker analytics after RP2 (`cbw-fe-04`).
- **KPIs to watch (PRD §3 IDs):** O5 inquiry/booking counts — site reachable; live Resend delivery still not proven in QA (FR-07); O1–O4 owner content review still pending.
- **Observation window:** **48h soak** after **G7 Go (D23)** — **start:** `2026-11-26T02:45:00Z` (aligned to D23 2026-11-25); **end:** `2026-11-28T02:45:00Z`; **owner:** `devops` + human spot-check; **status:** **started** (S7.1 initial snapshot below).
- **S7.1 initial snapshot (2026-11-26T02:46:00Z):** Release **RP1** @ RC `8f974c60`. Reachability from devops host (`curl`, browser UA): `https://oceanflows.net/` → **HTTP 200**, TLS verify **0**; `https://oceanflows.net/privacy` → **HTTP 307** → `https://oceanflows.net/privacy/` **HTTP 200**, TLS verify **0**. No error-rate or latency baseline beyond response-time ~0.5s on home. **Incidents:** none.

### Go decision (G7) — RP1 release target

RP1 uses G7 to **accept `https://oceanflows.net` as the RP1 release host** and mark RP1 **Released** (not RP2 production go-live; formal production guard remains RP2 / `cbw-devops-02`).

**G7 package (S6.3 input):**

| Field | Value |
|---|---|
| **Recommendation** | **Go** |
| **Staging (S6.2)** | **Pass** (2026-11-26 UTC) |
| **Rationale** | D22 closed H3 (DNS/custom domain fixed). Devops reran S6.2: apex resolves to Cloudflare; **HTTPS 200** on home; `/privacy` **200**; smoke path **404** with nav; inquiry form on home and **`POST /api/inquiry` reachable** (400 on empty body). Rollback plan recorded above (Worker deployment promote). G6 D20 + QA RC `8f974c60` unchanged. RP1 G7 **accepts `https://oceanflows.net` as RP1 release host** — not RP2 formal production guard (`cbw-devops-02`). |
| **Residual (non-blocking at G7)** | `www` not in DNS; HTTP serves 200 without redirect (HTTPS enforce in RP2); live Resend inbox not proven (FR-07); G6-known SR-01/02 and content waivers. |
| **On Approve (Go)** | Orchestrator marks RP1 **Released**; start 48h observation; proceed RP2 parts. **No S6.4 prod deploy** for RP1. |
| **On Hold** | New environment regression (5xx, cert error, DNS loss) — devops reruns S6.2 and refreshes this package. |
| **On No-go** | Revert Worker deploy per Rollback section; park RP1 public hostname until RC reconfirmed. |

- **G7 decision:** **Go** — **D23** (2026-11-25), **Duong** — accept `https://oceanflows.net` as RP1 release host; mark RP1 **Released**; start 48h observation; no S6.4 for RP1 (formal prod = RP2 / `cbw-devops-02`). Verbatim archive: `decisions/RP1.md`.

**Rollback plan pointer:** RP1 → Rollback subsection above (Worker `oceanflows-company-site` → promote previous deployment; DNS repair in Worker Domains & Routes if misconfigured).

### Deploy record

| Environment | Date | Version | Result | Rollback run? |
|---|---|---|---|---|
| Cloudflare Worker (live apex) | 2026-11-25+ (owner) | `8f974c60` (RC) | **Verified** by devops S6.2 — site serves at `https://oceanflows.net` | N/A |
| Staging verify (S6.2) | 2026-11-26 | `8f974c60` | **Pass** — DNS + smoke checklist | N/A |
| Staging verify (S6.2 prior) | 2026-11-25 | `8f974c60` | **Fail** — DNS NXDOMAIN (superseded) | N/A |
| Production (RP2 / G7 prod) | — | — | **Not in scope for RP1** | N/A |

### Release status

| Field | Value |
|---|---|
| S6.1 | Complete — this section |
| S6.2 | Complete — **Pass** (hosted); evidence 2026-11-26 |
| S6.3 / G7 | **Complete** — **Go** (D23, Duong, 2026-11-25); RP1 **Released** on `https://oceanflows.net` |
| S6.4 production | **Not requested** (RP2) |
| S7.1 observation | **In progress** — window `2026-11-26T02:45:00Z` → `2026-11-28T02:45:00Z` |
| **Board: release status** | **Released** (RP1) — orchestrator synced per D23 |

---

## Release point RP0

- **Slice parts included:** `cbw-devops-01` (platform scaffold + CI)
- **Release candidate (commit or build):** `05ec0c5b75b6cfc66a27eaf3274f1422f53d28a0` (PR #1 merge to `ux/company-branding-website`)
- **QA sign-off (G6 decision):** D18 Approve (2026-11-25) — scaffold/CI pass per `testing/reports/RP0.md`

### Release notes

- **User-facing:** None. RP0 is an internal platform gate; visitors do not receive new marketing content.
- **Technical:**
  - Adds `web/` Astro 5 scaffold with `@astrojs/cloudflare`, `wrangler.toml`, env examples, placeholder guard script.
  - Adds `.github/workflows/web-ci.yml` (engineering-standard PR gates) and `web-deploy.yml` (production deploy workflow; secrets not yet wired).
  - Documents Cloudflare setup in `docs/company-branding-website/delivery/CLOUDFLARE-PAGES-SETUP.md`.
- **Known issues accepted at G6:** None (Important/Blocking). Open **environment handoff H2**: Cloudflare Pages project / API credentials not yet provisioned by owner — does not block RP0 closure; blocks hosted preview deploy and RP1 staging soak on Cloudflare.

### Rollout

1. **Scope:** Git-only + CI. No production or customer-facing URL for RP0.
2. **Already completed (G6 evidence):** Merge `cbw-devops-01`; verify `web-ci` success on RC `05ec0c5` ([run 45694850445](https://github.com/ddsofttech/oceanflows/actions/runs/45694850445)).
3. **Optional (blocked on H2):** First Cloudflare Pages preview or project-linked build — owner completes `delivery/CLOUDFLARE-PAGES-SETUP.md` and GitHub secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (or dashboard Git integration). **Not required to mark RP0 released.**
4. **Migrations, in order:** None.
5. **Feature flags and their default:** None.

### Rollback

- **Rollback criteria (concrete signals and thresholds):**
  - `web-ci` required checks fail on two consecutive merges to the integration branch without a fix within one business day; or
  - Scaffold build breaks all feature PRs (e.g. `npm run build` fails on `web/` at RC); or
  - Security gate (`gate / secrets`) reports a leaked credential in repo history.
- **Rollback steps:**
  1. Revert merge commit `05ec0c5` (or offending follow-up) on `ux/company-branding-website` via PR.
  2. Disable or pause `web-ci` workflow if pipeline itself is faulty (`.github/workflows/web-ci.yml`).
  3. If `web-deploy.yml` was wired with secrets and a bad deploy occurred (RP0+ only): roll back Pages deployment in Cloudflare dashboard to prior deployment — **N/A for RP0** (no deploy executed).
  4. Notify orchestrator; reopen RP0 only if platform gate must be re-established.
- **Rollback tested:** **no** (git revert only; low risk). Flagged as acceptable for RP0 — no live traffic.

### Staging verification (S6.2)

- **Date:** 2026-11-25
- **Method:** CI-only close-out (no hosted deploy). Staging = GitHub Actions `web-ci` on integration branch at RC `05ec0c5`.
- **Result:** **Staging verified** for RP0 platform gate — all applicable checks **pass**.
- **Hosted staging URL:** **N/A until H2** (Cloudflare Pages preview not provisioned; required for RP1+, not RP0).

**Evidence (authoritative):**

| Field | Value |
|---|---|
| Workflow | `web-ci` |
| Run | [45694850445](https://github.com/ddsofttech/oceanflows/actions/runs/45694850445) |
| `headSha` | `05ec0c5b75b6cfc66a27eaf3274f1422f53d28a0` |
| `conclusion` | `success` |
| Trigger | Merge PR #1 → `ux/company-branding-website` |
| QA cross-ref | `testing/reports/RP0.md` (G6 D18) |

### Staging checklist

RP0 staging target = **integration branch CI**; hosted preview **out of scope** until H2 closes. Per IMPLEMENTATION-PLAN, RP0 deliverable is “CI green on empty `web/`”.

| Check (smoke set mapped to AC IDs) | Result | Evidence |
|---|---|---|
| NFR-05 — JAMstack scaffold, Cloudflare adapter, no DB/CMS | **pass** | QA S5.2; `web/` at `05ec0c5` |
| PR pipeline — ENGINEERING-STANDARDS §9 gates | **pass** | Run 45694850445 — format, lint, types, duplication, unused, dependency-audit, sast, unit-tests, stylelint, ui-catalog, sdlc-process |
| TM-04 — no secrets in diff/repo | **pass** | `gate / secrets` — success |
| Playwright smoke — scaffold page loads + axe | **pass** | `gate / playwright-smoke` — success |
| Build placeholders — no `[TOKEN]` in `dist/` | **pass** | `gate / build-placeholders` — success |
| Change-size (PR-only) | **skipped** | Expected on merge push |
| Cloudflare Pages preview deploy (smoke URL) | **N/A** | **H2 open** — not required for RP0; first URL check deferred to RP1 staging |
| Hosted staging health check | **N/A** | No URL; CI smoke substitutes for RP0 |

**S6.2 outcome:** Platform gate staging **verified**. No product deploy performed. No G7 package prepared (RP0).

### Observation

- **Dashboards and alerts:** GitHub Actions `web-ci` status on `ux/company-branding-website` and feature PRs; optional Wrangler/Pages dashboard after H2 (RP1+).
- **KPIs to watch (PRD §3 IDs):** **N/A** for RP0 — no user traffic or business KPIs.
- **Observation window:** 2026-11-25 → 2026-11-27 (48h), **owner:** `devops` — monitor first feature PRs post-RP0 for CI stability; no production on-call.

### Go decision (G7)

- **RP0 does not use G7.** G7 (**Approve Go**) applies to **production** release (implementation plan **RP2** / `cbw-devops-02` live domain). RP0 is signed off at **G6** (D18); closure is **engineering release** of the platform gate, not a go-live.
- **Approvers and date:** G7 — **skipped (N/A)** for RP0.

### Deploy record

| Environment | Date | Version | Result | Rollback run? |
|---|---|---|---|---|
| Git / CI (`ux/company-branding-website`) | 2026-11-25 | `05ec0c5` | Success — `web-ci` run 45694850445 | N/A |
| Staging (S6.2 verify) | 2026-11-25 | `05ec0c5` | **Verified** — CI checklist complete; no hosted URL | N/A |
| Cloudflare Pages (preview / staging) | — | — | **Not deployed** — H2 open; URL **N/A** until owner completes setup | N/A |
| Cloudflare Pages (production) | — | — | **Not in scope for RP0** | N/A |

### Release status

| Field | Value |
|---|---|
| S6.1 | Complete — this release plan |
| S6.2 | Complete — staging verified (CI evidence only) |
| S6.3 / G7 | **N/A** for RP0 |
| S6.4 production | **N/A** for RP0 |
| **Board: ready to mark Released?** | **Yes** — RP0 platform gate; orchestrator may set release point RP0 to **Released** with evidence above. Feature work (RP1) proceeds; Cloudflare hosted staging remains **follow-up via H2** before RP1 soak on a public preview URL. |