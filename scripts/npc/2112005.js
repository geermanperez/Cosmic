/* 
    This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
               Matthias Butz <matze@odinms.de>
               Jan Christian Meyer <vimes@odinms.de>

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

/**
 * @author: Ronan
 * @npc: Juliet
 * @func: MagatiaPQ area NPC
 */

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        var eim = cm.getEventInstance();

        if (!eim.isEventCleared()) {
            if (status == 0) {
                if (eim.getIntProperty("npcShocked") == 0 && cm.haveItem(4001130, 1)) {
                    cm.gainItem(4001130, -1);
                    eim.setIntProperty("npcShocked", 1);

                    cm.sendNext("¿Oh? ¿Tienes una carta para mí? En momentos como este, ¿qué debería ser? ¡Jadeo! Algo grande está pasando, muchachos. ¡Reúnanse, a partir de ahora las cosas serán más difíciles que nunca!");
                    eim.dropMessage(6, "Julieta parecía muy conmocionada después de leer la Carta de Romeo.");

                    cm.dispose();

                } else if (eim.getIntProperty("statusStg4") == 1) {
                    var door = cm.getMap().getReactorByName("jnr3_out3");

                    if (door.getState() == 0) {
                        cm.sendNext("Déjame abrirte la puerta.");
                        door.hitReactor(cm.getClient());
                    } else {
                        cm.sendNext("Por favor, date prisa, Romeo está en problemas.");
                    }

                    cm.dispose();

                } else if (cm.haveItem(4001134, 1) && cm.haveItem(4001135, 1)) {
                    if (cm.isEventLeader()) {
                        cm.gainItem(4001134, -1);
                        cm.gainItem(4001135, -1);
                        cm.sendNext("¡Excelente! Tienes a mano los archivos de Alcadno y Zenumist. Ahora podemos continuar.");

                        eim.showClearEffect();
                        eim.giveEventPlayersStageReward(4);
                        eim.setIntProperty("statusStg4", 1);

                        cm.getMap().killAllMonsters();
                        cm.getMap().getReactorByName("jnr3_out3").hitReactor(cm.getClient());
                    } else {
                        cm.sendOk("Por favor, deja que tu líder me pase los archivos.");
                    }

                    cm.dispose();

                } else {
                    cm.sendYesNo("Debemos seguir luchando para salvar a Romeo, por favor mantén el ritmo. Si no te sientes bien para continuar, tus compañeros y yo lo entenderemos... Entonces, ¿te vas a retirar?");
                }
            } else {
                cm.warp(926110700, 0);
                cm.dispose();
            }
        } else {
            if (status == 0) {
                if (eim.getIntProperty("escortFail") == 0) {
                    cm.sendNext("¡Finalmente Romeo está a salvo! Gracias a tus esfuerzos pudimos salvarlo de las garras de Yulete, quien ahora será juzgado por su rebelión contra Magatia. De ahora en adelante, cuando comience su rehabilitación, estaremos atentos a sus esfuerzos para asegurarnos de que no cause más problemas en el futuro.");
                } else {
                    cm.sendNext("Romeo ahora está a salvo, aunque la batalla le pasó factura... Gracias a tus esfuerzos, pudimos salvarlo de las garras de Yulete, quien ahora será juzgado por su rebelión contra Magatia. Gracias.");
                    status = 2;
                }
            } else if (status == 1) {
                cm.sendNext("Ahora, reciba este regalo como acto de aceptación de nuestro agradecimiento.");
            } else if (status == 2) {
                if (cm.canHold(4001160)) {
                    cm.gainItem(4001160, 1);

                    if (eim.getIntProperty("normalClear") == 1) {
                        cm.warp(926110600, 0);
                    } else {
                        cm.warp(926110500, 0);
                    }
                } else {
                    cm.sendOk("Asegúrate de tener un espacio en tu inventario de ETC.");
                }

                cm.dispose();
            } else {
                cm.warp(926110600, 0);
                cm.dispose();
            }
        }
    }
}