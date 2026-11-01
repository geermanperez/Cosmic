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
	NPC Name: 		Eckhart
	Map(s): 		Empress' Road : Ereve (130000000)
	Description: 		Quest - Knighthood Exam: Night Walker
*/
var status = -1;

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (status == 0 && mode == 0) {
            qm.sendNext("¿Qué te detiene?");
            qm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            qm.sendYesNo("Entonces trajiste todos los #t4032099# contigo. Esto es muy b... cierto, no debería felicitarte por hacer algo que deberías estar haciendo. Al menos puedo decir que ahora estás calificado para convertirte en un caballero oficial. ¿Quieres convertirte en uno ahora mismo?");
        } else if (status == 1) {
            if (qm.getPlayer().getJob().getId() == 1400 && qm.getPlayer().getRemainingSp() > ((qm.getPlayer().getLevel() - 30) * 3)) {
                qm.sendNext("¿Qué pasa con todo este #bSP#k por ahí? Usa más SP en tus habilidades de primer nivel.");
                qm.dispose();
            } else {
                if (qm.getPlayer().getJob().getId() != 1410) {
                    if (!qm.canHold(1142067)) {
                        qm.sendNext("Si deseas recibir la medalla acorde al título, quizás quieras hacer algo de espacio en tu inventario de equipo.");
                        qm.dispose();
                        return;
                    }
                    qm.gainItem(4032099, -30);
                    qm.gainItem(1142067, 1);
                    const Job = Java.type('client.Job');
                    qm.getPlayer().changeJob(Job.NIGHTWALKER2);
                    qm.completeQuest();
                }
                qm.sendNext("Ya no eres un caballero en entrenamiento. Te has convertido oficialmente en Cygnus Knight.");
            }
        } else if (status == 2) {
            qm.sendNextPrev("Te he dado algunos #bSP#k. También te he dado algunas habilidades de Night Walker que solo están disponibles para los caballeros oficiales, ¡así que sigue trabajando!");
        } else if (status == 3) {
            qm.sendPrev("Como miembro de los Caballeros Cygnus, espero que no te afecten las tentaciones y te mantengas fuerte.");
        } else if (status == 4) {
            qm.dispose();
        }
    }
}