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
	NPC Name: 		Oz
	Map(s): 		Empress' Road : Ereve (130000000)
	Description: 		Quest - Knighthood Exam: Blaze Wizard
*/
var status = -1;

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (status == 0 && mode == 0) {
            qm.sendNext("¿Eh? ¿Por qué? ¿Hay algo mal?");
            qm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            qm.sendYesNo("¡¡¡Lograste traer todo #t4032097#!!! ¡Bien, creo que ahora estás calificado para convertirte en un caballero oficial! ¿Quieres convertirte en uno?");
        } else if (status == 1) {
            if (qm.getPlayer().getJob().getId() == 1200 && qm.getPlayer().getRemainingSp() > ((qm.getPlayer().getLevel() - 30) * 3)) {
                qm.sendNext("Espera... tienes demasiado #bSP#k contigo. Necesitarás gastar más SP en habilidades de primer nivel para convertirte en un caballero oficial.");
                qm.dispose();
            } else {
                if (qm.getPlayer().getJob().getId() != 1210) {
                    if (!qm.canHold(1142067)) {
                        qm.sendNext("Si deseas recibir la medalla acorde al título, quizás quieras hacer algo de espacio en tu inventario de equipo.");
                        qm.dispose();
                        return;
                    }
                    qm.gainItem(4032097, -30);
                    qm.gainItem(1142067, 1);
                    const Job = Java.type('client.Job');
                    qm.getPlayer().changeJob(Job.BLAZEWIZARD2);
                    qm.completeQuest();
                }
                qm.sendNext("Ya no eres un caballero en entrenamiento. ¡Ahora eres un Caballero Cygnus oficial!");
            }
        } else if (status == 2) {
            qm.sendNextPrev("Te he dado algunos #bSP#k. También te he dado algunas habilidades de Blaze Wizards que solo están disponibles para los caballeros oficiales, ¡así que sigue trabajando!");
        } else if (status == 3) {
            qm.sendPrev("Ahora que te has convertido oficialmente en uno, quiero que mantengas ese fuego en ti que tenías cuando empezaste este viaje, pero esta vez, ¡como un orgulloso miembro de los Cygnus Knights!");
        } else if (status == 4) {
            qm.dispose();
        }
    }
}