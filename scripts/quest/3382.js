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
	Author : 		Ronan
	NPC Name: 	        Yulete
	Map(s): 		Magatia
	Description: 		Quest - Yulete's Reward
	Quest ID: 		3382
*/

var status = -1;

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (qm.haveItem(4001159, 25) && qm.haveItem(4001160, 25) && !qm.haveItemWithId(1122010, true)) {
                if (qm.canHold(1122010)) {
                    qm.gainItem(4001159, -25);
                    qm.gainItem(4001160, -25);
                    qm.gainItem(1122010, 1);

                    qm.sendOk("Gracias por recuperar las canicas. Acepta este colgante como muestra de mi agradecimiento.");
                } else {
                    qm.sendNext("Libera un espacio en tu pestaña EQUIPAR antes de reclamar un premio.");
                    return;
                }
            } else if (qm.haveItem(4001159, 10) && qm.haveItem(4001160, 10)) {
                if (qm.canHold(2041212)) {
                    qm.gainItem(4001159, -10);
                    qm.gainItem(4001160, -10);
                    qm.gainItem(2041212, 1);

                    qm.sendOk("Gracias por recuperar las canicas. Esta roca que te doy puede usarse para mejorar las estadísticas del#b#t1122010##k. Tómalo como muestra de mi agradecimiento y úsalo sabiamente.");
                } else {
                    qm.sendNext("Libere un espacio en su pestaña USE antes de reclamar un premio.");
                    return;
                }
            } else {
                qm.sendNext("necesito al menos#b10 de ambos#t4001159#y#t4001160##kpara recompensarte adecuadamente. Si vienes con#b25 de estos#ken cambio, puedo recompensarte con un equipo valioso. Despedida.");
                return;
            }

            qm.forceCompleteQuest();
        } else if (status == 1) {
            qm.dispose();
        }
    }
}
