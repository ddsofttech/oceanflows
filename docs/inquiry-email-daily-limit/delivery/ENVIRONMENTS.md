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
| `INQUIRY_DAILY_LIMIT` | KV namespace binding | `web/wrangler.toml` `id` + `preview_id` | **Prod `id` set** (`98c8523f918a4a1d8c79e9c8395e51e6`); `preview_id` still `<preview-namespace-id>` — accepted (single namespace) |
| `INQUIRY_LIMIT_HASH_PEPPER` | Worker secret | Cloudflare dashboard (not git) | **Owner-set on production Worker** (H1 partial); not verified by hosted NFR-11 smoke in devops session |
| `RESEND_API_KEY`, `INQUIRY_EMAIL`, Turnstile | Worker secrets | Existing site | Required for full W1 on hosted (prior CBW carry-forward) |

Owner procedure: `docs/company-branding-website/delivery/SETUP-GUIDES.md` **§A8** (KV create, bind IDs, pepper, TM-16 token scope).

## Environment matrix

| Environment | Ready for RP1 daily-limit path | Evidence |
|---|---|---|
| Local / CI (`vitest`, mock store) | **Yes** | QA `testing/reports/RP1.md`; inquiry suites 44/44 on release branch |
| Local `wrangler dev` | **Partial** | Binding declared; needs gitignored `web/.dev.vars` with pepper + optional local KV |
| Cloudflare preview Worker | **No** | No preview deploy this session; `preview_id` placeholder; no `CLOUDFLARE_API_TOKEN` locally |
| Cloudflare production Worker | **Partial (config only)** | RP1 **code not on prod** (`main` still lacks `INQUIRY_DAILY_LIMIT` in `wrangler.toml`); owner pepper + KV namespace ready for post–G7 merge deploy |

## H1 — owner steps (blocking hosted staging / G7)

1. Create KV namespaces **`INQUIRY_DAILY_LIMIT_PRODUCTION`** and optionally preview (owner: **one namespace only** — accepted).
2. Replace production `id` in `web/wrangler.toml` — **done** @ `aa3bd24d`; `preview_id` may remain placeholder.
3. Set Worker secret **`INQUIRY_LIMIT_HASH_PEPPER`** on production Worker — **owner reports done**; preview optional if no preview namespace.
4. Confirm `CHECK_PRODUCTION_ENV=1 npm run check:production-wrangler-kv` exits **0** — **pass** (devops S6.2 re-run).
5. **devops:** Deploy **release tip** preview (`wrangler deploy` from `release/inquiry-email-daily-limit`) **or** merge → `web-deploy-production` **only after G7 Go**; run NFR-11 smoke POSTs in `release/RELEASE-PLAN.md`. **Remaining:** hosted deploy + checklist.

## CI / deploy guards (D7)

- `web/scripts/check-production-wrangler-kv.ts` — production `id` must not match placeholder pattern.
- Wired in `web-deploy.yml` **Validate production KV binding** step.

## Handoffs

| ID | About | Owner |
|---|---|---|
| H1 | KV IDs + pepper on hosted Worker | Human + devops |
| D8 | Privacy rate-limit paragraph owner sign-off before prod | Human (Duong) |