#!/usr/bin/env python3
"""Append missing direct children from one MapleStory XML image to another."""

from __future__ import annotations

import argparse
import copy
from pathlib import Path
import xml.etree.ElementTree as ET


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("target", type=Path)
    args = parser.parse_args()

    source_root = ET.parse(args.source).getroot()
    target_root = ET.parse(args.target).getroot()
    if source_root.tag != target_root.tag or source_root.attrib != target_root.attrib:
        raise SystemExit("Source and target XML roots do not match")

    existing: set[str | None] = set()
    duplicates = 0
    for child in list(target_root):
        name = child.get("name")
        if name in existing:
            target_root.remove(child)
            duplicates += 1
        else:
            existing.add(name)

    additions = []
    for child in source_root:
        name = child.get("name")
        if name not in existing:
            additions.append(copy.deepcopy(child))
            existing.add(name)

    if not additions and not duplicates:
        print("No missing children")
        return

    for child in additions:
        target_root.append(child)

    ET.indent(target_root, space="  ")
    ET.ElementTree(target_root).write(
        args.target, encoding="utf-8", xml_declaration=True, short_empty_elements=True
    )

    merged_root = ET.parse(args.target).getroot()
    names = [child.get("name") for child in merged_root]
    if len(names) != len(set(names)):
        raise SystemExit("Merge produced duplicate child names")
    print(
        f"Added {len(additions)} children, removed {duplicates} duplicate children; "
        f"target now has {len(names)}"
    )


if __name__ == "__main__":
    main()
