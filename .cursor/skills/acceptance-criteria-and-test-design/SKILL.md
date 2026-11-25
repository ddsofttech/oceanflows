---
name: acceptance-criteria-and-test-design
description: Turn requirements and scenarios into observable, verifiable acceptance criteria traced to requirement IDs.
---

# Acceptance Criteria and Test Design

Playbook step **S1.6** (`requirements-analyst`). Paths, gates, and routes come from your step card.

**Blocked vs defer** (`.cursor/sdlc/AGENT-RULES.md`). **Blocked** here: a **material** requirement that cannot be verified without a user threshold or decision.

## When to use
- Requirements and rules are explicit enough to verify (PRD sections 6–8).

## Input
- Current PRD draft.
- Impact and regression notes when project mode is `existing-repo` (brownfield only).
- Stakeholder answers.

## Process
1. Give each material requirement a stable ID.
2. Define the condition, action, and observable result. Prefer Given / When / Then.
3. Replace subjective language with measurable criteria where a measure exists; a required numeric threshold that is unknown is **Blocked**.
4. Cover relevant normal, alternate, boundary, invalid-input, failure, and permission cases.
5. In **`existing-repo`** mode only, add regression criteria for behavior that must stay unchanged; skip regression AC on greenfield.
6. If pass/fail is still undefined for a **material** criterion after step 3, it is **Blocked**.

## Output
- PRD **section 9** (acceptance criteria table).
- Optional working paper in the `ACCEPTANCE-CRITERIA.md` template shape — **not** a PRD section.
- Section **11** only for non-blocked verifiability follow-ups.

## Quality checklist
- [ ] Every material criterion traces to a requirement
- [ ] Every expected result is observable
- [ ] Pass or fail can be determined
- [ ] Relevant normal and exceptional cases are covered
- [ ] Regression criteria included in existing-repo mode
- [ ] Blocking verifiability gaps were asked, not only logged in section 11
- [ ] Open decisions are recorded, not hidden
