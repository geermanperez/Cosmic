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

/* Oasis near Ariant Castle
 */


function isTigunMorphed(ch) {
    const BuffStat = Java.type('client.BuffStat');
    return ch.getBuffSource(BuffStat.MORPH) == 2210005;
}

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 0) {
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0 && mode == 1) {
            if (cm.isQuestStarted(3900) && cm.getQuestProgressInt(3900) != 5) {
                cm.sendOk("#b(Bebes el agua del oasis y te sientes renovado).", 2);
                cm.setQuestProgress(3900, 5);
            } else if (cm.isQuestCompleted(3938)) {
                if (cm.canHold(2210005)) {
                    if (!cm.haveItem(2210005) && !isTigunMorphed(cm.getPlayer())) {
                        cm.gainItem(2210005, 1);
                        cm.sendOk("Encontraste un mechón de cabello (probablemente de Tigun) flotando junto al agua y lo atrapaste. Recordando cómo lo hizo #bJano#k la última vez, creaste un nuevo #t2210005#.", 2);
                    }
                } else {
                    cm.sendOk("No tienes un espacio USE disponible.", 2);
                }
            } else if (cm.isQuestStarted(3934) || (cm.isQuestCompleted(3934) && !cm.isQuestCompleted(3935))) {
                if (cm.canHold(2210005)) {
                    if (!cm.haveItem(2210005) && !isTigunMorphed(cm.getPlayer())) {
                        cm.gainItem(2210005, 1);
                        cm.sendOk("Conseguiste encontrar un extraño matraz flotando en el río. Parece una botella de transformación imitando a uno de los guardias del castillo, tal vez con ella puedas deambular libremente por su interior.", 2);
                    }
                } else {
                    cm.sendOk("Encontraste un extraño frasco flotando en el río. Pero decidiste ignorarlo porque no tienes un espacio USE disponible.", 2);
                }
            }

            cm.dispose();
        }
    }
}