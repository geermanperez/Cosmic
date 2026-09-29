const fs = require('fs');

const xml = fs.readFileSync('wz/Map.wz/Map/Map2/211060010.img.xml', 'utf8');

console.log('--- 211060010 INFO ---');
const infoMatch = xml.match(/<imgdir name="info">([\s\S]*?)<\/imgdir>/);
if (infoMatch) console.log(infoMatch[1]);

console.log('--- 211060010 PORTALS ---');
const pMatch = xml.match(/<imgdir name="portal">([\s\S]*?)<\/imgdir>/);
if (pMatch) console.log(pMatch[1]);

console.log('--- 211060010 LIFE ---');
const lMatch = xml.match(/<imgdir name="life">([\s\S]*?)<\/imgdir>/);
if (lMatch) console.log(lMatch[1]);
