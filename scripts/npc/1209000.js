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
    if (mode == 0 && type == 0) {
        status--;
    } else if (mode == -1) {
        cm.dispose();
        return;
    } else {
        status++;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (status == 0) {
        cm.sendNext("¡Aran, estás despierto! ¿Cómo te sientes? ¿Mmm? ¿Quieres saber qué ha estado pasando?");
    } else if (status == 1) {
        cm.sendNext("Ya casi hemos terminado de prepararnos para la fuga. No tienes que preocuparte. Todos los que pude encontrar subieron al arca y Shinsoo aceptó guiar el camino. Nos dirigiremos a la Isla Victoria tan pronto como terminemos los preparativos restantes.");
    } else if (status == 2) {
        cm.sendNext("¿Los otros héroes? Se fueron para luchar contra el Mago Negro. Nos están dando tiempo para escapar. ¿Qué? ¿Quieres pelear con ellos? ¡No! ¡No puedes! Estás herido. ¡Debes irte con nosotros!");
    } else if (status == 3) {
        //cm.setQuestProgress(21002, 1);
        cm.showIntro("Effect/Direction1.img/aranTutorial/Trio");
        cm.dispose();
    }
} 