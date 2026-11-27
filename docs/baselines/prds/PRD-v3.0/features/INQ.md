# Feature Spec: Contact, booking, inquiry limits
<!-- budget: lines=120 chars=300 -->

## Document control
- Feature ID: `INQ`
- Capability (PRD §4 ID): CAP-2
- Inherits (PRD IDs): BR-01, BR-02, BR-09, C6, C7, W-1, W-2
- Last changed: 2.1, template reshape

## 1. Purpose and users
- Job: Capture inquiries, offer Cal.com booking, enforce abuse limits, privacy notice links.
- Users: Visitors submitting contact; founder receives mail. Success: O5.

## 2. Scope
### In scope
- Contact section form, public details, booking, privacy notice; `POST /api/inquiry` with IP and per-email caps
### Out of scope
- This request: no change to limits or form fields

## 3. Functional requirements
| ID | Requirement | Priority | Status | Source |
|---|---|---|---|---|
| INQ-FR-06 | Form: name, email, message required; phone optional | Must | Approved | Q3 |
| INQ-FR-07 | Valid submit → designated inbox; on-page confirmation; no response-time promise | Must | Approved | Q1, Q13 |
| INQ-FR-08 | Field validation with errors; keep values; delivery-failure alternate contact | Must | Approved | source §6 |
| INQ-FR-10 | Public email, Alberta Canada; optional phone/LinkedIn if supplied | Should | Approved | Q1 |
| INQ-FR-11 | Privacy notice linked from form and footer; owner-approved text incl. rate-limit counters | Must | Approved | Q8, D2 Q26 |
| INQ-FR-13 | Cal.com 30-minute booking link or embed alongside form | Must | Approved | Q2 |
| INQ-FR-15 | Max **3** counted submits per normalized email per UTC day; distinct daily-limit copy | Must | Approved | inquiry-email-daily-limit |

## 4. Non-functional requirements
| ID | Quality attribute | Requirement/measure | Status | Source |
|---|---|---|---|---|
| INQ-NFR-05 | Simplicity | Form delivery only server behavior; static host | Approved | source §7 |
| INQ-NFR-06 | Security | HTTPS; spam not delivered; data to inbox only | Approved | analyst |
| INQ-NFR-11 | Abuse control | Per-email cap consistent across Worker isolates (e.g. KV) | Must | Approved | impact analysis |

## 5. Business rules
| ID | Rule | Source |
|---|---|---|
| INQ-BR-05 | Send only if required fields valid | Q3 |
| INQ-BR-06 | Sent inquiry includes all fields to inbox | Q1 |
| INQ-BR-07 | Spam → no delivery, no success UI | analyst |
| INQ-BR-08 | No response-time promise | Q13 |
| INQ-BR-10 | Max 3 counted inquiries per normalized email per UTC day | D2 |
| INQ-BR-11 | UTC calendar day window | D2 |
| INQ-BR-12 | Increment counter on each valid POST (validation passed) | D2 Q23 |
| INQ-BR-13 | Max 1 POST per client IP per rolling 60s; before daily cap | D2 Q25 |
| INQ-BR-14 | Email normalization: trim, lower, plus-tag strip, Gmail dot folding | D3 Q22a |

## 6. Workflow, states, and scenarios
- Workflow W-1/W-2 (PRD §5): CTA → Contact → submit or book.
- Exceptions: invalid fields (E1); delivery fail (E2); spam (E3); daily cap (E8); IP burst (E9); booking load fail → form still usable.
- Scenarios: normal inquiry; booking alternate; fourth email same day blocked; second IP within 60s → 429.

## 7. Acceptance criteria
| ID | Requirement ID | Given / When / Then |
|---|---|---|
| INQ-AC-06 | INQ-FR-06 | Form has four labelled fields with correct required/optional |
| INQ-AC-07 | INQ-FR-07 | Valid submit → inbox message + confirmation without response-time text |
| INQ-AC-08 | INQ-FR-08 | Invalid or failed delivery → errors/alternate contact; values kept |
| INQ-AC-15 | INQ-FR-15 | Fourth same-day normalized email → no inbox mail; daily-limit message not IP message |
| INQ-AC-B13 | INQ-BR-13 | Second POST same IP within 60s → 429 `rate_limited` |
| INQ-AC-B14 | INQ-BR-14 | Gmail/plus variants share one counter; max 3 |
| INQ-AC-N11 | INQ-NFR-11 | Cross-isolate test: fourth attempt still blocked |
| INQ-AC-11 | INQ-FR-11 | Privacy notice covers form, booking, analytics, rate-limit retention |

## 8. Constraints, assumptions, risks, dependencies
| ID | Type | Description | Status | Owner/action |
|---|---|---|---|---|
| INQ-R3 | Risk | Spam volume | Identified | BR-07 |
| INQ-R8 | Risk | KV TTL/clock errors on daily cap | Identified | architect |
| INQ-D7 | Dependency | Durable store for counters | Available | shipped |
| INQ-D8 | Dependency | Owner-approved privacy text for counters | Pending | Duong |

## 9. Open questions
n/a — product-wide placeholders tracked as PRD Q19.