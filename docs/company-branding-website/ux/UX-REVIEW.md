# UX Review

## A. What was reviewed
- UX brief: `docs/company-branding-website/ux/UX-BRIEF.md` (G2 option A recorded; build record §F).
- UX branch and commit: `ux/company-branding-website` @ `87a29bc85e5ec9343c4ea94df63f3ed3471cb476` ("Build S2.3 company branding website UX prototype.").
- Evidence type: **owner walkthrough** (design-lead code and markup review, screenshot review, partial HTTP serve from extracted branch; IDE browser could not load localhost in this session).
- Requirements baseline: `docs/baselines/prds/PRD-v1.0.md` (v1.0, G1 approved).

## B. UI check results (what was built)
| Check | Tool | Result | Notes |
|---|---|---|---|
| Engineering-standards UI checks (a11y, tokens, catalog) | — | **Not run** | `docs/ENGINEERING-STANDARDS.md` does not exist. **Missing UI check** → `architect` at S3.1. |
| UI catalog current | `ui-catalog.py --check` | **Not run / N/A** | `prototype/` exists only on `ux/company-branding-website`; on `release/company-branding-website` check fails (`src: not found`, stale `docs/COMPONENTS.md`). Re-run on UX branch before S3 implementation gate. |
| Accessibility (contrast, focus, keyboard) | Manual (design-lead) | **Partial** | Spot-check from tokens and markup only; no axe/pa11y. Focus-visible styles present in CSS; mobile menu has Escape close but no focus trap. Full WCAG 2.2 AA pass not claimed. |
| Design tokens | Manual | **Pass (structure)** | `design/tokens/design-tokens.json` + `tokens.css` on UX branch; values sourced from Figma foundations per build record. |
| Stories build | — | N/A | Plain HTML stories; no Storybook build. |

## C. Question results
| Question | Result | Evidence |
|---|---|---|
| UQ1 | **Still open** | Styled first viewport at 320/360 px not verified in session (screenshots unusable; see E. Home). Markup and CSS suggest hero is text-led (`display` class) but sticky header + two body paragraphs + CTA may exceed one screen on small devices — needs styled capture or owner confirm. |
| UQ2 | **Partially answered** | Desktop/mobile nav, `aria-current`, `IntersectionObserver`, mobile toggle with `aria-expanded`, Escape closes menu (`site.js`). **Gap:** no focus trap or focus return to menu button when mobile nav opens; not-found page nav omits `data-section-link` / mobile menu (desktop-only header). Owner walkthrough (code). |
| UQ3 | **Partially answered** | Five ruled services with problem/outcome; RAG explained in Knowledge row. **Gap:** "AI Agents & Automation" title uses the term before a plain-language definition (outcome says "Intelligent agents" only). Owner walkthrough (markup). |
| UQ4 | **Answered** | Four stages in order with deliverables; copy states consulting engagement not package; CSS `counter` shows 1–4 on approach track. Owner walkthrough (markup + CSS). |
| UQ5 | **Answered** | Founder, 10 years, expertise list, philosophy pull-quote; no empty proof placeholders. Owner walkthrough (markup). |
| UQ6 | **Answered** | Matching `Book a consultation` primary buttons on Home, Services, Approach, About → `#contact`; Contact shows form + booking aside. Owner walkthrough (markup). |
| UQ7 | **Answered** | `contact-layout` form-first; desktop two-column, stacked on mobile; booking is secondary button/link (Cal.com URL placeholder). Embed vs link still R6 (architect). Owner walkthrough (markup + CSS). |
| UQ8 | **Answered (stories)** | E1/E2/sent stories show field errors, values kept, sending/sent, delivery failure with public email; sent copy has no response-time promise. Live form simulation not on main `index.html` (stories only). Owner walkthrough (story HTML). |
| UQ9 | **Answered** | `contact-booking-unavailable.html`: form + email remain; booking panel shows unavailable message. Owner walkthrough (story). |
| UQ10 | **Answered** | `contact-details-full.html` optional phone/LinkedIn; idle index uses mailto placeholder. Owner walkthrough (stories + index). |
| UQ11 | **Answered** | `privacy.html` prose layout; link from form and footer. Draft legal copy flagged in page. Owner walkthrough (markup). |
| UQ12 | **Answered** | `not-found.html`: full primary nav + button to home (hash link). No mobile menu on this page (see UQ2). Owner walkthrough (markup). |
| UQ13 | **Answered (code)** | `prefers-reduced-motion` disables scroll-behavior and loading animation; mobile nav uses class toggle without required motion. Not exercised in browser this session. Owner walkthrough (CSS + JS). |
| UQ14 | **Partially answered** | Figma-sourced palette and Montserrat/Inter; typography-led, no stock imagery. **Gaps:** logo shipped as PNG not SVG (brief §B); header tagline duplicates brand line from logo asset. Owner walkthrough (assets + screenshots of styled intent N/A). |
| UQ15 | **Still open** | Screenshot package does not evidence styled layouts at any width. CSS uses responsive grid and `clamp()`; overflow not verified at 320–1440 in styled mode this session. |

## D. Scenario results
| Scenario ID | Expected outcome | Observed result | Result | Steps to reproduce | Finding type | Severity | Owner and action |
|---|---|---|---|---|---|---|---|
| W1 | Valid inquiry → confirmation, no response-time promise | Story `contact-sent.html` matches; main index has static idle form only | Pass (story) | Open `prototype/stories/contact-sent.html` via HTTP with `design/` tokens reachable | — | — | — |
| W1b | CTA → Contact → open Cal.com booking | Booking link with `[BOOKING_URL]`; 30-minute copy present | Pass (prototype) | `index.html#contact` → "Open booking calendar" | — | — | Architect: R6 embed vs link |
| E1 | Invalid fields → errors, values kept | Story shows three field errors + values | Pass | `stories/contact-field-errors.html` | — | — | — |
| E2 | Delivery failure → error + email alternative | Story matches FR-08 | Pass | `stories/contact-delivery-failure.html` | — | — | — |
| E3 | Spam → no success confirmation | **No UI state built** | **Blocked** | — | Usability concern | Important | `architect` mechanism first; then `designer` E3 story/screen |
| E4 | Unknown URL → not-found + nav | Page built with nav and home CTA | Pass | `pages/not-found.html` | — | — | — |
| E5 | Reduced motion → animations off | CSS/JS rules present | Pass (code) | Toggle OS reduce motion; reload | — | — | QA to verify at S5 |
| E7 | Booking unavailable → form + email usable | Story matches | Pass | `stories/contact-booking-unavailable.html` | — | — | — |
| Normal (mobile owner flow) | Home → Services → CTA → send | Not end-to-end tested live | Not Applicable | — | — | — | QA at S5 |

## E. Design review
| Screen | Area | Observation | Finding type | Severity | Owner and action |
|---|---|---|---|---|---|
| All (screenshots) | Identity / responsiveness / design system | All `ux/screens/*-{mobile,desktop}.png` show **unstyled** default browser rendering (serif fonts, no grid). Cause: `site.css` imports `../../design/tokens/tokens.css`; serving only `prototype/` (per UX brief §F) leaves tokens unreachable, so captured pixels are not the designed UI. | UX defect | **Blocking** | `designer`: re-capture every screenshot with HTTP root that includes `prototype/` and `design/` (or fix serve path in brief); replace `ux/screens/*`. |
| Home / Contact (`index.html`) | States / copy | Stray `<motionwrap/>` in contact form markup (invalid element). | UX defect | **Blocking** | `designer`: remove placeholder from `prototype/pages/index.html`. |
| All | Design system | Logo in header/footer is PNG (`logo-mark-export.png`), not SVG as UX brief §B requires. | UX defect | Important | `designer`: export SVG from Figma or document owner-approved exception at G3. |
| Services | Copy | "AI Agents" in service name without inline plain-language definition at first use (NFR-07). | UX defect | Important | `designer`: add short parenthetical in that row (mirror RAG pattern). |
| Header / Nav | Accessibility | Mobile menu: Escape closes; no focus trap, no focus return to toggle; menu button uses `☰` character only. | Usability concern | Important | `designer`: trap focus while open, return focus on close, optional aria label on icon. |
| Not found | States | No mobile nav / consultation CTA (unlike main site header). | UX defect | Non-blocking | `designer`: align header pattern with `index.html` if FR-12 expects full nav at all widths. |
| Privacy | Copy | Draft privacy structure OK; placeholders `[INQUIRY_EMAIL]` expected in prototype. | — | Non-blocking | Owner / RA: approve copy before production (FR-11). |
| Contact (stories) | Hierarchy | Prototype banner links on story pages are fine for dev; ensure production build omits. | — | Non-blocking | Frontend at S4. |
| Home | Defaults | Duplicate `style` attributes on company caption line in `index.html`. | UX defect | Non-blocking | `designer`: clean inline styles. |
| All | Imagery | No AI clichés or stock; type-led layout matches brief signature decisions when styled. | — | — | — |

## F. Limitations
- Simulated behavior: form latency and submit flows demonstrated via static story pages and shell mocks; main `index.html` does not run live validation/submit.
- Not validated: backend delivery, spam (BR-07), HTTPS, CWV (NFR-03), Cal.com integration, analytics (FR-14), full automated WCAG audit, keyboard-only session in browser, owner content sign-off (FR-05, NFR-07).
- Remaining risks: G3 human may approve unstyled screenshots if not replaced; architect must define spam UX and booking embed (R6).

## G. Recommendation and handoff note

- Ready for G3? **No** — material blockers on screenshot evidence and contact markup; recommend human **Revise** (not Reject): return to `designer` for screenshot re-capture and two markup fixes, then S2.4 revalidation.
- Material questions still open or contradicted: UQ1, UQ15 (styled viewport proof); UQ3/UQ14 partial; UQ2 partial (mobile a11y).
- Requirement changes (Class C): none identified.
- UX constraints that bind architecture:
  - Single-page anchored sections; duplicate header/footer on `privacy.html` and `not-found.html`.
  - Contact: form-first layout; booking as link or embed must not block form; E7 unavailable state copy pattern.
  - BR-07: when spam rejected, UI must show **no** success confirmation (state not designed).
  - Placeholders `[INQUIRY_EMAIL]`, `[PUBLIC_EMAIL]`, `[BOOKING_URL]`, optional phone/LinkedIn — omit optional fields when unset (BR-09).
- API data the UI assumes:
  - Inquiry POST body: `{ name, email, phone?, message }` → outcomes: sent confirmation | per-field validation errors | delivery failure with public email fallback | spam rejected (no success).
  - Static marketing copy per section; Cal.com booking URL; mailto public email.
- Simulations that must become real:
  - Client-side validation and submit handling on production Contact.
  - `[BOOKING_URL]` → real Cal.com 30-minute event type.
  - Replace placeholder emails before production (BR-09).
- Components front-end parts reuse from the UX branch:
  - Tokens: `design/tokens/design-tokens.json`, `design/tokens/tokens.css`.
  - Styles: `prototype/styles/site.css`.
  - Behaviors: `prototype/js/site.js` (nav only).
  - Component markup patterns: `prototype/components/catalog.html` doc blocks; page compositions in `prototype/pages/index.html`, `privacy.html`, `not-found.html`.
  - Catalog doc: `docs/COMPONENTS.md` (regenerate from UX branch).
- Accepted or deferred issues (for human at G3):
  - **Defer:** E3 spam UI until architect defines detection/response (BR-07, R3).
  - **Defer:** Cal.com embed vs link (R6) — UI supports link today.
  - **Defer:** Privacy legal final copy and owner FR-05/NFR-07 sign-off.
  - **Must fix before Approve:** screenshot package; `<motionwrap/>` removal.

---

## G3 package (human — HITL stop)

### What was validated
- T2 prototype on `ux/company-branding-website` @ `87a29bc`: single-page site, privacy, not-found, contact form states (stories), booking unavailable, mobile nav story, design tokens from Figma option A, `docs/COMPONENTS.md` on branch.
- UX brief questions UQ4–UQ12 largely answered in markup/stories when styled correctly.
- PRD flows W1, W1b, E1, E2, E4, E7 represented in prototype stories or pages.

### Open / deferred
| Item | Disposition |
|---|---|
| UQ1, UQ15 styled viewport proof | Open until new screenshots or live styled walkthrough |
| E3 / BR-07 spam state | Deferred to architect → designer |
| R6 Cal.com embed vs link | Deferred (architect); UI ready for link |
| Logo SVG | Important gap vs brief |
| ENGINEERING-STANDARDS UI checks | Missing — architect S3.1 |

### How to preview (corrected)
From repo root on UX branch (must include `design/` and `prototype/`):

```bash
python3 -m http.server 8765 --directory .
# Main site: http://127.0.0.1:8765/prototype/pages/index.html
# Flow index: http://127.0.0.1:8765/prototype/shell/index.html
```

Using `--directory prototype` alone **breaks** token import and matches the broken screenshot capture.

### Screenshots for decision
- Current files under `docs/company-branding-website/ux/screens/` — **do not use for visual approval** until replaced (unstyled).
- After designer fix: same filenames at 390px and 1440px widths, styled, per state list in UX brief §F.

### Design-lead recommendation to human
**Revise** — send to `designer` (S2.3): (1) re-capture all screenshots with correct server root, (2) remove `<motionwrap/>`, (3) address Important items above as time allows. Re-run S2.4 before second G3. Do **not** treat current screenshots as the approved look.

### Handoff note for architecture (S3.1)
See §G bullets: inquiry contract, spam failure UX requirement, booking integration choice (R6), static hosting with form as only server behavior, tokens/components reuse paths, add ENGINEERING-STANDARDS UI checks naming axe/token/catalog gates for this site.