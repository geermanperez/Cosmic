const fs = require('fs');

const strContent = fs.readFileSync('wz/String.wz/Mob.img.xml', 'utf8');
const idx = strContent.indexOf('name="8210000"');
console.log(strContent.substring(idx, idx + 200));
