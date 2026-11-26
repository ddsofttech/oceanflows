# Decision Log

One row per human decision, answer, or routing event, oldest first. `sdlc-check.py` reads the Date, Gate, Decision, Subject, and By columns: keep their names and values exactly.

| ID | Date | Gate | Step | Decision | Subject | Human's words (verbatim) | By | Notes |
|---|---|---|---|---|---|---|---|---|
| D24 | 2026-11-26 | — | S5.1 / H4 | Answer | FR-14 env + prod branch | I set PUBLIC_CF_ANALYTICS_TOKEN and also updated production branch is main. Continue your work | human | Token claimed set; later hosted beacon verified; PR #12 merged `12bf29b3`. |
| D25 | 2026-11-26 | — | S5.2 / S5.3 | Answer | Continue RP2 after env | continue the process | human | H4/H6/H7 verified on live; S5.2 pass; G6 package presented. |
| D26 | 2026-11-26 | G6 | S5.3 | Approve | RP2 QA sign-off | approve | human | Approve with known issues per QA package in `testing/reports/RP2.md` (FR-07, SR-01/02, owner content/FR-11, www, E5/NFR-04, TM-12). → S6.1 |

Rows through D23 (RP1 G7 Go) archived in `decisions/RP1.md`. Next ID: **D27**.
