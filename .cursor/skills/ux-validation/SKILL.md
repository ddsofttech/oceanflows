---
name: ux-validation
description: Validate a request's UX work — T1 screen specs and T2 interactive prototypes in code — starting from the automated UI check results, judge it against its questions and acceptance criteria, and prepare the G3 package with a handoff note for architecture.
---

# UX Validation

Playbook steps **S2.4, S2.5** (`design-lead`). Paths, gates, and routes come from your step card.

## When to use
- The UX brief holds T1 screen specs, or T2 and T3 screens are built on the UX branch.
- A fixed screen must be rechecked.

## Input
- The UX brief and this request's approved specs with their scenarios and acceptance criteria.
- For T2 and T3 screens and screens a design-system change restyles: the UI check results, the screenshots of each state, and the prototype and stories on the UX branch, opened with a browser tool when a question needs interaction.
- Prior findings, for a revalidation.

## Process
1. Read the UI check results first. A failed check is a UX defect for `designer`; never re-measure what a tool measured. Where the engineering standards name no UI checks yet, measure contrast, keyboard order, and focus once with a browser tool, and raise the missing checks as a finding for `architect`.
2. T1 specs: check that each covers every state the feature spec's scenarios name, uses only catalog components, and has user-facing copy. They need no rendering.
3. T2 and T3: for each question in the brief, record **answered**, **still open**, or **contradicted**, with what you observed. Exercise the material scenarios by walking their flows in the prototype, writing the expected outcome before each attempt.
4. Label the evidence **owner walkthrough** or **user session**. An owner click-through is not a usability test.
5. After the questions, note acceptance-criteria gaps. Matching the criteria does not pass an open or contradicted question.
6. Review the design quality of every changed screen with `ui-design-review`.
7. Classify each finding by type and severity (findings, `.cursor/sdlc/AGENT-RULES.md`).
8. On a revalidation, recheck only the screens and questions the fix touched.
9. Write the handoff note: Class C items, UX constraints that bind architecture, the API data the UI assumes, simulations that must become real, and the components front-end parts reuse.
10. Recommend approval only when every material question is answered or explicitly deferred.
11. For G3, give the human the screenshots of each state at mobile and desktop widths and how to open the prototype and the stories.

## Output
- UX review in the shape of the `UX-REVIEW.md` template, including the recommendation and the handoff note.

## Quality checklist
- [ ] Check results were read first and recorded; nothing a tool measured was re-measured
- [ ] Missing UI checks were raised as a finding
- [ ] Every question has a result and a labeled evidence type
- [ ] Material scenarios were exercised in the prototype
- [ ] AC gaps are noted after the questions, not instead of them
- [ ] Every changed screen has a design review
- [ ] The handoff note names the API data the UI assumes and the components to reuse
- [ ] Limits are stated: backend, security, performance, and integration are not proven
