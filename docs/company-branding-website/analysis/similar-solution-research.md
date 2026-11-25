# Similar-solution research — company-branding-website (S1.3)

**Job to be done:** help an SMB owner who is exploring AI quickly understand what DD Software Solutions does, trust it without being shown invented proof, and start a consultation with little effort.

Searched 2026-11-24. These are comparables and practitioner articles, not controlled studies. Treat every figure quoted in them as the author's claim, not evidence. No rule or target in the PRD comes from them.

## Comparables

| # | Source | Problem match | Approach | What worked / what is reported to fail | Fit |
|---|---|---|---|---|---|
| 1 | Yarbrough AI — https://yarbroughai.com/ | High: AI consulting for small businesses | Leads with an audit of where time is lost, then builds the systems | Diagnosis-first framing matches "consulting first" | Positioning lesson only |
| 2 | Stratos AI Consulting — https://www.stratosaiconsulting.com/ | High | Assessment intake, then a written recommendation, then a call | A visible, step-by-step engagement path | Supports a concrete Approach section |
| 3 | Khoda Consulting — https://khodaconsulting.com/ | High: founder-led SMB AI consulting | Numbered phases, each listing its outputs (problem statement, scope proposal, architecture) | Showing what the client receives at each phase builds trust | Supports Approach; outputs need owner confirmation |
| 4 | Delani, "AI Agency Website Examples" — https://delani.pro/articles/ai-agency-website-examples | Adjacent: AI agency sites | Outcome-first hero, one primary CTA, 3–5 services described as problem → delivery → outcome; case studies with numbers; public pricing | Reported failures: tool-first headlines and capability lists that read like a deck | Adopt outcome framing and a single CTA. Reject case studies and numbers (no verified source). Defer pricing |
| 5 | Nactore, "B2B Website That Books Calls" — https://nactore.com/blog/b2b-website-that-books-calls | Adjacent: B2B service sites | Few pages, each with one job; trust from real names, a shown process, and no unsourced numbers; short form plus calendar link; say what happens next | Matches the request's "no invented claims" constraint | Adopt trust-without-fabrication and "what happens next" |
| 6 | Typza / Choco Media, booking vs. form — https://www.typza.com/insights/discovery-call-booking-vs-contact-form/ , https://chocomediaagency.com/booking-link-or-contact-form-how-to-decide-what-converts-better-for-a-service-business/ | Adjacent: the consultation path | A booking link removes the wait, a form gathers context, and a hybrid offers both | The authors themselves say results depend on audience and traffic | The booking option is a human decision (PRD Q2) |
| 7 | Fernside Studio / AJD Digital, form length — https://fernsidestudio.com/blog/form-design-uk-b2b-conversion/ , https://ajddigitalsolutions.com/b2b-site-asking-too-much-from-visitors/ | Adjacent: contact forms | Three or four fields (name, email, message), with qualifying questions asked on the call | Reported: longer forms lose completions. The figures are anecdotal | Informs the proposed minimum fields; the final fields are PRD Q3 |

## Dispositions

| Idea | Disposition | Reason / PRD link |
|---|---|---|
| Outcome-first headline and services written as problem → outcome | **Adopt** | Matches source §4 ("business outcomes rather than technical terminology"). FR-01, FR-03, NFR-07 |
| One primary consultation CTA, repeated across the site | **Adopt** | Source §6 asks for clear CTAs. FR-01, FR-09 |
| Numbered engagement process with what the client gets at each step | **Adopt** (stages); outputs **pending** the owner | Source §1 names the stages. The deliverables at each stage are not in the sources (Q5). FR-04 |
| Trust built from real people, a shown process, and sourced claims only | **Adopt** | Source §7. FR-05, BR-01, BR-02 |
| Short form with "what happens next" | **Adopt** (short form, confirmation). Response-time promise **pending** | FR-06, FR-07. A response-time promise is the owner's call (Q13) |
| Case studies, client logos, testimonials, metrics | **Reject** for this release | Source §7 forbids inventing them, and none have been supplied. Can return once the owner provides real ones |
| Public pricing or packages | **Defer** | Not in the sources. It is a business decision (Q17) |
| Calendar booking link | **Defer to human** | Q2. The form remains the base path either way |
| Blog / guides for search | **Reject** for this release | Source §6 and §7 prefer clarity over page count and no unnecessary features |

## Solution patterns (for the architect, not the PRD)

- Static or pre-rendered marketing site with a hosted form-delivery service, rather than a custom backend (fits source §7).
- An embedded scheduler (e.g. Cal.com, Calendly) if Q2 adds booking.
- Use PageSpeed Insights or Lighthouse to check against the performance target, once Q9 sets it.
