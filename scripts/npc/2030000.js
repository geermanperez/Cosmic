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
 Jeff - El Nath : El Nath : Ice Valley II (211040200)
 -- By ---------------------------------------------------------------------------------------------
 Xterminator
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Xterminator
 ---------------------------------------------------------------------------------------------------
 **/

var status = 0;

function start() {
    if (cm.haveItem(4031450, 1)) {
        cm.warp(921100100, 1);
        cm.dispose();
        return;
    }

    cm.sendNext("Oye, parece que quieres ir más y más allá de este lugar. Allí, sin embargo, te encontrarás rodeado de monstruos agresivos y peligrosos, así que incluso si sientes que estás listo para partir, ten cuidado. Hace mucho tiempo, unos cuantos hombres valientes de nuestro pueblo entraron queriendo eliminar a cualquiera que amenazara el pueblo, pero nunca regresaron...");
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status == 1 && mode == 0 && cm.getLevel() > 49) {
            cm.sendNext("Incluso si tu nivel es alto, es difícil entrar allí, pero si alguna vez cambias de opinión, encuéntrame. Después de todo, mi trabajo es proteger este lugar.");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 1) {
            if (cm.getLevel() > 49) {
                cm.sendYesNo("Si estás pensando en entrar, te sugiero que cambies de opinión. Pero si realmente quieres entrar... sólo dejaré entrar a los que son lo suficientemente fuertes como para mantenerse con vida allí. No deseo ver morir a nadie más. A ver... ¡Mmmm...! Te ves bastante fuerte. Muy bien, ¿quieres entrar?");
            } else {
                cm.sendPrev("Si estás pensando en entrar, te sugiero que cambies de opinión. Pero si realmente quieres entrar... sólo dejaré entrar a los que son lo suficientemente fuertes como para mantenerse con vida allí. No deseo ver morir a nadie más. Veamos... Hmmm... Aún no has alcanzado el nivel 50. Entonces no puedo dejarte entrar, así que olvídalo.");
            }
        } else if (status == 2) {
            if (cm.getLevel() >= 50) {
                cm.warp(211040300, 5);
            }
            cm.dispose();
        }
    }
}