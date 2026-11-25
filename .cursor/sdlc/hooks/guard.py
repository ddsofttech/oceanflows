#!/usr/bin/env python3
"""Claude Code PreToolUse guard for the SDLC package.

Registered by scripts/install.py in the project's .claude/settings.json. Reads the tool call as JSON on
stdin; exit 0 allows it, exit 2 refuses it and tells the agent why (on stderr).

Refuses:
  - changing or deleting an existing file under docs/baselines/ (creating a new baseline is allowed);
  - a subagent writing a request's delivery/BOARD.md, DECISION-LOG.md, or decisions/ (only the orchestrator, the main session, writes them);
  - git push with --force, -f, or a +refspec; pushing to main or master; --no-verify;
  - git checkout or switch to a ref that does not hold the SDLC package (it would vanish from the checkout);
  - writing content that looks like a real secret (private keys, cloud and API tokens).
Standard library only.
"""
import json
import os
import re
import shlex
import subprocess
import sys
from pathlib import Path

BASELINES = "docs/baselines"
PROTECTED_BRANCHES = {"main", "master"}
SECRETS = [
    ("private key", re.compile(r"-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY-----")),
    ("AWS access key", re.compile(r"\b(?:AKIA|ASIA)[0-9A-Z]{16}\b")),
    ("GitHub token", re.compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{60,}\b")),
    ("API secret key", re.compile(r"\bsk-(?:ant-|proj-|live-)?[A-Za-z0-9_-]{32,}\b")),
    ("Slack token", re.compile(r"\bxox[abposr]-[A-Za-z0-9-]{20,}\b")),
    ("Google API key", re.compile(r"\bAIza[0-9A-Za-z_-]{35}\b")),
    ("Stripe live key", re.compile(r"\b(?:sk|rk)_live_[A-Za-z0-9]{20,}\b")),
]
ORCHESTRATOR_ONLY = re.compile(r"(?:^|/)docs/[^/]+/(?:delivery/BOARD\.md|DECISION-LOG\.md|decisions(?:/[^/]+)?)$")
SEGMENT_SPLIT = re.compile(r"\|\||&&|[;|\n]")


def refuse(reason):
    print(f"Blocked by the SDLC guard: {reason} This is a project rule, not an error: do not retry it another way. "
          "Report it to the orchestrator if the step needs it.", file=sys.stderr)
    sys.exit(2)


def project_root(event):
    root = os.environ.get("CLAUDE_PROJECT_DIR") or event.get("cwd") or str(Path(__file__).resolve().parents[3])
    return Path(root).resolve()


def relative(root, raw, cwd):
    path = Path(raw)
    if not path.is_absolute():
        path = Path(cwd) / path
    try:
        return path.resolve().relative_to(root).as_posix()
    except ValueError:
        return None


def is_orchestrator_only(raw):
    return bool(ORCHESTRATOR_ONLY.search(raw.strip("'\"").replace("\\", "/")))


def refuse_orchestrator_only(raw):
    refuse(f"{raw} is written only by the orchestrator; report the status change or decision in your final message.")


def is_existing_baseline(root, rel):
    return rel is not None and (rel == BASELINES or rel.startswith(BASELINES + "/")) and (root / rel).exists()


# ---------- file tools ----------

def written_text(tool, data):
    if tool == "Write":
        return data.get("content", "")
    if tool == "Edit":
        return data.get("new_string", "")
    if tool == "MultiEdit":
        return "\n".join(e.get("new_string", "") for e in data.get("edits", []))
    if tool == "NotebookEdit":
        return data.get("new_source", "")
    return ""


def check_file_tool(root, cwd, tool, data, subagent):
    raw = data.get("file_path") or data.get("notebook_path")
    if raw and subagent and is_orchestrator_only(raw):
        refuse_orchestrator_only(raw)
    if raw:
        rel = relative(root, raw, cwd)
        if is_existing_baseline(root, rel):
            refuse(f"{rel} is an approved PRD baseline and is never edited; a change goes through S1.C as a new version.")
    text = written_text(tool, data)
    for name, pattern in SECRETS:
        if pattern.search(text):
            refuse(f"the content looks like a real {name}. Secrets come only from the secrets store, never from files.")


# ---------- shell ----------

def tokens(segment):
    try:
        return shlex.split(segment, posix=True)
    except ValueError:
        return segment.split()


def current_branch(root):
    try:
        r = subprocess.run(["git", "-C", str(root), "symbolic-ref", "--short", "HEAD"], capture_output=True, text=True, timeout=10)
        return r.stdout.strip() if r.returncode == 0 else ""
    except (OSError, subprocess.TimeoutExpired):
        return ""


def git_ok(root, *args):
    try:
        return subprocess.run(["git", "-C", str(root), *args], capture_output=True, timeout=10).returncode == 0
    except (OSError, subprocess.TimeoutExpired):
        return False


def switch_target(opts):
    """The ref a checkout or switch moves to; None when it stays on HEAD or restores files."""
    if "--" in opts:
        return None
    positional, skip = [], False
    for o in opts:
        if skip:
            skip = False
        elif o in ("-b", "-B", "-c", "-C", "--orphan"):
            skip = True
        elif not o.startswith("-"):
            positional.append(o)
    return positional[0] if positional else None


def check_git(root, args):
    if "git" not in args:
        return
    rest = args[args.index("git") + 1:]
    while rest and rest[0].startswith("-"):                  # git -C dir, git -c k=v
        rest = rest[2:] if rest[0] in ("-C", "-c") else rest[1:]
    if not rest:
        return
    sub, opts = rest[0], rest[1:]
    if "--no-verify" in opts or (sub == "commit" and "-n" in opts):
        refuse("--no-verify skips the project's checks.")
    if sub in ("checkout", "switch"):
        ref = switch_target(opts)
        package = f"{Path(__file__).resolve().parents[2].name}/sdlc/AGENT-RULES.md"
        if ref and git_ok(root, "rev-parse", "--verify", "--quiet", ref + "^{commit}") and not git_ok(root, "cat-file", "-e", f"{ref}:{package}"):
            refuse(f"{ref} does not hold the SDLC package; switching to it removes the package from this checkout. "
                   "Cut your branch from the request branch, in your own worktree.")
    if sub != "push":
        return
    if any(o in ("-f", "--force", "--force-if-includes") or o.startswith("--force-with-lease") or
           (o.startswith("-") and not o.startswith("--") and "f" in o[1:]) for o in opts):
        refuse("force-pushing rewrites shared history.")
    positional = [o for o in opts if not o.startswith("-")]
    refspecs = positional[1:]
    if any(r.startswith("+") for r in refspecs):
        refuse("a +refspec force-pushes.")
    branch = None
    targets = set()
    for r in refspecs:
        name = r.split(":")[-1].replace("refs/heads/", "")
        if name == "HEAD":
            branch = branch if branch is not None else current_branch(root)
            name = branch
        targets.add(name)
    if not refspecs:
        targets = {current_branch(root)}
    hit = targets & PROTECTED_BRANCHES
    if hit:
        refuse(f"pushing directly to {', '.join(sorted(hit))}; open a PR instead.")


def shell_targets(segment, args):
    """Paths a shell segment writes, moves, or removes."""
    targets = re.findall(r">>?\s*([^\s;|&]+)", segment)
    if args:
        cmd, rest = Path(args[0]).name, [a for a in args[1:] if not a.startswith("-")]
        if cmd in ("cp", "install") and rest:
            targets.append(rest[-1])
        elif cmd in ("rm", "mv", "truncate", "chmod", "chown", "unlink", "shred", "rmdir"):
            targets += rest
        elif cmd in ("sed", "perl") and any(a.startswith("-i") or a == "--in-place" for a in args[1:]):
            targets += rest
        elif cmd == "tee":
            targets += rest
        elif cmd == "git" and len(args) > 1 and args[1] in ("rm", "mv", "restore", "checkout", "clean"):
            targets += rest[1:]
    return targets


def check_baseline_shell(root, cwd, segment, args):
    if BASELINES not in segment.replace("\\", "/"):
        return
    for raw in shell_targets(segment, args):
        rel = relative(root, raw.strip("'\""), cwd)
        if is_existing_baseline(root, rel):
            refuse(f"{rel} is an approved PRD baseline and is never changed or removed.")


def check_shell(root, cwd, command, subagent):
    for segment in SEGMENT_SPLIT.split(command):
        segment = segment.strip()
        if not segment:
            continue
        args = tokens(segment)
        check_git(root, args)
        check_baseline_shell(root, cwd, segment, args)
        if subagent:
            for raw in shell_targets(segment, args):
                if is_orchestrator_only(raw):
                    refuse_orchestrator_only(raw)
    for name, pattern in SECRETS:
        if pattern.search(command) and re.search(r">|\btee\b", command):
            refuse(f"the command writes what looks like a real {name} to a file.")


def main():
    try:
        event = json.load(sys.stdin)
    except (ValueError, OSError):
        return 0                                             # not a tool call we understand: never block on our own failure
    root = project_root(event)
    cwd = event.get("cwd") or str(root)
    tool, data = event.get("tool_name", ""), event.get("tool_input") or {}
    subagent = bool(event.get("agent_id"))                   # Claude Code sets agent_id only inside a subagent
    if tool in ("Write", "Edit", "MultiEdit", "NotebookEdit"):
        check_file_tool(root, cwd, tool, data, subagent)
    elif tool == "Bash":
        check_shell(root, cwd, data.get("command", ""), subagent)
    return 0


if __name__ == "__main__":
    sys.exit(main())
