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
/* Author: Xterminator, Moogra
	NPC Name: 		Trainer Bartos
	Map(s): 		Victoria Road : Pet-Walking Road (100000202)
	Description: 		Pet Trainer
*/
var status = 0;

function start() {
    cm.sendSimple("¿Tienes algún negocio conmigo?\r\n#L0##bPor favor cuéntame sobre este lugar.#l\r\n#L1#Estoy aquí a través de unas palabras de Mar el Hada...#k#l");
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else if (mode == 0) {
        cm.sendNext("Hmmm... ¿demasiado ocupado para hacerlo ahora? Pero si tienes ganas de hacerlo, vuelve y búscame.");
        cm.dispose();
    } else {
        status++;
        if (status == 1) {
            if (selection == 0) {
                if (cm.haveItem(4031035)) {
                    cm.sendNext("Consigue esa carta, salta obstáculos con tu mascota y llévale esa carta a mi hermano, el entrenador Frod. Entrégale la carta y algo bueno le pasará a tu mascota.");
                    cm.dispose();
                } else {
                    cm.sendYesNo("Este es el camino donde podrás salir a pasear con tu mascota. Puedes simplemente caminar con él o puedes entrenar a tu mascota para que supere los obstáculos aquí. Si aún no eres demasiado cercano a tu mascota, eso puede presentar un problema y él no seguirá tanto tus órdenes... Entonces, ¿qué opinas? ¿Quieres entrenar a tu mascota?");
                }
            } else {
                cm.sendOk("Oye, ¿estás seguro de que te has conocido?#bmar el hada#k? No me mientas si nunca la has conocido antes porque es obvio. ¡¡Eso ni siquiera fue una buena mentira!!");
                cm.dispose();
            }
        } else if (status == 2) {
            cm.gainItem(4031035, 1);
            cm.sendNext("Ok, aquí está la carta. Él no sabría que te envié si fueras allí directamente, así que atraviesa los obstáculos con tu mascota, ve a la cima y luego habla con el entrenador Frod para darle la carta. No será difícil si prestas atención a tu mascota mientras atraviesas obstáculos. ¡Buena suerte!");
            cm.dispose();
        }
    }
}