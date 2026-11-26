# Test Report: release point RP2 (production)

## Metadata
- PRD version: `docs/baselines/prds/PRD-v1.0.md`
- Test plan: `docs/company-branding-website/testing/TEST-PLAN.md` (reference; branch may omit file — checks from `design/parts/cbw-fe-04.md` and FR-14)
- Author: qa (S5.1)
- **Environment (production):** https://oceanflows.net (Workers Builds on `main` per D24)
- **Build under test (RP2 RC):** `12bf29b361e6a0acc2469f17ae17830d02f63176` (PR #12 merge — head of part `192bafc4`)

## Slice checks
| Slice part | Merged commit | Date | Result | Defects |
|---|---|---|---|---|
| cbw-fe-04 | `700cfc1cea07f7b3be709823a8140aee96b9346f` (PR #8) | 2026-11-25 | **pass** (hosted FR-14 **blocked**) | — |
| cbw-devops-02 | `12bf29b361e6a0acc2469f17ae17830d02f63176` (PR #12) | 2026-11-26 | **pass** (hosted D3 / NFR-06 HTTP / FR-14 **env gaps**) | — |

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

---

### cbw-devops-02 — Production launch (S5.1)

**Part plan:** `design/parts/cbw-devops-02.md` — BR-09, D2/D3/D6, NFR-06: production guards, domain/HTTPS setup, owner `PUBLIC_*` at build time.

| Check | Result | Evidence |
|---|---|---|
| Unit: `validateProductionEnv` | **pass** | `npm test` @ `12bf29b` — **29/29** (incl. rejects generic `https://cal.com`, requires `PUBLIC_CF_ANALYTICS_TOKEN`) |
| Build: owner-style env + `check:production-env` | **pass** | `CHECK_PRODUCTION_ENV=1` with sample owner values — “Production environment variables OK.” |
| Build: `check:placeholders` after build | **pass** | “No bracket placeholders in build output.” |
| PR CI (pre-merge) | **pass** | `gh pr checks 12` — all gates green ([45870660879](https://github.com/ddsofttech/oceanflows/actions/runs/45870660879), [45870669075](https://github.com/ddsofttech/oceanflows/actions/runs/45870669075)) |
| Post-merge `web-ci` on `main` | **pass** | [45871048785](https://github.com/ddsofttech/oceanflows/actions/runs/45871048785) **success** @ `12bf29b` |
| Post-merge `web-deploy-production` | **deviation** | [45871048777](https://github.com/ddsofttech/oceanflows/actions/runs/45871048777) **failure** — `Validate production build env` (GitHub secrets `PUBLIC_*` unset); primary deploy path is Workers Builds per `delivery/SETUP-GUIDES.md` §A1 |
| Docs: `SETUP-GUIDES.md` (`main`, build command, §A5 HTTPS, §A6 FR-14) | **pass** | `docs/company-branding-website/delivery/SETUP-GUIDES.md` @ merge SHA |
| Workflow: deploy env guard | **pass** | `.github/workflows/web-deploy.yml` runs `check-production-env` when secrets present |
| Hosted BR-09: no `[...]` in HTML | **pass** | `npm run smoke:production` + `curl` home — no bracket tokens; `mailto:contact@ddsofttech.com` present |
| Hosted D2/D6: `https://oceanflows.net` | **pass** | HTTPS home **200**, `/privacy/` **200**; `POST /api/inquiry` **400** (reachable validation) |
| Hosted D3: owner booking URL | **blocked (env)** | Home booking CTA `href="https://cal.com"` (homepage, not owner Link); build guard would reject on next guarded build — **owner/devops**: set `PUBLIC_BOOKING_URL` to Cal.com Link in Workers **Build** variables + redeploy |
| Hosted NFR-06: HTTP → HTTPS | **blocked (env)** | `http://oceanflows.net/` **200** with no redirect; smoke WARN — enable **Always Use HTTPS** (SETUP-GUIDES §A5) |
| Hosted FR-14 beacon | **blocked (env)** | Same as cbw-fe-04 — no beacon in HTML; **H4** / `ENV-FR14-CF-ANALYTICS-TOKEN` |
| Manual: `smoke-production-url.sh` | **pass** (WARNs) | Exit 0 @ 2026-11-26; WARN beacon + HTTP redirect |

**Note:** Slice check **pass** judges merged production guardrails, setup docs, and smoke tooling at `12bf29b`. Hosted D3/NFR-06/FR-14 gaps are **environment/configuration** (not product defects in this merge); do not waive before RP2 release test / G6.

## Release test (S5.2)
- **Status:** Not started — **both RP2 slice parts S5.1 complete** (fe-04, devops-02). Start S5.2 when step card directs; **hosted verification partially blocked** until Workers Builds has correct Build variables (`PUBLIC_BOOKING_URL`, `PUBLIC_CF_ANALYTICS_TOKEN`), redeploy on `main`, and Cloudflare **Always Use HTTPS** (clears H4 + D3/NFR-06 HTTP rows).

## Defects
| Defect ID | Severity | Type | Owner | Status |
|---|---|---|---|---|
| — | — | — | — | — |

## Handoffs
| ID | To | Type | Summary |
|---|---|---|---|
| ENV-FR14-CF-ANALYTICS-TOKEN | `devops` | Environment | Set `PUBLIC_CF_ANALYTICS_TOKEN` as Workers **Build** variable + redeploy `main` (H4) |
| ENV-RP2-BOOKING-URL | `devops` / owner | Environment | Replace live `https://cal.com` with owner Cal.com **Link** in `PUBLIC_BOOKING_URL` (Build var) + redeploy |
| ENV-NFR06-ALWAYS-HTTPS | `devops` | Environment | Zone SSL/TLS → **Always Use HTTPS** On; confirm `http://oceanflows.net/` redirects to HTTPS |

## Recommendation for G6
- **Recommendation:** (pending — run RP2 S5.2 after hosted env actions or record deviations)
- **Open Blocking product defects:** none from RP2 S5.1 slice checks
- **Open Important environment (not product defects):** hosted FR-14 (H4), owner booking URL on production, HTTP→HTTPS redirect (NFR-06)