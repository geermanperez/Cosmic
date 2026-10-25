import sys
from pathlib import Path
import struct
import xml.etree.ElementTree as ET

# We can adapt Reader from audit_yuna_wz to read Quest.wz
KEY = bytes.fromhex('f709616307746ae3047b2f69c96a0d1f37')

class Reader:
    def __init__(self, data):
        self.data, self.pos = data, 0

    def take(self, count):
        if count < 0 or self.pos + count > len(self.data):
            raise ValueError('Read outside WZ bounds')
        result = self.data[self.pos:self.pos + count]
        self.pos += count
        return result

    def number(self, fmt):
        return struct.unpack('<' + fmt, self.take(struct.calcsize('<' + fmt)))[0]

    def integer(self):
        n = self.number('b')
        return self.number('i') if n == -128 else n

    def string(self):
        n = self.number('b')
        if not n:
            return ''
        unicode = n > 0
        length = self.number('i') if n in (-128, 127) else abs(n)
        if not 0 <= length <= 10000000:
            raise ValueError('Invalid WZ string length')
        raw = self.take(length * (2 if unicode else 1))
        # extend KEY if needed
        key = KEY * (len(raw) // len(KEY) + 1)
        if unicode:
            values = []
            for i in range(length):
                k = sum(key[j] << (8 * (j % 2)) for j in (i * 2, i * 2 + 1))
                values.append(struct.unpack_from('<H', raw, i * 2)[0] ^ ((0xAAAA + i) & 0xFFFF) ^ k)
            return struct.pack('<' + 'H' * length, *values).decode('utf-16le', errors='ignore')
        decoded = bytes(b ^ ((0xAA + i) & 255) ^ key[i] for i, b in enumerate(raw))
        return decoded.decode('cp1252', errors='ignore')

    def string_block(self):
        kind = self.number('B')
        if kind in (0, 0x73):
            return self.string()
        if kind in (1, 0x1B):
            offset = self.number('i')
            saved = self.pos
            self.pos = offset
            result = self.string()
            self.pos = saved
            return result
        raise ValueError(f'Unknown string marker {kind}')

def check_wz(path):
    print("Checking", path)
    data = open(path, 'rb').read()
    r = Reader(data)
    hdr = r.take(4)
    size = r.number('Q')
    start = r.number('I')
    print("Header:", hdr, "Start:", start)
    
check_wz('D:/Everleaf/MapleStory/Quest.wz')
