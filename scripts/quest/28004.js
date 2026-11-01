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
            if (qm.getPlayer().getLevel() > 50) {
                qm.forceCompleteQuest();
                qm.dispose();
                return;
            }

            qm.sendNext("Bien... aquí está nuestro plan para derrotar a Scrooge y sus cobardes planes. La Fuerza del Espíritu que te di es un objeto lleno de maná. Es un elemento que definitivamente usarás en el mapa que estoy a punto de enviarte. Para hacer eso, también tendrás que traer a los miembros de tu grupo contigo. ¡Deberías traer a los miembros de tu grupo aquí o formar uno ahora mismo!");
        } else if (status == 1) {
            qm.sendAcceptDecline("¿Quieres seguir adelante?");
        } else if (status == 2) {
            var level = qm.getPlayer().getLevel();

            qm.warp(level <= 30 ? 889100000 : (level <= 40 ? 889100010 : 889100020));
            qm.dispose();
        }
    }
}
