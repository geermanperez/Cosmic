#!/usr/bin/env python3
"""Synchronize yunams.dll's EXP bar table with Cosmic's server table.

The Yuna client initializes its 64-bit EXP requirements with pairs of
``mov dword ptr [absolute address], immediate`` instructions.  Its bundled
table uses requirements roughly 1.5 times Cosmic's v83 values, so the server
levels characters while the client bar is still near 70 percent.
"""

from __future__ import annotations

import argparse
import hashlib
import re
import shutil
import struct
from pathlib import Path


TABLE_VA = 0x10070FC8
CLIENT_TABLE_LENGTH = 260
MOV_ABSOLUTE_IMMEDIATE = b"\xC7\x05"


def read_server_exp_table(path: Path) -> list[int]:
    source = path.read_text(encoding="utf-8")
    match = re.search(
        r"private\s+static\s+final\s+int\[\]\s+exp\s*=\s*\{([^}]*)}",
        source,
        re.DOTALL,
    )
    if match is None:
        raise ValueError(f"Could not find the EXP array in {path}")

    values = [int(value.strip()) for value in match.group(1).split(",")]
    if len(values) != 201 or values[:3] != [15, 15, 34]:
        raise ValueError(
            f"Unexpected server EXP table in {path}: {len(values)} entries"
        )
    if any(value < 0 or value > 0x7FFFFFFF for value in values):
        raise ValueError("The server EXP table contains a non-int32 value")
    return values


def find_table_immediates(data: bytes) -> dict[int, tuple[int, int]]:
    """Return table slot -> (low immediate offset, high immediate offset)."""
    found: dict[int, list[int | None]] = {}
    for offset in range(len(data) - 9):
        if data[offset : offset + 2] != MOV_ABSOLUTE_IMMEDIATE:
            continue
        address = struct.unpack_from("<I", data, offset + 2)[0]
        relative = address - TABLE_VA
        if relative < 0 or relative >= CLIENT_TABLE_LENGTH * 8:
            continue
        if relative % 4:
            raise ValueError(f"Unaligned EXP table write at file offset 0x{offset:X}")

        slot, half = divmod(relative, 8)
        halves = found.setdefault(slot, [None, None])
        half_index = half // 4
        if halves[half_index] is not None:
            raise ValueError(f"Duplicate initializer for EXP slot {slot}")
        halves[half_index] = offset + 6

    if set(found) != set(range(CLIENT_TABLE_LENGTH)):
        missing = sorted(set(range(CLIENT_TABLE_LENGTH)) - set(found))
        raise ValueError(f"Incomplete Yuna EXP table; missing slots: {missing}")

    result: dict[int, tuple[int, int]] = {}
    for slot, halves in found.items():
        if halves[0] is None or halves[1] is None:
            raise ValueError(f"Incomplete initializer for EXP slot {slot}")
        result[slot] = (halves[0], halves[1])
    return result


def read_client_value(data: bytes, offsets: tuple[int, int]) -> int:
    low = struct.unpack_from("<I", data, offsets[0])[0]
    high = struct.unpack_from("<I", data, offsets[1])[0]
    return low | high << 32


def synchronize_exp_table(data: bytes, server_values: list[int]) -> tuple[bytes, int]:
    if data[:2] != b"MZ":
        raise ValueError("Expected a Windows PE DLL")

    offsets = find_table_immediates(data)
    patched = bytearray(data)
    changed = 0
    for level, expected in enumerate(server_values):
        low_offset, high_offset = offsets[level]
        current = read_client_value(data, (low_offset, high_offset))
        if current == expected:
            continue
        struct.pack_into("<I", patched, low_offset, expected)
        struct.pack_into("<I", patched, high_offset, 0)
        changed += 1
    return bytes(patched), changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("dll", type=Path, help="Path to yunams.dll")
    parser.add_argument(
        "exp_table",
        type=Path,
        help="Path to the server's ExpTable.java",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Verify synchronization without changing the DLL",
    )
    args = parser.parse_args()

    dll = args.dll.resolve()
    original = dll.read_bytes()
    server_values = read_server_exp_table(args.exp_table.resolve())
    patched, changed = synchronize_exp_table(original, server_values)

    if args.check:
        if changed:
            raise SystemExit(f"EXP table mismatch: {changed} level(s) differ in {dll}")
        print(f"EXP table synchronized: {dll}")
        return

    if not changed:
        print(f"Already synchronized: {dll}")
        return

    backup = dll.with_suffix(dll.suffix + ".before-exp-table-fix")
    if not backup.exists():
        shutil.copy2(dll, backup)

    dll.write_bytes(patched)
    print(f"Patched {changed} EXP requirement(s): {dll}")
    print(f"Backup: {backup}")
    print(f"SHA256: {hashlib.sha256(patched).hexdigest()}")


if __name__ == "__main__":
    main()
