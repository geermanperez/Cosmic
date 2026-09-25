import os
import re
import struct

KEY = bytes.fromhex('f709616307746ae3047b2f69c96a0d1f37') + bytes([0] * 100)

def decrypt_name(data):
    mask = 0xAA
    dec = []
    for i in range(len(data)):
        dec.append(data[i] ^ KEY[i] ^ mask)
        mask = (mask + 1) & 0xFF
    return bytes(dec).decode('ascii', errors='replace')

print('=== 1. EXTRACTING CHAIRS FROM Item.wz ===')
chairs = set()
pattern = rb'\x00\xf8\x6d\x91\xfd\xff(.{4})'
with open('Item.wz', 'rb') as f:
    f.seek(17321579)
    pos = 17321579
    end = 17321579 + 219921935
    chunk_size = 1024 * 1024 * 20
    overlap = b''
    while pos < end:
        to_read = min(chunk_size, end - pos)
        chunk = f.read(to_read)
        if not chunk: break
        data = overlap + chunk
        for m in re.finditer(pattern, data):
            m_bytes = m.group(1)
            mask = 0xAE
            dec = []
            valid = True
            for x in range(4):
                c = m_bytes[x] ^ KEY[4 + x] ^ mask
                mask = (mask + 1) & 0xFF
                if not (48 <= c <= 57):
                    valid = False
                    break
                dec.append(c)
            if valid:
                cid = '0301' + bytes(dec).decode('ascii')
                chairs.add(cid)
        overlap = chunk[-20:]
        pos += len(chunk)

print(f'Extracted {len(chairs)} chairs from 0301.img')

print('=== 2. EXTRACTING HAIRS FROM Character.wz ===')
hairs = []
with open('Character.wz', 'rb') as f:
    f.seek(0x71c84)
    b = f.read(1)[0]
    count = struct.unpack('<I', f.read(4))[0] if b == 0x80 else b
    for k in range(count):
        t = f.read(1)[0]
        slen = f.read(1)[0]
        length = 256 - slen if slen > 127 else slen
        bytes_name = f.read(length)
        b1 = f.read(1)[0]
        if b1 == 0x80: f.read(4)
        b2 = f.read(1)[0]
        if b2 == 0x80: f.read(4)
        f.read(4)
        hname = decrypt_name(bytes_name)
        if hname.endswith('.img'):
            hairs.append(hname[:-4])

print(f'Extracted {len(hairs)} hairs from Character.wz')

print('=== 3. EXTRACTING FACES FROM Character.wz ===')
faces = []
with open('Character.wz', 'rb') as f:
    f.seek(0xe5e3b)
    b = f.read(1)[0]
    count = struct.unpack('<I', f.read(4))[0] if b == 0x80 else b
    for k in range(count):
        t = f.read(1)[0]
        slen = f.read(1)[0]
        length = 256 - slen if slen > 127 else slen
        bytes_name = f.read(length)
        b1 = f.read(1)[0]
        if b1 == 0x80: f.read(4)
        b2 = f.read(1)[0]
        if b2 == 0x80: f.read(4)
        f.read(4)
        fname = decrypt_name(bytes_name)
        if fname.endswith('.img'):
            faces.append(fname[:-4])

print(f'Extracted {len(faces)} faces from Character.wz')

with open('sync_data.json', 'w') as out:
    import json
    json.dump({'chairs': sorted(list(chairs)), 'hairs': hairs, 'faces': faces}, out)
print('Saved to sync_data.json!')
