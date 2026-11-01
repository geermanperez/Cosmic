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

function isPillUsed(ch) {
    const BuffStat = Java.type('client.BuffStat');
    return ch.getBuffSource(BuffStat.HPREC) == 2022198;
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
            if (isPillUsed(qm.getPlayer())) {
                if (qm.canHoldAll([2050004, 2022224], [10, 20])) {
                    qm.sendNext("Tomaste mis experimentos. Hmm, entonces ESE es el resultado, jejejeje... Ok, toma eso como compensación, ¿quieres? Y oh, puedes#rvomita eso#kde inmediato (#bhaga clic derecho en el ícono de la píldora en la esquina superior derecha de la pantalla#k), no hay problema.");

                    qm.gainExp(12500);
                    qm.gainItem(2050004, 10);

                    var i = Math.floor(Math.random() * 5);
                    qm.gainItem(2022224 + i, 10);

                    qm.forceCompleteQuest();
                } else {
                    qm.sendNext("Eh, tu inventario está lleno. Libera algunos espacios en tu USE primero.");
                }
            } else {
                qm.sendNext("Pareces bastante normal, ¿no? No puedo detectar ningún efecto posible de mi experimento contigo. Ve a tomar la pastilla que te pedí y muéstrame los efectos, ¿quieres?");
            }
        } else if (status == 1) {
            qm.dispose();
        }
    }
}