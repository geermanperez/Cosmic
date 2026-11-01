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
	NPC Name: 		Neinheart
	Map(s): 		Empress' Road : Ereve (130000000)
	Description: 		Quest - The End of Knight-in-Training
*/
var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (status == 0 && mode == 0) {
            qm.sendNext("Hmmm... ¿sientes que todavía tienes misiones que cumplir como aprendiz? Elogio su nivel de paciencia, pero esto ha ido demasiado lejos. Cygnus Knights necesita urgentemente caballeros nuevos y más poderosos.");
            qm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            qm.sendAcceptDecline("#h0#? Vaya, tu nivel se ha disparado desde la última vez que te vi. También parece que te has encargado de varias misiones... Pareces mucho más preparado para seguir adelante ahora que la última vez que te vi. ¿Qué opinas? ¿Estás interesado en tomar el#bExamen de caballería#k? Es hora de que dejes de ser un Caballero en entrenamiento y te conviertas en un Caballero auténtico, ¿verdad?");
        } else if (status == 1) {
            qm.startQuest();
            qm.completeQuest();

            qm.sendOk("Si desea realizar el examen de título de caballero, venga a Ereve. Cada Caballero Jefe pondrá a prueba tus habilidades y, si cumples con sus estándares, te convertirás oficialmente en Caballero.");
        } else if (status == 2) {
            qm.dispose();
        }
    }
}