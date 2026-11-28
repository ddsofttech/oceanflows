---
name: prd-review-and-baseline
description: Review a draft of the PRD and feature specs for baseline approval, or evaluate change requests against the approved baseline, and prepare the package for the human's Approve, Revise, Reject, or New request.
---

# PRD review and baseline

Playbook steps **S1.7, S1.8, S1.C** (`requirements-analyst`). Paths, gates, and routes come from your step card.

## When to use
- **Draft review:** S1.1–S1.6 are done and the draft is to be prepared for, and decided at, G1.
- **Baseline change review:** a change request proposes changing approved intent or scope (Class C), and must be evaluated against the current baseline.

## Input

### Draft review
- The PRD and this request's specs, and the request's sources and analysis papers.
- The human's feedback, when re-entering after Revise or Reject.

### Baseline change review
- The current baseline's PRD and the specs the change touches (read-only).
- The change request(s).
- The same documents in the draft, when one is open.
- The human's feedback, when re-entering after Revise.

## Process

### Draft review
1. Review the PRD and this request's specs against their templates: remove any non-template heading or pasted analysis; fix content when evidence allows.
2. Cut to budget: remove what repeats another document (refer to its ID instead), sources repeated inline, and any account of how the text changed. Product-wide content is in the PRD and feature content in its spec, never both.
3. Refresh the PRD's vision when the request changed it. Sort every open-questions table Blocking → Important → Non-blocking. Set document control to **Pending approval**.
4. While any open question is **Blocking** or **Important**, return them all as questions in one stop, Blocking first. Turn each answer into a requirement, rule, or constraint, and remove the question.
5. Non-blocking rows may be answered now or deferred with the human's explicit consent.
6. Build the G1 package: version, what changed since the baseline grouped by request and feature (from the change history), remaining Non-blocking items, the experience-design recommendation, and the decision asked (Approve, Revise, Reject per request, or New request). For the recommendation, name each design trigger in your step card the approved scope meets, with the requirement IDs that meet it, or say that none does and list the UI changes that will be built without design.
7. On a decision, apply it as the step card routes:
   - **Approve:** set the version to the next `vX.0`, document control **Approved**, and every requirement row still **Proposed** in the specs to **Approved**. Remove closed items: answered questions, Rejected assumptions and constraints, Resolved risks. The PRD and the specs are then copied unchanged as the next baseline.
   - **Revise:** apply the feedback, re-run the affected S1 skills, and repeat from step 1.
   - **Reject:** remove only the named requests' changes, found through the change history. If nothing remains, restore the baseline, or set **Canceled** when there is none.
   - **New request:** leave the draft open and unchanged; this request ends.

### Baseline change review
1. Read the baseline and each change request. Never edit an existing baseline file.
2. Evaluate each request: is the evidence sufficient, does it contradict the baseline, and which sections of the PRD and which specs change. Write the proposed changes into the change request, old and new text per document and section.
3. Return open questions as in draft review step 4, then the S1.C package: the change, its evidence and impact, the sections affected, and the decision asked.
4. On a decision, apply it as the step card routes:
   - **Approve:** write the baseline with the proposed changes as the next `vX.0`, new files only: document control **Approved**, the changed requirement rows **Approved**, and the change recorded in the change history. If no draft is open, the living PRD and specs become that version. If a draft is open, reapply the draft's changes from its change history onto the new version as `vX.1`; every conflict becomes a Blocking open question. Re-run only the S1 skills the change affects, and mark the change request **Approved**.
   - **Revise:** record the feedback in the change request and repeat from step 2.
   - **Reject:** leave the baseline unchanged; mark the change request **Rejected** with the reason.

## Output
- Draft review: the PRD and this request's specs in template shape and within budget, the G1 package, and after the decision the updated documents.
- Baseline change review: the change request with proposed changes, evaluation, and disposition; the S1.C package; on Approve, the new baseline and, when a draft was open, the rebased draft.

## Quality checklist
- [ ] The PRD and every spec have only their template's headings and are within budget
- [ ] No Blocking or Important open question reached G1 unanswered
- [ ] The G1 package groups changes by request
- [ ] The G1 package recommends whether experience design runs, citing the triggers met and their requirement IDs, or none
- [ ] A rejection removed only the named requests' changes
- [ ] Baseline-change review compared proposals to the **approved baseline**, not only to the draft
- [ ] A rebase raised every conflict instead of resolving it silently
- [ ] No baseline file was edited, and no approval implied before the human's decision
- [ ] An approved version has no requirement row left **Proposed** and no closed item left
- [ ] No assumption was promoted to a requirement without the human's confirmation
