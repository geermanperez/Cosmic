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
        qm.sendNext("Parece que ya estás calentado. Aquí es cuando un entrenamiento riguroso realmente puede ayudarle a construir una base sólida. Procedamos con el Entrenamiento Básico, ¿vale?", 8);
    } else if (status == 1) {
        qm.sendNextPrev("Ve a derrotar a algunos#r#o0100133#s#ken#b#m140020200##kesta vez. pienso en#r20#k debería hacerlo. Continúe y... ¿Hm? ¿Tienes algo que te gustaría decir?", 8);
    } else if (status == 2) {
        qm.sendNextPrev("¿No es el número cada vez mayor?", 2);
    } else if (status == 3) {
        qm.sendNextPrev("Por supuesto que lo es. ¿Qué, no estás contento con 20? ¿Te gustaría derrotar a 100 de ellos? Oh, ¿qué tal 999 de ellos? Alguien en Sleepywood podría hacerlo fácilmente. Después de todo, estamos entrenando...", 8);
    } else if (status == 4) {
        qm.sendNextPrev("Ay no, no, no. Veinte son suficientes.", 2);
    } else if (status == 5) {
        qm.sendAcceptDecline("No tienes que ser tan modesto. Entiendo tu deseo de convertirte rápidamente en el héroe que alguna vez fuiste. Este tipo de actitud es lo que te convierte en un héroe.");
    } else if (status == 6) {
        if (mode == 0 && type == 15) {
            qm.sendNext("#b(Rechazaste por miedo, pero no es que puedas huir así. Respira hondo, cálmate y vuelve a intentarlo).#k", 2);
            qm.dispose();
        } else {
            if (!qm.isQuestStarted(21017)) {
                qm.forceStartQuest();
            }
            qm.sendNext("#b(Aceptaste, pensando que podrías terminar teniendo 999 de ellos si la dejabas seguir hablando).#k", 2);
        }
    } else if (status == 7) {
        qm.sendNextPrev("Continúe y mate a 20 #o0100133#.", 8);
    } else if (status == 8) {
        qm.showInfo("Effect/OnUserEff.img/guideEffect/aranTutorial/tutorialArrow3");
        qm.dispose();
    }
}