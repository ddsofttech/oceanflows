---
name: business-rules-and-scenario-analysis
description: Make business rules, workflows, decision logic, state changes, and normal and exceptional scenarios explicit.
---

# Business Rules and Scenario Analysis

Playbook step **S1.5** (`requirements-analyst`). Paths, gates, and routes come from your step card.

**Blocked vs defer** (`.cursor/sdlc/AGENT-RULES.md`). **Blocked** here: an unknown threshold, rule, or branch that blocks the rules (section 8) or the acceptance criteria (section 9).

## When to use
- Rules or conditional behavior are complex.
- Several actors, systems, states, or exception paths exist.
- Stakeholders disagree about process behavior.

## Input
- Current PRD draft.
- Policies and the parts of the repository that encode existing rules.
- Stakeholder answers.

## Process
1. Identify business concepts, actors, entities, states, and events.
2. Extract explicit rules and record their source. Separate confirmed rules from assumptions (section 10) and unresolved decisions.
3. Map the normal workflow: actors, decisions, inputs, outputs, state changes.
4. Explore relevant alternate, invalid-input, permission, duplicate, retry, cancellation, recovery, and exception paths.
5. Use the simplest useful form inside **section 8** (bullets, tables in place of template bullets — do not add new `##` headings).
6. Trace rules and scenarios to requirement IDs.

## Output
- PRD **section 8** only (rules, workflows, exceptions, scenarios).
- Optional working paper in the `BUSINESS-RULES-AND-SCENARIOS.md` template shape — **not** a PRD section.

## Quality checklist
- [ ] Material rules have a description and a source
- [ ] Rules are separated from assumptions
- [ ] Normal workflows are described
- [ ] Relevant alternate and failure paths are identified
- [ ] Important states and transitions are explicit
- [ ] Blocking rule gaps were asked, not only logged in section 11
- [ ] No extra PRD headings beyond the template
