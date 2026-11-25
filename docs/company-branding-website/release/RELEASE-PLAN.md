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

### Staging checklist

RP0 staging target = **integration branch CI + optional hosted preview**. Per IMPLEMENTATION-PLAN, RP0 deliverable is “CI green on empty `web/`”, not a public staging URL.

| Check (smoke set mapped to AC IDs) | Result | Evidence |
|---|---|---|
| NFR-05 — JAMstack scaffold, Cloudflare adapter, no DB/CMS | **pass** | QA report; `web/` layout at RC |
| PR pipeline — ENGINEERING-STANDARDS §9 gates | **pass** | `web-ci` run 45694850445 on `05ec0c5` |
| TM-04 — no secrets in diff/repo | **pass** | `gate / secrets` (gitleaks) |
| Playwright smoke — scaffold page loads + axe | **pass** | `gate / playwright-smoke` on RC |
| Build placeholders — no `[TOKEN]` in `dist/` | **pass** | `gate / build-placeholders` |
| Cloudflare Pages preview deploy (smoke URL) | **not run** | **Blocked — H2** (owner Cloudflare account/secrets). Run in S6.2 when H2 closes; not gating RP0 sign-off. |

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
| Git / CI (`ux/company-branding-website`) | 2026-11-25 | `05ec0c5` | Success — `web-ci` green | N/A |
| Cloudflare Pages (preview / staging) | — | — | **Not deployed** — H2 open | N/A |
| Cloudflare Pages (production) | — | — | **Not in scope for RP0** | N/A |

### S6.2 readiness (staging verify)

| Item | Status | Notes |
|---|---|---|
| G6 recorded | **Ready** | D18 Approve |
| RC identified | **Ready** | `05ec0c5` |
| CI staging evidence | **Ready** | Release test complete in `testing/reports/RP0.md` |
| Hosted staging URL (Cloudflare preview) | **Blocked** | H2 — follow `delivery/CLOUDFLARE-PAGES-SETUP.md` |
| G7 package (S6.3) | **Not applicable** | RP0 skips G7; do not prepare production Go for RP0 |

**Can S6.2 run?** **Yes, in narrow scope:** record RP0 as **Released** on the integration branch with CI evidence (S6.2 verify = confirm post-merge `web-ci` + archive staging checklist above). **No** full S6.2 Cloudflare staging soak until H2 closes; that work carries to **RP1** staging, not a blocker to closing RP0 in the board sense.