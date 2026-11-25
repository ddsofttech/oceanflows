# UX Brief

- Started by: G1 decision D9 (2026-11-24) confirmed design **trigger 1, Greenfield UI**: the product has no UI and no design system. Baseline: `docs/baselines/prds/PRD-v1.0.md`. Profile: Standard. G2 stops for the design system and visual identity (trigger 1); no T3 screen; tiers are not a G2 decision in Standard but are listed for the human.
- Status: S2.1 done; S2.2 (G2) package prepared, awaiting the human. Nothing built.
- `docs/COMPONENTS.md`: does not exist (greenfield). Every component below is new.

## A. Screens and tiers
| Screen or state | Requirement IDs | Tier (T0 / T1 / T2 / T3) | Why this tier | Catalog components |
|---|---|---|---|---|
| Design system (tokens, base components) | NFR-08, NFR-02, NFR-04 | Design-system change | Trigger 1: nothing exists; built first in S2.3 | None yet; created in S2.3 |
| Site header and primary navigation (desktop bar, collapsed mobile menu, current-section indicator) | FR-02, NFR-01, NFR-02 | T2 | New interaction (anchored nav, mobile menu) and a component the catalog lacks | New: SiteHeader, PrimaryNav, Button |
| Home section (first screen) | FR-01, FR-09, BR-04, NFR-03 | T2 | New screen with no existing pattern | New: SectionHeading, Button |
| Services section | FR-03, FR-09, BR-03, NFR-07 | T2 | New screen with no existing pattern | New: ServiceItem, ConsultationCta |
| Approach section | FR-04, FR-09, BR-04 | T2 | New screen with no existing pattern | New: ApproachStage, ConsultationCta |
| About section | FR-05, FR-09, BR-01, BR-02, R1 | T2 | New screen with no existing pattern | New: FounderProfile, ExpertiseList, ConsultationCta |
| Contact section: form (idle, field errors, sending, sent, delivery failure), booking (available, unavailable), contact details (with/without optional phone and LinkedIn) | FR-06–FR-08, FR-10, FR-11, FR-13, BR-05–BR-09, W1, W1b, E1–E3, E6, E7 | T2 | New flows W1 and W1b with several states | New: InquiryForm, TextField, TextArea, StatusMessage, BookingPanel, ContactDetails |
| Site footer (privacy link, contact) | FR-11, FR-02 | T2 | Component the catalog lacks | New: SiteFooter |
| Privacy notice page | FR-11, NFR-10 | T2 | New screen; no long-form text pattern exists yet. Higher of T0/T2 chosen because no pattern exists to follow | New: Prose; SiteHeader, SiteFooter |
| Not-found page | FR-12, E4 | T2 | New screen; no pattern exists yet (same reason as privacy) | SiteHeader, SiteFooter, Button |

Highest tier: T2. No T1 screens, no T3 screens.

## B. Design system
- **Design system (recommended: Option A, the owner's Figma system).** Options for the human:

  | Option | What it is | Fit and trade-off | NFR-08 |
  |---|---|---|---|
  | **A. Owner's Figma system "DD Software Solutions Branding"** (file `LkfGLRJsrCSCoYdu9m0hyf`, node `8-1953`) — **recommended** | Logo, colors, typefaces, and any defined components and styles imported into a W3C tokens file and rebuilt as code components. Where Figma is silent (layout, structure, motion, imagery rules), the identity proposed below fills in | The only option the PRD allows as the shipped brand (NFR-08, Q10, D4). Trade-off: S2.3 cannot start until the file is readable (see Blockers) | Meets |
  | A-interim. Option A, building first with neutral placeholder tokens | S2.3 starts now on grayscale placeholder tokens and system fonts, clearly labelled "not brand"; Figma values replace them when access arrives, before S2.4 | Saves calendar time. Trade-off: in a typography-led site the typefaces drive spacing and line lengths, so expect rework of layout once the real type arrives. G3 cannot accept until Figma values are in | Meets only after the swap |
  | B. House system Meridian, adapted | The SDLC's default house system, used for component markup only | Not readable from this session (external artifact). Its palette and type would be alternate brand assets, which NFR-08 forbids; usable for structure at most | Brand values would breach it |
  | C. Custom direction | Designer-chosen palette and type | Would replace the owner's brand; needs a change request through S1.C. Not recommended | Breaches |

- **Visual identity** (proposed; it will be written to the tokens file's `$description`; any value the Figma file defines wins over this text):
  - Audience, tone, density: SMB owners and executives, mostly non-technical, deciding whether a founder-led consultancy is credible enough to talk to. Calm, confident, plain-spoken. Low density: generous whitespace, comfortable reading measure (≈65–75 characters), one idea per block.
  - Brand attributes: **Clear** (a visitor understands what is offered in one scan), **Grounded** (practical outcomes, not futurism), **Considered** (precise typography and spacing that signal engineering discipline).
  - The domain avoids: robots, glowing brains, circuitry, neural-net meshes, particle fields; purple-to-blue gradients, near-black ground with a neon accent, glass or glow effects; stock people, handshakes, fake dashboards or product shots; empty logo strips, testimonial or stat placeholders, big-number heroes; buzzwords without explanation; eyebrow caps over every heading and "→" on every link.
  - Signature decisions:
    1. **Typography-led editorial layout.** The core message is set large in the brand display face, left-aligned on an asymmetric grid, with no hero image. The philosophy "What if we could make this better?" is the one recurring typographic moment, used once as the About pull-quote.
    2. **Structure carries meaning instead of cards.** Services are a ruled list, one row per service, each with a "problem" column and an "outcome" column, not a three-card grid. Approach is a real numbered sequence 1–4 on a single rule, with each stage's deliverable. The brand primary color is reserved for actions (the consultation call to action, links, focus) and the current-section indicator.
  - Imagery: none by default; the site is type-led. The only photograph that could appear is a real founder portrait, if the owner supplies one (open question G2-Q3). One icon family as SVG (Figma's if it defines one; otherwise Lucide outline), used only where it carries content (email, location, LinkedIn). No illustration unless the Figma file defines it.
  - Motion: opacity and transform only, 150–250 ms, one easing curve. It is used for the mobile menu open/close, the nav indicator, and the form's sent and error transitions; the form confirmation is the one orchestrated moment. No scroll-reveal on every section. With reduced motion, all of it is off (NFR-04).
- **Changes needed (built in S2.3, after G2):**
  - Tokens file in W3C design-tokens format, plus a CSS custom-properties mirror (greenfield, no scaffold yet). Contents: color by role (neutral ground, text and border levels, brand primary from Figma, status for error and success; every text pair meets WCAG AA), the type families, scale, weights, and line heights from Figma, spacing on one base unit, radius and elevation by hierarchy, and motion durations, easing, and the reduced-motion rule. Light theme only for this release unless G2-Q2 says otherwise; dark values will be defined only if Figma defines them.
  - Logo as SVG exported from Figma (header, footer, favicon).
  - Components, each with all its states and a catalog doc block: SiteHeader, PrimaryNav (desktop, mobile closed and open, current section), Button (primary, secondary, link; default, hover, focus, active, disabled, loading), SectionHeading, ConsultationCta, ServiceItem, ApproachStage, FounderProfile, ExpertiseList, TextField and TextArea (default, focus, filled, error, disabled), InquiryForm, StatusMessage (success, error), BookingPanel (available, unavailable), ContactDetails, SiteFooter, Prose.
  - How Figma will be imported once access exists: read the variables, styles, and components through the Figma MCP server (or the owner's export). Map them to role-named tokens, rebuild the components in plain HTML, CSS, and JS from those tokens, and never paste generated markup.

Proposed page structure, for orientation only (built and compared against alternatives in S2.3):

```text
[Logo]                         Services  Approach  About  [Book a consultation]
──────────────────────────────────────────────────────────────────────────────
HOME      We help businesses turn AI opportunities into working solutions.
          AI consulting and integration for small and medium-sized businesses.
          Consulting first, implementation second.   [Book a consultation]
SERVICES  ── AI Consulting & Strategy ─── Problem ......... | Outcome .........
          ── AI Integration ───────────── Problem ......... | Outcome .........
          ── (×5) ...                                     [Book a consultation]
APPROACH  1 Discover & assess ── 2 Design ── 3 Integrate ── 4 Deliver & measure
            deliverable           deliverable  deliverable     deliverable
ABOUT     Founded 2023 · Alberta | Founder, background, expertise
          "What if we could make this better?"            [Book a consultation]
CONTACT   Send a message (form)          | Book a 30-minute call (Cal.com)
                                         | Email · Alberta, Canada
FOOTER    © DD Software Solutions Inc. · Privacy notice
```

## C. Questions (T2 and T3 screens only)
| ID | Question | Requirement IDs | Screens |
|---|---|---|---|
| UQ1 | At 320 and 360 px, does the first screen show the core message, the SMB AI consulting statement, the consulting-first positioning, and a consultation CTA without scrolling, with a text (not image) largest element? | FR-01, BR-04, NFR-01, NFR-03 | Home |
| UQ2 | From any scroll position and width, is each of the five sections one action away, is the current section shown, and is the mobile menu keyboard and screen-reader operable (focus moves in, Escape closes, closes on selection)? | FR-02, NFR-01, NFR-02 | Header, Nav |
| UQ3 | Can a non-technical owner tell the five services apart by problem and outcome in one scan, with RAG and AI agent explained where first used? | FR-03, BR-03, NFR-07, O3 | Services |
| UQ4 | Does Approach read as four ordered stages, each with its deliverable, framed as a consulting engagement and not a package? | FR-04, BR-04 | Approach |
| UQ5 | Does About build credibility from the founder's real background alone, without looking like proof is missing? | FR-05, BR-01, BR-02, R1 | About |
| UQ6 | Is the repeated consultation CTA recognisably one action on Home and at the end of Services, Approach, and About, and does it land on Contact with the form and booking both visible? | FR-09 | Home, Services, Approach, About, Contact |
| UQ7 | Are the form and the booking presented as two clear, non-competing paths, and which leads? (Proposed: side by side on desktop with the form first and stacked on mobile; booking as a link, pending the architect's embed-or-link decision, R6) | FR-06, FR-13, W1, W1b | Contact |
| UQ8 | Is every form state clear and accessible: errors next to each invalid field with values kept, sending, sent with no response-time promise, and delivery failure with the public email as an alternative? | FR-07, FR-08, BR-05, BR-06, BR-08, E1, E2, E6, NFR-02 | Contact |
| UQ9 | When booking fails to load, do the form and the public email stay usable, and does the booking area say so? | FR-13, E7 | Contact |
| UQ10 | Does Contact hold its layout with and without the optional phone and LinkedIn, and does the email open a new message? | FR-10, BR-09 | Contact |
| UQ11 | Is the privacy notice readable as long-form text, reachable from the form and the footer? | FR-11, NFR-10 | Privacy, Contact, Footer |
| UQ12 | Does the not-found page give the navigation and a way back to Home? | FR-12, E4 | Not found |
| UQ13 | Is every animation subtle, never in the way of reading or input, and off under reduced motion? | NFR-04 | All |
| UQ14 | Do logo, colors, and typography match the Figma system, with no stock imagery or AI clichés, in a minimal, typography-led look? | NFR-08, C5, R5 | All |
| UQ15 | At 320, 360, 768, 1024, and 1440 px, is there no horizontal scroll and nothing cut off or overlapping? | NFR-01 | All |

## D. Screen specs (T1 screens)
None: no screen is T1.

## E. Directions (T3 screens)
None: the PRD fixes the structure (single page, five sections), and the brand comes from the owner's Figma system, so no screen's direction is open.

- Screenshots: none.
- Chosen at G2: pending.

## F. Build record (T2 and T3 screens, design-system changes)
Filled in S2.3. Planned now:

- UX branch: `ux/company-branding-website` (not created yet).
- Prototype (planned): plain HTML, CSS, and JS pages (greenfield, no scaffold), linked by a prototype shell in its own folder that walks W1 (CTA → form → sent), W1b (CTA → booking), E1 (field errors), E2 (delivery failure), E7 (booking unavailable), E4 (not found), and the privacy link.
- Screens and their stories: pending S2.3.
- Layout concept and pattern per screen: pending S2.3 (the page structure in section B is the starting concept).
- Simulated (planned): form submit latency (~800 ms), success, delivery failure, and a spam-flagged result (no confirmation shown; how it appears to the visitor waits on the architect's mechanism, BR-07, R3). Booking-unavailable toggle. Optional phone and LinkedIn on/off. All contact values stay as placeholders (`[INQUIRY_EMAIL]`, `[PUBLIC_EMAIL]`, `[BOOKING_URL]`, `[PUBLIC_PHONE]`, `[LINKEDIN_URL]`) per BR-09. Copy drafted from the sources, pending the owner's review (A4). The privacy notice text is a structural draft, not the owner-approved text (FR-11). No analytics in the prototype.
- API data each screen assumes: Contact form sends `{ name, email, phone?, message }` and gets one of: sent, field errors (keyed by field), delivery failure, spam-rejected (D5, architect in S3). Booking is an external Cal.com URL, no API. All section content is static in source files (NFR-05). Analytics is a third-party script with no data back to the UI.
- UI checks run and results: pending; `docs/ENGINEERING-STANDARDS.md` does not exist yet, so no UI checks are named.
- Out of scope: blog, chatbot, newsletter, pricing, testimonials, logos, case studies, dark mode (unless G2-Q2), multi-language.

## G. Open items for G2
| ID | Item | Severity | Owner | Needed by |
|---|---|---|---|---|
| G2-B1 | Figma file unreadable from the agent environment: page and REST API both return 403, and no Figma MCP server or token is configured. Brand tokens, logo, and typefaces cannot be imported. To resolve, either (a) enable and authenticate the Figma MCP server in Cursor with an account that can view the file, or (b) export into `docs/company-branding-website/sources/figma/`: the variables/styles (JSON, for example via a Variables or Tokens export plugin), the logo as SVG, typeface names with their licence or source, and PNGs of the design-system frames (node `8-1953`) | Blocking for S2.3 (not for the G2 decision itself) | Duong (D4, Q20) | Before S2.3 |
| G2-Q1 | Choose the design system: A (recommended), A-interim, B, or C | Decision | Duong | G2 |
| G2-Q2 | Light theme only for this release? (Recommended: yes, unless Figma defines dark values) | Non-blocking | Duong | G2 |
| G2-Q3 | Will you supply a real founder portrait for About? (Recommended: optional; About works without it, and no placeholder face ships) | Non-blocking | Duong | Before S2.3 |
| G2-Q4 | Approve the proposed identity's two signature decisions (typography-led editorial layout; ruled-list Services and numbered Approach in place of card grids), insofar as Figma does not already define layout | Decision | Duong | G2 |
