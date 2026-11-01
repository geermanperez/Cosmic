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
/* Assistant Bonnie
	Marriage NPC
 */

var status;
var wid;
var isMarrying;

var cathedralWedding = false;
var weddingEventName = "WeddingChapel";
var weddingEntryTicketCommon = 5251001;
var weddingEntryTicketPremium = 5251002;
var weddingSendTicket = 4031377;
var weddingGuestTicket = 4031406;
var weddingAltarMapid = 680000110;
var weddingIndoors;

function isWeddingIndoors(mapid) {
    return mapid >= 680000100 && mapid <= 680000500;
}

function hasSuitForWedding(player) {
    var baseid = (player.getGender() == 0) ? 1050131 : 1051150;

    for (var i = 0; i < 4; i++) {
        if (player.haveItemWithId(baseid + i, true)) {
            return true;
        }
    }

    return false;
}

function getMarriageInstance(weddingId) {
    var em = cm.getEventManager(weddingEventName);

    for (var iterator = em.getInstances().iterator(); iterator.hasNext();) {
        var eim = iterator.next();

        if (eim.getIntProperty("weddingId") == weddingId) {
            return eim;
        }
    }

    return null;
}

function hasWeddingRing(player) {
    var rings = [1112806, 1112803, 1112807, 1112809];
    for (var i = 0; i < rings.length; i++) {
        if (player.haveItemWithId(rings[i], true)) {
            return true;
        }
    }

    return false;
}

function start() {
    weddingIndoors = isWeddingIndoors(cm.getMapId());
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

        if (!weddingIndoors) {
            var hasEngagement = false;
            for (var x = 4031357; x <= 4031364; x++) {
                if (cm.haveItem(x, 1)) {
                    hasEngagement = true;
                    break;
                }
            }

            if (status == 0) {
                var text = "Welcome to the #bChapel#k! How can I help you?";
                var choice = ["How do I prepare a wedding?", "I have an engagement and want to arrange the wedding", "I am the guest and I'd like to go into the wedding"];
                for (x = 0; x < choice.length; x++) {
                    text += "\r\n#L" + x + "##b" + choice[x] + "#l";
                }

                if (cm.haveItem(5251100)) {
                    text += "\r\n#L" + x + "##bMake additional invitation cards#l";
                }

                cm.sendSimple(text);
            } else if (status == 1) {
                switch (selection) {
                    case 0:
                        cm.sendOk("Primero necesitas ser#bengaged#k a alguien.#p9201000#hace el anillo de compromiso. Una vez alcanzado el estado de compromiso, compre un#b#t" + weddingEntryTicketCommon + "##k.\r\nMuéstrame tu anillo de compromiso y un boleto de boda, y haré una reserva para ti junto con#r15 entradas de boda#k. Utilízalos para invitar a tus invitados a la boda. Necesitan 1 cada uno para entrar.");
                        cm.dispose();
                        break;

                    case 1:
                        if (hasEngagement) {
                            var wserv = cm.getClient().getWorldServer();
                            var cserv = cm.getClient().getChannelServer();
                            var weddingId = wserv.getRelationshipId(cm.getPlayer().getId());

                            if (weddingId > 0) {
                                if (cserv.isWeddingReserved(weddingId)) {    // registration check
                                    var placeTime = cserv.getWeddingReservationTimeLeft(weddingId);
                                    cm.sendOk("Su boda comenzará en el #r" + placeTime + "#k. ¡Consigue un atuendo genial y no llegues tarde!");
                                } else {
                                    var partner = wserv.getPlayerStorage().getCharacterById(cm.getPlayer().getPartnerId());
                                    if (partner == null) {
                                        cm.sendOk("Tu pareja parece estar desconectada en este momento... ¡Asegúrate de reunir a ambos aquí cuando llegue el momento!");
                                        cm.dispose();
                                        return;
                                    }

                                    if (hasWeddingRing(cm.getPlayer()) || hasWeddingRing(partner)) {
                                        cm.sendOk("O usted o su pareja ya tienen un anillo de matrimonio.");
                                        cm.dispose();
                                        return;
                                    }

                                    if (!cm.getMap().equals(partner.getMap())) {
                                        cm.sendOk("Por favor, deja que tu pareja venga aquí también para registrar la reserva.");
                                        cm.dispose();
                                        return;
                                    }

                                    if (!cm.canHold(weddingSendTicket, 15) || !partner.canHold(weddingSendTicket, 15)) {
                                        cm.sendOk("¡O usted o su pareja no tienen un espacio ETC gratuito para los boletos de boda! Por favor haga algo de espacio antes de intentar registrar una reserva.");
                                        cm.dispose();
                                        return;
                                    }

                                    if (!cm.getUnclaimedMarriageGifts().isEmpty() || !partner.getAbstractPlayerInteraction().getUnclaimedMarriageGifts().isEmpty()) {
                                        cm.sendOk("Eerhm... Lo siento, algo no parece correcto según la reserva del Registro de regalos de boda de Amoria. Por favor verifique la situación con#b#p9201014##k.");
                                        cm.dispose();
                                        return;
                                    }

                                    var hasCommon = cm.haveItem(weddingEntryTicketCommon);
                                    var hasPremium = cm.haveItem(weddingEntryTicketPremium);

                                    if (hasCommon || hasPremium) {
                                        var weddingType = (hasPremium ? true : false);

                                        var player = cm.getPlayer();
                                        var resStatus = cserv.pushWeddingReservation(weddingId, cathedralWedding, weddingType, player.getId(), player.getPartnerId());
                                        if (resStatus > 0) {
                                            cm.gainItem((weddingType) ? weddingEntryTicketPremium : weddingEntryTicketCommon, -1);

                                            var expirationTime = Channel.getRelativeWeddingTicketExpireTime(resStatus);
                                            cm.gainItem(weddingSendTicket, 15, false, true, expirationTime);
                                            partner.getAbstractPlayerInteraction().gainItem(weddingSendTicket, 15, false, true, expirationTime);

                                            var placeTime = cserv.getWeddingReservationTimeLeft(weddingId);

                                            var wedType = weddingType ? "Premium" : "Regular";
                                            cm.sendOk("Ambos habéis recibido 15 entradas de boda para entregárselas a vuestros invitados.#bHaga doble clic en el billete#kpara enviárselo a alguien. Las invitaciones sólo se pueden enviar#rantes de la hora de inicio de la boda#k. Su#b" + wedType + "boda#kestá programado para comenzar en el#r" + placeTime + "#k. ¡Consigue un atuendo genial y no llegues tarde!");

                                            player.dropMessage(6, "Asistente de bodas: Ambos habéis recibido 15 entradas de boda. Las invitaciones sólo se pueden enviar antes de la hora de inicio de la boda. Su" + wedType + "La boda está programada para comenzar en el" + placeTime + ". ¡Vístete y no llegues tarde!");
                                            partner.dropMessage(6, "Asistente de bodas: Ambos habéis recibido 15 entradas de boda. Las invitaciones sólo se pueden enviar antes de la hora de inicio de la boda. Su" + wedType + "La boda está programada para comenzar en el" + placeTime + ". ¡Vístete y no llegues tarde!");

                                            if (!hasSuitForWedding(player)) {
                                                player.dropMessage(5, "Asistente de bodas: compre un vestido de boda antes de presentarse a la ceremonia. Se puede comprar uno en la tienda de bodas situada más a la izquierda de Amoria.");
                                            }

                                            if (!hasSuitForWedding(partner)) {
                                                partner.dropMessage(5, "Asistente de bodas: compre un vestido de boda antes de presentarse a la ceremonia. Se puede comprar uno en la tienda de bodas situada más a la izquierda de Amoria.");
                                            }
                                        } else {
                                            cm.sendOk("Su reserva de boda debe haber sido procesada recientemente. Inténtelo de nuevo más tarde.");
                                        }
                                    } else {
                                        cm.sendOk("Por favor tenga un#b#t" + weddingEntryTicketCommon + "##k disponible en su inventario de EFECTIVO antes de intentar registrar una reserva.");
                                    }
                                }
                            } else {
                                cm.sendOk("Se produjo un error en la reserva de boda. Vuelve a intentarlo más tarde.");
                            }

                            cm.dispose();
                        } else {
                            cm.sendOk("No tienes un anillo de compromiso.");
                            cm.dispose();
                        }
                        break;

                    case 2:
                        if (cm.haveItem(weddingGuestTicket)) {
                            var cserv = cm.getClient().getChannelServer();

                            wid = cserv.getOngoingWedding(cathedralWedding);
                            if (wid > 0) {
                                if (cserv.isOngoingWeddingGuest(cathedralWedding, cm.getPlayer().getId())) {
                                    var eim = getMarriageInstance(wid);
                                    if (eim != null) {
                                        cm.sendOk("Disfruta la boda. No dejes caer tu Gold Maple Leaf o no podrás terminar toda la boda.");
                                    } else {
                                        cm.sendOk("Espere un momento mientras la pareja se prepara para ingresar a la Capilla.");
                                        cm.dispose();
                                    }
                                } else {
                                    cm.sendOk("Lo sentimos, pero no has sido invitado a esta boda.");
                                    cm.dispose();
                                }
                            } else {
                                cm.sendOk("No hay ninguna boda reservada en este momento.");
                                cm.dispose();
                            }
                        } else {
                            cm.sendOk("no tienes un#b#t" + weddingGuestTicket + "##k.");
                            cm.dispose();
                        }
                        break;

                    default:
                        var wserv = cm.getClient().getWorldServer();
                        var cserv = cm.getClient().getChannelServer();
                        var weddingId = wserv.getRelationshipId(cm.getPlayer().getId());

                        var resStatus = cserv.getWeddingReservationStatus(weddingId, cathedralWedding);
                        if (resStatus > 0) {
                            if (cm.canHold(weddingSendTicket, 3)) {
                                cm.gainItem(5251100, -1);

                                const Channel = Java.type('net.server.channel.Channel');
                                var expirationTime = Channel.getRelativeWeddingTicketExpireTime(resStatus);
                                cm.gainItem(weddingSendTicket, 3, false, true, expirationTime);
                            } else {
                                cm.sendOk("Tenga disponible un espacio ETC gratuito para recibir más invitaciones.");
                            }
                        } else {
                            cm.sendOk("Actualmente no estás reservado en la Capilla para realizar invitaciones adicionales.");
                        }

                        cm.dispose();
                }
            } else if (status == 2) {   // registering guest
                var eim = getMarriageInstance(wid);

                if (eim != null) {
                    cm.gainItem(weddingGuestTicket, -1);
                    eim.registerPlayer(cm.getPlayer());     //cm.warp(680000210, 0);
                } else {
                    cm.sendOk("No se pudo encontrar el evento de matrimonio.");
                }

                cm.dispose();
            }
        } else {
            if (status == 0) {
                var eim = cm.getEventInstance();
                if (eim == null) {
                    cm.warp(680000000, 0);
                    cm.dispose();
                    return;
                }

                isMarrying = (cm.getPlayer().getId() == eim.getIntProperty("groomId") || cm.getPlayer().getId() == eim.getIntProperty("brideId"));

                if (eim.getIntProperty("weddingStage") == 0) {
                    if (!isMarrying) {
                        cm.sendOk("Bienvenido a la#b#m" + cm.getMapId() + "##k. Quédese con el novio y la novia mientras los demás invitados se reúnen aquí.\r\n\r\nCuando el cronómetro llegue a su fin, la pareja se dirigirá al altar, en ese momento se le permitirá buscarlos desde el#bzona de invitados#k.");
                    } else {
                        cm.sendOk("Bienvenido a la#b#m" + cm.getMapId() + "##k. Salude a los invitados que ya están aquí mientras los demás vienen. Cuando el cronómetro llegue a su fin, la pareja se dirigirá al altar.");
                    }

                    cm.dispose();
                } else {
                    cm.sendYesNo("El#blos novios#kya están de camino al altar. ¿Quieres unirte a ellos ahora?");
                }
            } else if (status == 1) {
                cm.warp(weddingAltarMapid, "sp");
                cm.dispose();
            }
        }
    }
}