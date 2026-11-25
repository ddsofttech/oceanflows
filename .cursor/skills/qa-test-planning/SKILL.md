---
name: qa-test-planning
description: Derive a test plan from acceptance criteria, the tests in the architect's part plans, and regression risks.
---

# QA Test Planning

Playbook step **S3.5** (`qa`). Paths, gates, and routes come from your step card.

## When to use
- **New plan:** the design and delivery plan are approved (G4); plan while developers build.
- **Update for a change:** an approved requirement change affects acceptance criteria and the test plan already exists.

## Input
- Acceptance criteria and scenarios (PRD §8–9).
- The Tests and Security requirements sections of each part plan, and the plan index's release points.
- Measurable non-functional requirements (PRD §7) and the architecture's scale approach.
- Impact analysis in existing-repo mode.
- Update for a change: the existing test plan, the approved change request (its proposed PRD changes), and the new baseline's changed sections; the part plans the change touched.

## Process

### Update for a change
1. From the change request, list the acceptance criteria added, changed, and removed, by ID.
2. Apply steps 1–7 below to those criteria only; edit their rows in place and leave every other row unchanged.
3. Remove or mark withdrawn the rows of removed criteria; never leave a row testing a criterion the baseline no longer contains.
4. For each changed criterion a merged slice part was already checked against, name that part in the plan so the recheck is visible.

### New plan
1. Map each material acceptance criterion to a method: automated, manual, or exploratory.
2. Fill gaps the part plans' tests leave.
3. In existing-repo mode, add a regression set from the impact analysis.
4. Plan a check for each measurable non-functional requirement — performance, load, availability, accessibility — in an environment that can show it; list any requirement without a measure as untestable.
5. Define environments (local, CI, staging) and entry and exit criteria.
6. Name the checks each slice part gets when it merges, and the end-to-end, regression, and non-functional tests each release point gets.
7. State which failures are blocking; list out-of-scope checks and why.

## Output
- Test plan in the shape of the `TEST-PLAN.md` template.
- An untestable or contradictory criterion is handed to `requirements-analyst`, not reinterpreted.

## Quality checklist
- [ ] Every material AC is covered or explicitly deferred with an owner
- [ ] Regression set present in existing-repo mode
- [ ] Every measurable non-functional requirement has a check, or is listed as untestable
- [ ] Blocking versus non-blocking failures are defined
- [ ] An update touched only the changed criteria's rows, and named every merged part checked against an old criterion
