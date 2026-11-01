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
 Weaver - Ludibrium : Ludibrium Pet Walkway (220000006)
 -- By ---------------------------------------------------------------------------------------------
 Xterminator
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Xterminator
 ---------------------------------------------------------------------------------------------------
 **/

function start() {
    cm.sendYesNo("Este es el camino donde podrás salir a pasear con tu mascota. Puedes caminar con él o entrenar a tu mascota para que atraviese obstáculos aquí. Si aún no eres demasiado cercano a tu mascota, eso puede presentar un problema y él no seguirá tanto tus órdenes... Entonces, ¿qué opinas? ¿Quieres entrenar a tu mascota?");
}

function action(mode, type, selection) {
    if (mode == -1) {
    } else if (mode == 0) {
        cm.sendNext("Hmmm... ¿demasiado ocupado para hacerlo ahora? Pero si tienes ganas de hacerlo, vuelve y búscame.");
    } else if (mode == 1) {
        if (cm.haveItem(4031128)) {
            cm.sendNext("Consigue esa carta, salta obstáculos con tu mascota y llévale esa carta a mi hermano, el entrenador Frod. Entrégale la carta y algo bueno le pasará a tu mascota.");
        } else {
            cm.gainItem(4031128, 1);
            cm.sendOk("Ok, aquí está la carta. Él no sabría que te envié si fueras allí directamente, así que atraviesa los obstáculos con tu mascota, ve a la cima y luego habla con el entrenador Frod para darle la carta. No será difícil si prestas atención a tu mascota mientras atraviesas obstáculos. ¡Buena suerte!");
        }
    }
    cm.dispose();
}