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
/* Maker Skill
	Moren's Second round of teaching
	2nd skill level
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
            qm.sendNext("Hm, entonces afirmas haber traído el#b#t4260003##k? Ok, echémosle un vistazo.");
        } else if (status == 1) {
            if (qm.getQuestProgressInt(6033) == 1 && qm.haveItem(4260003, 1)) {
                qm.sendNextPrev("De hecho, has creado una excelente pieza de Monster Crystal, por lo que veo. ¡Pasaste! Ahora te enseñaré los siguientes pasos de la habilidad Maker. Mantén el cristal monstruo contigo también, es tu trabajo.");
            } else {
                qm.sendNext("Oye, ¿qué pasa? Te dije que hicieras un cristal monstruo para pasar mi prueba, ¿no? Comprar uno o fabricarlo antes del inicio de la prueba NO es parte del trato. Ve a crearme un#b#t4260003##k.");
                qm.dispose();

            }
        } else if (status == 2) {
            qm.forceCompleteQuest();

            var skillid = Math.floor(qm.getPlayer().getJob().getId() / 1000) * 10000000 + 1007;
            qm.teachSkill(skillid, 2, 3, -1);
            qm.gainExp(230000);
            qm.dispose();
        }
    }
}