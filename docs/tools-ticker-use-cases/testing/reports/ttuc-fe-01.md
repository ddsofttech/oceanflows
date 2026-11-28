# S5.1 slice check — ttuc-fe-01

## Metadata
- Part: ttuc-fe-01 (Harden ticker and use cases on Home)
- Merge: PR #23 @ `6bff9d212bf220308475ff35152398a42cde7fa5`
- Branch: `release/tools-ticker-use-cases`
- Test plan: `testing/TEST-PLAN.md` §2 (ttuc-fe-01 rows)
- Part plan: `design/parts/ttuc-fe-01.md`
- Author: qa (S5.1)
- Date: 2026-11-27

## Result
**pass** — part **Checked**

## Evidence
| AC / check | Result | Evidence |
|---|---|---|
| CI `web-ci` on merge SHA | **pass** | [46009781610](https://github.com/ddsofttech/oceanflows/actions/runs/46009781610) `conclusion: success` @ `6bff9d21` (incl. `gate / ui-catalog`, `gate / sdlc-process`, Playwright smoke) |
| SITE-AC-16 | **pass** | E2E `site.spec.ts` “tools ticker follows Services…”; `#services` → `.tools-ticker` → `#approach`; 12 labels SITE-FR-16 order; 0 `img` in ticker |
| SITE-AC-17 | **pass** | E2E four h3 titles visible without demo activation; copy column has titles/summaries/benefits in `UseCaseStack.astro` |
| SITE-AC-N04 | **pass** | E2E `prefers-reduced-motion`: static list visible, marquee hidden, `animationName` none on track and demo motion |
| SITE-BR-06 | **pass** | Text-only `tools-ticker__label` spans; E2E 0 images |
| SITE-BR-05 | **pass** | Copy review: qualitative workflow illustrations; no named client claims in marketing components |
| SITE-NFR-04 | **pass** | Same as SITE-AC-N04 e2e; CSS hides marquee under `prefers-reduced-motion: reduce` |
| SITE-NFR-12 | **pass** | Demo columns `aria-hidden="true"`; CS iframe `tabindex="-1`, decorative title; copy column unhidden |
| SITE-NFR-01 | **pass** | Spot @ 320px and 1280px: `scrollWidth === clientWidth` on `/` (local preview `serve dist`) |
| axe index (blocking slice) | **pass** | E2E `axe: no serious violations on index` |
| UI catalog | **pass** | `ui-catalog.py --check` local; CI `gate / ui-catalog` green |
| ADR-2 lazy demos | **pass** | Scroll `#use-cases`: row 0 loses `use-case-row--idle`, iframe `src=/demos/customer-support-chat.html`; rows 1–3 idle, no `src` |
| Static iframe security | **pass** | Same-origin `CustomerSupportDemo.astro` → `/demos/customer-support-chat.html`; no `input`/`textarea` in demo HTML |

## Deviations
- Local `sdlc-check.py --part ttuc-fe-01` reports change-size over medium budget on full release tree; **not** a slice gate — merge push `gate / sdlc-process` passed on CI.
- SITE-AC-17 owner CS prototype diff: not line-compared this session; iframe path and decorative labeling match architecture handoff.

## Defects
| Defect ID | Severity | Type | Owner | Status |
|---|---|---|---|---|
| — | — | — | — | — |