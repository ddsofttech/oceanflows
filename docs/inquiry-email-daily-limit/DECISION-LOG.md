# Decision Log

One row per human decision, answer, or routing event, oldest first. `sdlc-check.py` reads the Date, Gate, Decision, Subject, and By columns: keep their names and values exactly.

| ID | Date | Gate | Step | Decision | Subject | Human's words (verbatim) | By | Notes |
|---|---|---|---|---|---|---|---|---|
| D1 | 2026-11-26 | — | S0.1 | Routing | inquiry-email-daily-limit | can we implement the same email should only allow to send 3 inquiries per day? | human | Mode: existing-repo. Profile: Standard (default). Route: Normal. Next: S1.1. Source: `sources/2026-11-26-project-request.md`. |
| D2 | 2026-11-26 | — | S1.7 | Answer | Q21–Q26 daily limit | Q21: UTC calendar day Q22: yes Q23: every valid submit Q24: Clear daily limit reach Q25: Yes, set 1/IP/minute Q26: Yes | human | Apply to PRD §8/§11. Q22 “yes” ambiguous vs trim+lowercase-only vs also aliases — clarify Q22a before G1 if still Blocking. Q25 also changes IP limit to 1/min. Next: resume S1. |

Next ID: **D3**.
