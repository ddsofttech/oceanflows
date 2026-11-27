---
name: implementation-planning
description: Break the architecture into sequenced vertical slice parts with front-end and back-end owners, dependencies, and release points, and write one short part plan per slice part — sources to read, code to reuse or extend, security requirements, tests — plus CI quality gates and a rollout sketch.
---

# Implementation Planning

Playbook step **S3.2** (`architect`). Paths, gates, and routes come from your step card.

## When to use
- The architecture is drafted; the plan goes to the human with it at G4.
- A gate (G4–G7) or a loop escalation sends the plan back to replan a slice part or release point.

## Input
- Approved architecture and ADRs, including security design items.
- The threat model's per-slice security requirements.
- The engineering standards and their CI quality gates.
- Acceptance criteria and impact/regression notes.
- The UX brief and handoff note, when S2 ran: the components G3 accepted, and the API data the UI assumes.

## Process
1. Slice the work into vertical increments mapped to acceptance criteria.
2. Split each slice into front-end and back-end parts, one PR each, assigned to `frontend-developer` and `backend-developer`. Give each part an ID and the parts it depends on; a back-end part that defines a contract comes before the front-end part that uses it. When G3 accepted built screens, the front-end parts for them reuse their components instead of rebuilding them, and one front-end part per flow, in the release point that first ships the flow, deletes its prototype shell.
3. For each slice part, search the codebase and name:
   - the files expected to change;
   - the existing functions, modules, and components to reuse or extend, with their callers;
   - areas out of bounds for the slice;
   - a rough size (small, medium, large), so review can spot a diff far beyond it;
   - its review class (Routine, Important, or Sensitive) by the criteria in your step card, which decides who reviews its PR. When unsure, take the higher class.
4. Give each shared piece one owner: when two slice parts need the same new code, the earlier slice builds it and the later ones reuse it.
5. Attach the threat model's security requirements to the slices they apply to.
6. Sequence by dependency and risk, contracts and shared pieces first; mark which parts can run in parallel; identify spikes.
7. Group slice parts into **release points**: each one ships something a user can use and is tested and released as a whole. One release point is fine when the request is small.
8. Outline unit, integration, and end-to-end tests per slice part, including the security requirements.
9. Sketch migrations, rollout, and feature flags.
10. Name the CI pipelines and environments `devops` must provision, and point to the engineering standards for the quality gates instead of listing them; for greenfield, when the scaffold is created. Name the git host; when the project has none, raise it for G4 as something the human must provide before build.
11. Write one part plan per slice part. Its readers — the developer, its reviewers, and `qa` — get only this file, so it must be enough to build and check the part:
    - point to every source the part needs by ID or section (acceptance criteria, system-architecture containers and components, ADRs, contract operations, data-model entities, threat IDs, UX screens and components, standards sections) instead of copying it;
    - a part plan that will not fit the size limit in your step card is a part to split, not a plan to compress.

## Output
- The plan index in the shape of the `IMPLEMENTATION-PLAN.md` template.
- One part plan per slice part in the shape of the `PART-PLAN.md` template.

## Quality checklist
- [ ] Every in-scope AC maps to a slice or an explicit deferral
- [ ] Every slice part has an ID, an owner, dependencies, a release point, a size, and a review class in the index, and a part plan with expected files, code to reuse or extend, security requirements, and tests
- [ ] Every part plan fits the size limit and points to its sources rather than copying them; a developer could build the part from it and those sources alone
- [ ] Every release point ships something usable on its own
- [ ] Reuse candidates and their callers were found by searching the codebase, not assumed
- [ ] Every shared piece has exactly one building slice
- [ ] Every security requirement is attached to a slice and its tests
- [ ] Risky items are scheduled early
- [ ] No scope beyond the approved baseline
