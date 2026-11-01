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
        qm.sendNext("¡Oooook! ¡Ok! ¡Ok!");
    } else if (status == 1) {
        qm.sendNextPrev("Bueno, eso dio en el clavo, pero... todavía no entiendo qué pasó. ¿Dónde está el barco? Oye, ¿sabes lo que me pasó?", 2);
    } else if (status == 2) {
        qm.sendAcceptDecline("¡Oook! (El mono asiente. ¿Sabe realmente lo que está pasando? No estaría de más preguntar.)");
    } else if (status == 3) {
        if (mode == 0) {//decline
            qm.sendNext("¡Ok! ¡Ok! (El mono parece muy descontento.)");
        } else {
            qm.forceStartQuest();
            qm.dispose();
        }
    } else if (status == 4) {
        qm.dispose();
    }
}
	