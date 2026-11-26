# Environment handoff: FR-14 on production (PUBLIC_CF_ANALYTICS_TOKEN)

- **To:** `devops`
- **Type:** environment
- **Release point:** RP2
- **Slice part:** cbw-fe-04 (implementation merged; S5.1 blocked on hosted FR-14)
- **Build under test:** `700cfc1cea07f7b3be709823a8140aee96b9346f` (PR #8)

## Problem

Production at https://oceanflows.net does not load the Cloudflare Web Analytics beacon. FR-14 requires a cookieless beacon on all pages when analytics is enabled.

## Evidence

1. `curl` + HTML inspection of `/` and `/privacy` (2026-11-25 QA): no `static.cloudflareinsights.com/beacon.min.js`, no `data-cf-beacon` attribute.
2. Local build **with** `PUBLIC_CF_ANALYTICS_TOKEN` at merge SHA: beacon present on `dist/index.html`, `dist/privacy/index.html`, and `dist/404.html`.
3. `web/.env.example` documents `PUBLIC_CF_ANALYTICS_TOKEN`; `web-deploy.yml` expects secret `PUBLIC_CF_ANALYTICS_TOKEN`.

## Requested action

1. Create or copy the Cloudflare Web Analytics site token (Dashboard → Analytics & Logs → Web Analytics → Manage site → JS Snippet Beacon token).
2. Set `PUBLIC_CF_ANALYTICS_TOKEN` in the Cloudflare Workers/Pages build environment (and GitHub Actions secret if deploy workflow uses it).
3. Redeploy `oceanflows.net`.
4. Notify QA to rerun hosted FR-14 (beacon in page source + network request to Cloudflare; confirm no new analytics cookies in Application storage).

## What QA finished meanwhile

- Slice check **pass** on integrated code at merge SHA (unit, build artifact, PR CI). Hosted FR-14 recorded as **blocked** until redeploy.

## Blocks

- Full **FR-14** verification on production URL.
- RP2 release test row for hosted analytics (not a frontend code defect).

---

## Devops answer (2026-11-26, H4 → D24)

**Disposition:** **owner token claimed (D24)** — hosted FR-14 remains **blocked** until Workers Builds has `PUBLIC_CF_ANALYTICS_TOKEN` as a **Build** variable and a **new build** completes on production branch **`main`**.

**Hosted beacon live?** **No** (as of 2026-11-26 post-D24). `curl https://oceanflows.net/`: no `static.cloudflareinsights.com/beacon.min.js`, no `data-cf-beacon` in HTML.

**What was checked**

| Check | Result |
|---|---|
| Live HTML | Beacon absent |
| Owner (D24) | **`PUBLIC_CF_ANALYTICS_TOKEN` set**; **production Git branch `main`** (not `release/company-branding-website`) |
| GitHub Actions secrets (`gh secret list`, prior) | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` only — add `PUBLIC_CF_ANALYTICS_TOKEN` if using `web-deploy.yml` |
| Deploy path | **Workers Builds** on branch **`main`** per `delivery/SETUP-GUIDES.md` §A1; Astro inlines token only at build time (§A2 / §A6) |

**Remaining owner / devops actions**

1. Confirm **Workers Builds** → `oceanflows-company-site` → **Settings** → **Builds** → **Build variables and secrets** includes `PUBLIC_CF_ANALYTICS_TOKEN` (not runtime-only).
2. **Redeploy** from `main` (Retry deployment or merge that triggers Builds).
3. Optional: GitHub **Settings** → **Secrets** → Actions → `PUBLIC_CF_ANALYTICS_TOKEN` for `.github/workflows/web-deploy.yml`.
4. Notify QA to rerun hosted FR-14: beacon in page source + network request; no new analytics cookies.

**Devops follow-up (PR `cbw-devops-02`):** `delivery/SETUP-GUIDES.md` aligned with D24 (`main`, FR-14); deploy workflow runs placeholder + env checks when secrets exist.