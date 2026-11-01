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
	Author : kevintjuh93
	Map(s): 		Aran Training Map 2
	Description: 		Quest - Help Kid
	Quest ID : 		21000
*/

var status = -1;

function start(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 1 && mode == 0) {
            status -= 2;
        } else {
            qm.sendNext("No, Aran... No podemos dejar a un niño atrás. Sé que es mucho pedir, pero reconsiderelo. ¡Por favor!");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("¡Oh, no! ¡Creo que todavía hay un niño en el bosque! Aran, lo siento mucho, pero ¿podrías rescatar al niño? ¡Sé que estás herido, pero no tengo a nadie más a quien preguntar!");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.sendNext("#b¡Probablemente el niño esté perdido en lo profundo del bosque!#kTenemos que escapar antes de que el Mago Negro nos encuentre. ¡Debes correr hacia el bosque y traer al niño contigo!");
    } else if (status == 2) {
        qm.sendNextPrev("Que no cunda el pánico, Aran. Si desea verificar el estado de \r\nquest, presione #bQ#k y vea la ventana de Quest.");
    } else if (status == 3) {
        qm.sendNextPrev("¡Por favor, Arán! Te lo ruego. ¡No puedo soportar perder a otra persona a manos del Mago Negro!");
    } else if (status == 4) {
        qm.showInfo("Effect/OnUserEff.img/guideEffect/aranTutorial/tutorialArrow1");
        qm.dispose();
    }
}


function end(mode, type, selection) {
    qm.forceCompleteQuest();
    qm.dispose();
}