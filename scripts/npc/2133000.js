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
 * @npc: Ellin
 * @map: 300030100 - Deep Fairy Forest
 * @func: Ellin PQ
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

        if (status == 0) {
            em = cm.getEventManager("EllinPQ");
            if (em == null) {
                cm.sendOk("Ellin PQ ha encontrado un error.");
                cm.dispose();
                return;
            } else if (cm.isUsingOldPqNpcStyle()) {
                action(1, 0, 0);
                return;
            }

            cm.sendSimple("#e#b<Misión del grupo: Bosque de neblina venenosa>\r\n#k#n" + em.getProperty("fiesta") + "\r\n\r\n¿Te gustaría formar o unirte a un equipo para resolver los acertijos del#bBosque de neblina venenosa#k? ten tu#blíder del partido#khablame o hazte una fiesta.#b\r\n#L0#Quiero participar en la búsqueda del grupo.\r\n#L1#Me gustaría" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "desactivar" : "permitir") + "Búsqueda de fiesta.\r\n#L2#Me gustaría escuchar más detalles.\r\n#L3#Me gustaría reclamar un premio.");
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
                cm.sendOk("#e#b<Misión del grupo: Bosque de neblina venenosa>#k#n\r\nEn este PQ, tu misión es abrirte camino progresivamente a través del bosque, enfrentándote a todos los malos en tu camino, resolviendo muchos acertijos que encuentres y uniéndote para aprovechar lo mejor del trabajo en equipo para superar límites de tiempo y criaturas poderosas. Al eliminar al jefe final, tu equipo tiene la oportunidad de obtener una canica que,#bcuando lo deja caer junto a la fuente en el mapa de salida#k, garantizará al equipo premios extra. Buena suerte.");
                cm.dispose();
            } else {
                cm.sendSimple("Entonces, ¿qué premio quieres obtener?\r\n#b#L0#Dame aretes Altaire.\r\n#L1#Dame aretes brillantes de Altaire.\r\n#L2#Dame pendientes brillantes de Altaire");
            }
        } else if (status == 2) {
            if (selection == 0) {
                if (!cm.haveItem(1032060) && cm.haveItem(4001198, 10)) {
                    cm.gainItem(1032060, 1);
                    cm.gainItem(4001198, -10);
                    cm.dispose();
                } else {
                    cm.sendOk("O ya tienes Pendientes Altair o no tienes 10 Fragmentos de Altair.");
                    cm.dispose();
                }
            } else if (selection == 1) {
                if (cm.haveItem(1032060) && !cm.haveItem(1032061) && cm.haveItem(4001198, 10)) {
                    cm.gainItem(1032060, -1);
                    cm.gainItem(1032061, 1);
                    cm.gainItem(4001198, -10);
                    cm.dispose();
                } else {
                    cm.sendOk("O no tienes pendientes Altair o no tienes 10 fragmentos de Altair.");
                    cm.dispose();
                }
            } else if (selection == 2) {
                if (cm.haveItem(1032061) && !cm.haveItem(1032072) && cm.haveItem(4001198, 10)) {
                    cm.gainItem(1032061, -1);
                    cm.gainItem(1032072, 1);    // thanks yuxaij for noticing unexpected itemid here
                    cm.gainItem(4001198, -10);
                    cm.dispose();
                } else {
                    cm.sendOk("O no tienes aún los aretes brillantes de Altair o no tienes 10 fragmentos de Altair.");
                    cm.dispose();
                }
            }
        }
    }
}