/*
	NPC Name: 		Kinu
	Description: 		Quest - Cygnus tutorial helper
*/

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
            qm.sendNext("Los ataques regulares son habilidades básicas que son fáciles de usar. Es importante recordar que la caza real se realiza utilizando tus habilidades. Te sugiero que lo reconsideres.");
            qm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        qm.sendNext("Te estaba esperando, #h0#. Mi nombre es #p1102006# y soy el tercer hermano que conocerás. Entonces ya aprendiste a usar ataques regulares, ¿correcto? Bueno, a continuación aprenderás sobre tu #bSkills#k, que encontrarás muy útil en Maple World.");
    } else if (status == 1) {
        qm.sendNextPrev("Obtienes puntos de habilidad cada vez que subes de nivel, lo que significa que probablemente ya tengas algunos ahorrados. Presione el#btecla K#kpara ver tus habilidades. Invierte tus puntos de habilidad en la habilidad que deseas fortalecer y no olvides#bColoque la habilidad en una ranura rápida para facilitar su uso.#k.");
    } else if (status == 2) {
        qm.sendAcceptDecline("Es hora de practicar antes de que lo olvides. Encontrarás muchos#o100121#s en esta área. ¿Por qué no cazas?#r3 #o100121#s#kusando tu#btres caracoles#bhabilidad y tráeme 1#b#t4000483##kcomo prueba? Te espero aquí.");
    } else if (status == 3) {
        qm.forceStartQuest();
        qm.guideHint(8);
        qm.dispose();
    }
}

function end(mode, type, selection) {
    if (mode == -1 || mode == 0 && type > 0) {
        qm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (status == 0) {
        qm.sendNext("Has derrotado exitosamente al#o100121#s y me trajo un#t4000483#. ¡Eso es muy impresionante!#bObtienes 3 puntos de habilidad cada vez que subes de nivel, es decir, después de convertirte oficialmente en caballero. Sigue la flecha hacia la izquierda y te encontrarás#b#p1102007##k, quien lo guiará en el siguiente paso.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#fUI/UIWindow.img/QuestIcon/8/0# 40 exp.");
    } else if (status == 1) {
        qm.gainItem(4000483, -1);
        qm.forceCompleteQuest();
        qm.gainExp(40);
        qm.dispose();
    }
}