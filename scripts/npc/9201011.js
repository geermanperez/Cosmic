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
/* Pelvis Bebop
	Marriage NPC
 */

var status;
var state;
var eim;
var weddingEventName = "WeddingChapel";
var cathedralWedding = false;
var weddingIndoors;
const YamlConfig = Java.type('config.YamlConfig');
var weddingBlessingExp = YamlConfig.config.server.WEDDING_BLESS_EXP;

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
    eim = cm.getEventInstance();

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
            if (eim == null) {
                cm.warp(680000000, 0);
                cm.dispose();
                return;
            }

            var playerId = cm.getPlayer().getId();
            if (playerId == eim.getIntProperty("groomId") || playerId == eim.getIntProperty("brideId")) {
                var wstg = eim.getIntProperty("weddingStage");

                if (wstg == 2) {
                    cm.sendYesNo("Awhooooooooosh~, los invitados les han proclamado su amor a todos. Ha llegado el momento cariño ~,#r¿Debería haceros marido y mujer?#k?");
                    state = 1;
                } else if (wstg == 1) {
                    cm.sendOk("W-espera un poco, ¿vale? Tus invitados actualmente os están dando todo su cariño. Vamos a sacudir este lugar, cariño~~.");
                    cm.dispose();
                } else {
                    cm.sendOk("¡Waaaaaaaaaaa! Nuestro festival aquí ya está completo, dale una dulce charla a#b#p9201009##k, ella te llevará a ti y a tus padres a la fiesta posterior. ¡Salud por tu amor!");
                    cm.dispose();
                }
            } else {
                var wstg = eim.getIntProperty("weddingStage");
                if (wstg == 1) {
                    if (eim.gridCheck(cm.getPlayer()) != -1) {
                        cm.sendOk("¡Todos vamos a sacudir este lugar! ¡¡Vamos a rockear!!");
                        cm.dispose();
                    } else {
                        if (eim.getIntProperty("guestBlessings") == 1) {
                            cm.sendYesNo("¿Manifiestarás tu amor a las superestrellas aquí presentes?");
                            state = 0;
                        } else {
                            cm.sendOk("Nuestras superestrellas están reunidas aquí. ¡Todos, démosles una linda fiesta~!");
                            cm.dispose();
                        }
                    }
                } else if (wstg == 3) {
                    cm.sendOk("¡Woooooo-hoo! ¡El amor de la pareja ahora es como un corazón súper grande y brillante ahora mismo! Y continuará para siempre después de este festival. Por favor#rprepárate para la fiesta posterior#k, cariño ~. ¡Sigue el ejemplo de la pareja casada!");
                    cm.dispose();
                } else {
                    cm.sendOk("Ya es hora chicos... ¡Quédense con la vista y el oído atentos! ¡¡¡Están a punto de besarlo por todos lados!!!");
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

                cm.sendOk("¡Así se hace, amigo mío! ¡Tu AMOR se ha agregado al de ellos, ahora en un sentimiento más grande en forma de corazón que permanecerá vivo en nuestros corazones para siempre! ¡Quien-hoo~!");
                cm.dispose();
            } else {            // couple wants to complete the wedding
                var wstg = eim.getIntProperty("weddingStage");

                if (wstg == 2) {
                    var pid = cm.getPlayer().getPartnerId();
                    if (pid <= 0) {
                        cm.sendOk("Huh~.... Espera, espera, ¿acabas de romper esa cosa que tenías ahora? Dios mío, ¿qué pasó?");
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

                                        cm.getMap().dropMessage(6, "Wayne: Lo diré ahora mismo y continuará: ustedes son la llave de la cerradura del otro, un cordón de colgante. Eso es todo, ¡besaos!");
                                        eim.schedule("showMarriedMsg", 2 * 1000);
                                    }
                                } else {
                                    eim.setIntProperty("confirmedVows", player.getId());
                                    cm.getMap().dropMessage(6, "Asistente de bodas:" + player.getName() + "ha confirmado votos! Muy bien, a un paso de hacerlo oficial. ¡Apriétense los cinturones!");
                                }

                                break;

                            case -1:
                                cm.sendOk("Bueno, parece que ya no tienes la caja de anillos que intercambiaron en el compromiso. Awww hombre ~");
                                break;

                            case -2:
                                cm.sendOk("Bueno, parece que tu pareja ya no tiene la caja de anillos que intercambiaron en el compromiso. Awww hombre ~");
                                break;

                            case -3:
                                cm.sendOk("Bueno, parece que no tienes la#r#t4000313##kdado en la entrada... Por favor, encuéntralo, cariño~");
                                break;

                            case -4:
                                cm.sendOk("Oh, ya sé que es una mierda, pero la ropa de boda de moda juega un papel esencial aquí. Por favor úsalo antes de hablar conmigo.");
                                break;

                            case 1:
                                cm.sendOk("Por favor, deja disponible un espacio EQUIP para conseguir el anillo de matrimonio, ¿quieres?");
                                break;

                            case 2:
                                cm.sendOk("Por favor, infórmaselo a tu pareja para que ponga a disposición un espacio EQUIP para obtener el anillo de matrimonio, ¿quieres?");
                                break;

                            case 3:
                                cm.sendOk("Bueno, parece que tu pareja no tiene la#r#t4000313##kdado en la entrada... Por favor, encuéntrelo, no puedo llamar al finalmente sin él.");
                                break;

                            case 4:
                                cm.sendOk("Oh, ya sé que es una mierda, pero parece que tu pareja no está usando la ropa de boda de moda. Por favor diles que se lo pongan antes de hablar conmigo.");
                                break;
                        }

                        cm.dispose();
                    } else {
                        cm.sendOk("Uf, ¿es que tu pareja no está aquí ahora mismo? ... Oh no, me temo que no puedo llamar al final si tu pareja no está aquí.");
                        cm.dispose();
                    }
                } else {
                    cm.sendOk("Wheeeeeeeeeeeew ~ Ahora estás#boficialmente una pareja#k, y brillante. Tus movimientos encajaron de maravilla, ¡felicidades!");
                    cm.dispose();
                }
            }
        }
    }
}