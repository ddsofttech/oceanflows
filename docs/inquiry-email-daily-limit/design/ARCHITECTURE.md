# Architecture

## Metadata
- PRD version: `1.1` (`docs/baselines/prds/PRD-v1.1.md`)
- UX handoff: S2 skipped (G1 D4, no design trigger)
- Mode: existing-repo
- System architecture version: `docs/SYSTEM-ARCHITECTURE.md` (2026-11-25, `company-branding-website`; revised by this request)
- Author: architect (S3.1)
- Date: 2026-11-26

## 1. Context
- **Constraints:** C1 (no unnecessary backend), NFR-05 (sole server behavior remains inquiry POST), NFR-06, C7 (Cloudflare Worker host unchanged). No admin UI, accounts, or CMS (§4 out of scope).
- **Non-functional requirements:** FR-15, NFR-11 (cross-isolate email cap), BR-10–BR-14, BR-13 (IP **1**/60s), FR-11 (privacy copy for counters), FR-08 (distinct visitor errors).
- **Integration points:** Existing `POST /api/inquiry` on Worker `oceanflows-company-site`; Resend unchanged; new **Cloudflare KV** binding for daily counters only.
- **Binding UX constraints:** Contact form maps API errors to on-page status (no new screens). Daily-limit copy must be **distinct** from IP burst copy (D2 Q24). Privacy notice gains a short rate-limiting paragraph (owner approval before prod, D8).

## 2. Options
| Option | Summary | Meets requirements? | Trade-offs | Cost to reverse |
|---|---|---|---|---|
| **Extend in-memory only** | Add per-email `Map` beside IP map | No | Fails NFR-11 across isolates (known SR-01) | Trivial |
| **Extend Worker + Cloudflare KV (recommended)** | Hashed per-email counter in KV; IP limit stays in-memory | Yes | KV is eventually consistent; rare concurrent 4th send possible (see §7, ADR-5) | Low–medium (remove binding) |
| **Durable Object per normalized email** | Strong per-key serialization | Yes | New DO namespace; more ops and code than KV for a 3/day cap | Medium |
| **Upstream WAF / Rate Limiting product rule** | Edge rule on IP only | Partial | Cannot read JSON email body at edge for per-email key | N/A |

- **Recommendation:** Extend `web/src/pages/api/inquiry.ts` and `web/src/lib/*`; add one KV namespace `INQUIRY_DAILY_LIMIT` on the existing Worker. Hash normalized email + UTC day for KV keys (no plaintext email in KV). Keep IP burst limit in-memory at **1 POST / 60s** (BR-13).
- **Heavier choices and the requirement that needs each:** KV (NFR-11); optional env pepper for hash (TM-15); OpenAPI `error` enum extension (FR-08 distinct client copy).

## 3. Change to the system architecture
| Element ID | Level | Added / changed / removed | Why |
|---|---|---|---|
| EXT-KV | context | Added | NFR-11 durable counters |
| CTR-INQUIRY-API | container | Changed | Hosts KV client; not stateless for counters |
| CMP-DAILY-LIMIT | component | Added | Normalize, hash, KV increment/check (FR-15, BR-14) |
| CMP-IP-RATE-LIMIT | component | Changed | 5/min → 1/min (BR-13) |
| CMP-INQUIRY-HANDLER | component | Changed | Check order; new 429 body |
| CTR-MARKETING-SITE | container | Changed | Client distinguishes `rate_limited` vs `daily_limit_reached` |
| CMP-INQUIRY-FORM | component | Changed | Distinct copy (FR-15) |
| CMP-PRIVACY | component | Changed | FR-11 counter disclosure |
| BND-KV | boundary | Added | Hashed keys + integer counts only |

## 4. Scale approach
| Item | Value or decision | Source |
|---|---|---|
| Expected load | Low-traffic marketing site; unchanged | O5 |
| Data volume | KV: one key per active normalized email per UTC day; max value `3`; auto-expire at day boundary | BR-11, NFR-11 |
| Hot paths | `/api/inquiry` submit only | W1 |
| Storage | Cloudflare KV namespace bound to Worker | NFR-11, D7 |
| Limits | 3 counted submissions / normalized email / UTC day; 1 POST / IP / 60s | FR-15, BR-13 |
| Caching | KV reads on every non-spam validated submit after spam guards | BR-12 |
| Sync work | KV get/put in same request as Resend | FR-07 |
| Scales out | Worker + KV (vendor-managed) | existing host |

## 5. Data model
| Entity | Keys and constraints | Indexes | Migration |
|---|---|---|---|
| `DailyInquiryCount` | Key: `inquiry:daily:{yyyyMMdd}:{hexSha256}` where hash input = `pepper ‖ normalizedEmail` (UTF-8). Value: decimal string `1`–`3`. TTL: seconds until next UTC midnight (min 60). | Key prefix by UTC day for ops sweeps (optional) | New namespace; no backfill |

**BR-14 normalization** (new `web/src/lib/inquiry-email-normalize.ts`): trim; lowercase full address; strip plus-tag in local part (`local+tag@` → `local@`); for domains `gmail.com` and `googlemail.com`, remove all dots from local part.

**BR-12 increment point (Class A clarification):** Increment once per POST that passes BR-05 **and** is not classified spam (empty honeypot, Turnstile pass when enabled), immediately before Resend. Does **not** increment on validation failure, honeypot/Turnstile reject, or daily-cap block. **Does** increment before Resend even if Resend later returns 502 (D2 Q23). Does not increment when count already ≥ 3.

## 6. Contracts
| Contract | Type | Schema link | New or changed | Compatibility |
|---|---|---|---|---|
| Inquiry submit | API | `design/contracts/inquiry-api.openapi.yaml` v1.1.0 | Changed | **Additive:** new `error` enum value `daily_limit_reached` on 429; IP still `rate_limited` |

- **Error model (revised):**
  - `429` `{ "error": "rate_limited" }` — IP burst (BR-13); client: “wait a moment”.
  - `429` `{ "error": "daily_limit_reached" }` — FR-15; client: daily limit copy (no success UI).
  - Unchanged: `400 validation_failed`, `502 delivery_failed`, `200` spam `rejected`.
- **Check order in `submitInquiry`:** (1) IP rate limit → (2) parse/validate → (3) honeypot → (4) Turnstile → (5) daily cap check+increment → (6) Resend.

**Runtime env (additions):**

| Binding / variable | Purpose | Required prod |
|---|---|---|
| `INQUIRY_DAILY_LIMIT` | KV namespace | Yes |
| `INQUIRY_LIMIT_HASH_PEPPER` | Secret pepper for email hash in KV keys | Yes |

Local dev/tests: inject `InquiryDailyLimitStore` interface; in-memory implementation when KV absent (unit tests only — not production fallback).

## 7. Failure modes and observability
| Failure | Behavior | Detection |
|---|---|---|
| KV missing/misbound | **Fail closed:** 502 `delivery_failed` or dedicated safe error; do not bypass cap (prefer 503 in impl if distinguishable in logs) | `inquiry.kv_unavailable`; deploy smoke |
| KV read error | Same fail-closed | Log `inquiry.daily_limit_store_error` (no email in log) |
| At daily cap | 429 `daily_limit_reached`; no Resend | `inquiry.daily_limit_reached` |
| IP burst | 429 `rate_limited` | `inquiry.rate_limited` |
| Concurrent 4th under race | Rare double increment may allow 4th delivery same day | Accepted risk ADR-5; monitor `inquiry.sent` rate |
| Resend 502 after increment | Visitor sees delivery failure; count not rolled back | By design per BR-12 |

Logging: never log normalized email, hash, or KV key (TM-03).

## 8. Security design items
| Threat model ID | Design item |
|---|---|
| TM-01 | IP 1/min + per-email 3/day + existing honeypot/Turnstile |
| TM-03 | No email in logs; KV values are counts only |
| TM-15 (new) | Hashed KV keys with server pepper; no plaintext email in KV |
| TM-16 (new) | KV binding scoped to Worker; least-privilege token for deploy |
| TM-12 | Unchanged: `CF-Connecting-IP` for IP limit |

**Security review:** `design/THREAT-MODEL.md` drafted here for G4; formal S4.4 on **Sensitive** `iedl-be-01` PR. No orchestrator handoff required to finish S3.1.

## 9. Architecture decision records
### ADR-5: Cloudflare KV for per-email daily counters
- Context: NFR-11; Worker runs many isolates; in-memory insufficient.
- Options: KV; Durable Object per email; external Redis (rejected, NFR-05).
- Decision: Single KV namespace with hashed keys and UTC-day TTL.
- Consequences: `wrangler.toml` namespace + dashboard ID; eventual consistency — **accepted residual** that concurrent requests near the cap may occasionally deliver a 4th inquiry same day (Important, founder accepts at G4).

### ADR-6: Distinct 429 errors for IP vs daily cap
- Context: FR-08/FR-15 require different visitor copy; same status keeps client flow simple.
- Decision: Extend OpenAPI `error` enum with `daily_limit_reached`.
- Consequences: Contract tests + `classifyInquiryResponse` parse `error` field on 429.

### ADR-7: IP burst 1/min remains in-memory
- Context: BR-13 does not require cross-isolate IP accuracy; tightening 5→1 reduces burst abuse per isolate.
- Decision: Keep `inquiry-rate-limit.ts` in-memory; change constant to 1.
- Consequences: Cross-isolate IP bypass remains a low-likelihood residual (same as prior 5/min).

## 10. Risks and open questions
| ID | Risk or question | Class | Severity | Owner | Next action |
|---|---|---|---|---|---|
| R8 | KV TTL/clock wrong blocks or over-counts | B | Important | backend + devops | Unit tests for TTL helper; smoke |
| TM-KV race | 4th delivery under concurrency | B | Important | Founder accept G4 | ADR-5 |
| D8 | Privacy notice owner approval | B | Non-blocking | Duong | Before prod |
| D7 | KV namespace provisioned | B | Important | devops `iedl-devops-01` | S3.4 / PR |