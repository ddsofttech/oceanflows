# Part plan: iedl-be-01 — Inquiry daily limit and IP tighten

## Goal
`POST /api/inquiry` enforces BR-13 (1/min IP), BR-14 normalization, FR-15 (3/UTC day via KV), BR-12 increment semantics, and OpenAPI v1.1 errors.

## Acceptance criteria
| AC ID | Done when |
|---|---|
| BR-13, TM-01 | Sixth POST same IP in 60s → 429 `rate_limited` (update from 5) |
| BR-14, FR-15 | Fourth same normalized email same UTC day → 429 `daily_limit_reached`, no Resend |
| NFR-11 | Store interface allows mock proving cross-call aggregate cap |
| BR-12 | Valid non-spam POST increments even if Resend 502 |
| NFR-06 | Check order: IP → validate → spam → daily → Resend |

## Read
| What | Where |
|---|---|
| Contract v1.1 | `design/contracts/inquiry-api.openapi.yaml` |
| Normalization / KV | `design/ARCHITECTURE.md` §5–§6 |
| Threat | `design/THREAT-MODEL.md` TM-15, TM-01 |
| Handler | `web/src/pages/api/inquiry.ts` `submitInquiry` |
| IP limit | `web/src/lib/inquiry-rate-limit.ts` |
| Validation | `web/src/lib/inquiry-validation.ts` |
| Tests | `web/tests/unit/inquiry.contract.test.ts`, `inquiry-rate-limit.test.ts` |

## Changes
- Expected files: new `inquiry-email-normalize.ts`, `inquiry-daily-limit.ts` (store + KV); change `inquiry.ts`, `inquiry-rate-limit.ts`, `inquiry-log.ts` outcome; contract tests; rate-limit tests (1 not 5).
- Reuse: `validateInquiryBody`, `getInquiryClientIp`, `logInquiryEvent`, `resolveEnv` pattern for KV from `locals.runtime.env`.
- Out of bounds: client copy (`iedl-fe-01`); privacy page text.

## Security requirements
| ID | Requirement | Test |
|---|---|---|
| TM-15 | Peppered SHA-256 keys; no email in KV/logs | unit tests |
| TM-03 | Log outcomes only | review |
| TM-01 | Caps + existing spam stack | contract tests |

## Tests
| Level | What |
|---|---|
| unit | BR-14 cases (gmail dots, plus-tags); TTL helper; mock store increment |
| contract | 4th email; daily vs IP 429 bodies; IP 2nd in 60s |
| integration | Mock KV namespace in vitest if feasible |