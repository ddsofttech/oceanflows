# Release Plan

Request: `company-branding-website`. One section per release point, newest first.

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