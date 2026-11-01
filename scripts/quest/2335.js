/*
	QUEST: Eliminating the Rest
	NPC: Violetta
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status == 0)) {
        qm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }


    if (status == 0) {
        qm.sendNext("Este no es el final#b#h ##k. Secuaces de la#bPrimer ministro#ktodavía se pueden encontrar esparcidos por todo el castillo.");
    } else if (status == 1) {
        qm.sendAcceptDecline("Por lo que he oído, hay un lugar cerca#brascacielos 3#kdonde se puede encontrar un grupo de secuaces del Primer Ministro. Recogí una llave que se le cayó al Primer Ministro el otro día. Toma, usa esta clave.");
    } else if (status == 2) {
        if (qm.canHold(4032405)) {
            qm.gainItem(4032405, 1);
            qm.sendNext("Por última vez, buena suerte.");
        } else {
            qm.sendOk("Por favor tenga un espacio libre en su inventario de ETC.");
            qm.dispose();
        }
    } else if (status == 3) {
        qm.forceStartQuest();
        qm.dispose();
    }
}

function end(mode, type, selection) {}