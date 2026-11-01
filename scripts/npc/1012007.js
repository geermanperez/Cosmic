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
	NPC Name: 		Trainer Frod
	Map(s): 		Victoria Road : Pet-Walking Road (100000202)
	Description: 		Pet Trainer
*/

function start() {
    if (cm.haveItem(4031035)) {
        cm.sendNext("¡Eh, esa es la carta de mi hermano! Probablemente regañándome por pensar que no estoy trabajando y esas cosas... ¿Eh? Ahhh...seguiste el consejo de mi hermano, entrenaste a tu mascota y llegaste hasta aquí, ¿eh? ¡¡Lindo!! Ya que trabajaste duro para llegar hasta aquí, aumentaré tu nivel de intimidad con tu mascota.");
    } else {
        cm.sendOk("Mi hermano me dijo que me encargara de la carrera de obstáculos para mascotas, pero... como estoy tan lejos de él, no puedo evitar querer hacer el tonto... jeje, como no lo veo a la vista, mejor simplemente relajarme unos minutos.");
        cm.dispose();
    }
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
    } else {
        if (cm.getPlayer().getNoPets() == 0) {
            cm.sendNextPrev("Hmmm... ¿realmente llegaste hasta aquí con tu mascota? Estos obstáculos son para mascotas. ¿Para qué estás aquí sin él? ¡Fuera de aquí!");
        } else {
            cm.gainItem(4031035, -1);
            cm.gainTameness(2);
            cm.sendNextPrev("¿Qué opinas? ¿No crees que te has acercado mucho más a tu mascota? Si tienes tiempo, vuelve a entrenar a tu mascota en esta carrera de obstáculos... claro, con el permiso de mi hermano.");
        }
        cm.dispose();
    }
}