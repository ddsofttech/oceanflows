---
name: release-preparation
description: Prepare a release point's notes, rollout and rollback plans, staging checklist, observability, and observation window.
---

# Release Preparation

Playbook step **S6.1** (`devops`). Paths, gates, and routes come from your step card.

## When to use
- QA sign-off (G6) is recorded for a release point.

## Input
- Merged change set, acceptance criteria, known defects, migration notes, feature-flag plan.

## Process
1. Draft user-facing and technical release notes, including known defects.
2. Write rollout steps, migration order, and concrete rollback criteria.
3. Define a staging checklist mapped to an acceptance-criteria smoke set.
4. Confirm dashboards and alerts for the change, the KPIs to watch after release, and the observation window: how long, and who watches.

## Output
- The release point's section of the release plan, in the shape of the `RELEASE-PLAN.md` template.

## Quality checklist
- [ ] Rollback is concrete, and tested or flagged as risky
- [ ] Known defects are listed
- [ ] Post-release signals are named
