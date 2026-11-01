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
 *@Author Ronan
 * Rolly
 *	Ludibrium - Exit of the Maze (809050016)
 *	Gives Ludibrium Maze Party Quest reward
 */

var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    }
    if (mode == 0) {
        cm.dispose();

    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            cm.sendYesNo("Su grupo hizo un esfuerzo estelar y reunió al menos 30 cupones. Para eso tengo un regalo para todos y cada uno de ustedes. Después de recibir el regalo, serás enviado de regreso a Ludibrium. Ahora bien, ¿te gustaría recibir el regalo ahora mismo?");
        } else if (status == 1) {
            var eim = cm.getEventInstance();

            if (!eim.giveEventReward(cm.getPlayer())) {
                cm.sendNext("Parece que no tienes un espacio libre en tus inventarios #rEquip#k, #rUse#k o #rEtc#k. Por favor, haz espacio e inténtalo de nuevo.");
            } else {
                cm.warp(809050017);
            }

            cm.dispose();
        }
    }
}