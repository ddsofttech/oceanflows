# Similar-solution research — per-email inquiry limits

**Job to be done:** Reduce repeat inquiry abuse from a public contact form without blocking most legitimate one-time visitors.

## Comparables (patterns, not product copies)

| Source | Approach | Lesson | Disposition |
|---|---|---|---|
| OWASP / common WAF practice | Layer limits: IP burst + identifier (email/session) | Dual limits catch different abuse modes | **Adopt** — keep TM-01 IP limit + FR-15 email day cap (Q25) |
| SaaS form builders (e.g. Typeform, HubSpot forms) | Daily submission caps per form or per contact field | Users expect a clear message when capped | **Adopt** — need explicit visitor messaging (Q24) |
| Cloudflare Workers docs / community | KV or Durable Objects for distributed counters | In-memory per isolate insufficient at edge | **Adopt** into NFR-11 (mechanism deferred to architect) |
| Email providers (Resend) | Provider-side rate limits on API | Does not cap per visitor email on your form | **Reject** as sole solution — upstream limit ≠ per-email form cap |
| prior release SR-01 | Accepted per-isolate IP limit | Confirms need durable layer for global caps | **Adopt** — motivates D7 |

## Solution patterns (for architect — not PRD)
- Counter key: normalized email (Q22).
- TTL: align to calendar day boundary (Q21) or rolling window.
- Increment on successful delivery reduces penalty for validation/delivery failures (recommended in impact analysis; owner decides Q23).

## Uncertainty
No direct competitor teardown performed; patterns inferred from edge-rate-limiting practice and existing project threat model.