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

/**
 * @author: Ronan
 * @npc: Wonky
 * @map: 200080101 - Orbis - The Unknown Tower
 * @func: Orbis PQ
 */

var status = 0;
var em = null;

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

        if (cm.getMapId() == 200080101) {
            if (status == 0) {
                em = cm.getEventManager("OrbisPQ");
                if (em == null) {
                    cm.sendOk("El Orbis PQ ha encontrado un error.");
                    cm.dispose();
                    return;
                } else if (cm.isUsingOldPqNpcStyle()) {
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<Misión del grupo: Torre de la Diosa>\r\n#k#n" + em.getProperty("fiesta") + "\r\n\r\n¿Te gustaría formar o unirte a un equipo para resolver los acertijos del#bTorre de la Diosa#k? ten tu#blíder del partido#khablame o hazte una fiesta.#b\r\n#L0#Quiero participar en la búsqueda del grupo.\r\n#L1#Me gustaría" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "desactivar" : "permitir") + "Búsqueda de fiesta.\r\n#L2#Me gustaría escuchar más detalles.\r\n#L3#Me gustaría reclamar un premio.");
            } else if (status == 1) {
                if (selection == 0) {
                    if (cm.getParty() == null) {
                        cm.sendOk("Puedes participar en la misión del grupo solo si estás en un grupo.");
                        cm.dispose();
                    } else if (!cm.isLeader()) {
                        cm.sendOk("El líder de tu grupo debe hablar conmigo para comenzar esta búsqueda del grupo.");
                        cm.dispose();
                    } else {
                        var eli = em.getEligibleParty(cm.getParty());
                        if (eli.size() > 0) {
                            if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                                cm.sendOk("Otro partido ya ha entrado en el#rBúsqueda de fiesta#ken este canal. Prueba con otro canal o espera a que termine la fiesta actual.");
                            }
                        } else {
                            cm.sendOk("No puedes comenzar esta misión de grupo todavía porque tu grupo no está dentro del rango de tamaño, algunos de los miembros de tu grupo no son elegibles para intentarla o no están en este mapa. Si tienes problemas para encontrar miembros del grupo, prueba Party Search.");
                        }

                        cm.dispose();
                    }
                } else if (selection == 1) {
                    var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                    cm.sendOk("El estado de tu búsqueda de grupo es ahora: #b" + (psState ? "activado" : "desactivado") + "#k. Habla conmigo cuando quieras volver a cambiarlo.");
                    cm.dispose();
                } else if (selection == 2) {
                    cm.sendOk("#e#b<Misión del grupo: Torre de la Diosa>#k#n\r\nNuestra diosa ha estado desaparecida desde hace algún tiempo, se rumorea que fue vista por última vez dentro de la Torre de la Diosa. Además, nuestro santuario ha sido tomado por las fuerzas abrumadoras de los duendes, esos seres que recientemente deambulan por las afueras de Orbis. Su líder, Papa Pixie, actualmente ocupa el trono y puede saber su paradero, por lo que instamos a encontrar una composición de héroes valientes para cargar y reclamar nuestro santuario y rescatarla. Si su equipo puede ser una combinación de todos los nichos de trabajo disponibles (guerrero, mago, arquero, ladrón y pirata), recibirán mis bendiciones para ayudarlos en la batalla. ¿Nos ayudarás?\r\n");
                    cm.dispose();
                } else {
                    cm.sendSimple("Entonces, ¿qué premio quieres obtener?\r\n#b#L0#Dame la pulsera de la Diosa.\r\n");
                }
            } else if (status == 2) {
                if (selection == 0) {
                    if (!cm.haveItem(1082232) && cm.haveItem(4001158, 10)) {
                        cm.gainItem(1082232, 1);
                        cm.gainItem(4001158, -10);
                        cm.dispose();
                    } else {
                        cm.sendOk("O ya tienes la Pulsera de la Diosa o no tienes 10 #t4001158#.");
                        cm.dispose();
                    }
                }
            }
        } else {
            if (status == 0) {
                cm.sendYesNo("¿Vas a abandonar esta misión de rescate?");
            } else if (status == 1) {
                cm.warp(920011200);
                cm.dispose();
            }
        }
    }
}