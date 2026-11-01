/*
	QUEST: Jame's Whereabouts (1)
	NPC: James
*/

var status = -1;

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }

    if (status == 0) {
        qm.sendNext("Yo... tengo miedo... Por favor... por favor ayúdenme...");
    } else if (status == 1) {
        qm.sendNextPrev("No tengas miedo,#b#p1300005##kme envió aquí.", 2);
    } else if (status == 2) {
        qm.forceCompleteQuest();
        qm.gainExp(6000);
        qm.sendOk("¿Qué? ¿Mi hermano te envió aquí? Ahhh... ya estoy a salvo. Muchas gracias...");
    } else if (status == 3) {
        qm.dispose();
    }
}