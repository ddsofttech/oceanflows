---
name: security-review
description: Judge a sensitive PR for the security risks CI's security gates cannot catch, against OWASP ASVS and the slice's security requirements, judge every exception to a security gate, and record a disposition for every finding.
---

# Security Review

Playbook step **S4.4** (`security-engineer`); its result feeds S4.5 (G5). Paths, gates, routes, and profile depth come from your step card. Design-time review uses `threat-modeling`.

## When to use
- A Sensitive PR, alongside code review.
- A fix was pushed to a PR you reviewed: re-check.

## Input
- PR diff and description, and CI green on its head, security gates included. A security gate missing or red is not yours to run or work around: the PR is not ready for review; say so and stop.
- The part plan's security requirements and the threat-model entries, trust boundaries, and contracts they cite.
- A re-check: the PR's security review and the commits since its reviewed head.

## Process
**Re-check.** Review only `git diff <reviewed head>..<new head>` against the open findings. Update each finding's status and the reviewed head in the same review; never add a second review or copy the first. Raise anything new the fix itself introduced.

**First review**

Spend the review on judgement. What a security gate already checks (known patterns, vulnerable or look-alike packages, licenses, committed credentials) is not repeated.

1. Check the slice's security requirements from the threat model are met and tested.
2. Review the diff against OWASP ASVS and, for APIs, the OWASP API Security Top 10, at least:
   - **Authorization:** checked on every entry point and on every object, so a caller cannot reach another user's records by changing an ID.
   - **Authentication and sessions:** tokens validated, expired, and stored safely.
   - **Input and output:** validation at the boundary; parameterized queries; output encoding; no SSRF, path traversal, or unsafe deserialization.
   - **Data:** sensitive data encrypted where required, never in logs, errors, or URLs.
   - **Abuse:** rate limits and size limits on exposed endpoints and uploads.
   - **Web:** CORS, CSRF, and security headers where relevant.
   - **Secrets and configuration:** none in code or client bundles; safe defaults.
3. Judge a new or upgraded dependency only when it carries the sensitive scope itself (authentication, cryptography, sessions, parsing untrusted input): is it the right tool for that job, maintained, and used safely.
4. Judge every known exception to a security gate the PR adds — a suppression, a false-positive mark, a raised limit, or an allowed finding: is it really safe, and is it scoped and time-limited. Each is a finding with a severity; accepting it is the human's decision.
5. Rate each finding by exploitability and impact, map it to the severity scale in `.cursor/sdlc/AGENT-RULES.md`, and record its disposition: fixed, accepted by the human, or false positive with reason.
6. State whether merge is blocked (an unresolved Blocking finding) and which Sensitive criteria in your step card the PR meets, for the human at G5.
7. Hand every open finding to its fix owner in one handoff that points to the review (Handoffs, `.cursor/sdlc/AGENT-RULES.md`); the fixer reads that review, not the history of others.

## Output
- One security review per Sensitive PR in the shape of the `SECURITY-REVIEW.md` template: what was checked in one row each, the detail spent on findings.

## Quality checklist
- [ ] CI green on the reviewed head, security gates included
- [ ] The slice's security requirements are verified
- [ ] Object-level authorization checked on every changed entry point
- [ ] Dependencies carrying sensitive scope judged; every exception to a security gate judged
- [ ] Every finding has a severity and a disposition
- [ ] Sensitive-scope changes are identified
- [ ] No secret is recommended for committing
