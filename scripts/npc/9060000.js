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
var status = -1;
var completed;

function start() {
    completed = cm.haveItem(4031508, 5) && cm.haveItem(4031507, 5);

    if (completed) {
        cm.sendNext("Wow~ Has logrado recolectar 5 de cada uno.#b#t4031508##ky#b#t4031507##k. Bien, entonces te enviaré al zoológico. Por favor, habla conmigo de nuevo cuando llegues.");
    } else {
        cm.sendYesNo("No has completado los requisitos. ¿Estás seguro de que quieres irte?");
    }
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        cm.dispose();
        return;
    }

    if (status == 0) {
        cm.sendOk("Bueno, está bien, te enviaré de regreso.");
    } else {
        if (completed) {
            cm.getEventInstance().clearPQ();
        } else {
            cm.warp(923010100, 0);
        }

        cm.dispose();
    }
}