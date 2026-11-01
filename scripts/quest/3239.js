var status = -1;

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (qm.haveItem(4031092, 10)) {
                const InventoryType = Java.type('client.inventory.InventoryType');
                if (qm.getPlayer().getInventory(InventoryType.USE).getNumFreeSlot() >= 1) {
                    qm.sendOk("¡Bien hecho! Recuperaste todos los #t4031092# que faltaban. Toma, toma este pergamino como muestra de mi gratitud...");
                } else {
                    qm.sendOk("Libera un espacio en tu inventario USE antes de recibir tu premio.");
                    qm.dispose();

                }
            } else {
                qm.sendOk("Por favor, devuélveme 10 #t4031092# que desaparecieron en esta sala.");
                qm.dispose();

            }
        } else if (status == 1) {
            qm.gainItem(4031092, -10);

            rnd = Math.floor(Math.random() * 4);
            if (rnd == 0) {
                qm.gainItem(2040704, 1);
            } else if (rnd == 1) {
                qm.gainItem(2040705, 1);
            } else if (rnd == 2) {
                qm.gainItem(2040707, 1);
            } else {
                qm.gainItem(2040708, 1);
            }

            qm.gainExp(2700);
            qm.forceCompleteQuest();
            qm.dispose();
        }
    }
}