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
// NPC - Picture frame
// Location: Magatia - Home of the Missing Alchemist
// Used to handle quest 3322 - Phyllia's Pendant

var status;

function start() {
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

        if (!cm.isQuestStarted(3322) || cm.haveItem(4031697, 1)) {
            cm.dispose();
            return;
        }

        if (status == 0) {
            cm.sendOk("El gancho detrás del marco se desenganchó, revelando un espacio secreto dentro del marco. Allí en su interior se encontró un colgante de plata. Después de retirar con cuidado el colgante, se cerró el marco y se volvió a colocar sobre la mesa.");
        }
        else if (status == 1) {
            if (cm.canHold(4031697, 1)) {
                cm.gainItem(4031697);
            }
            else {
                cm.sendNext("Su inventario está lleno, asegúrese de tener un espacio ETC disponible.");
            }
        }
        else {
            cm.dispose();
        }
    }
}