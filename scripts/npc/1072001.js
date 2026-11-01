/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License version 3
    as published by the Free Software Foundation. You may not use, modify
    or distribute this program under any other version of the
    GNU Affero General Public License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* Magician Job Instructor
	Magician 2nd Job Advancement
	Victoria Road : The Forest North of Ellinia (101020000)
*/

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (cm.isQuestCompleted(100007)) {
                cm.sendOk("¡Eres realmente un héroe!");
                cm.dispose();
            } else if (cm.isQuestCompleted(100006)) {
                cm.sendNext("¡Muy bien, te dejaré entrar! Derrota a los monstruos que están dentro, recoge 30 canicas oscuras y luego entabla una conversación con un colega mío que está dentro. el te dara#bLa prueba de un héroe#k, la prueba de que has pasado la prueba. Mucha suerte para ti.");
                status = 4;
            } else if (cm.isQuestStarted(100006)) {
                cm.sendNext("Hmmm...definitivamente es la carta de#bGrendell el realmente viejo#k...así que viniste hasta aquí para tomar el examen y lograr el segundo avance laboral como mago. Muy bien, te explicaré la prueba. No te preocupes mucho, no es tan complicado.");
            } else {
                cm.sendOk("Puedo mostrarte el camino una vez que estés listo para ello.");
                cm.dispose();
            }
        } else if (status == 1) {
            cm.sendNextPrev("Te enviaré a un mapa oculto. Verás monstruos que normalmente no ves. Tienen el mismo aspecto que los normales, pero con una actitud totalmente diferente. No aumentan tu nivel de experiencia ni te proporcionan artículos.");
        } else if (status == 2) {
            cm.sendNextPrev("Podrás adquirir una canica llamada#b#t4031013##kmientras derribas a esos monstruos. Es una canica especial hecha de sus mentes siniestras y malvadas. Recoge 30 de esos y luego ve a hablar con un colega mío que está allí. Así es como pasas la prueba.");
        } else if (status == 3) {
            cm.sendYesNo("Una vez que entres, no podrás salir hasta que te ocupes de tu misión. Si mueres, tu nivel de experiencia disminuirá... Así que será mejor que te abroches el cinturón y te prepares... bueno, ¿quieres hacerlo ahora?");
        } else if (status == 4) {
            cm.sendNext("¡Muy bien, te dejaré entrar! Derrota a los monstruos que están dentro, recoge 30 canicas oscuras y luego entabla una conversación con un colega mío que está dentro. el te dara#bLa prueba de un héroe#k, la prueba de que has pasado la prueba. Mucha suerte para ti.");
            cm.completeQuest(100006);
            cm.startQuest(100007);
            cm.gainItem(4031009, -1);
        } else if (status == 5) {
            cm.warp(108000200, 0);
            cm.dispose();
        } else {
            cm.dispose();
        }
    }
}
