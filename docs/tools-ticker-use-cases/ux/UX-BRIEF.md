# UX Brief

- Started by: G1 D3 (2026-11-27) — triggers **3 Restructure**, **4 Open UX** on baseline `docs/baselines/prds/PRD-v3.0`. Request `tools-ticker-use-cases`, profile Standard, mode existing-repo.
- Status: S2.1 complete; **G2 HITL required** (T3 use cases). S2.3 waits on G2 + ticker build (T2).

## A. Screens and tiers
| Screen or state | Requirement IDs | Tier | Why this tier | Catalog components |
|---|---|---|---|---|
| Tools ticker (Home, below Services) | SITE-FR-16, SITE-BR-06, SITE-NFR-04, SITE-AC-16 | **T2** | New block + marquee interaction; catalog lacks ticker; order and copy fixed in spec (not G2-open) | SiteLayout tokens; **new:** `ToolsTicker` |
| Use cases section `#use-cases` | SITE-FR-17, SITE-NFR-12, SITE-BR-05, SITE-AC-17, Q29 | **T3** | Restructure + open UX; owner asked for 2–3 options; replaces stock-image grid | Section heading pattern from `HomeMain.astro`; **new:** layout TBD at G2; `CustomerSupportDemo` from owner HTML |

Highest tier: **T3** (Use cases). No T0/T1 screens.

## B. Design system
- **Design system:** Product's own (Figma → `design/tokens/design-tokens.json`, `docs/COMPONENTS.md`). No new look; motion may exceed default 150–250ms only inside decorative demo regions if demos stay pausable and off under reduced motion (SITE-NFR-04, SITE-NFR-12).
- **Visual identity:** Unchanged — typography-led, no stock/AI clichés; **remove** current JPG use-case photos (SITE-NFR-08, owner Q29). Ticker is text-only labels — no vendor logos (SITE-BR-06).
- **Changes needed (after G2 for use cases):**
  - `ToolsTicker`: text-only infinite marquee or dual-track; duplicate list for seamless loop; `aria-hidden` on decorative track with visible static list in reduced motion; exact tool order SITE-FR-16.
  - Use cases shell (per G2 direction): tablist / snap rail / stage+index — keyboard operable; four workflows keep existing titles and body copy from `HomeMain.astro`.
  - `CustomerSupportDemo`: adapt owner `sources/2026-11-27-customer-support-ai-assistant-chat.html` as decorative embed; no autoplay audio.
  - `UseCaseDemoPlaceholder`: three abstract CSS/SVG motifs (sales pipeline ticks, doc search highlights, workflow nodes) — no invented client claims (SITE-BR-05).

## C. Questions (T2 and T3)
| ID | Question | Requirement IDs | Screens |
|---|---|---|---|
| UQ-T1 | Below Services, does the ticker show all 12 tool names in SITE-FR-16 order as plain text, with no logos, readable at 320px without horizontal page scroll? | SITE-FR-16, SITE-BR-06, SITE-NFR-01 | Tools ticker |
| UQ-T2 | With `prefers-reduced-motion`, is the ticker static (full list visible, no loop) and still meets SITE-AC-16? | SITE-NFR-04, SITE-AC-N04 | Tools ticker |
| UQ-T3 | Does marquee motion avoid hurting CLS/LCP targets when enabled (defer start, composite-only transforms)? | SITE-NFR-03, PRD C8 | Tools ticker |
| UQ-U1 | Without selecting a workflow, are all four titles and summaries visible or one keystroke away, per SITE-AC-17? | SITE-FR-17, SITE-AC-17 | Use cases |
| UQ-U2 | Is Customer Support demo recognisably the owner chat prototype intent, while remaining decorative (`aria-hidden` or labelled as illustration)? | SITE-FR-17, SITE-D1, SITE-NFR-12 | Use cases |
| UQ-U3 | For Sales, Operations, Automation: are abstract demos clearly illustrative (not fake product UI or stats)? | SITE-BR-05, Q29, SITE-NFR-08 | Use cases |
| UQ-U4 | Can a keyboard user move between workflows, pause or skip motion, and read copy with focus visible? | SITE-NFR-02, SITE-NFR-12 | Use cases |
| UQ-U5 | With reduced motion, do loops stop and static title/summary + still image or frame replace animation? | SITE-NFR-04, SITE-NFR-12, SITE-AC-N04 | Use cases |

## D. Screen specs (T1)
None.

## E. Directions (T3 — Use cases)
| Screen | Direction | What it bets on | Trade-off |
|---|---|---|---|
| Use cases | **A — Focus tabs** | One workflow focused; copy always beside demo; familiar tab pattern | Less “gallery” feel; four tabs wrap on narrow viewports |
| Use cases | **B — Snap rail** | Mobile-first swipe; all four scannable quickly | Horizontal scroll discoverability; demos smaller per card |
| Use cases | **C — Stage + index** | Editorial “pick from index”; large demo stage | Heavier layout; sticky index needs careful mobile collapse |

- **Throwaway pages:** `ux/directions/direction-a-focus-tabs.html`, `direction-b-snap-rail.html`, `direction-c-stage-rail.html`
- **Screenshots (1440 / 390):**
  - `ux/directions/direction-a-focus-tabs-desktop.png`, `direction-a-focus-tabs-mobile.png`
  - `ux/directions/direction-b-snap-rail-desktop.png`, `direction-b-snap-rail-mobile.png`
  - `ux/directions/direction-c-stage-rail-desktop.png`, `direction-c-stage-rail-mobile.png`
- **Recommended (designer, not decided):** **Direction A — Focus tabs** — best match for SITE-NFR-12 (copy always readable), keyboard tabs, and a full-width Customer Support chat demo without stock images.
- **Chosen at G2:** _pending human_

### G2 package (HITL)
- **Decision asked:** Which use-cases direction should S2.3 build — **A (Focus tabs)**, **B (Snap rail)**, or **C (Stage + index)**?
- **Not in scope for G2:** Tools ticker layout (T2 follows spec); ticker built in S2.3 without direction choice.

## F. Build record
- **UX branch (S2.3):** `ux/tools-ticker-use-cases` (cut from `release/tools-ticker-use-cases`).
- **Prototype:** n/a until G2; ticker + chosen use-case shell on UX branch after approval.
- **Simulated:** Chat transcript from owner HTML; ticker tool list static; no API.
- **UI checks:** Not run (S2.1). Engineering standards UI checks apply at S2.3.
- **Out of scope:** Contact, nav changes beyond scroll order; vendor links from ticker; replacing use-case copy text.