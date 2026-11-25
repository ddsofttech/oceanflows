# Delivery Board

## Metadata
- Request summary: company-branding-website
- Profile: Standard
- Route: Normal
- PRD version: 1.0
- Implementation plan and G4 decision: `design/IMPLEMENTATION-PLAN.md`; G4 Approve D17
- Last updated: 2026-11-25 (PR #9 merged — production web/ on release/)

## Release points
| Release point | Slice parts | Status (Building / Verifying / Signed off / Released) | G6 | G7 |
|---|---|---|---|---|
| RP0 | cbw-devops-01 | Signed off | D18 Approve | N/A (scaffold; no prod deploy) |
| RP1 | cbw-fe-01, cbw-be-01, cbw-fe-02, cbw-fe-03 | Signed off | D20 Approve | Hold — DNS |
| RP2 | cbw-fe-04, cbw-devops-02 | Building | — | — |

## Slice parts
| Part ID | Slice | Owner | Release point | Depends on | Status (Planned / In progress / In review / Merged / Checked) | PR | Review class (Routine / Important / Sensitive) | Review rounds | Notes |
|---|---|---|---|---|---|---|---|---|---|
| cbw-devops-01 | Platform | devops | RP0 | — | Checked | [#1](https://github.com/ddsofttech/oceanflows/pull/1) `05ec0c5` | Important | 1 | G6 D18; no G7 (scaffold) |
| cbw-fe-01 | Site shell | frontend-developer | RP1 | cbw-devops-01 | Checked | [#3](https://github.com/ddsofttech/oceanflows/pull/3) `7dfb47d` | Important | 1 | S5.1 Pass |
| cbw-be-01 | Inquiry API | backend-developer | RP1 | cbw-devops-01 | Checked | [#2](https://github.com/ddsofttech/oceanflows/pull/2) `690e536` | Sensitive | 1 | S5.1 Pass; SR-01/02 known |
| cbw-fe-02 | Contact live | frontend-developer | RP1 | cbw-fe-01, cbw-be-01 | Checked | [#5](https://github.com/ddsofttech/oceanflows/pull/5) `0374d95` | Important | 1 | S5.1 Pass |
| cbw-fe-03 | A11y/SEO polish | frontend-developer | RP1 | cbw-fe-01 | Checked | [#6](https://github.com/ddsofttech/oceanflows/pull/6) `8f974c6` | Important | 1 | S5.1 Pass |
| cbw-fe-04 | Analytics | frontend-developer | RP2 | cbw-fe-01 | Merged | [#8](https://github.com/ddsofttech/oceanflows/pull/8) | Routine | 0 | Set PUBLIC_CF_ANALYTICS_TOKEN + redeploy; S5.1 next |
| cbw-devops-02 | Production launch | devops | RP2 | cbw-fe-02, cbw-fe-04 | Planned | — | Important | 0 | Apex DNS A/AAAA/CNAME missing |

## Open handoffs
| ID | From | To | Type (consult / defect / finding / contract / environment) | About (part, PR, or defect) | Asked | Status | Answer or link |
|---|---|---|---|---|---|---|---|
| H3 | devops | human | environment | DNS oceanflows.net | Apex has CF NS only — no A/AAAA/CNAME; S6.2 Fail | Open | Attach Worker custom domain / DNS records |

## Environments
| Pipeline or environment | Ready | Evidence |
|---|---|---|
| Git host (GitHub) | Yes | github.com/ddsofttech/oceanflows.git |
| PR CI (gates) | Yes | `web-ci` green |
| GitHub Cloudflare secrets | Yes | Owner set |
| Cloudflare live site | No | `web/` now on `release/`; rebuild CF on that branch, then custom domain (H3) |
| Test plan | Yes | `testing/TEST-PLAN.md` |
| RP1 RC | Yes | `8f974c60` |

## Escalations
| Date | Part or defect | Reason (retest failed twice / three handoffs / three fix rounds) | Sent to | Outcome |
|---|---|---|---|---|
