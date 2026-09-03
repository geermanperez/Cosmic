import struct
import unittest
from audit_yuna_wz import KEY, Reader, parse_image, valid_name


def text(value):
    raw = value.encode('cp1252')
    prefix = struct.pack('<b', -len(raw)) if len(raw) < 128 else b'\x80' + struct.pack('<i', len(raw))
    return prefix + bytes(b ^ ((0xAA+i)&255) ^ (KEY[i] if i < len(KEY) else 0) for i,b in enumerate(raw))


class WzTest(unittest.TestCase):
    def test_verified_short_strings(self):
        for value in ['Property', 'cash', 'pickupMeso']:
            self.assertEqual(Reader(text(value)).string(), value)

    def test_missing_keystream_rejected(self):
        with self.assertRaises(ValueError): Reader(text('a'*300)).string()

    def test_metadata_types(self):
        data = b'\x73' + text('Property') + b'\x00\x00\x02'
        data += b'\x00' + text('cash') + b'\x03\x01'
        data += b'\x00' + text('pickupMeso') + b'\x08\x00' + text('1')
        root = parse_image(data, '01812000.img')
        self.assertEqual(root[0].tag, 'int')
        self.assertEqual(root[1].tag, 'string')
        self.assertEqual(root[0].get('value'), '1')

    def test_unknown_types_rejected(self):
        data = b'\x73' + text('Property') + b'\x00\x00\x01\x00' + text('x') + b'\xFE'
        with self.assertRaises(ValueError): parse_image(data, 'x.img')

    def test_read_bounds(self):
        with self.assertRaises(ValueError): Reader(b'').number('I')

    def test_unsafe_paths_rejected(self):
        for name in ['..', '../bad', 'C:bad', 'a\\b']:
            with self.assertRaises(ValueError): valid_name(name)


if __name__ == '__main__': unittest.main()
