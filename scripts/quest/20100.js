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
	Author : Traitor
	NPC Name: 		Neinheart
	Map(s): 		Ereve
	Description: 		Quest - Time to Choose
	Quest ID : 		20100
*/

var status = -1;

function start(mode, type, selection) {
    if (mode > 0) {
        status++;
    } else {
        qm.dispose();
        return;
    }
    if (status == 0) {
        qm.sendAcceptDecline("Ahhh, has vuelto. Puedo ver que estás en el nivel 10 ahora. Parece que estás mostrando un rayo de esperanza para convertirte en Caballero. La formación básica ya ha finalizado y es hora de que tomes la decisión.");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.forceCompleteQuest();

        qm.sendOk("Ahora mira a la izquierda. Los líderes de los Caballeros te estarán esperando. Habrá 5 caminos para que elijas. Todo lo que necesitas hacer es elegir uno de ellos. Los 5 te llevarán al camino de un Caballero, así que... te sugiero que prestes atención a lo que ofrece cada camino y selecciones el que más te gustaría tomar.");
    } else if (status == 2) {
        qm.dispose();
    }
}