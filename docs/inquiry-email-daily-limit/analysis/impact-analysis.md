# Existing-System Impact Analysis

## 1. Feature summary and baseline
- Intended outcome: Limit inquiry form submissions to **3 per email address per day** (human request D1).
- Requirements baseline and approval status: PRD **v1.0** approved; draft **v1.1** adds FR-15, NFR-11, BR-10 (Proposed).
- In scope: `POST /api/inquiry` enforcement and any visitor error copy (Q24); durable cross-isolate counting (NFR-11).
- Exclusions: Admin UI, account system, changing IP 5/min limit unless owner directs (Q25).
- Unresolved requirements that limit this analysis: §11 Q21–Q23 (day boundary, normalization, counter increment rules).

## 2. Impact overview
- Affected areas: Inquiry API handler, rate-limit module, client form response handling, contract/unit tests, threat model (TM-01 extension), privacy notice (Q26), Cloudflare Pages bindings (new durable store).
- Overall risk: **Important** — touches production abuse path and NFR-05/NFR-06 boundary (minimal backend vs durable store).

## 3. Requirement-to-system mapping
| Requirement ID | Affected area | Evidence | Category | Confidence | Notes |
|---|---|---|---|---|---|
| FR-15 | Inquiry API | `web/src/pages/api/inquiry.ts` `submitInquiry` | Modify | High | Cap check after email known (post-validation) |
| FR-15 | Validation | `web/src/lib/inquiry-validation.ts` | Reuse | High | Email from validated body |
| NFR-11 | Rate limit store | `web/src/lib/inquiry-rate-limit.ts` in-memory `Map` | Extend / Create | High | Same module or sibling; not sufficient in-memory only (SR-01) |
| FR-08 / Q24 | Form UX | `web/src/scripts/inquiry-form.ts` `classifyInquiryResponse`, rate-limited copy | Modify | Medium | May need new outcome or copy |
| NFR-06 | IP limit | `inquiry-rate-limit.ts`, `inquiry.ts` L65–69 | Reuse | High | Unchanged unless Q25 |
| TM-01 / BR-07 | Threat model | `docs/company-branding-website/design/THREAT-MODEL.md` | Extend | High | Add per-email daily rule |
| FR-11 | Privacy page | `web/src/pages/privacy/` | Investigate | Medium | Q26 |

## 4. Classification and rationale
Per-email limits require **durable shared state** because Cloudflare Workers run many isolates; in-memory counters do not aggregate (documented SR-01, G5 D19). Extending the existing rate-limit concern is preferred over a new service; the architect chooses store type (e.g. KV, Durable Object) — flagged only, not decided here.

## 5. Detailed impact areas
- **Behavior:** After IP check and validation, increment/check counter keyed by normalized email (rules TBD Q22–Q23).
- **Code:** `inquiry-rate-limit.ts`, `inquiry.ts`, tests in `web/tests/unit/inquiry.contract.test.ts`.
- **APIs:** Likely same `POST /api/inquiry`; response shape TBD Q24 (`429 rate_limited` vs new error).
- **Data:** Ephemeral counter records (email or hash → count + window); retention/TTL tied to Q21; no full message storage.
- **Security:** Avoid logging email in counters path (TM-03); KV access scoped to Worker binding.
- **UI:** Possible error message distinct from generic "wait a moment" (Q24).
- **Operations:** New binding/namespace in Cloudflare Pages project; deployment checklist update.
- **Tests:** Unit tests with mock store; contract tests for 4th submission; regression for IP 429.

## 6. Regression risks and scenarios
| Risk | Trigger | Consequence | Existing behavior affected | Existing test coverage | Proposed verification |
|---|---|---|---|---|---|
| IP limit broken | Reorder checks | Burst abuse returns | TM-01 5/min | `inquiry.contract.test.ts` sixth POST | Keep IP check first; regression AC |
| Legitimate 4th inquiry blocked | Wrong counting (Q23) | Lost lead | BR-06 | None for email cap | Owner rule on retries |
| False share of limit | Email normalization gap | Bypass or double-count | FR-15 | None | Q22 decision + tests |
| KV misconfiguration | Missing binding at deploy | All submissions fail or uncapped | FR-07 | Smoke POST | Deploy smoke + health |
| Privacy gap | Counter storage undisclosed | Compliance risk | FR-11 | Manual | Q26 |

## 7. Findings and severity
| ID | Severity | Evidence | Consequence | Owner | Next action |
|---|---|---|---|---|---|
| IA-01 | Important | `inquiry-rate-limit.ts` in-memory Map | Email cap ineffective cross-isolate without durable store | architect | S3 design (D7) |
| IA-02 | Blocking (product) | No source on timezone/day | Indeterminate BR-10 | Duong | Q21 |
| IA-03 | Blocking (product) | No source on normalization | Bypass or unfair cap | Duong | Q22 |
| IA-04 | Blocking (product) | No source on increment rules | Retry/spam ambiguity | Duong | Q23 |

## 8. Decision requests
| Question | Why it matters | Options | Recommendation | Owner | Can affected work proceed? |
|---|---|---|---|---|---|
| Q21 Day boundary | TTL and tests | UTC; America/Edmonton; rolling 24h | Alberta company → **America/Edmonton** calendar day unless owner prefers UTC | business | No — S1.8 |
| Q22 Normalization | Key stability | Lowercase+trim; plus-address rules | Lowercase + trim minimum | business | No — S1.8 |
| Q23 Increment | Counter semantics | Delivery only; post-validation POST; non-spam only | **Successful delivery only** (aligns with "inquiries sent") | business | No — S1.8 |
| Q24 UX/API | Visitor clarity | Reuse 429; distinct 429 code; 403 | Distinct copy at minimum; API per architect | business + implementation | Design can wait for G1 answer |
| Store technology | NFR-11 | KV; Durable Object; other | Options for architect only | architecture | After Q21–Q23 for TTL design |

## 9. Implementation boundaries
- What appears to change: server-side cap, optional UI copy, Cloudflare binding, tests, threat-model note.
- What must remain unchanged: Honeypot/Turnstile spam path, Resend delivery, OpenAPI validation shapes, IP 5/min unless Q25 changes.
- Analysis, not approved design: KV naming, key format, hash vs plaintext email, exact check ordering after validation.

## 10. Recommended next steps
1. Owner answers Q21–Q26 at G1 (or before S1.8).
2. Architect updates THREAT-MODEL and part plan for durable counter (D7).
3. Implement FR-15 with contract + regression tests.
4. Revisit privacy notice if Q26 = yes.

## 11. Evidence index
| Claim | Path and symbol |
|---|---|
| IP 5/min in-memory | `web/src/lib/inquiry-rate-limit.ts` |
| Handler order | `web/src/pages/api/inquiry.ts` `submitInquiry` |
| 429 UI | `web/src/scripts/inquiry-form.ts` |
| SR-01 residual | `docs/company-branding-website/testing/security/PR-2.md` |
| TM-01 rate limit | `docs/company-branding-website/design/THREAT-MODEL.md` |