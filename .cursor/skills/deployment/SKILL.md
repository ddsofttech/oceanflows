---
name: deployment
description: Deploy to staging and verify it, then deploy to production after the human Go and roll back on failed health.
---

# Deployment

Playbook steps **S6.2–S6.4** (`devops`). Paths, gates, and routes come from your step card.

## When to use
- Staging: the release plan exists.
- Production: the human gave Go at S6.3.

## Input
- Release plan, CI artifacts, credentials from the secrets store.

## Process
1. Deploy staging through the approved pipeline.
2. Run the staging checklist, smoke, and health checks; capture evidence. A failure caused by the product is a defect for its slice-part owner; a failure of the environment is yours to fix.
3. On Go: deploy production through the same pipeline and verify health.
4. On failed health: execute the rollback plan and report the incident.

## Output
- Staging evidence; production deploy record; rollback record if one ran.

## Quality checklist
- [ ] Staging evidence is attached before asking for Go
- [ ] Production is deployed only after a recorded Go
- [ ] Rollback is ready before production deploy
- [ ] No partial ship goes unreported
