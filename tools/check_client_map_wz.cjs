const fs = require('fs');

const KEY = Buffer.from('f709616307746ae3047b2f69c96a0d1f37', 'hex');

class Reader {
    constructor(buffer) {
        this.buf = buffer;
        this.pos = 0;
    }

    take(count) {
        if (count < 0 || this.pos + count > this.buf.length) {
            throw new Error('Read outside bounds');
        }
        const res = this.buf.subarray(this.pos, this.pos + count);
        this.pos += count;
        return res;
    }

    readUInt8() { return this.take(1)[0]; }
    readInt8() { return this.take(1).readInt8(0); }
    readUInt32LE() { return this.take(4).readUInt32LE(0); }
    readInt32LE() { return this.take(4).readInt32LE(0); }
    readBigUInt64LE() { return this.take(8).readBigUInt64LE(0); }

    integer() {
        const n = this.readInt8();
        return n === -128 ? this.readInt32LE() : n;
    }

    string() {
        const n = this.readInt8();
        if (!n) return '';
        const unicode = n > 0;
        const length = (n === -128 || n === 127) ? this.readInt32LE() : Math.abs(n);
        const raw = this.take(length * (unicode ? 2 : 1));
        if (unicode) {
            const chars = [];
            for (let i = 0; i < length; i++) {
                const k = KEY[i * 2] + (KEY[i * 2 + 1] << 8);
                const w = raw.readUInt16LE(i * 2);
                chars.push(String.fromCharCode(w ^ ((0xAAAA + i) & 0xFFFF) ^ k));
            }
            return chars.join('');
        } else {
            const chars = [];
            for (let i = 0; i < length; i++) {
                chars.push(String.fromCharCode(raw[i] ^ ((0xAA + i) & 255) ^ KEY[i]));
            }
            return chars.join('');
        }
    }
}

function indexArchive(data) {
    const r = new Reader(data);
    const magic = r.take(4).toString('ascii');
    if (magic !== 'PKG1') throw new Error('Not PKG1');
    r.readBigUInt64LE();
    const start = r.readUInt32LE();
    if (start !== 60) throw new Error('Invalid start');

    const seen = new Set();
    const entries = [];

    function walk(offset, parent = '', depth = 0) {
        if (depth > 32 || seen.has(offset) || offset < 0 || offset >= data.length) {
            throw new Error('Cycle or invalid offset');
        }
        seen.add(offset);
        r.pos = offset;
        const count = r.integer();
        const children = [];

        for (let i = 0; i < count; i++) {
            let kind = r.readUInt8();
            let name;
            if (kind === 2) {
                const ref = r.readInt32LE() + start;
                const saved = r.pos;
                r.pos = ref;
                kind = r.readUInt8();
                name = r.string();
                r.pos = saved;
            } else if (kind === 3 || kind === 4) {
                name = r.string();
            } else {
                throw new Error('Unsupported kind: ' + kind);
            }

            const size = r.integer();
            const checksum = r.integer();
            const pos = r.pos;
            const encrypted = r.readUInt32LE();

            let v = (BigInt((pos - start) ^ 0xFFFFFFFF) * 1876n - 0x581C3F6Dn) & 0xFFFFFFFFn;
            const shift = Number(v & 31n);
            v = ((v << BigInt(shift)) | (v >> BigInt((32 - shift) % 32))) & 0xFFFFFFFFn;
            const child = Number(((v ^ BigInt(encrypted)) + BigInt(start * 2)) & 0xFFFFFFFFn);

            const itemPath = parent ? `${parent}/${name}` : name;
            children.push({ kind, path: itemPath, child, size, checksum });
        }

        for (const c of children) {
            if (c.kind === 3) {
                walk(c.child, c.path, depth + 1);
            } else {
                entries.push(c);
            }
        }
    }

    walk(start + 2);
    return entries;
}

console.log('Reading EverleafMs/Map.wz...');
const mapData = fs.readFileSync('EverleafMs/Map.wz');
console.log('Indexing archive...');
const entries = indexArchive(mapData);
console.log(`Total entries: ${entries.length}`);

const lhc = entries.filter(e => e.path.includes('21106'));
console.log('LHC entries in client Map.wz:');
lhc.forEach(e => console.log(e.path));
