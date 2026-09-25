const fs = require('fs');
const path = require('path');

const WZ_MAP_ROOT = path.join(__dirname, '..', 'wz', 'Map.wz', 'Map');
const SCRIPTS_NPC_ROOT = path.join(__dirname, '..', 'scripts', 'npc');
const SCRIPTS_PORTAL_ROOT = path.join(__dirname, '..', 'scripts', 'portal');

function getMapXmlPath(mapId) {
    const dir = 'Map' + Math.floor(mapId / 100000000);
    const p = path.join(WZ_MAP_ROOT, dir, mapId + '.img.xml');
    return fs.existsSync(p) ? p : null;
}

function parseMap(mapId) {
    const p = getMapXmlPath(mapId);
    if (!p) return null;
    const xml = fs.readFileSync(p, 'utf8');

    // Extract returnMap
    const rmMatch = xml.match(/<int name="returnMap" value="(\d+)"/);
    const returnMap = rmMatch ? parseInt(rmMatch[1], 10) : null;

    // Extract portals
    const portals = [];
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
            while ((cm = cRegex.exec(sec)) !== null) {
                const b = cm[2];
                const getS = (n) => { const x = b.match(new RegExp('<string name="' + n + '" value="([^"]*)"')); return x ? x[1] : null; };
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
        }
    }

    // Extract NPCs (life)
    const npcs = [];
    const lStart = xml.indexOf('<imgdir name="life">');
    if (lStart !== -1) {
        let depth = 0;
        let lEnd = -1;
        const tagRegex = /<\/?imgdir\b[^>]*>/g;
        tagRegex.lastIndex = lStart;
        let m;
        while ((m = tagRegex.exec(xml)) !== null) {
            if (m[0].startsWith('</')) {
                depth--;
                if (depth === 0) { lEnd = m.index + m[0].length; break; }
            } else if (!m[0].endsWith('/>')) {
                depth++;
            }
        }
        if (lEnd !== -1) {
            const sec = xml.slice(lStart, lEnd);
            const cRegex = /<imgdir name="(\d+)">([\s\S]*?)<\/imgdir>/g;
            let cm;
            while ((cm = cRegex.exec(sec)) !== null) {
                const b = cm[2];
                const isNpc = b.includes('<string name="type" value="n"');
                if (isNpc) {
                    const idM = b.match(/<string name="id" value="(\d+)"/);
                    const xM = b.match(/<int name="x" value="([^"]+)"/);
                    const yM = b.match(/<int name="y" value="([^"]+)"/);
                    if (idM) {
                        npcs.push({
                            id: parseInt(idM[1], 10),
                            x: xM ? parseInt(xM[1], 10) : 0,
                            y: yM ? parseInt(yM[1], 10) : 0
                        });
                    }
                }
            }
        }
    }

    return { mapId, returnMap, portals, npcs };
}

const zones = [
    { name: 'Gate to the Future', entry: 271000000, prefix: 271 },
    { name: 'Lion Heart Castle', entry: 211060000, prefix: 21106 },
    { name: 'Tera Forest & Neo City', entry: 240070000, prefix: 24007 },
    { name: 'Golden Temple', entry: 950000000, prefix: 9500 },
    { name: 'Crimsonwood Keep', entry: 610030000, prefix: 61003 },
    { name: 'Chryse (Orbis Sky Port)', entry: 200080100, prefix: 20008 }
];

console.log('=== DETALLES DE CADA ZONA (@jarvis) ===\n');

for (const z of zones) {
    console.log(`\n======================================================`);
    console.log(`ZONA: ${z.name} (Entrada: ${z.entry})`);
    const entryData = parseMap(z.entry);
    if (!entryData) {
        console.log(`  ERROR: No se encontró mapa ${z.entry}`);
        continue;
    }
    console.log(`  returnMap: ${entryData.returnMap}`);
    console.log(`  NPCs en mapa de entrada (${entryData.npcs.length}):`);
    for (const npc of entryData.npcs) {
        const sPath = path.join(SCRIPTS_NPC_ROOT, npc.id + '.js');
        const hasScript = fs.existsSync(sPath);
        console.log(`    NPC ${npc.id} en (${npc.x}, ${npc.y}) - Script: ${hasScript ? npc.id + '.js' : 'Sin script JS (usa WZ)'}`);
    }

    console.log(`  Portales en mapa de entrada (${entryData.portals.length}):`);
    for (const p of entryData.portals) {
        console.log(`    [Portal ${p.id} "${p.pn}"] tipo=${p.pt} tm=${p.tm} tn=${p.tn} script=${p.script} (${p.x}, ${p.y})`);
    }

    // Find all other maps in wz/Map.wz that share this prefix!
    const dir = 'Map' + Math.floor(z.entry / 100000000);
    const dirPath = path.join(WZ_MAP_ROOT, dir);
    const relatedFiles = fs.readdirSync(dirPath).filter(f => f.startsWith('' + z.prefix) && f.endsWith('.img.xml'));
    console.log(`  Total mapas existentes en wz/ con prefijo ${z.prefix}: ${relatedFiles.length}`);
    if (relatedFiles.length <= 15) {
        console.log(`  Mapas: ${relatedFiles.map(f => f.replace('.img.xml', '')).join(', ')}`);
    } else {
        console.log(`  Primeros 15 mapas: ${relatedFiles.slice(0, 15).map(f => f.replace('.img.xml', '')).join(', ')}...`);
    }
}
