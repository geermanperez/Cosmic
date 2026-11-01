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
 * @author BubblesDev
 * @author Ronan
 * @NPC Tory
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

        if (cm.getMapId() == 100000200) {
            if (status == 0) {
                em = cm.getEventManager("HenesysPQ");
                if (em == null) {
                    cm.sendOk("El Henesys PQ ha encontrado un error.");
                    cm.dispose();
                    return;
                } else if (cm.isUsingOldPqNpcStyle()) {
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<Misión del grupo: Primrose Hill>\r\n#k#n" + em.getProperty("fiesta") + "\r\n\r\nSoy conservador. Aquí dentro hay una hermosa colina donde florece la prímula. Hay un tigre que vive en la colina, Growlie, y parece estar buscando algo para comer. ¿Te gustaría dirigirte a la colina de prímula y unir fuerzas con los miembros de tu grupo para ayudar a Growlie?#b\r\n#L0#Quiero participar en la búsqueda del grupo.\r\n#L1#Me gustaría" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "desactivar" : "permitir") + "Búsqueda de fiesta.\r\n#L2#Me gustaría escuchar más detalles.\r\n#L3#Me gustaría canjear un sombrero de instancia.");
            } else if (status == 1) {
                if (selection == 0) {
                    if (cm.getParty() == null) {
                        cm.sendOk("¡Hola! Soy conservador. Este lugar está cubierto por el aura misteriosa de la luna llena, y ninguna persona puede entrar aquí sola.");
                        cm.dispose();
                    } else if (!cm.isLeader()) {
                        cm.sendOk("Si quieres entrar aquí, el líder de tu grupo tendrá que hablar conmigo. Habla con el líder de tu partido sobre esto.");
                        cm.dispose();
                    } else {
                        var eli = em.getEligibleParty(cm.getParty());
                        if (eli.size() > 0) {
                            if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                                cm.sendOk("Alguien ya está intentando el PQ. Espere a que terminen o busque otro canal.");
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
                    cm.sendOk("#e#b<Misión del grupo: Primrose Hill>#k#n\r\nRecoge semillas de prímula de las flores en la parte inferior del mapa y déjalas caer en las plataformas sobre el escenario. El color de las semillas de prímula debe coincidir para que crezcan, así que pruebe hasta encontrar la combinación correcta. Cuando se hayan plantado todas las semillas, es decir, comenzando la segunda parte de la misión, explora al Moon Bunny mientras prepara pasteles de arroz para el hambriento Growlie. Una vez que Growlie esté satisfecho, tu misión estará completa.");
                    cm.dispose();
                } else {
                    cm.sendYesNo("entonces quieres intercambiar#b20 #b#t4001158##k¿Para el sombrero diseñado por la instancia?");
                }
            } else {
                if (cm.hasItem(4001158, 20)) {
                    if (cm.canHold(1002798)) {
                        cm.gainItem(4001158, -20);
                        cm.gainItem(1002798, 20);
                        cm.sendNext("Aquí lo tienes. ¡Disfrutar!");
                    }
                } else {
                    cm.sendNext("¡Aún no tienes suficiente #t4001158# para comprarlo!");
                }

                cm.dispose();
            }
        } else if (cm.getMapId() == 910010100) {
            if (status == 0) {
                cm.sendYesNo("Gracias por ayudar en el esfuerzo de alimentar al Growlie. De hecho, su equipo ya ha sido recompensado por llegar hasta aquí. Con este problema ya resuelto, hay otro problema en este momento. Si está interesado, consulte #bTommy#k para obtener información. Entonces, ¿regresarás directamente a Henesys ahora?");
            } else if (status == 1) {
                if (cm.getEventInstance().giveEventReward(cm.getPlayer())) {
                    cm.warp(100000200);
                } else {
                    cm.sendOk("Parece que te falta espacio en uno de tus inventarios. Verifique esto primero para obtener la recompensa adecuada.");
                }
                cm.dispose();
            }
        } else if (cm.getMapId() == 910010400) {
            if (status == 0) {
                cm.sendYesNo("Entonces, ¿vuelves a Henesys ahora?");
            } else if (status == 1) {
                if (cm.getEventInstance() == null) {
                    cm.warp(100000200);
                } else if (cm.getEventInstance().giveEventReward(cm.getPlayer())) {
                    cm.warp(100000200);
                } else {
                    cm.sendOk("Parece que te falta espacio en uno de tus inventarios. Verifique esto primero para obtener la recompensa adecuada.");
                }
                cm.dispose();
            }
        }
    }
}