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


def fix_hook_relocation(data: bytearray) -> None:
    """Move the original PUSH operand relocation to the new JMP operand.

    Without this HIGHLOW relocation the jump reads the preferred image base,
    not the actual DLL base chosen by the Windows loader (ASLR).
    """
    pe_offset = struct.unpack_from("<I", data, 0x3C)[0]
    optional = pe_offset + 24
    if struct.unpack_from("<H", data, optional)[0] != 0x10B:
        raise ValueError("Expected a PE32 DLL")
    reloc_rva, reloc_size = struct.unpack_from("<II", data, optional + 96 + 5 * 8)
    cursor = rva_to_offset(data, reloc_rva)
    end = cursor + reloc_size
    found = False
    while cursor < end:
        page, size = struct.unpack_from("<II", data, cursor)
        if size < 8 or size % 2 or cursor + size > end:
            raise ValueError("Invalid relocation block")
        for offset in range(cursor + 8, cursor + size, 2):
            entry = struct.unpack_from("<H", data, offset)[0]
            target = page + (entry & 0xFFF)
            if entry >> 12 == 3 and target in (HOOK_RVA + 6, HOOK_RVA + 2):
                struct.pack_into("<H", data, offset, 0x3000 | ((HOOK_RVA + 2) - page))
                found = True
        cursor += size
    if not found:
        raise ValueError("Missing hook operand relocation; refusing unknown build")


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

    if current not in (PATCH, EXPECTED_PREFIX):
        raise SystemExit(
            f"Refusing unknown build: bytes at RVA 0x{HOOK_RVA:X} are "
            f"{current.hex(' ')}, expected {EXPECTED_PREFIX.hex(' ')}"
        )

    patched = bytearray(original)
    patched[offset : offset + len(PATCH)] = PATCH
    fix_hook_relocation(patched)
    if patched == original:
        print(f"Already patched with ASLR relocation: {dll}")
        return

    backup = dll.with_suffix(dll.suffix + ".before-setfield-aslr-fix")
    if not backup.exists():
        shutil.copy2(dll, backup)

    dll.write_bytes(patched)
    print(f"Patched: {dll}")
    print(f"Backup:  {backup}")
    print(f"SHA256:  {hashlib.sha256(patched).hexdigest()}")


if __name__ == "__main__":
    main()
