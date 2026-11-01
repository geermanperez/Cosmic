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
/* Author: 		ThreeStep
	NPC Name: 		Oz (1101004)
	Description: 	Blaze Wizard 3rd job advancement
	Quest: 			Shinsoo's Teardrop
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (status == 1 && mode == 0) {
            qm.sendNext("Vuelve cuando estés listo.");
            qm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            qm.sendNext("La joya que trajiste del Maestro del Disfraz es la Lágrima de Shinsoo. Es la cristalización de los poderes de Shinsoo. Si el Mago Negro pone sus manos en esto, significará la perdición para todos nosotros.");
        } else if (status == 1) {
            qm.sendYesNo("Como muestra de su agradecimiento por su esfuerzo para prevenir asuntos potencialmente graves, la Emperatriz ha decidido presentarle un nuevo título. ¿Estás listo para aceptarlo?");
        } else if (status == 2) {
            nPSP = (qm.getPlayer().getLevel() - 70) * 3;
            if (qm.getPlayer().getRemainingSp() > nPSP) {
                qm.sendNext("Todavía tienes demasiado #bSP#k contigo. No puedes ganar un título nuevo así, te recomiendo encarecidamente que uses más SP en tus habilidades de primer y segundo nivel.");
            } else {
                if (!qm.canHold(1142068)) {
                    qm.sendNext("Si deseas recibir la medalla acorde al título, quizás quieras hacer algo de espacio en tu inventario de equipo.");
                } else {
                    qm.completeQuest();
                    qm.gainItem(1142068, 1);
                    const Job = Java.type('client.Job');
                    qm.getPlayer().changeJob(Job.BLAZEWIZARD3);
                    qm.sendOk("#h#, a partir de este momento, eres un Caballero Avanzado. A partir de este momento, te entrenarás con fervor mientras liderarás a tu grupo de Caballeros por la seguridad de este mundo. Ese fervor te dará mucho coraje.");
                }
            }
        } else if (status == 3) {
            qm.dispose();
        }
    }
}