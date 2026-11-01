/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2016 - 2019 RonanLana

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

function start(mode, type, selection) {
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
            qm.sendNext("Aran, desde la emboscada del Titiritero, he estado pensando que es peligroso tener la#b#t4032323##kpor aquí solo. Entonces, necesito que le entregues la gema a#r#p1201000##k, en Rien, ella sabrá qué hacer con él.");
        } else if (status == 1) {
            if (!qm.canHold(4032323, 1)) {
                qm.sendNext("Libere un espacio en su inventario ETC antes de recibir el artículo.");
                qm.dispose();
                return;
            }

            if (!qm.haveItem(4032323, 1)) {
                qm.gainItem(4032323, 1);
            }
            qm.forceStartQuest();
            qm.dispose();
        }
    }
}

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
            if (qm.haveItem(4032323, 1)) {
                qm.sendNext("#r#p1002104##kenvió el#b#t4032323##kaquí por seguridad? Gracias a Dios, de hecho aquí la joya estará más segura que en cualquier otro lugar de la Isla Victoria. Gracias,#b#h0##k.");
            } else {
                qm.dispose();
            }
        } else if (status == 1) {
            qm.gainItem(4032323, -1);
            qm.gainExp(6037);
            qm.forceCompleteQuest();

            qm.dispose();
        }
    }
}