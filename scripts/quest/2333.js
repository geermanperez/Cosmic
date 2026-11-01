/*
	QUEST: Where's Violetta?
	NPC: none
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
        qm.sendAcceptDecline("¡Por favor, ayúdame!");
    } else if (status == 1) {
        qm.sendNext("El#bPrimer ministro#k¡Es quien planeó todo esto! ¡Oh, no! Aquí viene...");
    } else if (status == 2) {
        qm.forceStartQuest();
        qm.dispose();
    }
}

function end(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status == 0)) {
        qm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }


    if (status == 0) {
        qm.sendNext("¡Viva!#b#h ##kderrotaste al#bPrimer ministro#k.");
    } else if (status == 1) {
        qm.gainExp(15000);
        qm.forceCompleteQuest();
        qm.dispose();
    }
}