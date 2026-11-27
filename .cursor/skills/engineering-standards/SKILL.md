---
name: engineering-standards
description: Record the codebase's engineering standards — structure, layer boundaries, naming, errors, logging, configuration, data access, testing, and dependencies — and the tools that enforce them, so every slice is built and reviewed against one definition of clean code.
---

# Engineering Standards

Playbook step **S3.1** (`architect`). Paths, gates, and routes come from your step card.

## When to use
- The product has no engineering standards yet.
- The design introduces something the standards do not cover: a new layer, language, framework, data store, or integration style.
- Review keeps finding the same kind of inconsistency.
- The UX review raised a missing UI check.

## Input
- The current repository: structure, existing code, lint, format, type, and test configuration, CONTRIBUTING or similar docs. Greenfield: the proposed stack.
- The existing engineering standards, if any.
- Non-functional requirements in this request's specs, and the PRD's constraints.

## Process
1. **Existing repo: describe what is there, do not invent.** Read representative modules in each layer and record the conventions the code already follows. Where the code is inconsistent, name the majority pattern as the standard and list the exceptions; never plan a rewrite to fit the standard.
2. **Greenfield: propose the fewest conventions that cover the stack**, using the stack's mainstream defaults over custom rules.
3. Cover, in short rules with one example each:
   - **Structure and boundaries:** folders and modules, layers, and which layer may depend on which.
   - **Naming:** files, types, functions, variables, tests.
   - **Errors:** how errors are raised, wrapped, mapped to responses, and never swallowed.
   - **Logging and observability:** structured fields, levels, what must never be logged (secrets, PII).
   - **Configuration and secrets:** where configuration lives; secrets only from the secrets store.
   - **Data access:** where queries live, migrations style, pagination and transaction conventions.
   - **Testing:** levels, location, naming, fixtures, what each level covers, deterministic tests only.
   - **Dependencies:** when a new one is allowed, and the vetting it needs.
   - **UI** (when the product has one), under structure and boundaries: the design-tokens file, where stories live, the catalog doc block each component carries (`design-system-design`), and no hard-coded design values.
4. For each rule a tool can check, name the tool and its configuration. Rules a tool checks are not repeated as review comments.
5. Choose one tool for each **required quality gate**, so every check a tool can make, over-built code and security alike, runs on every PR, not on a reviewer's judgement:

   | Gate | Catches | Examples |
   |---|---|---|
   | Format | Style noise in diffs | Prettier, Black, ruff format, gofmt, dotnet format |
   | Lint | Bugs and unsafe patterns | ESLint, ruff, golangci-lint, Roslyn analyzers |
   | Types | Type errors | tsc, mypy, pyright, the compiler |
   | Duplication | Copied code instead of reuse | jscpd, PMD CPD, Sonar |
   | Unused code | Helpers, exports, files, and dependencies nothing uses | knip, ts-prune, vulture, staticcheck, .NET IDE0051/IDE0052 |
   | Complexity | Functions too long, deep, or branchy | ESLint `complexity` and `max-depth`, ruff `C901`, radon, gocyclo |
   | Dependency audit | On every added or upgraded package: known vulnerabilities, a disallowed license, and a name that is not the intended package (unknown, look-alike, or not in the registry) | npm audit, pip-audit, govulncheck, OWASP Dependency-Check; license-checker, pip-licenses; Socket, Dependabot dependency review |
   | SAST | Injection, unsafe APIs, and dangerous sinks in the code | Semgrep, CodeQL, Bandit, gosec, eslint-plugin-security |
   | Secrets | Credentials in code or history | gitleaks, trufflehog, detect-secrets |
   | Tests and coverage | Untested changed code | The test runner, with coverage on changed lines (diff-cover or the CI's equivalent) |
   | Change size | A diff far beyond the plan | `.cursor/sdlc/scripts/sdlc-check.py --request <request-summary> --part <slice-part ID> --base <base branch>`, the part ID taken from the PR's summary, against the budget in step 7 |
   | Accessibility *(UI)* | Contrast, labels, and roles broken on a screen | axe-core on every story, pa11y, the component explorer's accessibility check |
   | Design tokens *(UI)* | Hard-coded colors, sizes, and durations | stylelint `declaration-strict-value`, an ESLint rule on inline styles |
   | UI catalog *(UI)* | Components missing from the catalog, or a stale catalog | `.cursor/sdlc/scripts/ui-catalog.py --check` with the source and token paths of step 3 |

   Prefer the stack's mainstream tool and one already in the repository. A gate with no tool for the stack is marked not applicable with the reason. Dependency audit, SAST, and Secrets are the **security gates**: when `security-engineer` is consulted, it checks them against the threat model; you keep the table.
6. **Gate only what the change adds.** Run each gate on the base branch and on the PR, and fail only on findings the PR adds, so existing code never blocks a PR. In an existing repo, set each limit at today's level; tighten it later, never by rewriting old code.
7. Set the **change-size budget**: changed lines (excluding tests, generated files, and `docs/`) for a small, medium, and large slice part, from the size of typical recent changes in this repository, or the stack's norms for greenfield.
8. Mark each rule and tool as **existing** or **proposed**.
9. Keep it short: a rule nobody can check or remember is removed.

## Output
- The engineering standards, created or updated in the shape of the `ENGINEERING-STANDARDS.md` template.
- The required quality gates with their tools, limits, and change-size budget, for the implementation plan and S3.4.

## Quality checklist
- [ ] Existing-repo rules describe the code as it is, with the majority pattern named
- [ ] Every area in step 3 is covered, or marked not applicable
- [ ] Each rule has one example
- [ ] Tool-checkable rules name their tool and configuration
- [ ] Every required quality gate has a tool and a limit, or is marked not applicable with the reason
- [ ] Gates fail only on findings the change adds
- [ ] The change-size budget is set
- [ ] Proposed rules are marked; no rewrite of existing code is implied
