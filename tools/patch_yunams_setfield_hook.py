#!/usr/bin/env python3
"""Disable the unsafe CStage::OnSetField diagnostic wrapper in yunams.dll.

The wrapper calls the original method through the MinHook trampoline stored at
VA 0x1006F8FC, but its post-call diagnostic-scope destruction corrupts memory.
Replace the wrapper entry with an indirect tail jump to that trampoline.
"""

from __future__ import annotations

import argparse
import hashlib
import shutil
import struct
from pathlib import Path


IMAGE_BASE = 0x10000000
HOOK_RVA = 0x126C0
TRAMPOLINE_POINTER_VA = 0x1006F8FC
EXPECTED_PREFIX = bytes.fromhex("55 8B EC 6A FF 68")
PATCH = b"\xFF\x25" + struct.pack("<I", TRAMPOLINE_POINTER_VA)


def rva_to_offset(data: bytes, rva: int) -> int:
    pe_offset = struct.unpack_from("<I", data, 0x3C)[0]
    section_count = struct.unpack_from("<H", data, pe_offset + 6)[0]
    optional_size = struct.unpack_from("<H", data, pe_offset + 20)[0]
    section_table = pe_offset + 24 + optional_size
    for index in range(section_count):
        entry = section_table + index * 40
        virtual_size, virtual_address, raw_size, raw_offset = struct.unpack_from(
            "<IIII", data, entry + 8
        )
        if virtual_address <= rva < virtual_address + max(virtual_size, raw_size):
            return raw_offset + (rva - virtual_address)
    raise ValueError(f"RVA 0x{rva:X} is outside all PE sections")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("dll", type=Path, help="Path to yunams.dll")
    args = parser.parse_args()

    dll = args.dll.resolve()
    original = dll.read_bytes()
    offset = rva_to_offset(original, HOOK_RVA)
    current = original[offset : offset + len(PATCH)]

    if current == PATCH:
        print(f"Already patched: {dll}")
        return
    if current != EXPECTED_PREFIX:
        raise SystemExit(
            f"Refusing unknown build: bytes at RVA 0x{HOOK_RVA:X} are "
            f"{current.hex(' ')}, expected {EXPECTED_PREFIX.hex(' ')}"
        )

    backup = dll.with_suffix(dll.suffix + ".before-setfield-fix")
    if not backup.exists():
        shutil.copy2(dll, backup)

    patched = bytearray(original)
    patched[offset : offset + len(PATCH)] = PATCH
    dll.write_bytes(patched)
    print(f"Patched: {dll}")
    print(f"Backup:  {backup}")
    print(f"SHA256:  {hashlib.sha256(patched).hexdigest()}")


if __name__ == "__main__":
    main()
