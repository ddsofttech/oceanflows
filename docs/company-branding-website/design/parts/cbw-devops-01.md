# Part plan: cbw-devops-01 — Platform scaffold and CI

## Goal
`web/` Astro project exists, Cloudflare Pages build succeeds, PR pipeline runs engineering-standard gates on changed files.

## Size
**M** (approved architect resize H1, 2026-11-25): ~779 changed lines vs prior **S** cap (500); full gate toolchain + env/CI scaffold, excluding `package-lock.json`.

## Acceptance criteria
| AC ID | Done when |
|---|---|
| NFR-05 | Repo contains static site + single function path; no DB |
| — | PR checks: format, lint, types, gitleaks, audit |

## Read
| What | Where |
|---|---|
| ADR-1, ADR-2 | `design/ARCHITECTURE.md` §9 |
| Quality gates | `docs/ENGINEERING-STANDARDS.md` §9 |
| Environments | `design/IMPLEMENTATION-PLAN.md` §5 |

## Changes
- Expected files: `web/package.json`, `astro.config.mjs`, `wrangler.toml`, `.github/workflows/web-ci.yml` (or equivalent), `web/.env.example`, `web/.dev.vars.example`, `.gitignore` entries
- Reuse: none (greenfield)
- Out of bounds: page markup migration, inquiry handler

## Security requirements
| ID | Requirement | Test |
|---|---|---|
| TM-04 | No secrets in repo | gitleaks CI |

## Tests
| Level | What |
|---|---|
| integration | CI workflow dry-run on PR |