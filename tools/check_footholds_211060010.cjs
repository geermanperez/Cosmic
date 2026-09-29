const fs = require('fs');

const xml = fs.readFileSync('wz/Map.wz/Map/Map2/211060010.img.xml', 'utf8');

const fhRegex = /<imgdir name="(\d+)">\s*<int name="x1" value="([^"]*)"\s*\/>\s*<int name="y1" value="([^"]*)"\s*\/>\s*<int name="x2" value="([^"]*)"\s*\/>\s*<int name="y2" value="([^"]*)"/g;
let m;
while ((m = fhRegex.exec(xml)) !== null) {
    console.log(m[1].padStart(2), ':', m[2].padStart(5), m[3].padStart(5), 'to', m[4].padStart(5), m[5].padStart(5));
}
