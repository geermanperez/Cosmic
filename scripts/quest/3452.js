var status = -1;

function end(mode, type, selection) {
    status++;
    if (mode != 1) {
        qm.dispose();
    } else {
        if (status == 0) {
            qm.sendNext("Toma estos#bPíldoras de elixir de maná#kcomo muestra de mi agradecimiento.");
        } else if (status == 1) {
            const InventoryType = Java.type('client.inventory.InventoryType');
            if (qm.getPlayer().getInventory(InventoryType.USE).getNumFreeSlot() >= 1) {
                qm.gainItem(4000099, -1);
                qm.gainItem(2000011, 50);
                qm.gainExp(8000);
                qm.forceCompleteQuest();
                qm.dispose();
            } else {
                qm.sendNext("¿Mmm? Parece que tu inventario está lleno.");
            }
        } else if (status == 2) {
            qm.dispose();
        }
    }
}