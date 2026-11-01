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
            qm.sendOk("Ah, está bien. Entiendo. Los héroes están muy ocupados. *Sniff...* Pero si alguna vez tienes tiempo libre...");
            qm.dispose();
            return;
        } else {
            qm.dispose();
            return;
        }
    }

    if (status == 0) {
        qm.sendNext("Espera, ¿eres... De ninguna manera... ¿Eres el héroe del que #p1201000# ha estado hablando todo este tiempo? #p1201000#! No te limites a asentir... ¡Dime! ¿Es este el héroe que estabas esperando?")
    } else if (status == 1) {
        qm.sendNextPrev("   #i4001171#");
    } else if (status == 2) {
        qm.sendNextPrev("Lo lamento. Estoy tan abrumada por las emociones... *Sniff sniff* Dios mío, estoy empezando a llorar. Debes estar muy feliz, #p1201000#.");
    } else if (status == 3) {
        qm.sendAcceptDecline("Espera un minuto... No llevas ningún arma. Por lo que he oído, cada uno de los héroes tenía un arma especial. Oh, debes haberlo perdido durante la batalla contra el Mago Negro.");
    } else if (status == 4) {
        qm.forceStartQuest();
        qm.sendOk("mi hermano#bpur#kEstá justo al final de la calle y se muere por conocerte. Sé que estás ocupado, pero ¿podrías pasar a saludar a Puir? Por favor...");
    } else if (status == 5) {
        qm.dispose();
    }
}

function end(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 1 && mode == 0) {
            qm.sendNext("*sniff sniff* ¿No es esta espada lo suficientemente buena para ti, sólo por ahora? Sería un gran honor...");
            qm.dispose();
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendNext("Espera, ¿eres... De ninguna manera... ¿Eres el héroe del que Lilin ha estado hablando todo este tiempo? ¡Lilín! No te limites a asentir... ¡Dime! ¿Es este el héroe que estabas esperando?");
    } else if (status == 1) {
        qm.sendNextPrev("#i4001171#");
    } else if (status == 2) {
        qm.sendNextPrev("Lo lamento. Estoy tan abrumada por las emociones... *Sniff sniff* Dios mío, estoy empezando a llorar. Debes estar muy feliz, Lilin.");
    } else if (status == 3) {
        qm.sendNextPrev("Espera un minuto... No llevas ningún arma. Por lo que he oído, cada uno de los héroes tenía un arma especial. Oh, debes haberlo perdido durante la batalla contra el Mago Negro.");
    } else if (status == 4) {
        qm.sendYesNo("Esto no es suficiente para reemplazar tu arma, pero#blleva esta espada contigo por ahora#k. Es mi regalo para ti. Un héroe no puede andar por ahí con las manos vacías.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#v1302000# 1 #t1302000#\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 35 exp.");
    } else if (status == 5) {
        if (qm.isQuestCompleted(21011)) {
            qm.dropMessage(1, "Error desconocido");
        } else if (qm.canHold(1302000)) {
            qm.gainItem(1302000, 1);
            qm.gainExp(35);
            qm.forceCompleteQuest();
            qm.sendNext("#b(Tus habilidades no están ni cerca de ser las de un héroe... ¿Pero una espada? ¿Alguna vez has empuñado una espada en tu vida? No puedes recordar... ¿Cómo la equipas?)", 3);
        } else {
            qm.dropMessage(1, "Tu inventario está lleno");
        }
    } else if (status == 6) {
        qm.guideHint(16);
        qm.dispose();
    }
}