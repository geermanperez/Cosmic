const fs = require('fs');
const path = require('path');

function findMap(id) {
    const s = String(id).padStart(9, '0');
    const area = 'Map' + s[0];
    const p = path.resolve('wz/Map.wz/Map', area, s + '.img.xml');
    if (fs.existsSync(p)) return p;
    const p2 = path.resolve('wz/Map.wz', s + '.img.xml');
    if (fs.existsSync(p2)) return p2;
    return null;
}

// Find all 21106xxxx maps in Cosmic wz/Map.wz
const map2Dir = path.resolve('wz/Map.wz/Map/Map2');
const files = fs.readdirSync(map2Dir).filter(f => f.startsWith('21106'));
console.log('Lion Castle maps in Map2:', files);

for (const file of files.sort()) {
    const id = file.replace('.img.xml', '');
    const content = fs.readFileSync(path.join(map2Dir, file), 'utf8');
    
    // Check onUserEnter, onFirstUserEnter
    const onEnter = (content.match(/<string name="onUserEnter" value="([^"]*)"/) || [])[1];
    const onFirst = (content.match(/<string name="onFirstUserEnter" value="([^"]*)"/) || [])[1];
    
    // Check portals
    const portals = [];
    const pRegex = /<imgdir name="(\d+)">([\s\S]*?)<\/imgdir>/g;
    const pSec = content.match(/<imgdir name="portal">([\s\S]*?)<\/imgdir>\s*<imgdir name="/);
    if (pSec) {
        let m;
        while ((m = pRegex.exec(pSec[1])) !== null) {
            const pn = (m[2].match(/<string name="pn" value="([^"]*)"/) || [])[1];
            const pt = (m[2].match(/<int name="pt" value="([^"]*)"/) || [])[1];
            const tm = (m[2].match(/<int name="tm" value="([^"]*)"/) || [])[1];
            const tn = (m[2].match(/<string name="tn" value="([^"]*)"/) || [])[1];
            const sc = (m[2].match(/<string name="script" value="([^"]*)"/) || [])[1];
            if (tm !== '999999999' || sc) {
                portals.push({ pn, pt, tm, tn, sc });
            }
        }
    }
    console.log(`Map ${id}: onUserEnter="${onEnter}", onFirst="${onFirst}", portals:`, JSON.stringify(portals));
}
