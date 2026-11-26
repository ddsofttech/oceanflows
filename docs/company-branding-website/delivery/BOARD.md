# Delivery Board

## Metadata
- Request summary: company-branding-website
- Profile: Standard
- Route: Normal
- PRD version: 1.0
- Implementation plan and G4 decision: `design/IMPLEMENTATION-PLAN.md`; G4 Approve D17
- Last updated: 2026-11-25 (D23 G7 Go — RP1 Released)

## Release points
| Release point | Slice parts | Status (Building / Verifying / Signed off / Released) | G6 | G7 |
|---|---|---|---|---|
| RP0 | cbw-devops-01 | Signed off | D18 Approve | N/A (scaffold; no prod deploy) |
| RP1 | cbw-fe-01, cbw-be-01, cbw-fe-02, cbw-fe-03 | Released | D20 Approve | D23 Go |
| RP2 | cbw-fe-04, cbw-devops-02 | Building | — | — |

## Slice parts
| Part ID | Slice | Owner | Release point | Depends on | Status (Planned / In progress / In review / Merged / Checked) | PR | Review class (Routine / Important / Sensitive) | Review rounds | Notes |
|---|---|---|---|---|---|---|---|---|---|
| cbw-devops-01 | Platform | devops | RP0 | — | Checked | [#1](https://github.com/ddsofttech/oceanflows/pull/1) `05ec0c5` | Important | 1 | G6 D18; no G7 (scaffold) |
| cbw-fe-04 | Analytics | frontend-developer | RP2 | cbw-fe-01 | Merged | [#8](https://github.com/ddsofttech/oceanflows/pull/8) | Routine | 0 | Set PUBLIC_CF_ANALYTICS_TOKEN + redeploy; S5.1 next |
| cbw-devops-02 | Production launch | devops | RP2 | cbw-fe-02, cbw-fe-04 | Planned | — | Important | 0 | Placeholders/HTTP→HTTPS/www; DNS H3 closed (D22) |

## Open handoffs
| ID | From | To | Type (consult / defect / finding / contract / environment) | About (part, PR, or defect) | Asked | Status | Answer or link |
|---|---|---|---|---|---|---|---|

## Environments
| Pipeline or environment | Ready | Evidence |
|---|---|---|
| Git host (GitHub) | Yes | github.com/ddsofttech/oceanflows.git |
| PR CI (gates) | Yes | `web-ci` green |
| GitHub Cloudflare secrets | Yes | Owner set |
| Cloudflare live site | Yes | S6.2 Pass; G7 D23 — https://oceanflows.net |
| Test plan | Yes | `testing/TEST-PLAN.md` |
| RP1 RC | Yes | `8f974c60` |
| RP1 observation | Started | 48h soak after D23; owner devops + human |

## Escalations
| Date | Part or defect | Reason (retest failed twice / three handoffs / three fix rounds) | Sent to | Outcome |
|---|---|---|---|---|
