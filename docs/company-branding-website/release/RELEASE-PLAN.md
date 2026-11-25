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
4. **S6.2 devops verify:** See staging section below — **hosted checks not green** at time of record.
5. **Migrations, in order:** None.
6. **Feature flags and their default:** None; placeholder guard via build/env (full production guard in RP2 / `cbw-devops-02`).

### Rollback

- **Rollback criteria (concrete signals and thresholds):**
  - Home or `/contact` returns 5xx for >5 minutes after a deploy attributed to RP1 RC; or
  - HTTPS not enforced (browser shows certificate error on apex); or
  - Inquiry API returns sustained 5xx on valid submissions during soak; or
  - Regression vs QA axe serious/critical on home/privacy/404/contact after deploy.
- **Rollback steps:**
  1. Cloudflare dashboard → Worker `oceanflows-company-site` → **Deployments** → promote previous active version (or Workers Builds rollback).
  2. If bad release came from GitHub Action `web-deploy-production`, re-run prior successful workflow or revert merge on integration branch and redeploy.
  3. If DNS/custom-domain misconfiguration: detach/repair custom hostname in Worker **Settings → Domains & Routes**; do not patch app code outside PR process.
  4. Notify orchestrator; record incident if production traffic impacted (RP1 soak on live domain).
- **Rollback tested:** **no** — dashboard rollback only; acceptable for RP1 soak once hosted URL is reachable. **Risky until first successful S6.2 pass.**

### Staging verification (S6.2)

- **Date:** 2026-11-25
- **Target URL:** `https://oceanflows.net`
- **Method:** Authoritative DNS trace + `curl` with browser User-Agent; Cursor IDE browser; Browser Use local Chrome. (No production deploy performed by devops this step — verify only.)
- **Result:** **Staging verification — Fail** (hosted URL not reachable from devops network; checklist not executable on live host).

**Evidence (authoritative for S6.2):**

| Check | Result | Evidence |
|---|---|---|
| DNS apex `oceanflows.net` | **fail** | `dig +trace oceanflows.net A` ends at Cloudflare authoritative NS (`rosa.ns.cloudflare.com`) with **no A/AAAA/CNAME** answer; `dig @8.8.8.8` / `@1.1.1.1` — empty; `curl` → `(6) Could not resolve host` |
| IDE browser home | **fail** | `chrome-error://chromewebdata/` — “This site can’t be reached” |
| Browser Use (local Chrome) | **fail** | Same error page on `/`, `/privacy`, `/contact`, smoke 404 path |
| `WebFetch` | **fail** | HTTP 500 from fetch layer (no usable HTML) |
| Board note (CI agent) | **inconclusive** | Prior automated `curl` from CI reported **HTTP 403** (possible bot fight when host resolved); contradicts current public DNS NXDOMAIN — treat as **evidence gap**; rerun smoke from GH runner after DNS fixed |
| QA RC build (corroborating, not hosted) | **pass** | `testing/reports/RP1.md` @ `8f974c60` — 17/17 e2e, merge CI green |

### Staging checklist

Mapped to PRD / TEST-PLAN RP1 smoke; **hosted column blocked until DNS + HTTP 200**.

| Check (smoke set mapped to AC IDs) | Result | Evidence |
|---|---|---|
| NFR-06 — HTTPS on home | **fail** | No TLS handshake — host does not resolve |
| FR-01–05 — home loads marketing content | **fail** | Not reachable |
| FR-12 — unknown URL shows 404 + nav | **fail** | Not reachable (`/does-not-exist-rp1-smoke` not tested live) |
| FR-11 — `/privacy` loads | **fail** | Not reachable |
| FR-06–08 — contact form present on site | **fail** | Not reachable; QA e2e passed locally only |
| NFR-05 — Cloudflare Worker host | **blocked** | Worker name `oceanflows-company-site`; custom domain DNS not published |
| TM-04 — no secrets in deploy artifact | **pass** (CI) | `gate / secrets` on merge CI |
| Playwright integrated (local build) | **pass** | QA / RC `8f974c60` |

**S6.2 outcome:** **Fail** — cannot mark hosted staging green. **Environment issue (Blocking):** publish DNS + Worker custom domain for `oceanflows.net`, then rerun checklist (use browser UA; if 403 persists, allowlist smoke IP or manual owner screenshot per BOARD).

### Observation

- **Dashboards and alerts:** Cloudflare Worker `oceanflows-company-site` build/deploy status; GitHub Actions `web-ci` on `ux/company-branding-website`; optional Worker analytics after RP2 (`cbw-fe-04`).
- **KPIs to watch (PRD §3 IDs):** O5 inquiry/booking counts — **not measurable** until site is reachable and Resend path verified (FR-07); O1–O4 owner content review still pending.
- **Observation window:** Starts after **successful S6.2 rerun** — propose 48h soak, **owner:** `devops` + human spot-check; **not started** (blocked on DNS).

### Go decision (G7) — RP1 release target

RP1 uses G7 to **accept `https://oceanflows.net` as the RP1 release host** and mark RP1 **Released** (not RP2 production go-live; formal production guard remains RP2 / `cbw-devops-02`).

**G7 package (S6.3 input):**

| Field | Value |
|---|---|
| **Recommendation** | **Hold** |
| **Staging (S6.2)** | **Fail** |
| **Rationale** | G6 D20 accepted QA integration at RC `8f974c60`, but devops **cannot verify** live home, HTTPS, `/privacy`, 404, or contact form on `https://oceanflows.net` — apex has **no public DNS address records** at Cloudflare authoritative NS (2026-11-25). Prior CI 403 suggests intermittent reachability or WAF; both must be cleared before Go. |
| **On Approve (Go)** | Orchestrator may mark RP1 **Released** with human-attested URL + devops rerun evidence; begin RP2 parts; start observation window. |
| **On Hold** | Fix DNS/custom domain; devops reruns S6.2; optional GH Actions smoke with browser UA against apex. |
| **On No-go** | Revert Worker deploy or pause public hostname until RC quality reconfirmed. |

- **Approvers and date:** Pending human G7 — **blocked** on green S6.2 hosted evidence.

### Deploy record

| Environment | Date | Version | Result | Rollback run? |
|---|---|---|---|---|
| Cloudflare Worker (integration) | 2026-11-25 (owner) | `8f974c60` (intended) | **Unverified** by devops — G6 attests live site; DNS missing from public resolvers at S6.2 | N/A |
| Staging verify (S6.2) | 2026-11-25 | `8f974c60` | **Fail** — DNS / reachability | N/A |
| Production (RP2 / G7 prod) | — | — | **Not in scope for RP1 S6.2** | N/A |

### Release status

| Field | Value |
|---|---|
| S6.1 | Complete — this section |
| S6.2 | Complete — **Fail** (hosted); evidence recorded |
| S6.3 / G7 | **Hold** — awaiting DNS fix + staging rerun |
| S6.4 production | **Not requested** (RP2) |
| **Board: ready to mark Released?** | **No** — fix Blocking DNS/custom domain, pass S6.2 hosted checklist, then G7 Go |

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