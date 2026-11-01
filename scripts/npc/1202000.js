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

var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (cm.getPlayer().getMapId() == 140090000) {
            if (!cm.containsAreaInfo(21019, "helper=clear")) {
                if (status == 0) {
                    cm.sendNext("¡Finalmente has despertado...!", 8);
                } else if (status == 1) {
                    cm.sendNextPrev("¿Y tú eres...?", 2);
                } else if (status == 2) {
                    cm.sendNextPrev("El héroe que luchó contra el Mago Negro... ¡Estaba esperando que despertaras!", 8);
                } else if (status == 3) {
                    cm.sendNextPrev("¿Quién... quién eres tú? ¿Y de qué estás hablando?", 2);
                } else if (status == 4) {
                    cm.sendNextPrev("¿Y quién soy yo...? No recuerdo nada... ¡Ay, me duele la cabeza!", 2);
                } else if (status == 5) {
                    cm.showIntro("Effect/Direction1.img/aranTutorial/face");
                    cm.showIntro("Effect/Direction1.img/aranTutorial/ClickLilin");
                    cm.updateAreaInfo(21019, "helper=clear");
                    cm.dispose();
                }
            } else {
                if (status == 0) {
                    cm.sendNextPrev("¿Estás bien?", 8);
                } else if (status == 1) {
                    cm.sendNextPrev("No recuerdo nada. ¿Dónde estoy? ¿Y tú quién eres...?", 2);
                } else if (status == 2) {
                    cm.sendNextPrev("Mantén la calma. No hay necesidad de entrar en pánico. No puedes recordar nada porque la maldición del Mago Negro borró tu memoria. Te diré todo lo que necesitas saber...paso a paso.", 8);
                } else if (status == 3) {
                    cm.sendNextPrev("Eres un héroe que luchó contra el Mago Negro y salvó Maple World hace cientos de años. Pero en el último momento, la maldición del Mago Negro te hizo dormir durante mucho, mucho tiempo. Fue entonces cuando perdiste todos tus recuerdos.", 8);
                } else if (status == 4) {
                    cm.sendNextPrev("Esta isla se llama Rien y es donde te atrapó el Mago Negro. A pesar de su nombre, esta isla siempre está cubierta de hielo y nieve debido a la maldición del Mago Negro. Te encontraron en lo profundo de la Cueva de Hielo.", 8);
                } else if (status == 5) {
                    cm.sendNextPrev("Mi nombre es Lilin y pertenezco al clan de Rien. El Clan Rien ha estado esperando el regreso de un héroe durante mucho tiempo y finalmente te encontramos. ¡Finalmente has regresado!", 8);
                } else if (status == 6) {
                    cm.sendNextPrev("He dicho demasiado. Está bien si realmente no entiendes todo lo que te acabo de decir. Al final lo conseguirás. Por ahora,#bdeberías ir a la ciudad#k. Me quedaré a tu lado y te ayudaré hasta que llegues allí.", 8);
                } else if (status == 7) {
                    cm.spawnGuide();
                    cm.warp(140090100, 0);
                    cm.dispose();
                }
            }
        } else {
            if (status == 0) {
                cm.sendSimple("¿Hay algo por lo que todavía tengas curiosidad? Si es así intentaré explicarlo mejor.#b#l\r\n#L0#¿Quién soy yo?#l #l\r\n#L1#¿Dónde estoy?#l #l\r\n#L2#¿Quién eres?#l#l\r\n#L3#Dime qué tengo que hacer.#l #l\r\n#L4#Cuéntame sobre mi inventario.#l #l\r\n#L5#¿Cómo avanzo mis habilidades?#l #l\r\n#L6#Quiero saber cómo equipar artículos.#l #l\r\n#L7#¿Cómo uso las ranuras rápidas?#l #l\r\n#L8#¿Cómo puedo abrir contenedores rompibles?#l #l\r\n#L9#Quiero sentarme en una silla pero olvidé cómo.#l#k");
            } else if (status == 1) {
                if (selection == 0) {
                    cm.sendNext("Eres uno de los héroes que salvó a Maple World del Black Mage hace cientos de años. Has perdido la memoria debido a la maldición del Mago Negro.");
                    cm.dispose();
                } else if (selection == 1) {
                    cm.sendNext("Esta isla se llama Rien y aquí es donde la maldición del Mago Negro te hizo dormir. Es una pequeña isla cubierta de hielo y nieve, y la mayoría de sus residentes son pingüinos.");
                    cm.dispose();
                } else if (selection == 2) {
                    cm.sendNext("Soy Lilin, miembro del clan de Rien, y he estado esperando tu regreso como lo predijo la profecía. Seré tu guía por ahora.");
                    cm.dispose();
                } else if (selection == 3) {
                    cm.sendNext("No perdamos más tiempo y vámonos a la ciudad. Te daré los detalles cuando lleguemos allí.");
                    cm.dispose();
                } else if (selection == 4) {
                    cm.guideHint(14);
                    cm.dispose();
                } else if (selection == 5) {
                    cm.guideHint(15);
                    cm.dispose();
                } else if (selection == 6) {
                    cm.guideHint(16);
                    cm.dispose();
                } else if (selection == 7) {
                    cm.guideHint(17);
                    cm.dispose();
                } else if (selection == 8) {
                    cm.guideHint(18);
                    cm.dispose();
                } else if (selection == 9) {
                    cm.guideHint(19);
                    cm.dispose();
                }
            }
        }
    }
}