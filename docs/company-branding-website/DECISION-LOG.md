# Decision Log

One row per human decision, answer, or routing event, oldest first. `sdlc-check.py` reads the Date, Gate, Decision, Subject, and By columns: keep their names and values exactly.

| ID | Date | Gate | Step | Decision | Subject | Human's words (verbatim) | By | Notes |
|---|---|---|---|---|---|---|---|---|
| D24 | 2026-11-26 | — | S5.1 / H4 | Answer | FR-14 env + prod branch | I set PUBLIC_CF_ANALYTICS_TOKEN and also updated production branch is main. Continue your work | human | Token claimed set; CF Workers Builds production branch → `main`. Hosted beacon still absent until Build var + redeploy. PR #12 merged `12bf29b3` after S4.3 pass. |

Rows through D23 (RP1 G7 Go) archived in `decisions/RP1.md`. Next ID: **D25**.
