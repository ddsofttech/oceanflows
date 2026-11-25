# Part plan: cbw-be-01 — Inquiry API and email delivery

## Goal
`POST /api/inquiry` delivers valid inquiries to `INQUIRY_EMAIL` via Resend; spam and invalid input behave per contract and BR-07.

## Acceptance criteria
| AC ID | Done when |
|---|---|
| FR-06, FR-08, BR-05 | Server validates fields; 400 + field map |
| FR-07, BR-06 | Email contains all submitted fields |
| BR-07, NFR-06 | Spam → 200 `rejected:true`, no email |
| NFR-06 | HTTPS only (Netlify default) |

## Read
| What | Where |
|---|---|
| Contract | `design/contracts/inquiry-api.openapi.yaml` |
| ADR-4 | `design/ARCHITECTURE.md` ADR-4 |
| Threat items | `design/ARCHITECTURE.md` §8; formal `THREAT-MODEL.md` when ready |
| Spam UX | `prototype/stories/contact-spam-rejected.html` |

## Changes
- Expected files: `web/netlify/functions/inquiry.ts`, `web/src/lib/inquiry-validation.ts`, tests under `web/tests/`
- Reuse: none
- Out of bounds: Astro page layout changes (fe-02 wires client)

## Security requirements
| ID | Requirement | Test |
|---|---|---|
| TM-01 | Honeypot + rate limit (+ Turnstile if mandated) | unit + contract tests |
| TM-02–03 | TLS; no PII logs | security review S4.4 |

## Tests
| Level | What |
|---|---|
| unit | Validation, spam classifier |
| contract | OpenAPI examples |
| integration | Mock Resend; deploy preview manual send |