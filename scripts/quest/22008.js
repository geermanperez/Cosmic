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
        qm.sendAcceptDecline("Es extraño. Las gallinas se están portando raro. Solían incubar muchos más #t4032451#. ¿Crees que los Zorros tienen algo que ver con esto? Si es así, será mejor que nos demos prisa y hagamos algo.");
    } else if (status == 1) {
        if (mode == 0) {//decline
            qm.sendNext("Oh, qué... ¿Tienes miedo de los #o9300385#? No le digas a nadie que eres pariente mío. Eso es vergonzoso.");
            qm.dispose();
        } else {
            qm.forceStartQuest();
            qm.sendNext("¿Bien? Vayamos y derrotemos a esos Zorros. Sigue adelante y derrota#r10 #o9300385#es#ken#b#m100030103##kprimero. Te seguiré y me ocuparé de lo que quede atrás. Ahora, date prisa para#m100030103#!");
        }
    } else if (status == 2) {
        qm.sendImage("UI/tutorial/evan/10/0");
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
        qm.sendNext("¿Derrotaste a los #o9300385#?");
    } else if (status == 1) {
        qm.sendNextPrev("#b¿Qué pasó con matar a los Zorros que quedaron atrás?", 2);
    } else if (status == 2) {
        qm.sendNextPrev("Ah, ¿eso? Ja ja. Los perseguí, más o menos, pero quería asegurarme de que te alcanzaran. No quisiera que te comiera un #o9300385# ni nada por el estilo. Así que simplemente los dejé en paz.");
    } else if (status == 3) {
        qm.sendNextPrev("#bA¿Estás seguro de que no te escondías simplemente porque tenías miedo de los Zorros?", 2);
    } else if (status == 4) {
        qm.sendNextPrev("¿Qué? ¡De ninguna manera! ¡Dios, no temo a nada!");
    } else if (status == 5) {
        qm.sendNextPrev("#b¡Cuidado! hay un#o9300385#justo detrás de ti!", 2);
    } else if (status == 6) {
        qm.sendNextPrev("¡Eeeek! ¡Mami!");
    } else if (status == 7) {
        qm.sendNextPrev("#b...", 2);
    } else if (status == 8) {
        qm.sendNextPrev("...");
    } else if (status == 9) {
        qm.sendNextPrev("¡Pequeño mocoso! Soy tu hermano mayor. ¡No te metas conmigo! Tu hermano tiene un corazón débil, ¿sabes? ¡No me sorprendas así!");
    } else if (status == 10) {
        qm.sendNextPrev("#b(Por eso no quiero llamarte Hermano mayor...)", 2);
    } else if (status == 11) {
        qm.sendNextPrev("¡Mmm! De todos modos, me alegra que hayas podido derrotar al#o9300385#es. Como recompensa, te daré algo que un aventurero me regaló hace mucho tiempo. Aquí tiene.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i1372043# 1 #t1372043# \r\n#i2022621# 25 #t2022621# \r\n#i2022622# 25 #t2022622#s\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 910 exp.");
    } else if (status == 12) {
        if (!qm.isQuestCompleted(22008)) {
            qm.gainItem(1372043, true);
            qm.gainItem(2022621, 25, true);
            qm.gainItem(2022622, 25, true);
            qm.forceCompleteQuest();
            qm.gainExp(910);
        }
        qm.sendNextPrev("#bEsta es un arma que usan los magos. es una varita#k. Probablemente no lo necesites, pero te hará parecer importante si lo llevas contigo. Jajajajaja.");
    } else if (status == 13) {
        qm.sendPrev("En fin, los Zorros han aumentado, ¿no? ¿Qué tan raro es eso? ¿Por qué crecen día a día? Realmente deberíamos investigarlo y llegar al fondo del asunto.");
    } else if (status == 14) {
        qm.dispose();
    }
}