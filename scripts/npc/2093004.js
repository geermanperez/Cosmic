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
var menu;
var cost = 10000;

function start() {
    cm.sendYesNo("¿Te mudarás a#b#m230000000##k¿ahora? el precio es#b" + cost + "mesos#k.");
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.sendNext("Hmmm... ¿demasiado ocupado para hacerlo ahora? Pero si tienes ganas de hacerlo, vuelve y búscame.");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 1) {
            if (cm.getPlayer().getMeso() < cost) {
                cm.sendOk("No creo que tengas suficiente dinero...");
            } else {
                cm.gainMeso(-cost);
                cm.warp(230000000);
            }
            cm.dispose();
        }
    }
}