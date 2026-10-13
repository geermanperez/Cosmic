// Run with: node --test tools/tests/von-leon-drops.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '../..');

test('Von Leon Mob WZ configurations', () => {
    // 8840000 (Von Leon Normal)
    const vlPath = path.join(REPO_ROOT, 'wz/Mob.wz/8840000.img.xml');
    assert.ok(fs.existsSync(vlPath), 'Mob 8840000.img.xml must exist');
    const vlXml = fs.readFileSync(vlPath, 'utf8');

    const vlLv = parseInt(vlXml.match(/name="level" value="(\d+)"/)[1], 10);
    const vlHp = parseInt(vlXml.match(/name="maxHP" value="(\d+)"/)[1], 10);
    const vlBoss = parseInt(vlXml.match(/name="boss" value="(\d+)"/)[1], 10);
    const vlExplosive = parseInt(vlXml.match(/name="explosiveReward" value="(\d+)"/)[1], 10);

    assert.equal(vlLv, 129, 'Von Leon level must be 129');
    assert.equal(vlHp, 550000000, 'Von Leon maxHP must be 550M');
    assert.equal(vlBoss, 1, 'Von Leon must have boss=1');
    assert.equal(vlExplosive, 1, 'Von Leon must have explosiveReward=1 for proper drop spread');

    // 8860008 (Chaos Von Leon)
    const cvlPath = path.join(REPO_ROOT, 'wz/Mob.wz/8860008.img.xml');
    assert.ok(fs.existsSync(cvlPath), 'Mob 8860008.img.xml must exist');
    const cvlXml = fs.readFileSync(cvlPath, 'utf8');

    const cvlLv = parseInt(cvlXml.match(/name="level" value="(\d+)"/)[1], 10);
    const cvlHp = parseInt(cvlXml.match(/name="maxHP" value="(\d+)"/)[1], 10);
    const cvlBoss = parseInt(cvlXml.match(/name="boss" value="(\d+)"/)[1], 10);
    const cvlExplosive = parseInt(cvlXml.match(/name="explosiveReward" value="(\d+)"/)[1], 10);

    assert.equal(cvlLv, 140, 'Chaos Von Leon level must be 140');
    assert.equal(cvlHp, 880000000, 'Chaos Von Leon maxHP must be 880M');
    assert.equal(cvlBoss, 1, 'Chaos Von Leon must have boss=1');
    assert.equal(cvlExplosive, 1, 'Chaos Von Leon must have explosiveReward=1 for proper drop spread');
});

test('Von Leon naming in String.wz', () => {
    const mobStrPath = path.join(REPO_ROOT, 'wz/String.wz/Mob.img.xml');
    assert.ok(fs.existsSync(mobStrPath), 'Mob.img.xml must exist');
    const mobStrXml = fs.readFileSync(mobStrPath, 'utf8');

    const m1 = mobStrXml.match(/<imgdir name="8840000">[\s\S]*?<string name="name" value="([^"]+)"/);
    assert.ok(m1, 'String for 8840000 must exist');
    assert.equal(m1[1], 'Von Leon', 'Name for 8840000 must be Von Leon');

    const m2 = mobStrXml.match(/<imgdir name="8860008">[\s\S]*?<string name="name" value="([^"]+)"/);
    assert.ok(m2, 'String for 8860008 must exist');
    assert.equal(m2[1], 'Chaos Von Leon', 'Name for 8860008 must be Chaos Von Leon');
});

test('Liquibase extension 20261013-von-leon-drops.xml integrity and drop validation', () => {
    const extPath = path.join(REPO_ROOT, 'src/main/resources/db/extensions/20261013-von-leon-drops.xml');
    assert.ok(fs.existsSync(extPath), 'Extension 20261013-von-leon-drops.xml must exist');
    const extContent = fs.readFileSync(extPath, 'utf8');

    assert.ok(extContent.includes('<changeSet id="20261013-von-leon-drops"'), 'Must have correct changeSet id');
    assert.ok(extContent.includes('DELETE FROM drop_data WHERE dropperid IN (8840000, 8860008);'), 'Must have idempotent delete');

    // Load String.wz data for item validation
    const stringData = {
        Eqp: fs.readFileSync(path.join(REPO_ROOT, 'wz/String.wz/Eqp.img.xml'), 'utf8'),
        Consume: fs.readFileSync(path.join(REPO_ROOT, 'wz/String.wz/Consume.img.xml'), 'utf8'),
        Etc: fs.readFileSync(path.join(REPO_ROOT, 'wz/String.wz/Etc.img.xml'), 'utf8')
    };

    function itemExistsInStrings(itemId) {
        for (const cat of ['Eqp', 'Consume', 'Etc']) {
            if (stringData[cat].includes(`<imgdir name="${itemId}">`)) {
                return true;
            }
        }
        return false;
    }

    function equipFileExists(itemId) {
        const dirs = ['Weapon', 'Cap', 'Coat', 'Pants', 'Shoes', 'Glove', 'Cape', 'Accessory', 'Ring', 'Shield'];
        const s = itemId.toString().padStart(8, '0');
        for (const d of dirs) {
            if (fs.existsSync(path.join(REPO_ROOT, 'wz/Character.wz', d, `${s}.img.xml`))) {
                return true;
            }
        }
        return false;
    }

    // Extract all inserted rows
    const rowRegex = /\((\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(-?\d+),\s*(\d+)\)/g;
    let match;
    const drops = [];
    const seenPairs = new Set();

    while ((match = rowRegex.exec(extContent)) !== null) {
        const dropperId = parseInt(match[1], 10);
        const itemId = parseInt(match[2], 10);
        const minQ = parseInt(match[3], 10);
        const maxQ = parseInt(match[4], 10);
        const questId = parseInt(match[5], 10);
        const chance = parseInt(match[6], 10);

        const pairKey = `${dropperId}-${itemId}`;
        assert.ok(!seenPairs.has(pairKey), `Duplicate drop detected: dropper ${dropperId}, item ${itemId}`);
        seenPairs.add(pairKey);

        assert.ok([8840000, 8860008].includes(dropperId), `Invalid dropperId: ${dropperId}`);
        assert.ok(chance > 0 && chance <= 1000000, `Chance out of bounds: ${chance} for item ${itemId}`);
        assert.ok(minQ > 0, `minQ must be > 0: ${minQ} for item ${itemId}`);
        assert.ok(maxQ >= minQ, `maxQ must be >= minQ: [${minQ}, ${maxQ}] for item ${itemId}`);

        // Mesos validation
        if (itemId === 0) {
            assert.ok(maxQ > minQ, `For mesos, maxQ must be strictly greater than minQ to prevent Randomizer.nextInt(0) crash: [${minQ}, ${maxQ}]`);
        } else {
            // Multiple item quantity validation
            if (maxQ !== 1) {
                assert.ok(maxQ > minQ, `For multiple item quantities (max != 1), maxQ must be > minQ to prevent Randomizer.nextInt(0) crash: [${minQ}, ${maxQ}]`);
            }
            // Check that item exists in client strings
            assert.ok(itemExistsInStrings(itemId), `Item ${itemId} missing from String.wz`);

            // If equipment, ensure Character.wz XML file exists
            if (itemId >= 1000000 && itemId < 2000000) {
                assert.ok(equipFileExists(itemId), `Equipment ${itemId} missing from Character.wz`);
            }
        }

        drops.push({ dropperId, itemId, minQ, maxQ, questId, chance });
    }

    const vlDrops = drops.filter(d => d.dropperId === 8840000);
    const cvlDrops = drops.filter(d => d.dropperId === 8860008);

    assert.ok(vlDrops.length >= 40, `Von Leon should have comprehensive drop table, found ${vlDrops.length}`);
    assert.ok(cvlDrops.length >= 40, `Chaos Von Leon should have comprehensive drop table, found ${cvlDrops.length}`);

    // Verify key categories present in both
    for (const [dropperId, dropList] of [[8840000, vlDrops], [8860008, cvlDrops]]) {
        assert.ok(dropList.some(d => d.itemId === 0), `Dropper ${dropperId} missing meso drop`);
        assert.ok(dropList.some(d => d.itemId === 2000005), `Dropper ${dropperId} missing Power Elixir`);
        assert.ok(dropList.some(d => d.itemId === 2049100), `Dropper ${dropperId} missing Chaos Scroll 60%`);
        assert.ok(dropList.some(d => d.itemId === 4021010), `Dropper ${dropperId} missing Rock of Time`);
        assert.ok(dropList.some(d => d.itemId >= 2290000 && d.itemId < 2300000), `Dropper ${dropperId} missing Mastery Books`);
    }

    // Von Leon drops Reverse equipment, Chaos Von Leon drops Timeless equipment
    assert.ok(vlDrops.some(d => d.itemId === 1302086), 'Von Leon must drop Reverse Executioners');
    assert.ok(cvlDrops.some(d => d.itemId === 1302081), 'Chaos Von Leon must drop Timeless Executioners');
});
