# Pull Request

## Summary
- Slice part (ID from the plan):
- Fixes (review findings or defect IDs), for a fix PR:
- What changed, in one or two sentences:

## Acceptance criteria and security requirements
| AC or security requirement ID | How this PR meets it | Test that proves it |
|---|---|---|

## Approach
- The simplest design that meets the criteria (3–5 lines):
- New abstractions, layers, or dependencies, and why each is needed now:
- Declared refactors (each in its own commit):

## Reuse and compatibility
- Existing code reused as is:
- Existing functions or components extended:

| Extended unit | Callers found | Existing behavior pinned by tests | Compatibility kept, or breaking change and callers updated |
|---|---|---|---|

- New code created, and the existing code searched for first:

## Scope
- Files changed outside the part plan's expected files, and why:
- Planned size versus actual diff:
- Issues found outside the slice part, reported as findings (not fixed here):

## Assumptions and open questions
-

## Consults relied on
| Handoff or ADR | Question | Answer applied |
|---|---|---|

## Verification
| Command or check | Result |
|---|---|

- Tests written first that failed before the change:
- Callers' tests run:
- Screenshots (UI changes):
- CI status:

## Risk
- Review class (Routine / Important / Sensitive): the plan's, or raised, and why:
- Auth, PII, payments, secrets, or infrastructure touched:
- Dependencies added or upgraded, and their dependency-audit result:
- Migrations and their order:
