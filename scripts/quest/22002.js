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
        qm.sendNext("¿Le diste de comer a #p1013102#? Entonces deberías desayunar algo ahora, Evan. El desayuno de hoy es un #t2022620#. Lo he traído conmigo. Je, je. Me lo iba a comer yo mismo si no aceptabas alimentarlo con #p1013102#.");
    } else if (status == 1) {
        qm.sendAcceptDecline("Toma, te daré esto.#bSandwich#k, entonces#bve a hablar con mamá cuando termines de comer#k. Ella dice que tiene algo que decirte.");
    } else if (status == 2) {
        if (mode == 0) {//decline
            qm.sendNext("Ah, ¿qué? ¿No vas a desayunar? ¡El desayuno es la comida más importante del día! Hablame de nuevo si cambias de opinión. Si no lo haces, me lo comeré yo mismo.");
            qm.dispose();
        } else {
            qm.gainItem(2022620, true);
            qm.forceStartQuest();
            qm.sendNext("#b(¿Mamá tiene algo que decir? Cómete tu#t2022620#y regresa al interior de la casa.)#k");
        }
    } else if (status == 3) {
        qm.sendImage("UI/tutorial/evan/3/0");
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
        qm.sendNext("¿Desayunaste, Evan? Entonces, ¿me harás un favor?\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i1003028# 1 #t1003028#  \r\n#i2022621# 5 #t2022621#s\r\n#i2022622# 5 #t2022622# \r\n#fUI/UIWindow.img/QuestIcon/8/0# 60 exp.");
    } else if (status == 1) {
        qm.forceCompleteQuest();
        qm.gainItem(1003028, 1, true);
        qm.gainItem(2022621, 5, true);
        qm.gainItem(2022622, 5, true);
        qm.gainExp(60);
        qm.sendImage("UI/tutorial/evan/4/0");
        qm.dispose();
    }
}