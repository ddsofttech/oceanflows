# UX Review

## A. What was reviewed
- UX brief: `docs/company-branding-website/ux/UX-BRIEF.md` (G2 option A recorded; build record §F).
- UX branch and commit: `ux/company-branding-website` @ `56f6d56c62107fe84e12a90f4663b12109d53733` ("Fix S2.4 UX defects for company branding prototype."). Prior review: `87a29bc`.
- Evidence type: **owner walkthrough** (revalidation of designer fixes only: styled screenshot review at 390/1440, markup/CSS/JS on UX branch; Playwright not available in this session for live 320/360 viewport measure).
- Requirements baseline: `docs/baselines/prds/PRD-v1.0.md` (v1.0, G1 approved).

## B. UI check results (what was built)
| Check | Tool | Result | Notes |
|---|---|---|---|
| Engineering-standards UI checks (a11y, tokens, catalog) | — | **Not run** | `docs/ENGINEERING-STANDARDS.md` does not exist. **Missing UI check** → `architect` at S3.1. |
| UI catalog current | `ui-catalog.py --check` | **Not run / N/A** | `prototype/` exists only on `ux/company-branding-website`; on `release/company-branding-website` check fails (`src: not found`, stale `docs/COMPONENTS.md`). Re-run on UX branch before S3 implementation gate. |
| Accessibility (contrast, focus, keyboard) | Manual (design-lead) | **Partial** | Tokens/markup/CSS; mobile nav now has focus trap, Escape close, and focus return (`prototype/js/site.js`). No axe/pa11y run. Full WCAG 2.2 AA pass not claimed. |
| Design tokens | Manual | **Pass (structure)** | `design/tokens/design-tokens.json` + `tokens.css` on UX branch; values sourced from Figma foundations per build record. |
| Stories build | — | N/A | Plain HTML stories; no Storybook build. |

## C. Question results
| Question | Result | Evidence |
|---|---|---|
| UQ1 | **Partially answered** (defer at G3) | Styled captures at **390px** and `nav-mobile-open-mobile.png` show text-led hero (`display` is largest element) with brand line, SMB statement, consulting-first copy, and CTA. **320/360 first-viewport-without-scroll** not measured (full-page shots only; Playwright unavailable here). Owner may accept 390px proxy or confirm on device. Owner walkthrough (screenshots). |
| UQ2 | **Partially answered** | Main site: desktop/mobile nav, `aria-current`, `IntersectionObserver`, focus trap + Tab wrap + focus return + Escape (`site.js`); toggle has visually hidden "Menu" label. **Gap:** `not-found.html` uses desktop `primary-nav` only (no mobile menu pattern). Owner walkthrough (code + `nav-mobile-open-mobile.png`). |
| UQ3 | **Answered** | Five ruled services; RAG plain-language in Knowledge row; "AI Agents & Automation" outcome defines agents in plain language (follow steps, routine decisions, hand off). Owner walkthrough (markup + `services-mobile.png`). |
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
| UQ14 | **Answered** | Figma-sourced palette and Montserrat/Inter; typography-led, no stock or AI clichés; `logo-mark.svg` in header/footer on styled screenshots. Minor: header tagline "Intelligence integrated" sits beside logo mark (acceptable unless owner objects). Owner walkthrough (screenshots + assets). |
| UQ15 | **Partially answered** (defer at G3) | Styled screenshots at **390** and **1440**; no overflow visible in reviewed shots. Widths 320, 360, 768, 1024 not all captured. Owner walkthrough (screenshots). |

## D. Scenario results
| Scenario ID | Expected outcome | Observed result | Result | Steps to reproduce | Finding type | Severity | Owner and action |
|---|---|---|---|---|---|---|---|
| W1 | Valid inquiry → confirmation, no response-time promise | Story `contact-sent.html` matches; main index has static idle form only | Pass (story) | Open `prototype/stories/contact-sent.html` via HTTP with `design/` tokens reachable | — | — | — |
| W1b | CTA → Contact → open Cal.com booking | Booking link with `[BOOKING_URL]`; 30-minute copy present | Pass (prototype) | `index.html#contact` → "Open booking calendar" | — | — | Architect: R6 embed vs link |
| E1 | Invalid fields → errors, values kept | Story shows three field errors + values | Pass | `stories/contact-field-errors.html` | — | — | — |
| E2 | Delivery failure → error + email alternative | Story matches FR-08 | Pass | `stories/contact-delivery-failure.html` | — | — | — |
| E3 | Spam → no success confirmation | `contact-spam-rejected.html`: error state, no success confirmation; captioned BR-07 | Pass (story) | Open `prototype/stories/contact-spam-rejected.html` via repo-root HTTP serve | — | — | Architect: R3 mechanism in production; no screenshot in `ux/screens/` package |
| E4 | Unknown URL → not-found + nav | Page built with nav and home CTA | Pass | `pages/not-found.html` | — | — | — |
| E5 | Reduced motion → animations off | CSS/JS rules present | Pass (code) | Toggle OS reduce motion; reload | — | — | QA to verify at S5 |
| E7 | Booking unavailable → form + email usable | Story matches | Pass | `stories/contact-booking-unavailable.html` | — | — | — |
| Normal (mobile owner flow) | Home → Services → CTA → send | Not end-to-end tested live | Not Applicable | — | — | — | QA at S5 |

## E. Design review
| Screen | Area | Observation | Finding type | Severity | Owner and action |
|---|---|---|---|---|---|
| All (screenshots) | Identity / design system | **Revalidation pass:** `ux/screens/*-{mobile,desktop}.png` show styled Figma tokens (navy primary, Montserrat/Inter, ruled services, numbered approach). Prior blocking capture issue resolved (repo-root serve per UX brief §F). | — | — | — |
| Home / Contact (`index.html`) | States / copy | `<motionwrap/>` removed; duplicate Home caption inline styles merged. | — | — | — |
| All | Design system | Logo is SVG (`prototype/assets/logo-mark.svg`). | — | — | — |
| Services | Copy | AI agents plain-language in outcome column (NFR-07). | — | — | — |
| Header / Nav | Accessibility | Mobile menu focus trap, Tab wrap, focus return, Escape; hidden "Menu" label on toggle. Not keyboard-tested live this session. | — | — | QA at S5 |
| Home | Responsiveness (UQ1) | Full-page mobile captures include content below fold; first-screen fit at 320/360 not isolated. | Usability concern | Non-blocking | Owner confirm at G3 or `designer`: optional 320/360 first-viewport shots |
| Not found | States | Desktop primary nav only; no mobile menu or header consultation CTA (unlike `index.html`). Styled `not-found-mobile.png` acceptable for E4 content. | UX defect | Non-blocking | `designer`: align with main header if owner wants parity at all widths |
| E3 spam story | States / coverage | Story exists; not in screenshot manifest (`capture-screenshots.py`). | — | Non-blocking | Optional capture for G3 evidence set |
| Privacy | Copy | Draft privacy structure OK; placeholders `[INQUIRY_EMAIL]` expected in prototype. | — | Non-blocking | Owner / RA: approve copy before production (FR-11). |
| Contact (stories) | Hierarchy | Prototype banner links on story pages are fine for dev; ensure production build omits. | — | Non-blocking | Frontend at S4. |
| All | Imagery | No AI clichés or stock; type-led layout matches brief signature decisions. | — | — | — |

## F. Limitations
- Simulated behavior: form latency and submit flows demonstrated via static story pages and shell mocks; main `index.html` does not run live validation/submit.
- Not validated: backend delivery, spam (BR-07), HTTPS, CWV (NFR-03), Cal.com integration, analytics (FR-14), full automated WCAG audit, keyboard-only session in browser, owner content sign-off (FR-05, NFR-07).
- Remaining risks: architect must define spam detection/response (R3) for production; Cal.com embed vs link (R6); no automated a11y gate until ENGINEERING-STANDARDS exists.

## G. Recommendation and handoff note

- Ready for G3? **Yes** — prior **Blocking** UX defects cleared (styled screenshots, markup). Recommend human **Approve** if owner accepts deferred UQ1/UQ15 viewport evidence at 390/1440 proxy.
- Material questions still open or contradicted: none **blocking**; **defer at G3:** UQ1 (320/360 first viewport), UQ15 (additional breakpoints), UQ2 gap on not-found mobile nav (non-blocking).
- Requirement changes (Class C): none identified.
- UX constraints that bind architecture:
  - Single-page anchored sections; duplicate header/footer on `privacy.html` and `not-found.html`.
  - Contact: form-first layout; booking as link or embed must not block form; E7 unavailable state copy pattern.
  - BR-07: when spam rejected, UI must show **no** success confirmation (`contact-spam-rejected.html` story; production hook per architect R3).
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
  - **Defer:** UQ1 first-viewport proof at 320/360 (390px styled evidence provided).
  - **Defer:** UQ15 full breakpoint matrix (390 + 1440 evidenced).
  - **Defer:** not-found mobile header parity (non-blocking).
  - **Defer:** E3 production spam mechanism (R3); story UI approved for BR-07 messaging pattern.
  - **Defer:** Cal.com embed vs link (R6) — UI supports link today.
  - **Defer:** Privacy legal final copy and owner FR-05/NFR-07 sign-off.
  - **Defer:** ENGINEERING-STANDARDS UI checks — architect S3.1.

---

## G3 package (human — HITL stop)

### What was validated (revalidation @ `56f6d56`)
- T2 prototype: single-page site, privacy, not-found, contact states (stories incl. **E3 spam rejected**), booking unavailable, mobile nav open story, Figma option A tokens, `docs/COMPONENTS.md` on UX branch.
- Prior **Blocking** fixes confirmed: styled screenshot package (22 PNGs at 390/1440); no `<motionwrap/>`; SVG logo; mobile nav focus trap; AI agents copy; UX brief §F preview URL.
- UX questions UQ3–UQ12 answered in markup/stories/screenshots; UQ4–UQ11 unchanged from prior review.
- PRD flows W1, W1b, E1, E2, **E3 (story)**, E4, E7 represented.

### Blocking remaining for designer
**None.**

### Open / deferred (human may accept at G3)
| Item | Disposition |
|---|---|
| UQ1 @ 320/360 first screen without scroll | Defer — accept 390px proxy or owner device check |
| UQ15 @ 320/360/768/1024 | Defer — 390 + 1440 evidenced |
| Not-found mobile nav | Non-blocking — optional parity fix |
| E3 screenshot in package | Non-blocking |
| R3 spam mechanism | Architect S3.1 |
| R6 Cal.com embed vs link | Architect; UI link-ready |
| ENGINEERING-STANDARDS UI checks | Architect S3.1 |
| Privacy / owner copy sign-off | Owner / RA before production |

### How to preview
Check out `ux/company-branding-website`. From **repo root**:

```bash
python3 -m http.server 8765 --directory .
# Main site: http://127.0.0.1:8765/prototype/pages/index.html
# Flow index: http://127.0.0.1:8765/prototype/shell/index.html
# E3 spam: http://127.0.0.1:8765/prototype/stories/contact-spam-rejected.html
```

Do **not** serve with `--directory prototype` only (token CSS breaks).

### Screenshots for decision
Use `docs/company-branding-website/ux/screens/*-{mobile,desktop}.png` as the **approved look** on **Approve** — styled captures at 390px and 1440px. Regenerate with `docs/company-branding-website/ux/capture-screenshots.py` while repo-root server runs.

### Design-lead recommendation to human
**Approve** — UX prototype and visual evidence meet material PRD/brief intent; deferred items above are explicit and do not block architecture planning. Choose **Revise** only if owner requires exact 320/360 first-viewport proof or not-found mobile nav parity before G4. **Reject** only if brand direction or scope is wrong (not indicated here).

### Decision requested
At G3, please reply **Approve**, **Revise**, or **Reject**, and whether to accept **390px as sufficient mobile evidence** for UQ1/UQ15 or require extra captures.

### Handoff note for architecture (S3.1)
See §G bullets: inquiry contract (`{ name, email, phone?, message }` → sent | field errors | delivery failure | spam-rejected), spam UX must never show success (wire to R3), booking integration choice (R6), static hosting with form POST as primary server behavior, reuse tokens/`site.css`/`site.js`/page markup from UX branch, regenerate `docs/COMPONENTS.md` on implementation branch, add ENGINEERING-STANDARDS UI checks (axe, tokens, catalog) at S3.1.