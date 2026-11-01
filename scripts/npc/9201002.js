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
/* High Priest John
 Marriage NPC
 */

var status;
var state;
var eim;
var weddingEventName = "WeddingCathedral";
var cathedralWedding = true;
var weddingIndoors;
const YamlConfig = Java.type('config.YamlConfig');
var weddingBlessingExp = YamlConfig.config.server.WEDDING_BLESS_EXP;

function isWeddingIndoors(mapid) {
    return mapid >= 680000100 && mapid <= 680000500;
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

function detectPlayerItemid(player) {
    for (var x = 4031357; x <= 4031364; x++) {
        if (player.haveItem(x)) {
            return x;
        }
    }

    return -1;
}

function getRingId(boxItemId) {
    return boxItemId == 4031357 ? 1112803 : (boxItemId == 4031359 ? 1112806 : (boxItemId == 4031361 ? 1112807 : (boxItemId == 4031363 ? 1112809 : -1)));
}

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

function getWeddingPreparationStatus(player, partner) {
    if (!player.haveItem(4000313)) {
        return -3;
    }
    if (!partner.haveItem(4000313)) {
        return 3;
    }

    if (!isSuitedForWedding(player, true)) {
        return -4;
    }
    if (!isSuitedForWedding(partner, true)) {
        return 4;
    }

    var hasEngagement = false;
    for (var x = 4031357; x <= 4031364; x++) {
        if (player.haveItem(x)) {
            hasEngagement = true;
            break;
        }
    }
    if (!hasEngagement) {
        return -1;
    }

    hasEngagement = false;
    for (var x = 4031357; x <= 4031364; x++) {
        if (partner.haveItem(x)) {
            hasEngagement = true;
            break;
        }
    }
    if (!hasEngagement) {
        return -2;
    }

    if (!player.canHold(1112803)) {
        return 1;
    }
    if (!partner.canHold(1112803)) {
        return 2;
    }

    return 0;
}

function giveCoupleBlessings(eim, player, partner) {
    var blessCount = eim.gridSize();

    player.gainExp(blessCount * weddingBlessingExp);
    partner.gainExp(blessCount * weddingBlessingExp);
}

function start() {
    weddingIndoors = isWeddingIndoors(cm.getMapId());
    if (weddingIndoors) {
        eim = cm.getEventInstance();
    }

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
            if (status == 0) {
                var hasEngagement = false;
                for (var x = 4031357; x <= 4031364; x++) {
                    if (cm.haveItem(x, 1)) {
                        hasEngagement = true;
                        break;
                    }
                }

                if (hasEngagement) {
                    var text = "Hi there. How can I help you?";
                    var choice = new Array("We're ready to get married.");
                    for (x = 0; x < choice.length; x++) {
                        text += "\r\n#L" + x + "##b" + choice[x] + "#l";
                    }
                    cm.sendSimple(text);
                } else {
                    cm.sendOk("Mmmm, ¡hoy dos corazones palpitantes están a punto de unirse por las bendiciones del amor!");
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
                                cm.sendOk("Por favor compre un#rprenda de boda#kpara la ceremonia, ¡rápido! Sin él no puedo casarme contigo.");
                                cm.dispose();
                                return;
                            } else if (!isSuitedForWedding(partner, false)) {
                                cm.sendOk("Por favor, infórmele a su pareja que debe tener un#rprenda de boda#klisto para la ceremonia.");
                                cm.dispose();
                                return;
                            }

                            cm.sendOk("Muy bien, los preparativos aquí también han terminado. De hecho, este es un hermoso día, ustedes dos son realmente bendecidos al casarse en un día así. ¡¡Comencemos el matrimonio!!");
                        } else {
                            cm.sendOk("Hmm, parece que tu pareja está en otra parte... Por favor, déjales venir aquí antes de comenzar la ceremonia.");
                            cm.dispose();
                        }
                    } else {
                        var placeTime = cserv.getWeddingReservationTimeLeft(wid);

                        cm.sendOk("Ten paciencia. Su boda se llevará a cabo en el #r" + placeTime + "#k. No te olvides del traje de boda.");
                        cm.dispose();
                    }
                } else {
                    cm.sendOk("Hmm, lo siento pero no hay reservas hechas para ti en este canal por el momento.");
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
                    cm.sendOk("Hmm, parece que tu pareja está en otra parte... Por favor, déjales venir aquí antes de comenzar la ceremonia.");
                    cm.dispose();
                }
            }
        } else {
            if (status == 0) {
                if (eim == null) {
                    cm.warp(680000000, 0);
                    cm.dispose();
                    return;
                }

                var playerId = cm.getPlayer().getId();
                if (playerId == eim.getIntProperty("groomId") || playerId == eim.getIntProperty("brideId")) {
                    var wstg = eim.getIntProperty("weddingStage");

                    if (wstg == 2) {
                        cm.sendYesNo("Muy bien, los invitados te han otorgado todas sus bendiciones ahora. Ha llegado el momento,#r¿Debería haceros marido y mujer?#k?");
                        state = 1;
                    } else if (wstg == 1) {
                        cm.sendOk("Mientras ustedes dos hacen sus votos matrimoniales, sus invitados actualmente les están dando sus bendiciones. Este es un momento de felicidad para ambos, disfruten la ceremonia.");
                        cm.dispose();
                    } else {
                        cm.sendOk("¡Felicitaciones por su boda! Nuestra ceremonia está completa, puedes dirigirte a#b#p9201007##kahora, ella te guiará a ti y a tus invitados a la fiesta posterior. ¡Salud por tu amor!");
                        cm.dispose();
                    }
                } else {
                    var wstg = eim.getIntProperty("weddingStage");
                    if (wstg == 1) {
                        if (eim.gridCheck(cm.getPlayer()) != -1) {
                            cm.sendOk("¡Todos den sus bendiciones a esta encantadora pareja!");
                            cm.dispose();
                        } else {
                            if (eim.getIntProperty("guestBlessings") == 1) {
                                cm.sendYesNo("¿Quieres bendecir a esta pareja?");
                                state = 0;
                            } else {
                                cm.sendOk("¡Hoy estamos reunidos aquí para reunir a esta animada pareja en matrimonio!");
                                cm.dispose();
                            }
                        }
                    } else if (wstg == 3) {
                        cm.sendOk("Los dos pájaros enamorados ahora están casados. ¡Qué día tan animado! Por favor#rprepárate para la fiesta posterior#k, debería comenzar pronto. Siga el ejemplo de la pareja casada.");
                        cm.dispose();
                    } else {
                        cm.sendOk("El tiempo de bendición del invitado ha terminado. Espera, la pareja renovará sus votos muy pronto. ¡Qué espectáculo digno de ver!");
                        cm.dispose();
                    }
                }
            } else if (status == 1) {
                if (state == 0) {    // give player blessings
                    eim.gridInsert(cm.getPlayer(), 1);

                    const PacketCreator = Java.type('tools.PacketCreator');
                    if (YamlConfig.config.server.WEDDING_BLESSER_SHOWFX) {
                        var target = cm.getPlayer();
                        target.sendPacket(PacketCreator.showSpecialEffect(9));
                        target.getMap().broadcastMessage(target, PacketCreator.showForeignEffect(target.getId(), 9), false);
                    } else {
                        var target = eim.getPlayerById(eim.getIntProperty("groomId"));
                        target.sendPacket(PacketCreator.showSpecialEffect(9));
                        target.getMap().broadcastMessage(target, PacketCreator.showForeignEffect(target.getId(), 9), false);

                        target = eim.getPlayerById(eim.getIntProperty("brideId"));
                        target.sendPacket(PacketCreator.showSpecialEffect(9));
                        target.getMap().broadcastMessage(target, PacketCreator.showForeignEffect(target.getId(), 9), false);
                    }

                    cm.sendOk("Tus bendiciones se han sumado a su amor. ¡Qué acto tan noble para una pareja encantadora!");
                    cm.dispose();
                } else {            // couple wants to complete the wedding
                    var wstg = eim.getIntProperty("weddingStage");

                    if (wstg == 2) {
                        var pid = cm.getPlayer().getPartnerId();
                        if (pid <= 0) {
                            cm.sendOk("Parece que ya no estás comprometido con tu pareja, justo frente al altar… ¿A dónde se fue toda esa felicidad que hacía un tiempo lucían ustedes dos?");
                            cm.dispose();
                            return;
                        }

                        var player = cm.getPlayer();
                        var partner = cm.getMap().getCharacterById(cm.getPlayer().getPartnerId());
                        if (partner != null) {
                            state = getWeddingPreparationStatus(player, partner);

                            switch (state) {
                                case 0:
                                    var pid = eim.getIntProperty("confirmedVows");
                                    if (pid != -1) {
                                        if (pid == player.getId()) {
                                            cm.sendOk("Ya has confirmado tus votos. Todo lo que queda es que tu pareja lo confirme ahora.");
                                        } else {
                                            eim.setIntProperty("weddingStage", 3);
                                            var cmPartner = partner.getAbstractPlayerInteraction();

                                            var playerItemId = detectPlayerItemid(player);
                                            var partnerItemId = (playerItemId % 2 == 1) ? playerItemId + 1 : playerItemId - 1;

                                            var marriageRingId = getRingId((playerItemId % 2 == 1) ? playerItemId : partnerItemId);

                                            cm.gainItem(playerItemId, -1);
                                            cmPartner.gainItem(partnerItemId, -1);

                                            const RingActionHandler = Java.type('net.server.channel.handlers.RingActionHandler');
                                            RingActionHandler.giveMarriageRings(player, partner, marriageRingId);
                                            player.setMarriageItemId(marriageRingId);
                                            partner.setMarriageItemId(marriageRingId);

                                            //var marriageId = eim.getIntProperty("weddingId");
                                            //player.sendPacket(Wedding.OnMarriageResult(marriageId, player, true));
                                            //partner.sendPacket(Wedding.OnMarriageResult(marriageId, player, true));

                                            giveCoupleBlessings(eim, player, partner);

                                            cm.getMap().dropMessage(6, "Sumo Sacerdote John: Por el poder que me ha sido conferido a través del poderoso árbol de arce, ahora os declaro Marido y Mujer. ¡Puedes besar a la novia!");
                                            eim.schedule("showMarriedMsg", 2 * 1000);
                                        }
                                    } else {
                                        eim.setIntProperty("confirmedVows", player.getId());
                                        cm.getMap().dropMessage(6, "Asistente de bodas:" + player.getName() + "ha confirmado votos! Muy bien, a un paso de hacerlo oficial. ¡Apriétense los cinturones!");
                                    }

                                    break;

                                case -1:
                                    cm.sendOk("Parece que ya no tienes el anillo/caja de anillos que compartiste con tu pareja en el momento del compromiso. Lo siento, pero eso era necesario para la boda...");
                                    break;

                                case -2:
                                    cm.sendOk("Parece que su pareja ya no tiene el anillo/caja de anillos que compartieron en el momento del compromiso. Lo siento, pero eso era necesario para la boda...");
                                    break;

                                case -3:
                                    cm.sendOk("Parece que no tienes el#r#t4000313##kentregado en la entrada... Por favor, encuéntralo, no puedo casarme contigo sin ese artículo en las manos.");
                                    break;

                                case -4:
                                    cm.sendOk("Perdón por mi grosería, pero las prendas son parte esencial de la ceremonia. Por favor#radaptarse adecuadamente#kpara una boda.");
                                    break;

                                case 1:
                                    cm.sendOk("Por favor, deja disponible un espacio EQUIP para conseguir el anillo de matrimonio, ¿quieres?");
                                    break;

                                case 2:
                                    cm.sendOk("Por favor, infórmaselo a tu pareja para que ponga a disposición un espacio EQUIP para obtener el anillo de matrimonio, ¿quieres?");
                                    break;

                                case 3:
                                    cm.sendOk("Parece que tu pareja no tiene la#r#t4000313##kentregado en la entrada... Por favor, encuéntralo, no puedo casarme contigo sin ese artículo en las manos.");
                                    break;

                                case 4:
                                    cm.sendOk("Parece que tu pareja no está vestida adecuadamente para la boda... Perdón por mi grosería, pero las prendas son parte esencial de la ceremonia.");
                                    break;
                            }

                            cm.dispose();
                        } else {
                            cm.sendOk("Hmm, parece que tu pareja no está aquí, ante el altar... Es una lástima, pero no puedo celebrar la boda si tu pareja no está aquí.");
                            cm.dispose();
                        }
                    } else {
                        cm.sendOk("tu eres ahora#bmarido y mujer#k. ¡Felicidades!");
                        cm.dispose();
                    }
                }
            }
        }
    }
}