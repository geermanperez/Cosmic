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
 Debbie
 -- By ---------------------------------------------------------------------------------------------
 Angel (get31720)
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Angel
 2.0 - Second Version by happydud3 & XotiCraze
 ---------------------------------------------------------------------------------------------------
 **/

var status;

function start() {
    status = -1;
    action(1, 0, 0);
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

    var eim = cm.getEventInstance();
    if (eim == null) {
        cm.warp(680000000, 0);
        cm.dispose();
        return;
    }

    var isMarrying = (cm.getPlayer().getId() == eim.getIntProperty("groomId") || cm.getPlayer().getId() == eim.getIntProperty("brideId"));

    switch (status) {
        case 0:
            var hasEngagement = false;
            for (var x = 4031357; x <= 4031364; x++) {
                if (cm.haveItem(x, 1)) {
                    hasEngagement = true;
                    break;
                }
            }

            if (cm.haveItem(4000313) && isMarrying) {
                if (eim.getIntProperty("weddingStage") == 3) {
                    cm.sendOk("Felicitaciones por su boda. Por favor habla con#b#p9201007##kpara comenzar la fiesta posterior.");
                    cm.dispose();
                } else if (hasEngagement) {
                    if (!cm.createMarriageWishlist()) {
                        cm.sendOk("Ya has enviado tu lista de deseos...");
                    }
                    cm.dispose();
                } else {
                    cm.sendOk("No tienes el artículo necesario para continuar con esta boda. Desafortunadamente, se acabó...");
                }
            } else {
                if (eim.getIntProperty("weddingStage") == 3) {
                    if (!isMarrying) {
                        cm.sendYesNo("la pareja#rse acaba de casar#k, etcétera#bempezarán la fiesta posterior#k. Deberías esperarlos aquí. ¿Estás realmente listo para#rdejar esta boda#ky volver a#bAmoria#k?");
                    } else {
                        cm.sendOk("Felicitaciones por su boda. Por favor habla con#b#p9201007##kpara comenzar la fiesta posterior.");
                        cm.dispose();
                    }
                } else {
                    cm.sendYesNo("¿Estás seguro de que quieres#rdejar esta boda#ky volver a#bAmoria#k?");
                }
            }
            break;

        case 1:
            cm.warp(680000000, 0);
            cm.dispose();
            break;
    }
}
