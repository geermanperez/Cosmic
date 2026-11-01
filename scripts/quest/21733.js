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
            qm.sendNext("Aran, Lith han sido tomados por sorpresa. ¡Estamos bajo ataque! Llegue aquí lo antes posible.");
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
            qm.sendNext("Aran, muchas gracias! De alguna manera, el Titiritero logró eludir la seguridad de Lith Harbor. Estaba tratando de vengarse por lo del otro día. Por suerte viniste. ¡Bien hecho!");
        } else if (status == 1) {
            qm.sendNext("te enseñaré el#rDominio del arma de asta#khabilidad, para recompensar tus acciones aquí. Podrás mejorar tu precisión y el dominio general de tus artes con armas de asta.");
        } else if (status == 2) {
            qm.gainExp(8000);
            qm.teachSkill(21100000, 0, 20, -1); // polearm mastery

            qm.forceCompleteQuest();
            qm.dispose();
        }
    }
}