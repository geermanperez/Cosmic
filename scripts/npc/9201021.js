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
var status = 0;

function start() {
    if (cm.getMapId() != 680000401) {
        cm.sendSimple("Hola, ¿a dónde te gustaría ir?\r\n#b" + ((cm.getMapId() != 680000400) ? "#L0#UTema de Caza de Corazones Indomables#l\r\n" : "") + ((cm.getMapId() == 680000400) ? "#L1#I tiene 7 llaves. Tráeme a smash boxes#l\r\n" : "") + "#L2#Por favor, avísame.#l#k");
    } else {
        cm.sendSimple("Hola, ¿quieres volver ahora? Volver aquí de nuevo te costará#rotras 7 llaves#k.\r\n#b#L2#Por favor, envíame de regreso a los campos de entrenamiento.#l#k");
    }
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.sendOk("Adiós entonces.");
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (status == 1) {
        if (selection < 1) {
            if (!cm.haveItem(4000313, 1)) {
                cm.sendOk("Parece que perdiste tu#b#t4000313##k. Lo siento, pero no puedo dejar que vayas a los terrenos de caza sin eso.");
                cm.dispose();
                return;
            }

            cm.warp(680000400, 0);
        } else if (selection < 2) {
            if (cm.haveItem(4031217, 7)) {
                cm.gainItem(4031217, -7);
                cm.warp(680000401, 0);
            } else {
                cm.sendOk("Parece que no tienes 7 llaves. Mata los pasteles y las velas en Untamed Heart Hunting Ground para conseguir las llaves.");
            }
        } else if (selection > 1) {
            if (cm.getMapId() != 680000401) {
                cm.warp(680000500, 0);
                cm.sendOk("Adiós. ¡Espero que hayas disfrutado de la boda!");
            } else {
                cm.warp(680000400, 0);
            }
        }

        cm.dispose();
    }
}