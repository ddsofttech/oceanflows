---
name: qa-test-execution
description: Check each merged slice part, run the release test for each release point, hand defects to their owners, retest fixes, and prepare the G6 recommendation.
---

# QA Test Execution

Playbook steps **S5.1, S5.2**, and the S5.3 (G6) package (`qa`). Paths, gates, and routes come from your step card.

## When to use
- **Slice check:** a slice part has merged.
- **Release test:** every slice part of a release point is merged and checked.
- **Retest:** a fix for a defect has merged.
- **Reported issue:** the human reported an issue.
- **Recheck:** an approved requirement change updated the test plan, and it names a merged part checked against an old criterion.

## Input
- Slice check: the part's rows in the test plan and its part plan. Release test: the release point's rows in the test plan and its test report so far. Retest: the defect record. Recheck: the part's changed rows in the test plan. Reported issue: the human's report.
- Build under test, issue store access.

## Process
1. Slice check: run the part's planned checks on the integrated build. Read only the part's rows of the test plan, not the whole plan.
2. Release test: run the end-to-end, regression, and non-functional suites and the planned manual and exploratory checks on the release candidate; capture logs and results.
3. File each defect as its own record with its type, severity, owner, and steps to reproduce, in the shape of the `DEFECT.md` template, and hand it to the slice-part owner (Handoffs, `.cursor/sdlc/AGENT-RULES.md`). A retest updates that record's status and history; it never files a second record for the same defect. Keep flaky tests and environment issues out of product pass/fail results; hand environment issues to `devops`.
4. Reported issue: reproduce it on the latest build that contains the affected code before judging it. When it reproduces, file it as in step 3 with its type; when it does not, return the steps and evidence you ran instead of a record. Never file a defect you could not reproduce.
5. Retest each merged fix, plus the regression around it. Recheck a named part against its changed rows only; a part that no longer meets a changed criterion is a product defect for its owner, filed as in step 3. A defect that fails retest twice is handed to `architect` for a root cause.
6. For G6, recommend pass, pass with known issues (Important or Non-blocking only), or fail. List every Blocking or Important gap or risk still Open in the clarifications, with its owner and recommended resolution, for the human to accept, defer, or send back.

## Output
- The release point's test report, in the shape of the `TEST-REPORT.md` template; one record per defect in the issue store or in the shape of the `DEFECT.md` template; the G6 recommendation.

## Quality checklist
- [ ] The plan was executed, or deviations are recorded
- [ ] Every defect has a severity, a type, and an owner
- [ ] No blocking defect was waived
