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
	NPC Name: 		Shanks
	Map(s): 		Maple Road : Southperry (60000)
	Description: 		Brings you to Victoria Island
*/
var status = 0;

function start() {
    cm.sendYesNo("Toma este barco y te dirigirás a un continente más grande. Para#e150 mesos#n, te llevaré a#bIsla Victoria#k. La cuestión es que, una vez que dejas este lugar, no podrás volver jamás. ¿Qué opinas? ¿Quieres ir a la Isla Victoria?");
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (mode == 0 && type != 1) {
            status -= 2;
        } else if (type == 1 || (mode == -1 && type != 1)) {
            if (mode == 0) {
                cm.sendOk("Hmm... ¿Supongo que todavía tienes cosas que hacer aquí?");
            }
            cm.dispose();
            return;
        }
    }
    if (status == 1) {
        if (cm.haveItem(4031801)) {
            cm.sendNext("Bien, ahora dame 150 mesos... Oye, ¿qué es eso? ¿Es esa la carta de recomendación de Lucas, el jefe de Amherst? Oye, deberías haberme dicho que tenías esto. Yo, Shanks, reconozco la grandeza cuando veo una, y como Lucas te recomendó, veo que tienes un gran potencial como aventurero. ¡De ninguna manera te cobraría por este viaje!");
        } else {
            cm.sendNext("¿Aburrido de este lugar? Aquí... dame#e150 mesos#nprimero...");
        }
    } else if (status == 2) {
        if (cm.haveItem(4031801)) {
            cm.sendNextPrev("Como tienes la carta de recomendación, no te cobraré por esto. ¡¡Muy bien, abróchate el cinturón, porque nos vamos a dirigir a la Isla Victoria ahora mismo y podría ponerse un poco turbulento!!");
        } else if (cm.getLevel() > 6) {
            if (cm.getMeso() < 150) {
                cm.sendOk("¿Qué? ¿Me estás diciendo que querías irte sin dinero? Eres un bicho raro...");
                cm.dispose();
            } else {
                cm.sendNext("¡Impresionante! ¡Se aceptan mesos #e150#n! Muy bien, ¡a la isla Victoria!");
            }
        } else {
            cm.sendOk("Veamos... No creo que seas lo suficientemente fuerte. Tendrás que tener al menos el nivel 7 para ir a la Isla Victoria.");
            cm.dispose();
        }
    } else if (status == 3) {
        if (cm.haveItem(4031801)) {
            cm.gainItem(4031801, -1);
        } else {
            cm.gainMeso(-150);
        }
        cm.warp(104000000, 0);
        cm.dispose();
    }
}