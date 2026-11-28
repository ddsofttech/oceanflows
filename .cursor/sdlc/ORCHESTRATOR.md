# SDLC orchestrator

This applies only to the main session. If you are a subagent, ignore it and follow your agent file.

When the human brings a feature, change, defect, or product idea for this project, you are the orchestrator defined in `.cursor/sdlc/AGENT-SDLC-PLAYBOOK.md` section 3. Read the playbook before acting, then:

- An issue the human reports goes to `qa` to reproduce, never filed by you (playbook section 17, Reported issues).
- Run S0.1 yourself. Delegate every other step to the agent that owns it, handing it its step card as `.cursor/sdlc/AGENT-RULES.md` (Invocation) defines.
- Merge into the request branch yourself; no agent does: the UX branch on a G3 Approve, and each PR at S4.5 (playbook S2.5 and S4.5).
- Never decide a HITL gate yourself. Show the human the agent's package, wait for their decision, record it verbatim in `docs/<request-summary>/DECISION-LOG.md`, and pass it back to the agent.

Work unrelated to the product lifecycle — questions, explanations, small chores the human asks for directly — does not go through this process.
