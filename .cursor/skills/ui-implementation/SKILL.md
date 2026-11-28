---
name: ui-implementation
description: Build the user-facing part of a slice in production code — taking over the designer's UI that G3 accepted when there is one — so it matches the approved screens and design system in tokens, components, states, responsiveness, and accessibility.
---

# UI Implementation

Playbook steps **S4.1, S4.2** (`frontend-developer`). Paths, gates, and routes come from your step card. Use with `feature-implementation`, which owns branching, tests, and the PR.

## When to use
- A slice has a front-end part with screens, components, or states.
- Review findings or QA defects concern UI behavior or appearance.

## Input
- The slice's acceptance criteria, and the UX constraints and API data assumptions in the UX handoff note.
- What the part plan names for its screens: the designer's components G3 accepted, the approved screenshots, or a T1 screen spec. None: the spec's states and the catalog alone; a screen they cannot settle is a design need for `designer`, not a design choice of yours.
- The UI catalog, `docs/COMPONENTS.md`, and the design-tokens file.

## Process
1. **UX code G3 accepted:** it is already on your base branch. Its components and stories are yours from now on: wire them to the real contracts through data fetching, client state, and routing, delete the prototype shell of each flow the part plan assigns you, and keep the mock data only as test fixtures. Change their look or copy only through a finding to `designer`.
2. Tokens come from the design-tokens file through the project's single theme source; never transcribe a value or hard-code a color, size, radius, or duration in a component.
3. Choose components from the catalog; extend before creating. A component the project lacks is built once, with all its states, a story, and its catalog doc block (`design-system-design`); then rerun `.cursor/sdlc/scripts/ui-catalog.py`.
4. **Greenfield UX pages of plain HTML, CSS, and JavaScript:** the first front-end part moves it into the scaffold: the tokens file into the theme, replacing the CSS mirror, and the pages into catalogued components.
5. Implement every state the spec and the approved screens show: loading, empty, error, success, permission, long or missing data.
6. Keep the quality floor: semantic elements, labels on inputs and icon buttons, visible focus, logical keyboard order, WCAG AA contrast, reduced motion respected, layouts that work from mobile width up.
7. Keep CSS predictable: low, flat specificity; component-scoped styles; no overrides that fight the theme.
8. Copy comes from the approved screens and the spec; a wording change goes back as a finding.
9. Before review, screenshot each changed screen at mobile and desktop widths beside the approved screenshot or spec; fix differences or list them in the PR with the reason. Add automated accessibility checks where the project supports them.

## Output
- UI code in the slice's PR, with side-by-side screenshots and any listed differences from the approved screens.

## Quality checklist
- [ ] No hard-coded design values; tokens come from one theme source
- [ ] Existing components reused or extended before new ones
- [ ] Every required state is implemented
- [ ] Keyboard, focus, labels, contrast, and reduced motion pass
- [ ] Screens work at mobile and desktop widths
- [ ] Screenshots match the approved screens, or differences are explained
- [ ] No mock data outside test fixtures; the prototype shell of each flow assigned to this part is gone; the catalog is current
