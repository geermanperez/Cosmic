const fs = require('fs');

const strContent = fs.readFileSync('wz/String.wz/Map.img.xml', 'utf8');
const idx = strContent.indexOf('name="211040600"');
console.log(strContent.substring(idx, idx + 300));
