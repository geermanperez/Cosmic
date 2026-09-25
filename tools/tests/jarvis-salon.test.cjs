const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');

function salon({ hair = 30000, face = 20000, gender = 0, nx = 20000, gm = false, exists } = {}) {
    const state = { previews: [], applied: [], charges: [], messages: [], disposed: false };
    let skin = 0;
    const cm = {
        getNX: () => nx,
        gainNX: amount => { nx += amount; state.charges.push(amount); },
        getPlayer: () => ({ getHair: () => hair, getFace: () => face, getGender: () => gender, isGM: () => gm, gmLevel: () => gm ? 1 : 0, getGMLevel: () => gm ? 1 : 0 }),
        isSkinColorAvailable: id => id >= 0 && id <= 17,
        isCosmeticEquipped: id => [skin, hair, face].includes(id),
        sendSimple: () => {},
        sendOk: message => state.messages.push(message),
        sendStyle: (_, styles) => state.previews.push(Array.from(styles)),
        setHair: id => { hair = id; state.applied.push(['hair', id]); },
        setFace: id => { face = id; state.applied.push(['face', id]); },
        setSkin: id => { skin = id; state.applied.push(['skin', id]); },
        dispose: () => { state.disposed = true; }
    };
    const Java = { type: name => {
        if (name === 'provider.wz.WZFiles') return { CHARACTER: { getFile: () => ({ resolve: name => path.join(root, 'wz/Character.wz', name) }) } };
        if (name === 'java.nio.file.Files') return { isRegularFile: exists || fs.existsSync };
        throw Error(name);
    } };
    const context = vm.createContext({ cm, Java });
    vm.runInContext(fs.readFileSync(path.join(root, 'scripts/npc/9900000.js'), 'utf8'), context);
    context.start();
    return { state, context, pick: (selection, mode = 1) => context.action(mode, 7, selection) };
}

test('four styles without dye variants never send an empty or invalid preview', () => {
    for (const hair of [30010, 30070, 30080, 30090]) {
        const s = salon({ hair }); s.pick(1);
        assert.deepEqual(s.state.previews, []);
        assert.equal(s.state.messages.length, 1);
        s.pick(0);
        assert.equal(s.state.disposed, true);
        assert.deepEqual(s.state.charges, []);
    }
});

test('every catalog page, gender and color only previews existing resources and applies the displayed ID', () => {
    for (const gender of [0, 1]) for (const category of [3, 4]) {
        for (let color = 0; color < (category === 3 ? 8 : 7); color++) {
            for (let page = 0; page < (category === 3 ? 10 : 5); page++) {
                const s = salon({ gender, hair: 30000 + color, face: 20000 + color * 100 });
                s.pick(category); s.pick(page);
                const ids = s.state.previews[0]; assert.ok(ids.length > 0);
                const kind = category === 3 ? 'Hair' : 'Face';
                for (const id of ids) assert.ok(fs.existsSync(path.join(root, 'wz/Character.wz', kind, String(id).padStart(8, '0') + '.img.xml')));
                s.pick(ids.length - 1); s.pick(0);
                assert.deepEqual(s.state.applied, [[kind.toLowerCase(), ids.at(-1)]]);
                assert.deepEqual(s.state.charges, [-10000]);
            }
        }
    }
});

test('skin and eye selections preserve preview indices and charge once', () => {
    for (const category of [0, 1, 2]) {
        const s = salon(); s.pick(category);
        const ids = s.state.previews[0];
        assert.ok(!ids.includes([0, 30000, 20000][category]));
        s.pick(ids.length - 1);
        assert.deepEqual(s.state.applied, [[[ 'skin', 'hair', 'face' ][category], ids.at(-1)]]);
        assert.deepEqual(s.state.charges, [-10000]);
    }
});

test('insufficient NX, cancellation, invalid selection and missing resources do not apply or charge', () => {
    for (const setup of [s => s.pick(0, 0), s => s.pick(-1), s => s.pick(999)]) {
        const s = salon(); s.pick(1); setup(s);
        assert.deepEqual(s.state.applied, []); assert.deepEqual(s.state.charges, []);
    }
    const s = salon({ nx: 0 }); s.pick(1); s.pick(0); s.pick(0);
    assert.equal(s.state.messages.length, 1);
    assert.equal(s.state.disposed, true);
    assert.deepEqual(s.state.applied, []); assert.deepEqual(s.state.charges, []);
    const missing = salon({ exists: () => false }); missing.pick(0); missing.pick(0);
    assert.deepEqual(missing.state.previews, []); assert.deepEqual(missing.state.charges, []);
});

test('GM changes remain free', () => {
    const s = salon({ gm: true, nx: 0 }); s.pick(2); s.pick(0);
    assert.equal(s.state.applied.length, 1); assert.deepEqual(s.state.charges, []);
});
