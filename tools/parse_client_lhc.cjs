const fs = require('fs');

const KEY = Buffer.from('f709616307746ae3047b2f69c96a0d1f37', 'hex');

class Reader {
    constructor(buffer, offset = 0) {
        this.buf = buffer;
        this.pos = offset;
    }
    take(count) {
        const res = this.buf.subarray(this.pos, this.pos + count);
        this.pos += count;
        return res;
    }
    readUInt8() { return this.take(1)[0]; }
    readInt8() { return this.take(1).readInt8(0); }
    readUInt16LE() { return this.take(2).readUInt16LE(0); }
    readInt16LE() { return this.take(2).readInt16LE(0); }
    readUInt32LE() { return this.take(4).readUInt32LE(0); }
    readInt32LE() { return this.take(4).readInt32LE(0); }
    readBigUInt64LE() { return this.take(8).readBigUInt64LE(0); }
    readFloatLE() { return this.take(4).readFloatLE(0); }
    readDoubleLE() { return this.take(8).readDoubleLE(0); }

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

    stringBlock() {
        const kind = this.readUInt8();
        if (kind === 0 || kind === 0x73) return this.string();
        if (kind === 1 || kind === 0x1B) {
            const offset = this.readInt32LE();
            const saved = this.pos;
            this.pos = offset;
            const res = this.string();
            this.pos = saved;
            return res;
        }
        throw new Error('Unknown string marker: ' + kind);
    }
}

function parseImg(buf, offset) {
    const r = new Reader(buf, offset);
    const header = r.stringBlock();
    if (header !== 'Property') throw new Error('Not property');
    r.readUInt16LE();

    function readProps(depth = 0) {
        const count = r.integer();
        const obj = {};
        for (let i = 0; i < count; i++) {
            const name = r.stringBlock();
            const kind = r.readUInt8();
            if (kind === 0) obj[name] = null;
            else if (kind === 2 || kind === 11) obj[name] = r.readInt16LE();
            else if (kind === 3 || kind === 19) obj[name] = r.integer();
            else if (kind === 20) {
                const lead = r.readInt8();
                obj[name] = lead === -128 ? Number(r.take(8).readBigInt64LE(0)) : lead;
            } else if (kind === 4) {
                const m = r.readUInt8();
                obj[name] = m === 128 ? r.readFloatLE() : 0.0;
            } else if (kind === 5) obj[name] = r.readDoubleLE();
            else if (kind === 8) obj[name] = r.stringBlock();
            else if (kind === 9) {
                const size = r.readUInt32LE();
                const end = r.pos + size;
                obj[name] = readExtended(depth + 1);
                r.pos = end;
            } else {
                throw new Error('Unknown kind: ' + kind);
            }
        }
        return obj;
    }

    function readExtended(depth) {
        const kind = r.stringBlock();
        if (kind === 'Property') {
            r.readUInt16LE();
            return readProps(depth);
        } else if (kind === 'Canvas') {
            r.readUInt8();
            const hp = r.readUInt8();
            let props = {};
            if (hp === 1) {
                r.readUInt16LE();
                props = readProps(depth);
            }
            const w = r.integer();
            const h = r.integer();
            return { _type: 'canvas', w, h, ...props };
        } else if (kind === 'Shape2D#Vector2D') {
            return { _type: 'vector', x: r.integer(), y: r.integer() };
        } else if (kind === 'Shape2D#Convex2D') {
            const count = r.integer();
            const arr = [];
            for (let i = 0; i < count; i++) arr.push(readExtended(depth + 1));
            return arr;
        } else if (kind === 'UOL') {
            r.readUInt8();
            return { _type: 'uol', val: r.stringBlock() };
        } else if (kind === 'Sound_DX8') {
            r.readUInt8();
            return { _type: 'sound', len: r.integer(), dur: r.integer() };
        }
        return { _type: kind };
    }

    return readProps();
}

// Find 211060100 and 211060200 in EverleafMs/Map.wz
const checkScript = require('./check_client_map_wz.cjs');
// Let's run on Map.wz
const mapData = fs.readFileSync('EverleafMs/Map.wz');
// We already know offsets from entries
const entries = [];
// index entries
const r = new Reader(mapData);
r.take(4); r.readBigUInt64LE();
const start = r.readUInt32LE();
function walk(offset, parent = '', depth = 0) {
    if (depth > 32) return;
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
        children.push({ kind, path: itemPath, child, size });
    }
    for (const c of children) {
        if (c.kind === 3) walk(c.child, c.path, depth + 1);
        else entries.push(c);
    }
}
walk(start + 2);

function dumpMap(mapId) {
    const e = entries.find(x => x.path === `Map/Map2/${mapId}.img`);
    if (!e) {
        console.log(`Map ${mapId} NOT found in client Map.wz`);
        return;
    }
    console.log(`\n=== Client Map.wz: ${e.path} (offset: ${e.child}, size: ${e.size}) ===`);
    try {
        const parsed = parseImg(mapData, e.child);
        console.log('INFO:', parsed.info);
        console.log('PORTALS:', JSON.stringify(parsed.portal, null, 2));
    } catch (err) {
        console.error('Failed to parse:', err.message);
    }
}

dumpMap(211060000);
dumpMap(211060010);
dumpMap(211060100);
dumpMap(211060200);
dumpMap(211060300);
