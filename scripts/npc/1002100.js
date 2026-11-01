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
// Jane the Alchemist
var status = -1;
var amount = -1;
var items = [[2000002, 310], [2022003, 1060], [2022000, 1600], [2001000, 3120]];
var item;

function start() {
    if (cm.isQuestCompleted(2013)) {
        cm.sendNext("Eres tú... gracias a ti pude hacer muchas cosas. Hoy en día he estado haciendo un montón de artículos. Si necesitas algo, házmelo saber.");
    } else {
        if (cm.isQuestCompleted(2010)) {
            cm.sendNext("No pareces lo suficientemente fuerte como para poder comprar mi poción...");
        } else {
            cm.sendOk("Mi sueño es viajar a todas partes, como tú. Mi padre, sin embargo, no me permite hacerlo porque cree que es muy peligroso. Sin embargo, puede decir que sí, si le muestro algún tipo de prueba de que no soy la chica débil que él cree que soy...");
        }
        cm.dispose();
    }
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (mode == 0 && type == 1) {
            cm.sendNext("Todavía tengo bastantes de los materiales que me compraste antes. Todos los artículos están ahí, así que tómate tu tiempo para elegir.");
        }
        cm.dispose();
        return;
    }
    if (status == 0) {
        var selStr = "Which item would you like to buy?#b";
        for (var i = 0; i < items.length; i++) {
            selStr += "\r\n#L" + i + "##i" + items[i][0] + "# (Price : " + items[i][1] + " mesos)#l";
        }
        cm.sendSimple(selStr);
    } else if (status == 1) {
        item = items[selection];
        var recHpMp = ["300 HP.", "1000 HP.", "800 MP", "1000 HP and MP."];
        cm.sendGetNumber("Quieres#b#t" + item[0] + "##k? #t" + item[0] + "# te permite recuperar" + recHpMp[selection] + "¿Cuántos te gustaría comprar?", 1, 1, 100);
    } else if (status == 2) {
        cm.sendYesNo("¿Comprarás #r?" + selection + "#k #b#t" + item[0] + "#(s)#k? #t" + item[0] + "# costos" + item[1] + "mesos por uno, por lo que el total sale a ser #r" + (item[1] * selection) + "#k mesos.");
        amount = selection;
    } else if (status == 3) {
        if (cm.getMeso() < item[1] * amount) {
            cm.sendNext("¿Te falta mesos por casualidad? Verifique y vea si tiene un espacio vacío disponible en su inventario, etc., y si tiene al menos #r." + (item[1] * selectedItem) + "#k mesos contigo.");
        } else {
            if (cm.canHold(item[0])) {
                cm.gainMeso(-item[1] * amount);
                cm.gainItem(item[0], amount);
                cm.sendNext("Gracias por venir. Las cosas aquí siempre se pueden preparar, así que si necesitas algo, vuelve.");
            } else {
                cm.sendNext("Verifique y vea si tiene un espacio vacío disponible en su inventario, etc.");
            }
        }
        cm.dispose();
    }
}