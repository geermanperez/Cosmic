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
/* Dr. Bosch
	Ludibrium Random/VIP Eye Color Change.
 */
var status = 0;
var beauty = 0;
var regprice = 1000000;
var vipprice = 1000000;
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
            cm.sendSimple("Um... hola, soy el Dr. Bosch y soy un experto en lentes cosméticos aquí en el Taller de Cirugía Plástica Ludibrium. Creo que tus ojos son la característica más importante de tu cuerpo, y con#b#t5152012##ko#b#t5152015##kPuedo recetarle el tipo adecuado de lentillas cosméticas. Ahora, ¿qué te gustaría usar?\r\n#L1#Lentes cosméticas:#i5152012##t5152012##l\r\n#L2#Lentes cosméticas:#i5152015##t5152015##l\r\n#L3#Lentes cosméticas de una sola vez:#i5152105#(cualquier color)#l");
        } else if (status == 1) {
            if (selection == 1) {
                beauty = 1;
                if (cm.getPlayer().getGender() == 0) {
                    var current = cm.getPlayer().getFace() % 100 + 20000;
                }
                if (cm.getPlayer().getGender() == 1) {
                    var current = cm.getPlayer().getFace() % 100 + 21000;
                }
                colors = Array();
                pushIfItemsExists(colors, [current + 200, current + 300, current + 400, current + 500, current + 700]);
                cm.sendYesNo("Si utiliza el cupón normal, se le otorgará un par de lentes cosméticos al azar. ¿Vas a utilizar un#b#t5152012##ky realmente hacer el cambio en tus ojos?");
            } else if (selection == 2) {
                beauty = 2;
                if (cm.getPlayer().getGender() == 0) {
                    var current = cm.getPlayer().getFace() % 100 + 20000;
                }
                if (cm.getPlayer().getGender() == 1) {
                    var current = cm.getPlayer().getFace() % 100 + 21000;
                }
                colors = Array();
                pushIfItemsExists(colors, [current + 200, current + 300, current + 400, current + 500, current + 700]);
                cm.sendStyle("Con nuestro nuevo programa informático podrá verse usted mismo después del tratamiento con antelación. ¿Qué tipo de lente te gustaría usar? Por favor elige el estilo de tu agrado.", colors);
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
                if (cm.haveItem(5152012) == true) {
                    cm.gainItem(5152012, -1);
                    cm.setFace(colors[Math.floor(Math.random() * colors.length)]);
                    cm.sendOk("¡Disfruta de tus lentes cosméticos nuevos y mejorados!");
                    cm.dispose();
                } else {
                    cm.sendOk("Lo siento, pero no creo que tengas nuestro cupón para lentes cosméticos contigo en este momento. Sin el cupón, me temo que no puedo hacerlo por ti.");
                    cm.dispose();
                }
            } else if (beauty == 2) {
                if (cm.haveItem(5152015) == true) {
                    cm.gainItem(5152015, -1);
                    cm.setFace(colors[selection]);
                    cm.sendOk("¡Disfruta de tus lentes cosméticos nuevos y mejorados!");
                    cm.dispose();
                } else {
                    cm.sendOk("Lo siento, pero no creo que tengas nuestro cupón para lentes cosméticos contigo en este momento. Sin el cupón, me temo que no puedo hacerlo por ti.");
                    cm.dispose();
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
            } else if (beauty == 0) {
                if (selection == 0 && cm.getMeso() >= regprice) {
                    cm.gainMeso(-regprice);
                    cm.gainItem(5152012, 1);
                    cm.sendOk("¡Disfrutar!");
                    cm.dispose();
                } else if (selection == 1 && cm.getMeso() >= vipprice) {
                    cm.gainMeso(-vipprice);
                    cm.gainItem(5152015, 1);
                    cm.sendOk("¡Disfrutar!");
                    cm.dispose();
                } else {
                    cm.sendOk("¡No tienes suficientes mesos para comprar un cupón!");
                }
            }
        }
    }
}