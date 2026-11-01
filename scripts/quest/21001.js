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
*/

var status = -1;

function start(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 15 && mode == 0) {
            qm.sendNext("*Sollozo* ¡Aran ha rechazado mi solicitud!");
            qm.dispose();
            return;
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("*Sniff sniff* Estaba tan asustado... Por favor, llévame con Athena Pierce.");
    } else if (status == 1) {
        qm.gainItem(4001271, 1);
        qm.forceStartQuest();
        qm.warp(914000300, 0);
        qm.dispose();
    }
}

function end(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 1 && mode == 0) {
            qm.sendNext("¿Qué pasa con el niño? ¡Por favor dame al niño!");
        }

        qm.dispose();
        return;
    }

    if (status == 0) {
        qm.sendYesNo("¡Regresaste sano y salvo! ¡¿Qué pasa con el niño?! ¿Trajiste al niño contigo?");
    } else if (status == 1) {
        qm.sendNext("Ay, qué alivio. Estoy tan contenta...", 9);
    } else if (status == 2) {
        qm.sendNextPrev("¡Date prisa y sube al barco! ¡No tenemos mucho tiempo!", 3);
    } else if (status == 3) {
        qm.sendNextPrev("No tenemos tiempo que perder. ¡Las fuerzas del Mago Negro están cada vez más cerca! ¡Estamos condenados si no nos vamos ahora mismo!", 9);
    } else if (status == 4) {
        qm.sendNextPrev("¡Vete, ahora!", 3);
    } else if (status == 5) {
        qm.sendNextPrev("¡Aran, por favor! Sé que quieres quedarte y luchar contra el Mago Negro, ¡pero ya es demasiado tarde! ¡Déjalo en manos de los demás y ven a la Isla Victoria con nosotros!", 9);
    } else if (status == 6) {
        qm.sendNextPrev("¡No, no puedo!", 3);
    } else if (status == 7) {
        qm.sendNextPrev("Athena Pierce, ¿por qué no te vas primero a la isla Victoria? Prometo que iré por ti más tarde. Estaré bien. ¡Debo luchar contra el Mago Negro con los otros héroes!", 3);
    } else if (status == 8) {
        qm.gainItem(4001271, -1);
        qm.removeEquipFromSlot(-11);
        qm.forceCompleteQuest();

        qm.warp(914090010, 0); // Initialize Aran Tutorial Scenes
        qm.dispose();
    }
}