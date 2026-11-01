/*
	NPC Name: 		Kisan
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
            qm.sendNext("¿No quieres? ¡Ni siquiera es tan difícil y recibirás equipo especial como recompensa! Bueno, piénsalo un poco y avísame si cambias de opinión.");
            qm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        qm.sendNext("Hay varias formas de cazar, pero la más básica es con tu#bAtaque regular#k. Todo lo que necesitas es un arma en la mano, ya que es una simple cuestión de simplemente blandir tu arma contra los monstruos.");
    } else if (status == 1) {
        qm.sendNextPrev("Presione el#bC#k para usar tu ataque regular. Generalmente la C se encuentra#ben la parte inferior izquierda del teclado#k, pero no necesitas que te diga eso, ¿verdad? ¡Encuentra la C y pruébala!");
    } else if (status == 2) {
        qm.sendAcceptDecline("Ahora que lo has probado, tenemos que probarlo. En esta zona puedes encontrar los más débiles.#r#o100120##kEstá en Ereve, que es perfecto para ti. Intenta cazar#r1#k. Te daré una recompensa cuando regreses.");
    } else if (status == 3) {
        qm.forceStartQuest();
        qm.guideHint(4);
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
        qm.sendNext("Ah, parece que has cazado con éxito un #o100120#. Bastante simple, ¿verdad? Los ataques regulares pueden ser fáciles de usar, pero son bastante débiles. Pero no te preocupes. #p1102006# te enseñará cómo utilizar habilidades más poderosas. Espera, déjame darte una merecida recompensa de misión antes de irte.");
    } else if (status == 1) {
        qm.sendPrev("Este equipo es para nobles. Es mucho más genial que lo que llevas puesto ahora, ¿no? Sigue las flechas a tu izquierda para encontrarte con mi hermano menor.#b#p1102006##k. ¿Qué tal si te pones tu nuevo traje de Noblesse antes de irte?\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i1002869# #t1002869# - 1 \r\n#i1052177# #t1052177# - 1 \r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 30 exp.");
    } else if (status == 2) {
        qm.gainItem(1002869, 1);
        qm.gainItem(1052177, 1);
        qm.forceCompleteQuest();
        qm.gainExp(30);
        qm.guideHint(6);
        qm.dispose();
    }
}