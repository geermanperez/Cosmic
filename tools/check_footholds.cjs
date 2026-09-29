const fs = require('fs');

const xml = fs.readFileSync('wz/Map.wz/Map/Map2/211060200.img.xml', 'utf8');

const fhRegex = /<imgdir name="(\d+)">\s*<int name="x1" value="([^"]*)"\s*\/>\s*<int name="y1" value="([^"]*)"\s*\/>\s*<int name="x2" value="([^"]*)"\s*\/>\s*<int name="y2" value="([^"]*)"/g;
let m;
const fhs = [];
while ((m = fhRegex.exec(xml)) !== null) {
    fhs.push({
        id: m[1],
        x1: parseInt(m[2], 10),
        y1: parseInt(m[3], 10),
        x2: parseInt(m[4], 10),
        y2: parseInt(m[5], 10)
    });
}

// Portals:
// west00: (-340, 165)
// east00: (153, 163)
// up00: (149, -287)
console.log('west00 (-340, 165):', fhs.filter(f => Math.min(f.x1, f.x2) <= -340 && -340 <= Math.max(f.x1, f.x2)));
console.log('east00 (153, 163):', fhs.filter(f => Math.min(f.x1, f.x2) <= 153 && 153 <= Math.max(f.x1, f.x2)));
console.log('up00 (149, -287):', fhs.filter(f => Math.min(f.x1, f.x2) <= 149 && 149 <= Math.max(f.x1, f.x2)));
