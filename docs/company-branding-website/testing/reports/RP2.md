# Test Report: release point RP2 (production)

## Metadata
- PRD version: `docs/baselines/prds/PRD-v1.0.md`
- Test plan: `docs/company-branding-website/testing/TEST-PLAN.md` (reference; branch may omit file — checks from `design/parts/cbw-fe-04.md` and FR-14)
- Author: qa (S5.1)
- **Environment (production):** https://oceanflows.net (RP1 live; RP2 config ongoing)

## Slice checks
| Slice part | Merged commit | Date | Result | Defects |
|---|---|---|---|---|
| cbw-fe-04 | `700cfc1cea07f7b3be709823a8140aee96b9346f` (PR #8) | 2026-11-25 | **pass** (hosted FR-14 **blocked**) | — |

---

### cbw-fe-04 — Analytics (S5.1)

**Part plan:** `design/parts/cbw-fe-04.md` — FR-14: Cloudflare Web Analytics beacon on all pages; no analytics cookies; no consent banner for analytics alone.

| Check | Result | Evidence |
|---|---|---|
| Unit: site lib / analytics token behavior | **pass** | `npm test` @ `700cfc1c` — **26/26** (incl. `omits analytics token when PUBLIC_CF_ANALYTICS_TOKEN is unset`) |
| Build: beacon when `PUBLIC_CF_ANALYTICS_TOKEN` set | **pass** | `astro build` with test token — `beacon.min.js` + `data-cf-beacon` on `/`, `/privacy`, `/404` |
| Build: beacon omitted when token unset | **pass** | `astro build` without token — no `cloudflareinsights` in `dist/` |
| E2E: beacon on home + privacy when token configured | **pass** (CI) | PR #8 `gh pr checks 8` — `gate / playwright-smoke` **pass** ([run 45712880999](https://github.com/ddsofttech/oceanflows/actions/runs/45712880999)); local Playwright unavailable (browser binary missing in QA env — not counted as product fail) |
| E2E: privacy names Cloudflare Web Analytics | **pass** (CI + partial hosted) | Same CI run; live `https://oceanflows.net/privacy/` contains “Cloudflare Web Analytics, which does not use cookies” |
| Manual: no new analytics cookies | **not run (hosted)** | Requires browser with beacon loaded; production has no beacon until token configured |
| FR-14 hosted: beacon on https://oceanflows.net | **blocked** | HTML fetch of `/` and `/privacy` — no beacon script; **environment handoff** `testing/handoffs/ENV-FR14-CF-ANALYTICS-TOKEN.md` → `devops` |
| PR CI (pre-merge) | **pass** | [45712848495](https://github.com/ddsofttech/oceanflows/actions/runs/45712848495), [45712880999](https://github.com/ddsofttech/oceanflows/actions/runs/45712880999) — all gates green |
| Post-merge push CI | **deviation** | [45713236972](https://github.com/ddsofttech/oceanflows/actions/runs/45713236972) **cancelled** (10s); pre-merge evidence used |

**Note:** PR #8 merged to `ux/company-branding-website`. Release branch may lag integration branch; slice check build under test is the PR merge SHA per board.

**Deviations:** No `TEST-PLAN.md` rows on branch; executed part-plan e2e + FR-14 checks. Hosted FR-14 deferred to devops (not a false pass).

## Release test (S5.2)
- **Status:** Not started (RP2 slice checks in progress)

## Defects
| Defect ID | Severity | Type | Owner | Status |
|---|---|---|---|---|
| — | — | — | — | — |

## Handoffs
| ID | To | Type | Summary |
|---|---|---|---|
| ENV-FR14-CF-ANALYTICS-TOKEN | `devops` | Environment | Set `PUBLIC_CF_ANALYTICS_TOKEN` + redeploy for hosted FR-14 |

## Recommendation for G6
- **Recommendation:** (pending — complete RP2 S5.1/S5.2 first)
- **Open Blocking product defects:** none from cbw-fe-04 slice check