# Devops diagnosis: DEFECT-IEDL-PROD-502

- **To:** orchestrator → **human** (Cloudflare + Resend dashboards)
- **Type:** environment
- **Defect:** `testing/defects/DEFECT-IEDL-PROD-502.md`
- **Worker:** `oceanflows-company-site` @ https://oceanflows.net/
- **Code @ prod (per defect):** merge `c950a6e5` (IEDL RP1)

## Symptom

Valid `POST /api/inquiry` (after ≥60s IP cooldown) returns **502** `{ "error": "delivery_failed" }`. **429** `rate_limited` on rapid retries is expected (BR-13) and is not this defect.

## Evidence (2026-11-27 devops)

| Check | Result |
|---|---|
| `POST` valid JSON (`name`, `email`, `message`, `hp: ""`) | **502** `delivery_failed` (reproduced from agent egress) |
| `POST {}` | **400** `validation_failed` (API alive) |
| S6.4 smoke at Go | Did **not** exercise full delivery path (only validation + IP burst 429) |
| `web/wrangler.toml` prod KV `id` | `98c8523f918a4a1d8c79e9c8395e51e6` (binding name `INQUIRY_DAILY_LIMIT`) |

All client-visible 502 bodies are identical; **Worker JSON logs** distinguish root cause (`web/src/lib/inquiry-log.ts`).

## Root-cause hypothesis (ranked)

**Primary — IEDL runtime env incomplete (fail-closed by design):**

1. **`INQUIRY_LIMIT_HASH_PEPPER`** missing, empty, or whitespace on Worker **runtime** secrets → log `event`: `inquiry.kv_unavailable`, `outcome`: `delivery_failed`. Owner attested H1 at G7; **never smoke-tested** with a successful inquiry POST on prod.
2. **`INQUIRY_EMAIL`** and/or **`RESEND_API_KEY`** missing on Worker runtime → log `inquiry.delivery_failed` **before** daily limit runs (CBW carry-forward; “Resend flaky” per defect note).

**Secondary — after secrets + KV/pepper present:**

3. **Resend API rejection** (revoked key, unverified sending domain, invalid `RESEND_FROM_EMAIL` / `from`) → log `inquiry.delivery_failed` **after** daily slot reserved. Fix per SETUP-GUIDES **§B2–B3**; see **§B4** smoke.
4. **KV operational error** on bound namespace → log `inquiry.daily_limit_store_error`.

**Code bug:** **No** — behavior matches `web/src/pages/api/inquiry.ts` and IEDL fail-closed architecture (`design/ARCHITECTURE.md` §7). No backend handoff unless logs show pepper + KV + Resend all correct yet still 502.

## Human dashboard steps (no secret values in tickets)

Reference: `docs/company-branding-website/delivery/SETUP-GUIDES.md` **§A3**, **§A8**, **§B**.

### 1. Triage via Worker logs (do this first)

1. Cloudflare → **Workers & Pages** → **`oceanflows-company-site`** → **Logs** (Observability).
2. Run one valid inquiry POST (or use site contact form after cooldown).
3. Find the JSON line `{ "event", "requestId", "outcome" }` and note **`event`**:

| Log `event` | Fix |
|---|---|
| `inquiry.kv_unavailable` | §A8.3 pepper + confirm KV binding (§A8.1–A8.2) |
| `inquiry.delivery_failed` (early) | §A3 + §B1/B3: `RESEND_API_KEY`, `INQUIRY_EMAIL` |
| `inquiry.daily_limit_store_error` | KV namespace `98c8523f…` exists; binding matches `wrangler.toml` |
| `inquiry.delivery_failed` (after slot) | §B2 verified domain + `RESEND_FROM_EMAIL`; rotate key if compromised (§B TM-04) |

### 2. Verify runtime secrets (Worker → Settings → Variables and Secrets)

Confirm **runtime** secrets exist (not only Build variables):

| Name | Type | SETUP |
|---|---|---|
| `INQUIRY_LIMIT_HASH_PEPPER` | Secret | §A8.3 (`openssl rand -base64 32`) |
| `INQUIRY_EMAIL` | Secret | §B3 |
| `RESEND_API_KEY` | Secret | §B1 |
| `RESEND_FROM_EMAIL` | Secret/Variable | §B2 (address on **verified** Resend domain) |

Optional: `TURNSTILE_SECRET_KEY` — if unset, Turnstile is skipped (curl without token can still reach delivery path).

### 3. Verify KV (§A8)

1. **Workers & Pages → KV** — namespace ID **`98c8523f918a4a1d8c79e9c8395e51e6`** exists (`INQUIRY_DAILY_LIMIT_PRODUCTION` or equivalent).
2. Worker **Settings → Bindings** — `INQUIRY_DAILY_LIMIT` → same namespace (deploy from `main` with committed `web/wrangler.toml`).

No redeploy required for **secret-only** edits; binding changes need `web-deploy-production` or Workers Builds deploy.

### 4. Resend (§B)

1. **Domains** — sending domain **Verified**.
2. **`RESEND_FROM_EMAIL`** — mailbox on that domain (not sandbox-only unless testing).
3. If key suspect → create new API key, update Worker secret, revoke old (§B TM-04).

## Verification (QA / owner)

1. Wait **≥60s** since prior `POST /api/inquiry` from same IP.
2. `POST https://oceanflows.net/api/inquiry` with valid body → **200** `{ "sent": true, "rejected": false }`.
3. Inbox at `INQUIRY_EMAIL` receives message (§B4).
4. Worker log shows `inquiry.sent`.
5. Retest: second immediate POST → **429** `rate_limited` (BR-13) — expected.

## Devops / backend

| Role | Action |
|---|---|
| **Human** | Steps 1–4 above |
| **QA** | Retest DEFECT-IEDL-PROD-502 after human confirms |
| **devops** | Optional: add post-deploy inquiry **delivery** check to S6.4 (not only 400/429 probes) |
| **iedl-be-01** | **Idle** unless logs prove mis-wired env with all secrets present |