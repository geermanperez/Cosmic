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
            qm.sendNext("Una vez que tengas#b2do ascenso laboral#k, te contaré sobre el#bCastillo de setas#k.");
        } else if (status == 1) {
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
            const GameConstants = Java.type('constants.game.GameConstants');
            if (GameConstants.getJobBranch(qm.getPlayer().getJob()) == 1) {
                qm.sendNext("Eh, ¿no entendiste el#r2do ascenso laboral#k¿todavía?");
                qm.dispose();
                return;
            }

            qm.sendNext("Está bien, pareces listo para ir al#bCastillo de setas#k. En#rHenesys#k, sube al fuerte del árbol en#bwest#k luego entra a un portal por ahí. En la otra zona,#rirse para el otro lado#k. Desde allí, habrá un portal disponible para acceder a la#bCastillo de setas#kárea.");
            qm.forceCompleteQuest();
        } else if (status == 1) {
            qm.dispose();
        }
    }
}