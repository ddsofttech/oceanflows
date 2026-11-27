---
name: requirements-clarification
description: Clarify the problem, stakeholders, outcomes, scope, and known requirements, decide which features the request touches, and seed the PRD and those features' specs.
---

# Requirements Clarification

Playbook step **S1.1** (`requirements-analyst`). Paths, gates, and routes come from your step card.

**Blocked vs defer** (`.cursor/sdlc/AGENT-RULES.md`). **Blocked** here: a need that depends on a user decision, or sources that disagree where the later one does not clearly supersede the earlier.

## When to use
- A new idea, feature request, or business problem arrives.
- Requirements are vague, incomplete, contradictory, or solution-first.

## Input

- The request, materials and stakeholder answers.
- The PRD, and the specs of the features its index shows the request touches; nothing else of the product.

## Process
1. Continue the draft; change only what this request requires. When the baseline predates the current templates, such as a single PRD file with no feature specs, first reshape it as your step card's section 7 says. Fold in what any request's finding notes recorded since the baseline: each clarification into the document it clarifies, and each gap or risk still open into that document's open questions or risks.
2. Read every source in date order. Extract each candidate **functional** need (behavior the system must perform) and **non-functional** need (quality attributes: performance, security, availability, compliance, usability targets, etc.) with its source.
3. Understand the business problem, context, affected users, and desired outcome; identify decision-makers, users, affected parties, and subject-matter experts.
4. **Place the request.** Decide which features it changes and which it adds, from the PRD's feature index and capabilities. A new feature gets a short feature ID, a row in the index, and a spec from the `FEATURE-SPEC.md` template. A request that spans features changes each of their specs.
5. Identify ambiguity, contradictions, missing information, and assumptions. Define scope, exclusions, essential needs, and desirable enhancements.
6. Update only these sections:
   - **PRD:** vision, objectives and success measures, users, capabilities and scope, feature index, and product-wide constraints. Only what holds for the whole product or for two or more features.
   - **Each touched spec:** purpose and users, scope, functional and non-functional requirements (one row per material need, with its source in the Source column), and the feature's constraints.
   - **PRD change history:** one row for this request naming the features and IDs it changed.
   Use **Proposed** unless the user or an authoritative source already decided; **Approved** only when authority is explicit.
7. Do **not** state unresolved needs as agreed requirements; a deferrable one goes in the open questions of the document it would change, as **Important** or **Non-blocking**.
8. Where sources disagree, keep the latest decision and note what it replaced; never pick one silently.

## Output
- The PRD and this request's specs, updated in the sections above (open questions only when not blocked).

## Quality checklist
- [ ] Problem and context are clear
- [ ] Outcomes are explicit
- [ ] Relevant stakeholders are identified
- [ ] Every touched or new feature is in the PRD's index, with a spec
- [ ] Product-wide content is in the PRD; feature content is in its spec, and nothing is in both
- [ ] Draft requirements are clear enough to analyze
- [ ] Scope and exclusions are documented
- [ ] Material assumptions are recorded where they apply
- [ ] No heading beyond the templates
- [ ] Blocking gaps were resolved with the user, not only listed as open questions
- [ ] Every conflict between sources is resolved by a later decision or by asking the user
- [ ] This request's changes are identifiable from its change-history row
