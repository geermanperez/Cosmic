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
 * @npc: Shuang
 * @map: Victoria Road: Excavation Site<Camp> (101030104)
 * @func: Start Guild PQ
 */

var status = 0;
var sel;
var em = null;

function findLobby(guild) {
    for (var iterator = em.getInstances().iterator(); iterator.hasNext();) {
        var lobby = iterator.next();

        if (lobby.getIntProperty("guild") == guild) {
            if (lobby.getIntProperty("canJoin") == 1) {
                return lobby;
            } else {
                return null;
            }
        }
    }

    return null;
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

        if (status == 0) {
            em = cm.getEventManager("GuildQuest");
            if (em == null) {
                cm.sendOk("El Guild Quest ha encontrado un error.");
                cm.dispose();
                return;
            }

            cm.sendSimple("#e#b<Misión del gremio: Ruinas Sharenianas>\r\n#k#n" + em.getProperty("fiesta") + "\r\n\r\nEl camino hacia lo shareniano comienza aquí. ¿Qué te gustaría hacer?#b\r\n#L0#Registra tu gremio para Guild Quest#l\r\n#L1#Únete a la Guild Quest de tu gremio#l\r\n#L2#Me gustaría escuchar más detalles.#l");
        } else if (status == 1) {
            sel = selection;
            if (selection == 0) {
                if (!cm.isGuildLeader()) {
                    cm.sendOk("Tu maestro de gremio/master jr debe hablar conmigo para registrar el gremio para la misión del gremio.");
                    cm.dispose();
                } else {
                    if (em.isQueueFull()) {
                        cm.sendOk("La cola en este canal ya está llena. Tenga paciencia y vuelva a intentarlo después de un tiempo, o inténtelo en otro canal.");
                        cm.dispose();
                    } else {
                        var qsize = em.getQueueSize();
                        cm.sendYesNo(((qsize > 0) ? "Actualmente hay #r" + qsize + "Los gremios #k hicieron cola." : "") + "¿Quieres que tu gremio se una a esta cola?");
                    }
                }
            } else if (selection == 1) {
                if (cm.getPlayer().getGuildId() > 0) {
                    var eim = findLobby(cm.getPlayer().getGuildId());
                    if (eim == null) {
                        cm.sendOk("Tu gremio no se encuentra actualmente en tiempo de estrategia en este canal. Comprueba nuevamente si tu gremio está planeando una misión de gremio o, de ser así, el canal en el que están asignadas.");
                    } else {
                        if (cm.isLeader()) {
                            em.getEligibleParty(cm.getParty());
                            eim.registerParty(cm.getPlayer());
                        } else {
                            eim.registerPlayer(cm.getPlayer());
                        }
                    }
                } else {
                    cm.sendOk("¡No puedes participar en la misión del gremio si no perteneces a ningún gremio!");
                }

                cm.dispose();
            } else {
                var reqStr = "";
                reqStr += "\r\n\r\n    Team requirements:\r\n\r\n";
                reqStr += "     - 1 team member #rbelow or equal level 30#k.\r\n";
                reqStr += "     - 1 team member who is a #rThief with Dark Sight#k skill and #rmaxed Haste#k.\r\n";
                reqStr += "     - 1 team member who is a Magician with #rmaxed Teleport#k.\r\n";
                reqStr += "     - 1 team member who is a #rlong ranged attacker#k like Bowman, Assassin, or Gunslinger.\r\n";
                reqStr += "     - 1 team member with #rgood jumping skills#k like Assassin with maxed Flash Jump or Gunslinger with Wings.\r\n";

                cm.sendOk("#e#b<Misión del gremio: Ruinas Sharenianas>#k#n\r\nÚnete a los miembros de tu gremio en un intento auspicioso de recuperar al Rubian de las garras del esqueleto, y el trabajo en equipo superará muchos acertijos y desafíos que te esperan dentro de las tumbas sharenianas. Se pueden obtener grandes recompensas al completar la instancia y se pueden acumular puntos de gremio para tu gremio." + reqStr);
                cm.dispose();
            }
        } else if (status == 2) {
            if (sel == 0) {
                var entry = em.addGuildToQueue(cm.getPlayer().getGuildId(), cm.getPlayer().getId());
                if (entry > 0) {
                    cm.sendOk("Tu gremio se ha registrado exitosamente. Aparecerá un mensaje en tu chat para mantener a tu gremio informado sobre el estado del registro.\r\n\r\nAhora,#rimportant#k: como líder de esta instancia,#rya debes estar presente en este canal#kel momento adecuado en el que se llama a tu gremio para el momento de la estrategia.#bLa presentación incorrecta de esta acción anulará#ksu registro de gremio en su totalidad, y el siguiente gremio será llamado inmediatamente. Debe tenerse en cuenta también que si usted, líder de esta instancia, se ausenta desde el final del tiempo de estrategia hasta cualquier punto de la duración de la instancia, la misión se interrumpirá y su gremio será retirado instantáneamente, moviendo nuevamente la cola.");
                } else if (entry == 0) {
                    cm.sendOk("La cola en este canal ya está llena. Tenga paciencia y vuelva a intentarlo después de un tiempo, o inténtelo en otro canal.");
                } else {
                    cm.sendOk("Tu gremio ya está en cola en un canal. Espere el turno de su gremio.");
                }
            }

            cm.dispose();
        }
    }
}