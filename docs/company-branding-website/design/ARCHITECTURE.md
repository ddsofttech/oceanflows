# Architecture

## Metadata
- PRD version: `1.0` (`docs/baselines/prds/PRD-v1.0.md`)
- UX handoff: `docs/company-branding-website/ux/UX-REVIEW.md` (G3 Approve D15); `docs/company-branding-website/ux/UX-BRIEF.md`; UX branch `ux/company-branding-website` @ prototype under `prototype/`
- Mode: greenfield
- System architecture version: (none — created by this request)
- Author: architect (S3.1)
- Date: 2026-11-25; revised 2026-11-25 (G4 Revise D16 — Cloudflare Pages)

## 1. Context
- **Constraints:** C1–C7 (simple JAMstack, Cal.com free tier, free-tier static/JAMstack host — **ADR-2/D16:** Cloudflare Pages; PRD C7 text still lists Vercel/Netlify, no product scope change). G3 waivers: FR-09 section-end CTAs → header + hero only; consulting-first tagline copy deferred as current hero wording. Human-locked IA adds **Use cases** section and six nav targets (not in PRD §4 list) — accepted at G3; no data contract impact.
- **Non-functional requirements:** NFR-01–NFR-10 (responsive, WCAG 2.2 AA, CWV, motion, no custom backend except form delivery, HTTPS, spam control, cookieless analytics, SEO meta).
- **Integration points:** (1) Email delivery to `[INQUIRY_EMAIL]`; (2) Cal.com booking URL `[BOOKING_URL]`; (3) cookieless analytics (Cloudflare Web Analytics or equivalent); (4) optional Cloudflare Turnstile for spam (decision with security-engineer).
- **Binding UX constraints and simulations that must become real:**
  - Single-page anchors: `#home`, `#services`, `#approach`, `#use-cases`, `#about`, `#contact`; hero `banner.svg` as CSS `::before` only; light/dark via `data-theme` + `localStorage` key `dd-theme`.
  - Inquiry POST `{ name, email, phone?, message }` → sent | field errors | delivery failure | spam (no success UI per BR-07).
  - Booking: external link (not embed) pending R6 confirmation below.
  - Placeholders per BR-09 until production; compile-time or env substitution, never shown as `[...]` in production builds.
  - Reuse: `design/tokens/*`, `prototype/styles/site.css`, `prototype/js/theme.js`, `prototype/js/site.js`, page compositions, `docs/COMPONENTS.md`.

## 2. Options
| Option | Summary | Meets requirements? | Trade-offs | Cost to reverse |
|---|---|---|---|---|
| Extend what exists | Deploy `prototype/` as static files; Netlify Forms for inquiry | Yes (with Netlify Forms spam/notify limits) | No typed contract; harder to implement BR-07 “no success” for spam consistently | Low |
| **Astro + Cloudflare Pages Function + Resend (recommended)** | Static site from UX; one serverless POST `/api/inquiry`; email via Resend | Yes | Small new dependencies; owner needs Resend API key + Cloudflare account | Low–medium |
| Next.js on Vercel | SSG + Route Handler | Yes | Heavier than needed; Vercel Hobby commercial-use risk (R7) | Medium |

- **Recommendation:** Astro 5.x with `@astrojs/cloudflare`, `output: "server"` (replaces Astro 4 “hybrid” — prerender per route with `export const prerender = true` on marketing pages; SSR/API routes default on-server). One Pages Function via Astro API route `src/pages/api/inquiry.ts` implementing the OpenAPI contract, Resend for transactional email to the inquiry inbox. Host on **Cloudflare Pages** (free tier suitable for commercial marketing site; addresses R7 vs Vercel Hobby; per human decision D16). **Class A (H1, 2026-11-25):** RP0 scaffold ships Astro 5 + server output; no stack or hosting change vs G4 intent.
- **Heavier choices and the requirement that needs each:** Resend + Function (D5, NFR-05/06, BR-06/07 with explicit spam response); optional Turnstile (R3, NFR-06) if honeypot + rate limit insufficient.

## 3. Change to the system architecture
| Element ID | Level | Added / changed / removed | Why |
|---|---|---|---|
| CTX-VISITOR | context | Added | FR-01–FR-14 |
| CTX-FOUNDER | context | Added | Receives inquiries/bookings |
| EXT-RESEND | context | Added | FR-07, BR-06 |
| EXT-CALCOM | context | Added | FR-13 |
| EXT-ANALYTICS | context | Added | FR-14 |
| CTR-MARKETING-SITE | container | Added | All marketing UI, NFR-01–05 |
| CTR-INQUIRY-API | container | Added | Sole server-side behavior, NFR-05 |
| CMP-INQUIRY-HANDLER | component | Added | Contract `submitInquiry` |
| CMP-THEME-NAV | component | Added | FR-02, NFR-04, UX handoff |
| CMP-INQUIRY-FORM | component | Added | FR-06–FR-08, W1 |

## 4. Scale approach
| Item | Value or decision | Source |
|---|---|---|
| Expected load | Unspecified; design for static CDN + stateless function | O5 (no numeric target) |
| Data volume and growth | Zero persisted inquiry data; email is the system of record | NFR-05, W2 |
| Hot paths | CDN cache for HTML/CSS/JS/assets; `/api/inquiry` on submit only | NFR-03, W1 |
| Storage and indexes | None | NFR-05 |
| Pagination and limits | `message` max 5000 chars; rate limit per IP (e.g. 5/min) | analyst; open with security |
| Caching | Immutable hashed assets long TTL; HTML short TTL or immutable per deploy | NFR-03 |
| Sync versus async work | Inquiry: synchronous email send in function with timeout | FR-07 |
| What scales out | Cloudflare CDN and Pages/Workers concurrency (vendor-managed) | C7; D16 |

## 5. Data model
| Entity | Keys and constraints | Indexes | Change and migration |
|---|---|---|---|
| (none) | No database; inquiry exists only in email and visitor session | — | N/A |

Site copy and tokens are source files in git (Q15).

## 6. Contracts
| Contract | Type | Schema link | New or changed | Compatibility |
|---|---|---|---|---|
| Inquiry submit | API | `design/contracts/inquiry-api.openapi.yaml` | New | v1.0 initial |

- **Error model:** `400 validation_failed` + `fields` map; `429 rate_limited`; `502 delivery_failed`. Spam returns `200` with `{ sent: false, rejected: true }` — client shows neither success nor field errors (BR-07).

**Public site configuration (build-time env, not an HTTP API):**

| Variable | Purpose | Required at prod |
|---|---|---|
| `PUBLIC_INQUIRY_EMAIL` | Not exposed; server only `INQUIRY_EMAIL` | Yes |
| `PUBLIC_PUBLIC_EMAIL` | Contact section mailto | Yes |
| `PUBLIC_BOOKING_URL` | Cal.com event link | Yes |
| `PUBLIC_PUBLIC_PHONE` | Optional | No |
| `PUBLIC_LINKEDIN_URL` | Optional | No |
| `RESEND_API_KEY` | Server secret | Yes |
| `INQUIRY_EMAIL` | Delivery destination | Yes |
| `TURNSTILE_SECRET_KEY` | If Turnstile enabled | Optional |

## 7. Failure modes and observability
| Failure | Behavior | Detection |
|---|---|---|
| Validation error | 400 + field errors; client keeps values | Function log `inquiry.validation_failed` (no PII in message body) |
| Resend unavailable | 502; client shows delivery failure + public email (FR-08) | Log `inquiry.delivery_failed`; alert on error rate |
| Rate limit | 429; generic client message | Cloudflare analytics / Wrangler tail (no PII) |
| Spam | 200 rejected; idle form (no success) | Metric `inquiry.spam_rejected` count only |
| Cal.com down | Booking link fails in browser; form still works (E7) | Manual; optional synthetic check |
| Analytics blocked | Site works; visit not counted | Analytics dashboard empty |

Logging: structured JSON, no full message body or phone in logs (PII minimization).

## 8. Security design items
| Threat model ID | Design item |
|---|---|
| TM-01 (spam abuse) | Honeypot field `hp`, server-side validation, IP rate limit; optional Turnstile — **formal IDs in `THREAT-MODEL.md`** |
| TM-12 (rate-limit IP) | Key rate limit on `CF-Connecting-IP` / `request.cf`; do not trust client `X-Forwarded-For` alone |
| TM-02 (PII in transit) | HTTPS only; TLS to Resend |
| TM-03 (PII in logs) | Log inquiry IDs and outcomes only |
| TM-04 (secret exposure) | Resend/Turnstile secrets in Cloudflare Pages/Workers env (dashboard or `wrangler secret`), never `PUBLIC_*` |
| TM-05 (XSS via form) | Escape output in email template; Astro auto-escape in UI |

**Handoff:** Orchestrator must run `security-engineer` (S3.1 threat modeling skill) to publish `design/THREAT-MODEL.md` and confirm spam stack before `cbw-be-01` merges.

## 9. Architecture decision records
### ADR-1: Astro as the production web framework
- Context: Greenfield marketing site; UX delivered as static HTML/CSS/JS; NFR-05 simplicity.
- Options considered: Deploy prototype as-is; Astro; Next.js.
- Decision: Astro 5 with static (prerendered) marketing pages, islands for theme/nav/form client script; `output: "server"` + Cloudflare adapter so `src/pages/api/inquiry.ts` runs on Pages Functions without a separate hybrid mode flag.
- Consequences: New `web/` app; prototype remains reference until migrated in `cbw-fe-01`. Marketing pages in `cbw-fe-01` must set `export const prerender = true` unless a route needs SSR.

### ADR-2: Cloudflare Pages hosting (revised D16)
- Context: C7 / NFR-05 require a free-tier JAMstack host; R7 flags Vercel Hobby non-commercial terms. G4 Revise D16: human chose Cloudflare Pages over the prior Netlify recommendation.
- Options considered: Netlify (prior G4 draft); Cloudflare Pages; Vercel Hobby (rejected, R7).
- Decision: **Cloudflare Pages** for the company marketing site; inquiry API on **Pages Functions** through `@astrojs/cloudflare` (Astro API route — simplest Astro-compatible path).
- Consequences: `wrangler.toml` (or Pages project config via dashboard); build command `astro build`; secrets via Cloudflare **Settings → Environment variables** (encrypted) or `wrangler secret`; local dev with `wrangler pages dev` / adapter dev. PRD C7 still names Vercel/Netlify — intent is unpaid JAMstack hosting; no OpenAPI or product scope change (Class A clarification).

### ADR-3: Cal.com as a new-tab link (not embed)
- Context: R6 — embed may set cookies and conflict with FR-14 cookieless analytics stance.
- Decision: `BookingPanel` opens `PUBLIC_BOOKING_URL` in a new tab with `rel="noopener noreferrer"`; name Cal.com in privacy notice.
- Consequences: Simpler Contact layout; no iframe failure mode beyond link.

### ADR-4: Resend for inquiry email delivery
- Context: D5; need programmatic spam rejection and HTML email with all fields (BR-06).
- Decision: Pages Function (Astro API route) calls Resend `POST /emails` to `INQUIRY_EMAIL`.
- Consequences: Owner creates Resend account; domain verification for `from` address before production (devops + owner).

## 10. Risks and open questions
| ID | Risk or question | Change class | Severity | Owner | Next action |
|---|---|---|---|---|---|
| R3 | Contact spam | B | Important | security-engineer + backend | Threat model + implement in `cbw-be-01` |
| R6 | Cal.com cookies | A | Non-blocking | architect | ADR-3 link-only |
| R7 | Hosting terms | A | Important | architect/devops | ADR-2 Cloudflare Pages |
| Q19 | Placeholders | B | Non-blocking | Duong | Before S6 production |
| FR-09 | Section CTAs waived at G3 | A | — | — | Header+hero only |
| FR-01 copy | Consulting-first line deferred | A | Non-blocking | designer/owner | Optional copy PR |
| Use cases | Extra section vs PRD | B | Non-blocking | — | Accepted G3 human-lock |