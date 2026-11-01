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

/* Steal queen's silk
 */

function isTigunMorphed(ch) {
    const BuffStat = Java.type('client.BuffStat');
    return ch.getBuffSource(BuffStat.MORPH) == 2210005;
}

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
            if (!isTigunMorphed(qm.getPlayer())) {
                qm.sendNext("¿Qué es esto? No puedo simplemente darle la seda de la Reina a nadie, alegando que se la entregarán de inmediato a la Reina. Sal de mi vista.");
                status = 1;
                return;
            }

            qm.sendNext("Tigun, ¿qué haces aquí?");
        } else if (status == 1) {
            if (!isTigunMorphed(qm.getPlayer())) {
                qm.sendNext("¿Qué es esto? No puedo simplemente darle la seda de la Reina a nadie, alegando que se la entregarán de inmediato a la Reina. Sal de mi vista.");
                return;
            }

            qm.sendNext("¿La Reina quiere su seda ahora mismo? Muy bien, los tengo aquí. Espera un momento.");
            qm.forceStartQuest();
        } else if (status == 2) {
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
            if (!isTigunMorphed(qm.getPlayer())) {
                qm.sendNext("¿Qué es esto? No puedo simplemente darle la seda de la Reina a nadie, alegando que se la entregarán de inmediato a la Reina. Sal de mi vista.");
                qm.dispose();
                return;
            }

            if (qm.canHold(4031571, 1)) {
                qm.gainItem(4031571);

                qm.sendNext("Ahí tienes. Por favor, entrégaselo a la reina lo antes posible, Tigun, se enoja mucho si las cosas se retrasan.");
                qm.forceCompleteQuest();
            } else {
                qm.sendNext("Oye, te falta espacio para sostener esto, hombre. Me quedaré con él mientras arreglas tu mochila...");
            }
        } else if (status == 1) {
            qm.dispose();
        }
    }
}