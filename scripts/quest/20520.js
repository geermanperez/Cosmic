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
	Author : Biscuit
*/
var status = -1;

function start(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 1 && mode == 0) {
            qm.dispose();
            return;
        } else {
            qm.dispose();
            return;
        }
    }

    if (status == 0) {
        qm.sendNext("Vaya, ya has alcanzado el nivel 50, pero ¿por qué sigues caminando así? Quiero decir, has alcanzado el nivel 50, pero todavía estás caminando con tus propios pies. Ese es un comportamiento inusual para un Caballero como usted.");
    } else if (status == 1) {
        qm.sendAcceptDecline("Bueno, supongo que depende de ti, pero al hacerlo, también corres el riesgo de estropear el orgullo y el honor de la Emperatriz. Es por eso que estoy aquí para brindarle un consejo útil. se llama#bmontar monstruo#k. Por supuesto que estás interesado en esto, ¿verdad?");
    } else if (status == 2) {
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.sendOk("Hay una montura especial que sólo los Caballeros Cygnus pueden disfrutar. Si está interesado, visite #bEreve#k. Te daré más información al respecto.");
    } else if (status == 3) {
        qm.dispose();
    }
}