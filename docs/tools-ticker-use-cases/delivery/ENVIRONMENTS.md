# Environments — tools-ticker-use-cases

Request: `tools-ticker-use-cases`. Worker: `oceanflows-company-site` (shared). RP1: static marketing only — **no new Wrangler bindings or secrets**.

## Pipelines

| Pipeline | Trigger | Purpose | RP1 notes |
|---|---|---|---|
| `web-ci` (`.github/workflows/web-ci.yml`) | `pull_request` (all branches); `push` → `main`, `ux/company-branding-website`, `feature/**` | `docs/ENGINEERING-STANDARDS.md` §9 gates on `web/` | Proven green on prior release PRs (e.g. inquiry-email `45932094483`); **no run yet** on `release/tools-ticker-use-cases` until first PR |
| `web-deploy-production` (`.github/workflows/web-deploy.yml`) | `push` → `main` (`web/**`) or `workflow_dispatch` | Production Worker deploy | Unchanged; RP1 ships with next site merge after G7 |

## Quality gates (§9 → `web-ci` jobs)

| Gate | Job |
|---|---|
| Format, lint, types, duplication, unused, audit, sast, secrets | `gate / *` |
| Unit + diff-cover | `gate / unit-tests` |
| Playwright smoke (incl. a11y targets) | `gate / playwright-smoke` |
| Placeholders, stylelint, ui-catalog | respective `gate / *` |
| SDLC process + change size (PR) | `gate / sdlc-process`, `gate / change-size` |

## Environment matrix

| Environment | Ready for RP1 | Evidence |
|---|---|---|
| Local (`npm run dev` / `astro check` / Playwright) | **Yes** | `web/` lint + `astro check` pass @ branch tip (S3.4); no new env vars |
| GitHub Actions PR CI | **Yes** | Workflow present; `pull_request` fires for feature → `release/tools-ticker-use-cases` |
| Cloudflare preview (Worker / Builds) | **Yes** | Same as CBW — no binding delta; `npx wrangler preview` / dashboard preview |
| Cloudflare production | **Yes (path only)** | `web-deploy-production`; code reaches prod only after merge to `main` + G7 |

## Gaps (S3.4)

| ID | Gap | Severity | Owner |
|---|---|---|---|
| G-CI-01 | `web-ci` `sdlc-process` / `change-size` use `--request company-branding-website` and part `cbw-fe-01` | Important | devops — retarget before `ttuc-fe-*` merge PRs (or matrix by `base_ref`) |
| G-CI-02 | `main` has no branch protection / required checks (GitHub API 404) | Non-blocking | Human — mark `web-ci` jobs required when ready |
| G-CI-03 | No open PR on `release/tools-ticker-use-cases` — hosted CI not re-run for this request yet | Non-blocking | frontend-developer on first slice PR |

## Handoffs

| ID | About | Owner |
|---|---|---|
| H-CI-01 | Wire `sdlc-check.py --request tools-ticker-use-cases` and `--part ttuc-fe-01` / `ttuc-fe-02` on ttuc PRs | devops (pre S4 merge PR) |
| H-ENV-01 | Worker secrets / KV for inquiry W1 | Unchanged — `docs/company-branding-website/delivery/SETUP-GUIDES.md` |