# UX Review

## A. What was reviewed
- UX brief: `docs/company-branding-website/ux/UX-BRIEF.md` (G2 option A; **G3 Revise D11** — Figma hero banner, light + dark themes; build record §F).
- UX branch and commit: `ux/company-branding-website` @ `42d9b28b7fb879fed94a4417d7f46c9b571d23e9` (`03b07434fa570f7eab6e98efcb5f2314a3fb2eee` — Rebuild UX prototype for Figma fidelity and dual themes, G3 D11). Prior review: `56f6d56` (pre–D11).
- Human revise (D11) to verify: light **and** dark themes; landing hero with Figma banner language (wave, navy card, campaign strip); visual closeness to Figma; no invented testimonials or industry-report downloads.
- Evidence type: **owner walkthrough** — read `home-idle-*.png` and `home-idle-dark-*.png` as images; markup/CSS/JS (`index.html`, `site.css`, `theme.js`, `site.js`, tokens); full screenshot set at 390/1440; no live browser toggle session this pass.
- Requirements baseline: `docs/baselines/prds/PRD-v1.0.md` (v1.0, G1 approved).

## B. UI check results (what was built)
| Check | Tool | Result | Notes |
|---|---|---|---|
| Engineering-standards UI checks (a11y, tokens, catalog) | — | **Not run** | `docs/ENGINEERING-STANDARDS.md` does not exist. **Missing UI check** → `architect` at S3.1. |
| UI catalog current | `ui-catalog.py --check` | **Not run / N/A** | `prototype/` exists only on `ux/company-branding-website`; on `release/company-branding-website` check fails (`src: not found`, stale `docs/COMPONENTS.md`). Re-run on UX branch before S3 implementation gate. |
| Accessibility (contrast, focus, keyboard) | Manual (design-lead) | **Partial** | Tokens/markup/CSS; mobile nav now has focus trap, Escape close, and focus return (`prototype/js/site.js`). No axe/pa11y run. Full WCAG 2.2 AA pass not claimed. |
| Design tokens | Manual | **Pass** | `design/tokens/design-tokens.json` + `tokens.css`; Figma foundations + `[data-theme="dark"]` overrides (`#0B1746`, `#081F59`, cyan accents) per D11. |
| Light / dark theme toggle | Manual | **Pass (code + captures)** | `theme.js` pre-paint + `site.js` toggle persists `dd-theme`; header control on `index.html`, `privacy.html`, `not-found.html`; `home-idle-dark-*` captures at dark. |
| Stories build | — | N/A | Plain HTML stories; no Storybook build. |

## C. Question results
| Question | Result | Evidence |
|---|---|---|
| UQ1 | **Partially answered** (defer at G3) | `home-idle-mobile.png`: Figma-style hero banner (eyebrow, “Intelligence Integrated”, PRD headline, navy feature card, campaign strip) — not bare type-only. Largest element remains display typography. **320/360 first-viewport-without-scroll** not measured. Owner walkthrough (screenshots). |
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
| UQ14 | **Answered** | D11 hero: wave SVG, grid decor, navy `hero-feature-card`, gradient `campaign-banner` (`index.html` + `site.css`). Figma palette (`#0B1746`, `#081F59`, `#1E40AF`, `#06B6D4`), Montserrat/Inter via Google Fonts; dark theme evidenced in `home-idle-dark-*`. No stock/AI clichés; no testimonial or report-download CTAs in prototype markup. Header tagline beside logo retained. Owner walkthrough (screenshots + code). |
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
| All (screenshots) | Identity / design system | **D11 pass:** 24 PNGs including `home-idle-dark-*`; styled Figma tokens, ruled services, numbered approach. Repo-root serve per UX brief §F. | — | — | — |
| Home (`index.html`) | Hero / Figma banner | **D11 pass:** wave motif, grid overlay, “Intelligence *Integrated*” treatment, navy “How we work” card, campaign strip — matches brief §E/F and human D11 ask (not type-only). Light: `home-idle-desktop.png`; dark: `home-idle-dark-desktop.png` (wave/grid visible). | — | — | — |
| Home | Theme | Light default + dark overrides; toggle in header; dark full-page captures confirm surfaces and CTAs. | — | — | — |
| Home / Contact (`index.html`) | States / copy | No invented industry-report download or testimonial blocks; consultation CTAs only (BR-01 / brief §E). | — | — | — |
| All | Design system | Logo is SVG (`prototype/assets/logo-mark.svg`). | — | — | — |
| Services | Copy | AI agents plain-language in outcome column (NFR-07). | — | — | — |
| Header / Nav | Accessibility | Mobile menu focus trap, Tab wrap, focus return, Escape; hidden "Menu" label on toggle. Not keyboard-tested live this session. | — | — | QA at S5 |
| Home | Responsiveness (UQ1) | Full-page mobile captures include content below fold; first-screen fit at 320/360 not isolated. | Usability concern | Non-blocking | Owner confirm at G3 or `designer`: optional 320/360 first-viewport shots |
| Not found | States | Desktop primary nav only; no mobile menu or header consultation CTA (unlike `index.html`). Styled `not-found-mobile.png` acceptable for E4 content. | UX defect | Non-blocking | `designer`: align with main header if owner wants parity at all widths |
| E3 spam story | States / coverage | Story exists; not in screenshot manifest (`capture-screenshots.py`). | — | Non-blocking | Optional capture for G3 evidence set |
| Privacy | Copy | Draft privacy structure OK; placeholders `[INQUIRY_EMAIL]` expected in prototype. | — | Non-blocking | Owner / RA: approve copy before production (FR-11). |
| Contact (stories) | Hierarchy | Prototype banner links on story pages are fine for dev; ensure production build omits. | — | Non-blocking | Frontend at S4. |
| Home (light mobile) | Figma fidelity | Full-page `home-idle-mobile.png`: wave decor less prominent than desktop dark hero; acceptable composition but not pixel-identical to Figma banners board. | Usability concern | Non-blocking | Owner accept at G3 or `designer`: optional wave prominence tweak |
| Contact stories | Theme | Story HTML pages omit theme toggle; captures remain light-only. | — | Non-blocking | `designer`: optional theme on stories if owner wants dark contact evidence |
| All | Imagery | No AI clichés, stock faces, or fake proof; below-hero sections remain typography-led per brief. | — | — | — |

## F. Limitations
- Simulated behavior: form latency and submit flows demonstrated via static story pages and shell mocks; main `index.html` does not run live validation/submit.
- Not validated: backend delivery, spam (BR-07), HTTPS, CWV (NFR-03), Cal.com integration, analytics (FR-14), full automated WCAG audit, keyboard-only session in browser, owner content sign-off (FR-05, NFR-07).
- Remaining risks: architect must define spam detection/response (R3) for production; Cal.com embed vs link (R6); no automated a11y gate until ENGINEERING-STANDARDS exists.

## G. Recommendation and handoff note

- Ready for G3? **Yes** — human **D11** material ask met: dual themes (toggle + tokens + `home-idle-dark-*`), Figma-style landing banner (wave, navy card, campaign strip), Figma foundations and type, no invented testimonials or report downloads. Recommend **Approve** with deferred Figma pixel deltas below.
- Material questions still open or contradicted: none **blocking**; **defer at G3:** UQ1 (320/360 first viewport), UQ15 (additional breakpoints), UQ2 not-found mobile nav, light-mobile wave prominence, story pages without theme toggle.
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
  - Behaviors: `prototype/js/theme.js`, `prototype/js/site.js` (theme + nav).
  - Component markup patterns: `prototype/components/catalog.html` doc blocks; page compositions in `prototype/pages/index.html`, `privacy.html`, `not-found.html`.
  - Catalog doc: `docs/COMPONENTS.md` (regenerate from UX branch).
- Accepted or deferred issues (for human at G3):
  - **Defer:** UQ1 first-viewport proof at 320/360 (390px + hero banner evidence provided).
  - **Defer:** UQ15 full breakpoint matrix (390 + 1440 evidenced).
  - **Defer:** not-found mobile header parity (non-blocking).
  - **Defer:** Figma banner board pixel parity — wave prominence on light mobile; optional designer pass if owner wants closer match.
  - **Defer:** Dark theme on contact story pages only (main site + privacy/not-found have toggle).
  - **Defer:** E3 production spam mechanism (R3); story UI approved for BR-07 messaging pattern.
  - **Defer:** Cal.com embed vs link (R6) — UI supports link today.
  - **Defer:** Privacy legal final copy and owner FR-05/NFR-07 sign-off.
  - **Defer:** ENGINEERING-STANDARDS UI checks — architect S3.1.

---

## G3 package (human — HITL stop)

### What was validated (post–D11 @ `42d9b28`)
- T2 prototype on `ux/company-branding-website`: Figma hero banner, **light + dark** themes, contact stories, privacy, not-found, **24** screenshots (incl. `home-idle-dark-*`).
- **D11 human revise — verified:**

| Check | Result | Evidence |
|---|---|---|
| Light and dark themes (toggle + tokens) | **Met** | `[data-theme="dark"]` in `tokens.css`; `theme.js` + `site.js` (`dd-theme`); header toggle; `home-idle-dark-{mobile,desktop}.png` |
| Landing banner (not type-only) | **Met** | Wave SVG, grid decor, “Intelligence Integrated”, navy feature card, campaign strip — `index.html` / `site.css`; `home-idle-{mobile,desktop}.png` |
| Visual closeness to Figma | **Met (material)** | Foundations colors, Montserrat/Inter, logo mark, banner motifs; dark hero shows grid/wave. **Defer:** light-mobile wave subtler than desktop/Figma board |
| No invented testimonials / report downloads | **Met** | Markup walk + screenshots: consultation CTAs only; BR-01 |

- UX questions UQ3–UQ12 answered; UQ14 reflects D11 banner; UQ1/UQ15 partial (390/1440). PRD flows W1, W1b, E1–E4, E7; E3 story (no screenshot in package).

### Blocking remaining for designer
**None.**

### Designer tasks (only if human chooses **Revise**)
1. Increase wave/grid visibility on **light mobile** hero for closer Figma banners-board match.
2. Optional: theme toggle on contact **story** pages.
3. Optional: not-found mobile header parity.

### Open / deferred (human may accept at G3)
| Item | Disposition |
|---|---|
| UQ1 @ 320/360 first screen without scroll | Defer — 390px + hero banner |
| UQ15 @ 320/360/768/1024 | Defer — 390 + 1440 evidenced |
| Figma pixel parity (light mobile wave) | Defer |
| Dark theme on story pages | Defer |
| Not-found mobile nav | Non-blocking |
| E3 screenshot in package | Non-blocking |
| R3 / R6 / ENGINEERING-STANDARDS | Architect S3.1 |
| Privacy / owner copy sign-off | Owner / RA |

### How to preview
Branch `ux/company-branding-website` @ latest. From **repo root**:

```bash
python3 -m http.server 8765 --directory .
# Main site (theme toggle in header): http://127.0.0.1:8765/prototype/pages/index.html
# Flow index: http://127.0.0.1:8765/prototype/shell/index.html
```

Do **not** serve with `--directory prototype` only (token CSS breaks).

### Screenshots for decision
On **Approve**, `docs/company-branding-website/ux/screens/*-{mobile,desktop}.png` — prioritize `home-idle-*` and `home-idle-dark-*` for D11. Regenerate via `capture-screenshots.py` with repo-root server.

### Design-lead recommendation to human
**Approve** — D11 material ask met (dual themes, Figma-style banner, brand tokens/type, no fake proof/report offers). **Revise** if you need closer Figma-board pixel parity or dark theme on story pages before G4. **Reject** only if brand direction or scope is wrong.

### Decision requested
Reply **Approve**, **Revise**, or **Reject**. If Approve: accept deferred Figma deltas and 390px mobile evidence for UQ1/UQ15?

### Commit status
- Validated: `42d9b28b7fb879fed94a4417d7f46c9b571d23e9` (build `03b0743`) on `ux/company-branding-website`.
- `UX-REVIEW.md` updated in working tree (design-lead); not committed unless orchestrator requests.

### Handoff note for architecture (S3.1)
See §G: inquiry `{ name, email, phone?, message }`; spam-rejected UX (R3); booking (R6); reuse tokens, `site.css`, `theme.js`, `site.js`, page markup; **ship light + dark** via `data-theme` / `dd-theme`; regenerate `docs/COMPONENTS.md`; ENGINEERING-STANDARDS at S3.1.