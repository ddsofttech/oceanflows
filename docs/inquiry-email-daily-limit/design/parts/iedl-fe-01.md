# Part plan: iedl-fe-01 — Daily limit UX and privacy copy

## Goal
Visitors see distinct daily-limit vs IP-burst messages; privacy notice describes hashed rate-limit counters (FR-11).

## Acceptance criteria
| AC ID | Done when |
|---|---|
| FR-15 | 429 `daily_limit_reached` shows daily-limit copy, not “wait a moment” |
| FR-08 | IP 429 still shows burst copy |
| FR-11 | Privacy page states per-email counters/hashed keys and UTC-day retention (draft) |

## Read
| What | Where |
|---|---|
| API errors | `design/contracts/inquiry-api.openapi.yaml` `RateLimitError` |
| Client classifier | `web/src/scripts/inquiry-form.ts` `classifyInquiryResponse` |
| Privacy | `web/src/pages/privacy.astro` |
| AC copy intent | PRD §9 FR-15, FR-11 |

## Changes
- Expected files: `inquiry-form.ts` (parse `error` on 429, new outcome kind), `InquiryForm.astro` if needed; `privacy.astro` paragraph; unit tests `inquiry-form.test.ts`.
- Reuse: `renderStatus`, existing field-error path.
- Out of bounds: server/KV (`iedl-be-01`).

## Security requirements
| ID | Requirement | Test |
|---|---|---|
| TM-15 | Privacy describes hashing, not raw email storage | manual review |

## Tests
| Level | What |
|---|---|
| unit | `classifyInquiryResponse` daily vs IP |
| e2e | Optional: stub 429 bodies in contact spec if not flaky |