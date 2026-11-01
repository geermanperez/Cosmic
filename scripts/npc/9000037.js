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
 * @npc: Agent Meow
 * @map: 970030000 - Hidden Street - Exclusive Training Center
 * @func: Boss Rush PQ
 */

var status = 0;
var state;
var em = null;

function onRestingSpot() {
    return cm.getMapId() >= 970030001 && cm.getMapId() <= 970030010;
}

function isFinalBossDone() {
    return cm.getMapId() >= 970032700 && cm.getMapId() < 970032800 && cm.getMap().getMonsters().isEmpty();
}

function detectTeamLobby(team) {
    var midLevel = 0;

    for (var i = 0; i < team.size(); i++) {
        var player = team.get(i);
        midLevel += player.getLevel();
    }
    midLevel = Math.floor(midLevel / team.size());

    var lobby;  // teams low level can be allocated at higher leveled lobbys
    if (midLevel <= 20) {
        lobby = 0;
    } else if (midLevel <= 40) {
        lobby = 1;
    } else if (midLevel <= 60) {
        lobby = 2;
    } else if (midLevel <= 80) {
        lobby = 3;
    } else if (midLevel <= 90) {
        lobby = 4;
    } else if (midLevel <= 100) {
        lobby = 5;
    } else if (midLevel <= 110) {
        lobby = 6;
    } else {
        lobby = 7;
    }

    return lobby;
}

function start() {
    status = -1;
    state = (cm.getMapId() >= 970030001 && cm.getMapId() <= 970042711) ? (!onRestingSpot() ? (isFinalBossDone() ? 3 : 1) : 2) : 0;
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
            if (state == 3) {
                if (cm.getEventInstance().getProperty("clear") == null) {
                    cm.getEventInstance().clearPQ();
                    cm.getEventInstance().setProperty("clear", "true");
                }

                if (cm.isEventLeader()) {
                    cm.sendOk("Su grupo completó una hazaña tan asombrosa al llegar tan lejos.#bhas derrotado a todos los jefes#k, felicidades! Ahora te entregaré tu recompensa mientras te transportan afuera...");
                } else {
                    cm.sendOk("Para#bderrotando a todos los jefes#ken este caso, ¡felicidades! Ahora recibirás un premio que coincida con tu desempeño aquí mientras te extraigo.");
                }
            } else if (state == 2) {
                if (cm.isEventLeader()) {
                    if (cm.getPlayer().getEventInstance().isEventTeamTogether()) {
                        cm.sendYesNo("¿Está su grupo listo para pasar a las siguientes etapas? Caminen por el portal si creen que ya terminaron, ahora es el momento... Ahora, ¿realmente quieren continuar?");
                    } else {
                        cm.sendOk("Espere a que su grupo se vuelva a reunir antes de continuar.");
                        cm.dispose();

                    }
                } else {
                    cm.sendOk("Espera a que el líder de tu partido me dé la señal para proceder. Si no te sientes muy bien y quieres dejar de fumar, atraviesa el portal, serás transportado y recibirás un premio por llegar hasta aquí.");
                    cm.dispose();

                }
            } else if (state == 1) {
                cm.sendYesNo("¿Desea abandonar esta instancia?");
            } else {
                em = cm.getEventManager("BossRushPQ");
                if (em == null) {
                    cm.sendOk("El Boss Rush PQ ha encontrado un error.");
                    cm.dispose();
                    return;
                } else if (cm.isUsingOldPqNpcStyle()) {
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<Misión del grupo: Ataque al jefe>\r\n#k#n" + em.getProperty("fiesta") + "\r\n\r\nReúna un grupo de al menos#b3 jugadores#k. El líder del partido debe hablar conmigo para comenzar.#b\r\n#L0#Quiero participar en la búsqueda del grupo.\r\n#L1#Me gustaría" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "desactivar" : "permitir") + "Party Search.\r\n#L2#Me gustaría escuchar más detalles.");
            }
        } else if (status == 1) {
            if (state == 3) {
                if (!cm.getPlayer().getEventInstance().giveEventReward(cm.getPlayer(), 6)) {
                    cm.sendOk("Organice un espacio en todas las pestañas de su inventario de antemano.");
                    cm.dispose();
                    return;
                }

                cm.warp(970030000);
                cm.dispose();
            } else if (state == 2) {
                var restSpot = ((cm.getMapId() - 1) % 5) + 1;
                cm.getPlayer().getEventInstance().restartEventTimer(restSpot * 4 * 60000);  // adds (restspot number * 4) minutes
                cm.getPlayer().getEventInstance().warpEventTeam(970030100 + cm.getEventInstance().getIntProperty("lobby") + (500 * restSpot));

                cm.dispose();
            } else if (state == 1) {
                cm.warp(970030000);
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
                            var lobby = detectTeamLobby(eli), i;
                            for (i = lobby; i < 8; i++) {
                                if (em.startInstance(i, cm.getParty(), cm.getPlayer().getMap(), 1)) {
                                    break;
                                }
                            }

                            if (i == 8) {
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
                    cm.sendOk("#e#b<Misión del grupo: Ataque al jefe>#k#n\r\nValientes aventureros de todos los lugares viajan aquí para poner a prueba sus habilidades y destrezas en combate contra los poderosos jefes de MapleStory. Reúna un grupo de#b3 a 6 jugadores#ky trabajar juntos para avanzar. Las RECOMPENSAS se otorgan según lo lejos que llegue el grupo, y se otorgan premios adicionales al final de la expedición.\r\n\r\nEsta instancia también admite#bmúltiples lobbys para emparejamiento varios rangos de niveles de equipo#kinmediatamente.");
                    cm.dispose();
                }
            }
        }
    }
}
