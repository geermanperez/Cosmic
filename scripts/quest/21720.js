var status = -1;

function start(mode, type, selection) {
    qm.dispose();
}

function end(mode, type, selection) {
    if (mode == -1 || mode == 0 && type > 0) {
        qm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        if (status == 6) {
            qm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        qm.sendNext("¿Qué puedo hacer por ti? Tru me envió un mensaje diciendo que has estado entrenando diligentemente en la Isla Victoria mientras lo ayudabas con su trabajo. ¿Qué es? ¿Qué? ¿Las alas negras?", 8);
    } else if (status == 1) {
        qm.sendNextPrev("#b(Le cuentas sobre el Titiritero y los Alas Negras, y sobre su misión.)#k", 2);
    } else if (status == 2) {
        qm.sendNextPrev("Ya veo... No sabía que había un grupo llamado Black Wings... Deben ser tontos si están tratando de revivir al Mago Negro, sabiendo lo peligroso que es.", 8);
    } else if (status == 3) {
        qm.sendNextPrev("Eso...eso es verdad...\r\r#b(Definitivamente no tiene miedo de decir lo que piensa).#k", 2);
    } else if (status == 4) {
        qm.sendNextPrev("El Libro de la Profecía afirma que el héroe revivirá y luchará contra el Mago Negro. No estaba seguro de si eso era cierto, pero esto confirma que el Mago Negro todavía existe.", 8);
    } else if (status == 5) {
        qm.sendNextPrev("¿No tienes miedo?", 2);
    } else if (status == 6) {
        qm.sendYesNo("¿Asustado? Pfff. A quién le importa si aparece el Mago Negro. Estarás aquí para protegernos. En todo caso, esto me hace querer prepararte para la gran batalla. Ah, eso me recuerda que encontré un #bskill#k. ¿Quieres verlo?");
    } else if (status == 7) {
        if (qm.getQuestStatus(21720) == 1) {
            qm.forceCompleteQuest();
            qm.teachSkill(21001003, qm.getPlayer().getSkillLevel(21001003), 20, -1);
            qm.gainExp(3900);
        }
        qm.sendNext('#b(¡Recordaste la habilidad Polearm Booster!)#k', 2);
    } else if (status == 8) {
        qm.sendNextPrev("Esta habilidad se encontró en una antigua escritura incomprensible. Tenía el presentimiento de que podría ser una habilidad que usaste en el pasado y creo que tenía razón. No eres tan fuerte como solías ser, pero llegarás allí con el tiempo.", 8);
    } else if (status == 9) {
        qm.sendNextPrev("Te estás volviendo cada vez más poderoso y estaré aquí para seguir motivándote. No tienes nada que temer. No perderás la batalla. No saliste del hielo sólo para perder contra el Mago Negro, ¿verdad? ¡Esta vez acabarás con él de una vez por todas!", 8);
    } else if (status == 10) {
        qm.sendPrev("Para ello, sólo hay una cosa que puedes hacer. Tren, tren, tren. Dirígete a la Isla Victoria y continúa entrenando. ¡Asegurémonos de que te vuelvas tan poderoso que el Mago Negro no tenga ninguna posibilidad!", 8);
    } else if (status == 11) {
        qm.dispose();
    }
}