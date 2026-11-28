# Company marketing site (`web/`)

Astro + `@astrojs/cloudflare` marketing site for DD Software Solutions.

## Commands

| Command                                | Purpose                                                               |
| -------------------------------------- | --------------------------------------------------------------------- |
| `npm run dev`                          | Local Astro dev server                                                |
| `npm run build`                        | Production build to `dist/`                                           |
| `npm run check`                        | `astro check` + `tsc`                                                 |
| `npm run test` / `test:e2e`            | Vitest + Playwright smoke                                             |
| `npm run check:placeholders`           | Fail if `[TOKEN]` placeholders in `dist/`                             |
| `npm run check:production-env`         | Fail when `CHECK_PRODUCTION_ENV=1` and required `PUBLIC_*` missing    |
| `npm run check:production-wrangler-kv` | Fail when `CHECK_PRODUCTION_ENV=1` and KV `id` is still a placeholder |
| `npm run smoke:production`             | Curl smoke against `oceanflows.net` (beacon + HTTPS redirect)         |

## Environment

Copy `.env.example` and `.dev.vars.example` (never commit secrets). Production values live in Cloudflare Worker env settings (Cloudflare, Resend, Cal.com).
