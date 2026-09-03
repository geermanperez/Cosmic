"""Regression tests for the SET_FIELD hook's PE32 relocation."""
import struct
import unittest

from patch_yunams_setfield_hook import fix_hook_relocation


class HookRelocationTest(unittest.TestCase):
    def image(self, entry=0x36C6):
        data = bytearray(0x500)
        struct.pack_into("<I", data, 0x3C, 0x80)
        struct.pack_into("<H", data, 0x86, 1)
        struct.pack_into("<H", data, 0x94, 224)
        struct.pack_into("<H", data, 0x98, 0x10B)
        struct.pack_into("<II", data, 0x98 + 96 + 40, 0x1000, 12)
        struct.pack_into("<IIII", data, 0x178 + 8, 0x100, 0x1000, 0x100, 0x400)
        struct.pack_into("<IIHH", data, 0x400, 0x12000, 12, entry, 0)
        return data

    def test_moves_relocation_to_jump_operand(self):
        data = self.image()
        fix_hook_relocation(data)
        self.assertEqual(struct.unpack_from("<H", data, 0x408)[0], 0x36C2)

    def test_repeat_is_no_op(self):
        data = self.image(0x36C2)
        original = bytes(data)
        fix_hook_relocation(data)
        self.assertEqual(data, original)

    def test_rejects_missing_relocation(self):
        with self.assertRaises(ValueError):
            fix_hook_relocation(self.image(0))


if __name__ == "__main__":
    unittest.main()
