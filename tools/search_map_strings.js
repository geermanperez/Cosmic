const fs = require('fs');
const path = require('path');

const mapStrPath = path.join(__dirname, '..', 'wz', 'String.wz', 'Map.img.xml');
if (!fs.existsSync(mapStrPath)) {
    console.log('Map.img.xml not found');
    process.exit(0);
}

const content = fs.readFileSync(mapStrPath, 'utf8');
const regex = /<imgdir name="(\d+)">[\s\S]*?<string name="mapName" value="([^"]*)"/g;
let m;
const results = [];
while ((m = regex.exec(content)) !== null) {
    const id = m[1];
    const name = m[2];
    if (/golden|temple|ravana|monkey|goblin|stone gargoyle/i.test(name)) {
        results.push({ id, name });
    }
}

console.log('Total results for Golden Temple / Ravana in String.wz:', results.length);
for (const r of results) {
    console.log(r.id, ':', r.name);
}
