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
//@Author Moogra, Ronan
//Fixed grammar, javascript syntax

var status = 0;
var price = 100000;

function isTransformed(ch) {
    const BuffStat = Java.type('client.BuffStat');
    return ch.getBuffSource(BuffStat.MORPH) == 2210003;
}

function start() {
    if (!(isTransformed(cm.getPlayer()) || cm.haveItem(4001086))) {
        cm.sendOk("Esta es la cueva del poderoso Horntail, gobernante supremo de los Cañones Leafre. solo esos#bconsiderado digno#kpara conocerlo pueden pasar por aquí,#boutsiders#k no son bienvenidos. ¡Piérdase!");
        cm.dispose();
        return;
    }

    cm.sendSimple("Bienvenido a la Cueva de la Vida - ¡Entrada! ¿Te gustaría entrar y luchar?#rHorntail#¿k? Si quieres luchar contra él, es posible que necesites algo de#b#v2000005##k, para que puedas recuperar algo de HP si has sido golpeado por#rHorntail#k.\r\n#L1#¡Me gustaría comprar 10 por 100.000 Mesos!#l\r\n\#L2#N¡Gracias, déjame entrar ahora!#l");
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
    } else if (selection == 1) {
        if (cm.getMeso() >= price) {
            if (!cm.canHold(2000005)) {
                cm.sendOk("Lo sentimos, ¡no tienes un espacio en tu inventario para el artículo!");
            } else {
                cm.gainMeso(-price);
                cm.gainItem(2000005, 10);
                cm.sendOk("Gracias por comprar la poción. ¡Úsalo también!");
            }
        } else {
            cm.sendOk("¡Lo sentimos, no tienes suficientes mesos para comprarlos!");
        }
        cm.dispose();
    } else if (selection == 2) {
        if (cm.getLevel() > 99) {
            cm.warp(240050000, 0);
        } else {
            cm.sendOk("Lo lamento. Debes tener al menos nivel 100 o superior para ingresar.");
        }
        cm.dispose();
    }
}