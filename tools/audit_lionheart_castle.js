const fs = require('fs');
const path = require('path');

const WZ_MAP_ROOT = path.join(__dirname, '..', 'wz', 'Map.wz', 'Map');
const SCRIPTS_PORTAL_ROOT = path.join(__dirname, '..', 'scripts', 'portal');

function getMapXmlPath(mapId) {
    const dir = 'Map' + Math.floor(mapId / 100000000);
    const p = path.join(WZ_MAP_ROOT, dir, mapId + '.img.xml');
    return fs.existsSync(p) ? p : null;
}

function parsePortals(xmlContent) {
    const portals = [];
    const pStart = xmlContent.indexOf('<imgdir name="portal">');
    if (pStart === -1) return portals;

    let depth = 0;
    let pEnd = -1;
    const tagRegex = /<\/?imgdir\b[^>]*>/g;
    tagRegex.lastIndex = pStart;
    let m;
    while ((m = tagRegex.exec(xmlContent)) !== null) {
        if (m[0].startsWith('</')) {
            depth--;
            if (depth === 0) { pEnd = m.index + m[0].length; break; }
        } else if (!m[0].endsWith('/>')) {
            depth++;
        }
    }
    if (pEnd === -1) return portals;

    const sec = xmlContent.slice(pStart, pEnd);
    const cRegex = /<imgdir name="(\d+)">([\s\S]*?)<\/imgdir>/g;
    let cm;
    while ((cm = cRegex.exec(sec)) !== null) {
        const b = cm[2];
        const getS = (n) => { const x = b.match(new RegExp('<string name="' + n + '" value="([^"]*)"')); return x ? x[1] : ''; };
        const getI = (n) => { const x = b.match(new RegExp('<int name="' + n + '" value="([^"]*)"')); return x ? parseInt(x[1], 10) : null; };
        portals.push({
            id: parseInt(cm[1], 10),
            pn: getS('pn'),
            pt: getI('pt'),
            tm: getI('tm'),
            tn: getS('tn'),
            script: getS('script'),
            x: getI('x'),
            y: getI('y')
        });
    }
    return portals;
}

// Find all 21106* maps in wz/Map.wz/Map/Map2/
const allLhc = fs.readdirSync(path.join(WZ_MAP_ROOT, 'Map2'))
    .filter(f => f.startsWith('21106') && f.endsWith('.img.xml'))
    .map(f => parseInt(f.replace('.img.xml', ''), 10));

console.log(`Found ${allLhc.length} Lion Heart Castle maps in WZ`);

for (const mapId of allLhc) {
    const p = getMapXmlPath(mapId);
    const xml = fs.readFileSync(p, 'utf8');
    const portals = parsePortals(xml);

    for (const port of portals) {
        if (port.script) {
            const sPath = path.join(SCRIPTS_PORTAL_ROOT, port.script + '.js');
            const exists = fs.existsSync(sPath);
            if (!exists) {
                console.log(`[MISSING SCRIPT] Map ${mapId} portal ${port.id} ("${port.pn}"): scripts/portal/${port.script}.js`);
            }
        }
        if (port.tm && port.tm !== 999999999 && port.tm !== mapId) {
            const targetP = getMapXmlPath(port.tm);
            if (!targetP) {
                console.log(`[TARGET MAP MISSING] Map ${mapId} portal ${port.id} ("${port.pn}") -> tm=${port.tm}`);
            } else if (port.tn) {
                const targetXml = fs.readFileSync(targetP, 'utf8');
                const targetPortals = parsePortals(targetXml);
                const targetPort = targetPortals.find(tp => tp.pn === port.tn);
                if (!targetPort) {
                    const has0 = targetPortals.some(tp => tp.id === 0);
                    console.log(`[PORTAL TN MISMATCH] Map ${mapId} portal "${port.pn}" -> tm=${port.tm} tn="${port.tn}" (Target has 0: ${has0})`);
                }
            }
        }
    }
}
console.log('LHC check complete.');
