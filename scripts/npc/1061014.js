/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License version 3
    as published by the Free Software Foundation. You may not use, modify
    or distribute this program under any other version of the
    GNU Affero General Public License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/*
 *
 *@author Ronan
 */

var status = 0;
var expedition;
var expedMembers;
var player;
var em;
const ExpeditionType = Java.type('server.expeditions.ExpeditionType');
const exped = ExpeditionType.BALROG_NORMAL;
var expedName = "Balrog";
var expedBoss = "Balrog";
var expedMap = "Balrog's Tomb";

var list = "What would you like to do?#b\r\n\r\n#L1#View current Expedition members#l\r\n#L2#Start the fight!#l\r\n#L3#Stop the expedition.#l";

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {

    player = cm.getPlayer();
    expedition = cm.getExpedition(exped);
    em = cm.getEventManager("BalrogBattle");

    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }

        if (status == 0) {
            if (player.getLevel() < exped.getMinLevel() || player.getLevel() > exped.getMaxLevel()) { //Don't fit requirement, thanks Conrad
                cm.sendOk("No cumples con los criterios para luchar." + expedBoss + "!");
                cm.dispose();
            } else if (expedition == null) { //Start an expedition
                cm.sendSimple("#e#b<Expedición:" + expedName + ">\r\n#k#n" + em.getProperty("fiesta") + "\r\n\r\n¿Te gustaría formar un equipo para enfrentarte a #r?" + expedBoss + "#k?\r\n#b#L1#¡Pongamos esto en marcha!#l\r\n\#L2#Noh, creo que esperaré un poco...#l\r\n\#L3#IMe gustaría ver información sobre esta expedición...#l");
                status = 1;
            } else if (expedition.isLeader(player)) { //If you're the leader, manage the exped
                if (expedition.isInProgress()) {
                    cm.sendOk("Su expedición ya está en progreso, por aquellos que permanecen luchando, oremos por esas almas valientes.");
                    cm.dispose();
                } else {
                    cm.sendSimple(list);
                    status = 2;
                }
            } else if (expedition.isRegistering()) { //If the expedition is registering
                if (expedition.contains(player)) { //If you're in it but it hasn't started, be patient
                    cm.sendOk("Ya te has registrado para la expedición. Espere por favor #r" + expedition.getLeader().getName() + "#k para comenzar.");
                    cm.dispose();
                } else { //If you aren't in it, you're going to get added
                    cm.sendOk(expedition.addMember(cm.getPlayer()));
                    cm.dispose();
                }
            } else if (expedition.isInProgress()) { //Only if the expedition is in progress
                if (expedition.contains(player)) { //If you're registered, warp you in
                    var eim = em.getInstance(expedName + player.getClient().getChannel());
                    if (eim.getIntProperty("canJoin") == 1) {
                        eim.registerPlayer(player);
                    } else {
                        cm.sendOk("Tu expedición ya empezó la batalla contra" + expedBoss + ". Oremos por esas almas valientes.");
                    }

                    cm.dispose();
                } else { //If you're not in by now, tough luck
                    cm.sendOk("Otra expedición ha tomado la iniciativa de desafiar" + expedBoss + ", oremos por esas almas valientes.");
                    cm.dispose();
                }
            }
        } else if (status == 1) {
            if (selection == 1) {
                expedition = cm.getExpedition(exped);
                if (expedition != null) {
                    cm.sendOk("Alguien ya tomó la iniciativa de ser el líder de la expedición. ¡Intenta unirte a ellos!");
                    cm.dispose();
                    return;
                }

                var res = cm.createExpedition(exped);
                if (res == 0) {
                    cm.sendOk("El #r" + expedBoss + "Se ha creado la expedición#k.\r\n\r\n¡Habla conmigo nuevamente para ver el equipo actual o comienza la pelea!");
                } else if (res > 0) {
                    cm.sendOk("Lo sentimos, ¡ya alcanzaste la cuota de intentos para esta expedición! Inténtalo de nuevo otro día...");
                } else {
                    cm.sendOk("Se ha producido un error inesperado al iniciar la expedición, inténtalo de nuevo más tarde.");
                }

                cm.dispose();

            } else if (selection == 2) {
                cm.sendOk("Claro, no todo el mundo está preparado para desafiar" + expedBoss + ".");
                cm.dispose();

            } else {
                cm.sendSimple("Hola. Soy#b#nMu-joven#n#k, el guardián del templo. Este templo se encuentra actualmente bajo asedio por las tropas Balrog. Actualmente no sabemos quién dio las órdenes." +
                    "Desde hace unas semanas, el#e#bOrden de Altair#n#kHa estado enviando mercenarios, pero siempre fueron eliminados." +
                    "Entonces, viajero, ¿te gustaría probar suerte para derrotar a este horror indescriptible? \r\n #L1#¿Qué es la #eOrden de Altair?");

                status = 10;
            }
        } else if (status == 2) {
            if (selection == 1) {
                if (expedition == null) {
                    cm.sendOk("No se pudo cargar la expedición.");
                    cm.dispose();
                    return;
                }
                expedMembers = expedition.getMemberList();
                var size = expedMembers.size();
                if (size == 1) {
                    cm.sendOk("Eres el único miembro de la expedición.");
                    cm.dispose();
                    return;
                }
                var text = "The following members make up your expedition (Click on them to expel them):\r\n";
                text += "\r\n\t\t1." + expedition.getLeader().getName();
                for (var i = 1; i < size; i++) {
                    text += "\r\n#b#L" + (i + 1) + "#" + (i + 1) + ". " + expedMembers.get(i).getValue() + "#l\n";
                }
                cm.sendSimple(text);
                status = 6;
            } else if (selection == 2) {
                var min = exped.getMinSize();
                var size = expedition.getMemberList().size();
                if (size < min) {
                    cm.sendOk("Necesitas al menos" + min + "jugadores registrados en tu expedición.");
                    cm.dispose();
                    return;
                }

                cm.sendOk("La expedición comenzará y ahora serás escoltado al #b." + expedMap + "#k.");
                status = 4;
            } else if (selection == 3) {
                const PacketCreator = Java.type('tools.PacketCreator');
                player.getMap().broadcastMessage(PacketCreator.serverNotice(6, expedition.getLeader().getName() + " has ended the expedition."));
                cm.endExpedition(expedition);
                cm.sendOk("La expedición ya ha terminado. A veces la mejor estrategia es huir.");
                cm.dispose();

            }
        } else if (status == 4) {
            if (em == null) {
                cm.sendOk("El evento no se pudo inicializar, infórmalo en el foro.");
                cm.dispose();
                return;
            }

            em.setProperty("leader", player.getName());
            em.setProperty("channel", player.getClient().getChannel());
            if (!em.startInstance(expedition)) {
                cm.sendOk("Otra expedición ha tomado la iniciativa de desafiar" + expedBoss + ", oremos por esas almas valientes.");
                cm.dispose();
                return;
            }

            cm.dispose();

        } else if (status == 6) {
            if (selection > 0) {
                var banned = expedMembers.get(selection - 1);
                expedition.ban(banned);
                cm.sendOk("has prohibido" + banned.getValue() + "de la expedición.");
                cm.dispose();
            } else {
                cm.sendSimple(list);
                status = 2;
            }
        } else if (status == 10) {
            cm.sendOk("La Orden de Altair es un grupo de mercenarios de élite que supervisan la economía mundial y las operaciones de batalla. Fue fundado hace 40 años, justo después de que Black Mage fuera derrotado con la esperanza de prever el próximo posible ataque.");
            cm.dispose();
        }
    }
}
