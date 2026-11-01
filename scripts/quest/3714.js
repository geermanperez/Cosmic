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
            if (!qm.haveItem(4001094, 1)) {
                qm.sendNext("no tienes un#b#t4001094##k...");
                qm.dispose();
                return;
            }

            if (qm.haveItem(2041200, 1)) {
                qm.sendOk("(El#b#t2041200##ken mi bolso se ha vuelto más brillante desde que llegué a este lugar... Al notar nuevamente, el joven dragón de allí parece estar mirándolo con amargura).");
                qm.dispose();
                return;
            }

            qm.sendNext("has traído un#b#t4001094##k¡Gracias por traer a un pariente más al nido! Por favor tenga esto...\r\n\r\n....... (bleuuhnuhgh) (blahrgngnhhng) ...\r\n\r\nEh,#b#t2041200##kcomo muestra de la gratitud de mis parientes. Y haznos un favor, por favor, saca esa cosa de aquí...");
        } else if (status == 1) {
            if (!qm.canHold(2041200, 1)) {
                qm.sendOk("Haga una habitación en su inventario USE para recibir la recompensa.");
                qm.dispose();
                return;
            }

            qm.forceCompleteQuest();
            qm.gainItem(4001094, -1);
            qm.gainItem(2041200, 1);    // quest not rewarding properly found thanks to MedicOP & Thora
            qm.gainExp(42000);
            qm.dispose();
        }
    }
}
