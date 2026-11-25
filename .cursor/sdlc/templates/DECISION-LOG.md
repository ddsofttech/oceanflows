# Decision Log

One row per human decision, answer, or routing event, oldest first. `sdlc-check.py` reads the Date, Gate, Decision, Subject, and By columns: keep their names and values exactly.

| ID | Date | Gate | Step | Decision | Subject | Human's words (verbatim) | By | Notes |
|---|---|---|---|---|---|---|---|---|

- **Gate:** `G1`–`G8`, `GC`, or `—` for answers and routing.
- **Decision:** `Approve`, `Approve with known issues`, `Revise`, `Reject`, `New request`, `Answer`, or `Routing`. At G7, Approve is Go, Revise is Hold, and Reject is No-go.
- **Subject:** what the decision is about: a PRD version (`v2.0`), a change request file, a PR (`PR #123`), or a release point (`R1`).
- **By:** who decided. Two approvers go in one row, separated by commas.
- **Human's words:** verbatim and complete, never shortened.
- **Notes:** at most two sentences: what the decision means for the work, and what happens next. Point to the change request, ADR, commit, or finding that holds the detail instead of restating it.
