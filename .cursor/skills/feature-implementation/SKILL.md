---
name: feature-implementation
description: Implement an assigned slice part with the smallest change that meets its acceptance criteria — extending existing code without breaking its callers, following the engineering standards, proving it with tests — and open a PR ready for review.
---

# Feature Implementation

Playbook steps **S4.1, S4.2** (`frontend-developer`, `backend-developer`). Paths, gates, and routes come from your step card.

## When to use
- The design and plan are approved (G4) and a slice part is assigned to you on the delivery board.
- Review findings or QA defects are routed back to you.

## Input
- The slice part's plan: acceptance criteria, sources to read, expected files, code to reuse or extend with its callers, security requirements, and tests; its size from the plan index.
- The sections the part plan points to, and the engineering standards.
- For a fix: only the open findings or the defect record.
- The current repository, or the scaffold the plan describes for greenfield.

## Process
**Investigate and plan**

1. Read the part plan, the sections it points to, and the code around its expected files; search for existing code and tests that already do part of the work. Open another section of the PRD or design only to answer a question those leave open, and read that section, not the whole document. If a gap would force a guess, hand it off to its owner (`architect` for design and contracts, `security-engineer` for security, `requirements-analyst` for criteria; Handoffs in `.cursor/sdlc/AGENT-RULES.md`) after finishing what does not depend on it.
2. Write a 3–5 line approach: the simplest design that meets the criteria, the code it reuses or extends, and the files it changes. Unless the approach explains why:
   - no helper, class, layer, option, or error handling the criteria and contracts do not need now;
   - no new dependency without `architect`;
   - the codebase's existing patterns over a new one, even a better one.
3. Branch for the slice, or create the scaffold if the plan assigns it to you.

**Extend, don't duplicate**

4. When an existing function or component does most of the job, change it; never add a near-copy beside it. First list its callers, and pin its current behavior with tests if none exist.
5. Extend compatibly: an optional parameter whose default keeps today's behavior, or a wider accepted input; never change its return value, errors, or side effects for existing callers. If a break is unavoidable, update every caller in the same PR and declare it.
6. If the extension needs behavior-switching flags or gives one unit several jobs, raise it in the approach instead of forcing it.

**Build test-first**

7. Write the tests for each criterion and security requirement, and see them fail for the expected reason. Tests check behavior, not implementation details, and are deterministic.
8. Make the smallest change that makes them pass, to the engineering standards; never swallow an error. Any contract change goes to `architect` first.
9. Touch only the slice's files and the code you extend. A refactor the change needs is declared in the approach and kept in its own commit. An issue outside the slice is reported as a finding, not fixed.

**Verify**

10.  Fix every finding CI reports on what the change adds. A gate is never silenced, suppressed, or reconfigured to pass. A finding that must stay (a false positive, or a fix that belongs elsewhere) is added in the PR to the engineering standards' known exceptions, with its reason, owner, and expiry, for the reviews to judge. Exercise the change as a user or caller would.
11.  Self-review the diff: revert hunks that trace to no criterion, declared extension, or declared refactor; delete dead code, debug output, and comments that restate the code; inline new abstractions with a single use; explain any difference in files or size from the plan.
12.  Open one PR for the slice part, described in the shape of the `PULL-REQUEST.md` template, with the consults it relied on. Report only checks you actually ran, with their results; never "should work".
13.  On review findings, fix every open one in the same PR and reply to each with the commit that fixes it. On a QA defect, reproduce it first, find the root cause, write a test that fails because of it, then fix it in a new PR that names the defect. Change only what the findings or defects require.

## Output
- A PR with code and tests, described with the pull request template, and CI status (green, or remaining failures explained).

## Quality checklist
- [ ] Slice AC and security requirements met, or marked blocked in the PR
- [ ] Approach written before the code; nothing built the slice does not need now
- [ ] Existing code extended, not copied; its callers found, its behavior pinned, their tests passing
- [ ] Code follows the engineering standards and matches the contracts; no secrets committed
- [ ] Every hunk traces to an AC, a declared extension, or a declared refactor
- [ ] Tests seen failing before the change and passing after; verification lists commands actually run
- [ ] Assumptions and open questions are listed, not silently resolved
