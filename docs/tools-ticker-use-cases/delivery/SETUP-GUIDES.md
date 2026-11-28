# Setup guides — tools-ticker-use-cases

RP1 adds **no** infrastructure. Reuse existing site tooling.

## Local development

1. `cd web && npm ci && npm run dev` — Home at `http://localhost:4321/`.
2. Optional: `npm run test:e2e` (Playwright; matches `gate / playwright-smoke`).
3. Optional: `python3 .cursor/sdlc/scripts/ui-catalog.py --src web/src/components --tokens design/tokens/design-tokens.json --check`.

## CI

- Open PRs into `release/tools-ticker-use-cases` (or merge release → `main` per team rule); `web-ci` runs on `pull_request`.
- Before first **ttuc** implementation PR merges, resolve **G-CI-01** in `delivery/ENVIRONMENTS.md` (SDLC request + change-size part IDs).

## Hosted preview and production

Same Worker application as company branding — **no new bindings**:

- Owner procedures: `docs/company-branding-website/delivery/SETUP-GUIDES.md` (Workers Builds, `CLOUDFLARE_*` GitHub secrets, production env vars).
- Production deploy: merge to `main` → `web-deploy-production` (G7 only).

## Branch

Integration branch: `release/tools-ticker-use-cases`.