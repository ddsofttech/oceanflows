# Agent rules

Every agent reads this file before acting. It holds what every agent needs on every step: how it receives work, the non-negotiables, findings and change control, handoffs, and the operating protocol. Everything else about a step arrives in its step card. Do not read `.cursor/sdlc/AGENT-SDLC-PLAYBOOK.md` as a whole.

## Invocation

The orchestrator passes, in the delegation prompt:

- Step ID or run of steps, `<request-summary>`, profile (Light, Standard, or Full), mode (`greenfield` or `existing-repo`), and route (Normal or Defect).
- The **step card**: the rows of each step, copied verbatim from the playbook (Agent, Skill, Input, Output, Stop?, Next, On Approve / Revise / Reject); the playbook section 18 row of each check or gate those steps lead to; and the profile's row from playbook section 5.
- Any human decision, review finding, defect, or handoff answer to apply, with its `DECISION-LOG.md` row, PR, or defect ID. When resuming a stopped step, also the step to resume at and the questions the answers reply to.
- For a handoff you receive: the handoff itself, and the step card of the step it concerns.

A **run** is consecutive steps you own with no HITL between them (for example S1.1–S1.7, S4.1–S4.2, S6.1–S6.2). Work through it in order and end it at the first stop, after reading ahead for questions (Blocked vs defer).

Paths in a step card are relative to `docs/<request-summary>/`, except those starting with `docs/` or `.claude/`, which are from the project root. If the card points to a playbook section you need (for example "section 7"), read only that section: find its heading with a search, then read that range. If the step card is missing, return one question asking for it and stop.

**Route words.** **Revise** = keep the same gate; rework from the feedback and return to the human. **Reject** = abandon the current proposal and follow the step's Reject route; never invent a silent alternative. **New request** (G1 only) = do not approve yet; the PRD draft stays open for the next request.

## Non-negotiables

1. Agents never self-grant a HITL step. The orchestrator records the human's words verbatim in `DECISION-LOG.md`.
2. No production deploy without **Approve (Go)** at G7 (S6.3).
3. Do not invent business rules, numeric thresholds, or targets. Ask when a missing answer would force an invention.
4. Do not load the whole repository or every document up front. Open only what the current step needs. When a part plan, finding, or defect points to a section, ID, or line range, read that, not the whole file. For requirements, read your request's feature specs, and the PRD only for the IDs they inherit or a workflow or rule your step names; never every spec.
5. Evidence before assumptions. Label uncertainty. If sources disagree, a later decision that clearly supersedes an earlier one wins, and you note what it replaced; otherwise report both and name who should resolve them.
6. Combining work, as the Light profile allows, never removes a HITL gate.
7. A tool call refused by the project's SDLC guard is a rule, not an error: never retry it another way. Report it in your final message.
8. Only the orchestrator writes `delivery/BOARD.md`, `DECISION-LOG.md`, and `decisions/`. Report status changes, PRs, and decisions in your final message instead.

## Writing documents

Write for the next agent, who pays for every line it reads.

1. Tables and IDs, not prose. Do not summarize what you read, and do not restate another document: name its ID or path.
2. Name a source once, in the Source column or the change history; never in parentheses in every sentence.
3. A living document states only the current state. How it got there belongs in its change history, the decision log, and git.
4. Put an answer to a handoff where its owner keeps decisions (an ADR, a rule, a security requirement), not in a new section.
5. A passing check is one line with its evidence. Detail is for failures and for what was not verified.
6. Write `n/a` under a section that does not apply.

## Findings and change control

A **finding** is anything an agent reports that needs action or a decision: a requirement gap, a UX defect, a design risk, a review comment, a security issue, a test failure, an incident. Classify every finding with a **type** (which sets the owner and route), a **severity**, and, when it touches approved intent or scope, a **change class**.

### Severity

One scale for every stage.

| Severity | Meaning | Security rating | Incident |
|---|---|---|---|
| **Blocking** | The affected work cannot be designed, built, merged, released, or kept running soundly until this is resolved or its scope is formally redefined | Critical, High | **Sev-1**: outage, data loss, or security breach in production — page the human |
| **Important** | A decision or mitigation is needed before the affected work proceeds safely. Needs an owner and an explicit disposition | Medium | Sev-2: degraded service or a broken key flow with a workaround |
| **Non-blocking** | Understood and safely deferrable. Record the rationale and any follow-up condition | Low, Informational | Sev-3: minor or cosmetic |

Do not label every unknown as Blocking. A Blocking finding is resolved, formally deferred by the human at the next gate, or turned into a scope change through S1.C — never waived by the agent that found it.

**Blocked vs defer.** A Blocking gap that only the human can answer stops the step. Finish the rest of the step first. Then, if it is part of a run, read ahead through the run's later steps: for each, record in its output only the questions it would raise, marking any that depend on an open answer (for example "if Q2 = b"). Never write requirements, rules, or criteria that depend on an open answer, and treat no later step as done. End the run with every Blocking question found, all in one stop, never a subset. The orchestrator then starts a new session at the blocked step with the answers, and the steps run in order from there. Before stopping, write everything done so far to the step's outputs: a later session resumes from those files, not from your memory. When resuming, read the outputs, apply the answers, and do not redo completed steps. Important and Non-blocking gaps are recorded where the step's output says (in S1, the open questions of the PRD or the spec they affect) and the step continues. Each skill says what counts as Blocking for its step.

### Change classes

Change classes apply to findings measured against what is approved: the **requirements baseline** (the PRD and feature specs), the UX brief, or the design and delivery plan approved at G4.

| Class | Meaning | What to do |
|---|---|---|
| **A. Clarification** | Clarifies an approved requirement or contract without changing business intent or scope | Record it in the affected document and continue. After G1 the baseline is never edited: requirement clarifications go to the request's `analysis/finding-notes.md` |
| **B. Gap or risk** | Missing, uncertain, contradictory, or risky information that can be resolved within approved intent | Record it with an owner and a recommended resolution in the affected document; do not silently create a requirement. After G1, requirement gaps and risks go to the request's `analysis/finding-notes.md` |
| **C. Requirement change** | Resolving it would add, remove, reprioritize, or materially change approved requirements, acceptance criteria, or scope | Pause the affected work, write a change request in the request's `change-requests/` (shape: `CHANGE-REQUEST.md` template), and return it for **S1.C**. Nothing is treated as baseline until the human approves |

**Design changes after G4.** A design change that alters what G4 approved — the stack, an external contract (an added response, field, or endpoint counts), the data model or data ownership, or the security posture — goes back to the human at G4 for that change, whoever raised it, even when it stays within approved intent and the human already chose a figure or option for it. `architect` records it as a proposed ADR, and work that depends on it waits for the decision. Any other design change within approved intent is an ADR and the work continues.

**Class C can be raised by any agent at any stage.** Typical sources:

| Stage | Example |
|---|---|
| S2 | Designing a screen shows an approved flow cannot work as written |
| S3 | A requirement is infeasible or needs a trade-off that changes intent |
| S4 | Implementing a slice part needs behavior the approved feature spec does not contain; code review finds scope creep; security review finds a requirement cannot be met safely |
| S5 | An acceptance criterion is wrong or contradicts another |
| S7 | A success measure turns out to be the wrong measure |

### Finding types and routes

| Type | Raised at | Owner | Route |
|---|---|---|---|
| Requirement defect | S1–S5 | `requirements-analyst` | Fixed in S1 before G1; after G1 → S1.C |
| Business decision | Any | The human, prepared by `requirements-analyst` | An open question, constraint, or assumption in the PRD or the feature spec it affects, or a short HITL in S1 |
| UX defect | S2.4 | `designer` | S2.1 for a screen spec, S2.3 for UI; failed screens only |
| Design need | S3.1–S3.2, S4.1, S5.1–S5.2 | `designer` | A screen the feature spec and the UI catalog cannot settle, or a usability concern found after S2: S2 for those screens only, then the paused work resumes |
| Usability concern | S2.4, S5.1–S5.2 | `designer` | In S2, fix the screen as a UX defect; after S2, a design need. Class C when approved intent must change |
| Missing UI check | S2.4 | `architect` | Recorded in `ux/UX-REVIEW.md`; `architect` adds the check to the engineering standards at S3.1 |
| Technical risk or uncertainty | S1.2, S3 | `architect` | Risk or ADR in `design/ARCHITECTURE.md`; Class C if infeasible |
| Code review finding | S4.3 | Slice-part owner | Fix in the same PR: S4.1 → S4.2 → S4.3 |
| Security finding | S3.1, S4.4 | Slice-part owner; `architect` when the fix is a design change | Fix in the same PR: S4.1 → S4.2 → S4.4, or a design consult; Blocking stops the merge |
| Product defect | S5.1 (including an issue the human reports), S5.2, S6.2 | Slice-part owner | Fix through S4.1–S4.5, then retest the defect and its affected regression where it was found |
| Flaky test | S4.2, S5.1–S5.2 | Author of the test | Fix or quarantine with an owner; never counted as a product pass or fail |
| Environment issue | S3.4, S4.2, S5.1–S5.2, S6.2 | `devops` | Fix the environment, then rerun |
| Incident | S6.4, S7.1 | `devops` | Sev-1 pages the human; corrective work → S7.4 |
| Enhancement request | Any | `requirements-analyst` | Deferred to the next cycle through S7.4; never absorbed into the current slice |

When a finding needs someone else's decision, label it **business decision**, **architecture decision**, **implementation detail**, or **evidence gap**. Recommend options; do not decide for the owner.

## Handoffs

Agents never talk to each other. When you need another role — a design or contract question, a security doubt, an unclear acceptance criterion, a defect or finding for a slice-part owner, a CI or environment failure — hand it off through the orchestrator. Never answer for that role, and never edit its files or code.

1. Finish all work that does not depend on the answer, and batch every question for the same role.
2. End the run with a handoff: **to** (role), **type** (consult, defect, finding, contract, or environment), the question or problem, the evidence (files, PR, test, logs), what you are blocked on, and what you finished meanwhile.
3. A defect also follows the defect shape (`DEFECT.md` template), in the issue store or as its own file in `testing/defects/`.

When you **receive** a handoff, answer within your role, record the decision where your documents say (for example an ADR, a threat-model note, or a clarification), and return. A question outside your authority gets a finding label (below) instead of an answer.

## Operating protocol

**Before acting**

1. Confirm the previous gate evidence exists (approved PRD version, UX brief or G3-accepted UX review, G4 design and delivery plan, green CI, merged SHA, staging evidence; for a defect request, the defect record stands in for G1–G4). If it is missing, stop and report.
2. Read the skill named on the step and open only the inputs the step needs.
3. If a required input is missing or unusable, return one focused question and stop.

**While acting**

4. Write only the outputs the step names, and only inside the project. Avoid temporary files; when one is unavoidable, keep it inside the project and delete it before you return.
5. Change existing documents with targeted edits; never rewrite a whole file to change part of it. Write a whole file only when creating it.
6. Classify findings as above.
7. Work on your own branch, in your own worktree when you have one; never switch the branch of a checkout you did not create. Commit process documents to `release/<request-summary>`: from a worktree, push your commit to it as a fast-forward, or give its commit ID to the orchestrator.

**Gates.** Agents cannot talk to the human. At a HITL step, return the package and stop. The orchestrator relays the decision in a new session for that step, which follows that step's Approve / Revise / Reject route.

**Final message to the orchestrator:** steps completed; artifacts written (paths) or PR links; gate status; findings by severity and owner; the exact decision or question needed, if any. At most 15 lines, or the handoff fields when you hand off: point to the files that hold the detail instead of repeating them. A gate package is the exception: it holds what the human needs to decide.
