---
name: design-system-design
description: Recommend a starting design system and a visual identity for a product, and create or change the product's own design system in code — a design-tokens file and catalogued components — so every screen inherits one coherent, recognisable look and agents find it in the UI catalog.
---

# Design System Design

Playbook steps **S2.1, S2.3** (`designer`). Paths, gates, and routes come from your step card.

## When to use
- The product has no design system yet: extract one from its existing UI, or recommend one when it has no UI.
- The request gives the product a new look: recommend its new visual identity and design system.
- The UX brief names a design-system change: a missing component, state, or token, or a change to the look.

## Input
- The PRD: product, audience, brand constraints, platforms, accessibility targets.
- The UI catalog, `docs/COMPONENTS.md`, and the tokens file and components it points to; or, for a product with no UI yet, the [CodeIT Design System](https://claude.ai/artifact/WCexX9GkSkcdqYGo6uukDK), read with the Artifact tool.
- Brand assets, a design system the human supplies, or a design source, if any.
- The components or tokens the brief's screens lacked.

## Process
**Extract** (S2.1, existing UI without a design system)

1. Read the existing styles and record the values the UI already uses most as tokens, by role (step 6), and write down the identity the UI already has (step 2). Do not redesign: a value used once is an exception to list, not a token.

**Recommend** (S2.1, product with no UI yet, or a new look)

2. Write the visual identity from the PRD and any brand assets, before choosing a system. For a new look, start from the current identity and say what changes and why:
   - the audience, tone, and density needs, in two or three sentences;
   - three brand attributes, each a word a user could recognise in the screens;
   - what this domain must avoid (for example playful type in finance, cold clinical layouts for children, dense tables for first-time consumers);
   - one or two signature decisions that make the product recognisable without its logo: a typeface pairing, a shape language, an illustration or photography style, or a color with its reason;
   - imagery: one icon family, as SVG; whether the product uses illustration or photography, in what style and on which subjects, and what it never shows.
3. Recommend the CodeIT Design System, the default, adapted to the identity, with what would need changing; the human may choose or supply another instead. Do not apply a system before the human chooses.
4. Whichever is chosen, the identity's signature decisions change its tokens: a design system left exactly as published looks like every other product built on it.

**Change** (S2.3, the brief's changes only)

5. Change the design system in the repository on the UX branch, never inside one screen, and only what the brief names. Tokens live in one file in the W3C design-tokens format, which the project's theme reads; its top-level `$description` holds the visual identity from step 2, which the catalog shows to every agent. Greenfield before the scaffold exists: create the tokens file from the chosen system and mirror it as CSS custom properties, since plain CSS cannot read it; the first front-end slice part wires the file into the scaffold's theme and drops the mirror.
6. Tokens, defined by role, not by hue:
   - color: a neutral ground (white or neutral gray for light themes), text and border levels, one primary action color derived from the identity or the brand assets with a one-line reason (a framework's default palette is not a decision), and status colors, each with a dark-mode value; text pairs meet WCAG AA in light and dark;
   - type: one family, or two clearly distinct ones, with a stated scale, weights, and line heights;
   - spacing on one base unit; radius and elevation that vary with hierarchy rather than one value everywhere;
   - motion durations and easing, with a reduced-motion rule.
7. Components: each has every interactive state (default, hover, focus, active, disabled, loading, error) and a story per state.
8. Give each component the catalog doc block in its source, in the file's comment style:
   ```text
   @component DataTable
   @purpose Sortable, paginated table of records
   @props columns, rows, sort, onSort, loading
   @states default, loading, empty, error, row-selected
   @story <path of its stories file>
   ```
   `@component`, `@purpose`, and `@states` are required. Then rerun `.cursor/sdlc/scripts/ui-catalog.py` with the source and token paths the engineering standards name.
9. A shared page layout becomes a component only when two or more screens need it.
10. List the screens the change affects, so validation can recheck them. A human-facing showcase artifact is optional; when kept, it is regenerated from the code, never edited as the source.

## Output
- In the UX brief: the extracted design system, or the options and the recommended one with its visual identity, or the design-system changes to be made.
- In S2.3: the changed tokens file and components on the UX branch, the regenerated catalog, and the list of affected screens.

## Quality checklist
- [ ] The recommendation names the audience fit and the trade-off, and offers the CodeIT Design System as the default, open to the human's own choice
- [ ] The identity has brand attributes, the domain's avoid list, signature decisions, and imagery rules, and lives in the tokens file's `$description`
- [ ] The primary color has a reason; no framework default is left unchanged
- [ ] Only the brief's changes were made, in the design system itself
- [ ] Every color pair used for text meets WCAG AA in light and dark
- [ ] Every component has all interactive states, a story per state, and a catalog doc block
- [ ] The catalog was regenerated
- [ ] Affected screens are listed
