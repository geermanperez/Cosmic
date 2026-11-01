var status = -1;

function end(mode, type, selection) {
    status++;
    if (mode != 1) {
        qm.dispose();
    } else {
        if (status == 0) {
            qm.sendOk("¡Excelente! Conseguiste la hierba que necesito. como un#bmuestra de gratitud#k, lleva este artículo para ayudarte en tu viaje.");
        } else if (status == 1) {
            const InventoryType = Java.type('client.inventory.InventoryType');
            if (qm.getPlayer().getInventory(InventoryType.USE).getNumFreeSlot() >= 2) {
                if (qm.haveItem(4000294, 1000)) {
                    qm.gainItem(4000294, -1000);
                    qm.gainItem(2040501, 1);
                    qm.gainItem(2000005, 50);
                    qm.gainExp(54000);
                    qm.forceCompleteQuest();
                } else if (qm.haveItem(4000294, 600)) {
                    qm.gainItem(4000294, -600);
                    qm.gainItem(2020013, 50);
                    qm.gainExp(54000);
                    qm.forceCompleteQuest();
                } else if (qm.haveItem(4000294, 500)) {
                    qm.gainItem(4000294, -500);
                    qm.gainExp(54000);
                    qm.forceCompleteQuest();
                } else if (qm.haveItem(4000294, 100)) {
                    qm.gainItem(4000294, -100);
                    qm.gainExp(45000);
                    qm.forceCompleteQuest();
                } else if (qm.haveItem(4000294, 50)) {
                    qm.gainItem(4000294, -50);
                    qm.gainItem(2020007, 50);
                    qm.gainExp(10000);
                    qm.forceCompleteQuest();
                } else if (qm.haveItem(4000294, 1)) {
                    qm.gainItem(4000294, -1);
                    qm.gainItem(2000000, 1);
                    qm.gainExp(10);
                    qm.forceCompleteQuest();
                }

                qm.dispose();
            } else {
                qm.sendOk("¿podrías hacer#b2 espacios disponibles#ken su inventario USE antes de recibir su recompensa?");
            }
        } else if (status == 2) {
            qm.dispose();
        }
    }
}