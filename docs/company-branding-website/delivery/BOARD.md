# Delivery Board

## Metadata
- Request summary: company-branding-website
- Profile: Standard
- Route: Normal
- PRD version: 1.0
- Implementation plan and G4 decision: `design/IMPLEMENTATION-PLAN.md`; G4 Approve D17
- Last updated: 2026-11-25 (RP1 S5.2 done; G6 RP1 pending)

## Release points
| Release point | Slice parts | Status (Building / Verifying / Signed off / Released) | G6 | G7 |
|---|---|---|---|---|
| RP0 | cbw-devops-01 | Released | D18 Approve | N/A |
| RP1 | cbw-fe-01, cbw-be-01, cbw-fe-02, cbw-fe-03 | Verifying | Pending HITL | — |
| RP2 | cbw-fe-04, cbw-devops-02 | Building | — | — |

## Slice parts
| Part ID | Slice | Owner | Release point | Depends on | Status (Planned / In progress / In review / Merged / Checked) | PR | Review class (Routine / Important / Sensitive) | Review rounds | Notes |
|---|---|---|---|---|---|---|---|---|---|
| cbw-devops-01 | Platform | devops | RP0 | — | Checked | [#1](https://github.com/ddsofttech/oceanflows/pull/1) `05ec0c5` | Important | 1 | RP0 Released |
| cbw-fe-01 | Site shell | frontend-developer | RP1 | cbw-devops-01 | Checked | [#3](https://github.com/ddsofttech/oceanflows/pull/3) `7dfb47d` | Important | 1 | S5.1 Pass |
| cbw-be-01 | Inquiry API | backend-developer | RP1 | cbw-devops-01 | Checked | [#2](https://github.com/ddsofttech/oceanflows/pull/2) `690e536` | Sensitive | 1 | S5.1 Pass; SR-01/02 known |
| cbw-fe-02 | Contact live | frontend-developer | RP1 | cbw-fe-01, cbw-be-01 | Checked | [#5](https://github.com/ddsofttech/oceanflows/pull/5) `0374d95` | Important | 1 | S5.1 Pass |
| cbw-fe-03 | A11y/SEO polish | frontend-developer | RP1 | cbw-fe-01 | Checked | [#6](https://github.com/ddsofttech/oceanflows/pull/6) `8f974c6` | Important | 1 | S5.1 Pass |
| cbw-fe-04 | Analytics | frontend-developer | RP2 | cbw-fe-01 | Planned | — | Routine | 0 | — |
| cbw-devops-02 | Production launch | devops | RP2 | cbw-fe-02, cbw-fe-04 | Planned | — | Important | 0 | Needs Cloudflare H2 |

## Open handoffs
| ID | From | To | Type (consult / defect / finding / contract / environment) | About (part, PR, or defect) | Asked | Status | Answer or link |
|---|---|---|---|---|---|---|---|
| H2 | devops | human | environment | Cloudflare Pages | Account + Pages project or API token + account ID | Open | `delivery/CLOUDFLARE-PAGES-SETUP.md` |

## Environments
| Pipeline or environment | Ready | Evidence |
|---|---|---|
| Git host (GitHub) | Yes | github.com/ddsofttech/oceanflows.git |
| PR CI (gates) | Yes | `web-ci` green |
| Cloudflare Pages preview | No | H2 open |
| Cloudflare Pages production | No | RP2 |
| Test plan | Yes | `testing/TEST-PLAN.md` |
| RP1 RC | Yes | `8f974c60` — 25 unit + 17 e2e local |

## Escalations
| Date | Part or defect | Reason (retest failed twice / three handoffs / three fix rounds) | Sent to | Outcome |
|---|---|---|---|---|
