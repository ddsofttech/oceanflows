---
name: code-review
description: Review a PR for correctness, contract and acceptance-criteria conformance, test adequacy, maintainability, reuse and compatibility, scalability, simplicity, and scope.
---

# Code Review

Playbook step **S4.3** (`architect`); its summary feeds S4.5 (G5). Paths, gates, and routes come from your step card.

## When to use
- A slice-part PR whose review class needs code review is ready, or a fix was pushed to it.

## Input
- PR diff and description, AC mapping, CI status.
- The part plan — expected files, code to reuse or extend, size — and the contracts and scale approach it points to.
- The engineering standards.
- A re-check: your open findings and the commits since the head you last reviewed.

## Process
**Re-check.** Review only `git diff <last reviewed head>..<new head>` against your open findings: close each one fixed, raise anything new the fix itself introduced, and leave the rest of the PR alone. Post one updated summary; never repeat the first review.

**First review**

Leave formatting and other rules the standards' tools enforce to those tools; review what they cannot see.

**Correctness**

1. Check behavior against the acceptance criteria and design contracts.
2. Review error handling and risky areas.

**Verification**

3. Check that each criterion has a test that would fail without the change, and that the verification section shows checks actually run. CI green with tests that do not exercise the criteria is not evidence.

**Maintainability**

4. Check conformance to the engineering standards: layer boundaries, naming, error and logging model, data access, test conventions.
5. Flag units that do several jobs, unclear names, deep nesting, swallowed errors, and inconsistent error handling.

**Reuse and compatibility**

6. Search the codebase for existing code the PR duplicates; flag it with "extend X instead".
7. Check the PR's compatibility table against the diff: every caller of each extended unit was found, its prior behavior is tested, and nothing breaks silently.

**Scalability**

8. Flag unbounded queries or lists, queries in loops, missing indexes on new access paths, blocking remote calls on hot paths, missing timeouts, and memory growth with data size, against the architecture's scale approach.

**Simplicity**

9. Flag abstractions, layers, helpers, options, or dependencies the slice does not need now, and code for cases the criteria and contracts do not name.
10. Flag code that departs from the codebase's existing patterns without a stated reason.

**Scope**

11. Compare the diff with the part plan's expected files and size. Flag hunks that trace to no criterion, declared extension, or declared refactor, and unrelated reformatting, renames, or refactors.
12. Flag scope creep as a Class C candidate.
13. Flag assumptions made in the code that the PR does not list.

**Report**

14. Post findings with severity (findings, `.cursor/sdlc/AGENT-RULES.md`). These are at least **Important**, so they block the merge: duplicating existing code; an abstraction, helper, layer, or option with a single use or none; code for cases no criterion or contract names; a missing test for a criterion; an unbounded query or list on a hot path; a diff over twice the planned size without a stated reason; a suppressed or reconfigured quality gate. Naming and style the tools do not check are Non-blocking.
15. Each finding is actionable and names the fix: delete, inline, extend, reuse, revert, split, index, bound, or add a test.

## Output
- PR review comments, and one summary comment naming the reviewed head and listing every open finding, for the fix handoff and the G5 package.

## Quality checklist
- [ ] Findings cite AC, contract, or standard IDs
- [ ] Every criterion has a test that exercises it
- [ ] Standards conformance checked beyond what the tools enforce
- [ ] Duplicates flagged; every changed shared unit checked for caller compatibility
- [ ] Scalability checked against the scale approach
- [ ] Unneeded abstractions and unrelated changes flagged
- [ ] Diff size and files were compared with the plan
- [ ] Findings are actionable, severity-tagged, and name the fix
- [ ] Over-built, duplicated, untested, or unbounded code was rated at least Important
- [ ] Scope creep is raised, not absorbed
- [ ] The reviewer authored none of the PR
