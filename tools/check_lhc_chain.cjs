const fs = require('fs');
const path = require('path');

function checkMapPortals(mapId) {
    const file = path.join('wz/Map.wz/Map/Map2', `${mapId}.img.xml`);
    if (!fs.existsSync(file)) {
        console.log(`Map ${mapId} does not exist`);
        return;
    }
    const xml = fs.readFileSync(file, 'utf8');
    const pStart = xml.indexOf('<imgdir name="portal">');
    if (pStart === -1) {
        console.log(`Map ${mapId} has NO portals`);
        return;
    }
    const pChunk = xml.substring(pStart, pStart + 3000);
    const pRegex = /<imgdir name="(\d+)">([\s\S]*?)<\/imgdir>/g;
    let m;
    const ports = [];
    while ((m = pRegex.exec(pChunk)) !== null) {
        const b = m[2];
        const pn = (b.match(/<string name="pn" value="([^"]*)"/) || [])[1];
        const pt = (b.match(/<int name="pt" value="([^"]*)"/) || [])[1];
        const tm = (b.match(/<int name="tm" value="([^"]*)"/) || [])[1];
        const tn = (b.match(/<string name="tn" value="([^"]*)"/) || [])[1];
        const script = (b.match(/<string name="script" value="([^"]*)"/) || [])[1];
        const x = (b.match(/<int name="x" value="([^"]*)"/) || [])[1];
        const y = (b.match(/<int name="y" value="([^"]*)"/) || [])[1];
        ports.push({ id: m[1], pn, pt, tm, tn, script, x, y });
    }
    console.log(`Map ${mapId}:`, ports);
}

[211060000, 211060010, 211060100, 211060200, 211060300, 211060400, 211060500, 211060600, 211060700, 211060800].forEach(checkMapPortals);
