---
name: existing-system-impact-analysis
description: Determine how a requested change fits the existing system — what to reuse, extend, modify, or create — and which existing behavior could regress.
---

# Existing-System Impact Analysis

Playbook step **S1.2** (`requirements-analyst`). Paths, gates, and routes come from your step card.

**Blocked vs defer** (`.cursor/sdlc/AGENT-RULES.md`). **Blocked** here: change boundary unknown, must-keep behavior disputed, an evidence gap that changes scope, or a business choice of which disagreeing source governs.

## When to use
- **Project mode is `existing-repo` (brownfield):** the system being changed already lives in the **current repository.**
- The change touches that application: modules, data, APIs, integrations, permissions, or workflows.
- Change boundaries and regression risks are needed before design.

## When to skip
- **Project mode is `greenfield`** — do not run this skill and do not add impact-only PRD sections. The mode comes from the step card; do not re-decide it.

## Input
- Current PRD draft and the last approved PRD. Label the analysis provisional until the draft is approved.
- The system architecture, when it exists: start from its containers and components to find what the change touches.
- The relevant parts of the current repository it points to: source, contracts, schemas, rules, tests, docs.

## Process
1. **Set the change boundary.** Intended outcome, in-scope behavior, exclusions, and baseline version. Separate new behavior from behavior that must stay unchanged. Name unresolved requirements that limit the analysis.
2. **Map requirements to the system.** For each relevant requirement, find the components, workflows, APIs, data, events, integrations, UI, permissions, and tests involved, citing repository evidence. Mark uncertain mappings as hypotheses with a way to verify them.
3. **Classify each affected area** as Reuse, Extend, Modify, Create, or Investigate. Explain why a new component is needed before recommending it over extending an existing one.
4. **Assess only the relevant impact areas:** workflows and rules; modules and boundaries; API and event compatibility; data, migrations, consistency; integrations; auth, audit, privacy, validation; UI and accessibility; performance, reliability, observability; tests; deployment, configuration, flags, rollback.
5. **Find regression risks:** what could break, when, with what consequence, and which existing workflows must keep working. Link proposed regression checks to the affected requirements. Missing evidence is not proof of no risk.
6. **Separate decisions by owner** (business, architecture, implementation, evidence gap). Rate findings **Blocking**, **Important**, or **Non-blocking**.
7. **Recommend the smallest plausible change boundary**, with reuse/extend/modify/create areas, tests, and follow-up investigation. Technical approaches are options for the architect, not a design.
8. If documentation, code, and tests disagree, report the discrepancy. Do not inspect unrelated parts of the system.

## Output
- Impact analysis working paper in the `IMPACT-ANALYSIS.md` template shape — **not** a section in the PRD.
- PRD updates only: sections **6–7** (refined requirements/regression-related NFRs), **10** (risks, dependencies), **11** (non-blocked open items).

## Quality checklist
- [ ] Analysis names the feature and the requirements baseline it used
- [ ] Requirements are mapped to repository evidence; hypotheses are labeled
- [ ] Reuse, extend, modify, create, and investigate are distinguished
- [ ] Regression risks and must-keep workflows are listed
- [ ] Data, API, integration, security, and authorization impacts are considered where relevant
- [ ] Findings have severity, consequence, owner, and next action
- [ ] Blocking findings led to user questions, not only section 11 rows
- [ ] Recommendations are labeled as analysis, not approved architecture
- [ ] No code was modified and no test result was claimed without running it
