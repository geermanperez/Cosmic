/*
	QUEST: James's Whereabouts (3)
	NPC: James
	Why tf does this quest exist?!
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
        return;
    } else if (mode == 0 && status == 0) {
        qm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }

    if (status == 0) {
        qm.sendNext("¡Ey! Gracias por traerme un#b#t4001317##k.");
    } else if (status == 1) {
        qm.sendNextPrev("Planeo escapar de aquí usando el#b#t4001317##k. Dame un minuto para ponérmelo. Hablamos pronto...");
    } else if (status == 2) {
        qm.forceStartQuest();
        qm.dispose();
    }
}