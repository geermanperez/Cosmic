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
        if (type == 2 && mode == 0) {
            qm.sendOk("Hm... ¿No crees que eso ayudaría? Piénselo. Podría ayudar, ya sabes...");
            qm.dispose();
            return;
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendNext("¡Bienvenido, héroe! ¿Qué es eso? ¿Quieres saber cómo supe quién eras? Eso es fácil. Escuché a algunas personas que hablaban en voz alta a mi lado. Estoy seguro de que el rumor ya se ha extendido por toda la isla. ¡Todos saben que has regresado!")
    } else if (status == 1) {
        qm.sendNextPrev("Hm, ¿qué tal si pruebas esa espada? ¿No te traería eso algunos recuerdos? ¿Qué tal#bluchando contra algunos monstruos#k?");
    } else if (status == 2) {
        qm.sendAcceptDecline("Ah, lo siento mucho. Estaba tan feliz de haberte conocido finalmente que supongo que me dejé llevar un poco. Vaya, respira profundamente. Respiraciones profundas. Vale, me siento mejor ahora. Pero um... ¿puedo pedirte un favor? ¿Por favor?");
    } else if (status == 3) {
        qm.forceStartQuest();
        qm.sendNext("Da la casualidad de que hay muchos#rMuro de tutoriales#kcerca de aquí. ¿Qué tal derrotar solo?#r3 #kde ellos? Podría ayudarte a recordar un par de cosas.");
    } else if (status == 4) {
        qm.sendNextPrev("Ah, ¿también has olvidado cómo usar tus habilidades?#bColoque las habilidades en las ranuras rápidas para acceder fácilmente.#kTambién puedes colocar artículos consumibles en las ranuras, así que úsalas a tu favor.");
    } else if (status == 5) {
        qm.guideHint(17);
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
        qm.sendOk("Hm... Tu expresión me dice que el ejercicio no me trajo ningún recuerdo. Pero no te preocupes. Al final volverán. ¡Toma, bebe esta poción y enciéndete!\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#v2000022# 10 #t2000022#\r\n#v2000023# 10 #t2000023#\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 57 exp.");
    } else if (status == 1) {
        if (qm.isQuestCompleted(21012)) {
            qm.dropMessage(1, "Error desconocido");
        } else if (qm.canHold(2000022) && qm.canHold(2000023)) {
            qm.forceCompleteQuest();
            qm.gainExp(57);
            qm.gainItem(2000022, 10);
            qm.gainItem(2000023, 10);
            qm.sendOk("#b(Incluso si eres realmente el héroe que todos dicen que eres... ¿De qué sirves sin ninguna habilidad?)", 3);
        } else {
            qm.dropMessage(1, "Tu inventario está lleno");
            qm.dispose();
        }
    } else if (status == 2) {
        qm.dispose();
    }
}