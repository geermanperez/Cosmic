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
	NPC Name: 		Irena
	Map(s): 		Empress' Road : Ereve (130000000)
	Description: 		Quest - Knighthood Exam: Wind Archer
*/
var status = -1;

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (status == 0 && mode == 0) {
            qm.sendNext("¿Existe realmente alguna razón por la que deberías permanecer como Caballero en Entrenamiento?");
            qm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            qm.sendYesNo("#t4032098#... Los revisé todos. Puedo decir que ahora estás listo para dar el salto como caballero oficial. ¿Quieres convertirte en uno?");
        } else if (status == 1) {
            if (qm.getPlayer().getJob().getId() == 1300 && qm.getPlayer().getRemainingSp() > ((qm.getPlayer().getLevel() - 30) * 3)) {
                qm.sendNext("Tienes demasiado #bSP#k contigo. Necesitarás gastar más SP en habilidades de primer nivel para convertirte en un caballero oficial.");
                qm.dispose();
            } else {
                if (qm.getPlayer().getJob().getId() != 1310) {
                    if (!qm.canHold(1142067)) {
                        qm.sendNext("Si deseas recibir la medalla acorde al título, quizás quieras hacer algo de espacio en tu inventario de equipo.");
                        qm.dispose();
                        return;
                    }
                    qm.gainItem(4032098, -30);
                    qm.gainItem(1142067, 1);
                    const Job = Java.type('client.Job');
                    qm.getPlayer().changeJob(Job.WINDARCHER2);
                    qm.completeQuest();
                }
                qm.sendNext("Ya no eres un caballero en entrenamiento. Ahora eres oficialmente un Cygnus Knight.");
            }
        } else if (status == 2) {
            qm.sendNextPrev("Te he dado algunos #bSP#k. También te he dado algunas habilidades de Wind Archer que solo están disponibles para los caballeros oficiales, ¡así que sigue trabajando!");
        } else if (status == 3) {
            qm.sendPrev("Como Cygnus Knight oficial, siempre debes mantenerte sensato.");
        } else if (status == 4) {
            qm.dispose();
        }
    }
}