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

function start() {
    cm.sendNext("Los guerreros poseen un poder enorme con resistencia que lo respalda, y brillan más en situaciones de combate cuerpo a cuerpo. Para empezar, los ataques regulares son poderosos y, armados con habilidades complejas, el trabajo es perfecto para ataques explosivos.");
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (mode == 0) {
            cm.sendNext("Si deseas experimentar lo que es ser un Guerrero, ven a verme nuevamente.");
        }
        cm.dispose();
        return;
    }
    if (status == 0) {
        cm.sendYesNo("¿Te gustaría experimentar lo que es ser un guerrero?");
    } else if (status == 1) {
        cm.lockUI();
        cm.warp(1020100, 0);
        cm.dispose();
    }
}