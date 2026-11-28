# Test Report: release point RP2 (production)

## Metadata
- PRD version: `docs/baselines/prds/PRD-v1.0.md`
- Test plan: `docs/company-branding-website/testing/TEST-PLAN.md` (reference; branch may omit file — checks from `design/parts/cbw-fe-04.md`, `cbw-devops-02.md`, RP1 regression rows)
- Author: qa (S5.1 recheck, S5.2, S5.3)
- **Environment (production):** https://oceanflows.net (Workers Builds on `main` per D24)
- **Build under test (RP2 RC):** `12bf29b361e6a0acc2469f17ae17830d02f63176` (PR #12 merge — integrates `cbw-fe-04` + `cbw-devops-02`)
- **Release test date:** 2026-11-26

## Slice checks
| Slice part | Merged commit | Date | Result | Defects |
|---|---|---|---|---|
| cbw-fe-04 | `700cfc1cea07f7b3be709823a8140aee96b9346f` (PR #8) | 2026-11-26 (hosted recheck) | **pass** | — |
| cbw-devops-02 | `12bf29b361e6a0acc2469f17ae17830d02f63176` (PR #12) | 2026-11-26 (hosted recheck) | **pass** | — |

---

### cbw-fe-04 — Analytics (S5.1 + hosted recheck)

**Part plan:** `design/parts/cbw-fe-04.md` — FR-14: Cloudflare Web Analytics beacon on all pages; no analytics cookies; no consent banner for analytics alone.

| Check | Result | Evidence |
|---|---|---|
| Unit: site lib / analytics token behavior | **pass** | `npm test` @ HEAD — **29/29** (incl. `omits analytics token when PUBLIC_CF_ANALYTICS_TOKEN is unset`) |
| Build: beacon when `PUBLIC_CF_ANALYTICS_TOKEN` set | **pass** | `astro build` with test token — `beacon.min.js` + `data-cf-beacon` on `/`, `/privacy`, `/404` |
| Build: beacon omitted when token unset | **pass** | `astro build` without token — no `cloudflareinsights` in `dist/` |
| E2E: beacon on home + privacy when token configured | **pass** | Local `npm run test:e2e` @ 2026-11-26 — **18/18** (incl. beacon test); PR #8 CI [45712880999](https://github.com/ddsofttech/oceanflows/actions/runs/45712880999) |
| E2E: privacy names Cloudflare Web Analytics | **pass** (hosted) | `https://oceanflows.net/privacy/` — “Cloudflare Web Analytics, which does not use cookies” |
| Manual: no new analytics cookies | **pass** (hosted) | Cursor browser @ 2026-11-26: `document.cookie` **empty** after load on `https://oceanflows.net/` with beacon present |
| FR-14 hosted: beacon on https://oceanflows.net | **pass** | `curl` HTML: `beacon.min.js` + `data-cf-beacon` on `/`, `/privacy/`, 404 path |
| PR CI (pre-merge) | **pass** | [45712848495](https://github.com/ddsofttech/oceanflows/actions/runs/45712848495), [45712880999](https://github.com/ddsofttech/oceanflows/actions/runs/45712880999) |
| Post-merge push CI | **deviation** | [45713236972](https://github.com/ddsofttech/oceanflows/actions/runs/45713236972) **cancelled** (10s); pre-merge + hosted evidence used |

**Deviations:** No `TEST-PLAN.md` on branch; executed part-plan FR-14 checks. Prior hosted **blocked** row superseded by D24 Build var + redeploy (H4 closed).

---

### cbw-devops-02 — Production launch (S5.1 + hosted recheck)

**Part plan:** `design/parts/cbw-devops-02.md` — BR-09, D2/D3/D6, NFR-06: production guards, domain/HTTPS setup, owner `PUBLIC_*` at build time.

| Check | Result | Evidence |
|---|---|---|
| Unit: `validateProductionEnv` | **pass** | `npm test` @ `12bf29b` — **29/29** (incl. rejects generic `https://cal.com`, requires `PUBLIC_CF_ANALYTICS_TOKEN`) |
| Build: owner-style env + `check:production-env` | **pass** | `CHECK_PRODUCTION_ENV=1` with sample owner values — “Production environment variables OK.” |
| Build: `check:placeholders` after build | **pass** | “No bracket placeholders in build output.” |
| PR CI (pre-merge) | **pass** | `gh pr checks 12` — all gates green ([45870660879](https://github.com/ddsofttech/oceanflows/actions/runs/45870660879), [45870669075](https://github.com/ddsofttech/oceanflows/actions/runs/45870669075)) |
| Post-merge `web-ci` on `main` | **pass** | [45871048785](https://github.com/ddsofttech/oceanflows/actions/runs/45871048785) **success** @ `12bf29b` |
| Post-merge `web-deploy-production` | **deviation** | [45871048777](https://github.com/ddsofttech/oceanflows/actions/runs/45871048777) **failure** — GitHub secrets `PUBLIC_*` unset; primary deploy path is Workers Builds per `delivery/SETUP-GUIDES.md` §A1 |
| Docs: `SETUP-GUIDES.md` (`main`, build command, §A5 HTTPS, §A6 FR-14) | **pass** | `docs/company-branding-website/delivery/SETUP-GUIDES.md` @ merge SHA |
| Workflow: deploy env guard | **pass** | `.github/workflows/web-deploy.yml` runs `check-production-env` when secrets present |
| Hosted BR-09: no `[...]` in HTML | **pass** | `npm run smoke:production` + `curl` — no bracket tokens; live contact emails populated |
| Hosted D2/D6: `https://oceanflows.net` | **pass** | HTTPS home **200**, `/privacy/` **200**; `POST /api/inquiry` **400** `validation_failed` (reachable) |
| Hosted D3: owner booking URL | **pass** | Booking CTA `href="https://cal.com/young-dang/30min"` `target="_blank"` `rel="noopener noreferrer"` (H6 closed) |
| Hosted NFR-06: HTTP → HTTPS | **pass** | `curl -sI http://oceanflows.net/` → **301** `Location: https://oceanflows.net/`; `smoke:production` confirms redirect (H7 closed) |
| Hosted FR-14 beacon | **pass** | Same as cbw-fe-04 hosted row (H4 closed) |
| Manual: `smoke-production-url.sh` | **pass** | Exit 0 @ 2026-11-26 — no WARN on beacon or HTTP redirect |

## Release test (S5.2)
- **Build under test:** `12bf29b361e6a0acc2469f17ae17830d02f63176` (code); production live spot-checks **2026-11-26**
- **Status:** **Complete**

### RP2 material acceptance (production)

| AC ID | Result | Evidence |
|---|---|---|
| FR-14 — cookieless beacon | **pass** | Beacon on `/`, `/privacy/`, 404; cookies empty with beacon loaded |
| BR-09 — no placeholders | **pass** | No `[...]` or `BOOKING_URL` tokens in live HTML |
| D2 / D3 / D6 — domain, booking, env | **pass** | `https://oceanflows.net` 200; owner Cal.com Link; Resend/public emails in markup |
| NFR-06 — HTTPS enforced | **pass** | HTTP 301 → HTTPS |

### End-to-end and regression (RP2 + RP1 carry-forward)

| Check | Result | Evidence |
|---|---|---|
| W1 inquiry API contract (edge) | **pass** (smoke) | `POST /api/inquiry` empty body → 400 + field errors |
| W1 inquiry UI (full flow) | **pass** (local RC) | `contact.spec.ts` @ RC tree — 5/5 (mocked transport) |
| W1b Cal.com booking (live) | **pass** | Owner link opens in new tab; not bare `cal.com` homepage |
| FR-12 / 404 navigable | **pass** (hosted) | Unknown path **404** with nav, footer, beacon |
| FR-07 live Resend inbox | **not run** | No deliberate production submit (avoid unsolicited email); **Important** carry-forward from RP1 |
| TM-12 edge rate-limit burst | **not run** | Manual burst not executed this session |
| NFR-02 accessibility | **pass** (RC build) | axe serious/critical = 0 on index, privacy, 404, contact — **18/18** Playwright |
| NFR-01 viewports | **partial** | Playwright desktop + mobile menu tests; no full 320/768/1440 matrix on live |
| NFR-04 reduced motion | **not run** | No automated check this session |
| FR-03 / FR-05 / NFR-07 owner content | **not run** | Owner sign-off not evidenced in QA |
| FR-11 privacy text approval | **partial** | Live notice published; page labels “Draft for owner approval” |

| Suite | Passed | Failed | Not run | Evidence |
|---|---|---|---|---|
| Unit + contract | 29 | 0 | — | `npm test` @ HEAD |
| E2E (Playwright, RC build) | 18 | 0 | — | `npm run test:e2e` @ 2026-11-26 |
| Production smoke script | pass | — | — | `npm run smoke:production` |
| Hosted spot-checks | pass | — | — | curl + browser @ `https://oceanflows.net` |

**Deviations:** No branch `TEST-PLAN.md`; rows derived from part plans and RP1 report. FR-07 and TM-12 remain deferred Important items, not RP2 code defects.

## Defects
| Defect ID | Severity | Type | Owner | Status |
|---|---|---|---|---|
| — | — | — | — | — |

*No new product defects filed. SR-01/SR-02 remain in `testing/security/PR-2.md` (G5 disposition).*

## Handoffs
| ID | To | Type | Summary | Status |
|---|---|---|---|---|
| ENV-FR14-CF-ANALYTICS-TOKEN | `devops` | Environment | `PUBLIC_CF_ANALYTICS_TOKEN` Build var + redeploy (H4) | **Closed** — beacon live 2026-11-26 |
| ENV-RP2-BOOKING-URL | `devops` / owner | Environment | Owner Cal.com Link in `PUBLIC_BOOKING_URL` (H6) | **Closed** — `young-dang/30min` on production |
| ENV-NFR06-ALWAYS-HTTPS | `devops` | Environment | Always Use HTTPS (H7) | **Closed** — HTTP 301 → HTTPS verified |

## Recommendation for G6 (S5.3 package — HITL)
- **Recommendation:** **Approve — Pass with known issues** (RP2 production release candidate)
- **Release point:** RP2 — formal production configuration on `https://oceanflows.net` at RC `12bf29b3`.
- **Evidence summary:** Both slice parts **pass** after hosted recheck (H4/H6/H7 closed). Material RP2 ACs **pass** on production. Integrated RC — **29/29** unit, **18/18** e2e; production smoke **pass**.
- **Known issues proposed for acceptance at G6 (Important / Non-blocking — not waived by QA):**
  - **FR-07:** Live Resend delivery to owner inbox not proven in this pass — `frontend-developer` / owner smoke when willing to send a test inquiry.
  - **SR-02:** Email subject CRLF hardening (Important, G5-open) — `backend-developer`.
  - **SR-01:** Distributed rate-limit residual (Important, G5-accepted).
  - **Owner sign-off:** FR-03, FR-05, NFR-07, FR-11 privacy “draft” label — human/content owner.
  - **`www` hostname:** Not in DNS (Non-blocking; noted at RP1 G7).
  - **E5 / NFR-04:** Reduced-motion not run this session (Non-blocking).
  - **TM-12:** Edge rate-limit burst manual not run (Non-blocking unless security requires before prod traffic).
- **Open Blocking product defects:** **None**
- **Clarifications for human:**
  - **Approve** = RP2 engineering release is acceptable for **G7 production go-live** decision; does not by itself deploy or substitute G7.
  - **Approve with known issues** = same, explicitly accepting the Important items above (or deferring with owners).
  - **Revise / Reject** = material RP2 AC regression on production — none observed in this pass.