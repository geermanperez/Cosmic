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
            qm.sendNext("Aaaargh... Yeti#b#t4032339##k¡Acaba de ser robado! Que frustrante, Yeti trabajó duro para conseguirlo, solo para que ese se lo robara.#rCuervo ladrón#k...", 9);
        } else if (status == 1) {
            qm.sendNextPrev("Oye, estaba de paso y no pude evitar escucharte hace un momento. Puedo prestarte mi fuerza, ¿adónde fue el ladrón?", 3);
        } else if (status == 2) {
            qm.sendNextPrev("Oh, que amable de tu parte... Ha pasado el ladrón.#ra través de la puerta al oeste#k. traer de vuelta el#b#t4032339##k, Yeti lo necesita para dárselo a su ser querido.", 9);
        } else if (status == 3) {
            qm.sendNextPrev("Vale, espera ahí. ¡Te lo devolveré en poco tiempo!", 3);
        } else if (status == 4) {
            qm.forceStartQuest();
            qm.dispose();
        }
    }
}
