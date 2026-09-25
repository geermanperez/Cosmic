const fs = require('fs');
const path = require('path');

const mapId = parseInt(process.argv[2], 10);
if (!mapId) {
    console.log('Usage: node tools/inspect_map.js <mapId>');
    process.exit(1);
}

const dir = 'Map' + Math.floor(mapId / 100000000);
const p = path.join(__dirname, '..', 'wz', 'Map.wz', 'Map', dir, mapId + '.img.xml');
if (!fs.existsSync(p)) {
    console.log(`Map ${mapId} NOT found at ${p}`);
    process.exit(1);
}

const xml = fs.readFileSync(p, 'utf8');

// Return map
const rm = xml.match(/<int name="returnMap" value="(\d+)"/);
console.log(`=== Map ${mapId} ===`);
console.log(`returnMap: ${rm ? rm[1] : 'none'}`);

// Portals
const pStart = xml.indexOf('<imgdir name="portal">');
if (pStart !== -1) {
    let depth = 0;
    let pEnd = -1;
    const tagRegex = /<\/?imgdir\b[^>]*>/g;
    tagRegex.lastIndex = pStart;
    let m;
    while ((m = tagRegex.exec(xml)) !== null) {
        if (m[0].startsWith('</')) {
            depth--;
            if (depth === 0) { pEnd = m.index + m[0].length; break; }
        } else if (!m[0].endsWith('/>')) {
            depth++;
        }
    }
    if (pEnd !== -1) {
        const sec = xml.slice(pStart, pEnd);
        const cRegex = /<imgdir name="(\d+)">([\s\S]*?)<\/imgdir>/g;
        let cm;
        console.log('\nPortales:');
        while ((cm = cRegex.exec(sec)) !== null) {
            const b = cm[2];
            const getS = (n) => { const x = b.match(new RegExp('<string name="' + n + '" value="([^"]*)"')); return x ? x[1] : ''; };
            const getI = (n) => { const x = b.match(new RegExp('<int name="' + n + '" value="([^"]*)"')); return x ? parseInt(x[1], 10) : null; };
            console.log(`  [${cm[1]}] pn="${getS('pn')}" pt=${getI('pt')} tm=${getI('tm')} tn="${getS('tn')}" script="${getS('script')}" pos=(${getI('x')},${getI('y')})`);
        }
    }
}
