/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/*	
	Author : kevintjuh93
*/

var status = -1;

function start(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 15 && mode == 0) {
            qm.sendNext("Oh, no hay necesidad de rechazar mi oferta. No es gran cosa. Es sólo una poción. Bueno, avísame si cambias de opinión.");
            qm.dispose();
            return;
        }
        //status -= 2;
    }

    if (status == 0) {
        qm.sendNext("Hm, ¿qué hace un humano en esta isla? Espera, es #p1201000#. ¿Qué haces aquí, #p1201000#? ¿Y quién es ese que está a tu lado? ¿Es alguien que conoces, #p1201000#? ¿Qué? ¿El héroe, dices?");
    } else if (status == 1) {
        qm.sendNextPrev("     #i4001170#");//gms like
    } else if (status == 2) {
        qm.sendNextPrev("Ah, este debe ser el héroe que tú y tu clan estaban esperando. ¿Estoy en lo cierto, #p1201000#? Ah, sabía que no estabas simplemente acompañando a un transeúnte promedio...");
    } else if (status == 3) {
        qm.sendAcceptDecline("Oh, pero parece que nuestro héroe se ha debilitado mucho desde la maldición del Mago Negro. Tiene sentido, considerando que el héroe ha estado dormido durante cientos de años.#bToma, te daré una poción de recuperación de HP.#k");//nexon probably forgot to remove the '.' before '#k', lol
    } else if (status == 4) {
        if (qm.getPlayer().getHp() >= 50) {
            qm.getPlayer().updateHp(25);
        }
        if (!qm.isQuestStarted(21010) && !qm.isQuestCompleted(21010)) {
            qm.gainItem(2000022, 1);
            qm.forceStartQuest();
        }
        qm.sendNext("Bébelo primero. Entonces hablaremos.", 9);
    } else if (status == 5) {
        qm.sendNextPrev("#b(¿Cómo bebo la poción? No lo recuerdo...)", 3);
    } else if (status == 6) {
        qm.guideHint(14);
        qm.dispose();
    }
}

function end(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 1 && mode == 0) {
            qm.dispose();
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        if (qm.c.getPlayer().getHp() < 50) {
            qm.sendNext("Aún no has bebido la poción.");
            qm.dispose();
        } else {
            qm.sendNext("Hemos estado cavando y cavando dentro de la Cueva de Hielo con la esperanza de encontrar un héroe, pero nunca pensé que vería el día... ¡La profecía era cierta! ¡Tenías razón, #p1201000#! Ahora que uno de los héroes legendarios ha regresado, ¡no tenemos motivos para temer al Mago Negro!");
        }
    } else if (status == 1) {
        qm.sendOk("Oh, te he retenido demasiado tiempo. Lo siento, me dejé llevar un poco. Estoy seguro de que los otros pingüinos sienten lo mismo. Sé que estás ocupado, pero ¿podrías#bpara y habla con los otros pingüinos#k¿de camino a la ciudad? Serían muy honrados.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i2000022# 5 #t2000022#\r\n#i2000023# 5 #t2000023#\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 16 exp.");
    } else if (status == 2) {
        if (qm.isQuestStarted(21010) && !qm.isQuestCompleted(21010)) {
            qm.gainExp(16);
            qm.gainItem(2000022, 5);
            qm.gainItem(2000023, 5);
            qm.forceCompleteQuest();
        }

        qm.sendNext("¡Oh, has subido de nivel! Es posible que incluso hayas recibido algunos puntos de habilidad. En Maple World, puedes adquirir 3 puntos de habilidad cada vez que subes de nivel. Presione el#btecla K#kpara ver la ventana de Habilidad.", 9);
    } else if (status == 3) {
        qm.sendNextPrev("#b(Todos han sido muy amables conmigo, pero no puedo recordar nada. ¿Soy realmente un héroe? Debería comprobar mis habilidades y ver. Pero, ¿cómo puedo comprobarlas?)", 3);
    } else if (status == 4) {
        qm.guideHint(15);
        qm.dispose();
    }
}

