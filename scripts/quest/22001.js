var status = -1;

function start(mode, type, selection) {
    if (mode == 0 && type == 0) {
        status--;
    } else if (mode == -1) {
        qm.dispose();
        return;
    } else {
        status++;
    }
    if (status == 0) {
        qm.sendNext("Ja ja. Me reí mucho. Jajaja. Pero basta de tonterías. Alimenta a #p1013102#, ¿quieres?");
    } else if (status == 1) {
        qm.sendNextPrev("#b¿Qué? Eso es#p1013101#¡El trabajo!", 2);
    } else if (status == 2) {
        qm.sendAcceptDecline("¡Pequeño mocoso! ¡Te dije que me llamaras hermano mayor! Sabes cuánto me odia #p1013102#. Me morderá si me acerco a él. Le das de comer. Le gustas.");
    } else if (status == 3) {
        if (mode == 0) {
            qm.sendNext("Deja de ser vago. ¿Quieres ver a tu hermano mordido por un perro? ¡Apresúrate! ¡Hablame de nuevo y acepta la misión!");
            qm.dispose();
        } else {//accept
            qm.gainItem(4032447, true);
            qm.forceStartQuest();
            qm.sendNext("Date prisa y dirígete#bleft#k para alimentar#b#p1013102##k. Ha estado ladrando para que le den de comer toda la mañana.");
        }
    } else if (status == 4) {
        qm.sendNextPrev("Alimenta a #p1013102# y vuelve a verme.");
    } else if (status == 5) {
        qm.dispose();
    }
}