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
        qm.sendNext("¿Dormiste bien, Evan?");
    } else if (status == 1) {
        qm.sendNextPrev("#bYSí, ¿y tú, mamá?", 2);
    } else if (status == 2) {
        qm.sendNextPrev("Yo también lo hice, pero pareces muy cansado. ¿Estás seguro de que dormiste bien? ¿Los truenos y relámpagos de anoche te mantuvieron despierto?");
    } else if (status == 3) {
        qm.sendNextPrev("#bO Ah, no. No es eso, mamá. Anoche tuve un sueño extraño.", 2);
    } else if (status == 4) {
        qm.sendNextPrev("¿Un sueño extraño? ¿Qué tipo de sueño extraño?");
    } else if (status == 5) {
        qm.sendNextPrev("#bBueno...", 2);
    } else if (status == 6) {
        qm.sendNextPrev("#b(Explicas que conociste a un dragón en tu sueño).", 2);
    } else if (status == 7) {
        qm.sendAcceptDecline("Jajaja, ¿un dragón? Eso es increíble. ¡Me alegro de que no te haya tragado entero! Deberías contarle a #p1013101# sobre tu sueño. Estoy seguro de que lo disfrutará.");
    } else if (status == 8) {
        if (mode == 0) {//decline
            qm.sendNext("¿Mmm? ¿No quieres decírselo a #p1013101#? Tienes que ser amable con tu hermano, querido.");//guess
            qm.dispose();//get the message xd
        } else {//accept
            qm.forceStartQuest();
            qm.sendNext("#b#p1013101##kfue al#b#m100030102##kpara alimentar al Bull Dog. Lo verás justo afuera.");
        }
    } else if (status == 9) {
        qm.sendImage("UI/tutorial/evan/1/0");
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
        qm.sendNext("Hola, Evan. ¿Estás despierto? ¿Qué pasa con los círculos oscuros debajo de tus ojos? ¿No dormiste bien? ¿Eh? ¿Un sueño extraño? ¿De qué se trataba? ¿Vaya? ¿Un sueño sobre un dragón?");
    } else if (status == 1) {
        qm.sendNextPrev("Muajajajajaja, ¿un dragón? ¿Hablas en serio? No sé cómo interpretar los sueños, ¡pero parece bueno! ¿También viste un perro en tu sueño? ¡Jajaja!\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 20 exp.");
    } else if (status == 2) {
        qm.forceCompleteQuest();
        qm.gainExp(20);
        qm.sendImage("UI/tutorial/evan/2/0");
        qm.dispose();
    }
}
	