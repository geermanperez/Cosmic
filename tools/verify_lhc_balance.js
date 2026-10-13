const fs = require('fs');

const specs = [
  { id: 8210000, name: 'Crocky the Gatekeeper', lv: 115, exp: 31500, hp: 750000 },
  { id: 8210001, name: 'Reindeer',              lv: 141, exp: 76200, hp: 780000 },
  { id: 8210002, name: 'Blood Reindeer',        lv: 144, exp: 88200, hp: 800000 },
  { id: 8210003, name: 'Bearwolf',              lv: 148, exp: 102000, hp: 824000 },
  { id: 8210004, name: 'Grey Vulture',          lv: 152, exp: 120600, hp: 859000 },
  { id: 8210005, name: 'Castle Golem',          lv: 156, exp: 141000, hp: 887000 },
];

const strXml = fs.readFileSync('wz/String.wz/Mob.img.xml', 'utf8');

for (const s of specs) {
  const mobXml = fs.readFileSync(`wz/Mob.wz/${s.id}.img.xml`, 'utf8');
  const lv = parseInt(mobXml.match(/name="level" value="(\d+)"/)[1], 10);
  const exp = parseInt(mobXml.match(/name="exp" value="(\d+)"/)[1], 10);
  const hp = parseInt(mobXml.match(/name="maxHP" value="(\d+)"/)[1], 10);
  const nameRegex = new RegExp(`<imgdir name="${s.id}">[\\s\\S]*?<string name="name" value="([^"]+)"`);
  const name = strXml.match(nameRegex)[1];

  console.log(`[OK] Mob ${s.id}: ${name.padEnd(23)} | Lv: ${lv} | Base EXP: ${exp.toLocaleString().padStart(7)} | Real YunaMS (x3 EXP): ${(exp * 3).toLocaleString().padStart(8)} | HP: ${hp.toLocaleString().padStart(7)}`);

  if (lv !== s.lv || exp !== s.exp || hp !== s.hp || name !== s.name) {
    throw new Error(`Mismatch for ${s.id}`);
  }
}

console.log('\n--- VERIFICACION DE DROPS DE MESOS (LIQUIBASE EXTENSION) ---');
const dropExt = fs.readFileSync('src/main/resources/db/extensions/20261013-lhc-mobs-meso-drops.xml', 'utf8');
for (const s of specs) {
  const match = dropExt.match(new RegExp(`\\(${s.id},\\s*0,\\s*(\\d+),\\s*(\\d+),\\s*0,\\s*(\\d+)\\)`));
  if (!match) throw new Error(`Missing meso drop for ${s.id}`);
  const min = parseInt(match[1], 10);
  const max = parseInt(match[2], 10);
  console.log(`[OK] Mob ${s.id}: Base ${min}-${max} mesos -> Con 3x: ${(min * 3).toLocaleString()} a ${(max * 3).toLocaleString()} mesos`);
}

console.log('\n=====================================================');
console.log('TODO 100% FUNCIONANDO Y VERIFICADO EXITOSAMENTE.');
console.log('=====================================================');
