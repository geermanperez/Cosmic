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
        if (type == 1 && mode == 0) {
            qm.sendNext("Estoy seguro de que te resultará útil durante tu viaje. Por favor, no rechaces mi oferta.");
            qm.dispose();
            return;
        } else {
            qm.dispose();
            return;
        }
    }

    if (status == 0) {
        qm.sendSimple("Ah, eres el héroe. Me muero por conocerte.\r\n#b#L0#(Parece un poco tímido...)#l");
    } else if (status == 1) {
        qm.sendAcceptDecline("Tengo algo que he querido regalarte desde hace mucho tiempo... Sé que estás ocupado, especialmente porque estás de camino a la ciudad, pero ¿aceptarás mi regalo?");
    } else if (status == 2) {
        qm.forceStartQuest();
        qm.sendNext("Las partes del regalo han sido empaquetadas dentro de una caja cercana. Lamento molestarte, pero ¿podrías romper la caja y traerme un#b#t4032309##ky algunos#b#t4032310##k? Los ensamblaré para ti de inmediato.", 9);
    } else if (status == 3) {
        qm.guideHint(18);
        qm.dispose();
    }
}

function end(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 1 && mode == 0) {
            qm.sendNext("¿Qué? ¿No quieres la poción?");
            qm.dispose();
            return;
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendYesNo("Ah, has traído todos los componentes. Dame unos segundos para armarlos.. Así.. Y así.. y…\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#v3010062# 1 #t3010062#\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 95 exp.");
    } else if (status == 1) {
        if (qm.isQuestCompleted(21013)) {
            qm.dropMessage(1, "Error desconocido");
        }
        qm.forceCompleteQuest();
        qm.gainExp(95);
        qm.gainItem(4032309, -1);
        qm.gainItem(4032310, -1);
        qm.gainItem(3010062, 1);
        qm.sendNext("Aquí tienes una silla completamente montada, ¡solo para ti! Siempre quise regalarte una silla, porque sé que a un héroe de vez en cuando le vendría bien un buen descanso. Je, je.", 9);
    } else if (status == 2) {
        qm.sendNext("Un héroe no es invencible. Un héroe es humano. Estoy seguro de que enfrentarás desafíos e incluso flaquearás en ocasiones. Pero eres un héroe porque tienes lo necesario para superar cualquier obstáculo que puedas encontrar.", 9);
    } else if (status == 3) {
        qm.guideHint(19);
        qm.dispose();
    }
}