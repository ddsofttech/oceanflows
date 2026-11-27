# UX Brief

- Started by: G1 D3 (2026-11-27) — triggers **3 Restructure**, **4 Open UX** on baseline `docs/baselines/prds/PRD-v3.0`. Request `tools-ticker-use-cases`, profile Standard, mode existing-repo.
- Status: **S2.1 revised after G2 Revise D4 + D5**; **G2 HITL** (confirm direction + proposed Customer Support copy). S2.3 waits on G2.

## A. Screens and tiers
| Screen or state | Requirement IDs | Tier | Why this tier | Catalog components |
|---|---|---|---|---|
| Tools ticker (Home, below Services) | SITE-FR-16, SITE-BR-06, SITE-NFR-04, SITE-AC-16 | **T2** | New block + marquee; order and copy fixed in spec (not G2-open) | SiteLayout tokens; **new:** `ToolsTicker` |
| Use cases section `#use-cases` | SITE-FR-17, SITE-NFR-12, SITE-BR-05, SITE-AC-17, Q29 | **T2** (post–G2 Revise) | Layout closed at D4; left demo / right copy stack replaces grid; no further direction exploration | Section heading pattern from `HomeMain.astro`; **new:** `UseCaseStack`, `CustomerSupportDemo` (owner HTML), `UseCaseDemoPlaceholder` ×3 |

Highest tier after D4: **T2** (use cases layout decided; build in S2.3). Tools ticker **T2**. No T0/T1 screens.

## B. Design system
- **Design system:** Product's own (`design/tokens/design-tokens.json`, `docs/COMPONENTS.md`). Motion in decorative demo regions only; pausable; off under reduced motion (SITE-NFR-04, SITE-NFR-12).
- **Visual identity:** Unchanged — typography-led; **remove** JPG use-case photos (SITE-NFR-08, Q29). Ticker text-only — no vendor logos (SITE-BR-06).
- **Changes needed (S2.3):**
  - `ToolsTicker`: text-only marquee; duplicate list for loop; reduced-motion static list (SITE-FR-16).
  - `UseCaseStack`: four rows, **demo left / copy right** on ≥900px; stacks on narrow. Customer Support embeds owner `sources/2026-11-27-customer-support-ai-assistant-chat.html` unchanged in intent.
  - Customer Support copy column: **hook** + **5** benefit bullets (proposed below — G2); retain tag + H3 title from `HomeMain.astro`.
  - Sales / Operations / Automation: existing title + summary on the right; abstract CSS/SVG demos on the left (Q29).
  - **Lazy activation:** `IntersectionObserver` per row — set iframe `src` / start demo script only when row intersects; disconnect observer after first activate; off-screen rows idle. Fallback: activate all if IO missing. `prefers-reduced-motion`: static chat transcript + static abstract frames (no loops).

## C. Questions (T2)
| ID | Question | Requirement IDs | Screens |
|---|---|---|---|
| UQ-T1 | Below Services, ticker shows all 12 tools in SITE-FR-16 order as plain text, readable at 320px? | SITE-FR-16, SITE-BR-06, SITE-NFR-01 | Tools ticker |
| UQ-T2 | Reduced motion: ticker static, full list visible (SITE-AC-16)? | SITE-NFR-04, SITE-AC-N04 | Tools ticker |
| UQ-T3 | Marquee avoids CLS/LCP harm (composite transforms, deferred start)? | SITE-NFR-03, PRD C8 | Tools ticker |
| UQ-U1 | All four workflows listed with title + summary without interaction (SITE-AC-17)? | SITE-FR-17, SITE-AC-17 | Use cases |
| UQ-U2 | Customer Support demo matches owner prototype intent; decorative (`aria-hidden` / illustration label)? | SITE-FR-17, SITE-D1, SITE-NFR-12 | Use cases |
| UQ-U3 | Three non–Customer Support demos clearly illustrative (SITE-BR-05, Q29)? | SITE-BR-05, Q29 | Use cases |
| UQ-U4 | Keyboard: skip decorative demos; copy readable; focus visible? | SITE-NFR-02, SITE-NFR-12 | Use cases |
| UQ-U5 | Reduced motion: loops off; static equivalent per workflow? | SITE-NFR-04, SITE-NFR-12 | Use cases |
| UQ-U6 | Each demo starts only when its row enters viewport; off-screen demos do not run? | D5, SITE-NFR-03, SITE-NFR-12 | Use cases |
| UQ-U7 | On observe: Customer Support iframe loads once; leaving viewport does not need to tear down (idle OK)? | D5 | Use cases |

## D. Screen specs (T1)
None.

## E. Direction (D4 — owner prototype split)
| What | Detail |
|---|---|
| Layout | Vertical stack of four workflows. Each row: **left** interactive/decorative demo, **right** copy. Desktop: ~52/48 columns; mobile: demo above copy. |
| Customer Support | Left: owner chat HTML (no redesign). Right: hook + exactly **5** bullets + existing tag/title. |
| Other three | Left: abstract motifs (Q29). Right: existing tag, title, summary from `HomeMain.astro` (~449–545). |
| Superseded | Directions A/B/C (`direction-a/b/c-*.html`) — **not** G2 choices (D4 Revise). |

**Throwaway page:** `ux/directions/direction-d4-demo-copy-split.html`  
**Screenshots (1200 / 390):** `direction-d4-demo-copy-split-desktop.png`, `direction-d4-demo-copy-split-mobile.png`

### Proposed Customer Support copy (G2 — SITE-BR-05; Home sources only)

**Hook (proposed):** Routine answers from your approved FAQs — exceptions stay with your team.

**Benefits (proposed, 5):**
1. Answer routine questions from approved FAQs and policies — hours, shipping, returns.
2. Escalate exceptions to your team when judgment matters.
3. Clear inputs and outputs, with room for a person in the loop.
4. AI agents that handle routine steps and hand off when a human should decide.
5. AI connected to the applications, APIs, and workflows people already use.

| Copy line | Source (Home) |
|---|---|
| Hook + bullets 1–2 | `#use-cases` Customer support card body, `web/src/components/marketing/HomeMain.astro` |
| Bullet 3 | `#use-cases` section intro (same file) |
| Bullets 4–5 | Services outcomes — AI Agents & Automation, AI Integration (same file) |

### G2 package (HITL)
- **Decision asked:** **Approve** the D4 layout (demo left / hook + benefits right) and the proposed Customer Support hook + 5 bullets above — or **Revise** with edits.
- **Not in scope for G2:** Tools ticker (T2, spec-fixed); lazy-load is accepted behavior per D5 (no separate choice).

## F. Build record
- **UX branch (S2.3):** `ux/tools-ticker-use-cases`.
- **Prototype:** n/a until G2; after approval, build on UX branch.
- **Simulated:** Owner chat transcript; abstract demos; ticker static list; no API.
- **Lazy load (build note):** One IO per `.use-case-row`; `rootMargin` ~0 0 -10% 0; threshold ~0.15; assign iframe `data-src` → `src` on first intersect; abstract demos add `is-active` class for CSS motion only when intersecting and motion allowed.
- **UI checks:** Not run (S2.1). Apply at S2.3.
- **Out of scope:** Contact/nav; vendor ticker links; replacing Sales/Operations/Automation body copy.

## Change history
| When | What |
|---|---|
| 2026-11-27 | S2.1 initial tiers + A/B/C directions |
| 2026-11-27 | S2.1 after D4/D5: single D4 direction; proposed CS hook + 5 bullets; lazy-load UQ-U6/U7 |