const fs = require('fs');
const path = require('path');

const map2Dir = 'wz/Map.wz/Map/Map2';
const files = fs.readdirSync(map2Dir).filter(f => f.startsWith('21106') && f.endsWith('.img.xml'));

for (const file of files) {
    const xml = fs.readFileSync(path.join(map2Dir, file), 'utf8');
    const pStart = xml.indexOf('<imgdir name="portal">');
    if (pStart === -1) continue;
    
    // Find all script tags in portal
    const sMatches = xml.substring(pStart).matchAll(/<string name="script" value="([^"]*)"/g);
    for (const m of sMatches) {
        const val = m[1];
        if (val) {
            console.log(`Map ${file.replace('.img.xml', '')} portal script: "${val}"`);
            const sPath = path.join('scripts/portal', `${val}.js`);
            const exists = fs.existsSync(sPath);
            if (!exists) {
                console.log(`  --> MISSING SCRIPT FILE: ${sPath}`);
            }
        }
    }
}
