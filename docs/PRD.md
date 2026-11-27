# Product Requirements Document
<!-- budget: lines=150 chars=300 -->

## Document control
- Status: Approved
- Version: `3.0`
- Last approved version: `3.0` (`docs/baselines/prds/PRD-v3.0/`)
- Owner: Duong (Young) Dang. Content: `requirements-analyst`
- Stakeholder approvers: Duong (Young) Dang
- Approval date: 2026-11-27

## 1. Vision
- Purpose (what and why): Responsive single-page marketing site for DD Software Solutions Inc. (Alberta; SMB AI consulting and integration). Core message: "We help businesses turn AI opportunities into working solutions." Consulting-first; no invented proof.
- Problem: SMBs need credible, clear AI consulting positioning and an easy path to consultation without tool-first hype.
- Users: SMB owners and ops/tech stakeholders (Canada and US); founder receives inquiries and bookings.

## 2. Business objectives and success measures
| ID | Objective | Measure | Target | Source |
|---|---|---|---|---|
| O1 | Establish credibility | Owner-approved claims only; no fabricated proof | Pass/fail owner review | company-branding source §7 |
| O2 | Communicate services | Five service areas with problem and outcome each | 5 of 5 | source §4 |
| O3 | Plain-language expertise | Technical terms explained on first use | Owner review | source §2, §4 |
| O4 | Operational value clarity | Services and Approach describe real outcomes qualitatively | Owner review | source §2 |
| O5 | Qualified inquiries and bookings | Monthly count; **qualified** = SMB need for consulting/integration/automation | No numeric target yet | source §2 |

## 3. Users and stakeholders
| Role/group | Needs/responsibilities | Decision authority |
|---|---|---|
| Duong (Young) Dang, Founder | Supplies facts, assets, approves public copy and PRD | Approves PRD (G1), all public claims |
| SMB owners / executives | Understand fit and start consultation | None |
| Ops and technical stakeholders at clients | Trust expertise without jargon overload | None |

## 4. Capabilities and scope
| ID | Capability | Features (IDs) |
|---|---|---|
| CAP-1 | Public marketing experience (sections, navigation, analytics) | SITE |
| CAP-2 | Contact, booking, inquiry abuse controls | INQ |

Out of scope (product-wide):
- Testimonials, client logos, certifications, case studies not owner-supplied (PRD BR-01)
- CMS, user accounts, admin UI, pricing pages, multilingual, blog (prior requests)
- This request: no change to inquiry rate limits, Services table copy, or Approach/About content unless design needs it

## 5. Business workflows
### W-1: Visitor to inquiry
1. Visitor → any section (SITE) → consultation CTA → Contact (INQ) → valid submit → inbox or cap error
### W-2: Visitor to booking
1. Visitor → CTA → Contact → Cal.com 30-minute booking (INQ); confirmations via Cal.com
### W-3: Credibility scan on Home
1. Visitor → Home hero → Services → tools ticker (SITE) → Use cases (SITE) → optional CTA

## 6. Business rules
| ID | Rule | Source |
|---|---|---|
| BR-01 | No testimonials, client logos, certifications, partnerships, case studies, or metrics unless owner supplies and approves | source §7 |
| BR-02 | No numeric outcome claims unless owner supplies a verifiable basis | source §7 |
| BR-09 | Production shows no unresolved placeholders (`[INQUIRY_EMAIL]`, `[BOOKING_URL]`, domain, etc.) | Q1, Q11 |

## 7. Constraints, assumptions, risks, dependencies
| ID | Type | Description | Status | Owner/action |
|---|---|---|---|---|
| C1 | Constraint | Lightweight static/JAMstack site; no unnecessary backend complexity | Confirmed | All |
| C2 | Constraint | Do not invent social proof (see BR-01) | Confirmed | All |
| C5 | Constraint | No AI cliché imagery; animation not overly complex by default (source §5) | Confirmed | designer |
| C6 | Constraint | Cal.com free tier, 30-minute consultation | Confirmed | INQ-FR-13 |
| C7 | Constraint | Free-tier hosting; owner supplies domain | Confirmed | architect/devops |
| C8 | Constraint | Ticker and use-case motion must honour NFR-04 and stay within SITE-NFR-03 | Confirmed | frontend |
| A2 | Assumption | English only | Confirmed | — |
| R2 | Risk | Late contact/domain/Figma assets delay launch | Identified | BR-09; Duong |
| R5 | Risk | Generic AI-startup visual drift | Identified | UX review; SITE-NFR-08 |
| R9 | Risk | Motion-rich use cases hurt CWV or accessibility | Identified | Mitigate per SITE-NFR-03/04/12 |
| R10 | Risk | Third-party names in ticker must stay descriptive and text-only | Mitigated | SITE-BR-06 |
| D4 | Dependency | Figma design system readable export | Pending | Duong; before S2 |
| D9 | Dependency | Owner chat prototype for Customer Support use case | Received | `docs/tools-ticker-use-cases/sources/2026-11-27-customer-support-ai-assistant-chat.html` |

## 8. Feature index
| Feature ID | Feature | Spec | Capability (ID) | Last changed (version, request) |
|---|---|---|---|---|
| SITE | Marketing site experience | `docs/features/SITE.md` | CAP-1 | 3.0, tools-ticker-use-cases |
| INQ | Contact, booking, limits | `docs/features/INQ.md` | CAP-2 | 2.1, template reshape |

## 9. Open questions
| ID | Question/decision | Severity | Impact | Owner |
|---|---|---|---|---|
| Q19 | Replace placeholders: inbox, public email, booking URL, domain; optional phone/LinkedIn | Non-blocking | BR-09; production | Duong |
| Q20 | Figma design system access or export | Non-blocking | SITE-NFR-08; S2 | Duong |

## 10. Change history
| Version | Request or change request | Features and IDs changed | Approver | Date |
|---|---|---|---|---|
| 2.1 | template reshape | Split v2.0 monolithic PRD into PRD + SITE + INQ specs; IDs prefixed; no intent change | — | 2026-11-27 |
| 2.1 | tools-ticker-use-cases | SITE SITE-FR-16, SITE-FR-17, SITE-NFR-12, SITE-BR-06; PRD W-3, C8, R9–R10, D9; D2 closes Q27–Q28 | — | 2026-11-27 |
| 3.0 | tools-ticker-use-cases | G1 Approve (D3). Draft v2.1 → baseline v3.0; Proposed requirements set Approved; closed Q27–Q28 | Duong | 2026-11-27 |