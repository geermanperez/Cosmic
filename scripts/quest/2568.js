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
        qm.sendAcceptDecline("¡Has vuelto! Excelente. Conecté el dispositivo de encendido para que podamos volver a la civilización. Aquí no queda nada que hacer, ¿verdad? ¡Vamos a rodar!");
    } else if (status == 1) {
        if (mode == 0) {//decline

        } else {
            qm.forceStartQuest();
            qm.warp(912060200, 0);
        }
        qm.dispose();
    }
}

function end(mode, type, selection) {
    if (mode == 0 && type == 0) {
        status--;
    } else if (mode == -1) {
        qm.dispose();
        return;
    } else {
        status++;
    }
    if (status == 0) {
        qm.sendNext("");
    }
}
	