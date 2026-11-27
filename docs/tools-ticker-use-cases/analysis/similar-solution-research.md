# Similar-solution research — tools-ticker-use-cases (S1.3)

Searched 2026-11-27. Patterns for consulting sites, not product requirements by themselves.

## Comparables
| # | Pattern | Observation | Disposition |
|---|---|---|---|
| 1 | Logo ticker / marquee below services | Signals integration breadth without case studies | **Adopt** for SITE-FR-16; list from owner (Q27) |
| 2 | Text-only tech stack row | Avoids trademark issues | **Alternative** if Q28 rejects logos |
| 3 | Interactive product demos on marketing pages | Raises engagement; risks CWV | **Adopt with guardrails** SITE-NFR-12 |
| 4 | Reduced-motion static fallbacks | WCAG / UX norm | **Adopt** — matches prototype HTML |
| 5 | Owner-supplied demo + designed variants for rest | Common when one hero demo exists | **Adopt** — G2 options per request |

## Solution patterns (architect/designer, not PRD)
- CSS marquee or slow horizontal scroll for ticker; pause on hover/focus.
- Use-case demos as self-contained modules; load after first paint.
- Customer Support: adapt `2026-11-27-customer-support-ai-assistant-chat.html` patterns into design system.

No conflicting product directions; no Blocking choice between directions.