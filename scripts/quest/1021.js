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
/* Author: Xterminator
 * Edited by XxOsirisxX

	NPC Name: 		Roger
	Map(s): 		Maple Road : Lower level of the Training Camp (2)
	Description: 		Quest - Roger's Apple
*/
var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            qm.sendNext("Ey," + (qm.getPlayer().getGender() == 0 ? "Hombre" : "Extrañar") + "~ ¿Qué pasa? ¡Ja ja! Soy Roger y puedo enseñaros mucha información a los nuevos y adorables Maplers.");
        } else if (status == 1) {
            qm.sendNextPrev("¿Estás preguntando quién me obligó a hacer esto? ¡Jajajajaja!\r\n¡Yo mismo! Quería hacer esto y ser amable con ustedes, nuevos viajeros.");
        } else if (status == 2) {
            qm.sendAcceptDecline("Entonces... ¡Déjame hacer esto por diversión! ¡Abaracadabra~!");
        } else if (status == 3) {
            if (qm.getPlayer().getHp() >= 50) {
                qm.getPlayer().updateHp(25);
            }

            if (!qm.haveItem(2010007)) {
                qm.gainItem(2010007, 1);
            }

            qm.forceStartQuest();
            qm.sendNext("¿Sorprendido? Si HP llega a 0, entonces estás en problemas. Ahora te daré#rLa manzana de Roger#k. Por favor tómalo. Te sentirás más fuerte. Abra la ventana del Artículo y haga doble clic para consumir. Oye, es muy sencillo abrir la ventana Elemento. Sólo presione#bI#k en tu teclado.");
        } else if (status == 4) {
            qm.sendPrev("Por favor, toma todas las manzanas de Roger que te di. Podrás ver cómo aumenta la barra de HP. Por favor habla conmigo nuevamente cuando recuperes tu HP al 100%.");
        } else if (status == 5) {
            qm.showInfo("UI/tutorial.img/28");
            qm.dispose();
        }
    }
}

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (qm.c.getPlayer().getHp() < 50) {
                qm.sendNext("Oye, tu HP aún no se ha recuperado por completo. ¿Te llevaste toda la manzana de Roger que te di? ¿Está seguro?");
                qm.dispose();
            } else {
                qm.sendNext("¿Qué tan fácil es consumir el artículo? Sencillo, ¿verdad? Puede configurar un #bhotkey#k en la ranura inferior derecha. Jaja no lo sabías! ¿bien? Ah, y si eres principiante, HP se recuperará automáticamente a medida que pase el tiempo. Bueno, lleva tiempo pero esta es una de las estrategias para los principiantes.");
            }
        } else if (status == 1) {
            qm.sendNextPrev("¡Está bien! Ahora que has aprendido mucho, te daré un regalo. Esto es imprescindible para tu viaje a Maple World, ¡así que gracias! ¡Utilice esto en casos de emergencia!");
        } else if (status == 2) {
            qm.sendPrev("Bien, esto es todo lo que puedo enseñarte. Sé que es triste pero es hora de decir adiós. Pues cuídate y ¡buena suerte amigo!\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#v2010000# 3 #t2010000#\r\n#v2010009# 3 #t2010009#\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 10 exp.");
        } else if (status == 3) {
            if (qm.isQuestCompleted(1021)) {
                qm.dropMessage(1, "Error desconocido");
            } else if (qm.canHold(2010000) && qm.canHold(2010009)) {
                qm.gainExp(10);
                qm.gainItem(2010000, 3);
                qm.gainItem(2010009, 3);
                qm.forceCompleteQuest();
            } else {
                qm.dropMessage(1, "Tu inventario está lleno");
            }
            qm.dispose();
        }
    }
}