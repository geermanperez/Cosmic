const fs = require('fs');

const xml = fs.readFileSync('wz/Map.wz/Map/Map2/211060100.img.xml', 'utf8');

// Portals in 211060100
const pRegex = /<imgdir name="(\d+)">([\s\S]*?)<\/imgdir>/g;
const pSec = xml.match(/<imgdir name="portal">([\s\S]*?)<\/imgdir>\s*<imgdir/);
console.log('211060100 Portals raw:');
if (pSec) {
    let m;
    while ((m = pRegex.exec(pSec[1])) !== null) {
        console.log(`Portal ${m[1]}:`, m[2].trim().replace(/\s+/g, ' '));
    }
}
