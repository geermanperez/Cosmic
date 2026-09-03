"""Read-only audit and staged Cosmic XML export of this Yuna v83 WZ build.

Never writes into the client or the server tree. Media payloads remain in WZ;
the XML contains their metadata, as used by Cosmic's XMLDomMapleData provider.
This is deliberately not a universal WZ decoder: unknown formats fail closed.
"""
import argparse
import atexit
import hashlib
import json
import math
import mmap
from pathlib import Path
import struct
import xml.etree.ElementTree as ET
import zipfile

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
        if length * (2 if unicode else 1) > len(KEY):
            raise ValueError('Full client WZ keystream required for this string; refusing partial decryption')
        raw = self.take(length * (2 if unicode else 1))
        if unicode:
            values = []
            for i in range(length):
                k = sum(KEY[j] << (8 * (j % 2))
                        for j in (i * 2, i * 2 + 1))
                values.append(struct.unpack_from('<H', raw, i * 2)[0] ^ ((0xAAAA + i) & 0xFFFF) ^ k)
            return struct.pack('<' + 'H' * length, *values).decode('utf-16le')
        decoded = bytes(b ^ ((0xAA + i) & 255) ^ KEY[i]
                        for i, b in enumerate(raw))
        return decoded.decode('cp1252')

    def string_block(self):
        kind = self.number('B')
        if kind in (0, 0x73):
            return self.string()
        if kind in (1, 0x1B):
            offset = self.number('i')
            saved = self.pos
            if not 0 <= offset < len(self.data):
                raise ValueError('Invalid IMG string reference')
            self.pos = offset
            result = self.string()
            self.pos = saved
            return result
        raise ValueError(f'Unknown string marker {kind}')


def valid_name(name):
    if not name or name in ('.', '..') or any(c in name for c in '/\\:') or any(ord(c) < 32 for c in name):
        raise ValueError(f'Unsafe WZ filename: {name!r}')
    return name


def index_archive(data, allow_duplicates=False):
    r = Reader(data)
    if r.take(4) != b'PKG1':
        raise ValueError('Not a PKG1 archive (List.wz uses a different format)')
    r.number('Q')
    start = r.number('I')
    if start != 60:
        raise ValueError(f'Unsupported header offset {start}')
    seen, entries = set(), []

    def walk(offset, parent='', depth=0):
        if depth > 32 or offset in seen or not 0 <= offset < len(data):
            raise ValueError('Invalid or cyclic WZ directory')
        seen.add(offset)
        r.pos = offset
        count = r.integer()
        if not 0 <= count <= 1000000:
            raise ValueError('Invalid directory count')
        children = []
        for _ in range(count):
            kind = r.number('B')
            if kind == 2:
                ref = r.number('i') + start
                saved = r.pos
                r.pos = ref
                kind, name = r.number('B'), r.string()
                r.pos = saved
            elif kind in (3, 4):
                name = r.string()
            else:
                raise ValueError(f'Unsupported directory type {kind}')
            name = valid_name(name)
            size, checksum = r.integer(), r.integer()
            pos = r.pos
            encrypted = r.number('I')
            v = (((pos - start) ^ 0xFFFFFFFF) * 1876 - 0x581C3F6D) & 0xFFFFFFFF
            shift = v & 31
            v = ((v << shift) | (v >> ((32 - shift) % 32))) & 0xFFFFFFFF
            child = ((v ^ encrypted) + start * 2) & 0xFFFFFFFF
            path = f'{parent}/{name}' if parent else name
            if kind not in (3, 4) or size < 0 or child >= len(data):
                raise ValueError('Invalid WZ entry')
            children.append((kind, path, child, size, checksum))
        for kind, path, child, size, checksum in children:
            if kind == 3:
                walk(child, path, depth + 1)
            else:
                if child + size > len(data):
                    raise ValueError('IMG outside archive')
                entries.append({'path': path, 'offset': child, 'size': size, 'checksum': checksum})
    walk(start + 2)
    if not allow_duplicates and len({e['path'] for e in entries}) != len(entries):
        from collections import Counter
        duplicates = {p for p,c in Counter(e['path'] for e in entries).items() if c > 1}
        raise ValueError('Duplicate IMG paths: ' + repr([e for e in entries if e['path'] in duplicates][:12]))
    return entries


def parse_image(data, name):
    r = Reader(data)
    if r.string_block() != 'Property' or r.number('H') != 0:
        raise ValueError('Unsupported IMG header')

    def props(parent, depth):
        if depth > 100:
            raise ValueError('Property depth limit')
        count = r.integer()
        if not 0 <= count <= 1000000:
            raise ValueError('Invalid property count')
        for _ in range(count):
            name, kind = r.string_block(), r.number('B')
            if kind == 0:
                node = ET.Element('null', name=name)
            elif kind in (2, 11, 3, 19, 20, 4, 5, 8):
                tag = {2:'short',11:'short',3:'int',19:'int',20:'int',4:'float',5:'double',8:'string'}[kind]
                if kind in (2, 11): value = r.number('h')
                elif kind in (3, 19): value = r.integer()
                elif kind == 20:
                    lead = r.number('b')
                    value = r.number('q') if lead == -128 else lead
                    if not -(2**31) <= value < 2**31:
                        raise ValueError('Int64 unsupported by Cosmic XML provider')
                elif kind == 4:
                    marker = r.number('B')
                    if marker not in (0, 128): raise ValueError('Invalid float')
                    value = r.number('f') if marker == 128 else 0.0
                elif kind == 5: value = r.number('d')
                else: value = r.string_block()
                if isinstance(value, float) and not math.isfinite(value):
                    raise ValueError('Nonfinite number')
                node = ET.Element(tag, name=name, value=str(value))
            elif kind == 9:
                size = r.number('I')
                end = r.pos + size
                if end > len(data): raise ValueError('Extended property outside IMG')
                node = extended(name, depth + 1)
                if r.pos > end: raise ValueError('Extended property overrun')
                r.pos = end
            else:
                raise ValueError(f'Unsupported property type {kind}')
            parent.append(node)

    def extended(name, depth):
        kind = r.string_block()
        if kind == 'Property':
            if r.number('H') != 0: raise ValueError('Invalid Property header')
            node = ET.Element('imgdir', name=name)
            props(node, depth)
        elif kind == 'Canvas':
            r.number('B')
            node = ET.Element('canvas', name=name)
            has_props = r.number('B')
            if has_props == 1:
                if r.number('H') != 0: raise ValueError('Invalid Canvas header')
                props(node, depth)
            elif has_props != 0: raise ValueError('Invalid Canvas flags')
            node.set('width', str(r.integer()))
            node.set('height', str(r.integer()))
        elif kind == 'Shape2D#Vector2D':
            node = ET.Element('vector', name=name, x=str(r.integer()), y=str(r.integer()))
        elif kind == 'Shape2D#Convex2D':
            node = ET.Element('convex', name=name)
            count = r.integer()
            if not 0 <= count <= 100000: raise ValueError('Invalid convex count')
            for i in range(count): node.append(extended(str(i), depth + 1))
        elif kind == 'UOL':
            r.number('B')
            node = ET.Element('uol', name=name, value=r.string_block())
        elif kind == 'Sound_DX8':
            r.number('B')
            length, duration = r.integer(), r.integer()
            node = ET.Element('sound', name=name, length=str(length))
        else:
            raise ValueError(f'Unsupported extended property {kind!r}')
        return node

    root = ET.Element('imgdir', name=name)
    props(root, 0)
    # Round-trip validation prevents malformed XML from entering the stage.
    ET.fromstring(ET.tostring(root, encoding='utf-8'))
    return root


def canonical(node):
    return (node.tag, tuple(sorted(node.attrib.items())), tuple(sorted(canonical(c) for c in node)))


def main():
    global KEY
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--client', type=Path, required=True)
    p.add_argument('--server-wz', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--archives', nargs='+', default=['Character', 'Item', 'Etc', 'String'])
    p.add_argument('--key-stream', type=Path, help='Complete client XOR keystream, not an AES password or IV')
    p.add_argument('--zip-output', action='store_true', help='Stage XML in one ZIP instead of thousands of loose files')
    args = p.parse_args()
    client, server, output = args.client.resolve(), args.server_wz.resolve(), args.output.resolve()
    if args.key_stream:
        full_key = args.key_stream.read_bytes()
        if not full_key.startswith(KEY):
            raise SystemExit('Keystream does not match the verified client prefix')
        KEY = full_key
    if output == client or output == server or client in output.parents or server in output.parents:
        raise SystemExit('Output must be separate from client and server WZ')
    output.mkdir(parents=True, exist_ok=False)
    zipped = zipfile.ZipFile(output / 'staged-wz.zip', 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=1) if args.zip_output else None
    if zipped:
        atexit.register(zipped.close)
    report = {'client':str(client), 'server':str(server), 'key_bytes':len(KEY),
              'media':'metadata only; no PNG/audio extraction', 'archives':[]}
    for archive in sorted(client.glob('*.wz')):
        result = {'name':archive.name, 'bytes':archive.stat().st_size, 'entries':[], 'errors':[]}
        report['archives'].append(result)
        try:
            with archive.open('rb') as f, mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as data:
                result['sha256'] = hashlib.sha256(data).hexdigest()
                entries = index_archive(data, allow_duplicates=True)
                from collections import Counter
                path_counts = Counter(e['path'] for e in entries)
                for entry in entries:
                    row = dict(entry)
                    result['entries'].append(row)
                    target = server / archive.name / (entry['path'] + '.xml')
                    row['server_exists'] = target.is_file()
                    if path_counts[entry['path']] > 1:
                        row['status'], row['error'] = 'error', 'Ambiguous duplicate IMG path; not exported'
                        continue
                    if 'all' not in args.archives and archive.stem not in args.archives:
                        row['status'] = 'indexed_only'
                        continue
                    try:
                        raw = data[entry['offset']:entry['offset'] + entry['size']]
                        root = parse_image(raw, Path(entry['path']).name)
                        row['status'] = 'missing'
                        if target.is_file():
                            row['status'] = 'same' if canonical(root) == canonical(ET.parse(target).getroot()) else 'different'
                        destination = output / 'staged-wz' / archive.name / (entry['path'] + '.xml')
                        ET.indent(root, space='  ')
                        if zipped:
                            zipped.writestr(archive.name + '/' + entry['path'] + '.xml', ET.tostring(root, encoding='utf-8', xml_declaration=True))
                        else:
                            destination.parent.mkdir(parents=True, exist_ok=True)
                            ET.ElementTree(root).write(destination, encoding='utf-8', xml_declaration=True)
                    except Exception as exc:
                        row['status'], row['error'] = 'error', str(exc)
                counts = {}
                for row in result['entries']: counts[row['status']] = counts.get(row['status'],0) + 1
                result['counts'] = counts
        except Exception as exc:
            result['errors'].append(str(exc))
        print(archive.name, result.get('counts', {}), result['errors'], flush=True)
        (output / 'report.json').write_text(json.dumps(report, indent=2, ensure_ascii=True), encoding='utf-8')
    if zipped:
        zipped.close()
    print('Staged only. No production files were changed.', flush=True)


if __name__ == '__main__':
    main()
