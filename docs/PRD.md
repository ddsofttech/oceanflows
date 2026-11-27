# Product Requirements Document

## Document control
- Status: Approved
- Version: `2.0`
- Last approved version: `2.0` (`docs/baselines/prds/PRD-v2.0.md`)
- Owner: Duong (Young) Dang, Founder, DD Software Solutions Inc. (named approver, D8). PRD content maintained by `requirements-analyst`
- Stakeholder approvers: Duong (Young) Dang
- Approval date: 2026-11-26

## 1. Executive summary
- Purpose (what and why): A responsive, single-page company branding and marketing website for DD Software Solutions Inc., an Alberta, Canada AI consulting and integration firm founded in 2023 that serves small and medium-sized businesses in Canada and the US. Its core message is "We help businesses turn AI opportunities into working solutions." The site explains what the company does, who it helps, why it can be trusted, and how to engage it. It is positioned "consulting first, implementation second" and makes no invented claims (sources: `docs/company-branding-website/sources/2026-11-24-project-request.md` §§1, 7, 8; `sources/2026-11-24-s17-answers.md`).
- Key outcomes: (1) credibility as an AI consulting and integration company, built on the founder's real experience rather than client proof, (2) clear, outcome-focused explanation of five service areas, (3) a visible four-stage engagement approach from discovery to delivery, (4) qualified consultation requests through a simple inquiry form and a 30-minute online booking. No numeric success target is set yet; inquiries and bookings are counted (O5).
- Release readiness: contact details, booking link, and domain use marked placeholders until the owner supplies them; none may reach production unresolved (BR-09). Brand identity comes from the owner's Figma design system (D4).
- Draft change (`inquiry-email-daily-limit`): cap inquiry form submissions at **3 per normalized email address per UTC calendar day** (BR-10, BR-11, BR-14), incrementing on each valid submit (BR-12), alongside IP burst protection of **1 POST per client IP per minute** (BR-13, TM-01). Privacy notice update for counter retention (FR-11; D2 Q26). §11 has no Blocking or Important items open for G1.

## 2. Problem and context
- Problem/opportunity: DD Software Solutions Inc. needs a professional web presence that establishes credibility and generates qualified consultation requests from SMBs adopting AI. The company wants to stand apart from vendors that "just sell AI tools or build chatbots". It does this by helping businesses identify opportunities, design appropriate solutions, integrate AI into existing systems, and deliver measurable value (source §1).
- Affected users: SMB owners and executives exploring AI adoption; companies looking to automate manual processes; organizations wanting to integrate AI into existing applications and systems (source §3), in Canada and the US, served remotely (Q8, Q16). Internally, the founder, who receives inquiries and bookings.
- Current workflow (if has): There is no existing website to replace or redirect (Q16).
- Known limitations (if has): The company has no testimonials, client logos, certifications, vendor accreditations, case studies, or publishable client work, and none may be invented (source §7; About source §5). Comparable consulting sites build trust from real names, a visible engagement process, and sourced claims only (research: `docs/company-branding-website/analysis/similar-solution-research.md`); here that is the founder's 10 years of software engineering experience and expertise (Q4). Real contact details, domain, and booking account are not supplied yet (Q1, Q11; D2, D3, D6). The Figma design system is not yet readable without the owner's access (D4).
- Follow-on (`inquiry-email-daily-limit`): The live site limits inquiry **POST** volume by client IP (**5 per 60 seconds**, in-memory per Worker isolate; SR-01 residual). A visitor can still send many inquiries with the **same email** across time or isolates. The owner asks to limit each email to **3 inquiries per day** and to tighten the IP limit to **1 per minute** while adding the email cap (`docs/inquiry-email-daily-limit/sources/2026-11-26-project-request.md`; D2).

## 3. Business objectives and success measures
| Objective | Measure | Target/source | Notes |
|---|---|---|---|
| O1 Establish credibility as an AI integration and consulting company | Every factual claim on the site is supplied or approved by the owner. No fabricated proof (BR-01, BR-02) | Pass/fail at owner content review / source §2, §7 | Quantitative credibility target not set |
| O2 Clearly communicate services and business value | All five service areas presented, each with the business problem and outcome | 5 of 5 / source §4 | FR-03 |
| O3 Demonstrate expertise without overwhelming non-technical owners | Plain-language copy. Every technical term explained where it is used (NFR-07) | Pass/fail at owner content review / source §2, §4 | — |
| O4 Help potential clients understand how AI can improve operations | Services and Approach describe operational outcomes (reduced repetitive work, accessible knowledge, integration with existing systems) | Source §2, §4 | No numeric outcome claims unless owner-supplied (BR-02) |
| O5 Generate qualified business inquiries and consultation requests | Count per month of valid form inquiries received in the inbox plus consultation bookings made, and the share of them that are qualified. **Qualified** = a business inquiry from an SMB or organization stating a need or interest in consulting, integration, or automation; spam and incomplete inquiries are excluded | No numeric target yet (Q6) / source §2 | Counted from the inbox and the booking tool; site visits from cookieless analytics (FR-14). Per-email daily cap (FR-15) reduces repeat and scripted abuse; legitimate visitors blocked by the cap are an accepted trade-off pending §11 |

## 4. Scope
### In scope
- Responsive, single-page marketing website with five anchored sections: Home, Services, Approach, About, Contact (source §6; Q12).
- Home: value proposition, consulting-first positioning, clear calls to action (source §6).
- Services: the five service areas in source §4, explained by business problem and outcome (source §4, §6).
- Approach: four stages from discovery and assessment to delivery and measurement (source §6; Q5).
- About: company background, founder, expertise, and philosophy, from the owner-supplied About content only (source §6, §7; Q4).
- Contact: simple inquiry form and 30-minute online consultation booking through Cal.com free tier (source §6; Q2, Q3).
- A privacy notice covering inquiry, booking, and analytics data, drafted for the owner's approval. Needed because the site collects personal data (analyst, compliance; Q8).
- Cookieless, privacy-friendly visitor analytics (Q7).
- English only (Q14).
- Brand look from the owner's Figma design system: clean, minimal, modern, trustworthy, strong typography, subtle animation (source §5; Q10).
- Per-email daily inquiry submission cap of **3** per UTC calendar day on `POST /api/inquiry` (FR-15, BR-10–BR-12), with IP limit **1 POST per client IP per rolling 60 seconds** (BR-13, TM-01). Durable cross-isolate enforcement is required for the email cap to be effective (NFR-11; impact `docs/inquiry-email-daily-limit/analysis/impact-analysis.md`).
- Privacy notice update (FR-11) describing per-email counter / hashed-key retention for rate limiting, before production (D2 Q26).
### Out of scope
- Testimonials, client logos, certifications, case studies, achievements, or statistics not supplied and verified by the owner (source §7).
- Complex backend systems: custom server application, database, user accounts, admin area, CMS. The founder updates content in source files and redeploys (source §7; Q15).
- Pricing and engagement packages (Q17).
- Multi-language versions (Q14).
- Proposed exclusions, not named in the sources and consistent with source §7 "avoid unnecessary features": blog/resources, on-site AI chatbot or demos, newsletter signup, CRM integration, e-commerce, cookie-based analytics or advertising tracking.
- For this request: user accounts, admin UI to reset limits, and any new visitor-facing feature beyond enforcing FR-15, BR-13, daily-limit error copy (FR-08 / FR-15), and the FR-11 privacy update for counters.
### Candidate MVP
- All in-scope items above. The source asks for a production-ready site with these five sections, so no smaller MVP is proposed.

## 5. Users and stakeholders
| Role/group | Needs/responsibilities | Decision authority |
|---|---|---|
| Duong (Young) Dang, Founder & AI Solutions Consultant, DD Software Solutions Inc. (requester) | Supplies business facts, content, Figma access, contact details, booking account, domain. Approves copy, privacy notice, and the PRD. Receives and answers inquiries and bookings. Updates content after launch | Approves PRD (G1) and all public claims |
| SMB owners and executives (prospective clients) | Understand quickly what the company does, whether it fits their business, and how to start. Mostly non-technical | None |
| Operations / process leads at SMBs | See how manual processes could be automated or AI integrated into existing systems | None |
| Technical stakeholders at client organizations | Enough technical substance to trust the expertise, without jargon dominating | None |

## 6. Functional requirements
| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-01 | Home presents the value proposition (AI consulting and integration for SMBs) led by the owner's core message "We help businesses turn AI opportunities into working solutions.", the "consulting first, implementation second" positioning, and a primary consultation call to action (source §1, §6; Q4 About §6) | Must | Approved |
| FR-02 | The site is a single page with anchored sections. Primary navigation reaches the Home, Services, Approach, About, and Contact sections from anywhere on the site and at every supported viewport width (source §6; Q12) | Must | Approved |
| FR-03 | Services presents exactly the five service areas in source §4: AI Consulting & Strategy, AI Integration, AI Agents & Automation, Knowledge & RAG Solutions, Custom AI Solutions. Each states the business problem it solves and the outcome in plain language (source §4, §6) | Must | Approved |
| FR-04 | Approach presents four ordered stages, each with what the client receives: (1) Discover & assess → an opportunity assessment and prioritized use cases; (2) Design → a solution approach and integration plan; (3) Integrate → a working integration into existing systems and workflows; (4) Deliver & measure → handover and guidance on measuring outcomes. It describes the typical format as a consulting engagement, not a fixed product package (source §1; Q5) | Must | Approved |
| FR-05 | About presents, from the owner-supplied About content only: company background (founded 2023, Alberta, Canada; industry), the founder Duong (Young) Dang with role and professional background, core expertise, technical experience, brand positioning, and the philosophy "What if we could make this better?" (source §6, §7; Q4: `sources/2026-11-24-s17-answers.md`) | Must | Approved |
| FR-06 | Contact provides an inquiry form with these fields: name (required), email (required), phone (optional), and inquiry message (required). No other fields (source §6 "simple inquiry form"; Q3) | Must | Approved |
| FR-07 | A valid inquiry is delivered to the company's designated inbox (`[INQUIRY_EMAIL]` until supplied, D3), and the visitor sees an on-page confirmation that it was sent. The confirmation makes no response-time promise (Q1, Q13) | Must | Approved |
| FR-08 | The form validates required fields and email format before sending, shows a specific error next to each invalid field, and keeps entered values. If delivery fails, the visitor sees an error message with an alternative way to reach the company | Must | Approved |
| FR-09 | A consultation call to action appears on Home and at the end of Services, Approach, and About, and leads to the Contact section, where the inquiry form and booking are offered (source §6 "clear calls to action"; research: one repeated primary CTA; Q2) | Should | Approved |
| FR-10 | Contact shows the company's public contact details as an alternative to the form: public email (`[PUBLIC_EMAIL]` until supplied) and location "Alberta, Canada"; phone (`[PUBLIC_PHONE]`) and LinkedIn (`[LINKEDIN_URL]`) only when the owner supplies them (Q1, BR-09) | Should | Approved |
| FR-11 | A privacy notice explains what data the inquiry form, the booking tool, and the analytics collect, why, who receives it (including the third-party services used), and how to request deletion. It is linked from the form and the site footer. The text is drafted for the owner's approval before launch, written for a company based in Alberta, Canada serving visitors in Canada and the US (analyst, compliance; Q8). **For this request:** the notice also describes storing inquiry submission counts or hashed email keys for per-email daily rate limiting, including retention aligned to the UTC day window (BR-11) (D2 Q26) | Must | Approved |
| FR-12 | Requesting a URL that does not exist shows a not-found page with the primary navigation and a link to Home | Should | Approved |
| FR-13 | Contact offers online booking of a 30-minute consultation through Cal.com (free tier), as a link or embed alongside the inquiry form. The booking link is `[BOOKING_URL]` until the owner's Cal.com account exists (Q2; D6) | Must | Approved |
| FR-14 | The site measures visits with privacy-friendly analytics that set no cookies (for example Cloudflare Web Analytics or equivalent), so no cookie-consent banner is needed for analytics (Q7) | Should | Approved |
| FR-15 | The inquiry API enforces a maximum of **3** counted inquiry submissions per **UTC calendar day** (BR-11) for each submitted email address after normalization (BR-14). Submissions over the cap are not delivered to the inbox and do not show the visitor a success confirmation (same abuse posture as BR-07). The daily counter increments per BR-12. When the cap is hit, the visitor sees error copy that clearly states the **daily inquiry limit** was reached, distinct from the IP burst message (D2 Q24). Both BR-13 and FR-15 apply; IP check runs first (D2 Q25) (`docs/inquiry-email-daily-limit/sources/2026-11-26-project-request.md`) | Must | Approved |

Status: Proposed/Approved/Implemented
## 7. Non-functional requirements
| ID | Quality attribute | Requirement/measure | Status |
|---|---|---|---|
| NFR-01 | Responsiveness | All sections are fully usable on phone, tablet, and desktop widths with no horizontal scrolling and no content or controls cut off (source §6 "responsive") | Approved |
| NFR-02 | Accessibility | Conforms to WCAG 2.2 Level AA, including the form, booking entry point, and navigation: keyboard operable with a visible focus indicator, and every form field has a programmatic label (Q9) | Approved |
| NFR-03 | Performance | Core Web Vitals "good" on mobile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (Q9; source §7 "lightweight implementation") | Approved |
| NFR-04 | Motion | Animations and interactions are subtle and never block reading or input. When the visitor's system requests reduced motion, non-essential animation is disabled (source §5) | Approved |
| NFR-05 | Simplicity / maintainability | No custom backend system, database, user accounts, admin area, or CMS. Form delivery is the only server-side behavior; booking and analytics are third-party hosted services. Content is updated in source files and redeployed. Hosted on a free tier of a static/JAMstack host such as Vercel or Netlify, with no paid hosting budget assumed for the MVP (source §7; Q11, Q15) | Approved |
| NFR-06 | Security and privacy | All pages served over HTTPS. Automated spam submissions are not delivered to the inbox. Inquiry data is sent only to the designated inbox and not published or shared with third parties beyond the services named in the privacy notice. Analytics set no cookies (analyst; FR-11, FR-14) | Approved |
| NFR-07 | Content quality and tone | Copy is professional, confident, and approachable. It describes business outcomes before technology, explains every technical term (e.g. RAG, AI agent) where first used, and uses no unexplained buzzwords or exaggerated claims (source §4, §5, §7) | Approved |
| NFR-08 | Visual identity | Logo, colors, typography, and other brand artifacts come from the owner's Figma design system "DD Software Solutions Branding" (file key `LkfGLRJsrCSCoYdu9m0hyf`); no alternate brand assets are invented. Clean, minimalist, sophisticated, with strong typographic hierarchy. No generic stock imagery, no AI clichés (e.g. robots, glowing brains, futuristic circuitry), no overly complex animation (source §5; Q10). Judged at UX review | Approved |
| NFR-09 | Browser support | Works in current versions of Chrome, Safari, Firefox, and Edge on desktop and mobile (assumption A3) | Approved |
| NFR-10 | Discoverability | The main page and the privacy notice each have a unique title and meta description and are indexable by search engines (source §8 "production-ready") | Approved |
| NFR-11 | Abuse control (cross-isolate) | The per-email daily limit (FR-15) is enforced consistently for the same email across all inquiry API instances (not only within one Worker isolate). Mechanism is for architecture (impact analysis flags need for durable edge storage such as Cloudflare KV) | Must | Approved |

Status: Proposed/Approved/Implemented
## 8. Business rules and workflows
- Rules:

| ID | Rule | Source | Traces to |
|---|---|---|---|
| BR-01 | The site shows no testimonials, client logos, certifications, vendor accreditations, partnerships, client names, case studies, awards, or achievements unless the owner supplies them and confirms they are true and publishable. None are supplied for this release | Source §7; Q4 About §5 | FR-05, O1 |
| BR-02 | Any numeric or outcome claim (e.g. "saves X hours") appears only if the owner supplies it with a verifiable basis. Otherwise capabilities are described qualitatively. The founder's "10 years of experience" is owner-supplied | Source §7 "credible, specific messaging"; Q4 | FR-03, FR-04, FR-05, NFR-07 |
| BR-03 | Services are the five areas in source §4, named as there, each described by problem and outcome | Source §4 | FR-03 |
| BR-04 | Consulting is presented before implementation: Home positioning and the first Approach stage lead with understanding the business and identifying opportunities | Source §1 | FR-01, FR-04 |
| BR-05 | An inquiry is sent only when name, email, and message are present and the email has a valid format. Phone is optional and never blocks sending | Source §6; Q3; analyst | FR-06, FR-08 |
| BR-06 | A sent inquiry contains every submitted field and reaches the designated inbox | Analyst; Q1 | FR-07 |
| BR-07 | Submissions detected as automated spam are not delivered and show the visitor no success confirmation | Analyst | NFR-06 |
| BR-08 | No response-time promise is displayed | Source §7 (no unsupported claims); Q13 | FR-07 |
| BR-09 | Placeholders (`[INQUIRY_EMAIL]`, `[PUBLIC_EMAIL]`, `[BOOKING_URL]`, domain) may be used before launch but none ships to production unresolved. Optional details (`[PUBLIC_PHONE]`, `[LINKEDIN_URL]`) not supplied by launch are omitted, not shown as placeholders | Q1 (`sources/2026-11-24-s17-answers.md` "Q1 placeholders"); Q11 | FR-07, FR-10, FR-13, D2, D3, D6 |
| BR-10 | A submitted email address (after normalization per BR-14) may accumulate at most **3** counted inquiry submissions per day (BR-11, BR-12). Further attempts that UTC day are not delivered and receive no success confirmation | D2; `docs/inquiry-email-daily-limit/sources/2026-11-26-project-request.md` | FR-15, NFR-06 |
| BR-14 | Before per-email counting (BR-10), the submitted email is **normalized**: trim leading and trailing whitespace and lowercase the full address; remove the **plus-tag** segment of the local part (from the first `+` in the local part through `@`, exclusive) so `local+tag@domain` and `local@domain` are the same address; for domains **gmail.com** and **googlemail.com**, remove all dots from the local part so dot variants are the same address | D3 Q22a (b) | FR-15, BR-10 |
| BR-11 | A **day** for the per-email inquiry cap is a **UTC calendar day**. The counter resets at **00:00:00 UTC** | D2 Q21 | FR-15, BR-10 |
| BR-12 | The per-email daily counter **increments once** for each inquiry **POST** that passes field validation (BR-05), whether or not the message is later delivered (D2 Q23). It does not increment on requests that fail validation | D2 Q23 | FR-15, BR-10 |
| BR-13 | The inquiry API allows at most **1** inquiry **POST** per client IP per **rolling 60-second** window. Additional POSTs in that window are rejected with HTTP **429** `rate_limited` and are not delivered. This limit applies together with BR-10; the IP check runs **before** the per-email daily cap (D2 Q25) | D2 Q25; TM-01 | FR-15, NFR-06 |

- Workflows:
  - W1 Visitor to inquiry (normal): visitor lands on any section → reads value proposition / services / approach → selects a consultation CTA (FR-01, FR-09) → arrives at Contact → enters name, email, message, and optionally phone → submits → IP rate check (BR-13 / TM-01) passes → validation passes (BR-05) → per-email daily cap check passes (BR-10) and counter incremented (BR-12) → inquiry delivered to inbox (BR-06) unless spam path (BR-07) → on-page confirmation shown when delivered (FR-07).
  - W1b Visitor to booking (alternate): visitor selects a consultation CTA → arrives at Contact → opens the Cal.com booking (FR-13) → picks a 30-minute slot and confirms in Cal.com. Booking confirmation and reminders are handled by Cal.com, not the site.
  - W2 Company follow-up (outside the site): the founder reads the inquiry in the inbox and replies by email, or holds the booked consultation. The site keeps no inquiry or booking state.
- Exceptions:
  - E1 Invalid input: missing required field or malformed email → no send; field-level error shown; entered values kept (FR-08).
  - E2 Delivery failure (network or service error) → error message with alternative contact details (FR-08, FR-10); entered values kept.
  - E3 Automated spam submission → not delivered (BR-07).
  - E4 Unknown URL → not-found page with navigation (FR-12).
  - E5 Reduced-motion preference → non-essential animation disabled (NFR-04).
  - E6 Repeat submission: a visitor who submits again after confirmation may send another inquiry if BR-10 and BR-13 allow it (FR-15 supersedes prior "no de-duplication" intent for the same email within a UTC day).
  - E8 Per-email daily cap: normalized email has reached **3** counted inquiries in the current UTC day (BR-10, BR-11) → no delivery; visitor sees clear **daily limit reached** copy (distinct from IP burst copy) (FR-15, D2 Q24); no success confirmation.
  - E9 IP burst limit: client IP has already posted an inquiry within the rolling 60-second window (BR-13) → HTTP **429** `rate_limited`; no delivery; visitor sees IP burst copy (existing "wait a moment" behavior unless architect aligns copy in S3).
  - E7 Booking tool unavailable (fails to load) → the inquiry form and public email remain available on Contact (FR-06, FR-10).
- Scenarios (normal / alternate / failure):

| Type | Scenario | Expected outcome | IDs |
|---|---|---|---|
| Normal | Owner of a 30-person firm reads Home on mobile, opens Services, selects the CTA, sends an inquiry | Inquiry in inbox; confirmation shown | FR-01–03, FR-06–07, FR-09, NFR-01 |
| Alternate | Visitor goes straight to Contact from navigation and uses the displayed email instead of the form | Contact details visible and usable | FR-02, FR-10 |
| Alternate | Visitor books a 30-minute consultation from Contact instead of sending the form | Cal.com booking opens with a 30-minute consultation | FR-09, FR-13 |
| Alternate | Keyboard-only visitor navigates all sections and sends the form | Fully operable with visible focus | NFR-02 |
| Failure | Visitor submits with an invalid email | No send; error on email field; other values kept | FR-08, BR-05 |
| Failure | Form delivery service unavailable | Error plus alternative contact path; values kept | FR-08, FR-10 |
| Failure | Bot submits the form | Not delivered | NFR-06, BR-07 |
| Failure | Same email submits a fourth inquiry after three counted submissions that UTC day | Not delivered; no success confirmation; daily-limit copy shown | FR-15, BR-10, BR-11 |
| Failure | Same IP submits a second inquiry within 60 seconds | HTTP 429 `rate_limited`; not delivered | BR-13, TM-01, NFR-06 |

## 9. Acceptance criteria
| Requirement ID | Given/When/Then or equivalent |
|---|---|
| FR-01 | Given a visitor opens Home at any supported width, when the first screen renders, then it shows the core message "We help businesses turn AI opportunities into working solutions." (or owner-approved wording of it), a statement that the company provides AI consulting and integration for SMBs, a statement of the consulting-first positioning, and a visible consultation CTA that leads to Contact |
| FR-02 | Given any scroll position on the site at phone, tablet, and desktop widths, when the visitor uses the primary navigation, then each of the Home, Services, Approach, About, and Contact sections is reached in one action from the navigation (opening a collapsed menu does not count as an action), on the same page |
| FR-03 | Given the Services section, when reviewed, then it lists exactly the five service areas named in source §4, and each has (a) a business problem statement and (b) an outcome statement in plain language. Owner review passes |
| FR-04 | Given the Approach section, when reviewed, then it shows, in order, Discover & assess, Design, Integrate, and Deliver & measure, each with its client deliverable as stated in FR-04, and describes the format as a consulting engagement, not a fixed product package |
| FR-05 | Given the About section, when the owner reviews it, then it includes the founding year (2023), location (Alberta, Canada), the founder's name and role, core expertise, and the philosophy "What if we could make this better?"; every factual statement matches the owner-supplied About content; it contains no certification, partnership, client name, testimonial, or case study; and the owner signs off |
| FR-06 | Given the Contact form, when inspected, then it has exactly four labelled fields: name, email, and inquiry message marked required, and phone marked optional |
| FR-07 | Given valid values in all required fields, when the visitor submits, then the designated inbox receives a message containing every submitted value, and the page shows a confirmation that the inquiry was sent, with no response-time promise |
| FR-08 | Given an empty required field or an email without a valid format, when the visitor submits, then nothing is sent, an error message appears next to each invalid field, and all entered values remain. Given delivery fails, when the visitor submits valid values, then an error message with an alternative contact method appears and entered values remain |
| FR-09 | Given Home and the end of Services, Approach, and About, when viewed, then each shows a consultation CTA, and activating it brings the visitor to the Contact section showing the inquiry form and the booking option |
| FR-10 | Given the Contact section, when viewed, then the public email address is shown and opens a new email when activated, and "Alberta, Canada" is shown; phone and LinkedIn appear only if supplied. Given a production build, when inspected, then no `[...]` placeholder is shown (BR-09) |
| FR-11 | Given the Contact form and the site footer, when viewed, then each links to a privacy notice stating what data the form, booking tool, and analytics collect, why, who receives it (naming the third-party services used), and how to request deletion. Given a production release, the owner has approved the notice text |
| FR-12 | Given a URL that matches no page, when requested, then a not-found page is shown with the primary navigation and a link to Home |
| FR-13 | Given the Contact section, when the visitor activates the booking option, then a Cal.com booking for a 30-minute consultation opens (linked or embedded) alongside the inquiry form. Given a production build, the booking points to the owner's Cal.com account, not a placeholder. Given the booking tool fails to load, the inquiry form and public email remain usable |
| FR-14 | Given any page load, when inspected, then a visit is recorded by the analytics service and no cookie is set by analytics, and no cookie-consent banner is shown for analytics |
| NFR-01 | Given each section at phone (360 px), tablet (768 px), and desktop (1440 px) widths, and at 320 px (the WCAG 2.2 AA reflow minimum, NFR-02), when viewed, then there is no horizontal scrolling and no text or control is cut off or overlapping |
| NFR-02 | Given an audit of every page and state (including form errors and confirmation) against WCAG 2.2 Level AA, when run with automated checks and a manual keyboard and screen-reader pass, then no Level A or AA failure remains |
| NFR-03 | Given the main page measured on mobile (lab measurement at release; field data once available), when Core Web Vitals are checked, then LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 |
| NFR-04 | Given the OS "reduce motion" setting is on, when any page loads and is scrolled, then non-essential animations do not play. Given it is off, no animation delays access to content or controls |
| NFR-05 | Given the delivered system, when its architecture is reviewed, then it has no custom backend application, database, user accounts, admin area, or CMS; the only server-side behavior is form delivery; it runs on a free hosting tier; and content changes are made in source files and redeployed |
| NFR-06 | Given any page requested over HTTP, when loaded, then it is served over HTTPS. Given an automated test submission flagged as spam, when sent, then it does not reach the inbox |
| NFR-07 | Given the full site copy, when the owner reviews it against NFR-07, then every technical term is explained where first used, each service leads with a business outcome, and no claim lacks an owner-approved basis (BR-02). Owner signs off |
| NFR-08 | Given the screens, when reviewed at UX review (G3), then logo, colors, and typography match the owner's Figma design system, they contain no generic stock imagery and no AI clichés (robots, glowing brains, futuristic circuitry), and the reviewer confirms the minimal, typography-led direction of source §5 |
| NFR-09 | Given current Chrome, Safari, Firefox, and Edge on desktop and mobile, when the FR-01–FR-14 checks run, then all pass in each browser |
| NFR-10 | Given the main page and the privacy notice, when their HTML is inspected, then each has a unique title and meta description and is not blocked from indexing |
| BR-14 | Given valid inquiry submits that UTC day, when two submitted addresses normalize to the same key under BR-14 (e.g. `Local+tag@gmail.com` and `local@gmail.com`, or `f.irst@gmail.com` and `first@gmail.com`), then they share one per-email daily counter and the combined counted submissions cannot exceed **3** before BR-10 blocks further delivery |
| FR-15 | Given BR-11 (UTC calendar day), BR-12 (increment on valid submit), and BR-14 (email normalization), when the same normalized email has already reached **3** counted inquiries within the current UTC day, and the visitor submits again with valid required fields, then the designated inbox receives no additional message for that attempt, the page does not show success confirmation, and the visitor sees copy that clearly states the **daily inquiry limit** was reached (not the IP burst message) |
| NFR-11 | Given two or more inquiry API instances (or a test that simulates separate isolates), when submissions with the same normalized email would exceed **3** counted inquiries in the same UTC day in aggregate, then the cap is still enforced and the fourth attempt is rejected as in FR-15 |
| BR-13 / TM-01 | Given a valid inquiry POST from a client IP, when a second valid inquiry POST from the same IP is sent within 60 seconds, then the response is HTTP **429** with body including `"error":"rate_limited"` and the second is not delivered |
| FR-11 (this request) | Given a production release including FR-15, when the privacy notice is reviewed, then it describes per-email inquiry counters or hashed keys used for daily rate limiting and retention aligned to the UTC day window (D2 Q26) |

## 10. Constraints, assumptions, risks, dependencies

| ID | Type | Description | Status | Owner/action |
|---|---|---|---|---|
| C1 | Constraint | Keep the site simple and maintainable. No unnecessary features, complex backend systems, or overengineering. Lightweight implementation (source §7) | Confirmed | All roles |
| C2 | Constraint | Do not invent testimonials, client logos, certifications, case studies, or achievements (source §7) | Confirmed | All roles; BR-01 |
| C3 | Constraint | Credible, specific messaging; no exaggerated AI marketing claims or unexplained buzzwords (source §5, §7) | Confirmed | Copy authors; BR-02, NFR-07 |
| C4 | Constraint | Identify missing business information rather than assume it (source §7) | Confirmed | requirements-analyst; §11 |
| C5 | Constraint | Avoid futuristic AI clichés, generic stock imagery, overly complex animation (source §5) | Confirmed | designer; NFR-08 |
| C6 | Constraint | Online booking uses Cal.com free tier, 30-minute consultation (Q2) | Confirmed | architect, frontend; FR-13 |
| C7 | Constraint | Hosting on a free tier of Vercel or Netlify (static/JAMstack); no paid hosting budget for the MVP. Domain to be supplied by the owner (Q11) | Confirmed | architect, devops; NFR-05, D2 |
| A1 | Assumption | There is no existing website or content to migrate or redirect | Confirmed (Q16) | — |
| A2 | Assumption | The site is English only | Confirmed (Q14) | — |
| A3 | Assumption | Supported browsers are current Chrome, Safari, Firefox, Edge (desktop and mobile) | Proposed | Owner to confirm at G1 |
| A4 | Assumption | Site copy is drafted from the sources plus owner-supplied facts, and the owner approves all copy before release | Proposed | Owner to confirm at G1 |
| R1 | Risk | Without client proof (C2), credibility may feel thin | Identified | Mitigation: the founder's real background and expertise on About (FR-05), concrete Approach with per-stage deliverables (FR-04), specific service outcomes. Owner may later supply authorized project examples |
| R2 | Risk | Real contact details, booking account, domain, or Figma access arrive late and delay launch | Identified | Placeholders allowed until launch; none ships unresolved (BR-09). Track D2, D3, D4, D6 |
| R3 | Risk | Contact form attracts spam | Identified | NFR-06 / BR-07 mitigation; mechanism by architect |
| R4 | Risk | Privacy notice does not meet the rules that apply to a company in Alberta, Canada with visitors in Canada and the US | Identified | Notice drafted for the owner's approval before launch (FR-11, Q8); the owner may seek legal review |
| R5 | Risk | Design drifts into a generic AI-startup template | Identified | NFR-08 checked at UX review against the Figma design system |
| R6 | Risk | An embedded Cal.com widget may set its own cookies, which could reintroduce a consent need that cookieless analytics avoids (FR-14) | Identified | architect: check at S3; if so, prefer a booking link over an embed (FR-13 allows either) and name Cal.com in the privacy notice |
| R7 | Risk | Free hosting tiers differ in whether commercial use is permitted (Vercel's Hobby plan terms are for personal, non-commercial use) | Identified | architect/devops: at S3, pick a free tier within C7 whose terms permit a company marketing site (e.g. Netlify free), or escalate if none fits |
| D1 | Dependency | Owner-supplied content: About content (Q4) | Received 2026-11-24 | `sources/2026-11-24-s17-answers.md` |
| D2 | Dependency | Domain name (placeholder until supplied) and hosting account on a free tier (Q11) | Pending | Duong, then devops; before production launch |
| D3 | Dependency | Real values for `[INQUIRY_EMAIL]` and `[PUBLIC_EMAIL]`; optional `[PUBLIC_PHONE]`, `[LINKEDIN_URL]` (Q1) | Pending | Duong; before production launch |
| D4 | Dependency | Readable access to or export of the Figma design system (tokens, logo, assets) (Q10) | Pending access | Duong, then designer; before S2 design work |
| D5 | Dependency | A form-delivery mechanism compatible with NFR-05 | Pending | architect (S3) |
| D6 | Dependency | Owner's Cal.com free account with a 30-minute consultation event, replacing `[BOOKING_URL]` (Q2) | Pending | Duong; before production launch |
| R8 | Risk | Per-email counters need durable edge storage; wrong TTL, clock, or loss of store could block legitimate visitors or fail to cap abuse (NFR-11) | Identified | architect at S3; TTL tied to BR-11 UTC day |
| D7 | Dependency | Durable store or equivalent for cross-isolate per-email counters (options such as Cloudflare KV flagged in impact analysis; not a design decision here) | Pending | architect (S3); blocks effective FR-15 in production |
| D8 | Dependency | Owner approval of updated privacy notice text covering per-email counter / hashed-key rate limiting (D2 Q26) | Pending | Duong; before production with FR-15 |
| A5 | Assumption | The IP rate limit is **1 POST per client IP per rolling 60 seconds** (BR-13), replacing the prior **5/min** shipped behavior (D2 Q25) | Confirmed (D2) | — |

## 11. Open questions
List items with severity priority: **Blocking** -> **Important** -> **Non-blocking**. Everything is uncertain, needs user attention belongs here.

| Priority | ID | Question/decision | Impact | Owner | Due/trigger | Severity |
|---|---|---|---|---|---|---|
| 1 | Q19 | Supply the real values that replace the placeholders: inquiry inbox `[INQUIRY_EMAIL]`, public email `[PUBLIC_EMAIL]`, Cal.com booking link `[BOOKING_URL]`, and domain; optionally phone `[PUBLIC_PHONE]` and LinkedIn `[LINKEDIN_URL]` (omitted if not supplied) | BR-09, FR-07, FR-10, FR-13, D2, D3, D6. Production launch cannot happen until supplied | Duong | Before production launch (S6) | Non-blocking |
| 2 | Q20 | Grant readable access to, or export, the Figma design system (tokens, logo, assets) | NFR-08, D4. S2 design work cannot extract brand tokens without it | Duong | Before S2 design work | Non-blocking |

## 12. Change history
| Version | Request or change request | Change (sections, IDs) | Approver | Date |
|---|---|---|---|---|
| 0.1 | company-branding-website | Created PRD from template. Document control, §§1–11 written (FR-01–FR-12, NFR-01–NFR-10, BR-01–BR-08, C1–C5, A1–A4, R1–R5, D1–D5, Q1–Q18) | — (pending G1) | 2026-11-24 |
| 0.2 | company-branding-website | Applied S1.7 answers (decision log D2–D8; `sources/2026-11-24-s17-answers.md`, `sources/2026-11-24-figma-design-system.md`). Document control: approver Duong. §1, §2 refreshed. §3 O5 (no numeric target; "qualified" defined). §4 single page, booking, analytics, English only, no CMS, pricing out. §5 founder role. §6 FR-01, FR-02, FR-04–FR-07, FR-09–FR-11 changed; FR-13 (Cal.com booking) and FR-14 (cookieless analytics) added. §7 NFR-02 (WCAG 2.2 AA), NFR-03 (CWV good), NFR-05, NFR-06, NFR-08 (Figma), NFR-10 changed. §8 BR-01, BR-02, BR-05, BR-06, BR-08 changed; BR-09 (placeholders) added; W1b, E7 added. §9 matching criteria. §10 C6, C7, R6, R7, D6 added; A1, A2 confirmed; R1, R2, R4, R5, D1–D4 updated. §11 Q1–Q18 closed; Q19, Q20 added (Non-blocking) | — (pending G1) | 2026-11-24 |
| 1.0 | company-branding-website | G1 Approve (decision log D9). v0.2 promoted to baseline v1.0: document control Approved; §6 FR-01–FR-14 and §7 NFR-01–NFR-10 set to Approved. No requirement content changed | Duong | 2026-11-24 |
| 1.1 (draft) | inquiry-email-daily-limit | S1.1–S1.7: per-email daily cap (FR-15, NFR-11, BR-10), scope, §8 E6/E8, §9 criteria, §10 R8/D7/A5, §11 Q21–Q26 (Blocking/Important). Baseline remains v1.0 until G1 | — (pending G1) | 2026-11-26 |
| 1.1 (draft) | inquiry-email-daily-limit | D2 applied: BR-11–BR-13; FR-11/FR-15; §4 in-scope IP 1/min + privacy; §8 E9; §9 ACs; §10 D8, A5 confirmed; §11 Q21/Q23–Q26 closed → requirements; **Q22a** Blocking (Q22 ambiguous). G1 held | — (pending G1) | 2026-11-26 |
| 1.1 (draft) | inquiry-email-daily-limit | D3 Q22a (b): BR-14 (trim, lowercase, plus-tags, Gmail/googlemail dots); §6 FR-15, §8 BR-10, §9 FR-15 AC updated; §11 Q22a closed; §1 refreshed. S1.7 complete → S1.8 G1 package | — (pending G1) | 2026-11-26 |
| 2.0 | inquiry-email-daily-limit | G1 Approve (D4). Content approved as next baseline; numbered **v2.0** per sdlc-check (approved baselines end in .0). FR-15/NFR-11 Approved. No design trigger; route S3.1 | Duong | 2026-11-26 |
