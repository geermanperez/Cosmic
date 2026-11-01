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
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (cm.getMapId() == 925100500) {
            if (status == 0) {
                if (cm.isEventLeader()) {
                    cm.sendOk("¡Me he salvado gracias a tus esfuerzos! ¡Gracias chicos!");
                } else {
                    cm.sendOk("¡Me he salvado gracias a tus esfuerzos! ¡Gracias chicos! Deja que el líder de tu grupo hable conmigo primero antes de que te dé tus recompensas...");
                    cm.dispose();
                }
            } else {
                cm.getEventInstance().clearPQ();
                cm.dispose();
            }
        } else {
            if (status == 0) {
                cm.sendSimple("¡Gracias por salvarme! ¿Le puedo ayudar en algo?\r\n#b#L0#Sácame de aquí.\r\n#L1#Dame sombrero de pirata.");
            } else if (status == 1) {
                if (selection == 0) {
                    if (!cm.canHold(4001158, 1)) {
                        cm.sendOk("Por favor haga espacio en ETC.");
                        cm.dispose();
                        return;
                    }
                    cm.gainItem(4001158, 1);
                    cm.warp(251010404, 0);
                } else {
                    if (cm.haveItem(1003267, 1)) {
                        cm.sendOk("Tienes el mejor sombrero.");
                    } else if (cm.haveItem(1002573, 1)) {
                        if (cm.haveItem(4001158, 20)) {
                            if (cm.canHold(1003267, 1)) {
                                cm.gainItem(1002573, -1);
                                cm.gainItem(4001158, -20);
                                cm.gainItem(1003267, 1);
                                cm.sendOk("Te he dado el sombrero.");
                            } else {
                                cm.sendOk("Haga espacio en su inventario EQUIP antes de recibir el sombrero.");
                            }
                        } else {
                            cm.sendOk("Necesitas 20 #t4001158# para conseguir el siguiente sombrero.");
                        }
                    } else if (cm.haveItem(1002572, 1)) {
                        if (cm.haveItem(4001158, 20)) {
                            if (cm.canHold(1002573, 1)) {
                                cm.gainItem(1002572, -1);
                                cm.gainItem(4001158, -20);
                                cm.gainItem(1002573, 1);
                                cm.sendOk("Te he dado el sombrero.");
                            } else {
                                cm.sendOk("Haga espacio en su inventario EQUIP antes de recibir el sombrero.");
                            }
                        } else {
                            cm.sendOk("Necesitas 20 #t4001158# para conseguir el siguiente sombrero.");
                        }
                    } else {
                        if (cm.haveItem(4001158, 20)) {
                            if (cm.canHold(1002572, 1)) {
                                cm.gainItem(4001158, -20);
                                cm.gainItem(1002572, 1);
                                cm.sendOk("Te he dado el sombrero.");
                            } else {
                                cm.sendOk("Haga espacio en su inventario EQUIP antes de recibir el sombrero.");
                            }
                        } else {
                            cm.sendOk("Necesitas 20 #t4001158# para conseguir el siguiente sombrero.");
                        }
                    }
                }

                cm.dispose();
            }
        }

    }
}
