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
        qm.sendNext("No, no, no. Esto no es lo que necesito. ¡Necesito algo más nutritivo, maestro!");
    } else if (status == 1) {
        qm.sendNextPrev("#bHm... Entonces no eres un herbívoro. Quizás seas un carnívoro. Eres un Dragón, después de todo. ¿Cómo algunos#t4032453#¿sonido?", 2);
    } else if (status == 2) {
        qm.sendAcceptDecline("¿Qué es un...#t4032453#? Nunca había oído hablar de él, pero si está delicioso, ¡lo acepto! Sólo dame algo sabroso. ¡Cualquier cosa menos plantas!");
    } else if (status == 3) {
        if (mode == 0) {
            qm.sendNext("¿Cómo puedes matarme de hambre así? Soy sólo un bebé. ¡Esto está mal!");
        } else {
            qm.forceStartQuest();
            qm.sendNext("#b#b(Intenta dar#p1013000#alguno#t4032453#. Tienes que cazar algunos#o1210100#s en la granja. Diez deberían ser suficientes...)");
        }
    } else if (status == 4) {
        qm.dispose();
    }
}