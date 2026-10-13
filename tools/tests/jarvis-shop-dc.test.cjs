const { test } = require('node:test');
const assert = require('node:assert/strict');

// Jarvis shop items as defined in 20260928-jarvis-shop.xml
const explicitItems = [
    2002023, 2000005, 2000004, 2020015, 2020014, 2020013, 2020012, 2002021, 2002020,
    2050004, 2050001, 2050000, 2050002, 2000002, 2000006, 2022003, 2022000, 2000001,
    2000000, 2000003, 2002017, 2002018, 2002004, 2002002, 2002001, 2002005, 2070000,
    2330000, 2060000, 2061000, 2060001, 2061001, 2030000, 2120000
];

// Rechargeable pool appended by Shop.java
const stars = [];
for (let id = 2070000; id <= 2070016; id++) if (id !== 2070014) stars.push(id);
stars.push(2070018, 2331000, 2332000);
for (let id = 2330000; id <= 2330005; id++) stars.push(id);
const recharges = stars.filter(id => !explicitItems.includes(id));
const allItems = [...explicitItems, ...recharges];

function isStockRechargeable(itemId) {
    const isStar = (itemId >= 2070000 && itemId <= 2070016) || itemId === 2070018;
    const isBullet = (itemId >= 2330000 && itemId <= 2330005) || itemId === 2331000 || itemId === 2332000;
    return isStar || isBullet;
}

function isWireRechargeable(itemId) {
    return Math.floor(itemId / 10000) === 206 || isStockRechargeable(itemId);
}

// Client parser (simulating YunaMS hook at 0x752A53)
function simulateClientParsing(buffer) {
    let offset = 0;
    const opcode = buffer.readUInt16LE(offset); offset += 2;
    const shopId = buffer.readUInt32LE(offset); offset += 4;
    const itemCount = buffer.readUInt16LE(offset); offset += 2;

    assert.equal(opcode, 305, 'Opcode must be OPEN_NPC_SHOP (305)');
    assert.equal(shopId, 9999802, 'Shop ID must be 9999802');

    const parsedItems = [];
    for (let i = 0; i < itemCount; i++) {
        const itemId = buffer.readInt32LE(offset); offset += 4;
        const price = buffer.readInt32LE(offset); offset += 4;
        const pitch = buffer.readInt32LE(offset); offset += 4;
        const minutes = buffer.readInt32LE(offset); offset += 4;
        const hmm = buffer.readInt32LE(offset); offset += 4;

        // YunaMS client hook at 0x752A53 routes 206 (arrows), 207 (stars), 233 (bullets) to double + short
        const category = Math.floor(itemId / 10000);
        if (category === 206 || category === 207 || category === 233) {
            const unitPrice = buffer.readDoubleLE(offset); offset += 8;
            const slotMax = buffer.readUInt16LE(offset); offset += 2;
            parsedItems.push({ itemId, price, type: 'rechargeable', unitPrice, slotMax });
        } else {
            const stacksize = buffer.readUInt16LE(offset); offset += 2;
            const buyable = buffer.readUInt16LE(offset); offset += 2;
            parsedItems.push({ itemId, price, type: 'standard', stacksize, buyable });
        }
    }

    return { parsedItems, remainingBytes: buffer.length - offset };
}

// Packet encoders
function encodeShopPacket(useWireRechargeableForArrows) {
    let size = 2 + 4 + 2;
    for (const id of allItems) {
        size += 20;
        const isRecharge = useWireRechargeableForArrows ? isWireRechargeable(id) : isStockRechargeable(id);
        size += isRecharge ? 10 : 4;
    }

    const buf = Buffer.alloc(size);
    let offset = 0;
    buf.writeUInt16LE(305, offset); offset += 2;
    buf.writeUInt32LE(9999802, offset); offset += 4;
    buf.writeUInt16LE(allItems.length, offset); offset += 2;

    for (const id of allItems) {
        buf.writeInt32LE(id, offset); offset += 4;
        buf.writeInt32LE(100, offset); offset += 4;
        buf.writeInt32LE(0, offset); offset += 4;
        buf.writeInt32LE(0, offset); offset += 4;
        buf.writeInt32LE(0, offset); offset += 4;

        const isRecharge = useWireRechargeableForArrows ? isWireRechargeable(id) : isStockRechargeable(id);
        if (!isRecharge) {
            buf.writeUInt16LE(1, offset); offset += 2;
            buf.writeUInt16LE(1000, offset); offset += 2;
        } else {
            buf.writeDoubleLE(0.3, offset); offset += 8;
            buf.writeUInt16LE(1000, offset); offset += 2;
        }
    }

    return buf;
}

test('Reproduce Disconnect: Stock encoding yields exactly 1526 bytes and corrupts item 29 to ID 0', () => {
    const brokenBuffer = encodeShopPacket(false);
    assert.equal(brokenBuffer.length, 1526, 'Evidence exact match: responseBytes must be 1526');

    const result = simulateClientParsing(brokenBuffer);
    assert.equal(result.parsedItems.length, 57);

    // Item 28 is the first arrow (2060000). The server encoded 4 bytes, but client consumed 10 bytes (6-byte desync).
    assert.equal(result.parsedItems[28].itemId, 2060000, 'Item 28 was correctly read as 2060000');
    // Because of the 6-byte desync, Item 29 reads zeros for itemId -> itemId: 0.
    // In MapleStory v83 client, itemId 0 causes NULL pointer crash in CShopDlg / CItemInfo, disconnecting Eren after 34ms!
    assert.equal(result.parsedItems[29].itemId, 0, 'Item 29 is corrupted to ID 0 due to 6-byte arrow trailer desync');
});

test('Confirm Fix: Yuna wire encoding yields exactly 1550 bytes and parses flawlessly without corruption', () => {
    const fixedBuffer = encodeShopPacket(true);
    assert.equal(fixedBuffer.length, 1550, 'Fixed packet length must be 1550 (1526 + 4 arrows * 6 bytes)');

    const result = simulateClientParsing(fixedBuffer);
    assert.equal(result.parsedItems.length, 57);
    assert.equal(result.remainingBytes, 0, 'Must have zero remaining bytes after clean parse');

    // All items must have valid, non-zero IDs
    for (let i = 0; i < result.parsedItems.length; i++) {
        assert.notEqual(result.parsedItems[i].itemId, 0, `Item ${i} must not be zero`);
    }

    // Verify arrow items were decoded cleanly with valid item IDs and correct positions
    assert.equal(result.parsedItems[28].itemId, 2060000);
    assert.equal(result.parsedItems[29].itemId, 2061000);
    assert.equal(result.parsedItems[30].itemId, 2060001);
    assert.equal(result.parsedItems[31].itemId, 2061001);
    assert.equal(result.parsedItems[32].itemId, 2030000);
    assert.equal(result.parsedItems[33].itemId, 2120000);
});
