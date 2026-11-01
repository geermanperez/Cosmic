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
        qm.sendNext("¿Cómo fue el entrenamiento? Al Profesor Pingüino #p1202006# le gusta exagerar y me preocupó saber que tiene ataques de Alzheimer, pero estoy seguro de que te ayudó. Lleva mucho tiempo estudiando las habilidades de los héroes.");
    } else if (status == 1) {
        qm.sendNextPrev("#b(Le dices que pudiste recordar la habilidad de habilidad combinada).#k", 2);
    } else if (status == 2) {
        qm.sendNextPrev("¡Genial! Honestamente, creo que tiene menos que ver con el método de#p1202006#El entrenamiento y más tiene que ver con que tu cuerpo recuerde sus antiguas habilidades.#bEstoy seguro de que tu cuerpo recordará más habilidades a medida que sigas entrenando.#k!  \r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 500 exp.");
    } else if (status == 3) {
        qm.forceCompleteQuest();
        qm.gainExp(500);
        qm.dispose();
    }
}

function end(mode, type, selection) {
    qm.dispose();
}