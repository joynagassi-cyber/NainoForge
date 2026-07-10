"""
Resolve BMad customization: merge base/team/user TOML layers and emit JSON
for the requested key (e.g. "agent", "workflow").

Merge rules (BMad structural merge):
  - Scalars: override wins
  - Tables (dicts): deep-merge (recursive)
  - Arrays of tables keyed by `code` or `id`: replace matching items, append new entries
  - All other arrays: append
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

try:
    import tomllib
except ImportError:
    import tomli as tomllib  # type: ignore[no-redef]


def load_toml(path: Path) -> dict:
    """Load a TOML file, return empty dict if missing."""
    if not path.exists():
        return {}
    with open(path, "rb") as f:
        return tomllib.load(f)


def _scalar(v):
    return not isinstance(v, (dict, list))


def _deep_merge(base: dict, override: dict) -> dict:
    result = dict(base)
    for k, v in override.items():
        if k in result and isinstance(result[k], dict) and isinstance(v, dict):
            result[k] = _deep_merge(result[k], v)
        else:
            result[k] = v
    return result


def _list_merge(base: list, override: list, key_fields=("code", "id")) -> list:
    """Merge two lists.
    - Arrays of tables keyed by `code`/`id`: replace matching, append new
    - All other arrays: append
    """
    if not base and not override:
        return []
    # Detect whether this is an array of tables (has dicts with key_fields)
    if (base and isinstance(base[0], dict) and any(k in base[0] for k in key_fields)) or \
       (override and isinstance(override[0], dict) and any(k in override[0] for k in key_fields)):
        merged = {tuple(item.get(k) for k in key_fields): item for item in base}
        for item in override:
            key = tuple(item.get(k) for k in key_fields)
            merged[key] = item
        return list(merged.values())
    # Plain array: append (preserve order, deduplicate simple values)
    seen = set()
    result = []
    for item in base + override:
        # Only hash simple types; for complex items just append
        try:
            h = json.dumps(item, sort_keys=True, default=str)
            if h in seen:
                continue
            seen.add(h)
        except Exception:
            pass
        result.append(item)
    return result


def merge(base: dict, override: dict) -> dict:
    result = dict(base)
    for k, v in override.items():
        if k in result and isinstance(result[k], dict) and isinstance(v, dict):
            result[k] = merge(result[k], v)
        elif k in result and isinstance(result[k], list) and isinstance(v, list):
            result[k] = _list_merge(result[k], v)
        elif k in result and isinstance(result[k], list) and not isinstance(v, list):
            # Override is scalar replacing a list: keep the scalar (no append)
            result[k] = v
        else:
            result[k] = v
    return result


def resolve(skill_root: Path, project_root: Path) -> dict:
    skill_name = skill_root.name
    base_path = skill_root / "customize.toml"
    team_path = project_root / "_bmad" / "custom" / f"{skill_name}.toml"
    user_path = project_root / "_bmad" / "custom" / f"{skill_name}.user.toml"

    base = load_toml(base_path)
    team = load_toml(team_path)
    user = load_toml(user_path)

    merged = merge(base, merge(team, user))
    return merged


def main():
    parser = argparse.ArgumentParser(description="Resolve BMad customization layers")
    parser.add_argument("--skill", required=True, help="Path to skill directory")
    parser.add_argument("--key", required=True, help="Top-level key to extract (e.g. 'agent', 'workflow')")
    args = parser.parse_args()

    skill_root = Path(args.skill).resolve()
    project_root = Path.cwd()

    merged = resolve(skill_root, project_root)
    key = args.key

    if key not in merged:
        print(json.dumps({}), indent=2)
        sys.exit(0)

    print(json.dumps(merged[key], indent=2, default=str))


if __name__ == "__main__":
    main()
