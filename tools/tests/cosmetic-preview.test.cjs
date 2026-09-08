// Run from any directory: node --test tools/tests/cosmetic-preview.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function openCatalog(npc, category, resolve = id => id) {
    const state = { previews: [], applied: [], disposed: false };
    const cm = {
        getPlayer: () => ({ getHair: () => 30000, getFace: () => 20000 }),
        getCosmeticItem: id => {
            assert.ok(id >= 100, 'Skin IDs must not be resolved as items');
            return resolve(id);
        },
        isCosmeticEquipped: id => [0, 30000, 20000].includes(id),
        sendSimple: () => {},
        sendOk: () => {},
        sendStyle: (message, styles) => state.previews.push(Array.from(styles)),
        setSkin: id => state.applied.push(['skin', id]),
        setHair: id => state.applied.push(['hair', id]),
        setFace: id => state.applied.push(['face', id]),
        dispose: () => { state.disposed = true; }
    };
    const context = vm.createContext({ cm });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../../scripts/npc', npc + '.js'), 'utf8'), context);
    context.start();
    context.action(1, 4, category);
    return { context, state };
}

for (const npc of [9900000, 9900001]) {
    test(`${npc}: filter unavailable, equipped and duplicate fallback styles`, () => {
        const resolve = id => id === 30001 ? -1 : id === 30002 ? 30000 : id === 30003 ? 30004 : id;
        const { context, state } = openCatalog(npc, 1, resolve);
        assert.deepEqual(state.previews, [[30004, 30005, 30006, 30007]]);
        context.action(1, 7, 0);
        assert.deepEqual(state.applied, [['hair', 30004]]);
    });

    test(`${npc}: skin preview excludes current skin without item lookup`, () => {
        const { context, state } = openCatalog(npc, 0);
        assert.deepEqual(state.previews, [[1, 2, 3, 4]]);
        context.action(1, 7, 0);
        assert.deepEqual(state.applied, [['skin', 1]]);
    });

    test(`${npc}: empty category closes without sending a preview`, () => {
        const { state } = openCatalog(npc, 1, () => -1);
        assert.deepEqual(state.previews, []);
        assert.equal(state.disposed, true);
    });

    test(`${npc}: cancel and invalid selections never apply a style`, () => {
        for (const [mode, selection] of [[0, 0], [1, -1], [1, 999]]) {
            const { context, state } = openCatalog(npc, 1);
            context.action(mode, 7, selection);
            assert.deepEqual(state.applied, []);
            assert.equal(state.disposed, true);
        }
    });

    const categories = npc === 9900000
        ? [0, 1, 2, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 30, 31, 32, 40, 41, 42, 50, 51]
        : [0, 1, 2, 10, 11, 30, 31];
    test(`${npc}: every category applies the exact displayed selection`, () => {
        for (const category of categories) {
            const { state } = openCatalog(npc, category);
            const preview = state.previews[0];
            assert.ok(preview.length > 0 && preview.length <= 120);
            assert.ok(preview.every(id => ![0, 30000, 20000].includes(id)));
            for (const index of [0, preview.length - 1]) {
                const next = openCatalog(npc, category);
                next.context.action(1, 7, index);
                const kind = category === 0 ? 'skin' : category === 1 || category >= 10 && category < 30 ? 'hair' : 'face';
                assert.deepEqual(next.state.applied, [[kind, preview[index]]]);
            }
        }
    });
}
