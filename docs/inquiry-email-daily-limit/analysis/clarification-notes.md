# Clarification notes — inquiry-email-daily-limit

## Sources (date order)
1. `sources/2026-11-26-project-request.md` — human: max **3** inquiries per day per **same email**.
2. Orchestrator context — existing **5/min per IP**, in-memory per isolate.

## Extracted needs
| Need | Type | Citation |
|---|---|---|
| Max 3 submissions per email per day | Functional | source verbatim |
| Cross-isolate effectiveness | Non-functional (implied by known SR-01) | orchestrator context; impact analysis |

## Stakeholders
Unchanged from PRD §5; owner decides open rules (§11).

## Scope decisions recorded
- In: email daily cap on inquiry API.
- Out: broad backend, admin tools, IP parameter change unless Q25.