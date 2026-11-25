---
name: requirements-analysis
description: Independently assess the PRD draft for business validity, completeness, assumptions, constraints, scope, risks, dependencies, and testability.
---

# Requirements Analysis

Playbook step **S1.4** (`requirements-analyst`). Paths, gates, and routes come from your step card.

**Blocked vs defer** (`.cursor/sdlc/AGENT-RULES.md`). **Blocked** here: a contradiction, a missing scope decision, or an untestable material requirement.

## When to use
- A PRD draft exists for the request.

## Input
- Current PRD draft (template sections only).
- The original request, impact and research findings, and stakeholder answers so far.

## Process
1. Confirm which draft is under review.
2. Assess whether the requirements address the stated business problem.
3. Find ambiguity, omissions, contradictions, unverifiable language, missing error behavior, and scope creep.
4. Separate facts, assumptions, constraints, technical unknowns, dependencies, and risks.
5. Refine requirement IDs, priorities, and status; list open decisions.
6. Classify each finding severity: **Blocking**, **Important**, or **Non-blocking**.

## Output
- Optional working paper in the `REQUIREMENTS-ANALYSIS.md` template shape — **not** a PRD section.
- PRD refinements only in sections **6–7**, **10**, **11** (section 11 for Important/Non-blocking only during this step).

## Quality checklist
- [ ] Requirements assessed against business objectives
- [ ] Material gaps and contradictions found and recorded
- [ ] Assumptions and how to validate them are in section 10
- [ ] Constraints, dependencies, and unknowns are distinguished
- [ ] MVP boundary and scope risks evaluated
- [ ] Material risks have an action or explicit acceptance
- [ ] Each requirement assessed for observable verification
- [ ] Blocking issues were escalated to the user, not hidden in section 11
- [ ] Proposed changes kept separate from the approved baseline
