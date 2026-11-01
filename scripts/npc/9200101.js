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

/* Dr. Rhomes
	Orbis Random/VIP Eye Color Change.
*/
var status = 0;
var beauty = 0;
var colors = Array();

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1) {  // disposing issue with stylishs found thanks to Vcoc
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            cm.sendSimple("Hola, soy el Dr. Rhomes, jefe del departamento de lentes cosméticos aquí en Orbis Plastic Surgery Shop.\r\nMi objetivo aquí es agregar personalidad a los ojos de todos a través de las maravillas de los lentes cosméticos y con#b#t5152011##ko#b#t5152014##k¡Yo también puedo hacer lo mismo por ti! Ahora, ¿qué te gustaría usar?\r\n#L1#Lentes cosméticas:#i5152011##t5152011##l\r\n#L2#Lentes cosméticas:#i5152014##t5152014##l\r\n#L3#Lentes cosméticas de una sola vez:#i5152104#(cualquier color)#l");
        } else if (status == 1) {
            if (selection == 1) {
                beauty = 1;
                selectedRegularCoupon()
            } else if (selection == 2) {
                beauty = 2;
                selectedVipCoupon()
            } else if (selection == 3) {
                beauty = 3;
                selectedOneTimeCoupon()
            }
        } else if (status == 2) {
            cm.dispose();
            if (beauty == 1) {
                acceptedRegularCoupon()
            } else if (beauty == 2) {
                selectedVipStyle(selection)
            } else if (beauty == 3) {
                selectedOneTimeStyle(selection)
            }
        }
    }
}

function selectedRegularCoupon() {
    if (cm.getPlayer().getGender() == 0) {
        var current = cm.getPlayer().getFace() % 100 + 20000;
    }
    if (cm.getPlayer().getGender() == 1) {
        var current = cm.getPlayer().getFace() % 100 + 21000;
    }
    colors = Array();
    pushIfItemsExists(colors, [current + 100, current + 300, current + 400, current + 700]);
    cm.sendYesNo("Si utiliza el cupón normal, se le otorgará un par de lentes cosméticos al azar. ¿Vas a utilizar un#b#t5152011##ky realmente hacer el cambio en tus ojos?");
}

function selectedVipCoupon() {
    if (cm.getPlayer().isMale()) {
        var current = cm.getPlayer().getFace() % 100 + 20000;
    } else {
        var current = cm.getPlayer().getFace() % 100 + 21000;
    }

    colors = Array();
    pushIfItemsExists(colors, [current + 100, current + 300, current + 400, current + 700]);
    cm.sendStyle("Con nuestro nuevo programa informático podrá verse usted mismo después del tratamiento con antelación. ¿Qué tipo de lente te gustaría usar? Por favor elige el estilo de tu agrado.", colors);
}

function pushIfItemsExists(array, itemidList) {
    for (var i = 0; i < itemidList.length; i++) {
        var itemid = itemidList[i];

        if ((itemid = cm.getCosmeticItem(itemid)) != -1 && !cm.isCosmeticEquipped(itemid)) {
            array.push(itemid);
        }
    }
}

function selectedOneTimeCoupon() {
    if (cm.getPlayer().isMale()) {
        var current = cm.getPlayer().getFace() % 100 + 20000;
    } else {
        var current = cm.getPlayer().getFace() % 100 + 21000;
    }

    colors = Array();
    for (var i = 0; i < 8; i++) {
        const oneTimeCouponId = 5152100 + i
        if (cm.haveItem(oneTimeCouponId)) {
            pushIfItemExists(colors, current + 100 * i);
        }
    }

    if (colors.length == 0) {
        cm.sendOk("No tienes ninguna lente cosmética de un solo uso para usar.");
        cm.dispose();
        return;
    }

    cm.sendStyle("¿Qué tipo de lente te gustaría usar? Por favor elige el estilo de tu agrado.", colors);
}

function pushIfItemExists(array, itemid) {
    if ((itemid = cm.getCosmeticItem(itemid)) != -1 && !cm.isCosmeticEquipped(itemid)) {
        array.push(itemid);
    }
}

function acceptedRegularCoupon() {
    const regularCouponItemId = 5152011
    if (cm.haveItem(regularCouponItemId)) {
        cm.gainItem(regularCouponItemId, -1);
        cm.setFace(colors[Math.floor(Math.random() * colors.length)]);
        cm.sendOk("¡Disfruta de tus lentes cosméticos nuevos y mejorados!");
    } else {
        sendLackingCoupon()
    }
}

function selectedVipStyle(selection) {
    const vipCouponItemId = 5152014
    if (cm.haveItem(vipCouponItemId)) {
        cm.gainItem(vipCouponItemId, -1);
        const selectedFace = colors[selection]
        cm.setFace(selectedFace);
        cm.sendOk("¡Disfruta de tus lentes cosméticos nuevos y mejorados!");
    } else {
        sendLackingCoupon()
    }
}

function selectedOneTimeStyle(selection) {
    const selectedFace = colors[selection]
    const color = Math.floor(selectedFace / 100) % 10;

    const oneTimeCouponItemId = 5152100 + color
    if (cm.haveItem(oneTimeCouponItemId)) {
        cm.gainItem(oneTimeCouponItemId, -1);
        cm.setFace(selectedFace);
        cm.sendOk("¡Disfruta de tus lentes cosméticos nuevos y mejorados!");
    } else {
        sendLackingCoupon()
    }
}

function sendLackingCoupon() {
    cm.sendOk("Lo siento, pero no creo que tengas nuestro cupón para lentes cosméticos contigo en este momento. Sin el cupón, me temo que no puedo hacerlo por ti.");
}
