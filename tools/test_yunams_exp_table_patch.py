import struct
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from patch_yunams_exp_table import (
    CLIENT_TABLE_LENGTH,
    MOV_ABSOLUTE_IMMEDIATE,
    TABLE_VA,
    find_table_immediates,
    read_client_value,
    synchronize_exp_table,
)


def make_test_dll(values: list[int]) -> bytes:
    data = bytearray(b"MZ" + b"\0" * 30)
    for slot, value in enumerate(values):
        for half, immediate in enumerate((value & 0xFFFFFFFF, value >> 32)):
            address = TABLE_VA + slot * 8 + half * 4
            data.extend(MOV_ABSOLUTE_IMMEDIATE)
            data.extend(struct.pack("<II", address, immediate))
    return bytes(data)


class YunaExpTablePatchTest(unittest.TestCase):
    def test_synchronizes_server_levels_and_preserves_extended_levels(self) -> None:
        client_values = [1000 + level for level in range(CLIENT_TABLE_LENGTH)]
        server_values = [15, 15, 34, 57]
        original = make_test_dll(client_values)

        patched, changed = synchronize_exp_table(original, server_values)
        offsets = find_table_immediates(patched)

        self.assertEqual(4, changed)
        self.assertEqual(server_values[3], read_client_value(patched, offsets[3]))
        self.assertEqual(
            client_values[4],
            read_client_value(patched, offsets[4]),
        )

    def test_is_idempotent(self) -> None:
        values = [15, 15, 34] + [1000 + level for level in range(3, 260)]
        original = make_test_dll(values)

        patched, changed = synchronize_exp_table(original, values[:3])

        self.assertEqual(original, patched)
        self.assertEqual(0, changed)


if __name__ == "__main__":
    unittest.main()
