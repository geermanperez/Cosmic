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
var cost = 6000;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        }
        if (mode == 0) {
            cm.sendNext("Debes tener algunos asuntos que atender aquí, ¿verdad?");
            cm.dispose();
            return;
        }
        if (status == 0) {
            cm.sendYesNo("Hola, soy el encargado de vender los billetes para el viaje en barco a la Estación Orbis de Ossiria. El viaje a Orbis sale cada 10 minutos, a partir de la hora en punto, y te costará #b" + cost + "mesos#k. ¿Estás seguro de que quieres comprar?#b#t4031045##k?");
        } else if (status == 1) {
            if (cm.getMeso() >= cost && cm.canHold(4031045)) {
                cm.gainItem(4031045, 1);
                cm.gainMeso(-cost);
            } else {
                cm.sendOk("¿Estás seguro de que tienes #b?" + cost + "mesos#k? Si es así, le insto a que revise su inventario, etc. y vea si está lleno o no.");
            }
            cm.dispose();
        }
    }
}
