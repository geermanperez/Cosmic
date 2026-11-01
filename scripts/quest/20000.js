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
/*	
	Author : Generic
	NPC Name: 		Cygnus
	Map(s): 		Ereve: Empress' Road
	Description: 		Quest - Greetings from the Young Empress
	Quest ID : 		20000
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode > 0) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            qm.sendNext("Ah, has venido... esto es estimulante. Estoy agradecido por su decisión de convertirse en Cygnus Knight. Llevo mucho tiempo esperando a alguien como tú. Alguien que sea lo suficientemente valiente como para enfrentarse al Mago Negro y no inmutarse...");
        } else if (status == 1) {
            qm.sendNext("Te esperará la batalla contra la naturaleza malvada del Mago Negro que quiere tragarse a Maple World en su totalidad, la naturaleza astuta de sus discípulos y la batalla física contra los monstruos locos. También llegará un momento en el que incluso tú podrás volverte contra ti mismo y convertirte en un enemigo y atormentarte...");
        } else if (status == 2) {
            qm.sendOk("Pero no me preocuparé por eso. Estoy seguro de que podrás luchar contra todo eso y proteger Maple World del Black Mage. Por supuesto, tendrás que volverte un poco más fuerte de lo que eres ahora, ¿verdad?");
        } else if (status == 3) {
            qm.gainItem(1142065, 1); // Noblesse Medal * 1
            qm.gainExp(20); //gain 20 exp!!
            qm.forceStartQuest();
            qm.forceCompleteQuest();
            qm.dispose();
        }
    }
}