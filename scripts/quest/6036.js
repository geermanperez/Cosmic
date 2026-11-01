/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2016 - 2019 RonanLana

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
/*  Maker Skill
	A Surprise Outcome
	3rd skill level
 */

var status = -1;

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            qm.sendNext("¿Me molestas otra vez? ¿Qué es?");
        } else if (status == 1) {
            if (qm.haveItem(4031980, 1)) {
                qm.sendNext("Creaste un#b#t4031980##k?! ¿Cómo es que cómo lo hiciste? ... Bueno, supongo que eso no se puede evitar. ¡El alumno superó al maestro! La juventud sin duda hace maravillas con las capacidades de percepción.\r\n\r\nAhora estás listo para dar el último paso para dominar la habilidad Maker, ¡contémplala en su máxima expresión!");
            } else {
                qm.sendNext("... Por favor hazte a un lado, no puedo terminar este trabajo si me distraen a cada momento.");
                qm.dispose();

            }
        } else if (status == 2) {
            qm.forceCompleteQuest();

            qm.gainItem(4031980, -1);
            var skillid = Math.floor(qm.getPlayer().getJob().getId() / 1000) * 10000000 + 1007;
            qm.teachSkill(skillid, 3, 3, -1);
            qm.gainExp(300000);

            qm.dispose();
        }
    }
}