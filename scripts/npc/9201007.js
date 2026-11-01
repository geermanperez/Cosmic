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
 Assistant Nancy
 -- By ---------------------------------------------------------------------------------------------
 Angel (get31720)
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Angel
 2.0 - Second Version by happydud3 & XotiCraze
 3.0 - Third Version by RonanLana (HeavenMS)
 ---------------------------------------------------------------------------------------------------
 **/

var status;
var eim;
var hasEngage;
var hasRing;

function start() {
    eim = cm.getEventInstance();
    if (eim == null) {
        cm.warp(680000000, 0);
        cm.dispose();
        return;
    }

    if (cm.getMapId() == 680000200) {
        if (eim.getIntProperty("weddingStage") == 0) {
            cm.sendNext("Los invitados se están reuniendo aquí ahora mismo. Espere un poco, la ceremonia comenzará pronto.");
        } else {
            cm.warp(680000210, "sp");
            cm.sendNext("¡Elige tu asiento aquí y buen espectáculo!");
        }

        cm.dispose();
    } else {
        if (cm.getPlayer().getId() != eim.getIntProperty("groomId") && cm.getPlayer().getId() != eim.getIntProperty("brideId")) {
            cm.sendNext("Lo siento, sólo la pareja que se casa debería estar hablando conmigo en este momento.");
            cm.dispose();
            return;
        }

        hasEngage = false;
        for (var i = 4031357; i <= 4031364; i++) {
            if (cm.haveItem(i)) {
                hasEngage = true;
                break;
            }
        }

        var rings = [1112806, 1112803, 1112807, 1112809];
        hasRing = false;
        for (i = 0; i < rings.length; i++) {
            if (cm.getPlayer().haveItemWithId(rings[i], true)) {
                hasRing = true;
            }
        }

        status = -1;
        action(1, 0, 0);
    }
}

function action(mode, type, selection) {
    if (mode == -1 || mode == 0) {
        cm.sendOk("Adiós entonces.");
        cm.dispose();
        return;
    } else if (mode == 1) {
        status++;
    } else {
        status--;
    }

    if (status == 0) {
        var hasGoldenLeaf = cm.haveItem(4000313);

        if (hasGoldenLeaf && hasEngage) {
            cm.sendOk("¡No puedes irte todavía! Debes hacer clic en Sumo Sacerdote John y casarte antes de que pueda dejarte ir.");
            cm.dispose();
        } else if (hasGoldenLeaf && hasRing) {
            var choice = Array("Go to the Afterparty", "What should I be doing");
            var msg = "What can I help you with?#b";
            for (i = 0; i < choice.length; i++) {
                msg += "\r\n#L" + i + "#" + choice[i] + "#l";
            }
            cm.sendSimple(msg);
        } else {
            cm.sendNext("No parece tener una hoja de arce dorada, un anillo de compromiso o un anillo de bodas. No debes pertenecer aquí, así que te llevaré a Amoria.");
            selection = 20; // Random.
        }
    } else if (status == 1) {
        var cmPartner;
        try {
            cmPartner = cm.getMap().getCharacterById(cm.getPlayer().getPartnerId()).getAbstractPlayerInteraction();
        } catch (err) {
            cmPartner = null;
        }

        switch (selection) {
            case 0:
                if (eim.getIntProperty("isPremium") == 1) {
                    eim.warpEventTeam(680000300);
                    cm.sendOk("¡Disfrutar! ¡Aprecia tus fotos para siempre!");
                    if (cmPartner != null) {
                        cmPartner.npcTalk(cm.getNpc(), "Enjoy! Cherish your Photos Forever!");
                    }
                } else {    // skip the party-time (premium only)
                    eim.warpEventTeam(680000500);
                    cm.sendOk("¡Felicitaciones por los recién casados! Te acompañaré hasta la salida.");
                    if (cmPartner != null) {
                        cmPartner.npcTalk(cm.getNpc(), "Congratulations for the newly-wed! I will escort you to the exit.");
                    }
                }

                cm.dispose();
                break;

            case 1:
                cm.sendOk("La novia y el novio deben recibir las bendiciones del Sumo Sacerdote Juan para casarse. Cuando estés listo, puedes hacer clic en mí para ir al Afterparty.");
                cm.dispose();
                break;

            default:
                cm.warp(680000000, 0);
                cm.dispose();
                break;
        }
    }
}
