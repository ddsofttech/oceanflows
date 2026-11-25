# Security Review: PR 2

- Title: Inquiry API (`cbw-be-01`)
- Slice part: cbw-be-01
- Sensitive: personal data (inquiry PII), secrets (Resend), spam controls
- Reviewed head (commit): `357b61529e8894c7eaee38aa064a5e3103d7f81c`
- Reviewer: security-engineer (S4.4)
- Date: 2026-11-25
- Merged as: `690e536c107950b9573eca6bcdc91f7ab6756e5d` (G5 D19 Approve)

## Checked
| Check | Result | Evidence |
|---|---|---|
| CI security gates green on the reviewed head | Pass | secrets, sast, dependency-audit green on PR #2 |
| Security requirements (IDs) | Pass | TM-01, TM-03, TM-05, TM-12 (+ optional TM-11) |
| Dependencies carrying sensitive scope | Pass | Resend server-only; no client secret exposure |
| Exceptions to security gates | None | — |

## Findings
| ID | Finding | Severity | Fix owner | Status (open / fixed / accepted by the human / false positive, with reason) | Verified at commit |
|---|---|---|---|---|---|
| SR-01 | Per-isolate in-memory rate limit (not global across Workers) | Important | backend / devops | accepted by the human (G5 D19) | 357b615 |
| SR-02 | Email subject CRLF sanitization for `name` deferred | Important | backend | accepted by the human (G5 D19); harden pre-prod | 357b615 |
| SR-03 | Production must receive `CF-Connecting-IP` (traffic via CF) | Non-blocking | devops | open — ensure custom domain via CF | 357b615 |
| SR-04 | fe-02 sends `X-Turnstile-Token` when Turnstile enabled | Non-blocking | frontend | open — optional at launch | 357b615 |

## Merge status
- Blocked by an unresolved Blocking finding: no
- Needs the human at G5: yes — Important residuals SR-01/SR-02; Approve recorded as D19
