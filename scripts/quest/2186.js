/*
    Author: BubblesDev
    Quest: Abel Glasses Quest
*/

var status = -1;    // thanks IxianMace for noticing missing status declaration

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
            if (!qm.isQuestCompleted(2186)) {
                if (qm.haveItem(4031853)) {
                    if (qm.canHold(2030019)) {
                        qm.gainItem(4031853, -1);
                        qm.gainExp(1700);
                        qm.gainItem(2030019, 10);

                        qm.sendOk("¡Caray, encontraste mis gafas! Gracias, muchas gracias. ¡Ahora puedo verlo todo otra vez!");
                        qm.forceCompleteQuest();
                    } else {
                        qm.sendOk("¡Necesito que tengas un espacio USE disponible para recompensarte adecuadamente!");
                    }
                } else if (qm.haveItem(4031854) || qm.haveItem(4031855)) { //When I figure out how to make a completance with just a pickup xD
                    if (qm.canHold(2030019)) {
                        if (qm.haveItem(4031854)) {
                            qm.gainItem(4031854, -1);
                        } else {
                            qm.gainItem(4031855, -1);
                        }

                        qm.gainExp(1000);
                        qm.gainItem(2030019, 5);

                        qm.sendOk("Mmmm, esas no son mis gafas... Pero, por desgracia, las llevaré de todos modos. Gracias.");
                        qm.forceCompleteQuest();
                    } else {
                        qm.sendOk("¡Necesito que tengas un espacio USE disponible para recompensarte adecuadamente!");
                    }
                }
            }
        } else if (status == 1) {
            qm.dispose();
        }
    }
}