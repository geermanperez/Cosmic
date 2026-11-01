/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2017 RonanLana

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
/* Wayne
	Marriage NPC
 */

var status;
var state;
var eim;
var weddingEventName = "WeddingChapel";
var cathedralWedding = false;


function isSuitedForWedding(player, equipped) {
    var baseid = (player.getGender() == 0) ? 1050131 : 1051150;

    if (equipped) {
        for (var i = 0; i < 4; i++) {
            if (player.haveItemEquipped(baseid + i)) {
                return true;
            }
        }
    } else {
        for (var i = 0; i < 4; i++) {
            if (player.haveItemWithId(baseid + i, true)) {
                return true;
            }
        }
    }

    return false;
}

function getMarriageInstance(player) {
    var em = cm.getEventManager(weddingEventName);

    for (var iterator = em.getInstances().iterator(); iterator.hasNext();) {
        var eim = iterator.next();
        if (eim.isEventLeader(player)) {
            return eim;
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
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            var hasEngagement = false;
            for (var x = 4031357; x <= 4031364; x++) {
                if (cm.haveItem(x, 1)) {
                    hasEngagement = true;
                    break;
                }
            }

            if (hasEngagement) {
                var text = "Hi there. How about skyrocket the day with your fiancee baby~?";
                var choice = new Array("We're ready to get married.");
                for (x = 0; x < choice.length; x++) {
                    text += "\r\n#L" + x + "##b" + choice[x] + "#l";
                }
                cm.sendSimple(text);
            } else {
                cm.sendOk("Hola amigos. ¿Incluso pensaste en celebrar una boda en Amoria? Cuando se habla de boda, todo el mundo piensa primero en Amoria, no se lo puede perder. ¡Nuestra capilla aquí es reconocida en todo el mundo Maple por ofrecer los mejores servicios de bodas para arces!");
                cm.dispose();
            }
        } else if (status == 1) {
            var wid = cm.getClient().getWorldServer().getRelationshipId(cm.getPlayer().getId());
            var cserv = cm.getClient().getChannelServer();

            if (cserv.isWeddingReserved(wid)) {
                if (wid == cserv.getOngoingWedding(cathedralWedding)) {
                    var partner = cserv.getPlayerStorage().getCharacterById(cm.getPlayer().getPartnerId());
                    if (!(partner == null || !cm.getMap().equals(partner.getMap()))) {
                        if (!cm.canHold(4000313)) {
                            cm.sendOk("Tenga disponible un espacio ETC gratuito para obtener el#b#t4000313##k.");
                            cm.dispose();
                            return;
                        } else if (!partner.canHold(4000313)) {
                            cm.sendOk("Informe a su socio que debe tener un espacio ETC gratuito disponible para obtener el#b#t4000313##k.");
                            cm.dispose();
                            return;
                        } else if (!isSuitedForWedding(cm.getPlayer(), false)) {
                            cm.sendOk("Por favor compre a la moda#rropa de boda#kpara la boda, ¡rápido! ¡Es hora de brillar, cariño~!");
                            cm.dispose();
                            return;
                        } else if (!isSuitedForWedding(partner, false)) {
                            cm.sendOk("Tu pareja debe saber que debe tener moda.#rropa de boda#kpara la boda. ¡Es hora de brillar, cariño~!");
                            cm.dispose();
                            return;
                        }

                        cm.sendOk("¡Está bien! La pareja apareció aquí tan elegante como siempre. ¡¡¡Vamos amigos, a rockear!!!");
                    } else {
                        cm.sendOk("Aww, tu pareja está en otra parte... Ambos deben estar aquí para la boda, de lo contrario será muy aburrido.");
                        cm.dispose();
                    }
                } else {
                    var placeTime = cserv.getWeddingReservationTimeLeft(wid);

                    cm.sendOk("Yo. Su boda se llevará a cabo en el #r" + placeTime + "#k, consigue una ropa decente, no llegues tarde, ¿verdad?");
                    cm.dispose();
                }
            } else {
                cm.sendOk("Aawww, lo siento pero no hay reservas hechas para ti en este canal por el momento.");
                cm.dispose();
            }
        } else if (status == 2) {
            var cserv = cm.getClient().getChannelServer();
            var wtype = cserv.getOngoingWeddingType(cathedralWedding);

            var partner = cserv.getPlayerStorage().getCharacterById(cm.getPlayer().getPartnerId());
            if (!(partner == null || !cm.getMap().equals(partner.getMap()))) {
                if (cserv.acceptOngoingWedding(cathedralWedding)) {
                    var wid = cm.getClient().getWorldServer().getRelationshipId(cm.getPlayer().getId());
                    if (wid > 0) {
                        var em = cm.getEventManager(weddingEventName);
                        if (em.startInstance(cm.getPlayer())) {
                            eim = getMarriageInstance(cm.getPlayer());
                            if (eim != null) {
                                eim.setIntProperty("weddingId", wid);
                                eim.setIntProperty("groomId", cm.getPlayer().getId());
                                eim.setIntProperty("brideId", cm.getPlayer().getPartnerId());
                                eim.setIntProperty("isPremium", wtype ? 1 : 0);

                                eim.registerPlayer(partner);
                            } else {
                                cm.sendOk("Ocurrió un error inesperado al localizar el evento de la boda. Inténtelo de nuevo más tarde.");
                            }

                            cm.dispose();
                        } else {
                            cm.sendOk("Ocurrió un error inesperado antes de los preparativos de la boda. Inténtelo de nuevo más tarde.");
                            cm.dispose();
                        }
                    } else {
                        cm.sendOk("Ocurrió un error inesperado antes de los preparativos de la boda. Inténtelo de nuevo más tarde.");
                        cm.dispose();
                    }
                } else {    // partner already decided to start
                    cm.dispose();
                }
            } else {
                cm.sendOk("Aww, parece que tu pareja está en otra parte... Ambos deben estar aquí para la boda, de lo contrario será muy aburrido.");
                cm.dispose();
            }
        }
    }
}