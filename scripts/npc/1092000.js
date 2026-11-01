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
 * @Name         Tangyoon
 * @Author       xXOsirisXx (BubblesDev)
 */

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || !cm.isQuestStarted(2180)) {
        cm.dispose();

    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            cm.sendNext("Bien, ahora te enviaré al establo donde están mis vacas. Cuidado con los terneros que beben toda la leche. No querrás que tu esfuerzo se desperdicie.");
        } else if (status == 1) {
            cm.sendNextPrev("No será fácil distinguir a simple vista entre un ternero y una vaca. Puede que esas crías sólo tengan uno o dos meses de edad, pero ya han crecido hasta alcanzar el tamaño de su madre. Incluso se parecen... ¡incluso yo a veces me confundo! ¡Buena suerte!");
        } else if (status == 2) {
            if (cm.canHold(4031847)) {
                cm.gainItem(4031847, 1);
                cm.warp(912000100, 0);
            } else {
                cm.sendOk("No puedo darte la botella vacía porque tu inventario está lleno. Por favor, haz algo de espacio en tu ventana Etc.");
            }
            cm.dispose();
        }
    }
}