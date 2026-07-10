"""
Append-only memory log for BMad runs.

Usage:
  uv run {project-root}/_bmad/scripts/memlog.py init --workspace <dir> --field <key=value>
  uv run ... memlog.py append --workspace <dir> --type <decision|change|override|assumption|event> --text "<one-line>"
  uv run ... memlog.py read  --workspace <dir>

The memlog lives at <workspace>/.memlog.md.
"""
from __future__ import annotations

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

TYPES = {"decision", "change", "override", "assumption", "event"}


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def init(workspace: Path, field: str | None = None) -> None:
    workspace.mkdir(parents=True, exist_ok=True)
    memlog = workspace / ".memlog.md"
    if not memlog.exists():
        lines = [
            "# BMad Memory Log",
            "",
            f"Workspace: `{workspace}`",
            f"Initialized: {_now_iso()}",
            "",
            "---",
            "",
        ]
        if field:
            lines.insert(4, f"Topic: {field}\n")
        memlog.write_text("".join(lines), encoding="utf-8")


def append(workspace: Path, type: str, text: str) -> None:
    if type not in TYPES:
        print(f"ERROR: type must be one of {sorted(TYPES)}", file=sys.stderr)
        sys.exit(1)
    memlog = workspace / ".memlog.md"
    if not memlog.exists():
        init(workspace)
    entry = f"- [{_now_iso()}] **{type}**: {text}\n"
    with open(memlog, "a", encoding="utf-8") as f:
        f.write(entry)


def read(workspace: Path) -> None:
    memlog = workspace / ".memlog.md"
    if not memlog.exists():
        print(f"(empty — run `init` first)", file=sys.stderr)
        sys.exit(1)
    print(memlog.read_text(encoding="utf-8"))


def main() -> None:
    parser = argparse.ArgumentParser(description="BMad memlog")
    sub = parser.add_subparsers(dest="command")

    p_init = sub.add_parser("init")
    p_init.add_argument("--workspace", required=True)
    p_init.add_argument("--field", default=None)

    p_append = sub.add_parser("append")
    p_append.add_argument("--workspace", required=True)
    p_append.add_argument("--type", required=True, choices=sorted(TYPES))
    p_append.add_argument("--text", required=True)

    p_read = sub.add_parser("read")
    p_read.add_argument("--workspace", required=True)

    args = parser.parse_args()
    ws = Path(args.workspace).resolve()

    if args.command == "init":
        init(ws, args.field)
    elif args.command == "append":
        append(ws, args.type, args.text)
    elif args.command == "read":
        read(ws)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
