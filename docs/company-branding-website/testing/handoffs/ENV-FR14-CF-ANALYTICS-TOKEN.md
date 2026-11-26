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

## Devops answer (2026-11-26, H4)

**Disposition:** **blocked on owner credentials** — cannot complete redeploy from this agent session.

**Hosted beacon live?** **No.** Verified `curl https://oceanflows.net/` at 2026-11-26: no `static.cloudflareinsights.com/beacon.min.js`, no `data-cf-beacon` in HTML.

**What was checked**

| Check | Result |
|---|---|
| Live HTML | Beacon absent |
| GitHub repo secrets (`gh secret list`) | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` only — **`PUBLIC_CF_ANALYTICS_TOKEN` not set** |
| Local `wrangler whoami` | Not authenticated (no `CLOUDFLARE_API_TOKEN` in shell) |
| Deploy path | Primary production deploy is **Workers Builds** on branch `release/company-branding-website` per `delivery/CLOUDFLARE-PAGES-SETUP.md`; `web-deploy.yml` also needs the secret when used |

**Owner actions (Duong)**

1. Cloudflare Dashboard → **Analytics & Logs** → **Web Analytics** → **Manage site** → add `oceanflows.net` if needed → copy **JS Snippet Beacon token**.
2. **Workers Builds** → `oceanflows-company-site` → **Settings** → **Builds** → **Build variables and secrets** → add `PUBLIC_CF_ANALYTICS_TOKEN` (build-time; Astro inlines at `npm run build`).
3. **GitHub** → repo **Settings** → **Secrets** → Actions → create `PUBLIC_CF_ANALYTICS_TOKEN` (same value) for `.github/workflows/web-deploy.yml`.
4. **Redeploy** the Worker (Workers Builds **Retry deployment**, or merge a no-op commit to `release/company-branding-website`).
5. Re-run QA hosted FR-14: beacon in page source + network request; no new analytics cookies.

**Devops follow-up in PR `cbw-devops-02`:** production env guard + setup doc updates; deploy workflow runs placeholder + env checks when secrets exist.