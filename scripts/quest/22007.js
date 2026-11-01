var status = -1;

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
        qm.sendNext("Oh, ¿trajiste el #t4032451#? Toma, dámelo. Entonces te daré la incubadora.");
    } else if (status == 1) {
        qm.sendYesNo("Muy bien, aquí tienes. No tengo idea de cómo lo usas, pero es tuyo...\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 360 exp.");
    } else if (status == 2) {
        if (mode == 0) {//decline
            qm.sendNext("¿Mmm? Eso es extraño. La incubadora no se instaló correctamente. Intentar otra vez.");
        } else {
            qm.gainItem(4032451, -1);
            qm.forceCompleteQuest();
            qm.gainExp(360);
            qm.sendImage("UI/tutorial/evan/9/0");
        }
    } else if (status == 3) {
        qm.dispose();
    }
}