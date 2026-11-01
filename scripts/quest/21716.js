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
            qm.sendNext("¿Qué? No creo que haya ningún sospechoso además de ese niño. Por favor piénselo de nuevo.");
            qm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        qm.sendNext("¿Qué dijo #p1032112#?", 8);
    } else if (status == 1) {
        qm.sendNextPrev("#b(Le dices lo que#p1032112#observado.)#k", 2);
    } else if (status == 2) {
        qm.sendAcceptDecline("¿Un niño con una marioneta? Eso parece muy sospechoso. Estoy seguro de que ese niño es la razón por la que los Hongos Verdes de repente se han vuelto violentos.");
    } else if (status == 3) {
        qm.forceStartQuest();
        qm.sendNext("¿Cómo se atreve este niño a causar estragos en el Bosque del Sur? Quién sabe cuánto tiempo llevará restaurar el bosque... Tendré que dedicar la mayor parte de mi tiempo a limpiar el desorden.", 2);
    } else if (status == 4) {
        qm.sendPrev("#b(Pudiste descubrir qué causó los cambios en los Hongos Verdes. Debes informar#p1002104#y entregar la información que ha recopilado.)#k", 2);
    } else if (status == 5) {
        qm.dispose();
    }
}

function end(mode, type, selection) {
    qm.dispose();
}