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
        qm.sendNext("Los #o1210100# de la granja han estado actuando de forma extraña estos últimos días. Han estado enojados e irritables sin motivo alguno. Estaba preocupado, así que salí a la granja temprano esta mañana y, efectivamente, parece que algunos de estos #o1210100# pasaron la cerca.");
    } else if (status == 1) {
        qm.sendAcceptDecline("Antes de ir y encontrar el#o1210100#s, debería reparar la cerca rota. Por suerte, no sufrió daños graves. solo necesito algunos#t4032498#Es para arreglarlo. ¿Me traerás?#b3#k#b#t4032498#es#k¿Evan?");
    } else if (status == 2) {
        if (mode == 0) {//decline
            qm.sendNext("Hm, #p1013101# lo habría hecho en un abrir y cerrar de ojos.");
            qm.dispose();
        } else {
            qm.forceStartQuest();
            qm.sendNext("Oh, eso es muy amable de tu parte. Podrás encontrar#b#t4032498#es#kdesde el cercano#r#o0130100#s#k. No son demasiado fuertes, pero usa tus habilidades y objetos cuando te encuentres en peligro.");
        }
    } else if (status == 3) {
        qm.sendImage("UI/tutorial/evan/6/0");
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
        qm.sendNext("Ah, ¿trajiste todos los#t4032498#es? ¡Ese es mi hijo! ¿Qué te daré como recompensa? A ver... ¡Ah, claro!\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i3010097# 1 #t3010097# \r\n#i2022621# 15 #t2022621#s\r\n#i2022622# 15 #t2022622#s\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 210 exp.");
    } else if (status == 1) {
        if (!qm.isQuestCompleted(22004)) {
            qm.gainItem(3010097, true);
            qm.forceCompleteQuest();
            qm.gainExp(210);
        }
        qm.sendNextPrev("Aquí. Hice esta nueva silla con las tablas de madera que me sobraron después de arreglar la cerca. Puede que no parezca mucho, pero es resistente. Estoy seguro de que será útil.");
    } else if (status == 2) {
        qm.sendImage("UI/tutorial/evan/7/0");
        qm.dispose();
    }
}