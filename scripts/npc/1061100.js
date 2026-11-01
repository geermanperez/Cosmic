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
 -- Odin JavaScript --------------------------------------------------------------------------------
 Hotel Receptionist - Sleepywood Hotel(105040400)
 -- By ---------------------------------------------------------------------------------------------
 Unknown
 -- Version Info -----------------------------------------------------------------------------------
 1.3 - More Cleanup by Moogra - 12/17/09
 1.2 - Cleanup and Statement fix by Moogra
 1.1 - Statement fix [Information]
 1.0 - First Version by Unknown
 ---------------------------------------------------------------------------------------------------
 **/

var status = 0;
var regcost = 499;
var vipcost = 999;
var iwantreg = 0;

function start() {
    cm.sendNext("Bienvenido. Somos el hotel Sleepywood. Nuestro hotel trabaja duro para servirle lo mejor en todo momento. Si está cansado y agotado por la caza, ¿qué tal una estancia relajante en nuestro hotel?");
}

function action(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status == 1)) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 2) {
            cm.sendNext("También ofrecemos otros tipos de servicios, así que piénselo detenidamente y luego tome una decisión.");
            cm.dispose();
            return;
        }
        status++;
        if (status == 1) {
            cm.sendSimple("Ofrecemos dos tipos de habitaciones para nuestro servicio. Por favor elige el de tu agrado.\r\n#b#L0#Sauna normal (" + regcost + "mesos per use)#l\r\n#L1#sauna vip (" + vipcost + "mesos por uso)#l");
            iwantreg = 1;
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendYesNo("Ha elegido la sauna normal. Tu HP y MP se recuperarán rápidamente e incluso podrás comprar algunos artículos allí. ¿Estás seguro de que quieres entrar?");
            } else if (selection == 1) {
                cm.sendYesNo("Has elegido la sauna VIP. Tu HP y MP se recuperarán incluso más rápido que en la sauna normal e incluso podrás encontrar un elemento especial allí. ¿Estás seguro de que quieres entrar?");
                iwantreg = 0;
            }
        } else if (status == 3) {
            if (iwantreg == 1) {
                if (cm.getMeso() >= regcost) {
                    cm.warp(105040401);
                    cm.gainMeso(-regcost);
                } else {
                    cm.sendNext("Lo lamento. Parece que no tienes suficientes mesos. Te costará al menos" + regcost + "mesos para alojarse en nuestro hotel.");
                }
            } else {
                if (cm.getMeso() >= vipcost) {
                    cm.warp(105040402);
                    cm.gainMeso(-vipcost);
                } else {
                    cm.sendNext("Lo lamento. Parece que no tienes suficientes mesos. Te costará al menos" + vipcost + "mesos para alojarse en nuestro hotel.");
                }
            }
            cm.dispose();
        }
    }
}