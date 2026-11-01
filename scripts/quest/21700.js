var status = -1;

function start(mode, type, selection) {
    if (mode == -1 || mode == 0 && type > 0) {
        qm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        if (status == 4) {
            qm.sendNext("¿No? ¿Estás diciendo que puedes entrenar solo? Sólo te digo que obtendrás mejores resultados si entrenas con un instructor. No puedes vivir solo en este mundo. Debes aprender a llevarte bien con otras personas.");
            qm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        qm.sendNext("Parece que has empezado a recordar cosas. Tu arma de asta debe haberte reconocido. Esto significa que seguramente estás#bAran, el portador de armas de asta#k. ¿Hay algo más que recuerdes? ¿Quizás las habilidades que usaste con el arma de asta? ¿Cualquier cosa?");
    } else if (status == 1) {
        qm.sendNextPrev("#b(Le dices que recuerdas algunas habilidades).#k", 2);
    } else if (status == 2) {
        qm.sendNextPrev("Eso no es mucho, pero es un progreso. Nuestro objetivo, entonces, debería ser devolverle al estado anterior a su congelación. Puede que hayas perdido la memoria, pero seguro que no tardarás en recuperar las capacidades que tu cuerpo recuerda.");
    } else if (status == 3) {
        qm.sendNextPrev('¿Cómo recupero mis habilidades?', 2);
    } else if (status == 4) {
        qm.sendAcceptDecline("Sólo hay una manera de hacerlo. ¡Tren! ¡Tren! ¡Tren! ¡Tren! Si continúas entrenando, tu cuerpo recordará instintivamente sus habilidades. Para ayudarte en el proceso, te presentaré a un instructor.");
    } else if (status == 5) {
        qm.sendNext("Te di un #bPolearm#k porque pensé que sería mejor para ti usar un arma con la que estés familiarizado. Te será útil en tu entrenamiento.");
        if (!qm.isQuestStarted(21700) && !qm.isQuestCompleted(21700)) {
            qm.gainItem(1442000, 1);
            qm.forceStartQuest();
        }
    } else if (status == 6) {
        qm.sendPrev("Encontrarás un centro de formación si sales a la#bleft#k. Allí te encontrarás#b#p1202006##k. Estoy un poco preocupado porque creo que puede estar luchando contra ataques de Alzheimer, pero pasó mucho tiempo investigando habilidades para ayudarte. Estoy seguro de que aprenderás un par de cosas de él.");
    } else if (status == 7) {
        qm.dispose();
    }
}

function end(mode, type, selection) {
    qm.dispose();
}