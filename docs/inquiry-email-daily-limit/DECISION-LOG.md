# Decision Log

One row per human decision, answer, or routing event, oldest first. `sdlc-check.py` reads the Date, Gate, Decision, Subject, and By columns: keep their names and values exactly.

| ID | Date | Gate | Step | Decision | Subject | Human's words (verbatim) | By | Notes |
|---|---|---|---|---|---|---|---|---|
| D1 | 2026-11-26 | — | S0.1 | Routing | inquiry-email-daily-limit | can we implement the same email should only allow to send 3 inquiries per day? | human | Mode: existing-repo. Profile: Standard (default). Route: Normal. Next: S1.1. Source: `sources/2026-11-26-project-request.md`. |
| D2 | 2026-11-26 | — | S1.7 | Answer | Q21–Q26 daily limit | Q21: UTC calendar day Q22: yes Q23: every valid submit Q24: Clear daily limit reach Q25: Yes, set 1/IP/minute Q26: Yes | human | Apply to PRD §8/§11. Q22 “yes” ambiguous — closed by D3 Q22a. Q25 sets IP limit to 1/min. |
| D3 | 2026-11-26 | — | S1.7 | Answer | Q22a email normalization | b | human | Q22a = (b) trim+lowercase and treat `+` aliases and Gmail-style dots as the same address. Next: close §11 Blocking; S1.8 G1 package. |
| D4 | 2026-11-26 | G1 | S1.8 | Approve | v1.1 | Approve, no design trigger | human | Baseline PRD v1.1. No S2. Next: S3.1. |

Next ID: **D5**.
