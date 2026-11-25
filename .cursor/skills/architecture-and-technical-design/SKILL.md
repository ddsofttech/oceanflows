---
name: architecture-and-technical-design
description: Propose the simplest technical architecture that meets an approved PRD — options, scale approach, machine-readable contracts, data model, and ADRs — and keep the C4 model of the whole system current, ready for human architecture approval.
---

# Architecture and Technical Design

Playbook step **S3.1** (`architect`); the design is decided at G4 with the delivery plan. Paths, gates, and routes come from your step card.

## When to use
- The PRD is approved and S2 is finished, or skipped because G1 confirmed no design trigger.
- A developer's design or contract consult during delivery, or a defect that failed retest twice and needs a root cause.

## Input
- Approved PRD; impact analysis and research solution patterns.
- The UX handoff note, or the UX brief when S2 ended without a review.
- The system architecture, when it exists; otherwise the current repository's structure. The engineering standards.
- The threat model from `security-engineer`, when consulted.

## Process
1. Restate constraints, non-functional requirements, and integration points from the evidence.
2. Turn binding UX constraints and must-become-real simulations into explicit design items, and the API data the UI assumes into contract operations, or say why the contract differs. When S2 did not run and a changed screen cannot be settled from the PRD and the UI catalog, hand off a design need for it instead of designing it.
3. **Existing repo:** design within the current architecture and its patterns. A departure needs an ADR that names what the current approach cannot do.
4. **Options:** always include "extend what exists", the simplest design that meets the requirements. Recommend a heavier option (new service, queue, cache, store, framework, or generic mechanism) only when a stated requirement needs it, and say which. Prefer decisions that are cheap to reverse.
5. **Scale:** from the PRD numbers, state expected load, data volume and growth, and the hot paths; then decide storage and indexes, pagination, caching, sync versus async work, and what scales out. A missing number becomes a question, not an invented threshold.
6. **Contracts:** define every API, event, and data contract as a machine-readable schema (for example OpenAPI or JSON Schema) both sides can generate types from. State the error model and, for existing contracts, how compatibility is kept.
7. **Data model:** entities, keys, constraints, indexes for the hot paths, and the migration approach for existing data.
8. Define failure modes and the behavior for each, and the metrics and logs needed to run it.
9. **System architecture (C4).** Keep one C4 model of the whole system, in the shape of the `SYSTEM-ARCHITECTURE.md` template:
   - If none exists, create it: in an existing repository from the code as it is before this change, in greenfield from this design.
   - Apply this request's change: containers, components, which may depend on which, and trust boundaries. Levels 1 (context) and 2 (containers) always; level 3 (components) only for containers this request changes; never level 4 — the code is the truth there.
   - One row per element, tagged with this request in its Since column, and one change-history row; list the changed element IDs in the design's change section. Point to code and contracts instead of describing them.
   - A change request that affects an approved design updates the model the same way.
10. Fold in the threat model: each design-level mitigation becomes a design item.
11. Update the engineering standards with `engineering-standards` when the design needs a rule they lack.
12. Record an ADR for each material decision and each new dependency or technology; mark assumptions.
13. Flag infeasible or risky requirements as Class B or C; never drop or shrink one silently.

## Output
- Architecture document in the shape of the `ARCHITECTURE.md` template: this request's design and its change to the system architecture.
- The system architecture, created or updated, in the shape of the `SYSTEM-ARCHITECTURE.md` template.
- During delivery, answers to design consults: a clarification, or an ADR for a design change within approved intent.

## Quality checklist
- [ ] Every design element traces to approved requirements
- [ ] "Extend what exists" was an option; anything heavier names the requirement that needs it
- [ ] The scale approach rests on stated numbers or open questions, not invented ones
- [ ] Contracts are machine-readable schemas with an error model and compatibility stated
- [ ] Hot paths have indexes and bounded queries in the design
- [ ] Existing-repo designs follow the current architecture, or an ADR explains why not
- [ ] The system architecture shows this request's change at C4 levels 1–2, and level 3 only for changed containers; every changed element is tagged with this request
- [ ] Risks and open questions have owners
- [ ] No requirement silently dropped
