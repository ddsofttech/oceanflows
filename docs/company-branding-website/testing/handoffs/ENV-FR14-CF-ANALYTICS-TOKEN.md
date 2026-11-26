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