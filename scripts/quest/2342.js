/*
	QUEST: Recovered Royal Seal.
	NPC: Violetta
*/

var status = -1;

function start(mode, type, selection) {
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
            if (!qm.hasItem(4001318) && qm.isQuestStarted(2331) && !qm.isQuestCompleted(2331)) {
                if (qm.canHold(4001318)) {
                    qm.forceStartQuest();
                    qm.gainItem(4001318, 1);
                    qm.forceCompleteQuest();
                    qm.sendOk("Parece que olvidaste recoger el#b#t4001318##kcuando peleaste con el#bPrimer ministro#k. Esto es muy importante para nuestro reino, así que por favor entrégaselo a mi padre lo antes posible.");
                } else {
                    qm.sendOk("Libere un lugar en su inventario de ETC");
                }
            } else {
                qm.dispose();
            }
        } else if (status == 1) {
            qm.dispose();
        }
    }
}

function end(mode, type, selection) {
}