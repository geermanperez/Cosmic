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
/**
 *2013002.js - Minerva the Goddess
 *@author Ronan
 */
var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
    } else {
        status++;
        if (cm.getPlayer().getMapId() == 920010100) { //Center tower
            if (status == 0) {
                cm.sendYesNo("He levantado el hechizo que bloqueaba el acceso a los almacenes de la cárcel de la torre. Es posible que encuentres algunas cosas buenas allí abajo... Alternativamente, es posible que quieras irte ahora. ¿Estás listo para salir?");
            } else if (status == 1) {
                cm.warp(920011300, 0);
                cm.dispose();
            }

        } else if (cm.getPlayer().getMapId() == 920011100) {
            if (status == 0) {
                cm.sendYesNo("Entonces, ¿estás listo para salir?");
            } else if (status == 1) {
                cm.warp(920011300, 0);
                cm.dispose();
            }

        } else if (cm.getPlayer().getMapId() == 920011300) {
            if (status == 0) {
                cm.sendNext("Gracias no sólo por restaurar la estatua, sino también por rescatarme a mí, Minerva, de la trampa. Que la bendición de la diosa te acompañe hasta el final... Como muestra de gratitud, acepta este recuerdo por tu valentía.");
            } else if (status == 1) {
                if (cm.getEventInstance().giveEventReward(cm.getPlayer())) {
                    cm.warp(200080101, 0);
                    cm.dispose();
                } else {
                    cm.sendOk("Primero haga espacio en su inventario.");
                    cm.dispose();
                }
            }
        }
    }
}