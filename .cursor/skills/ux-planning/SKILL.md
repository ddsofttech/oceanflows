---
name: ux-planning
description: Tier each screen a request changes by how much design it needs, write the UX brief and screen specs, sketch directions when the direction is open, and build new screens and flows as an interactive prototype in code that front-end developers extend instead of rebuilding.
---

# UX Planning

Playbook steps **S2.1, S2.3**, and the close after **S2.5** (`designer`). Paths, gates, and routes come from your step card.

## When to use
- G1 confirmed a design trigger for the request: a new product UI, a new look, a restructured UI, or a flow whose UX is open.
- A design need names screens the PRD and the UI catalog cannot settle; tier and design only those.
- The design lead sends failed screens back, or G3 rejects the request's UI.

## Input
- Approved PRD: users, jobs, rules, scenarios, acceptance criteria, and accessibility targets.
- The UI catalog, `docs/COMPONENTS.md`. Choose components and tokens from it; open a component's source only to change it.
- The existing screens the PRD changes, as stories or screenshots where they exist.
- A supplied design source (for example a Figma file), if any.
- For a fix: the failed screens and the design lead's findings.

## Process
**Tier** (S2.1)

1. List each screen or state the PRD changes, with the requirement IDs it serves.
2. Give each screen the lowest tier that holds:

   | Tier | When | You make |
   |---|---|---|
   | **T0** No design | Built entirely from catalog components and an existing screen pattern, including a new screen that follows one; no new interaction or workflow | Its row in the brief |
   | **T1** Screen spec | A new or changed state of an existing screen (a field, an empty or error state) built from catalog components; no new screen, flow, or interaction | A screen spec |
   | **T2** Interactive prototype | A new flow, a new or restructured screen with no existing pattern, a new interaction, a component the catalog lacks, or a supplied design to import | Components, a story per state, and a clickable prototype of each flow, in code |
   | **T3** Explore | The direction is open: the PRD leaves UX alternatives open, or stakeholders disagree | 2–3 directions to choose from; the chosen one is then built as T2 |

   Between two tiers, choose the higher and say why in one line. A new flow, and a screen the request restructures, is at least T2; a new screen that follows an existing pattern, or a change inside an existing screen, should land on T0 or T1. A screen restyled only by a design-system change is T0; it is screenshotted with the build.
3. Write the questions each T2 and T3 screen must answer, each traced to requirement IDs. T0 and T1 screens carry none.
4. Name the design system: the product's own; for an existing UI without one, its tokens extracted from the code (`design-system-design`); for a product with no UI yet, or a new look, the options and the visual identity for the human to choose from (`design-system-design`). A house system is optional.
5. For each T1 screen, write the spec with `ui-design` steps 1–5, 9, and 12: the job, an ASCII wireframe, the catalog components, and a row per state with its copy, at most 40 lines.
6. For each T3 screen, sketch 2–3 directions at the lowest fidelity that shows the difference, as throwaway static pages, and screenshot each. Give each one sentence on what it bets on and its trade-off. Do not polish.
7. List what a T2 build will simulate (mock data, latency, errors) and the API data each screen assumes.

**Build** (S2.3, T2 and T3 screens and design-system changes)

8. Work on the UX branch your step card names. Make the brief's design-system changes first (`design-system-design`).
9. Build each screen as presentational components with a story per state, composed from catalog components and designed with `ui-design`. Data reaches components only through props, from mock data kept in one place, so front-end developers replace the mocks without touching the components. Components hold no data fetching, routing, or global state.
10. Link each flow's screens into a clickable prototype with a prototype shell, kept in its own folder: it routes between the screens, holds the mock state, and simulates the latency and errors the brief lists, so a reviewer can walk every path the PRD scenarios name. Components never import the shell; front-end developers delete it when they wire real routing and data.
11. A component the catalog lacks is built once, with all its states and its catalog doc block; then rerun `.cursor/sdlc/scripts/ui-catalog.py`.
12. Importing a supplied design: read it through its tool (for example the Figma MCP), then rebuild it from catalog components and tokens; never paste its generated markup.
13. Run the UI checks the engineering standards name, walk each flow in the prototype, and capture each state at mobile and desktop widths, and each screen a design-system change restyles. Fix failures before handing over. When the standards name no UI checks yet, say so in the build record.
14. Fill the brief's build record: branch, how to open the prototype and the flows it walks, stories per screen, layout concepts, simulations, API data assumptions, and check results.
15. On a fix, change only the failed screens.

**Close** (after G3)

16. Rejected: delete the UX branch; the brief and review stay as the record. Approved: nothing to do; front-end slice parts take the branch over in S4.

## Output
- UX brief in the shape of the `UX-BRIEF.md` template.
- T3: a screenshot of each direction, linked in the brief.
- T2 and T3: the UX branch with components, stories, a clickable prototype of each flow, mock data, and the regenerated catalog; screenshots of each state.
- After a G3 reject: the UX branch deleted.

## Quality checklist
- [ ] Every changed screen has the lowest tier that holds, with the reason; every new flow and restructured screen is at least T2
- [ ] Questions exist only for T2 and T3 screens and trace to requirements
- [ ] Each T1 spec covers every PRD state with its copy, uses only catalog components, and fits 40 lines
- [ ] T2 components take data through props; mocks live in one place; components hold no fetching, routing, or global state
- [ ] Every flow can be walked end to end in the prototype; the shell lives in its own folder and no component imports it
- [ ] New components have all states and a catalog doc block; the catalog was regenerated
- [ ] UI checks ran and pass, or their absence is recorded
- [ ] Simulations and API data assumptions are recorded
- [ ] Nothing outside the brief's screens was changed or polished
