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

/*
    NPC ID: 1052013 
    NPC NAME: Computer
    @author Ronan
*/

var status;
var pqArea;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (cm.getMapId() != 193000000) {
            var eim = cm.getEventInstance();

            if (status == 0) {
                if (!eim.isEventCleared()) {
                    var couponsNeeded = eim.getIntProperty("couponsNeeded");

                    if (cm.isEventLeader()) {
                        if (cm.haveItem(4001007, couponsNeeded)) {
                            cm.sendNext("Su equipo recopiló todos los cupones necesarios, ¡buen trabajo!");
                            cm.gainItem(4001007, couponsNeeded);
                            eim.clearPQ();

                            cm.dispose();

                        } else {
                            cm.sendYesNo("Tu equipo debe recolectar #r" + couponsNeeded + "#kcupones para completar esta instancia. Háblame cuando tengas la cantidad adecuada en tus manos... O quieras#bdejar de fumar ahora#k? Tenga en cuenta que si sale ahora#rtu equipo se verá obligado a renunciar#ktambién.");
                        }
                    } else {
                        cm.sendYesNo("Tu equipo debe recolectar #r" + couponsNeeded + "#kcupones para completar esta instancia. Deja que tu líder me hable con la cantidad adecuada en tus manos... ¿O quieres#bdejar de fumar ahora#k? Tenga en cuenta que si abandona ahora su equipo#rpuede quedar sin personal#kpara continuar con esta instancia.");
                    }
                } else {
                    if (!eim.giveEventReward(cm.getPlayer())) {
                        cm.sendOk("Haga un espacio en su inventario de ETC para recibir el premio.");
                        cm.dispose();
                    } else {
                        cm.warp(193000000);
                        cm.dispose();
                    }
                }
            } else if (status == 1) {
                cm.warp(193000000);
                cm.dispose();
            }
        } else {
            var levels = ["#m190000000#", "#m191000000#", "#m192000000#", "#m195000000#", "#m196000000#", "#m197000000#"];
            if (status == 0) {
                var sendStr = "Premium Road is a place of multiple areas with monsters of most various types gathered together, an ideal place for grinding EXP and erasers for the #p1052014#. Select the area you are willing to face:\r\n\r\n#b";
                for (var i = 0; i < 6; i++) {
                    sendStr += "#L" + i + "#" + levels[i] + "#l\r\n";
                }

                cm.sendSimple(sendStr);
            } else if (status == 1) {
                pqArea = selection + 1;

                em = cm.getEventManager("CafePQ_" + pqArea);
                if (em == null) {
                    cm.sendOk("El CaféPQ_" + pqArea + "ha encontrado un error.");
                    cm.dispose();
                    return;
                } else if (cm.isUsingOldPqNpcStyle()) {
                    status = 1;
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<Misión del grupo: Carretera Premium -" + levels[selection] + ">\r\n#k#n" + em.getProperty("fiesta") + "\r\n\r\nEl#p1052014#opera de manera diferente a los comunes. No usan billetes mesos ni gachapon, sino#rERASERS#k, que se puede obtener completando las misiones realizadas en Premium Road. Para ir allí, debes encontrar socios y asistir a una Party Quest. Cuando esté formado y listo, tenga su#blíder del partido#kháblame.#b\r\n#L0#Quiero participar en la búsqueda del grupo.\r\n#L1#Me gustaría" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "desactivar" : "permitir") + "Party Search.\r\n#L2#Me gustaría escuchar más detalles.");
            } else if (status == 2) {
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
                    cm.sendOk("#e#b<Misión del grupo: Carretera Premium>#k#n\r\nEn los mapas siguientes, te enfrentarás a muchos mobs de niveles comunes. Muele todos los cupones requeridos y dámelos. Luego, todos los miembros recibirán un borrador, correspondiente al nivel al que se enfrentan. Insertar en la máquina#bmuchos del mismo borrador o varios diferentes#kpara tener más posibilidades de obtener mayores premios.");
                    cm.dispose();
                }
            }
        }
    }
}
