---
name: new-feature-request
description: Package a follow-up feature, enhancement, defect, or corrective change after a release so it re-enters the workflow through intake.
---

# New Feature Request

Playbook step **S7.4** (`devops`). Paths, gates, and routes come from your step card.

## When to use
- G8 approved new work, or authorized corrective work.

## Input
- Request text, or the approved follow-ups from the post-release review.
- Corrective flag, when G8 rejected the release outcome.
- The latest PRD and the prior request's decision log.

## Process
1. Write the request as a problem and desired outcome, not a solution.
2. Link it to the latest PRD and the evidence that triggered it (incident, metric, defect, feedback).
3. Mark corrective work as such, with its severity.
4. Return the package to the orchestrator, which takes it in with `intake-and-routing`.

## Output
- An intake request with its links, evidence, and corrective flag.

## Quality checklist
- [ ] Problem stated without prescribing a solution
- [ ] Prior baseline and triggering evidence linked
- [ ] Approved baselines left untouched
