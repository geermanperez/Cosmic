const fs = require('fs');

const xml = fs.readFileSync('wz/Map.wz/Map/Map2/211060100.img.xml', 'utf8');

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

console.log(`Total footholds in 211060100: ${fhs.length}`);
const under = fhs.filter(f => Math.min(f.x1, f.x2) <= 915 && 915 <= Math.max(f.x1, f.x2));
console.log('Footholds spanning x = 915:', under);
