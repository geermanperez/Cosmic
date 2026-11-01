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
 Alcaster - El Nath Market (211000100)
 -- By ---------------------------------------------------------------------------------------------
 Unknown & Information & xQuasar
 -- Version Info -----------------------------------------------------------------------------------
 1.3 - Fixed up completely [xQuasar]
 1.2 - Add a missing text part [Information]
 1.1 - Recoded to official [Information]
 1.0 - First Version by Unknown
 ---------------------------------------------------------------------------------------------------
 **/

var selected;
var amount;
var totalcost;
var item = [2050003, 2050004, 4006000, 4006001];
var cost = [300, 400, 5000, 5000];
var msg = ["that cures the state of being sealed and cursed", "that cures all", ", possessing magical power, that is used for high-quality skills", ", possessing the power of summoning that is used for high-quality skills"];
var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (!cm.isQuestCompleted(3035)) {
        cm.sendNext("Si decides ayudarme, a cambio, pondré el artículo a la venta.");
        cm.dispose();
        return;
    }
    if (mode == 0 && status == 2) {
        cm.sendNext("Veo. Entienda que tengo muchos artículos diferentes aquí. Echa un vistazo a tu alrededor. Solo te vendo estos artículos, así que no te estafaré de ninguna manera.");
        cm.dispose();
        return;
    }
    if (mode < 1) {
        cm.dispose();
        return;
    }

    status++;
    if (status == 0) {
        var selStr = "";
        for (var i = 0; i < item.length; i++) {
            selStr += "\r\n#L" + i + "# #b#t" + item[i] + "# (Price: " + cost[i] + " mesos)#k#l";
        }
        cm.sendSimple("gracias a ti#b#t4031056##kestá sellado de forma segura. Por supuesto, también como resultado, usé aproximadamente la mitad del poder que he acumulado durante los últimos 800 años aproximadamente... pero ahora puedo morir en paz. Ah, por cierto... ¿estás buscando objetos raros por casualidad? Como muestra de agradecimiento por su arduo trabajo, le venderé algunos artículos que tengo a usted y SOLO a usted. ¡Elige el que quieras!" + selStr);
    } else if (status == 1) {
        selected = selection;
        cm.sendGetNumber("Es#b#t" + item[selected] + "##k ¿realmente es el artículo que necesitas? es el artículo" + msg[selected] + ". Puede que no sea el artículo más fácil de adquirir, pero te haré una buena oferta. Te costará #b" + cost[selected] + "mesos#k por artículo. ¿Cuántos te gustaría comprar?", 0, 1, 100);
    } else if (status == 2) {
        amount = selection;
        totalcost = cost[selected] * amount;
        if (amount == 0) {
            cm.sendOk("Si no vas a comprar nada, entonces yo tampoco tengo nada que vender.");
            cm.dispose();
        }
        cm.sendYesNo("¿Estás seguro de que quieres comprar #r?" + amount + " #t" + item[selected] + "(s)##k? te costará" + cost[selected] + "mesos por #t" + item[selected] + "#, que te costará #r" + totalcost + "mesos#k en total.");
    } else if (status == 3) {
        if (cm.getMeso() < totalcost || !cm.canHold(item[selected])) {
            cm.sendNext("¿Estás seguro de que tienes suficientes mesos? Verifique y vea si su etc. o inventario de uso está lleno, o si tiene al menos #r" + totalcost + "#k mesos.");
            cm.dispose();
        }
        cm.sendNext("Gracias. Si alguna vez necesita artículos en el futuro, asegúrese de pasar por aquí. Puede que haya envejecido con los años, pero todavía puedo crear objetos mágicos con facilidad.");
        cm.gainMeso(-totalcost);
        cm.gainItem(item[selected], amount);
        cm.dispose();
    }
}