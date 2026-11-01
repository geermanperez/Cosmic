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
 Assistant Travis
 -- By ---------------------------------------------------------------------------------------------
 Angel (get31720)
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Angel
 2.0 - Second Version by happydud3 & XotiCraze
 3.0 - Third Version by RonanLana (HeavenMS)
 ---------------------------------------------------------------------------------------------------
 **/

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || mode == 0) {
        cm.dispose();
        return;
    } else if (mode == 1) {
        status++;
    } else {
        status--;
    }

    var eim = cm.getEventInstance();
    if (eim == null) {
        cm.warp(680000000, 0);
        cm.dispose();
        return;
    }

    var isMarrying = (cm.getPlayer().getId() == eim.getIntProperty("groomId") || cm.getPlayer().getId() == eim.getIntProperty("brideId"));

    switch (status) {
        case 0:
            if (cm.getMapId() == 680000300) {
                cm.sendYesNo("¿Estás seguro de que quieres#rabandonar el escenario#ky regresar a#bAmoria#k? Usted será#rsaltándose las etapas de bonificación#kde esa manera.");
            } else {
                var hasEngagement = false;
                for (var x = 4031357; x <= 4031364; x++) {
                    if (cm.haveItem(x, 1)) {
                        hasEngagement = true;
                        break;
                    }
                }

                if (cm.haveItem(4000313) && isMarrying) {
                    if (eim.getIntProperty("weddingStage") == 3) {
                        cm.sendOk("¡¡¡Ustedes sacudieron totalmente el escenario!!! Ve, ve, habla con#b#p9201007##kpara comenzar la fiesta posterior.");
                        cm.dispose();
                    } else if (hasEngagement) {
                        if (!cm.createMarriageWishlist()) {
                            cm.sendOk("Ya has enviado tu lista de deseos...");
                        }
                        cm.dispose();
                    } else {
                        cm.sendOk("Oh, oye, ¿dónde están las credenciales de este partido tan elogiado? Oh hombre, no podemos continuar a este ritmo ahora... Lo siento, se acabó la fiesta.");
                    }
                } else {
                    if (eim.getIntProperty("weddingStage") == 3) {
                        if (!isMarrying) {
                            cm.sendYesNo("¿Ustedes no los extrañaron, verdad? Nuestras superestrellas#rtrabajaron muy bien juntos#k, etcétera#bempezarán la fiesta posterior#k. ¿Realmente vas a#rabandonar el programa#ky volver a#bAmoria#k?");
                        } else {
                            cm.sendOk("¡¡¡Ustedes sacudieron totalmente el escenario!!! Ve, ve, habla con#b#p9201007##kpara comenzar la fiesta posterior.");
                            cm.dispose();
                        }
                    } else {
                        cm.sendYesNo("¿Estás seguro de que quieres#rabandonar el escenario#ky dirígete a#bAmoria#k? Usted será#rsaltándose las etapas de bonificación#k, familia.");
                    }
                }
            }


            break;

        case 1:
            cm.warp(680000000, 0);
            cm.dispose();
            break;
    }
}
