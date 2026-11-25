#!/usr/bin/env python3
"""Generate the UI catalog, docs/COMPONENTS.md, from component doc blocks and design tokens.

Agents choose components and tokens from this one short file instead of reading component
source. Run it after adding or changing a component or token; CI runs it with --check.

A component is catalogued from a doc block in its source file, in any comment style:

    /**
     * @component DataTable
     * @purpose Sortable, paginated table of records
     * @props columns, rows, sort, onSort, loading
     * @states default, loading, empty, error, row-selected
     * @story src/components/DataTable.stories.tsx
     */

@component, @purpose, and @states are required; @props and @story are optional.
Design tokens are read from JSON in the W3C design-tokens format: a leaf has "$value". A tokens
file's top-level "$description" holds the product's visual identity and is copied into the catalog.

Usage (from the project root):
  python .cursor/sdlc/scripts/ui-catalog.py [--src DIR ...] [--tokens FILE ...] [--out FILE] [--check]

Exit 0 when the catalog is written (or, with --check, current); 1 on an incomplete or duplicate
doc block, or, with --check, a missing or stale catalog. Standard library only, Python 3.10+.
"""
import argparse
import json
import re
import sys
from pathlib import Path

EXTENSIONS = {".tsx", ".ts", ".jsx", ".js", ".mjs", ".vue", ".svelte", ".astro", ".html", ".mdx",
              ".dart", ".swift", ".kt", ".cs", ".razor", ".py", ".rb", ".php", ".erb"}
SKIP_DIRS = {"node_modules", ".git", "dist", "build", "out", "coverage", "vendor", ".next", ".nuxt",
             "__pycache__", ".venv", "venv", "storybook-static"}
REQUIRED = ("purpose", "states")
COMMENT = re.compile(r"^\s*(?:/\*+|\*+/?|//+|#+|<!--|\{/\*+)?\s*")
TAG = re.compile(r"^@(\w+)\s*(.*?)\s*(?:\*+/\}?|-->)?\s*$")
END_ONLY = re.compile(r"^(?:\*+/\}?|-->)?$")


def source_files(root, src_dirs):
    for d in src_dirs:
        base = (root / d).resolve()
        if base.is_file():
            yield base
            continue
        for path in sorted(base.rglob("*")):
            if path.is_file() and path.suffix in EXTENSIONS and not SKIP_DIRS.intersection(path.relative_to(base).parts):
                yield path


def doc_blocks(text):
    """Each @component block in a file, as {tag: value}."""
    block = None
    for line in text.splitlines():
        body = COMMENT.sub("", line, count=1).strip()
        m = TAG.match(body)
        if m and m.group(1) == "component":
            if block:
                yield block
            block = {"component": m.group(2)}
        elif block is not None and m:
            block[m.group(1)] = m.group(2)
        elif block is not None and not END_ONLY.match(body):
            yield block
            block = None
    if block:
        yield block


def components(root, src_dirs, errors):
    found = {}
    for path in source_files(root, src_dirs):
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        rel = path.relative_to(root).as_posix() if path.is_relative_to(root) else path.as_posix()
        for block in doc_blocks(text):
            name = block["component"]
            missing = [t for t in REQUIRED if not block.get(t)]
            if not name:
                errors.append(f"{rel}: @component without a name")
                continue
            if missing:
                errors.append(f"{rel}: {name} has no " + ", ".join(f"@{t}" for t in missing))
            if name in found:
                errors.append(f"{rel}: {name} is already catalogued from {found[name]['source']}")
                continue
            found[name] = {**block, "source": rel}
    return [found[n] for n in sorted(found, key=str.lower)]


def flatten(node, prefix=""):
    if isinstance(node, dict) and ("$value" in node or "value" in node):
        value = node.get("$value", node.get("value"))
        yield prefix, value if isinstance(value, str) else json.dumps(value, separators=(",", ":"))
        return
    if isinstance(node, dict):
        for key, child in node.items():
            if not key.startswith("$"):
                yield from flatten(child, f"{prefix}.{key}" if prefix else key)


def tokens(root, files, errors):
    rows, identity = [], []
    for f in files:
        path = root / f
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, ValueError) as e:
            errors.append(f"{f}: cannot read tokens ({e.__class__.__name__})")
            continue
        rows += list(flatten(data))
        if isinstance(data, dict) and isinstance(data.get("$description"), str) and data["$description"].strip():
            identity.append(data["$description"].strip())
    return rows, identity


def cell(value):
    return (value or "").replace("|", "\\|").strip()


def render(comps, toks, identity, src_dirs, token_files):
    lines = ["# UI catalog", "",
             "Generated by `.cursor/sdlc/scripts/ui-catalog.py` from component doc blocks"
             + (" and design tokens" if token_files else "") + ". Do not edit by hand: change the source and rerun it.", "",
             f"Sources: {', '.join(f'`{d}`' for d in src_dirs)}"
             + (f"; tokens: {', '.join(f'`{t}`' for t in token_files)}" if token_files else ""), ""]
    if identity:
        lines += ["## Visual identity", "", "\n\n".join(identity), ""]
    lines += ["## Components", ""]
    if comps:
        lines += ["| Component | Purpose | Props | States | Source | Story |", "|---|---|---|---|---|---|"]
        lines += [f"| {cell(c['component'])} | {cell(c.get('purpose'))} | {cell(c.get('props'))} | {cell(c.get('states'))} "
                  f"| `{c['source']}` | {cell(c.get('story'))} |" for c in comps]
    else:
        lines.append("None catalogued yet.")
    if token_files:
        lines += ["", "## Tokens", ""]
        if toks:
            lines += ["| Token | Value |", "|---|---|"] + [f"| `{cell(n)}` | {cell(v)} |" for n, v in toks]
        else:
            lines.append("None found.")
    return "\n".join(lines) + "\n"


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--root", default=".", help="project root (default: current directory)")
    ap.add_argument("--src", action="append", help="folder or file to scan, relative to the root; repeatable (default: src)")
    ap.add_argument("--tokens", action="append", default=[], help="design-tokens JSON file; repeatable")
    ap.add_argument("--out", default="docs/COMPONENTS.md", help="catalog path (default: docs/COMPONENTS.md)")
    ap.add_argument("--check", action="store_true", help="fail if the catalog is missing or stale; write nothing")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    src_dirs = args.src or ["src"]
    errors = [f"{d}: not found" for d in src_dirs if not (root / d).exists()]
    toks, identity = tokens(root, args.tokens, errors)
    text = render(components(root, src_dirs, errors), toks, identity, src_dirs, args.tokens)
    out = root / args.out
    if args.check:
        current = out.read_text(encoding="utf-8") if out.is_file() else None
        if current != text:
            errors.append(f"{args.out} is {'missing' if current is None else 'stale'}: rerun ui-catalog.py without --check")
    else:
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(text, encoding="utf-8", newline="\n")
        print(f"wrote {args.out}")
    for e in errors:
        print(f"FAIL {e}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
