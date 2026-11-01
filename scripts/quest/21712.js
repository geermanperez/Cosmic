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
            qm.sendNext("¿Aún no entiendes lo que está pasando? Te lo explicaré otra vez si me hablas una vez más.");
            qm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        qm.sendNext("#t4032315#... #rEsta marioneta hace un ruido extraño.#k. Por supuesto, no puedes oírlo con tus oídos, ya que sólo puede ser oído por el#o1210102#s. Creo que es este ruido el que cambió la personalidad del#o1210102#s.");
    } else if (status == 1) {
        qm.sendAcceptDecline("El#o1210102#Los que se han visto afectados por el ruido se han vuelto cínicos. Han empezado a luchar contra los no afectados.#o1210102#s, que ha hecho que todos#o1210102#Prepárate para el combate.#bLa razón de todos estos cambios en el#o1210102#s es esta marioneta#k! ¿Lo entiendes?");
    } else if (status == 2) {
        qm.forceStartQuest();
        qm.sendNext("Me pregunto qué desencadenó esto en primer lugar. No hay forma de que esta marioneta haya sido creada de forma natural, lo que significa que alguien planeó esto. Debería estar atento a los #o1210102#.", 9);
    } else if (status == 3) {
        qm.sendPrev("#b(Pudiste descubrir qué causó los cambios en el#o1210102#s. Deberías informar a#p1002104#y entregue la información que ha recopilado.)#k", 2);
    } else if (status == 4) {
        qm.dispose();
    }
}

function end(mode, type, selection) {
    qm.dispose();
}