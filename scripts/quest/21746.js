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
            qm.sendNext("Si quieres saber más sobre Seal Rock of Mu Lung, tendrás que pasar mi prueba. Demuestra tu valor superándome en combate cuerpo a cuerpo, sólo entonces te reconoceré como un digno caballero.");
        } else {
            var mapobj = qm.getWarpMap(925040001);
            if (mapobj.countPlayers() == 0) {
                mapobj.resetPQ(1);

                qm.warp(925040001, 0);
                qm.forceStartQuest();
            } else {
                qm.sendOk("Alguien ya está intentando un desafío. Espera a que terminen antes de entrar.");
            }


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
            qm.sendNext("Oh, trajiste la tinta. Ahora déjame servirlo, con cautela... Ya casi, casi. ... ..... ¡Kyaaa! La carta. Dice: \"Estaré allí para llevarte tu Roca Sello de Mu Lung\".");
        } else if (status == 1) {
            qm.gainItem(4032342, -8);
            qm.gainItem(4220151, -1);
            qm.gainExp(10000);

            qm.forceCompleteQuest();
            qm.dispose();
        }
    }
}