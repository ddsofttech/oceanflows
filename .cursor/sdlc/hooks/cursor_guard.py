#!/usr/bin/env python3
"""Cursor hook guard for the SDLC package.

Registered by scripts/install.py in the project's .cursor/hooks.json. Reads a Cursor
hook event as JSON on stdin and prints Cursor permission JSON on stdout.

Refuses the same actions as guard.py (baselines, orchestrator-only files, force-push,
protected branches, --no-verify, missing package on switch, secrets). Speaks Cursor's
hook protocol directly; shares the check logic with guard.py.
Standard library only.
"""
import json
import sys
from pathlib import Path

HOOKS = Path(__file__).resolve().parent
if str(HOOKS) not in sys.path:
    sys.path.insert(0, str(HOOKS))

import guard  # noqa: E402


def allow():
    print(json.dumps({"permission": "allow"}))
    return 0


def deny(message):
    print(json.dumps({
        "permission": "deny",
        "agent_message": message,
        "user_message": message,
    }))
    return 0


def is_subagent(event):
    if event.get("agent_id") or event.get("subagent") or event.get("is_subagent") or event.get("subagent_type"):
        return True
    parent = event.get("parent_agent_id") or event.get("composer_id")
    agent = event.get("agent_id")
    return bool(parent and agent and parent != agent)


def normalize(event):
    """Map Cursor preToolUse / beforeShellExecution fields to (tool, data, cwd, subagent)."""
    tool = event.get("tool_name") or event.get("tool") or ""
    data = event.get("tool_input") or event.get("input") or {}
    if not isinstance(data, dict):
        data = {}
    data = dict(data)

    if not tool and "command" in event:
        tool = "Shell"
        data = {**data, "command": event.get("command", "")}

    # HOOKS is …/<project>/.cursor|claude/sdlc/hooks → project is parents[2]
    # (same as Path(__file__).parents[3] when __file__ is the .py under hooks/)
    project = str(HOOKS.parents[2]) if len(HOOKS.parents) >= 2 else str(HOOKS)
    cwd = event.get("cwd") or (event.get("workspace_roots") or [None])[0] or project
    subagent = is_subagent(event)

    if tool in ("Shell", "Bash"):
        if "command" not in data and event.get("command"):
            data["command"] = event["command"]
        return "Bash", data, cwd, subagent

    if tool in ("StrReplace", "SearchReplace", "Edit"):
        if "path" in data and "file_path" not in data:
            data["file_path"] = data["path"]
        return "Edit", data, cwd, subagent

    if tool in ("Write", "write"):
        if "path" in data and "file_path" not in data:
            data["file_path"] = data["path"]
        if "contents" in data and "content" not in data:
            data["content"] = data["contents"]
        return "Write", data, cwd, subagent

    if tool in ("Delete", "delete"):
        path = data.get("path") or data.get("file_path") or ""
        return "Bash", {"command": f"rm -f {path}"}, cwd, subagent

    if tool in ("EditNotebook", "NotebookEdit"):
        if "target_notebook" in data and "notebook_path" not in data:
            data["notebook_path"] = data["target_notebook"]
        return "NotebookEdit", data, cwd, subagent

    if tool == "MultiEdit":
        if "path" in data and "file_path" not in data:
            data["file_path"] = data["path"]
        return "MultiEdit", data, cwd, subagent

    return None, None, cwd, subagent


def main():
    try:
        event = json.load(sys.stdin)
    except (ValueError, OSError):
        return allow()

    tool, data, cwd, subagent = normalize(event)
    if tool is None:
        return allow()

    root = HOOKS.parents[2].resolve() if len(HOOKS.parents) >= 2 else Path(cwd).resolve()
    cwd = event.get("cwd") or str(root)

    try:
        if tool in ("Write", "Edit", "MultiEdit", "NotebookEdit"):
            guard.check_file_tool(root, cwd, tool, data, subagent)
        elif tool == "Bash":
            guard.check_shell(root, cwd, data.get("command", ""), subagent)
    except guard.GuardBlocked as e:
        return deny(e.message)
    return allow()


if __name__ == "__main__":
    sys.exit(main())
