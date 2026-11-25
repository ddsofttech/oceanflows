---
name: ui-design
description: Design the screens of a request — T1 screen specs and T2 interactive prototypes in code — so they are clear, accessible, and specific to the product — hierarchy, layout, copy, states, imagery, and motion within the design system and its visual identity — instead of templated defaults.
---

# UI Design

Playbook steps **S2.1, S2.3** (`designer`). Paths, gates, and routes come from your step card.

## When to use
- The UX brief changes or adds screens, flows, or states: a spec for a T1 screen, code for a T2 screen.
- The design lead sends back screens whose design failed review.

## Input
- The UX brief: tiers, questions, in-scope screens.
- Approved PRD: users, jobs, rules, scenarios, acceptance criteria, and the accessibility targets.
- The UI catalog, `docs/COMPONENTS.md`: the visual identity, and the components and tokens to compose from.
- The existing stories or screenshots of the screens being changed, and the design-review findings for a fix.

## Process
**Ground the design**

1. Name the product's subject, its primary user, and the one job each in-scope screen serves. Take them from the PRD; a missing answer is a finding, not a guess. Read the visual identity in the catalog: its attributes, signature decisions, imagery rules, and what the domain avoids.
2. Use the real content of the domain throughout: real field names, plausible data, real lengths of names and numbers. Never lorem ipsum.

**Plan each screen before building it**

3. Write a one-sentence layout concept per screen and compare at least two options as rough wireframes (ASCII is enough): what the eye meets first, second, and third.
4. Choose the alignment and grid, and the one element that carries the screen. Everything else stays quiet.
5. Review the plan against the PRD and the screens beside it in the flow: if a screen reads like the layout any similar product would get, or repeats a neighbour's pattern (one card grid, one hero) for a different job, revise it and say what changed.

**Build with the design system**

6. Compose from the catalog's components and tokens only, and let the identity's signature decisions show on every changed screen. Hierarchy comes from scale, weight, spacing, and position before color.
7. Structure is information: borders, dividers, numbering, labels, and cards must encode something about the content. Use numbered markers only for a real sequence.
8. Typography: keep lines under about 80 characters, use the system's type scale, and do not accent single words in headings.
9. Design every state the PRD scenarios name: loading, empty, partial, error, success, permission denied, and long or missing data. Empty states invite the next action.
10. Motion only to show what a user action changed (open, expand, confirm, remove). Animate transform and opacity, not size or position. At most one orchestrated moment per flow; no decorative entrance on every section.
11. Imagery, in the identity's style:
    - an image, illustration, or icon appears only where it carries content: the product itself, the user's own data, or something the user must recognise;
    - no stock-style people, generic heroes, or abstract blobs; never an AI-generated face or a fake product shot presented as real;
    - a placeholder keeps the real aspect ratio and says what goes there;
    - icons come from one family, as SVG, never emoji;
    - meaningful images have alt text; decorative ones are hidden from assistive technology.
12. Write the copy from the user's side:
    - name things by what users understand, not by how the system is built;
    - buttons are active verbs ("Save changes", not "Submit"), and the same name follows through the flow ("Publish" → "Published");
    - errors say what went wrong and how to fix it, without apology or vagueness;
    - sentence case, plain verbs, no filler.

**Avoid the defaults**

13. Unless the PRD or design system asks for them, do not spend free choices on generated-looking defaults:
    - cream or beige page grounds; keep light surfaces white or neutral and put color on actions and accents;
    - a framework's default palette left unchanged; near-black ground with one acid accent; purple-to-blue or purple-to-pink gradient washes;
    - identical rounded cards with the same soft shadow, one radius on everything, gradients as decoration; glass, neumorphic, or glow effects as decoration;
    - the same hero, three feature cards, and call to action on every page;
    - a tracked-out all-caps eyebrow over every heading, "A · B · C" meta strings, "→" appended to every link, monospace for small labels;
    - a big number with a small label as the hero by reflex; everything centered.
    When a visual treatment is asked for (a gradient, an illustration), apply it visibly on real components, sparingly.

**Quality floor** (always, without announcing it)

14. Works at 375, 768, 1024, and 1440 px wide; nothing overflows or overlaps.
15. Text and essential icons meet WCAG AA contrast in light and dark; focus is visible; every action is reachable by keyboard and shows a pointer cursor; targets are at least 24×24 px, and 44×44 px on touch screens; color is never the only signal; reduced motion is respected.

**Critique as you build**

16. T2: check the screenshots of each changed screen, captured at mobile and desktop widths in the build (`ux-planning`), against steps 6–15, and fix what fails before handing over.
17. Before handing over, remove one thing that does not serve the plan's questions.

## Output
- T1: the screen spec in the UX brief. T2: the changed screens as components and stories, linked into a clickable prototype.
- In the UX brief: the layout concept and pattern per changed screen, and any component or token the catalog lacked.

## Quality checklist
- [ ] Every changed screen has a stated job and a layout concept chosen from options, not repeated from a neighbour with a different job
- [ ] The identity's signature decisions are visible; imagery carries content and follows step 11
- [ ] Only design-system components and tokens are used; gaps are recorded, not styled locally
- [ ] Every PRD state for the in-scope flows is designed
- [ ] Copy is user-facing, consistent across the flow, and errors explain the fix
- [ ] No unrequested default from step 13
- [ ] Contrast, focus, keyboard, target size, and reduced motion pass
- [ ] T2: screenshots at mobile and desktop widths were reviewed
