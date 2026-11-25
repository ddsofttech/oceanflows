#!/usr/bin/env python3
"""Remove agent worktrees whose work is merged.

Usage (from the project root):
  python .cursor/sdlc/scripts/clean-worktrees.py --into origin/release/<request-summary> [--dry-run]

Looks only at worktrees under .cursor/worktrees/ (where Claude Code puts agent worktrees). One is removed,
with its local branch, when it has no uncommitted changes, is not locked (a running agent), and its HEAD is
already in a --into ref. Anything else is kept and listed. Leftover worktree-agent-* branches that no
worktree uses and that are merged are deleted too. Remote branches are never touched.
Standard library only, Python 3.10+.
"""
import argparse
import subprocess
import sys
from pathlib import Path

PKG = Path(__file__).resolve().parents[1]
KEEP_BRANCHES = {"main", "master"}


def git(root, *args):
    r = subprocess.run(["git", "-C", str(root), *args], capture_output=True, text=True)
    return r.returncode == 0, (r.stdout if r.returncode == 0 else r.stderr).strip()


def worktrees(root):
    """[{path, head, branch, locked}] from `git worktree list --porcelain`."""
    ok, out = git(root, "worktree", "list", "--porcelain")
    found, cur = [], {}
    for line in (out if ok else "").splitlines() + [""]:
        if not line:
            if cur:
                found.append(cur)
            cur = {}
        elif line.startswith("worktree "):
            cur = {"path": Path(line[9:]).resolve(), "head": "", "branch": "", "locked": False}
        elif line.startswith("HEAD "):
            cur["head"] = line[5:]
        elif line.startswith("branch "):
            cur["branch"] = line[7:].removeprefix("refs/heads/")
        elif line.startswith("locked"):
            cur["locked"] = True
    return found


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default=None, help="project root (default: the project this script is installed in)")
    ap.add_argument("--into", action="append", required=True, help="ref the work must be merged into; repeatable")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    root = Path(args.root).resolve() if args.root else PKG.parents[1]
    area = (root / ".cursor" / "worktrees").resolve()
    targets = [ref for ref in args.into if git(root, "rev-parse", "--verify", "--quiet", ref)[0]]
    if not targets:
        sys.exit(f"none of {', '.join(args.into)} exists; fetch first")
    keep = KEEP_BRANCHES | {ref.removeprefix("origin/") for ref in args.into}

    removed = kept = 0
    for wt in worktrees(root):
        if area not in wt["path"].parents:
            continue
        name = wt["path"].name
        reason = ""
        if wt["locked"]:
            reason = "locked (an agent may still be running)"
        elif not wt["path"].is_dir():
            reason = "folder missing; run git worktree prune"
        elif git(wt["path"], "status", "--porcelain")[1]:
            reason = "uncommitted changes"
        elif not any(git(root, "merge-base", "--is-ancestor", wt["head"], ref)[0] for ref in targets):
            reason = f"{wt['head'][:7]} is not merged into {', '.join(targets)}"
        if reason:
            print(f"keep    {name}: {reason}")
            kept += 1
            continue
        branch = wt["branch"] if wt["branch"] and wt["branch"] not in keep else ""
        print(f"remove  {name}" + (f" and branch {branch}" if branch else ""))
        removed += 1
        if args.dry_run:
            continue
        ok, out = git(root, "worktree", "remove", str(wt["path"]))
        if not ok:
            print(f"        failed: {out}")
            continue
        if branch:
            git(root, "branch", "-D", branch)        # safe: its tip is in a --into ref (checked above)
    if not args.dry_run:
        git(root, "worktree", "prune")
    in_use = {wt["branch"] for wt in worktrees(root)}
    for branch in git(root, "branch", "--list", "worktree-agent-*", "--format=%(refname:short)")[1].split():
        if branch not in in_use and any(git(root, "merge-base", "--is-ancestor", branch, ref)[0] for ref in targets):
            print(f"remove  branch {branch}")
            if not args.dry_run:
                git(root, "branch", "-D", branch)
    print(f"clean-worktrees: {removed} removed, {kept} kept" + (" (dry run)" if args.dry_run else ""))


if __name__ == "__main__":
    main()
