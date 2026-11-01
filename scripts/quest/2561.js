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
        qm.sendNext("¡Ok, ok! ¡Oook! ¡Ok! ¡Ok! ¡¿Ok?!");
    } else if (status == 1) {
        qm.sendNextPrev("Recuerdo... Iba camino a Maple Island, para convertirme en Explorador... ¿Qué pasó? ¿Qué está sucediendo?", 2);
    } else if (status == 2) {
        qm.sendNextPrev("¡Oook! ¡Ok! ¡Ok! ¡Oooook!");
    } else if (status == 3) {
        qm.sendNextPrev("Estaba hablando con el capitán, admirando el paisaje y... ¡Balrog! ¡Balrog atacó el barco! Entonces... ¿Me caí por la borda? Entonces, ¿por qué estoy vivo? Sé#bpuedo nadar#k, pero ¿puedo nadar estando inconsciente? Quizás pueda. ¡Quizás soy un nadador nato!", 2);
    } else if (status == 4) {
        qm.sendNext("¡Oooook! ¡Ok! ¡Ok! (Eh, un pequeño mono... golpeando su pie con enojo. En realidad, cuando me desperté por primera vez, ese mono fue lo único que vi...)");
    } else if (status == 5) {
        qm.sendNextPrev("¿Eh? ¿Por qué agitas los brazos así? ¿Estás intentando decirme algo? (El mono sacó una manzana del cofre cercano. Se ve deliciosa. Pero, ¿qué intenta decirte?)\r\n\r\n#i2010000#", 2);
    } else if (status == 6) {
        qm.sendAcceptDecline("¡Ok, ok! ¡Om nom nom! (El mono parece frustrado porque no lo entiendes. Pretende comerse la manzana. Espera, ¿quiere que TÚ te la comas? ¡Debe ser eso! ¡Qué lindo mono!)");
    } else if (status == 7) {
        if (mode == 0) {//decline
            qm.sendNext("La cosa es que no me gustan las manzanas... Lo siento, pero no, gracias.", 2);
            qm.dispose();
        } else {
            if (!qm.isQuestStarted(2561)) {//seems that hp is not changed o.o
                qm.gainItem(2010000, true);
                qm.forceStartQuest();
            }
            qm.sendNext("(Has recibido una manzana de aspecto delicioso. Deberías comértela. Ahora... ¿cómo abres tu Inventario? ¿Fue la clave #bI#k...?)", 2);
        }
    } else if (status == 8) {
        qm.showInfo("UI/tutorial.img/28");
        qm.dispose();
    }
}
	