# Feature Spec: Marketing site experience
<!-- budget: lines=120 chars=300 -->

## Document control
- Feature ID: `SITE`
- Capability (PRD §4 ID): CAP-1
- Inherits (PRD IDs): BR-01, BR-02, BR-09, C1, C5, W-1, W-3
- Last changed: 3.0, tools-ticker-use-cases

## 1. Purpose and users
- Job: Present DD Software Solutions to SMB visitors: value prop, five services, approach, four use cases, about, CTAs, analytics.
- Users: Prospective SMB clients (see PRD §3). Success: O1–O4.

## 2. Scope
### In scope
- Anchored sections Home, Services, tools ticker, Approach, Use cases, About; primary nav; 404; cookieless analytics
- **This request:** ticker below Services; motion-rich interactive Use cases (design options at G2)
### Out of scope
- Contact form, booking, inquiry API (INQ); ticker item deep links to vendors

## 3. Functional requirements
| ID | Requirement | Priority | Status | Source |
|---|---|---|---|---|
| SITE-FR-01 | Home: core message, consulting-first positioning, primary consultation CTA | Must | Approved | source §6 |
| SITE-FR-02 | Single-page anchored nav: Home, Services, Approach, About, Contact, Use cases | Must | Approved | Q12; `#use-cases` |
| SITE-FR-03 | Services: five areas from source §4, each problem + outcome | Must | Approved | source §4 |
| SITE-FR-04 | Approach: four ordered stages with deliverables per FR-04 baseline | Must | Approved | Q5 |
| SITE-FR-05 | About: owner-supplied facts only; no invented proof | Must | Approved | Q4 |
| SITE-FR-09 | Consultation CTA on Home, end of Services, Approach, About → Contact | Should | Approved | source §6 |
| SITE-FR-12 | Unknown URL → 404 with nav and Home link | Should | Approved | analyst |
| SITE-FR-14 | Privacy-friendly analytics; no analytics cookies | Should | Approved | Q7 |
| SITE-FR-16 | **Tools ticker** immediately below Services: text-only descriptors for exactly these tools/platforms in order: Claude, n8n, Cursor, Composio, MCP Server, Supabase, Notion, Google Workspace, Microsoft, Cloudflare, AWS, Azure | Must | Approved | tools-ticker-use-cases |
| SITE-FR-17 | **Use cases** `#use-cases`: four SMB workflows; interactive motion-rich presentation; Customer Support may use owner chat prototype; designer proposes options at G2 | Must | Approved | tools-ticker-use-cases |

## 4. Non-functional requirements
| ID | Quality attribute | Requirement/measure | Status | Source |
|---|---|---|---|---|
| SITE-NFR-01 | Responsiveness | Usable 320px–desktop; no horizontal scroll | Approved | source §6 |
| SITE-NFR-02 | Accessibility | WCAG 2.2 AA; keyboard, labels, focus | Approved | Q9 |
| SITE-NFR-03 | Performance | Mobile CWV good: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 | Approved | Q9 |
| SITE-NFR-04 | Motion | Non-essential motion off when `prefers-reduced-motion`; never blocks reading | Approved | source §5 |
| SITE-NFR-07 | Copy | Outcomes before tech; terms explained on first use | Approved | source §4 |
| SITE-NFR-08 | Visual identity | Figma design system; no AI cliché stock; typography-led | Approved | Q10 |
| SITE-NFR-09 | Browsers | Current Chrome, Safari, Firefox, Edge | Approved | A3 |
| SITE-NFR-10 | SEO | Unique title and meta on main page | Approved | source §8 |
| SITE-NFR-12 | Use-case motion | Static title/summary readable without interaction; demos decorative; pause/hide on reduced motion; no autoplay audio | Approved | tools-ticker-use-cases |

## 5. Business rules
| ID | Rule | Source |
|---|---|---|
| SITE-BR-03 | Five service names match source §4 | source §4 |
| SITE-BR-04 | Consulting before implementation on Home and Approach | source §1 |
| SITE-BR-05 | Use cases remain qualitative illustrations, not client claims (BR-02) | source §7 |
| SITE-BR-06 | Ticker shows text-only tool names; no official third-party logos or wordmarks | tools-ticker-use-cases |

## 6. Workflow, states, and scenarios
- Workflow: scroll Home → Services → ticker → later sections; optional "Explore use cases" from hero (W-3).
- States: use-case card idle / in-demo / reduced-motion static.
- Exceptions: reduced motion → SITE-NFR-04/12 static fallbacks.
- Scenarios:
  - Normal: mobile visitor reads Services, sees ticker, opens Use cases, reaches CTA.
  - Alternate: keyboard user navigates to `#use-cases` from nav.
  - Failure: heavy animation deferred; content still readable (SITE-NFR-12).

## 7. Acceptance criteria
| ID | Requirement ID | Given / When / Then |
|---|---|---|
| SITE-AC-01 | SITE-FR-01 | Given Home loads, then core message, consulting-first line, and CTA to Contact are visible |
| SITE-AC-02 | SITE-FR-02 | Given any viewport, when using primary nav, then each listed section is reached in one action |
| SITE-AC-03 | SITE-FR-03 | Given Services, then five named areas each have problem and outcome (owner review) |
| SITE-AC-16 | SITE-FR-16 | Given Home, when Services ends, then ticker shows each named tool with accessible text label in the fixed order in SITE-FR-16 |
| SITE-AC-17 | SITE-FR-17 | Given Use cases, then four workflows remain listed with title and summary without interaction; Customer Support demo matches owner prototype intent; reduced motion shows static equivalent |
| SITE-AC-N03 | SITE-NFR-03 | Given mobile lab run, then LCP, INP, CLS within targets with new sections enabled |
| SITE-AC-N04 | SITE-NFR-04,12 | Given reduced motion on, then ticker and use-case loops do not animate |

## 8. Constraints, assumptions, risks, dependencies
| ID | Type | Description | Status | Owner/action |
|---|---|---|---|---|
| SITE-R1 | Risk | Only Customer Support has owner imagery/prototype; other three need design | Identified | designer S2 |
| SITE-D1 | Dependency | Prototype HTML for Customer Support chat demo | Available | sources/2026-11-27-customer-support-ai-assistant-chat.html |

## 9. Open questions
| ID | Question/decision | Severity | Impact | Owner |
|---|---|---|---|---|
| Q29 | Visual treatment for three use cases without owner assets | Non-blocking | SITE-FR-17 design | designer at G2 |