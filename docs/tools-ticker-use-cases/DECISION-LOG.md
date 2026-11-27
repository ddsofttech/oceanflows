# Decision Log

One row per human decision, answer, or routing event, oldest first. `sdlc-check.py` reads the Date, Gate, Decision, Subject, and By columns: keep their names and values exactly.

| ID | Date | Gate | Step | Decision | Subject | Human's words (verbatim) | By | Notes |
|---|---|---|---|---|---|---|---|---|
| D1 | 2026-11-27 | — | S0.1 | Routing | tools-ticker-use-cases | Add ticker items section below Services section for tools using to build solutions or integrate with such as Claude, n8n, Cursor, Composio, MCP Server, Supabase, Notion, Google Workspace, Microsoft , Cloudflare, AWS, Azure, ... Redesign user cases with animation with interactive experience and motion rich web design. Let designer or design lead suggest a couple options to select. I have only have an image for Customer Support AI assistant as attached | orchestrator | Mode `existing-repo`. Profile Standard. Route Normal. Sources: `sources/2026-11-27-project-request.md`, `sources/2026-11-27-customer-support-ai-assistant-chat.html`. Next: S1.1. |
| D2 | 2026-11-27 | — | S1.7 | Answer | Q27, Q28 | Q27: keep as the list you say Q28: text only | human | Q27 = ordered list Claude, n8n, Cursor, Composio, MCP Server, Supabase, Notion, Google Workspace, Microsoft, Cloudflare, AWS, Azure (no additions). Q28 = text-only descriptors. Resume S1.7 → S1.8. |
| D3 | 2026-11-27 | G1 | S1.8 | Approve | v3.0 | Approve | human | Draft v2.1 approved as baseline **v3.0**. §11 design triggers **3 Restructure** and **4 Open UX** (package recommendation not overridden). Next: S2.1. |
| D4 | 2026-11-27 | G2 | S2.2 | Revise | Use cases direction | all your design options are not better than my prototype, please use my prototype but arrange it in the page on the left and text content on the right with its outstanding benefits, write 5 list items and a hook on the top of it. | human | Discard directions A–C. Rebuild brief around owner chat prototype left + copy right (hook + 5 benefit bullets). Stay within SITE-BR-05 (no invented client claims). → S2.1. |
| D5 | 2026-11-27 | — | S2.1 | Answer | Use cases lazy load | apply lazy loading when users scroll to each use case | human | Each use-case demo/content activates only when scrolled into view (intersection-based). Fold into S2.1 revise with D4. |

Next ID: **D6**.
