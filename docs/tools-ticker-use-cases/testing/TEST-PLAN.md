# Test Plan

## Metadata
- PRD version: `3.0` (`docs/baselines/prds/PRD-v3.0/features/SITE.md`)
- Implementation plan: `docs/tools-ticker-use-cases/design/IMPLEMENTATION-PLAN.md` (G4 D8 Approve)
- Author: qa (S3.5)
- Date: 2026-11-27

## 1. Coverage
| AC or requirement ID | Slice part | Release point | Method (automated / manual / exploratory) | Test or check | Level (unit / integration / end-to-end) |
|---|---|---|---|---|---|
| SITE-AC-16 | ttuc-fe-01, ttuc-fe-02 | RP1 | automated + manual | E2E: 12 tool labels in SITE-FR-16 order immediately after `#services`; labels are plain text (no `img` logos). Manual: scroll Services → ticker → Approach; spot-check screen-reader/name exposure. | e2e / manual |
| SITE-AC-17 | ttuc-fe-01, ttuc-fe-02 | RP1 | automated + manual | E2E: four headings + summaries on `/` without demo click. Manual: CS iframe on intersect; vs owner chat prototype; three placeholders. | e2e / manual |
| SITE-AC-N04 | ttuc-fe-01, ttuc-fe-02 | RP1 | automated + manual | E2E (optional in ttuc-fe-02): emulate `prefers-reduced-motion: reduce` — no marquee loop, no abstract demo pulse. Manual: OS reduce motion — static ticker list + static CS transcript. | e2e / manual |
| SITE-BR-06 | ttuc-fe-01 | RP1 | manual | Visual DOM inspection: text-only tool names; no third-party wordmarks or logo images in ticker. | manual |
| SITE-BR-05 | ttuc-fe-01 | RP1 | manual | Copy review: four workflows qualitative illustrations only; no invented client claims. | manual |
| SITE-NFR-02 | ttuc-fe-02 | RP1 | automated | `site.spec.ts` axe on index (incl. new sections): 0 serious/critical (ENGINEERING-STANDARDS §9). | e2e |
| SITE-NFR-04 | ttuc-fe-01 | RP1 | manual | With reduce motion: reading never blocked; ticker/use-case motion off. | manual |
| SITE-NFR-12 | ttuc-fe-01 | RP1 | manual | Demos decorative (`aria-hidden` regions); copy column primary; no autoplay audio. | manual |
| SITE-NFR-01 | ttuc-fe-01 | RP1 | exploratory | 320px and desktop: no horizontal scroll on Home with new sections. | manual |
| SITE-FR-02 (regression) | ttuc-fe-02 | RP1 | automated | Existing e2e: primary nav reaches `services`, `approach`, `use-cases`, `about`, `contact`. | e2e |
| ADR-2 lazy demos | ttuc-fe-01 | RP1 | manual | Scroll to `#use-cases`: row 0 iframe/SVG activates; off-screen rows idle until intersect (or IO fallback activates all). | manual |
| Static iframe security | ttuc-fe-01 | RP1 | manual | CS demo same-origin `/demos/customer-support-chat.html`; no user input in decorative demo. | manual |
| UI catalog | ttuc-fe-01 | RP1 | automated | CI `ui-catalog.py --check` passes for `ToolsTicker`, `UseCaseStack`, demo components. | integration |

- Deferred criteria, with owners:
| ID | Reason | Owner |
|---|---|---|
| SITE-AC-N03 | CWV lab not in CI; UQ-T3 deferred from G3 | qa — S5.2 release test (Lighthouse mobile lab: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1) |
| UQ-U4 | Full keyboard path through use cases deferred from G3 | qa — S5.2 manual session + optional e2e extension in ttuc-fe-02 |
| SITE-AC-01, SITE-AC-03 | Home/Services copy unchanged by slice | qa — spot-check at RP1 smoke only |
| UX-E1 | Screenshot capture bug; not product AC | designer |

## 2. Slice checks
| Slice part | Checks run when it merges |
|---|---|
| ttuc-fe-01 | CI: lint, types, Playwright, ui-catalog, sdlc-check. Manual: Services→ticker→Approach; 12 tools ordered; four workflows sans demo; reduce-motion static. Blocking: wrong order/count; missing labels; copy needs demo; logos; axe serious/critical on `/`. |
| ttuc-fe-02 | CI + `site.spec.ts`: ticker order, four titles, nav, axe index. Blocking: SITE-AC-16/17 fail; new axe serious/critical on `/`; nav broken. Non-blocking: optional reduce-motion e2e → S5 manual. |

## 3. Release tests
| Release point | End-to-end flows | Regression set | Non-functional checks |
|---|---|---|---|
| RP1 (ttuc-fe-01 + ttuc-fe-02) | W-3: Home→Services→ticker→Approach→`#use-cases`→Contact. Nav to Use cases in one step. Reduce motion: static ticker/demos, copy readable. | §4 on preview. | S5.2: SITE-AC-N03 CWV; UQ-U4 keyboard; NFR-01/04/12 viewports + reduce motion. |

## 4. Regression set *(existing-repo)*
| Area from the impact analysis | Existing behavior that must not change | Test |
|---|---|---|
| Section order / anchors | Approach and later sections still reachable; `#use-cases` id stable | `site.spec.ts` nav loop |
| Contact / inquiry | Live inquiry form enabled; Worker path unchanged | `site.spec.ts` “contact form is enabled” |
| Theme / analytics | Theme toggle; CF beacon when configured | `site.spec.ts` theme + beacon tests |
| 404 | Nav + home link on unknown URL | `site.spec.ts` 404 test |
| SEO meta | Home/privacy title and description | `site.spec.ts` meta test |
| Keyboard (baseline) | Skip link; mobile menu Escape | `site.spec.ts` keyboard describe |
| Privacy / other pages | axe on privacy, 404, contact | `site.spec.ts` axe tests |

## 5. Non-functional checks
| Requirement ID | Measure | Environment | Method |
|---|---|---|---|
| SITE-NFR-02 | 0 serious/critical axe violations on index | CI | `site.spec.ts` |
| SITE-NFR-03 | LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 mobile | Preview (S5) | Lighthouse lab — deferred from merge |
| SITE-NFR-04 | Motion off under `prefers-reduced-motion` | CI optional + manual | E2E emulate + OS setting |
| SITE-NFR-12 | Static readable content; demos decorative | Manual S5 | Visual + a11y tree |
| SITE-NFR-01 | Usable 320px–desktop; no horizontal scroll | Manual S5 | Viewport matrix |
| SITE-NFR-09 | Current Chrome/Safari/Firefox/Edge | Manual S5 spot | Smoke on one engine if CI passes |

- Untestable requirements (no measure):
| ID | Note |
|---|---|
| SITE-NFR-08 | Visual identity subjective; G3 UX review baseline — no automated gate |
| SITE-NFR-10 | SEO unchanged except Home content; meta e2e covers title/description |
| SITE-NFR-07 | Copy tone — owner review outside automated suite |

## 6. Environments and data
| Environment | Used for | Test data |
|---|---|---|
| Local / CI | Unit-less slice; Playwright, axe, catalog | `astro dev` or CI build; `PLAYWRIGHT_BASE_URL` as configured in `web-ci` |
| Cloudflare Pages preview | Slice smoke post-merge; S5 CWV + keyboard | Release branch deploy; no PII |
| Owner prototype | CS demo intent check | `docs/tools-ticker-use-cases/sources/2026-11-27-customer-support-ai-assistant-chat.html` |

## 7. Entry and exit criteria
- Entry (slice check / release test):
  - Slice check: PR merged to `release/tools-ticker-use-cases`; CI pipeline green on merge commit.
  - Release test (RP1): Both slice parts merged and slice-checked; preview URL available for S5 flows.
- Exit: which failures are blocking; which may be accepted as known issues:
  - **Blocking:** SITE-AC-16/17 fail; SITE-BR-06 breach; SITE-NFR-02 axe regression on `/`; primary nav or Contact regression (§4); lazy demo breaks readable copy (SITE-AC-17); wrong section order Services → ticker → Approach.
  - **Non-blocking at RP1 merge:** SITE-AC-N03 CWV pending S5 lab; UQ-U4 full keyboard pending S5; optional reduce-motion e2e absent if manual SITE-AC-N04 passes; flaky iframe timing — quarantine test with owner, do not waive AC without manual pass.

## 8. Out of scope
| Check | Why |
|---|---|
| Inquiry rate limits / Worker | IMPLEMENTATION-PLAN — INQ unchanged |
| Ticker vendor deep links | SITE §2 out of scope |
| Full WCAG audit beyond axe serious/critical | Baseline gate unchanged; UQ-U4 targeted manual at S5 |
| Load / CDN scale | Static marketing; ARCHITECTURE §4 |
| Production deploy | G7 only |
| Legal trademark review of tool names | Q28 closed as text-only BR-06 |