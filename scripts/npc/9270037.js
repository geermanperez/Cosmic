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
/* 	Jimmy
	Singapore Random Hair/Color Changer
	@Author Cody (FlowsionMS)
        @Author AAron (FlowsionMS)

        GMS-like revised by Ronan -- contents found thanks to Mitsune (GamerBewbs), Waltzing, AyumiLove
 */
var status = 0;
var beauty = 0;
var mhair_r = Array(30110, 30180, 30260, 30290, 30300, 30350, 30470, 30720, 30840);
var fhair_r = Array(31110, 31200, 31250, 31280, 31600, 31640, 31670, 31810, 34020);
var hairnew = Array();

function pushIfItemExists(array, itemid) {
    if ((itemid = cm.getCosmeticItem(itemid)) != -1 && !cm.isCosmeticEquipped(itemid)) {
        array.push(itemid);
    }
}

function start() {
    cm.sendSimple("Hola, soy el asistente aquí. No te preocupes, soy lo suficientemente bueno para esto. si tienes#b#t5150032##ko#b#t5151027##k¿Por casualidad, entonces déjame encargarme del resto?\r\n#L1#Corte de pelo:#i5150032##t5150032##l\r\n#L2#Tiñe tu cabello:#i5151027##t5151027##l");
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
    } else {
        status++;
        if (selection == 1) {
            beauty = 1;
            hairnew = Array();
            for (var id = 0; id < cm.getPlayer().getGender() == 0 ? mhair_r.length : fhair_r.length; id++) {
                pushIfItemExists(hairnew, cm.getPlayer().getGender == 0 ? mhair_r[i] : fhair_r[i] + parseInt(cm.getPlayer().getHair() % 10));
            }
            cm.sendYesNo("Si usas el cupón REG tu cabello cambiará ALEATORIAMENTE con la posibilidad de obtener un nuevo estilo experimental que se me ocurrió. ¿Vas a utilizar#b#t5150032##ky realmente cambiar tu peinado?");
        } else if (selection == 2) {
            beauty = 2;
            haircolor = Array();
            var current = parseInt(cm.getPlayer().getHair() / 10) * 10;
            for (var i = 0; i < 8; i++) {
                pushIfItemExists(haircolor, current + i);
            }
            cm.sendYesNo("Si usas el cupón REG tu cabello cambiará ALEATORIAMENTE. ¿Todavía quieres usar#b#t5151027##ky cambiarlo?");
        } else if (status == 2) {
            if (beauty == 1) {
                if (cm.haveItem(5150032)) {
                    cm.gainItem(5150032, -1);
                    cm.setHair(hairnew[Math.floor(Math.random() * hairnew.length)]);
                    cm.sendOk("¡Disfruta de tu peinado nuevo y mejorado!");
                } else {
                    cm.sendOk("Hmmm... parece que no tienes nuestro cupón designado... Me temo que no puedo cortarte el pelo sin él. Lo lamento...");
                }
            }
            if (beauty == 2) {
                if (cm.haveItem(5151027)) {
                    cm.gainItem(5151027, -1);
                    cm.setHair(haircolor[Math.floor(Math.random() * haircolor.length)]);
                    cm.sendOk("¡Disfruta de tu nuevo y mejorado color de cabello!");
                } else {
                    cm.sendOk("Hmmm... parece que no tienes nuestro cupón designado... Me temo que no puedo teñirte el cabello sin él. Lo lamento...");
                }
            }
            cm.dispose();
        }
    }
}
