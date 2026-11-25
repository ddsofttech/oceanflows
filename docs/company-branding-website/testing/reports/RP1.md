# Test Report: release point RP1 (staging)

## Metadata
- PRD version: `docs/baselines/prds/PRD-v1.0.md`
- Test plan: `docs/company-branding-website/testing/TEST-PLAN.md` (reference; branch may omit file)
- Author: qa (S5.1, S5.2)
- **RP1 RC (release test):** `8f974c6089fc60cbf57384e4bb2c4ee1caa4e363` (PR #6 merge — integrates all RP1 parts)
- **Environment note (H2):** Cloudflare Pages hosted staging **unavailable**; release test uses local `astro build` + Playwright (preview server) and CI on merge commits.

## Slice checks
| Slice part | Merged commit | Date | Result | Defects |
|---|---|---|---|---|
| cbw-fe-01 | `7dfb47da4d960d93f6c995cd124da336acd812bc` (PR #3) | 2026-11-25 | **pass** | — |
| cbw-be-01 | `690e536c107950b9573eca6bcdc91f7ab6756e5d` (PR #2, G5 D19) | 2026-11-25 | **pass** (G5-known Important) | — |
| cbw-fe-02 | `0374d956632a241d0ae2ccafe469bb6b557d8f28` (PR #5) | 2026-11-25 | **pass** (CI deviation) | — |
| cbw-fe-03 | `8f974c6089fc60cbf57384e4bb2c4ee1caa4e363` (PR #6) | 2026-11-25 | **pass** | — |

---

### cbw-fe-01 — evidence (summary)
See prior S5.1: CI [45697181475](https://github.com/ddsofttech/oceanflows/actions/runs/45697181475); 7/7 Playwright at merge SHA.

### cbw-be-01 — evidence (summary)
See prior S5.1: PR #2 checks green; 20/20 vitest at `690e536`; S4.4/G5 SR-01/SR-02 documented in `testing/security/PR-2.md`.

---

### cbw-fe-02 — evidence

| Check | Result | Evidence |
|---|---|---|
| E2E: inquiry sent | **pass** | `contact.spec.ts` success state (mock `200 sent:true`) |
| E2E: field errors | **pass** | `validation_failed` + field map |
| E2E: delivery failure | **pass** | `502 delivery_failed` |
| BR-07 spam UX | **pass** | `rejected:true` — no success status |
| Booking `target=_blank` | **pass** | Skipped if unset; passes when link present |
| PR CI (pre-merge) | **pass** | `gh pr checks 5` — gates success on PR branch |
| Post-merge push CI | **deviation** | [45707415794](https://github.com/ddsofttech/oceanflows/actions/runs/45707415794) **failure** — `gate / unused` (unused `SiteMeta.astro`); **fixed** in fe-03 (`8acb058d` SiteLayout import) before RP1 RC |
| Integrated re-check | **pass** | At RC: `contact.spec.ts` 5/5 in full suite |

---

### cbw-fe-03 — evidence

| Check | Result | Evidence |
|---|---|---|
| axe serious/critical = 0 (index, privacy, 404, contact) | **pass** | `site.spec.ts` ×4 axe tests — part of **17/17** e2e |
| NFR-10 title/meta | **pass** | `site.spec.ts` home + privacy |
| FR-12 / 404 navigable | **pass** | 404 heading, nav, go-home; **404 mobile menu** (`UQ2`) |
| Keyboard flows | **pass** | skip link; Escape closes mobile menu |
| PR / merge CI | **pass** | [45708536952](https://github.com/ddsofttech/oceanflows/actions/runs/45708536952) `conclusion: success` |

---

## Release test (S5.2)
- **Build under test:** `8f974c6089fc60cbf57384e4bb2c4ee1caa4e363`
- **Environment:** Local Playwright against production build; **no** Cloudflare Pages preview URL (H2)
- **Date:** 2026-11-25
- **Status:** **Complete** (with documented gaps)

| AC / flow (TEST-PLAN RP1) | Result | Evidence |
|---|---|---|
| W1 inquiry (UI + API contract) | **pass** (mocked transport) | `contact.spec.ts` full set; `inquiry.contract.test.ts` in **25/25** vitest |
| E1 field validation (client) | **pass** | contact + client validation units |
| E2 delivery failure UX | **pass** | `502` e2e |
| BR-07 spam path (client) | **pass** | rejected response e2e |
| E4 / FR-12 404 | **pass** | e2e + axe on 404 |
| E5 reduced motion | **not run** | No automated RP1 check this session |
| E7 booking unavailable | **not run** | No env sweep for missing `PUBLIC_BOOKING_URL` |
| W1b Cal.com booking | **partial** | `target=_blank` when configured; no live Cal.com activation |
| FR-07 live inbox (Resend) | **not run** | Requires preview secrets / H2 staging — **blocked (H2)** |
| TM-01 / TM-12 preview burst | **not run** | No Cloudflare preview edge (H2); unit/contract cover logic |
| NFR-02 | **pass** | axe on four routes; keyboard spot tests |
| NFR-01 viewports | **partial** | Playwright default + mobile menu tests @ 390; no full 320/768/1440 matrix |
| NFR-04 motion | **not run** | — |
| FR-01–05 owner content | **not run** | QA did not execute owner sign-off (FR-03/05/NFR-07) |
| G3 waivers (FR-09, consulting-first) | **noted** | Still waived/deferred |

| Suite | Passed | Failed | Not run / blocked | Evidence |
|---|---|---|---|---|
| Unit + contract | 25 | 0 | — | `npm test` @ RC tree |
| E2E (Playwright) | 17 | 0 | — | `npm run test:e2e` after `npm run build` |
| Build + knip | pass | — | — | `astro build`; `npm run knip` |
| Merge CI (fe-03) | all green | — | — | Run 45708536952 |
| Cloudflare preview soak | — | — | **blocked H2** | — |
| Live Resend / inbox | — | — | **blocked H2** | — |

**Deviations:** Release test executed per human H2 allowance (local/preview server + CI). Staging-specific checks (real HTTPS preview, live inquiry delivery, rate-limit burst on edge) deferred until preview is available or RP2.

**Flaky / environment:** fe-02 merge push failed `gate / unused` only; not product regression after fe-03 fix.

## Defects
| Defect ID | Severity | Type | Owner | Status |
|---|---|---|---|---|
| — | — | — | — | — |

*SR-01/SR-02 remain in `testing/security/PR-2.md` (G5 disposition); not duplicated.*

## Recommendation for G6 (S5.3 package)
- **Recommendation:** **Approve — Pass with known issues** (RP1 staging gate)
- **Release point:** RP1 — full marketing site + inquiry API in repo; intended Cloudflare preview soak **not verified in this test pass (H2)**.
- **Evidence summary:** All four RP1 parts slice-checked; integrated RC `8f974c60` — **25/25** unit, **17/17** e2e (incl. contact flows + NFR-02 axe on four routes); fe-03 merge CI green.
- **Known issues proposed for acceptance:**
  - **H2:** No Cloudflare Pages preview / live Resend inbox proof for FR-07/BR-06 (Important — verify at preview soak or RP2).
  - **SR-02:** Email subject CRLF (Important, G5-open) — `backend-developer` / fast-follow before production traffic.
  - **SR-01:** Distributed rate-limit residual (Important, G5-accepted).
  - **Owner sign-off:** FR-03, FR-05, NFR-07, FR-11 privacy text approval not evidenced in QA (manual).
  - **G3:** FR-09 section CTAs waived; consulting-first line deferred.
  - **E5/E7/NFR-04:** Not run this session (Non-blocking for staging gate if tracked in RP2).
- **Open Blocking defects:** **None**
- **Clarifications for human:** **Approve** = acceptable to treat RP1 as integration-complete for continued staging setup / preview soak, **not** production go-live (RP2/G7). Re-run FR-07 + TM-12 manual on preview when H2 clears.