"""Recover a consensus XOR keystream from matching client/server WZ strings.

Does not alter game files. Only bytes supported by at least three distinct
plaintext strings and >=95% agreement are emitted. Output remains diagnostic
until verified on separate images; recovery is not a proof of compatibility.
"""
import argparse
from collections import Counter, defaultdict
import hashlib
import json
import mmap
from pathlib import Path
import xml.etree.ElementTree as ET
import audit_yuna_wz as wz


def mask(length, wide):
    if not wide:
        return bytes((0xAA + i) & 255 for i in range(length))
    return bytes(((0xAAAA + i // 2) >> (8 * (i % 2))) & 255 for i in range(length))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--client', type=Path, required=True)
    parser.add_argument('--server-wz', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    output = args.output.resolve()
    for source in (args.client.resolve(), args.server_wz.resolve()):
        if output == source or source in output.parents:
            raise SystemExit('Output must be outside client/server trees')
    output.mkdir(parents=True, exist_ok=False)
    prefix = wz.KEY
    pool = defaultdict(set)
    for archive in ['String.wz', 'Etc.wz', 'Quest.wz']:
        for path in (args.server_wz / archive).rglob('*.xml'):
            for _, elem in ET.iterparse(path):
                for value in (elem.get('name'), elem.get('value')):
                    if not value or len(value) > 100000:
                        continue
                    for wide, encoding in [(False, 'cp1252'), (True, 'utf-16le')]:
                        try:
                            plain = value.encode(encoding)
                        except UnicodeError:
                            continue
                        if len(plain) > len(prefix):
                            pool[(wide, len(plain), plain[:len(prefix)])].add(plain)
                elem.clear()
    print('Candidate buckets:', len(pool), flush=True)
    votes = defaultdict(Counter)
    seen, errors = set(), []

    class HarvestReader(wz.Reader):
        def string(self):
            n = self.number('b')
            if not n: return ''
            wide = n > 0
            count = self.number('i') if n in (-128, 127) else abs(n)
            if not 0 <= count <= 10000000: raise ValueError('Invalid string size')
            raw = self.take(count * (2 if wide else 1))
            masks = mask(len(raw), wide)
            decoded_prefix = bytes(b ^ masks[i] ^ prefix[i] for i, b in enumerate(raw[:len(prefix)]))
            if len(raw) <= len(prefix):
                return decoded_prefix.decode('utf-16le' if wide else 'cp1252')
            candidates = pool.get((wide, len(raw), decoded_prefix), ())
            if len(candidates) == 1:
                plain = next(iter(candidates))
                evidence = hashlib.sha256(plain).digest()
                if evidence not in seen:
                    seen.add(evidence)
                    for i in range(len(prefix), len(raw)):
                        votes[i][raw[i] ^ masks[i] ^ plain[i]] += 1
            # This placeholder is never written as a converted XML file.
            return 'unverified_' + hashlib.sha256(raw).hexdigest()[:20]

    wz.Reader = HarvestReader
    for archive in ['String.wz', 'Etc.wz', 'Quest.wz']:
        with (args.client / archive).open('rb') as f, mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as data:
            for entry in wz.index_archive(data):
                try:
                    raw = data[entry['offset']:entry['offset'] + entry['size']]
                    wz.parse_image(raw, Path(entry['path']).name)
                except Exception as exc:
                    errors.append({'archive':archive, 'image':entry['path'], 'error':str(exc)})
        print(archive, 'distinct evidence strings:',len(seen), flush=True)
    key = bytearray(prefix)
    statistics = []
    for i in range(len(prefix), max(votes, default=len(prefix)-1) + 1):
        counts = votes[i]
        if not counts: break
        value, count = counts.most_common(1)[0]
        total = sum(counts.values())
        if count < 3 or count / total < 0.95: break
        key.append(value)
        statistics.append({'offset':i, 'support':count, 'total':total})
    (output / 'consensus-keystream.bin').write_bytes(key)
    (output / 'recovery.json').write_text(json.dumps({
        'key_bytes':len(key), 'distinct_evidence':len(seen),
        'sha256':hashlib.sha256(key).hexdigest(), 'statistics':statistics,
        'errors':errors, 'independent_validation_required':True,
    }, indent=2), encoding='utf-8')
    print('Consensus bytes:',len(key),'parse errors:',len(errors), flush=True)


if __name__ == '__main__': main()
