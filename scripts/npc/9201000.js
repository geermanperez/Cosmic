/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2017 RonanLana

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
/* Moony
	Amoria (680000000)
	Engagement ring NPC.
 */

var status;
var state;

var item;
var mats;
var matQty;
var cost;

var options;

function hasEngagementBox(player) {
    for (var i = 2240000; i <= 2240003; i++) {
        if (player.haveItem(i)) {
            return true;
        }
    }

    return false;
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
            options = ["I want to make a ring.", "I want to discard the ring box I have."];
            cm.sendSimple("Soy#p9201000#, el#bfabricante de anillos de compromiso#k. ¿Le puedo ayudar en algo?\r\n\r\n#b" + generateSelectionMenu(options));
        } else if (status == 1) {
            if (selection == 0) {
                if (!cm.isQuestCompleted(100400)) {
                    if (!cm.isQuestStarted(100400)) {
                        state = 0;
                        cm.sendNext("Entonces quieres hacer un anillo de compromiso, ¿eh? Muy bien, puedo proporcionarte uno después de que lo recibas.#rblessings#k de tu#b#p9201003##k.");
                    } else {
                        cm.sendOk("Toma las bendiciones de tu#b#p9201003##kantes de intentar elaborar un anillo de compromiso. Deben estar esperándote en casa, más allá#rCotos de caza de Henesys#k.");
                        cm.dispose();
                    }
                } else {
                    if (hasEngagementBox(cm.getPlayer())) {
                        cm.sendOk("Lo sentimos, ya tienes un cuadro de compromiso. No puedo proporcionarte más de una caja por vez.");
                        cm.dispose();
                        return;
                    }
                    if (cm.getPlayer().getGender() != 0) {
                        cm.sendOk("Lo sentimos, pero la caja de anillos actualmente está disponible solo para hombres.");
                        cm.dispose();
                        return;
                    }

                    state = 1;
                    options = ["Moonstone", "Star Gem", "Golden Heart", "Silver Swan"];
                    var selStr = "So, what kind of engagement ring you want me to craft?\r\n\r\n#b" + generateSelectionMenu(options);
                    cm.sendSimple(selStr);
                }
            } else {
                if (hasEngagementBox(cm.getPlayer())) {
                    for (var i = 2240000; i <= 2240003; i++) {
                        cm.removeAll(i);
                    }

                    cm.sendOk("Tu caja de anillos ha sido descartada.");
                } else {
                    cm.sendOk("No tienes ninguna caja de anillos para descartar.");
                }

                cm.dispose();
            }
        } else if (status == 2) {
            if (state == 0) {
                cm.sendOk("¿Dónde viven, preguntas? Vaya, se remonta a mucho tiempo atrás... verás, soy amigo suyo y fui quien elaboró ​​y entregó personalmente su anillo de compromiso. ellos viven más allá#rCotos de caza de Henesys#k, estoy seguro de que sabes dónde está.");
                cm.startQuest(100400);
                cm.dispose();
            } else {
                var itemSet = [2240000, 2240001, 2240002, 2240003];
                var matSet = [[4011007, 4021007], [4021009, 4021007], [4011006, 4021007], [4011004, 4021007]];
                var matQtySet = [[1, 1], [1, 1], [1, 1], [1, 1]];
                var costSet = [30000, 20000, 10000, 5000];

                item = itemSet[selection];
                mats = matSet[selection];
                matQty = matQtySet[selection];
                cost = costSet[selection];

                var prompt = "Then I'm going to craft you a #b#t" + item + "##k, is that right?";
                prompt += " In that case, I'm going to need specific items from you in order to make it. Make sure you have room in your inventory, though!#b";

                if (mats instanceof Array) {
                    for (var i = 0; i < mats.length; i++) {
                        prompt += "\r\n#i" + mats[i] + "# " + matQty[i] + " #t" + mats[i] + "#";
                    }
                } else {
                    prompt += "\r\n#i" + mats + "# " + matQty + " #t" + mats + "#";
                }

                if (cost > 0) {
                    prompt += "\r\n#i4031138# " + cost + " meso";
                }

                cm.sendYesNo(prompt);
            }
        } else if (status == 3) {
            var complete = true;
            var recvItem = item, recvQty = 1, qty = 1;

            if (!cm.canHold(recvItem, recvQty)) {
                cm.sendOk("Primero verifique su inventario para ver si hay un espacio libre.");
                cm.dispose();
                return;
            } else if (cm.getMeso() < cost * qty) {
                cm.sendOk("Lo siento pero hay una tarifa por mis servicios. Por favor, tráeme la cantidad correcta de mesos antes de intentar forjar un anillo.");
                cm.dispose();
                return;
            } else {
                if (mats instanceof Array) {
                    for (var i = 0; complete && i < mats.length; i++) {
                        if (!cm.haveItem(mats[i], matQty[i] * qty)) {
                            complete = false;
                        }
                    }
                } else if (!cm.haveItem(mats, matQty * qty)) {
                    complete = false;
                }
            }

            if (!complete) {
                cm.sendOk("Hm, parece que te faltan algunos ingredientes para el anillo de compromiso. Por favor, proporciónelos primero, ¿quiere?");
            } else {
                if (mats instanceof Array) {
                    for (var i = 0; i < mats.length; i++) {
                        cm.gainItem(mats[i], -matQty[i] * qty);
                    }
                } else {
                    cm.gainItem(mats, -matQty * qty);
                }

                if (cost > 0) {
                    cm.gainMeso(-cost * qty);
                }

                cm.gainItem(recvItem, recvQty);
                cm.sendOk("Todo listo, el anillo de compromiso salió perfecto. Les deseo un feliz compromiso.");
            }
            cm.dispose();
        }
    }
}

function generateSelectionMenu(array) {
    var menu = "";
    for (var i = 0; i < array.length; i++) {
        menu += "#L" + i + "#" + array[i] + "#l\r\n";
    }
    return menu;
}