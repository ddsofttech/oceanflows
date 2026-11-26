# Part plan: iedl-devops-01 — KV binding and secrets

## Goal
Worker `oceanflows-company-site` has a bound KV namespace and hash pepper for per-email daily limits in every environment used for QA and production.

## Acceptance criteria
| AC ID | Done when |
|---|---|
| NFR-11 | Preview/prod Worker has `INQUIRY_DAILY_LIMIT` KV binding |
| D7 | Namespace documented; deploy cannot succeed with placeholder ID in prod checklist |

## Read
| What | Where |
|---|---|
| ADR-5 | `design/ARCHITECTURE.md` §9 |
| Threat TM-16 | `design/THREAT-MODEL.md` §4 |
| Wrangler | `web/wrangler.toml` |
| Setup | `docs/company-branding-website/delivery/SETUP-GUIDES.md` (extend) |

## Changes
- Expected files: `web/wrangler.toml`, `web/.dev.vars.example`, setup guide section, optional CI note for binding presence on prod deploy.
- Reuse: existing Worker project `oceanflows-company-site`.
- Out of bounds: application logic (`iedl-be-01`).

## Security requirements
| ID | Requirement | Test |
|---|---|---|
| TM-16 | Separate KV namespace; token scoped | Owner checklist in setup guide |

## Tests
| Level | What |
|---|---|
| manual | `wrangler kv namespace list`; preview deploy smoke POST after be merges |