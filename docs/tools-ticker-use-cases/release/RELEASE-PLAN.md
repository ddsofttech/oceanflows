# Release Plan
<!-- budget: lines=120 chars=300 -->

Request: `tools-ticker-use-cases`. One section per release point, newest first.

---

## Release point RP1

- **Slice parts included:** `ttuc-fe-01`, `ttuc-fe-02`
- **Release candidate (commit or build):** `668bcf938f37fa52b12d8a4c3cef5f8fc2858cde` (branch tip; includes G7 hold fixes #26–#29)
- **Integrated merges:** PR #23 @ `6bff9d21`; PR #24 @ `daeb543f`; hold PRs #26–#29
- **QA sign-off (G6 decision):** D9 Approve (2026-11-27) — “approve”; known issues per `testing/reports/RP1.md`

### Release notes

- **User-facing:** Home shows a scrolling **tools ticker** immediately below Services and an interactive **Use cases** section (four workflows with copy-first layout and lazy demos).
- **Technical:**
  - `ttuc-fe-01`: `ToolsTicker`, `UseCaseStack`, `use-case-lazy.js`, `marketing-tools-use-cases.css`; SITE-AC-16/17, BR-05/06, NFR-04/12.
  - `ttuc-fe-02`: Playwright regression + axe on `/` for ticker, use cases, reduce-motion (SITE-NFR-02, SITE-AC-N04).
  - **Staging host (S6.2):** `http://127.0.0.1:4321` — `serve dist` @ RC build (see S6.2).
  - **Production pre-deploy:** `https://oceanflows.net` — no `tools-ticker` yet (expected pre-G7).
  - **Deploy path:** merge release → `main` → `web-deploy-production` after G7 Go only.
- **Known issues accepted at G6:** SITE-AC-N03 CWV lab not run; UQ-U4 full keyboard path; SITE-AC-17 CS prototype manual line-compare; SITE-NFR-09 cross-browser beyond CI chromium — per `testing/reports/RP1.md`.

### Rollout

1. **Scope:** Ship RP1 marketing UI on Worker `oceanflows-company-site` at `https://oceanflows.net` (no new bindings or secrets).
2. **Prerequisite:** G7 **Go** recorded; GitHub deploy secrets unchanged (`CLOUDFLARE_*`, owner `PUBLIC_*` per `docs/company-branding-website/delivery/SETUP-GUIDES.md`).
3. **G6 evidence:** Slice parts merged; QA pass; CI runs 46009781610 (#23), 46010406499 (#24) success.
4. **S6.2 devops verify:** See staging section below — **Pass** (2026-11-27 UTC).
5. **Migrations, in order:** None.
6. **Feature flags and their default:** None.

### Rollback

- Rollback criteria (concrete signals and thresholds): Post–RP1 deploy: home **5xx** >5m; Services→ticker→Approach broken or ≠12 labels; use cases unreadable without demo; axe serious+ on `/`; inquiry API sustained **5xx**; reduce-motion shows marquee/pulse.
- **Rollback steps:**
  1. Cloudflare dashboard → Worker `oceanflows-company-site` → **Deployments** → promote previous active version (pre–RP1).
  2. If git-defined: revert RP1 merge on `main` via PR; re-run `web-deploy-production` on prior SHA.
  3. Notify orchestrator; open incident if visitor-facing regression during rollback window.
- **Rollback tested:** **no** — dashboard promote only; acceptable for static marketing RP1.

### Staging verification (S6.2)

- **Date:** 2026-11-27 (UTC)
- **Target URL:** `http://127.0.0.1:4321` (local `serve dist` @ RC `5a377ecb` tree)
- **Method:** RC `astro build`; `serve dist` on `127.0.0.1:4321`; Playwright **21/21**. `curl` prod for pre-deploy reachability.
- **Result:** **Staging verification — Pass**

**Evidence:**

| Check | Result | Evidence |
|---|---|---|
| Build @ RC | pass | `cd web && npm run build` exit **0** @ `5a377ecb` |
| Ticker + use cases in artifact | pass | `curl` home: `tools-ticker` present; `#use-cases` in HTML |
| Playwright integrated | pass | **21/21** pass in **5.7s** (incl. SITE-AC-16/17, N04, axe) |
| CI on PR #23 / #24 | pass | Runs 46009781610, 46010406499 success |
| QA release test | pass | `testing/reports/RP1.md` |
| Live prod pre-deploy | pass | `https://oceanflows.net/` **200**; **0** `tools-ticker` (not deployed) |

**S6.2 outcome:** **Pass** — RC build green on local staging host; production unchanged pending G7.

### Staging checklist

| Check (smoke set mapped to AC IDs) | Result | Evidence |
|---|---|---|
| SITE-AC-16 — ticker after Services, 12 labels | pass | Playwright `tools ticker follows Services…` |
| SITE-AC-17 — four workflows without demo | pass | Playwright `use cases section shows four workflow titles…` |
| SITE-AC-N04 — reduce motion static ticker | pass | Playwright `prefers-reduced-motion…` |
| SITE-NFR-02 — axe serious/critical on `/` | pass | Playwright axe index |
| W-3 / nav — Services → ticker → Approach; nav Use cases | pass | Playwright nav + section order tests |
| Regression — contact, theme, beacon, 404, keyboard | pass | Playwright 21/21 |
| TM-04 — CI secrets gate on merges | pass | `gate / secrets` on PR CI |
| Hosted prod reachability (pre-RP1) | pass | `oceanflows.net` **200**; inquiry API edge unchanged |

### Observation

- **Dashboards and alerts:** Cloudflare Worker `oceanflows-company-site` deploy status; GitHub Actions `web-ci` + `web-deploy-production`; Cloudflare Web Analytics (existing).
- **KPIs to watch (PRD §2):** **O2** service communication (ticker + use cases visible); **O4** operational value clarity; **O5** inquiry path unchanged — watch for post-deploy 5xx or form regression; owner content review (O1–O3) unchanged.
- **Observation window:** **48h** after **G7 Go** production deploy — **start:** 2026-11-27T15:55Z; **end:** 2026-11-29T15:55Z; **owner:** `devops` + human spot-check.

### Go decision (G7) — RP1 production deploy

| Field | Value |
|---|---|
| **Decision** | **Go** (D15) |
| **Staging (S6.2)** | **Pass** (2026-11-27 UTC) |
| **Rationale** | G6 D9 + QA green; hold fixes #26–#29 on tip `668bcf93`; rollback recorded. |
| **Residual (non-blocking)** | SITE-AC-N03 CWV lab; UQ-U4 keyboard; CS prototype manual compare; multi-browser partial — per G6 acceptance. |

- **Approver(s) and date:** human, 2026-11-27 — “Go”

### Deploy record

| Environment | Date | Version | Result | Rollback run? |
|---|---|---|---|---|
| Staging (local serve @ RC) | 2026-11-27 | `5a377ecb` | pass | no |
| Production | 2026-11-27 | `4d473e8f` (PR #30; deploy [46029082837](https://github.com/ddsofttech/oceanflows/actions/runs/46029082837)) | pass — oceanflows.net 200; tools-ticker + #use-cases present | no |