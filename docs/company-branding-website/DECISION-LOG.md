# Decision Log

One row per human decision, answer, or routing event, oldest first. `sdlc-check.py` reads the Date, Gate, Decision, Subject, and By columns: keep their names and values exactly.

| ID | Date | Gate | Step | Decision | Subject | Human's words (verbatim) | By | Notes |
|---|---|---|---|---|---|---|---|---|
| D1 | 2026-11-24 | — | S0.1 | Routing | company-branding-website | Build a professional branding and marketing website for my company, DD Software Solutions Inc., which provides AI consulting and integration services to businesses. | orchestrator | Mode `greenfield`, profile Standard, route Normal. Source saved as `sources/2026-11-24-project-request.md`. Next: S1.1. |
| D2 | 2026-11-24 | — | S1.7 | Answer | Q10 | Refer to this design system on Figma https://www.figma.com/design/LkfGLRJsrCSCoYdu9m0hyf/DD-Software-Solutions-Branding?node-id=8-1953&t=6tpckMNZwyYFi297-1 | human | Answers Q10: existing Figma design system is authoritative for brand assets. Source: `sources/2026-11-24-figma-design-system.md`. File currently not readable without Figma auth. Q1–Q9 and Q11 still open. |
