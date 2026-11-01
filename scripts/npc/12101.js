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
	NPC Name: 		Rain
	Map(s): 		Maple Road : Amherst (1010000)
	Description: 		Talks about Amherst
*/
var status = -1;

function start() {
    cm.sendNext("Este es el pueblo llamado #bAmherst#k, ubicado en la parte noreste de la Isla Maple. Sabes que Maple Island es para principiantes, ¿verdad? Me alegro de que sólo haya monstruos débiles en este lugar.");
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (mode == 0 && status == 2) {
            status -= 2;
            start();
        } else if (mode == 0) {
            status -= 2;
        } else {
            cm.dispose();
        }
    } else {
        if (status == 1) {
            cm.sendNextPrev("Si quieres hacerte más fuerte, entonces ve a#bSouthperry#k donde hay un puerto. Viaja en el barco gigantesco y dirígete al lugar llamado#bIsla Victoria#k. Tiene un tamaño incomparable en comparación con esta pequeña isla.");
        } else if (status == 2) {
            cm.sendPrev("En la Isla Victoria puedes elegir tu trabajo. ¿Se llama #bPerion#k...? Escuché que hay un pueblo desnudo y desolado donde viven guerreros. Una montaña... ¿qué clase de lugar sería ese?");
        } else if (status == 3) {
            cm.dispose();
        }
    }
}