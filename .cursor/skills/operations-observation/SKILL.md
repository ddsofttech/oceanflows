---
name: operations-observation
description: Observe post-release health and KPIs, triage anomalies, and open incidents with severity and owners.
---

# Operations Observation

Playbook step **S7.1** (`devops`). Paths, gates, and routes come from your step card.

## When to use
- After each production deploy, for the observation window in the release plan.

## Input
- Observability tools, release identity, the signals and KPIs named in the release plan.

## Process
1. Watch error rates, latency, and the agreed business KPIs.
2. Triage anomalies; open incidents with severity and an owner.
3. Summarize on the agreed cadence, tied to the release.
4. Raise hotfix needs to the orchestrator; never patch production outside the process.

## Output
- Observation summaries tied to the release point; incidents in the issue store, or one record each in the shape of the `DEFECT.md` template with type Incident.

## Quality checklist
- [ ] Every summary names the release
- [ ] Every incident has a severity and an owner
- [ ] No incident was closed silently
