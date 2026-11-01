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
/* Olson the Toy Soldier
	2040002

map: 922000010
quest: 3230
escape: 2040028
*/

var status = 0;
var em;

function start() {
    if (cm.isQuestStarted(3230)) {
        em = cm.getEventManager("DollHouse");

        if (em.getProperty("noEntry") == "false") {
            cm.sendNext("El péndulo está escondido dentro de una casa de muñecas que se ve diferente a las demás.");
        } else {
            cm.sendOk("Alguien más ya está buscando en la zona. Espere hasta que se despeje el área.");
            cm.dispose();
        }
    } else {
        cm.sendOk("No se nos permite permitir que el público en general pase de este punto.");
        cm.dispose();
    }
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
    } else {
        status++;
        if (status == 1) {
            cm.sendYesNo("¿Estás listo para ingresar al mapa de las casas de muñecas?");
        } else if (status == 2) {
            var em = cm.getEventManager("DollHouse");
            if (!em.startInstance(cm.getPlayer())) {
                cm.sendOk("Hmm... Parece que la Casa de Muñecas ya está siendo cuestionada. Vuelve a intentarlo más tarde.");
            }

            cm.dispose();
        }
    }
}