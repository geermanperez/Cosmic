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
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
    See the GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
	NPC NAME: Cesar (1)
	NPC ID: 2101018
	Author: Vcoc
	Function: AriantPQ
*/

status = -1;

function start() {
    if ((cm.getPlayer().getLevel() < 19 || cm.getPlayer().getLevel() > 30) && !cm.getPlayer().isGM()) {
        cm.sendNext("No estás entre el nivel 20 y 30. Lo sentimos, no puedes participar.");
        cm.dispose();
        return;
    }
    action(1, 0, 0);
}

function action(mode, type, selection) {
    status++;
    if (status == 4) {
        cm.getPlayer().saveLocation("MIRROR");
        cm.warp(980010000, 3);
        cm.dispose();
    }
    if (mode != 1) {
        if (mode == 0 && type == 0) {
            status -= 2;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        cm.sendNext("He preparado un gran festival aquí en Ariant para los grandes luchadores de MapleStory. se llama#bEl desafío del Coliseo Ariant#k.");
    } else if (status == 1) {
        cm.sendNextPrev("El Ariant Coliseum Challenge es una competencia que combina las habilidades de combate de monstruos contra otros. En esta competición, tu objetivo no es cazar al monstruo;  más bien, necesitas#beliminar una cantidad determinada de HP del monstruo y luego absorberlo con una joya#k. #bEl luchador que acabe con más joyas ganará la competición.#k");
    } else if (status == 2) {
        cm.sendSimple("Si eres un guerrero fuerte y valiente de#bPerion#k, entrenando en Dances With Balrogs, entonces ¿estás interesado en participar en The Ariant Coliseum Challenge?\r\n#b#L0#Me encantaría participar en esta gran competencia.#l");
    } else if (status == 3) {
        cm.sendNext("Bien, ahora te enviaré al campo de batalla. ¡Me gustaría verte salir victorioso!");
    }
}