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
	NPC Name: 		Mihile
	Map(s): 		Empress' Road : Ereve (130000000)
	Description: 		Quest - Knighthood Exam: Dawn Warrior
*/
var status = -1;

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (status == 0 && mode == 0) {
            qm.sendNext("Supongo que no estás preparado para asumir las responsabilidades de un caballero oficial.");
            qm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            qm.sendYesNo("Entonces trajiste todo #t4032096#... Bien, creo que ahora estás calificado para convertirte en un caballero oficial. ¿Quieres convertirte en uno?");
        } else if (status == 1) {
            if (qm.getPlayer().getJob().getId() == 1100 && qm.getPlayer().getRemainingSp() > ((qm.getPlayer().getLevel() - 30) * 3)) {
                qm.sendNext("Tienes demasiado #bSP#k contigo. Usa un poco más en la habilidad de primer nivel.");
                qm.dispose();
            } else {
                if (qm.getPlayer().getJob().getId() != 1110) {
                    if (!qm.canHold(1142067)) {
                        qm.sendNext("Si deseas recibir la medalla acorde al título, quizás quieras hacer algo de espacio en tu inventario de equipo.");
                        qm.dispose();
                        return;
                    }
                    qm.gainItem(4032096, -30);
                    qm.gainItem(1142067, 1);
                    const Job = Java.type('client.Job');
                    qm.getPlayer().changeJob(Job.DAWNWARRIOR2);
                    qm.completeQuest();
                }
                qm.sendNext("Ya no eres un caballero en entrenamiento. Ahora eres un caballero oficial de los Cygnus Knights.");
            }
        } else if (status == 2) {
            qm.sendNextPrev("Te he dado algunos #bSP#k. También te he dado una serie de habilidades para un Guerrero del Alba que sólo están disponibles para los caballeros, así que quiero que trabajes en ello y, con suerte, lo cultives tanto como tu alma.");
        } else if (status == 3) {
            qm.sendPrev("Ahora que eres oficialmente un Caballero Cygnus, actúa como tal para mantener en alto el nombre de la Emperatriz.");
        } else if (status == 4) {
            qm.dispose();
        }
    }
}