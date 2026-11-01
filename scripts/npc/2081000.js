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
var temp;
var cost;

var status = 0;

function start() {
    cm.sendSimple("...¿Puedo ayudarle?\r\n#L0##bCompra la semilla mágica#k#l\r\n#L1##bHaz algo por Leafre#k#l");
}

function action(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status < 3)) {
        cm.dispose();
        return;
    } else if (mode == 0) {
        cm.sendOk("Por favor, piénselo detenidamente. Una vez que hayas tomado tu decisión, házmelo saber.");
        cm.dispose();
        return;
    }
    status++;
    if (status == 1) {
        if (selection == 0) {
            cm.sendSimple("No pareces ser de fuera de la ciudad. ¿Le puedo ayudar en algo?#L0##bme gustaria algo#t4031346#.#k#l");
        } else {
            cm.sendNext("En desarrollo...");
            cm.dispose();
        }
    } else if (status == 2) {
        cm.sendGetNumber("#b#t4031346##kEs un artículo precioso. No puedo dártelo así sin más. ¿Qué tal si me haces un pequeño favor? Entonces te lo daré. venderé el#b#t4031346##ka ti por#b30.000 mesos#kcada. ¿Estás dispuesto a realizar la compra? ¿Cuántos te gustaría entonces?", 0, 0, 99);
    } else if (status == 3) {
        if (selection == 0) {
            cm.sendOk("No puedo venderte 0.");
            cm.dispose();
        } else {
            temp = selection;
            cost = temp * 30000;
            cm.sendYesNo("Comprar #b" + temp + " #t4031346#(s)#kte costará#b" + cost + "mesos#k. ¿Estás seguro de que quieres realizar la compra?");
        }
    } else if (status == 4) {
        if (cm.getMeso() < cost || !cm.canHold(4031346)) {
            cm.sendOk("Por favor verifique y vea si tiene suficientes mesos para realizar la compra. Además, te sugiero revisar el inventario de etc. y ver si tienes suficiente espacio disponible para realizar la compra.");
        } else {
            cm.sendOk("Nos vemos de nuevo ~");
            cm.gainItem(4031346, temp);
            cm.gainMeso(-cost);
        }
        cm.dispose();
    }
}