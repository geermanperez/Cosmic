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
	Author : Ronan Lana
*/
var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
        return;
    } else if (status >= 2 && mode == 0) {
        qm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        status--;
    }

    if (status == 0) {
        qm.sendNext("Las atracciones para los Caballeros son un poco diferentes de las atracciones disponibles para la gente normal. Esto se lleva a cabo a través de una criatura que es de la raza Mimi que se puede encontrar en esta isla; se llaman #bMimianas#k. En lugar de montar monstruos, los Caballeros montan a Mimiana. Hay una cosa que nunca jamás debes olvidar.");
    } else if (status == 1) {
        qm.sendNextPrev("No pienses en esto simplemente como una forma de montura o transporte. Estas monturas pueden ser tu amigo, tu camarada, tu colega… todo lo anterior. ¡Incluso un amigo lo suficientemente cercano como para confiarle tu vida! Es por eso que los Caballeros de Ereve cultivan sus propias monturas.");
    } else if (status == 2) {
        qm.sendAcceptDecline("Ahora, aquí tienes un huevo de Mimiana. ¿Estás listo para criar una Mimiana y tenerla como tu compañera de viaje por el resto de su vida?");
    } else if (status == 3) {
        if (!qm.haveItem(4220137) && !qm.canHold(4220137)) {
            qm.sendOk("Crea una habitación en tu pestaña ETC para que pueda darte el huevo de Mimiana.");
            qm.dispose();
            return;
        }

        qm.forceStartQuest();
        if (!qm.haveItem(4220137)) {
            qm.gainItem(4220137);
        }
        qm.sendOk("El huevo de Mimiana puede ser criado por#bcompartiendo tus experiencias diarias con él#k. Una vez que Mimiana crezca por completo, ven a verme.");
    } else if (status == 4) {
        qm.dispose();
    }
}

function end(mode, type, selection) {
    if (mode != 1) {
        qm.dispose();
        return;
    }

    status++;
    if (status == 0) {
        qm.sendNext("¡Hola! ¿Cómo está el huevo de Mimiana?");
    } else if (status == 1) {   //pretty sure there would need to have an egg EXP condition... Whatever.
        if (!qm.haveItem(4220137)) {
            qm.sendOk("Ya veo, perdiste tu óvulo... ¡Debes tener más cuidado al criar a una bebé Mimiana!");
            return;
        }

        qm.forceCompleteQuest();
        qm.gainItem(4220137, -1);
        qm.gainExp(37600);
        qm.sendOk("Oh, ¿pudiste despertar a Mimiana Egg? Eso es asombroso... La mayoría de los caballeros ni siquiera pueden soñar con despertarlo en tan poco tiempo.");
    } else if (status == 2) {
        qm.dispose();
    }
}

