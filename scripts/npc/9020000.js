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
 * @npc: Lakelis
 * @map: 103000000 - Kerning City
 * @func: Kerning PQ
 */

var status = 0;
var state;
var em = null;

function start() {
    status = -1;
    state = (cm.getMapId() >= 103000800 && cm.getMapId() <= 103000805) ? 1 : 0;
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

        if (status == 0) {
            if (state == 1) {
                cm.sendYesNo("¿Desea abandonar esta zona?");
            } else {
                em = cm.getEventManager("KerningPQ");
                if (em == null) {
                    cm.sendOk("El Kerning PQ ha encontrado un error.");
                    cm.dispose();
                } else if (cm.isUsingOldPqNpcStyle()) {
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<Misión del grupo: 1er acompañamiento>\r\n#k#n" + em.getProperty("fiesta") + "\r\n\r\n¿Qué tal si tú y los miembros de tu grupo completan una misión colectivamente? Aquí encontrarás obstáculos y problemas que no podrás superar sin un gran trabajo en equipo. Si quieres probarlo, por favor díselo al#blíder de tu partido#kpara hablar conmigo.#b\r\n#L0#Quiero participar en la búsqueda del grupo.\r\n#L1#Me gustaría" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "desactivar" : "permitir") + "Party Search.\r\n#L2#Me gustaría escuchar más detalles.");
            }
        } else if (status == 1) {
            if (state == 1) {
                cm.warp(103000000);
                cm.dispose();
            } else {
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
                } else {
                    cm.sendOk("#e#b<Misión del grupo: 1er acompañamiento>#k#n\r\nTu grupo debe superar muchos obstáculos y acertijos mientras atraviesa los subobjetivos de esta Party Quest. Coordine con su equipo para avanzar más y derrotar al jefe final y recoger el objeto caído para acceder a la etapa de recompensas y bonificaciones.");
                    cm.dispose();
                }
            }
        }
    }
}