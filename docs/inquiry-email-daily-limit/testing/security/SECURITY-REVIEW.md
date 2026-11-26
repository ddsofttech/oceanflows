# Security Review: PR 16

- Title: iedl-be-01: inquiry daily limit and IP tighten
- Slice part: `iedl-be-01`
- Sensitive: PII-derived rate limiting (peppered SHA-256 KV keys), abuse controls (IP + per-email caps), Worker secrets (`INQUIRY_LIMIT_HASH_PEPPER`), Cloudflare KV binding
- Reviewed head (commit): `a2d701f084a3db21a111a9f1f975b072a0abfe2c`
- Reviewer: security-engineer (S4.4)
- Date: 2026-11-26

## Checked
| Check | Result | Evidence |
|---|---|---|
| CI security gates green on the reviewed head | pass | `gh pr view 16` — secrets, sast, dependency-audit SUCCESS on `a2d701f0` |
| Security requirements (IDs) | pass | TM-01/BR-13/FR-15 contract + unit tests; TM-15 hash/key tests; TM-03 log contract test; fail-closed in `enforceDailyInquiryLimit` |
| Dependencies carrying sensitive scope | pass | No new crypto/auth packages; `crypto.subtle.digest` (platform) |
| Exceptions to security gates | pass | None added in PR |

## Findings
| ID | Finding | Severity | Fix owner | Status | Verified at commit |
|---|---|---|---|---|---|
| SEC-01 | No contract test asserts fail-closed (`502` + `inquiry.kv_unavailable`) when `INQUIRY_LIMIT_HASH_PEPPER` or KV store is absent; implementation is correct (`!pepper \|\| !dailyStore`) | Non-blocking | `iedl-be-01` owner | open — follow-up test recommended | `a2d701f0` |
| SEC-02 | Whitespace-only pepper passes truthiness check; weak operational pepper weakens TM-15 preimage resistance | Non-blocking | devops / human (H1) | open — document min-length/trim in SETUP-GUIDES §A8; optional runtime `trim()` + length guard | `a2d701f0` |

## Merge status
- Blocked by an unresolved Blocking finding: **no**
- Needs the human at G5: **no** for security disposition (SEC-01/02 are deferrable); **yes** for H1 (KV IDs + production pepper) as environment gate per BOARD, not a code defect
- S4.5 merge allowed from security side: **yes** (pending S4.3 architect code review)