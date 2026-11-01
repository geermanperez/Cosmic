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
	NPC Name: 		Hawkeye
	Map(s): 		Empress' Road : Ereve (130000000)
	Description: 		Quest - Knighthood Exam: Thunder Breaker
*/
var status = -1;

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (status == 0 && mode == 0) {
            qm.sendNext("¿Mmm? ¿Por qué? ¿Qué te detiene?");
            qm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            qm.sendYesNo("¡Oh, trajiste todos los #t4032100#! Jajaja, sabía que serías bueno en eso. Te diré una cosa, te felicito porque ya estás listo para convertirte en un caballero oficial. ¿Quieres convertirte en uno ahora mismo?");
        } else if (status == 1) {
            if (qm.getPlayer().getJob().getId() == 1500 && qm.getPlayer().getRemainingSp() > ((qm.getPlayer().getLevel() - 30) * 3)) {
                qm.sendNext("Oye, ¿cómo lograste cazar todo eso? ¡Tienes demasiado #bSP#k por ahí sin usar! ¡No puedes convertirte en un caballero oficial así! Usa más SP en la habilidad de primer nivel.");
                qm.dispose();
            } else {
                if (qm.getPlayer().getJob().getId() != 1510) {
                    if (!qm.canHold(1142067)) {
                        qm.sendNext("Si deseas recibir la medalla acorde al título, quizás quieras hacer algo de espacio en tu inventario de equipo.");
                        qm.dispose();
                        return;
                    }
                    qm.gainItem(4032100, -30);
                    qm.gainItem(1142067, 1);
                    const Job = Java.type('client.Job');
                    qm.getPlayer().changeJob(Job.THUNDERBREAKER2);
                    qm.completeQuest();
                }
                qm.sendNext("Ahora ya no eres un caballero en entrenamiento. Ahora te has convertido oficialmente en Cygnus Knight.");
            }
        } else if (status == 2) {
            qm.sendNextPrev("También te he dado algunos #bSP#k y las habilidades que lo acompañan de Thunder Breakers que solo están disponibles para los caballeros oficiales. Estas habilidades se basan en rayos, ¡así que úsalas sabiamente!");
        } else if (status == 3) {
            qm.sendPrev("Bueno, personalmente, espero que no pierdan el entusiasmo incluso después de convertirse en los Caballeros Cygnus. Busque siempre lo positivo incluso si se encuentra en medio de una avalancha de elementos negativos.");
        } else if (status == 4) {
            qm.dispose();
        }
    }
}