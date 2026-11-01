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
 * @npc: Mark of the Squad
 * @map: Cave of Life - Cave Entrance (240050000)
 * @func: Horntail PQ
 */

var status = 0;
var price = 100000;
var em = null;
var hasPass;

function isRecruitingMap(mapid) {
    return mapid == 240050000;
}

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

        if (isRecruitingMap(cm.getMapId())) {
            if (status == 0) {
                em = cm.getEventManager("HorntailPQ");
                if (em == null) {
                    cm.sendOk("El Horntail PQ ha encontrado un error.");
                    cm.dispose();
                    return;
                } else if (cm.isUsingOldPqNpcStyle()) {
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<Misión del grupo: Campo de prueba de Colacuerno>\r\n#k#n" + em.getProperty("fiesta") + "\r\n\r\nEste es el camino a la guarida de Horntail. Si quieres enfrentarte a él, tú y tu equipo seréis puestos a prueba en los campos de prueba que se avecinan.#b\r\n#L0#Pasemos al campo del juicio.\r\n#L1#Me gustaría" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "desactivar" : "permitir") + "Party Search.\r\n#L2#Me gustaría escuchar más detalles.");
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
                            cm.sendOk("O no puedo aceptar a algunos miembros de tu grupo dentro de la cueva o falta tu equipo. ¡Resuelve este problema y luego habla conmigo!");
                        }

                        cm.dispose();
                    }
                } else if (selection == 1) {
                    var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                    cm.sendOk("El estado de tu búsqueda de grupo es ahora: #b" + (psState ? "activado" : "desactivado") + "#k. Habla conmigo cuando quieras volver a cambiarlo.");
                    cm.dispose();
                } else {
                    cm.sendOk("#e#b<Misión del grupo: Campo de prueba de Colacuerno>#k#n\r\nComo guardián de la guarida de Colacuerno, otorgaré acceso#bsolo para aquellos dignos#kde su presencia. Incluso para esas personas, el camino interior es el de un laberinto, lleno de ramas y pruebas. Sin embargo, esos#rexperto en luchar contra jefes de escuadrones#ktenemos más posibilidades de enfrentarnos a nuestro líder, aunque esos#rde nuestro tipo#kTambién tengo malas posibilidades.");
                    cm.dispose();
                }
            }
        } else {
            if (!cm.isEventLeader()) {
                cm.sendOk("Sólo el líder de su grupo puede interactuar con el Programa.");
            } else if (cm.getMapId() == 240050100) {
                if (cm.haveItem(4001087) && cm.haveItem(4001088) && cm.haveItem(4001089) && cm.haveItem(4001090) && cm.haveItem(4001091)) {
                    cm.gainItem(4001087, -1);
                    cm.gainItem(4001088, -1);
                    cm.gainItem(4001089, -1);
                    cm.gainItem(4001090, -1);
                    cm.gainItem(4001091, -1);

                    cm.getEventInstance().warpEventTeam(240050200);
                } else {
                    cm.sendOk("No tienes todas las claves necesarias para continuar.");
                }
            } else if (cm.getMapId() == 240050300) {
                if (cm.haveItem(4001092, 1) && cm.haveItem(4001093, 6)) {
                    cm.gainItem(4001092, -1);
                    cm.gainItem(4001093, -6);
                    cm.getEventInstance().clearPQ();
                } else {
                    cm.sendOk("Comprueba si tienes las 6 llaves rojas y 1 llave azul contigo.");
                }
            } else if (cm.getMapId() == 240050310) {
                if (cm.haveItem(4001092, 1) && cm.haveItem(4001093, 6)) {
                    cm.gainItem(4001092, -1);
                    cm.gainItem(4001093, -6);
                    cm.getEventInstance().clearPQ();
                } else {
                    cm.sendOk("Comprueba si tienes las 6 llaves rojas y 1 llave azul contigo.");
                }
            }

            cm.dispose();
        }
    }
}