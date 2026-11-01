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
            qm.sendNext("¿El sello de Orbis ha sido robado por los Black Wings? Mmm, eso ha salido mal. Ve a contarle esto a #bLilin#k, ella debe tener algo en mente sobre esta situación.");
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
            qm.sendNext("¡Hola #h0#! No creerás lo que acabo de descubrir. Es una de tus habilidades perdidas... ¿Qué, los Black Wings robaron el sello de Orbis? Oh mi...");
        } else if (status == 1) {
            qm.sendNext("Por ahora déjame enseñarte el#bAplastamiento combinado#k, con él podrás infligir una gran cantidad de daño a muchos monstruos a la vez. Necesitaremos usarlo si queremos tener una oportunidad contra los Black Wings ahora, ¡así que no lo olvides!");
        } else if (status == 2) {
            qm.forceCompleteQuest();
            qm.teachSkill(21100004, 0, 20, -1); // combo smash
            qm.dispose();
        }
    }
}
