# Environments — inquiry-email-daily-limit

Request: `inquiry-email-daily-limit`. Worker: `oceanflows-company-site` (shared with `company-branding-website`).

## Pipelines

| Pipeline | Trigger | Purpose | RP1 notes |
|---|---|---|---|
| `web-ci` (`.github/workflows/web-ci.yml`) | PR + push | Lint, unit, contract, Playwright smoke | Green on PR #15–#17 merges |
| `web-deploy-production` (`.github/workflows/web-deploy.yml`) | `main` push `web/**` or `workflow_dispatch` | Production Worker deploy | Runs `CHECK_PRODUCTION_ENV=1 npm run check:production-wrangler-kv` before build — **fails while `web/wrangler.toml` KV `id` is a placeholder** (D7) |

There is **no dedicated staging URL**. Hosted verification uses Cloudflare **preview** (`wrangler deploy` with `preview_id`) or production `https://oceanflows.net` after G7 merge — same pattern as `company-branding-website` RP2.

## Runtime bindings and secrets (RP1)

| Name | Kind | Where | RP1 status |
|---|---|---|---|
| `INQUIRY_DAILY_LIMIT` | KV namespace binding | `web/wrangler.toml` `id` + `preview_id` | **Placeholder** — H1 open |
| `INQUIRY_LIMIT_HASH_PEPPER` | Worker secret | Cloudflare dashboard (not git) | **Not set** — H1 open |
| `RESEND_API_KEY`, `INQUIRY_EMAIL`, Turnstile | Worker secrets | Existing site | Required for full W1 on hosted (prior CBW carry-forward) |

Owner procedure: `docs/company-branding-website/delivery/SETUP-GUIDES.md` **§A8** (KV create, bind IDs, pepper, TM-16 token scope).

## Environment matrix

| Environment | Ready for RP1 daily-limit path | Evidence |
|---|---|---|
| Local / CI (`vitest`, mock store) | **Yes** | QA `testing/reports/RP1.md`; inquiry suites 44/44 on release branch |
| Local `wrangler dev` | **Partial** | Binding declared; needs gitignored `web/.dev.vars` with pepper + optional local KV |
| Cloudflare preview Worker | **No** | H1: real `preview_id` + pepper on Worker |
| Cloudflare production Worker | **No** | H1: real `id` + pepper; deploy guard blocks placeholder `id` |

## H1 — owner steps (blocking hosted staging / G7)

1. Create KV namespaces **`INQUIRY_DAILY_LIMIT_PRODUCTION`** and **`INQUIRY_DAILY_LIMIT_PREVIEW`** (dashboard or `cd web && npx wrangler kv namespace list`).
2. Replace `id` and `preview_id` in `web/wrangler.toml` with real namespace IDs; commit on `release/inquiry-email-daily-limit` (or a follow-up PR to `main` before prod deploy).
3. Set Worker secret **`INQUIRY_LIMIT_HASH_PEPPER`** (≥32 bytes entropy; §A8.3) on **preview and production** Worker environments.
4. Confirm `CHECK_PRODUCTION_ENV=1 npm run check:production-wrangler-kv` exits **0** after step 2.
5. **devops:** Deploy preview (or production after G7) via approved pipeline; run staging checklist in `release/RELEASE-PLAN.md` (NFR-11 smoke POSTs).

## CI / deploy guards (D7)

- `web/scripts/check-production-wrangler-kv.ts` — production `id` must not match placeholder pattern.
- Wired in `web-deploy.yml` **Validate production KV binding** step.

## Handoffs

| ID | About | Owner |
|---|---|---|
| H1 | KV IDs + pepper on hosted Worker | Human + devops |
| D8 | Privacy rate-limit paragraph owner sign-off before prod | Human (Duong) |