---
name: similar-solution-research
description: Research how similar problems are already solved and disposition each idea, so requirements are informed without copying a product.
---

# Similar-Solution Research

Playbook step **S1.3** (`requirements-analyst`). Paths, gates, and routes come from your step card.

**Blocked vs defer** (`.cursor/sdlc/AGENT-RULES.md`). **Blocked** here: research leaves two valid product directions.

## When to use
- The problem and scope are clear enough to do research.

## Input
- Clarified problem, users, objectives, and draft scope.
- Impact findings when project mode is `existing-repo`.
- Known constraints (compliance, platforms, must-keep behavior).

## Process
1. Restate the job to be done in one sentence. Search for that problem, not for a pre-chosen product.
2. Gather about 2–5 comparables: competitor or adjacent products, prior internal attempts, open-source or industry patterns, known failure modes.
3. For each, record problem match, approach, what worked, what failed or users rejected, and fit for this request. Cite sources; label uncertainty.
4. Disposition every material idea: **adopt** (informs a requirement), **reject** (with reason), or **defer** (not this release). Do not import a feature list.
5. Separate **problem lessons** (behavior, edge cases, success measures), which may shape the specs, from **solution patterns** (architecture, vendors, UX mechanics), which stay in the research paper for the architect — never in the PRD or a spec.
6. Do not derive rules or numeric targets from what others claim or charge.
7. Requirements informed by research carry Status **Proposed** until the user agrees; speculative constraints are recorded as an **Assumption**.
8. Keep the paper to the comparables table and the dispositions, at most 30 lines; cite sources by link, not by quoting them.

## Output
- Optional research paper: comparables, sources, dispositions, solution patterns.
- Updates only to the PRD (problem evidence, capabilities and scope) or this request's specs (scope and exclusions), and to their constraints, risks, and non-blocked open questions.

## Quality checklist
- [ ] Search is anchored on the stated problem
- [ ] A few relevant comparables, not a market survey
- [ ] Every material idea is adopted, rejected, or deferred
- [ ] Sources are cited and uncertainty is labeled
- [ ] No competitor feature was copied into requirements
- [ ] No architecture was added to the PRD or a spec
- [ ] Product-direction choice was asked when blocked
