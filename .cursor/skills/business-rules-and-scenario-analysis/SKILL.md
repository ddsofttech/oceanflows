---
name: business-rules-and-scenario-analysis
description: Make business workflows, rules, decision logic, state changes, and normal and exceptional scenarios explicit — end-to-end workflows and shared rules in the PRD, feature detail in its spec.
---

# Business Workflows, Rules, and Scenarios

Playbook step **S1.5** (`requirements-analyst`). Paths, gates, and routes come from your step card.

**Blocked vs defer** (`.cursor/sdlc/AGENT-RULES.md`). **Blocked** here: an unknown threshold, rule, or branch that blocks the rules or the acceptance criteria.

## When to use
- Rules or conditional behavior are complex.
- Several actors, systems, states, or exception paths exist.
- Stakeholders disagree about process behavior.

## Input
- This request's specs and the PRD's business workflows and rules.
- Policies and the parts of the repository that encode existing rules.
- Stakeholder answers.

## Process
1. Identify business concepts, actors, entities, states, and events.
2. **Business workflows (PRD).** Keep each end-to-end workflow the request touches current: at most 8 steps, each actor → action → outcome, naming the feature that covers it. Business level only: no screens, fields, states, or error handling. Add a workflow only for a new end-to-end business process.
3. **Rules.** Extract explicit rules with their source. A rule two or more features depend on, or that holds for the whole product, goes in the PRD; any other goes in its feature's spec. Separate confirmed rules from assumptions and unresolved decisions.
4. **Feature detail (spec).** For each workflow step this feature covers: the detailed flow, the states and transitions, and the alternate, invalid-input, permission, duplicate, retry, cancellation, recovery, and exception paths that are relevant, as scenarios.
5. Use the simplest useful form: a table or a short list in the template's sections, never a new heading. Refer to a rule by its ID instead of restating it.
6. Trace rules and scenarios to requirement IDs.

## Output
- The PRD's business workflows and product-wide rules, and this request's specs: rules, workflow detail, states, exceptions, and scenarios.

## Quality checklist
- [ ] Each workflow the request touches is current in the PRD, at business level, within 8 steps
- [ ] Material rules have a description and a source, in the PRD or a spec, not both
- [ ] Rules are separated from assumptions
- [ ] Relevant alternate and failure paths are identified in the spec
- [ ] Important states and transitions are explicit
- [ ] Blocking rule gaps were asked, not only logged as open questions
- [ ] No heading beyond the templates
