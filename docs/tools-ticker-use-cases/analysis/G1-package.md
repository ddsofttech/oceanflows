# G1 package — tools-ticker-use-cases
<!-- budget: lines=80 chars=300 -->

## Version
- Draft: **PRD v2.1** (Pending approval); last approved **v2.0** (`docs/baselines/prds/PRD-v2.0/`).

## Changes since baseline (by request)

### tools-ticker-use-cases — SITE
| ID | Change |
|---|---|
| SITE-FR-16 | Tools ticker below Services; fixed ordered list of 12 text-only tool names (D2 Q27) |
| SITE-FR-17 | Use cases: four workflows; motion-rich interactive presentation; Customer Support may use owner chat prototype |
| SITE-NFR-12 | Use-case motion: readable static summary; demos decorative; reduced-motion fallbacks |
| SITE-BR-06 | Text-only ticker; no third-party logos/wordmarks (D2 Q28) |
| SITE-AC-16, SITE-AC-17, SITE-AC-N04 | Acceptance for ticker and use-case motion |

### tools-ticker-use-cases — PRD
| ID | Change |
|---|---|
| W-3 | Home credibility scan includes ticker after Services |
| C8 | Ticker and use-case motion honour performance/motion constraints |
| R9, R10 | Motion and third-party naming risks |
| D9 | Owner Customer Support chat prototype dependency (received) |

### Closed at S1.7 (D2)
- Q27 → SITE-FR-16 ordered list (no additions beyond the 12 names).
- Q28 → SITE-BR-06 text-only descriptors.

## Open Non-blocking items
| ID | Question | Owner |
|---|---|---|
| Q19 | Production placeholders (inbox, booking URL, domain, etc.) | Duong |
| Q20 | Figma design system access or export | Duong |
| Q29 | Visual treatment for three use cases without owner assets | designer at G2 |

## Experience-design recommendation (playbook §11)
Confirm **at least one** trigger so S2 runs for this request:

| Trigger | Meets? | Evidence |
|---|---|---|
| 1 Greenfield UI | No | Existing marketing site and design system (SITE-NFR-08) |
| 2 New look | No | No rebrand or design-system overhaul in scope |
| 3 Restructure | **Yes** | **SITE-FR-17** replaces the whole Use cases block with a new motion-rich presentation |
| 4 Open UX | **Yes** | **SITE-FR-17** leaves interaction pattern to designer options at G2; owner request asks for selectable options; **Q29** (Non-blocking) |

**SITE-FR-16** (text-only ticker) can follow existing typography patterns in S3/S4; it does not by itself require S2.

**Recommendation:** Confirm triggers **3** and **4** for the request → **S2.1** after G1 Approve. If human confirms **none**, next step is **S3.1** (ticker + use cases built from spec and `docs/COMPONENTS.md` only).

## Decision asked (G1 HITL)
Choose one route for **PRD v2.1** and this request's specs:

- **Approve** — and confirm which §11 design trigger(s) apply (recommend 3 + 4), or **none**.
- **Revise** — feedback for requirements-analyst.
- **Reject** — remove only `tools-ticker-use-cases` changes from the draft.
- **New request** — pause this request; draft stays open.

Words recorded by orchestrator in `DECISION-LOG.md` (not edited by this agent).