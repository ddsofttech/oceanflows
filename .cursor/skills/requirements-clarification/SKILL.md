---
name: requirements-clarification
description: Clarify the problem, stakeholders, outcomes, scope, and known requirements, and seed the living PRD.
---

# Requirements Clarification

Playbook step **S1.1** (`requirements-analyst`). Paths, gates, and routes come from your step card.

**Blocked vs defer** (`.cursor/sdlc/AGENT-RULES.md`). **Blocked** here: a need that depends on a user decision, or sources that disagree where the later one does not clearly supersede the earlier.

## When to use
- A new idea, feature request, or business problem arrives.
- Requirements are vague, incomplete, contradictory, or solution-first.

## Input

- The request, materials and stakeholder answers.
- The living PRD, shaped only as the `PRD.md` template.

## Process
1. Continue the living PRD; change only what this request requires, and record each change against the last approved PRD in section 12 with this request's summary. Fold in what any request's `analysis/finding-notes.md` recorded since the baseline: each clarification with its own section 12 row, and each gap or risk still open into section 10 or 11.
2. Read every source in date order. Extract each candidate **functional** need (behavior the system must perform) and **non-functional** need (quality attributes: performance, security, availability, compliance, usability targets, etc.) with citation (file; speaker and timestamp when available).
3. Understand the business problem, context, affected users, and desired outcome; identify decision-makers, users, affected parties, and subject-matter experts.
4. Identify ambiguity, contradictions, missing information, and assumptions. Define scope, exclusions, essential needs, and desirable enhancements.
5. Update **only these PRD sections** (template headings only):
   - **Sections 2–5** — problem, objectives, scope, stakeholders.
   - **Section 6–7** — one table row per material need; columns per template (`ID`, `Requirement` or quality attribute text, `Priority`, `Status`). Use **Proposed** unless the user or an authoritative source already decided; use **Approved** only when authority is explicit. Put the source in the requirement text or in section 10 as constraint/assumption — do not add columns.
   - **Section 10** — material constraints, assumptions, dependencies surfaced here.
6. Do **not** state unresolved needs as agreed requirements in sections 6–7; a deferrable one goes in section 11 as **Important** or **Non-blocking**.
7. Where sources disagree, keep the latest decision and note what it replaced; never pick one silently.

## Output
- Updated living PRD (sections 2–7, 10, and section 11 only when not blocked).
- Optional clarification notes — citations and raw notes; **not** pasted into the PRD as extra sections.

## Quality checklist
- [ ] Problem and context are clear
- [ ] Outcomes are explicit
- [ ] Relevant stakeholders are identified
- [ ] Draft requirements are clear enough to analyze
- [ ] Scope and exclusions are documented
- [ ] Material assumptions are in section 10
- [ ] PRD has no headings beyond the template
- [ ] Blocking gaps were resolved with the user, not only listed in section 11
- [ ] Every conflict between sources is resolved by a later decision or by asking the user
- [ ] Every change since the last approved PRD is identifiable, with the request that made it
