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
/* Mani
        NLC VIP Hair/Hair Color Change.

        GMS-like revised by Ronan -- contents found thanks to Mitsune (GamerBewbs), Waltzing, AyumiLove
*/
var status = 0;
var beauty = 0;
var hairprice = 1000000;
var haircolorprice = 1000000;
var mhair_v = Array(30250, 30490, 30730, 30870, 30880, 33100);
var fhair_v = Array(31320, 31450, 31560, 31730, 31830);
var hairnew = Array();

function pushIfItemExists(array, itemid) {
    if ((itemid = cm.getCosmeticItem(itemid)) != -1 && !cm.isCosmeticEquipped(itemid)) {
        array.push(itemid);
    }
}

function start() {
    cm.sendSimple("Soy el jefe de esta peluquería Mani. Si tienes un#b#t5150031##ko un#b#t5151026##k, déjame cuidar de tu peinado. Elige el que quieras.\r\n#L1#Corte de pelo:#i5150031##t5150031##l\r\n#L2#Tiñe tu cabello:#i5151026##t5151026##l");
}

function action(mode, type, selection) {
    if (mode < 1)  // disposing issue with stylishs found thanks to Vcoc
    {
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 1) {
            if (selection == 1) {
                beauty = 1;
                hairnew = Array();
                if (cm.getPlayer().getGender() == 0) {
                    for (var i = 0; i < mhair_v.length; i++) {
                        pushIfItemExists(hairnew, mhair_v[i] + parseInt(cm.getPlayer().getHair() % 10));
                    }
                }
                if (cm.getPlayer().getGender() == 1) {
                    for (var i = 0; i < fhair_v.length; i++) {
                        pushIfItemExists(hairnew, fhair_v[i] + parseInt(cm.getPlayer().getHair() % 10));
                    }
                }
                cm.sendStyle("Puedo cambiar totalmente tu peinado y hacerlo lucir tan bien. ¿Por qué no lo cambias un poco? Con#b#t5150031##k, Yo me encargaré del resto por ti. ¡Elige el estilo de tu agrado!", hairnew);
            } else if (selection == 2) {
                beauty = 2;
                haircolor = Array();
                var current = parseInt(cm.getPlayer().getHair() / 10) * 10;
                for (var i = 0; i < 8; i++) {
                    pushIfItemExists(haircolor, current + i);
                }
                cm.sendStyle("Puedo cambiar totalmente el color de tu cabello y hacerlo lucir tan bien. ¿Por qué no lo cambias un poco? Con#b#t5151026##k, yo me encargo del resto. ¡Elige el color de tu agrado!", haircolor);
            }
        } else if (status == 2) {
            cm.dispose();
            if (beauty == 1) {
                if (cm.haveItem(5420001)) {
                    cm.setHair(hairnew[selection]);
                    cm.sendOk("¡Disfruta de tu peinado nuevo y mejorado!");
                } else if (cm.haveItem(5150031)) {
                    cm.gainItem(5150031, -1);
                    cm.setHair(hairnew[selection]);
                    cm.sendOk("¡Disfruta de tu peinado nuevo y mejorado!");
                } else {
                    cm.sendOk("Hmmm... parece que no tienes nuestro cupón designado... Me temo que no puedo cortarte el pelo sin él. Lo lamento...");
                }
            }
            if (beauty == 2) {
                if (cm.haveItem(5151026) == true) {
                    cm.gainItem(5151026, -1);
                    cm.setHair(haircolor[selection]);
                    cm.sendOk("¡Disfruta de tu nuevo y mejorado color de cabello!");
                } else {
                    cm.sendOk("Hmmm... parece que no tienes nuestro cupón designado... Me temo que no puedo teñirte el cabello sin él. Lo lamento...");
                }
            }
            if (beauty == 0) {
                if (selection == 0 && cm.getMeso() >= hairprice) {
                    cm.gainMeso(-hairprice);
                    cm.gainItem(5150031, 1);
                    cm.sendOk("¡Disfrutar!");
                } else if (selection == 1 && cm.getMeso() >= haircolorprice) {
                    cm.gainMeso(-haircolorprice);
                    cm.gainItem(5151026, 1);
                    cm.sendOk("¡Disfrutar!");
                } else {
                    cm.sendOk("¡No tienes suficientes mesos para comprar un cupón!");
                }
            }
        }
    }
}