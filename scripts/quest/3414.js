var item;
var stance;
var status = -1;
var vecItem;

function end(mode, type, selection) {
    if (mode == 0) {
        qm.dispose();
        return;
    }
    status++;

    if (status == 0) {
        qm.sendNext("¡¡¡Vaya... esto es!!! ¡Con esta muestra los estudios que se están realizando en el Sector Omega se revitalizarán con resultados! También me quedo sin palabras para encontrar a alguien que tenga más talento que yo para cazar. ¡Tendré que volver a la normalidad! De todos modos, por tu trabajo bien hecho, tendré que recompensarte en consecuencia.");
    } else if (status == 1) {
        const InventoryType = Java.type('client.inventory.InventoryType');
        if (qm.getPlayer().getInventory(InventoryType.USE).getNumFreeSlot() < 1) {
            qm.getPlayer().dropMessage(1, "UTILIZAR el inventario lleno.");
            qm.dispose();
            return;
        }

        var talkStr = "Here, please select the scroll of your choice. All success rates are at 10%. \r\n\r\n#rSELECT A ITEM\r\n#b"
        stance = qm.getPlayer().getJobStyle();

        const Job = Java.type('client.Job');
        if (stance == Job.WARRIOR || stance == Job.BEGINNER) {
            vecItem = [2043002, 2043102, 2043202, 2044002, 2044102, 2044202, 2044402, 2044302];
        } else if (stance == Job.MAGICIAN) {
            vecItem = [2043702, 2043802];
        } else if (stance == Job.BOWMAN || stance == Job.CROSSBOWMAN) {
            vecItem = [2044502, 2044602];
        } else if (stance == Job.THIEF) {
            vecItem = [2043302, 2044702];
        } else {
            vecItem = [2044802, 2044902];
        }

        for (var i = 0; i < vecItem.length; i++) {
            talkStr += "\r\n#L" + i + "# #i" + vecItem[i] + "# #t" + vecItem[i] + "#";
        }
        qm.sendSimple(talkStr);
    } else if (status == 2) {
        item = vecItem[selection];
        qm.gainItem(item, 1);
        qm.gainItem(4031103, -1);
        qm.gainItem(4031104, -1);
        qm.gainItem(4031105, -1);
        qm.gainItem(4031106, -1);
        qm.gainExp(12000);
        qm.completeQuest();

        qm.dispose();
    }
}