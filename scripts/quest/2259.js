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
            qm.sendNext("Ok, nos vemos en#b#m260020700##kpara tu información. Para llegar allí, siga#reast#k desde aquí hasta llegar#rMagatia#k, estaré allí. Ahora vete.");
        } else {
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
            if (qm.getMapId() == 260020000) {
                qm.sendNext("¿Eh todavía estás aquí? para alcanzar#b#m260020700##k, seguir#reast#k desde aquí hasta llegar#rMagatia#k, estaré allí. Ahora vete.");
                return;
            }

            qm.sendNext("Ah, ahí estás. No hay suricatas cerca, por lo que probablemente no haya escuchas por aquí. Muy bien, debes estar en forma para ir al#rCastillo de setas#k. Hablame una vez que tengas#bnivel 30#k.");
            qm.forceCompleteQuest();
        } else if (status == 1) {
            qm.dispose();
        }
    }
}