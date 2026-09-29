const fs = require('fs');
const path = require('path');

const strContent = fs.readFileSync('wz/String.wz/Map.img.xml', 'utf8');
function getMapName(id) {
    const idx = strContent.indexOf('name="' + id + '"');
    if (idx === -1) return 'NOT FOUND';
    const chunk = strContent.substring(idx, idx + 400);
    const mName = chunk.match(/<string name="mapName" value="([^"]*)"/);
    const sName = chunk.match(/<string name="streetName" value="([^"]*)"/);
    return (sName ? sName[1] : '') + ' : ' + (mName ? mName[1] : '');
}

const maps = [211060000, 211060010, 211060100, 211060200, 211060300, 211060400, 211060500, 211060600, 211060700, 211060800];
maps.forEach(id => {
    console.log(id, getMapName(id));
});
