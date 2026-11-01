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
/**
 *9201003.js - Mom and Dad
 *@author Jvlaple
 *@author Ronan
 */
var numberOfLoves = 0;
var status = -1;
var state = 0;

function hasProofOfLoves(player) {
    var count = 0;

    for (var i = 4031367; i <= 4031372; i++) {
        if (player.haveItem(i)) {
            count++;
        }
    }

    return count >= 4;
}

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
            if (!cm.isQuestStarted(100400)) {
                cm.sendOk("Hola somos mamá y papá...");
                cm.dispose();
            } else {
                if (cm.getQuestProgressInt(100400, 1) == 0) {
                    cm.sendNext("Mamá, papá, tengo una petición que hacerles a los dos... Quiero saber más sobre el camino que ya han recorrido desde siempre, el camino de amar y cuidar a alguien querido para mí.", 2);
                } else {
                    if (!hasProofOfLoves(cm.getPlayer())) {
                        cm.sendOk("Querido, debemos asegurarnos de que estés realmente listo para enamorarte de quien elijas como tu pareja, tráelo aquí.#b4 #t4031367#'s#k.");
                        cm.dispose();
                    } else {
                        cm.sendNext("#b#h0##k, nos hiciste sentir orgullosos hoy. Es posible que ahora tengas#rnuestras bendiciones#kpara elegir a quien quieras para que sea tu prometida. Ya puedes consultar#p9201000#, el joyero de bodas. Que tengas un viaje tranquilo, amoroso y afectuoso por delante~~");
                        state = 1;
                    }
                }
            }
        } else if (status == 1) {
            if (state == 0) {
                cm.sendNextPrev("¡Cariño mío! Qué amable de tu parte pedir nuestra ayuda. ¡Seguro que te ayudaremos!");
            } else {
                cm.sendOk("Mamá... Papá... ¡¡¡Muchas gracias por tu tierno apoyo!!!", 2);

                cm.completeQuest(100400);
                cm.gainExp(20000 * cm.getPlayer().getExpRate());
                for (var i = 4031367; i <= 4031372; i++) {
                    cm.removeAll(i);
                }

                cm.dispose();
            }
        } else if (status == 2) {
            cm.sendNextPrev("Seguramente ya debes haber visto#rNanas, las hadas del Amor#k, alrededor del mundo Maple. De 4 de ellos, recoge#b4 #t4031367#'s#ky tráelos aquí. Este viaje aclarará algunas preguntas que puedas tener sobre el amor...");
        } else if (status == 3) {
            cm.setQuestProgress(100400, 1, 1);
            cm.dispose();
        }
    }
}