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
/* The Glimmer Man
	Amoria PQ Stg1/exit
 */

var status;
var curMap, stage;

function start() {
    curMap = cm.getMapId();
    stage = Math.floor((curMap - 670010200) / 100) + 1;

    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (cm.getMapId() != 670010200) {
                cm.sendYesNo("Entonces, ¿vas a dejar este lugar?");
            } else {
                if (cm.isEventLeader()) {
                    var eim = cm.getEventInstance();
                    var st = eim.getIntProperty("statusStg" + stage);

                    if (cm.haveItem(4031595, 1)) {
                        cm.gainItem(4031595, -1);
                        eim.setIntProperty("statusStg" + stage, 1);

                        cm.sendOk("Recuperaste el #t4031595#, ¡espléndido! Puedes informarle a Amós sobre tu éxito en esta tarea.");
                    } else if (st < 1 && cm.getMap().countMonsters() == 0) {
                        eim.setIntProperty("statusStg" + stage, 1);

                        var mapObj = cm.getMap();
                        mapObj.toggleDrops();

                        const LifeFactory = Java.type('server.life.LifeFactory');
                        const Point = Java.type('java.awt.Point');
                        var mobObj = LifeFactory.getMonster(9400518);
                        mapObj.spawnMonsterOnGroundBelow(mobObj, new Point(-245, 810));

                        cm.sendOk("¡Apareció el fogoso! Derrótalo para conseguir el#b#t4031596##k!");
                    } else {
                        if (st < 1) {
                            cm.sendOk("Tu tarea es recuperar un fragmento del Magik Mirror. Para hacerlo, necesitará un#b#t4031596##k, que cae sobre un fuego que aparece cuando todos los demás mobs mueren. Para acceder a las habitaciones donde se encuentran los mobs, elige el portal correspondiente a tu género y mata a todos los mobs allí. Las damas toman el lado izquierdo, los caballeros el lado derecho.");
                        } else {
                            cm.sendOk("Tu tarea es recuperar un fragmento del Magik Mirror. Derrota al Fierry para conseguir el#b#t4031596##k.");
                        }
                    }
                } else {
                    cm.sendOk("Tu tarea es recuperar un fragmento del Magik Mirror. Para hacerlo, necesitará un#b#t4031596##k, que cae sobre un fuego que aparece cuando todos los demás mobs mueren. Para acceder a las habitaciones donde se encuentran los mobs, elige el portal correspondiente a tu género y mata a todos los mobs allí. Las damas toman el lado izquierdo, los caballeros el lado derecho.#bTu líder#kdebe traer el#b#t4031595##kpara tener mi pase.");
                }

                cm.dispose();
            }
        } else if (status == 1) {
            cm.warp(670010000, "st00");
            cm.dispose();
        }
    }
}