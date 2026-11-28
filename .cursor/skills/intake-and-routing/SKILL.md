---
name: intake-and-routing
description: Accept a requirements request, decide greenfield or existing-repo mode from the current repository, and start Requirements.
---

# Intake and Routing

Playbook step **S0.1** (orchestrator). Paths, gates, and routes: `.cursor/sdlc/AGENT-SDLC-PLAYBOOK.md`.

## When to use
- A new request arrives from the human.
- `new-feature-request` hands over follow-up work after a release.

## Input
- Requirements text, source material (meeting notes, transcripts, documents), or both.
- The current repository.

## Process
1. If the folder is not a git repository or has no commit yet, run `git init -b main` and commit the current folder, package included, leaving out secrets such as `.env`. Then continue.
2. Check that the requirements are usable. If empty or unreadable, ask the human once. Audio and video cannot be read: ask for a transcript, ideally with speakers and timestamps.
3. Decide the mode: `existing-repo` if the current repository already contains the system being changed, otherwise `greenfield`.
4. Record the profile the human chose (playbook section 5).
5. Decide the route. An issue the human reports in released code that no open request covers is a **defect request** (playbook section 17, Reported issues) when the mode is `existing-repo` and the engineering standards and CI already exist; everything else takes the normal path. An issue in an open request's scope is not a new request: hand it to `qa` instead.
6. Choose a short, stable `<request-summary>` and create its folder.
7. Save the source material unchanged, one file per meeting or document, named with its date and topic (for example `2026-11-03-auth-workshop.md`). Typed requirements are saved as a source too.
8. Record the routing and start S1.1, or S5.1 for a defect request.

## Output
- When there was no repository or no commit: `main` with the current folder committed.
- A `DECISION-LOG.md` routing row (Gate `—`, Decision `Routing`), in the shape of the `DECISION-LOG.md` template: request summary, mode, profile, route, sources received, next step.
- The saved source files.

## Quality checklist
- [ ] Mode, route, and next step are explicit
- [ ] No requirement was invented to make the input usable
- [ ] Every source is saved unchanged and readable as text
- [ ] The human was interrupted only for unusable input
