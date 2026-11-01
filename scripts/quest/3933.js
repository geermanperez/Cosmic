/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2016 - 2019 RonanLana

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
	Ardin - Sand Bandits team challenge
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
            qm.sendNext("No pensé que serías tan fuerte. Siento que tienes lo necesario para convertirte en miembro de Sand Bandits. El aspecto más importante de ser miembro es el poder, y creo que lo tienes. También... quiero ponerte a prueba una vez más, sólo para asegurarme de que eres la persona correcta. ¿Qué opinas? ¿Puedes manejarlo?");
        } else if (status == 1) {
            qm.sendAcceptDecline("Para ver realmente tu fuerza, tendré que enfrentarte yo mismo. No te preocupes, convocaré a mi otro yo para enfrentarte a ti. ¿Estás listo?");
        } else if (status == 2) {
            qm.sendNext("Bien, me gusta tu confianza.");
        } else if (status == 3) {
            if (qm.getWarpMap(926000000).getCharacters().size() > 0) {
                qm.sendOk("Hay alguien actualmente en este mapa, vuelve más tarde.");
                qm.dispose();
            } else {
                qm.warp(926000000, "st00");
                qm.forceStartQuest();
                qm.dispose();
            }
        }
    }
}
