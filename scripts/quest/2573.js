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
        qm.sendNext("¡Saludos! ¿No es este el clima perfecto para un viaje? Soy Skipper, el capitán de este magnífico barco. Debes ser un nuevo Explorer, ¿eh? Encantado de conocerlo.");
    } else if (status == 1) {
        qm.sendAcceptDecline("No estamos del todo listos para partir, así que siéntete libre de mirar alrededor del barco mientras esperamos.");
    } else if (status == 2) {
        if (mode == 0) {//decline
            qm.sendNext("¡Oye, tómatelo con calma! A veces solo hay que esperar.");
        } else {
            qm.warp(3000000, 0);
            qm.forceCompleteQuest();
            qm.sendNext("¡Parece que ya estamos listos! Creo que este va a ser un gran viaje. Pongámonos en marcha.");
        }
    } else if (status == 3) {
        qm.dispose();
    }
}