---
name: requirements-analysis
description: Independently assess the draft PRD and feature specs for business validity, completeness, assumptions, constraints, scope, risks, dependencies, and testability.
---

# Requirements Analysis

Playbook step **S1.4** (`requirements-analyst`). Paths, gates, and routes come from your step card.

**Blocked vs defer** (`.cursor/sdlc/AGENT-RULES.md`). **Blocked** here: a contradiction, a missing scope decision, or an untestable material requirement.

## When to use
- A draft exists for the request: the PRD and this request's specs.

## Input
- This request's specs and the PRD IDs they inherit.
- The original request, impact and research findings, and stakeholder answers so far.

## Process
1. Confirm which draft version is under review.
2. Assess whether the requirements address the stated business problem.
3. Find ambiguity, omissions, contradictions, unverifiable language, missing error behavior, and scope creep, including contradictions with the PRD or with the specs of features this one shares data or workflows with.
4. Separate facts, assumptions, constraints, technical unknowns, dependencies, and risks.
5. Check placement: requirements stay in specs. A rule or constraint two or more features depend on moves to the PRD and each spec cites it; one only this feature needs stays in its spec.
6. Refine requirement IDs, priorities, and status; list open decisions.
7. Classify each finding severity: **Blocking**, **Important**, or **Non-blocking**.

## Output
- Refinements only to requirements in this request's specs, and to constraints, assumptions, risks, dependencies, and open questions (Important and Non-blocking during this step) in the specs or the PRD.

## Quality checklist
- [ ] Requirements assessed against business objectives
- [ ] Material gaps and contradictions found and recorded, including against the PRD
- [ ] Assumptions and how to validate them are recorded
- [ ] Constraints, dependencies, and unknowns are distinguished
- [ ] Scope boundary and scope risks evaluated
- [ ] Material risks have an action or explicit acceptance
- [ ] Each requirement assessed for observable verification
- [ ] Requirements are only in specs; shared rules and constraints in the PRD; nothing in both
- [ ] Blocking issues were escalated to the user, not hidden in the open questions
- [ ] Proposed changes kept separate from the approved baseline
