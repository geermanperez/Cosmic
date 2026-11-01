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
	NPC Name: 		Sera
	Map(s): 		Maple Road : Entrance - Mushroom Town Training Camp (0), Maple Road: Upper level of the Training Camp (1), Maple Road : Entrance - Mushroom Town Training Camp (3)
	Description: 		First NPC
*/

var status = -1;

function start() {
    if (cm.c.getPlayer().getMapId() == 0 || cm.c.getPlayer().getMapId() == 3) {
        cm.sendYesNo("Bienvenido al mundo de MapleStory. El propósito de este campo de entrenamiento es ayudar a los principiantes. ¿Te gustaría entrar a este campo de entrenamiento? Algunas personas comienzan su viaje sin realizar el programa de formación. Pero te recomiendo encarecidamente que realices primero el programa de formación.");
    } else {
        cm.sendNext("Esta es la sala de imágenes donde comienza tu primer programa de entrenamiento. En esta sala, podrá ver con antelación el trabajo de su elección.");
    }
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (mode == 0 && status == 0) {
            cm.sendYesNo("¿Realmente quieres comenzar tu viaje de inmediato?");
            return;
        } else if (mode == 0 && status == 1 && type == 0) {
            status -= 2;
            start();
            return;
        } else if (mode == 0 && status == 1 && type == 1) {
            cm.sendNext("Por favor, habla conmigo nuevamente cuando finalmente hayas tomado tu decisión.");
        }
        cm.dispose();
        return;
    }
    if (cm.c.getPlayer().getMapId() == 0 || cm.c.getPlayer().getMapId() == 3) {
        if (status == 0) {
            cm.sendNext("Ok, entonces te dejaré entrar al campo de entrenamiento. Siga el ejemplo de su instructor.");
        } else if (status == 1 && type == 1) {
            cm.sendNext("Parece que quieres comenzar tu viaje sin realizar el programa de formación. Entonces, te dejaré pasar al campo de entrenamiento. Ten cuidado ~");
        } else if (status == 1) {
            cm.warp(1, 0);
            cm.dispose();
        } else {
            cm.warp(40000, 0);
            cm.dispose();
        }
    } else if (status == 0) {
        cm.sendPrev("Una vez que entrenes lo suficiente, tendrás derecho a ocupar un trabajo. Puedes convertirte en arquero en Henesys, mago en Ellinia, guerrero en Perion y ladrón en Kerning City...");
    } else {
        cm.dispose();
    }
}