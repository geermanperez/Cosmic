var status = -1;
var canStart;

function start(mode, type, selection) {
    status++;
    if (status == 0) {
        if (qm.haveItem(4032423, 1)) {
            qm.forceStartQuest();
            qm.dispose();
            return;
        }

        canStart = qm.canHold(4032423, 1);
        if (!canStart) {
            qm.sendNext("Primero abra un espacio en su inventario de ETC.");
            return;
        }

        qm.sendNext("#bHm, hay una sustancia medicinal en la caja. ¿Qué podría ser esto? Será mejor que le lleves esto a John y le preguntes qué es.#k");
    } else if (status == 1) {
        if (canStart) {
            qm.gainItem(4032423, 1);
            qm.forceStartQuest();
        }

        qm.dispose();
    }
}