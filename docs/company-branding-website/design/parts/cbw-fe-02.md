# Part plan: cbw-fe-02 — Live contact, booking, placeholders

## Goal
Contact form posts to API with all UX states; booking opens Cal.com link; public contact details from env.

## Acceptance criteria
| AC ID | Done when |
|---|---|
| FR-06–08, FR-07 | W1 flows live on index |
| FR-10 | Mailto + location; optional phone/LinkedIn hidden if unset |
| FR-13, E7 | Booking link; unavailable copy if URL missing in non-prod only |
| FR-11 | Privacy links on form + footer |

## Read
| What | Where |
|---|---|
| Contract client mapping | `design/contracts/inquiry-api.openapi.yaml` |
| ADR-3 | `design/ARCHITECTURE.md` ADR-3 |
| Stories | `prototype/stories/contact-*.html` |
| Env table | `design/ARCHITECTURE.md` §6 |

## Changes
- Expected files: `web/src/components/InquiryForm.*`, `BookingPanel.*`, `ContactDetails.*`, `web/src/scripts/inquiry-form.ts`
- Reuse: `prototype/js/site.js` validation patterns; `InquiryForm` catalog block
- Out of bounds: email template changes without API version bump

## Security requirements
| ID | Requirement | Test |
|---|---|---|
| TM-04 | Only `PUBLIC_*` in client | ESLint restricted imports |
| BR-07 | Client shows no success when `rejected` | e2e |

## Tests
| Level | What |
|---|---|
| e2e | sent, field errors, delivery failure |
| e2e | booking link `target=_blank` |