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
/* Author: Xterminator
	NPC Name: 		Pison
	Map(s): 		Victoria Road : Lith Harbor (104000000)
	Description: 		Florina Beach Tour Guide
 */
var status = 0;

function start() {
    cm.sendSimple("¿Has oído hablar de la playa con una vista espectacular al océano llamada#bPlaya Florina#k, ubicado cerca del puerto de Lith? Puedo llevarte allí ahora mismo para cualquiera de los dos.#b1500 mesos#k, o si tienes un#bEntrada VIP a la playa de Florina#kcontigo, en cuyo caso estarás allí gratis.\r\n\r\n#L0##bPagaré 1500 mesos.#l\r\n#L1#Tengo un boleto VIP para Florina Beach.#l\r\n#L2#¿Qué es una entrada VIP a Florina Beach?#k?#l");
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        if ((mode == 0 && type == 1) || mode == -1 || (mode == 0 && status == 1)) {
            if (type == 1) {
                cm.sendNext("Debes tener algunos asuntos que atender aquí. Debes estar cansado de tanto viajar y cazar. Ve a descansar y si tienes ganas de cambiar de opinión, ven a hablar conmigo.");
            }
            cm.dispose();
            return;
        } else {
            status -= 2;
        }
    }
    if (selection == 0) {
        status++;
    }
    if (status == 1) {
        if (selection == 1) {
            cm.sendYesNo("Entonces tienes un#bEntrada VIP a la playa de Florina#k? Siempre puedes dirigirte a Florina Beach con eso. Muy bien, pero ten en cuenta que es posible que también te encuentres con algunos monstruos allí. Bien, ¿te gustaría ir a Florina Beach ahora mismo?");
        } else if (selection == 2) {
            cm.sendNext("Debes sentir curiosidad por un#bEntrada VIP a la playa de Florina#k. Jaja, eso es muy comprensible. Un boleto VIP para Florina Beach es un artículo que, mientras lo tengas en posesión, podrás llegar a Florina Beach de forma gratuita. Es un artículo tan raro que incluso nosotros tuvimos que comprarlo, pero desafortunadamente perdí el mío hace unas semanas durante mis preciosas vacaciones de verano.");
        }
    } else if (status == 2) {
        if (type != 1 && selection != 0) {
            cm.sendNextPrev("Regresé sin él y se siente horrible no tenerlo. Ojalá alguien lo recogiera y lo guardara en algún lugar seguro. De todos modos, esta es mi historia y quién sabe, es posible que puedas retomarla y darle un buen uso. Si tiene alguna pregunta, no dude en preguntar.");
            cm.dispose();
        } else {
            if (cm.getMeso() < 1500 && selection == 0) {
                cm.sendNext("Creo que te falta mesos. Hay muchas maneras de reunir algo de dinero, ya sabes, como... vender tu armadura... derrotar monstruos... haciendo misiones... ya sabes de lo que estoy hablando.");
            } else if (!cm.haveItem(4031134) && selection != 0) {
                cm.sendNext("Hmmm, ¿dónde está exactamente tu#bEntrada VIP a Florina\r\nPlaya#k? ¿Estás seguro de que tienes uno? Por favor vuelva a verificar.");
            } else {
                if (selection == 0) {
                    cm.gainMeso(-1500);
                }
                cm.getPlayer().saveLocation("FLORINA");
                cm.warp(110000000, "st00");
            }
            cm.dispose();
        }
    }
}