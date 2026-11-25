---
name: prd-review-and-baseline
description: Review a PRD draft for baseline approval, or evaluate PRD change requests against the approved baseline, and prepare the package for the human's Approve, Revise, Reject, or New request.
---

# PRD review and baseline

Playbook steps **S1.7, S1.8, S1.C** (`requirements-analyst`). Paths, gates, and routes come from your step card.

## When to use
- **Draft review:** S1.1–S1.6 are done and the draft is to be prepared for, and decided at, G1.
- **Baseline change review:** a change request proposes changing approved intent or scope (Class C), and must be evaluated against the current baseline.

## Input

### Draft review
- The living PRD and the request's sources and working papers.
- The human's feedback, when re-entering after Revise or Reject.

### Baseline change review
- The current baseline PRD (read-only).
- The change request(s).
- The living PRD when a draft is open.
- The human's feedback, when re-entering after Revise.

## Process

### Draft review
1. Review the PRD against the template: remove any non-template headings or pasted working papers; fix content when evidence allows.
2. Refresh section 1. Sort section 11 Blocking → Important → Non-blocking. Set document control to **Pending approval**.
3. While section 11 has **Blocking** or **Important** rows, return them all as questions in one stop, Blocking first. Turn each answer into a functional or non-functional requirement, rule, or constraint, and remove the question.
4. Non-blocking rows may be answered now or deferred with the human's explicit consent.
5. Build the G1 package: version, what changed since the baseline grouped by request (from section 12), remaining Non-blocking items, the experience-design recommendation, and the decision asked (Approve, Revise, Reject per request, or New request). For the recommendation, name each design trigger in your step card the approved scope meets, with the requirement IDs that meet it, or say that none does and list the UI changes that will be built without design.
6. On a decision, apply it as the step card routes:
   - **Approve:** set the version to the next `vX.0`, document control **Approved**, and every section 6 and 7 row still **Proposed** to **Approved**; the PRD is then copied unchanged as the next baseline.
   - **Revise:** apply the feedback, re-run the affected S1 skills, and repeat from step 1.
   - **Reject:** remove only the named requests' changes, found through section 12. If nothing remains, restore the baseline, or set **Canceled** when there is none.
   - **New request:** leave the draft open and unchanged; this request ends.

### Baseline change review
1. Read the baseline and each change request. Never edit an existing baseline file.
2. Evaluate each request: is the evidence sufficient, does it contradict the baseline, and which sections (2–10) change. Write the proposed PRD changes into the change request, old and new text per section.
3. Return open questions as in draft review step 3, then the S1.C package: the change, its evidence and impact, the sections affected, and the decision asked.
4. On a decision, apply it as the step card routes:
   - **Approve:** write the baseline with the proposed changes as a new file for the next `vX.0`: document control **Approved**, the changed section 6 and 7 rows **Approved**, and the changes recorded in section 12. If no draft is open, the living PRD becomes that version. If a draft is open, reapply the draft's changes from its section 12 onto the new version as `vX.1`; every conflict becomes a Blocking section 11 row. Re-run only the S1 skills the change affects, and mark the change request **Approved**.
   - **Revise:** record the feedback in the change request and repeat from step 2.
   - **Reject:** leave the baseline unchanged; mark the change request **Rejected** with the reason.

## Output
- Draft review: the PRD in template shape, the G1 package, and after the decision the updated PRD.
- Baseline change review: the change request with proposed changes, evaluation, and disposition; the S1.C package; on Approve, the new baseline and, when a draft was open, the rebased draft.

## Quality checklist
- [ ] PRD contains only Document control and sections 1–12
- [ ] No Blocking or Important section 11 row reached G1 unanswered
- [ ] The G1 package groups changes by request
- [ ] The G1 package recommends whether experience design runs, citing the triggers met and their requirement IDs, or none
- [ ] A rejection removed only the named requests' changes
- [ ] Baseline-change review compared proposals to the **approved baseline**, not only to the draft
- [ ] A rebase raised every conflict instead of resolving it silently
- [ ] No baseline file was edited, and no approval implied before the human's decision
- [ ] An approved version has no section 6 or 7 row left **Proposed**
- [ ] No assumption was promoted to a requirement without the human's confirmation
