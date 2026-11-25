# Part plan: cbw-devops-02 — Production configuration and domain

## Goal
Production Netlify site serves custom domain over HTTPS with owner-supplied emails, booking URL, and Resend verified sender.

## Acceptance criteria
| AC ID | Done when |
|---|---|
| BR-09 | No `[...]` placeholders in production HTML |
| D2, D3, D6 | Domain + env vars set |
| NFR-06 | HTTPS enforced |

## Read
| What | Where |
|---|---|
| Open decisions Q19 | PRD §11 |
| Env table | `design/ARCHITECTURE.md` §6 |
| Release | `design/IMPLEMENTATION-PLAN.md` RP2 |

## Changes
- Expected files: Netlify env docs, `scripts/check-production-placeholders.ts`, DNS checklist in PR description (not new markdown unless requested)
- Reuse: `cbw-devops-01` pipeline
- Out of bounds: application feature work

## Security requirements
| ID | Requirement | Test |
|---|---|---|
| TM-04 | Rotate Resend key on compromise procedure | runbook in PR |

## Tests
| Level | What |
|---|---|
| e2e | Production smoke: home, submit inquiry, booking link |
| — | TLS lab scan optional |