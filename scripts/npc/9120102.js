/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    Copyleft (L) 2016 - 2019 RonanLana (HeavenMS)

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

/* Hikekuro the Owner
	Showa VIP Face & Eye Change.

        GMS-like revised by Ronan -- contents found thanks to Mitsune (GamerBewbs), Waltzing, AyumiLove
*/
var status = 0;
var beauty = 0;
var price = 1000000;
var mface_v = Array(20000, 20004, 20005, 20012, 20020, 20031);
var fface_v = Array(21000, 21003, 21006, 21012, 21021, 21024);
var facenew = Array();
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
            cm.sendSimple("Bueno, bueno, ¡bienvenido a Showa Plastic Surgery! ¿Te gustaría transformar tu rostro en algo nuevo? con un#b#t5152009##ko un#b#t5152045##k, ¡puedes dejarnos encargarnos del resto y tener la cara que siempre has querido~!\r\n#L1#Cirugía plástica:#i5152009##t5152009##l\r\n#L2#Lente cosmética:#i5152045##t5152045##l\r\n#L3#Lentes cosméticas de una sola vez:#i5152102#(cualquier color)#l");
        } else if (status == 1) {
            if (selection == 1) {
                beauty = 0;
                facenew = Array();
                if (cm.getPlayer().getGender() == 0) {
                    for (var i = 0; i < mface_v.length; i++) {
                        pushIfItemExists(facenew, mface_v[i] + cm.getPlayer().getFace()
                            % 1000 - (cm.getPlayer().getFace()
                                % 100));
                    }
                }
                if (cm.getPlayer().getGender() == 1) {
                    for (var i = 0; i < fface_v.length; i++) {
                        pushIfItemExists(facenew, fface_v[i] + cm.getPlayer().getFace()
                            % 1000 - (cm.getPlayer().getFace()
                                % 100));
                    }
                }
                cm.sendStyle("Puedo transformar totalmente tu rostro en algo nuevo... ¿qué tal si nos das una oportunidad? Para#b#t5152009##k, podrás conseguir el rostro de tu agrado... tómate tu tiempo en elegir el rostro de tu preferencia.", facenew);
            } else if (selection == 2) {
                beauty = 1;
                if (cm.getPlayer().getGender() == 0) {
                    var current = cm.getPlayer().getFace()
                        % 100 + 20000;
                }
                if (cm.getPlayer().getGender() == 1) {
                    var current = cm.getPlayer().getFace()
                        % 100 + 21000;
                }
                colors = Array();
                pushIfItemsExists(colors, [current, current + 100, current + 200, current + 300, current + 400, current + 500, current + 700]);
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
            cm.dispose();

            if (beauty == 0) {
                if (cm.haveItem(5152009) == true) {
                    cm.gainItem(5152009, -1);
                    cm.setFace(facenew[selection]);
                    cm.sendOk("¡Disfruta de tu cara nueva y mejorada!");
                } else {
                    cm.sendOk("Hmm... parece que no tienes el cupón específico para este lugar. Lamento decirte esto, pero sin el cupón, no hay cirugía plástica para ti...");
                }
            } else if (beauty == 1) {
                if (cm.haveItem(5152045) == true) {
                    cm.gainItem(5152045, -1);
                    cm.setFace(colors[selection]);
                    cm.sendOk("¡Disfruta de tus lentes cosméticos nuevos y mejorados!");
                } else {
                    cm.sendOk("Hmm... parece que no tienes el cupón específico para este lugar. Lamento decirte esto, pero sin el cupón, no hay cirugía plástica para ti...");
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
        }
    }
}
