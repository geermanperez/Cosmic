const fs = require('fs');
const path = require('path');

// 1. Load String.wz XML files to build item id -> name map
const stringWzDir = path.join(__dirname, '../../wz/String.wz');
const xmlFiles = ['Eqp.img.xml', 'Consume.img.xml', 'Etc.img.xml', 'Ins.img.xml', 'Cash.img.xml'];

const itemNames = new Map();
itemNames.set(0, 'Mesos');

for (const file of xmlFiles) {
    const fullPath = path.join(stringWzDir, file);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');

    // Parse items: <imgdir name="ITEMID"> ... <string name="name" value="ITEMNAME"/>
    // Using regex for speed
    const regex = /<imgdir name="(\d+)">[\s\S]*?<string name="name" value="([^"]*)"/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const id = parseInt(match[1], 10);
        const name = match[2];
        if (!itemNames.has(id)) {
            itemNames.set(id, name);
        }
    }
}

// 2. Parse 152-drop-data.sql
const sqlPath = path.join(__dirname, '../../src/main/resources/db/data/152-drop-data.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

// Match rows: (dropperid, itemid, min_q, max_q, questid, chance)
const rowRegex = /\((\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/g;
let match;

const pb0Drops = [];
const pb1Drops = [];

while ((match = rowRegex.exec(sqlContent)) !== null) {
    const dropperId = parseInt(match[1], 10);
    const itemId = parseInt(match[2], 10);
    const minQ = parseInt(match[3], 10);
    const maxQ = parseInt(match[4], 10);
    const questId = parseInt(match[5], 10);
    const chance = parseInt(match[6], 10);

    const record = {
        dropperId,
        itemId,
        name: itemNames.get(itemId) || (itemId === 0 ? 'Mesos' : 'Unknown (' + itemId + ')'),
        minQ,
        maxQ,
        questId,
        chance,
        chancePct: (chance / 10000).toFixed(2) + '%',
        source: 'drop_data (152-drop-data.sql)'
    };

    if (dropperId === 8820000) {
        pb0Drops.push(record);
    } else if (dropperId === 8820001) {
        pb1Drops.push(record);
    }
}

console.log('=== VERIFICACIÓN DE DROPS DE PINK BEAN ===');
console.log(`Total drops asignados a 8820000 (Trono): ${pb0Drops.length}`);
console.log(`Total drops asignados a 8820001 (Pink Bean vulnerable): ${pb1Drops.length}`);

if (pb0Drops.length > 0) {
    console.error('ALERTA: 8820000 todavía tiene drops asignados!');
} else {
    console.log('OK: 8820000 (Trono) tiene 0 drops en drop_data.');
}

const chairDrop = pb1Drops.find(d => d.itemId === 3010073);
if (chairDrop) {
    console.log(`OK: Pink Bean Chair (3010073 - ${chairDrop.name}) presente: Chance=${chairDrop.chance} (${chairDrop.chancePct}), Cantidad=${chairDrop.minQ}-${chairDrop.maxQ}`);
} else {
    console.error('ALERTA: Pink Bean Chair (3010073) NO encontrada en 8820001!');
}

const rotDrop = pb1Drops.find(d => d.itemId === 4021010);
if (rotDrop) {
    console.log(`OK: Rock of Time (4021010 - ${rotDrop.name}) presente: Chance=${rotDrop.chance} (${rotDrop.chancePct}), Cantidad=${rotDrop.minQ}-${rotDrop.maxQ}`);
} else {
    console.error('ALERTA: Rock of Time (4021010) NO encontrada en 8820001!');
}

const potDrop = pb1Drops.find(d => d.itemId === 4020009);
console.log(`Info Piece of Time (4020009): ${potDrop ? 'Presente en 8820001' : 'NO presente en 8820001 (Normal para v83: mob común drop)'}`);

const hatDrop = pb1Drops.find(d => d.itemId === 1002971);
const suitDrop = pb1Drops.find(d => d.itemId === 1052202);
console.log(`Pink Bean Hat: Cantidad ${hatDrop?.minQ}-${hatDrop?.maxQ}, Chance: ${hatDrop?.chancePct}`);
console.log(`Pink Bean Suit: Cantidad ${suitDrop?.minQ}-${suitDrop?.maxQ}, Chance: ${suitDrop?.chancePct}`);

// Guardar lista completa en JSON para referencia
fs.writeFileSync(path.join(__dirname, 'verified_pb_drops.json'), JSON.stringify(pb1Drops, null, 2));
console.log(`Guardado listado en tools/tests/verified_pb_drops.json`);

// Generar tabla markdown
let md = '| Mob ID | Item ID | Nombre | Chance Base | Probabilidad | Cantidad | Origen |\n';
md += '|---|---|---|---|---|---|---|\n';
for (const d of pb1Drops) {
    md += `| ${d.dropperId} | ${d.itemId} | ${d.name} | ${d.chance} / 1,000,000 | ${d.chancePct} | ${d.minQ}-${d.maxQ} | drop_data |\n`;
}
fs.writeFileSync(path.join(__dirname, 'pb_drops_table.md'), md);
console.log(`Guardada tabla markdown en tools/tests/pb_drops_table.md`);
