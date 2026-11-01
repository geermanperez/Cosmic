var status = -1;

function start(mode, type, selection) {
    if (mode == -1 || mode == 0 && type > 0) {
        qm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        if (status == 2) {
            qm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        qm.sendNext("¿No eres tú el que estaba en #m101000000# hasta no hace mucho? ¡Finalmente te encontré! ¿Sabes cuánto tiempo tardé en encontrarte finalmente?", 8);
    } else if (status == 1) {
        qm.sendNextPrev("¿Quién eres?", 2);
    } else if (status == 2) {
        qm.sendAcceptDecline("¿A mí? Si quieres saberlo pásate por mi cueva. Incluso te enviaré una invitación. Serás enviado directamente a mi cueva tan pronto como aceptes. Espero verte allí.");
    } else if (status == 3) {
        qm.forceCompleteQuest();
        qm.warp(910510200, 0);
        qm.dispose();
    }
}

function end(mode, type, selection) {
    qm.dispose();
}