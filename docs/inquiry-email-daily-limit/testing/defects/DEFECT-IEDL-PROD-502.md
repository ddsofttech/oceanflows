# DEFECT-IEDL-PROD-502: Production inquiry POST returns 502 delivery_failed

- Type: Product defect | Environment issue (secrets / Resend)
- Severity: **Important** (contact form cannot complete delivery on first allowed POST)
- Found in: S5.1, RP1 production, merge `c950a6e5`, `https://oceanflows.net/`
- Slice part and owner: `iedl-be-01` / `iedl-devops-01`; **human** for Worker secrets (`RESEND_API_KEY`, `INQUIRY_EMAIL`, `RESEND_FROM_EMAIL`)
- Acceptance criterion or requirement ID: FR-07 (inquiry delivery), NFR-11 (hosted path healthy)
- Steps to reproduce:
  1. Wait ≥60s since any prior `POST /api/inquiry` from your IP (or use a fresh egress).
  2. `POST https://oceanflows.net/api/inquiry` with valid JSON: `name`, `email`, `message`, `hp: ""`.
  3. Observe response.
- Expected: HTTP **200** `{ "sent": true, "rejected": false }` when secrets and KV/pepper are configured.
- Actual: HTTP **502** `{ "error": "delivery_failed" }` on 2026-11-27 QA probes after cooldown (no `rate_limited` on that request).
- Evidence (logs, screenshots, test name):
  - curl 2026-11-27: solo POST after 62s sleep → 502 `delivery_failed`
  - Browser form first submit on same IP after probe window → **429** UI (rate limit), masking delivery until window clears
  - `inquiry.ts`: 502 from missing Resend/INQUIRY_EMAIL, KV/pepper (`inquiry.kv_unavailable`), Resend API failure, or KV store error — all return same `delivery_failed` body
  - Context: user noted Resend secrets may still be flaky from CBW H8
- Status: Open

| Date | Event | By | Link |
|---|---|---|---|
| 2026-11-27 | Filed S5.1 prod observation | qa | this file |

**Note:** Not the same as the human-reported “Please wait a moment” copy (that maps to **429** `rate_limited`). Fixing 502 may reduce confusing retry → rate-limit sequences.