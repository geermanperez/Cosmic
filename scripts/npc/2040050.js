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

/**
 -- Odin JavaScript --------------------------------------------------------------------------------
 Eurek the Alchemist - Multiple Place
 -- By ---------------------------------------------------------------------------------------------
 Information
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Information
 ---------------------------------------------------------------------------------------------------
 **/

var status = 0;
var menu = "";
var set;
var makeitem;
var access = true;
var reqitem = [];
var cost = 4000;
var makeditem = [4006000, 4006001];
var reqset = [[[[4000046, 20], [4000027, 20], [4021001, 1]],
        [[4000025, 20], [4000049, 20], [4021006, 1]],
        [[4000129, 15], [4000130, 15], [4021002, 1]],
        [[4000074, 15], [4000057, 15], [4021005, 1]],
        [[4000054, 7], [4000053, 7], [4021003, 1]]],

    [[[4000046, 20], [4000027, 20], [4011001, 1]],
        [[4000014, 20], [4000049, 20], [4011003, 1]],
        [[4000132, 15], [4000128, 15], [4011005, 1]],
        [[4000074, 15], [4000069, 15], [4011002, 1]],
        [[4000080, 7], [4000079, 7], [4011004, 1]]]];

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || (mode == 0 && (status == 1 || status == 2))) {
        cm.dispose();
        return;
    }
    if (mode == 0) {
        cm.sendNext("No hay suficientes materiales, ¿eh? No hay problema. Sólo ven a verme una vez que hayas reunido los artículos necesarios. Hay numerosas formas de obtenerlos, ya sea cazándolos o comprándolos a otros, así que continúa.");
        cm.dispose();
    }
    if (mode == 1) {
        status++;
    }
    if (status == 0) {
        cm.sendNext("Muy bien, mezcla la lengua de la rana con el diente de la ardilla y... ¡oh sí! ¡¡Olvidé poner el polvo blanco brillante!! Hombre, eso podría haber sido realmente malo... ¡¡Vaya!! ¿Cuánto tiempo llevas ahí parado? Quizás me he dejado llevar un poco por mi trabajo… jeje.");
    } else if (status == 1) {
        cm.sendSimple("Como puedes ver, solo soy un alquimista viajero. Puede que esté en formación, pero todavía puedo hacer algunas cosas que puedas necesitar. ¿Quieres echar un vistazo?\r\n\r\n#L0##bhacer roca mágica#k#l\r\n#L1##bhacer la roca de invocación#k#l");
    } else if (status == 2) {
        set = selection;
        makeitem = makeditem[set];
        for (i = 0; i < reqset[set].length; i++) {
            menu += "\r\n#L" + i + "##bMake it using #t" + reqset[set][i][0][0] + "# and #t" + reqset[set][i][1][0] + "##k#l";
        }
        cm.sendSimple("Ja ja...#b#t" + makeitem + "##kEs una roca mística que sólo yo puedo hacer. Muchos viajeros parecen necesitar esto para las habilidades más poderosas que requieren algo más que MP y HP. Hay 5 maneras de hacer#t" + makeitem + "#. ¿De qué manera quieres hacerlo?" + menu);
    } else if (status == 3) {
        set = reqset[set][selection];
        reqitem[0] = [set[0][0], set[0][1]];
        reqitem[1] = [set[1][0], set[1][1]];
        reqitem[2] = [set[2][0], set[2][1]];
        menu = "";
        for (i = 0; i < reqitem.length; i++) {
            menu += "\r\n#v" + reqitem[i][0] + "# #b" + reqitem[i][1] + " #t" + reqitem[i][0] + "#s#k";
        }
        menu += "\r\n#i4031138# #b" + cost + " mesos#k";
        cm.sendYesNo("para hacer#b5 #t" + makeitem + "##k, necesitaré los siguientes elementos. La mayoría de ellos se pueden obtener mediante la caza, por lo que no te resultará muy difícil conseguirlos. ¿Qué opinas? ¿Quieres un poco?\r\n" + menu);
    } else if (status == 4) {
        for (i = 0; i < reqitem.length; i++) {
            if (!cm.haveItem(reqitem[i][0], reqitem[i][1])) {
                access = false;
            }
        }
        if (access == false || !cm.canHold(makeitem) || cm.getMeso() < cost) {
            cm.sendNext("Verifique y vea si tiene todos los artículos necesarios, o si su inventario, etc., está lleno o no.");
        } else {
            cm.sendOk("Toma, toma las 5 piezas de#b#t" + makeitem + "##k. Incluso tengo que admitir que esta es una obra maestra. Muy bien, si necesitas mi ayuda en el futuro, ¡vuelve y habla conmigo!");
            cm.gainItem(reqitem[0][0], -reqitem[0][1]);
            cm.gainItem(reqitem[1][0], -reqitem[1][1]);
            cm.gainItem(reqitem[2][0], -reqitem[2][1]);
            cm.gainMeso(-cost);
            cm.gainItem(makeitem, 5);
        }
        cm.dispose();
    }
}
