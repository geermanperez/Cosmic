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
    const portalStart = xmlContent.indexOf('<imgdir name="portal">');
    if (portalStart === -1) return portals;

    // Find the matching </imgdir> for <imgdir name="portal">
    let depth = 0;
    let idx = portalStart;
    let portalEnd = -1;
    const tagRegex = /<\/?imgdir\b[^>]*>/g;
    tagRegex.lastIndex = portalStart;

    let tagMatch;
    while ((tagMatch = tagRegex.exec(xmlContent)) !== null) {
        if (tagMatch[0].startsWith('</')) {
            depth--;
            if (depth === 0) {
                portalEnd = tagMatch.index + tagMatch[0].length;
                break;
            }
        } else if (!tagMatch[0].endsWith('/>')) {
            depth++;
        }
    }

    if (portalEnd === -1) return portals;
    const portalSection = xmlContent.slice(portalStart, portalEnd);

    // Each child <imgdir name="N"> inside portal
    const childRegex = /<imgdir name="(\d+)">([\s\S]*?)<\/imgdir>/g;
    let childMatch;
    while ((childMatch = childRegex.exec(portalSection)) !== null) {
        const id = parseInt(childMatch[1], 10);
        const body = childMatch[2];

        const getAttr = (name, tag) => {
            const m = body.match(new RegExp('<' + tag + ' name="' + name + '" value="([^"]*)"'));
            return m ? m[1] : null;
        };
        const getInt = (name) => {
            const v = getAttr(name, 'int');
            return v !== null ? parseInt(v, 10) : null;
        };

        portals.push({
            id: id,
            pn: getAttr('pn', 'string'),
            pt: getInt('pt'),
            tm: getInt('tm'),
            tn: getAttr('tn', 'string'),
            script: getAttr('script', 'string'),
            x: getInt('x'),
            y: getInt('y')
        });
    }
    return portals;
}

const zonesToCheck = [
    { name: 'Gate to the Future', prefix: '271', folder: 'Map2' },
    { name: 'Lion Heart Castle', prefix: '21106', folder: 'Map2' },
    { name: 'Tera Forest & Neo City', prefix: '24007', folder: 'Map2' },
    { name: 'Golden Temple', prefix: '9500', folder: 'Map9' },
    { name: 'Crimsonwood Keep', prefix: '61003', folder: 'Map6' },
    { name: 'Chryse (Orbis Sky Port)', prefix: '20008', folder: 'Map2' }
];

console.log('=== AUDITORÍA COMPLETA DE TODOS LOS MAPAS DE CADA ZONA ===\n');

for (const z of zonesToCheck) {
    console.log('======================================================================');
    console.log(`ZONA: ${z.name} (Prefijo: ${z.prefix})`);
    const dirPath = path.join(WZ_MAP_ROOT, z.folder);
    const mapFiles = fs.readdirSync(dirPath)
        .filter(f => f.startsWith(z.prefix) && f.endsWith('.img.xml'))
        .map(f => parseInt(f.replace('.img.xml', ''), 10));

    console.log(`  Mapas en WZ: ${mapFiles.length}`);

    const missingScripts = new Map(); // scriptName -> [mapIds]
    const missingTargets = [];
    const tnFallbacks = [];

    for (const mapId of mapFiles) {
        const p = getMapXmlPath(mapId);
        const xml = fs.readFileSync(p, 'utf8');
        const portals = parsePortals(xml);

        for (const port of portals) {
            if (port.script) {
                const sPath = path.join(SCRIPTS_PORTAL_ROOT, port.script + '.js');
                if (!fs.existsSync(sPath)) {
                    if (!missingScripts.has(port.script)) {
                        missingScripts.set(port.script, []);
                    }
                    missingScripts.get(port.script).push(`${mapId} (portal '${port.pn}' id=${port.id})`);
                }
            }
            if (port.tm && port.tm !== 999999999 && port.tm !== mapId) {
                const targetP = getMapXmlPath(port.tm);
                if (!targetP) {
                    missingTargets.push(`Mapa ${mapId} portal '${port.pn}' -> Destino ${port.tm} NO EXISTE`);
                } else if (port.tn) {
                    const targetXml = fs.readFileSync(targetP, 'utf8');
                    const targetPortals = parsePortals(targetXml);
                    const targetPort = targetPortals.find(tp => tp.pn === port.tn);
                    if (!targetPort) {
                        const has0 = targetPortals.some(tp => tp.id === 0);
                        tnFallbacks.push(`Mapa ${mapId} portal '${port.pn}' -> Destino ${port.tm} no tiene '${port.tn}' (fallback portal 0: ${has0})`);
                    }
                }
            }
        }
    }

    console.log(`  Scripts faltantes (${missingScripts.size}):`);
    if (missingScripts.size === 0) {
        console.log(`    Ninguno.`);
    } else {
        for (const [script, maps] of missingScripts.entries()) {
            console.log(`    - scripts/portal/${script}.js (usado en: ${maps.join(', ')})`);
        }
    }

    console.log(`  Mapas destino faltantes (${missingTargets.length}):`);
    if (missingTargets.length === 0) {
        console.log(`    Ninguno.`);
    } else {
        for (const mt of missingTargets) console.log(`    - ${mt}`);
    }

    console.log(`  Desalineaciones de tn (portales de llegada faltantes) (${tnFallbacks.length}):`);
    if (tnFallbacks.length === 0) {
        console.log(`    Ninguno.`);
    } else {
        for (const fb of tnFallbacks) console.log(`    - ${fb}`);
    }
    console.log('');
}

