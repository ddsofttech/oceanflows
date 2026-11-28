#!/usr/bin/env python3
"""Deterministic checks for the SDLC process documents in a project.

Usage (from the project root):
  python .cursor/sdlc/scripts/sdlc-check.py                      # every check, every request
  python .cursor/sdlc/scripts/sdlc-check.py --request <name>     # one request's folder
  python .cursor/sdlc/scripts/sdlc-check.py --request <name> --gate G6 --release <release point>
  python .cursor/sdlc/scripts/sdlc-check.py --request <name> --gate G5 --pr 123
  python .cursor/sdlc/scripts/sdlc-check.py --request <name> --part BE-1 --base origin/main   # change size

Exit code 0 when every check passes, 1 when any fails, 2 on a usage error.
Standard library only. Reads the column names of the package templates; keep them stable.
"""
import argparse
import re
import subprocess
import sys
from datetime import date, timedelta
from pathlib import Path

PKG = Path(__file__).resolve().parents[1]          # .cursor/sdlc
GATES = {"G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "GC"}
DECISIONS = {"approve", "approve with known issues", "revise", "reject", "new request", "answer", "routing"}
PART_STATUS = ["planned", "in progress", "in review", "merged", "checked"]
RP_STATUS = ["building", "verifying", "signed off", "released"]
REVIEW_CLASSES = ("routine", "important", "sensitive")  # playbook section 5
DEFECT_DONE = {"closed"}
NONE = {"", "-", "—", "n/a", "none"}
BUDGET_TOLERANCE = 0.10                              # playbook section 8, document budgets
BUDGET = re.compile(r"<!--\s*budget:([^>]*)-->")
COMMENT_LINE = re.compile(r"^\s*<!--.*-->\s*$")
# Folders whose files take a template other than their own name (playbook section 8).
FOLDER_TEMPLATES = {"features": "FEATURE-SPEC", "change-requests": "CHANGE-REQUEST", "parts": "PART-PLAN",
                    "reports": "TEST-REPORT", "security": "SECURITY-REVIEW", "defects": "DEFECT"}
UNBUDGETED = {"sources", "decisions", "baselines"}   # verbatim or immutable
TEST_OR_GENERATED = re.compile(
    r"(^|/)(tests?|__tests__|spec|specs|fixtures|generated|__snapshots__)/|"
    r"(\.|_)(test|spec)\.[^/]+$|^test_[^/]+$|(^|/)test_[^/]+$|"
    r"(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|poetry\.lock|Cargo\.lock|go\.sum)$|\.min\.(js|css)$|\.snap$|"
    r"^docs/"
)


class Report:
    def __init__(self):
        self.failed, self.passed, self.skipped = [], 0, []

    def check(self, ok, check_id, where, message):
        if ok:
            self.passed += 1
        else:
            self.failed.append(f"FAIL [{check_id}] {where}: {message}")
        return ok

    def fail(self, check_id, where, message):
        return self.check(False, check_id, where, message)

    def skip(self, check_id, where, message):
        self.skipped.append(f"SKIP [{check_id}] {where}: {message}")


# ---------- Markdown helpers ----------

def read(path):
    return path.read_text(encoding="utf-8") if path.is_file() else None


def section(text, heading, level=2):
    """Body of the first heading at `level` whose title starts with `heading`, up to the next heading at that level or higher."""
    lines, out, inside = text.splitlines(), [], False
    for line in lines:
        m = re.match(r"^(#{1,6})\s+(.*)$", line)
        if m and len(m.group(1)) <= level:
            if inside:
                break
            inside = len(m.group(1)) == level and m.group(2).strip().lower().startswith(heading.lower())
            continue
        if inside:
            out.append(line)
    return "\n".join(out) if inside or out else None


def sections(text, prefix, level=2):
    """{title remainder: body} for every heading at `level` starting with `prefix`."""
    found, current, body = {}, None, []
    for line in text.splitlines():
        m = re.match(r"^(#{1,6})\s+(.*)$", line)
        if m and len(m.group(1)) <= level:
            if current is not None:
                found[current] = "\n".join(body)
            title = m.group(2).strip()
            current = title[len(prefix):].strip() if len(m.group(1)) == level and title.lower().startswith(prefix.lower()) else None
            body = []
        elif current is not None:
            body.append(line)
    if current is not None:
        found[current] = "\n".join(body)
    return found


def cells(line):
    line = line.strip()
    if line.startswith("|"):
        line = line[1:]
    if line.endswith("|"):
        line = line[:-1]
    return [c.strip() for c in re.split(r"(?<!\\)\|", line)]


def tables(text):
    """Every pipe table in `text` as (header list, list of row dicts keyed by lower-case header)."""
    result, block = [], []
    for line in (text or "").splitlines() + [""]:
        if line.strip().startswith("|"):
            block.append(line)
            continue
        if len(block) >= 2 and re.match(r"^\|?\s*:?-{3,}", block[1].strip()):
            header = cells(block[0])
            keys = [h.lower() for h in header]
            rows = [dict(zip(keys, cells(r) + [""] * len(keys))) for r in block[2:]]
            result.append((header, rows))
        block = []
    return result


def table_with(text, *columns):
    """The first table whose header has a column starting with each of `columns`; rows keyed by those column names."""
    for header, rows in tables(text):
        keys = [h.lower() for h in header]
        picked = {}
        for col in columns:
            match = next((k for k in keys if k.startswith(col.lower())), None)
            if match is None:
                break
            picked[col] = match
        else:
            return [{col: row.get(key, "").strip() for col, key in picked.items()} for row in rows
                    if any(v.strip() for v in row.values())]
    return None


def field(text, name):
    m = re.search(rf"^[ \t]*-[ \t]*{re.escape(name)}[^:\n]*:[ \t]*(.*)$", text or "", re.M | re.I)
    return m.group(1).strip().strip("`").strip() if m else None


def headings(text, level=2):
    return [m.group(1).strip() for m in re.finditer(rf"^{'#' * level}\s+(.+?)\s*$", text, re.M)]


def ids_in(value):
    return [v for v in re.split(r"[,\s;]+", value or "") if v and v.lower() not in NONE]


def pr_number(value):
    m = re.search(r"(?:#|/pull/|/merge_requests/|\bPR\s*)(\d+)", value or "", re.I) or re.fullmatch(r"\s*(\d+)\s*", value or "")
    return m.group(1) if m else None


# ---------- git ----------

def git(root, *args):
    try:
        r = subprocess.run(["git", "-C", str(root), *args], capture_output=True, text=True, timeout=60)
    except (OSError, subprocess.TimeoutExpired):
        return None
    return r.stdout if r.returncode == 0 else None


# ---------- PRD and baselines ----------

def prd_status(text):
    control = section(text, "Document control") or ""
    status = (field(control, "Status") or "").split("|")[0].strip()
    m = re.search(r"\d+\.\d+", field(control, "Version") or "")
    return status, m.group() if m else ""


def titled_tables(text, word, *columns):
    """Rows of the first table with `columns` in every level-2 section whose title contains `word`."""
    found = []
    for title in headings(text or ""):
        if word.lower() in title.lower():
            found += table_with(section(text, title) or "", *columns) or []
    return found


def proposed_rows(text):
    """Requirement IDs still Proposed: every 'requirements' section of the PRD or a feature spec (playbook section 7)."""
    return [r["ID"] for r in titled_tables(text, "requirements", "ID", "Status") if r["Status"].lower() == "proposed"]


def open_questions(text):
    """Blocking or Important rows in the 'Open questions' section."""
    return [r["ID"] for r in titled_tables(text, "open questions", "ID", "Severity")
            if r["Severity"].lower().startswith(("blocking", "important"))]


def feature_specs(folder):
    return sorted(folder.glob("*.md")) if folder.is_dir() else []


def check_template(path, template, check_id, rel, rep):
    want, have = headings(read(PKG / "templates" / template)), headings(read(path))
    rep.check(have == want, check_id, rel,
              f"headings differ from the {template} template; missing {[h for h in want if h not in have]}, extra {[h for h in have if h not in want]}")


def check_prd(root, rep):
    prd_path = root / "docs" / "PRD.md"
    prd = read(prd_path)
    if prd is None:
        rep.skip("prd-template", "docs/PRD.md", "no living PRD yet")
        return
    check_template(prd_path, "PRD.md", "prd-template", "docs/PRD.md", rep)
    specs = feature_specs(root / "docs" / "features")
    for spec in specs:
        check_template(spec, "FEATURE-SPEC.md", "prd-template", spec.relative_to(root).as_posix(), rep)
    status, version = prd_status(prd)
    if status.lower() != "approved":
        return
    rep.check(version.endswith(".0"), "prd-approved", "docs/PRD.md", f"approved PRD has draft version {version}")
    base = root / "docs" / "baselines" / "prds" / f"PRD-v{version}"
    if not base.is_dir() and not specs and Path(f"{base}.md").is_file():
        base_files = {prd_path: Path(f"{base}.md")}         # a single-file baseline from before feature specs
    else:
        base_files = {prd_path: base / "PRD.md", **{s: base / "features" / s.name for s in specs}}
        extra = [p.name for p in feature_specs(base / "features") if not (root / "docs" / "features" / p.name).is_file()]
        rep.check(not extra, "prd-approved", "docs/features", f"approved v{version} has specs missing here: {', '.join(extra)}")
    for living, copy in base_files.items():
        rep.check(copy.is_file() and copy.read_bytes() == living.read_bytes(), "prd-approved", living.relative_to(root).as_posix(),
                  f"approved, but not identical to {copy.relative_to(root).as_posix()}")


def baseline_versions(root):
    """[(version, PRD file, every file of that baseline)]: a folder PRD-vX.0/ or, from before feature specs, a file PRD-vX.0.md."""
    folder = root / "docs" / "baselines" / "prds"
    found = []
    for path in sorted(folder.glob("PRD-v*")) if folder.is_dir() else []:
        if path.is_dir():
            found.append((path.name.split("-v", 1)[1], path / "PRD.md", sorted(p for p in path.rglob("*") if p.is_file())))
        elif path.suffix == ".md":
            found.append((path.stem.split("-v", 1)[1], path, [path]))
    return found


def check_baselines(root, rep):
    in_git = git(root, "rev-parse", "--is-inside-work-tree") is not None
    for file_version, prd_file, files in baseline_versions(root):
        rel = prd_file.relative_to(root).as_posix()
        status, version = prd_status(read(prd_file) or "")
        rep.check(status.lower() == "approved", "baseline-approved", rel, f"document control status is '{status}', not Approved")
        rep.check(version == file_version, "baseline-approved", rel, f"version {version} does not match the baseline name v{file_version}")
        for path in files:
            path_rel = path.relative_to(root).as_posix()
            bad = proposed_rows(read(path) or "")
            rep.check(not bad, "baseline-approved", path_rel, f"requirements still Proposed: {', '.join(bad)}")
            if not in_git:
                rep.skip("baseline-immutable", path_rel, "not a git repository")
                continue
            commits = [c for c in (git(root, "log", "--format=%H", "--", path_rel) or "").split() if c]
            rep.check(len(commits) <= 1, "baseline-immutable", path_rel, f"changed after it was created ({len(commits)} commits touch it)")
            state = (git(root, "status", "--porcelain", "--", path_rel) or "")[:2]
            rep.check(state.strip() in ("", "??", "A"), "baseline-immutable", path_rel, "has uncommitted changes")


# ---------- document budgets ----------

def budgets():
    """{template name without .md: {'lines': n, 'chars': n}} from the budget comment in each template."""
    found = {}
    for path in sorted((PKG / "templates").glob("*.md")):
        m = BUDGET.search(read(path) or "")
        if m:
            found[path.stem] = {k: int(v) for k, v in re.findall(r"(lines|chars)\s*=\s*(\d+)", m.group(1))}
    return found


def budget_for(path, table):
    folder = FOLDER_TEMPLATES.get(path.parent.name)
    name = folder or path.stem.upper().replace("_", "-")
    return name if name in table else None


def check_budget(path, rel, limits, template, rep):
    lines = [l for l in (read(path) or "").splitlines() if l.strip() and not COMMENT_LINE.match(l)]
    over = 1 + BUDGET_TOLERANCE
    if "lines" in limits:
        rep.check(len(lines) <= limits["lines"] * over, "doc-budget", rel,
                  f"{len(lines)} lines, more than 10% over the {template} budget of {limits['lines']}: "
                  "split it, or cut what repeats other documents")
    if "chars" in limits:
        long = [l for l in lines if len(l) > limits["chars"] * over]
        rep.check(not long, "doc-budget", rel,
                  f"{len(long)} line(s) more than 10% over the {template} budget of {limits['chars']} characters, "
                  f"the longest {max((len(l) for l in long), default=0)}: shorten them")


def check_budgets(root, request_dirs, rep):
    table, docs = budgets(), root / "docs"
    paths = sorted(docs.glob("*.md")) + feature_specs(docs / "features")
    for req in request_dirs:
        paths += sorted(p for p in req.rglob("*.md") if not UNBUDGETED & set(p.relative_to(req).parts[:-1]))
    for path in paths:
        template = budget_for(path, table)
        if template:
            check_budget(path, path.relative_to(root).as_posix(), table[template], f"{template}.md", rep)


# ---------- decision logs ----------

def load_log(path, root, rep):
    text = read(path)
    rel = path.relative_to(root).as_posix()
    rows = table_with(text or "", "ID", "Date", "Gate", "Decision", "Subject", "By")
    if rows is None:
        rep.fail("decision-log", rel, "not in the DECISION-LOG template shape (needs Date, Gate, Decision, Subject, By columns)")
        return []
    for row in rows:
        gate, decision = row["Gate"].upper(), row["Decision"].lower()
        rep.check(gate in GATES or gate.lower() in NONE, "decision-log", rel, f"row {row['ID']}: unknown gate '{row['Gate']}'")
        rep.check(decision in DECISIONS, "decision-log", rel, f"row {row['ID']}: unknown decision '{row['Decision']}'")
    check_dates(rows, rel, rep)
    return rows


def check_dates(rows, rel, rep):
    """Rows are oldest first (template) and no row is dated after tomorrow (time zones)."""
    latest = (date.today() + timedelta(days=1)).isoformat()
    prev = ""
    for row in rows:
        day = row.get("Date", "")
        if not rep.check(bool(re.fullmatch(r"\d{4}-\d{2}-\d{2}", day)), "decision-log", rel, f"row {row['ID']}: date '{day}' is not YYYY-MM-DD"):
            continue
        rep.check(day <= latest, "decision-log", rel, f"row {row['ID']}: date {day} is in the future")
        rep.check(day >= prev, "decision-log", rel, f"row {row['ID']}: date {day} is earlier than the row before it")
        prev = max(prev, day)


def check_package(root, rep):
    """The package is committed on the default branch (playbook section 8)."""
    top = git(root, "rev-parse", "--show-toplevel")
    if top is None or Path(top.strip()).resolve() != root.resolve():
        return
    head = (git(root, "symbolic-ref", "--short", "refs/remotes/origin/HEAD") or "").strip()
    default = head or next((b for b in ("main", "master") if git(root, "rev-parse", "--verify", "--quiet", b) is not None), "")
    if not default:
        rep.skip("package", "default branch", "no origin/HEAD, main, or master")
        return
    rep.check(git(root, "cat-file", "-e", f"{default}:{PKG.parent.name}/sdlc/AGENT-RULES.md") is not None, "package", default,
              f"the SDLC package ({PKG.parent.name}/) is not committed on the default branch: commit it before starting a request")


def approved(rows, gate, subject_pattern):
    return [r for r in rows if r["Gate"].upper() == gate and r["Decision"].lower().startswith("approve")
            and re.search(subject_pattern, r["Subject"], re.I)]


def check_baseline_approvals(root, all_rows, rep):
    for version, prd_file, _ in baseline_versions(root):
        pattern = rf"\bv?{re.escape(version)}\b"
        ok = approved(all_rows, "G1", pattern) or approved(all_rows, "GC", pattern)
        rep.check(bool(ok), "gate-logged", prd_file.relative_to(root).as_posix(),
                  f"no G1 or GC Approve row for v{version} in any DECISION-LOG.md")


# ---------- delivery ----------

def load_board(req, rep):
    text = read(req / "delivery" / "BOARD.md")
    if text is None:
        return None
    where = f"{req.name}/delivery/BOARD.md"
    parts = table_with(section(text, "Slice parts") or "", "Part ID", "Depends on", "Status", "PR", "Release point", "Review class")
    points = table_with(section(text, "Release points") or "", "Release point", "Slice parts", "Status")
    if parts is None or points is None:
        rep.fail("board", where, "not in the BOARD template shape")
        return None
    meta = section(text, "Metadata") or ""
    handoffs = table_with(section(text, "Open handoffs") or "", "ID", "Status") or []
    released = {p["Release point"] for p in points if status_index(p["Status"], RP_STATUS) >= 3}
    return {"profile": (field(meta, "Profile") or "").lower(), "defect": (field(meta, "Route") or "").lower().startswith("defect"),
            "parts": parts, "points": points, "handoffs": handoffs, "released": released,
            "closed_parts": {pid for p in points if p["Release point"] in released for pid in ids_in(p["Slice parts"])},
            "where": where}


def status_index(value, order):
    v = value.lower()
    return next((i for i, s in enumerate(order) if v.startswith(s)), -1)


def check_board(board, rep):
    where, parts = board["where"], {p["Part ID"]: p for p in board["parts"]}
    point_names = {p["Release point"] for p in board["points"]}
    for pid, part in parts.items():
        st = status_index(part["Status"], PART_STATUS)
        rep.check(st >= 0, "board", where, f"{pid}: unknown status '{part['Status']}'")
        rep.check(part["Release point"] in point_names, "board", where, f"{pid}: release point '{part['Release point']}' is not in the release points table")
        rep.check(review_class(part) is not None, "board", where, f"{pid}: review class '{part['Review class']}' is not Routine, Important, or Sensitive")
        for dep in ids_in(part["Depends on"]):
            if dep in board["closed_parts"] and dep not in parts:
                continue                                     # released, its row removed (playbook section 17)
            if not rep.check(dep in parts, "board", where, f"{pid}: depends on unknown part {dep}"):
                continue
            if st > 0:
                rep.check(status_index(parts[dep]["Status"], PART_STATUS) >= 3, "board", where,
                          f"{pid} started while its dependency {dep} is '{parts[dep]['Status']}', not merged")
        if st >= 3:
            rep.check(pr_number(part["PR"]) is not None, "board", where, f"{pid} is {part['Status']} but has no PR")
    if board["defect"]:
        rep.check(len(board["points"]) <= 1, "board", where,
                  f"defect request with {len(board['points'])} release points, over 1 (playbook section 17)")
    for point in board["points"]:
        rep.check(status_index(point["Status"], RP_STATUS) >= 0, "board", where,
                  f"release point {point['Release point']}: unknown status '{point['Status']}'")
        closed = point["Release point"] in board["released"]
        for pid in ids_in(point["Slice parts"]):
            if closed:
                rep.check(pid not in parts, "board", where,
                          f"release point {point['Release point']} is released: remove {pid}'s row (playbook section 17)")
            else:
                rep.check(pid in parts, "board", where, f"release point {point['Release point']} lists unknown part {pid}")
    for h in board["handoffs"]:
        rep.check(not h["Status"].lower().startswith("closed"), "board", where,
                  f"handoff {h['ID']} is closed: remove its row (playbook section 17)")


def check_board_current(req, board, rep):
    """The board holds every planned part and every PR a security review names (playbook section 17)."""
    where, parts = board["where"], {p["Part ID"]: p for p in board["parts"]}
    if not board["defect"]:
        plan = read(req / "design" / "IMPLEMENTATION-PLAN.md") or ""
        rows = table_with(plan, "Part ID", "Owner", "Depends on", "Release point", "Size", "Review class") or []
        closed = board["closed_parts"] | {p["Part ID"] for p in rows if p["Release point"] in board["released"]}
        planned = [p["Part ID"] for p in rows]
        folder = req / "design" / "parts"
        planned += [f.stem for f in sorted(folder.glob("*.md"))] if folder.is_dir() else []
        for pid in dict.fromkeys(p for p in planned if p not in closed):
            rep.check(pid in parts, "board", where, f"{pid} is planned (implementation plan or part plan) but has no board row")
    folder = req / "testing" / "security"
    for path in sorted(folder.glob("PR-*.md")) if folder.is_dir() else []:
        num = pr_number(path.stem.split("-", 1)[1])
        ids = [i.strip("`.()") for i in ids_in(field(read(path), "Slice part"))]
        pid = ids[0] if ids else ""
        if num is None or pid not in parts:
            continue
        part = parts[pid]
        rep.check(pr_number(part["PR"]) == num and status_index(part["Status"], PART_STATUS) >= 2, "board", where,
                  f"{path.name} reviews {pid}, but its board row reads PR '{part['PR']}', status '{part['Status']}'")


def review_class(part):
    v = part["Review class"].lower()
    return next((c for c in REVIEW_CLASSES if v.startswith(c)), None)


def security_reviews(req):
    """{PR number: sensitive?} from testing/security/PR-<n>.md."""
    found = {}
    folder = req / "testing" / "security"
    for path in sorted(folder.glob("PR-*.md")) if folder.is_dir() else []:
        num = pr_number(path.stem.split("-", 1)[1])
        if num:
            found[num] = (field(read(path), "Sensitive") or "").lower().startswith("yes")
    return found


def check_merges(req, board, rows, rep):
    reviews = security_reviews(req)
    for part in board["parts"]:
        if status_index(part["Status"], PART_STATUS) < 3:
            continue
        num = pr_number(part["PR"])
        if num is None:
            continue
        where = f"{req.name}: {part['Part ID']} (PR #{num})"
        sensitive = review_class(part) == "sensitive" or reviews.get(num, False)
        if sensitive and not rep.check(num in reviews, "security-reviewed", where, f"sensitive PR merged without testing/security/PR-{num}.md"):
            continue
        if sensitive or board["profile"].startswith("full"):
            why = "sensitive PR" if sensitive else "Full profile"
            rep.check(bool(approved(rows, "G5", rf"(#|PR\s*){num}\b")), "gate-logged", where,
                      f"{why} merged without a G5 Approve row in DECISION-LOG.md")


def open_defects(req, point):
    """Open Blocking defects in testing/reports/<point>.md; None without a report."""
    report = read(req / "testing" / "reports" / f"{point}.md")
    if report is None:
        return None
    rows = table_with(section(report, "Defects") or "", "Defect ID", "Severity", "Status") or []
    return [r for r in rows if r["Severity"].lower().startswith("blocking") and r["Status"].lower() not in DEFECT_DONE]


def open_gaps(req):
    """Blocking or Important §2 gaps and risks in analysis/finding-notes.md still Open."""
    text = read(req / "analysis" / "finding-notes.md")
    rows = table_with(section(text or "", "2.") or "", "ID", "Severity", "Status") or []
    return [r["ID"] for r in rows if r["Severity"].lower().startswith(("blocking", "important"))
            and r["Status"].lower().startswith("open")]


def check_release_points(req, board, rows, rep, open_rows):
    for point in board["points"]:
        name, st = point["Release point"], status_index(point["Status"], RP_STATUS)
        where = f"{req.name}: release point {name}"
        pattern = rf"\b{re.escape(name)}\b"
        if st >= 2:
            rep.check(bool(approved(rows, "G6", pattern)), "gate-logged", where, f"'{point['Status']}' without a G6 Approve row")
            blockers = open_defects(req, name) or []
            rep.check(not blockers, "no-open-blockers", where,
                      f"signed off with open or accepted Blocking defects: {', '.join(b['Defect ID'] for b in blockers)}")
        if st >= 3:
            go = approved(rows, "G7", pattern)
            rep.check(bool(go), "gate-logged", where, "released without a G7 Approve (Go) row")
            rep.check(not approved(open_rows, "G7", pattern) and (req / "decisions" / f"{name}.md").is_file(), "decision-log", where,
                      f"released: move DECISION-LOG.md rows up to its G7 Go into decisions/{name}.md (playbook section 17)")
            if go and board["profile"].startswith("full"):
                names = {n.strip().lower() for r in go for n in re.split(r",| and |&", r["By"]) if n.strip()}
                rep.check(len(names) >= 2, "dual-control", where, "Full profile: G7 needs two named approvers in the By column")


# ---------- gate pre-checks ----------

def git_ref(root, *refs):
    return next((r for r in refs if git(root, "rev-parse", "--verify", "--quiet", r + "^{commit}") is not None), None)


def check_merged_into_request(root, req, board, rows, rep):
    """The UX branch G3 accepted and every merged part are on the request branch (playbook section 8, Branches)."""
    if git(root, "rev-parse", "--is-inside-work-tree") is None:
        return
    name = req.name
    branch = git_ref(root, f"origin/release/{name}", f"release/{name}")
    merged = [p for p in (board or {}).get("parts", []) if status_index(p["Status"], PART_STATUS) >= 3]
    ux = git_ref(root, f"origin/ux/{name}", f"ux/{name}")
    if branch is None:
        if merged or (ux and approved(rows, "G3", r".")):
            rep.skip("merged", name, f"no request branch release/{name}")
        return
    if ux and approved(rows, "G3", r"."):
        rep.check(git(root, "merge-base", "--is-ancestor", ux, branch) is not None, "merged", name,
                  f"{ux} was accepted at G3 but is not merged into {branch}")
    for part in merged:
        num = pr_number(part["PR"]) or ""
        sha = next((t for t in re.findall(r"\b[0-9a-f]{7,40}\b", part["PR"]) if t != num), None)
        where = f"{name}: {part['Part ID']}"
        if not rep.check(sha is not None, "merged", where, f"{part['Status']} but the board's PR cell has no merge commit"):
            continue
        rep.check(git(root, "merge-base", "--is-ancestor", sha, branch) is not None, "merged", where,
                  f"merge commit {sha} is not on {branch}")


def gate_checks(root, req, args, board, rows, rep):
    gate = args.gate
    if gate == "G1":
        prd = read(root / "docs" / "PRD.md") or ""
        blocking = open_questions(prd) + [q for s in feature_specs(root / "docs" / "features") for q in open_questions(read(s))]
        rep.check(not blocking, "gate-ready", "G1", f"Blocking or Important open questions in the PRD or a feature spec: {', '.join(blocking)}")
        rep.check(prd_status(prd)[0].lower() == "pending approval", "gate-ready", "G1", "PRD document control is not Pending approval")
    elif gate == "G4":
        for rel in ("design/ARCHITECTURE.md", "design/IMPLEMENTATION-PLAN.md"):
            rep.check((req / rel).is_file(), "gate-ready", "G4", f"{rel} is missing")
        rep.check((root / "docs" / "SYSTEM-ARCHITECTURE.md").is_file(), "gate-ready", "G4", "docs/SYSTEM-ARCHITECTURE.md is missing")
        plan = read(req / "design" / "IMPLEMENTATION-PLAN.md") or ""
        parts = table_with(plan, "Part ID", "Owner", "Depends on", "Release point", "Size", "Review class") or []
        points = table_with(section(plan, "4.") or "", "Release point", "Slice parts") or []
        rep.check(bool(parts), "gate-ready", "G4", "the plan has no slice parts")
        rep.check(bool(points), "gate-ready", "G4", "the plan has no release points")
        ids = {p["Part ID"] for p in parts}
        for p in parts:
            rep.check(p["Size"].upper()[:1] in ("S", "M", "L"), "gate-ready", "G4", f"{p['Part ID']}: size '{p['Size']}' is not S, M, or L")
            rep.check(review_class(p) is not None, "gate-ready", "G4",
                      f"{p['Part ID']}: review class '{p['Review class']}' is not Routine, Important, or Sensitive")
            rep.check((req / "design" / "parts" / f"{p['Part ID']}.md").is_file(), "gate-ready", "G4",
                      f"design/parts/{p['Part ID']}.md is missing")
            for dep in ids_in(p["Depends on"]):
                rep.check(dep in ids, "gate-ready", "G4", f"{p['Part ID']} depends on unknown part {dep}")
    elif gate == "G5":
        if not args.pr:
            sys.exit("--gate G5 needs --pr")
        part = next((p for p in (board or {}).get("parts", []) if pr_number(p["PR"]) == args.pr), None)
        if not rep.check(part is not None, "gate-ready", "G5", f"PR #{args.pr} is not on the delivery board"):
            return
        if review_class(part) == "sensitive":
            rep.check(args.pr in security_reviews(req), "gate-ready", "G5", f"sensitive PR without testing/security/PR-{args.pr}.md")
    elif gate in ("G6", "G7"):
        if not args.release or board is None:
            sys.exit(f"--gate {gate} needs --release and a delivery board")
        point = next((p for p in board["points"] if p["Release point"] == args.release), None)
        if not rep.check(point is not None, "gate-ready", gate, f"release point {args.release} is not on the board"):
            return
        if gate == "G6":
            for pid in ids_in(point["Slice parts"]):
                part = next((p for p in board["parts"] if p["Part ID"] == pid), None)
                rep.check(part is not None and status_index(part["Status"], PART_STATUS) >= 4, "gate-ready", "G6",
                          f"{pid} is not checked yet")
            blockers = open_defects(req, args.release)
            rep.check(blockers is not None, "gate-ready", "G6", f"no testing/reports/{args.release}.md")
            rep.check(not blockers, "gate-ready", "G6", f"open Blocking defects: {', '.join(b['Defect ID'] for b in blockers or [])}")
            gaps = open_gaps(req)
            rep.check(not gaps, "gate-ready", "G6",
                      f"Blocking or Important gaps and risks still Open in analysis/finding-notes.md: {', '.join(gaps)}")
        else:
            body = sections(read(req / "release" / "RELEASE-PLAN.md") or "", "Release point").get(args.release)
            if not rep.check(body is not None, "gate-ready", "G7", f"release/RELEASE-PLAN.md has no section for {args.release}"):
                return
            rep.check(field(body, "Rollback criteria") not in (None, ""), "gate-ready", "G7", "rollback criteria are empty")
            checks = table_with(section(body, "Staging checklist", level=3) or "", "Check", "Result") or []
            rep.check(bool(checks), "gate-ready", "G7", "the staging checklist is empty")
            rep.check(all(c["Result"].lower().startswith(("pass", "green", "ok")) for c in checks), "gate-ready", "G7",
                      "staging checklist has a result that is not a pass")
            rep.check(bool(approved(rows, "G6", rf"\b{re.escape(args.release)}\b")), "gate-ready", "G7", "no G6 Approve row for this release point")
    elif gate == "G8":
        review = read(req / "release" / "POST-RELEASE-REVIEW.md")
        rep.check(review is not None and (field(section(review, "6.") or "", "Why") or "") != "", "gate-ready", "G8",
                  "release/POST-RELEASE-REVIEW.md is missing or has no recommendation")


# ---------- change size ----------

def check_size(root, req, args, board, rep):
    if board is not None and board["defect"]:
        rep.skip("change-size", args.part, "defect request: no implementation plan; reviewers judge the size")
        return
    plan = read(req / "design" / "IMPLEMENTATION-PLAN.md") or ""
    part = next((p for p in table_with(plan, "Part ID", "Size") or [] if p["Part ID"] == args.part), None)
    if not rep.check(part is not None, "change-size", args.part, "not in the implementation plan"):
        return
    size = {"S": "small", "M": "medium", "L": "large"}.get(part["Size"].upper()[:1])
    budget_rows = table_with(read(root / "docs" / "ENGINEERING-STANDARDS.md") or "", "Slice-part size", "Up to") or []
    limit = next((r["Up to"] for r in budget_rows if size and r["Slice-part size"].lower().startswith(size)), "")
    m = re.search(r"\d+", limit.replace(",", ""))
    if not m:
        rep.skip("change-size", args.part, "no change-size budget in docs/ENGINEERING-STANDARDS.md")
        return
    numstat = git(root, "diff", "--numstat", f"{args.base}...HEAD")
    if numstat is None:
        rep.skip("change-size", args.part, f"git diff against {args.base} failed")
        return
    changed = 0
    for line in numstat.splitlines():
        added, deleted, path = (line.split("\t") + ["", "", ""])[:3]
        if added.isdigit() and deleted.isdigit() and not TEST_OR_GENERATED.search(path.replace("\\", "/")):
            changed += int(added) + int(deleted)
    budget = int(m.group())
    rep.check(changed <= 2 * budget, "change-size", args.part,
              f"{changed} changed lines, over twice the {size} budget of {budget}: split the part, or have the architect resize it in the plan")


# ---------- main ----------

def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default=None, help="project root (default: the project this script is installed in)")
    ap.add_argument("--request", help="only this request folder under docs/")
    ap.add_argument("--gate", choices=sorted(GATES), help="also check that this gate's package is ready")
    ap.add_argument("--release", help="release point, for G6 and G7")
    ap.add_argument("--pr", help="PR number, for G5")
    ap.add_argument("--part", help="slice-part ID, for the change-size check")
    ap.add_argument("--base", default="origin/main", help="base branch for the change-size check")
    args = ap.parse_args()
    root = Path(args.root).resolve() if args.root else PKG.parents[1]
    if (args.gate or args.part) and not args.request:
        ap.error("--gate and --part need --request")
    rep = Report()

    check_prd(root, rep)
    check_baselines(root, rep)
    check_package(root, rep)
    docs = root / "docs"
    request_dirs = [d for d in sorted(docs.iterdir()) if d.is_dir() and d.name not in ("baselines", "features")] if docs.is_dir() else []
    open_logs = {d.name: load_log(d / "DECISION-LOG.md", root, rep) for d in request_dirs if (d / "DECISION-LOG.md").is_file()}
    logs = {name: [r for f in sorted((docs / name / "decisions").glob("*.md")) for r in load_log(f, root, rep)] + rows
            for name, rows in open_logs.items()}
    # Baseline approvals may live with baselines when request folders are retired.
    baseline_log_rows = load_log(docs / "baselines" / "DECISION-LOG.md", root, rep) if (docs / "baselines" / "DECISION-LOG.md").is_file() else []
    check_baseline_approvals(root, [r for rows in logs.values() for r in rows] + baseline_log_rows, rep)

    if args.request and not (docs / args.request).is_dir():
        ap.error(f"docs/{args.request} does not exist")
    check_budgets(root, [d for d in request_dirs if not args.request or d.name == args.request], rep)
    for req in request_dirs:
        if args.request and req.name != args.request:
            continue
        rows = logs.get(req.name, [])
        board = load_board(req, rep)
        if board is not None:
            rep.check(board["defect"] or bool(approved(rows, "G4", r".")), "gate-logged", f"{req.name}/delivery/BOARD.md", "delivery board opened without a G4 Approve row")
            check_board(board, rep)
            check_board_current(req, board, rep)
            check_merges(req, board, rows, rep)
            check_release_points(req, board, rows, rep, open_logs.get(req.name, []))
        check_merged_into_request(root, req, board, rows, rep)
        if args.gate and req.name == args.request:
            gate_checks(root, req, args, board, rows, rep)
        if args.part and req.name == args.request:
            check_size(root, req, args, board, rep)

    for line in rep.failed + rep.skipped:
        print(line)
    print(f"sdlc-check: {len(rep.failed)} failed, {rep.passed} passed, {len(rep.skipped)} skipped")
    return 1 if rep.failed else 0


if __name__ == "__main__":
    sys.exit(main())
