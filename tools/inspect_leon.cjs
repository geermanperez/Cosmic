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

const mapPath = findMap(211060000);
console.log('Map 211060000 file path:', mapPath);
if (mapPath) {
    const xml = fs.readFileSync(mapPath, 'utf8');
    const portalMatches = xml.match(/<imgdir name="portal">([\s\S]*?)<\/imgdir>\s*<imgdir name="/);
    if (portalMatches) {
        console.log('Portals in 211060000:');
        const pRegex = /<imgdir name="(\d+)">([\s\S]*?)<\/imgdir>/g;
        let m;
        while ((m = pRegex.exec(portalMatches[1])) !== null) {
            const pName = (m[2].match(/<string name="pn" value="([^"]+)"/) || [])[1];
            const pType = (m[2].match(/<int name="pt" value="([^"]+)"/) || [])[1];
            const toMap = (m[2].match(/<int name="tm" value="([^"]+)"/) || [])[1];
            const toName = (m[2].match(/<string name="tn" value="([^"]+)"/) || [])[1];
            const script = (m[2].match(/<string name="script" value="([^"]+)"/) || [])[1];
            console.log(`Portal ${m[1]} (${pName}): type=${pType}, toMap=${toMap}, toName=${toName}, script=${script}`);
        }
    }
}
