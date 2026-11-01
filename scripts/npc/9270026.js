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
/* 	Sixx
	Singa REG/VIP Eye Color Changer
*/

var status = 0;
var beauty = 0;
var colors = Array();

function pushIfItemExists(array, itemid) {
    if ((itemid = cm.getCosmeticItem(itemid)) != -1 && !cm.isCosmeticEquipped(itemid)) {
        array.push(itemid);
    }
}

function pushIfItemsExists(array, itemidList) {
    for (var i = 0; i < itemidList.length; i++) {
        var itemid = itemidList[i];

        if ((itemid = cm.getCosmeticItem(itemid)) != -1 && !cm.isCosmeticEquipped(itemid)) {
            array.push(itemid);
        }
    }
}

function start() {
    cm.sendSimple("¡Hola! ¡Soy Sixx, a cargo de la tienda de lentes Da Yan Jing aquí en CBD! Con#b#t5152039##ko#b#t5152040##k¡Puedes dejar que nosotros nos encarguemos del resto y tener el tipo de apariencia hermosa que siempre has deseado! Recuerda, lo primero que todos notan de ti son tus ojos, ¡y podemos ayudarte a encontrar las lentillas cosméticas que mejor se adapten a ti! Ahora, ¿qué te gustaría usar?\r\n#L1#Lentes cosméticas:#i5152039##t5152039##l\r\n#L2#Lentes cosméticas:#i5152040##t5152040##l\r\n#L3#Lentes cosméticas de una sola vez:#i5152107#(cualquier color)#l");
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
    } else {
        status++;
        if (status == 1) {
            if (selection == 1) {
                beauty = 1;
                var current = cm.getPlayer().getFace() % 100 + 20000 + cm.getPlayer().getGender() * 1000;
                cm.sendYesNo("Si utiliza el cupón normal, se le otorgará un par de lentes cosméticos al azar. ¿Vas a utilizar un#b#t5152039##ky realmente hacer el cambio en tus ojos?");
            } else if (selection == 2) {
                beauty = 2;
                var current = cm.getPlayer().getFace() % 100 + 20000 + cm.getPlayer().getGender() * 1000;
                pushIfItemsExists(colors, [current + 200, current + 300, current + 400, current + 700]);
                cm.sendStyle("Con nuestra máquina especializada, podrá verse usted mismo después del tratamiento con antelación. ¿Qué tipo de lente te gustaría usar? Elige el estilo de tu agrado.", colors);
            } else if (selection == 3) {
                beauty = 3;
                if (cm.getPlayer().getGender() == 0) {
                    var current = cm.getPlayer().getFace()
                        % 100 + 20000;
                }
                if (cm.getPlayer().getGender() == 1) {
                    var current = cm.getPlayer().getFace()
                        % 100 + 21000;
                }

                colors = Array();
                for (var i = 0; i < 8; i++) {
                    if (cm.haveItem(5152100 + i)) {
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
        } else if (status == 2) {
            if (beauty == 1) {
                if (cm.haveItem(5152039)) {
                    cm.gainItem(5152039, -1);
                    cm.setFace(Math.floor(Math.random() * 8) * 100 + current);
                    cm.sendOk("¡Disfruta de tus lentes cosméticos nuevos y mejorados!");
                } else {
                    cm.sendOk("Lo siento, pero no creo que tengas nuestro cupón para lentes cosméticos contigo en este momento. Sin el cupón, me temo que no puedo hacerlo por ti.");
                }
            } else if (beauty == 2) {
                if (cm.haveItem(5152040)) {
                    cm.gainItem(5152040, -1);
                    cm.setFace(colors[selection]);
                    cm.sendOk("¡Disfruta de tus lentes cosméticos nuevos y mejorados!");
                } else {
                    cm.sendOk("Lo siento, pero no creo que tengas nuestro cupón para lentes cosméticos contigo en este momento. Sin el cupón, me temo que no puedo hacerlo por ti.");
                }
            } else if (beauty == 3) {
                var color = (colors[selection] / 100) % 10 | 0;

                if (cm.haveItem(5152100 + color)) {
                    cm.gainItem(5152100 + color, -1);
                    cm.setFace(colors[selection]);
                    cm.sendOk("¡Disfruta de tus lentes cosméticos nuevos y mejorados!");
                } else {
                    cm.sendOk("Lo siento, pero no creo que tengas nuestro cupón para lentes cosméticos contigo en este momento. Sin el cupón, me temo que no puedo hacerlo por ti.");
                }
            }
            cm.dispose();
        }
    }
}
