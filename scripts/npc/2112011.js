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
/* Yulete
	Traces of Yulete (926110500)
	Talking
 */

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            cm.sendSimple("Derrotado... Entonces, así es como el legado de Yulete llegará a su fin, oh, qué ay de esto... Espero que estén felices ahora, ya que pasaré mis días pudriéndome en un sótano oscuro. ¡¡Todo lo que he hecho ha sido por el bien de Magatia!! (sollozo)\r\n #Ll# ¡Oye hombre, ven, anímate! No hubo muchos daños que no pudieran resolverse aquí. Magatia creó estas leyes prohibitivas para proteger a su gente de los desperfectos que provocaría un poder mayor como este si llegara a manos equivocadas. ¡Ese no es el final para ti, acepta la rehabilitación de las Sociedades y todo saldrá bien!#l");
        } else if (status == 1) {
            cm.sendNext("... ¿Me están perdonando después de todo lo que he hecho? Bueno, supongo que estaba cegado por la gran fuente de poder que podría descubrirse de esa manera, tal vez tengan razón al decir que un humano no puede simplemente comprender el uso de esos poderes sin corromperse en el camino... Lo siento profundamente, y para hacer las paces con todos, estoy dispuesto a ayudar a las Sociedades nuevamente donde pueda en el progreso de la alquimia. Gracias.");
        } else {
            if (!cm.isQuestCompleted(7770)) {
                cm.completeQuest(7770);
            }

            cm.warp(926110600, 0);
            cm.dispose();
        }
    }
}