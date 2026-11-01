/* ===========================================================
			Ronan Lana
	NPC Name: 		John, Jack
	Description: 	Quest - Lost in Translation
=============================================================
Version 1.0 - Script Done.(10/7/2017)
=============================================================
*/

var status = -1;

function start(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 1 && mode == 0) {
            status -= 2;
        } else {
            qm.sendOk("¡Vamos, la ciudad realmente necesita que cooperes en esto!");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("¡Sabía que podíamos confiar en el extraño en este asunto! Ahora que tenemos la carta traducida por él, entrégasela a Jack, él sabe qué hacer.");
    } else if (status == 1) {
        if (qm.haveItem(4032018, 1)) {
            qm.forceStartQuest();
        } else if (qm.canHold(4032018, 1)) {
            qm.gainItem(4032018, 1);
            qm.forceStartQuest();
        } else {
            qm.sendOk("Oye, necesitas un espacio en tu ETC para recibir el comunicado.");
        }

        qm.dispose();
    }
}

function end(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 1 && mode == 0) {
            status -= 2;
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        if (qm.haveItem(4032018, 1)) {
            qm.sendOk("Oh, lo trajiste. Bien hecho, el proceso de contramedidas será mucho más fácil ahora.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 50000 EXP");
        } else {
            qm.sendOk("¿Qué ocurre? ¿Por qué aún no recuperaste el mensaje traducido? Por favor, tráigame el contenido de la carta para poder diseñar una estrategia para una contramedida lo antes posible.");
            qm.dispose();
        }
    } else if (status == 1) {
        qm.gainItem(4032018, -1);
        qm.gainExp(50000);
        qm.forceCompleteQuest();

        qm.dispose();
    }
}
