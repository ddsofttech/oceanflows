---
name: ui-design-review
description: Review the design quality of a request's screens — starting from automated UI check results, then judging hierarchy, states, copy, visual identity, imagery, design-system fit, and responsiveness — as findings separate from whether the screens answer their questions.
---

# UI Design Review

Playbook step **S2.4** (`design-lead`). Paths, gates, and routes come from your step card; finding types from `.cursor/sdlc/AGENT-RULES.md`.

## When to use
- After the questions are judged with `ux-validation`, for every changed screen.
- On a revalidation, for the fixed screens only.

## Input
- The UI check results and the screenshots of each changed state; T1: the screen specs.
- The UX brief, including layout concepts and any design-system changes.
- The UI catalog, `docs/COMPONENTS.md`, with the visual identity.
- Approved PRD: scenarios, states, and accessibility targets.

## Process
1. Start from the UI check results `ux-validation` recorded (its step 1); do not re-measure what they cover.
2. Review the screenshots of changed screens only, at mobile and desktop widths, in light and dark if the design system has both. Open the prototype or a story in the browser only to check interaction, focus order, or motion.
3. Judge each screen on what tools cannot, and record what you observed:
   - **Design system**: the right catalog component for each job; no local styling the token lint missed; changed design-system parts still look right where they are used.
   - **Hierarchy**: the screen's job is obvious; one element leads; structure encodes content rather than decorating.
   - **Identity**: the identity's signature decisions show; the palette is the product's, not a framework default; screens with different jobs do not share one layout pattern.
   - **Imagery**: every image, illustration, and icon carries content and follows the identity's imagery rules (`ui-design` step 11).
   - **States**: loading, empty, error, success, permission, and long or missing data, as the PRD scenarios require.
   - **Copy**: user-facing names, consistent action names through the flow, errors that say how to fix the problem.
   - **Accessibility**, beyond the checks: logical keyboard order, meaningful labels, color not the only signal.
   - **Responsiveness**: no overflow, overlap, or clipped text at mobile width.
   - **Defaults**: any unrequested treatment from the `ui-design` list of generated-looking defaults (step 13).
4. Record each problem as a finding with the area, the screen, and the fix expected. Classify type and severity as findings (`.cursor/sdlc/AGENT-RULES.md`).
5. Separate what the human should decide (a taste or trade-off call) from defects the designer must fix.

## Output
- The design quality review in the UX review: area, screen, observation, finding type, severity, owner.

## Quality checklist
- [ ] Questions were judged before design quality, and design quality did not replace them
- [ ] Every changed screen was reviewed at mobile and desktop widths
- [ ] Every area in step 3 has a result
- [ ] Each finding names its screen and expected fix, with type and severity
- [ ] The reviewer did not build or edit the screens
