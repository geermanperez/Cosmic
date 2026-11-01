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
/* Amos the Wise
	Amoria (680000000)
	Wedding info.
 */

var status;

var rings = [1112806, 1112803, 1112807, 1112809];
var divorceFee = 500000;
var ringObj;

function getWeddingRingItemId(player) {
    for (var i = 0; i < rings.length; i++) {
        if (player.haveItemWithId(rings[i], false)) {
            return rings[i];
        }
    }

    return null;
}

function hasEquippedWeddingRing(player) {
    for (var i = 0; i < rings.length; i++) {
        if (player.haveItemEquipped(rings[i])) {
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
            var questionStr = ["How can I engage someone?", "How can I marry?", "How can I divorce?"]

            if (!(!cm.getPlayer().isMarried() && getWeddingRingItemId(cm.getPlayer()))) {
                questionStr.push("I want a divorce...");
            } else {
                questionStr.push("I wanna remove my old wedding ring...");
            }

            cm.sendSimple("Hola, bienvenido a #bAmoria#k, una hermosa tierra donde los arces pueden encontrar el amor y, si están lo suficientemente inspirados, incluso casarse. ¿Tienes alguna pregunta sobre Amoría? Háblamelo.#b\r\n\r\n" + generateSelectionMenu(questionStr));
        } else if (status == 1) {
            switch (selection) {
                case 0:
                    cm.sendOk("El#bproceso de participación#kes tan sencillo como puede ser. A partir de una petición del#bfabricante de anillos,#p9201000##k, recolectar#b#t4031367#'s#ken todo el mundo Maple.\r\n\r\nAl completarlo, podrás crear un anillo de compromiso. Con uno en las manos, declara tu valía ante alguien a quien te encariñes y espera que esa persona sienta lo mismo.");
                    cm.dispose();
                    break;

                case 1:
                    cm.sendOk("Para el#bproceso de matrimonio#kya debes estar comprometido. La pareja de enamorados debe elegir el lugar en el que quieren celebrar su matrimonio. Amoria ofrece dos: el#rCathedral#k y el#rChapel#k.\r\nEntonces, uno de los socios debe comprar un#bBoleto de boda#k, disponible a través de Cash Shop, y reserve su ceremonia con el asistente de bodas. Cada socio recibirá#rentradas para invitados#kpara ser distribuido a sus conocidos.");
                    cm.dispose();
                    break;

                case 2:
                    cm.sendOk("Lamentablemente, el amor de hace mucho tiempo puede esfumarse algún día. Bueno, espero que ese no sea el caso de cualquier pareja amorosa que alguna vez se casó, se casará hoy o lo hará mañana. Pero, si eso alguna vez sucede, yo mismo estaré a su disposición para realizar un divorcio seguro, por la tarifa de #r." + divorceFee + "#k mesos.");
                    cm.dispose();
                    break;

                case 3:
                    ringObj = cm.getPlayer().getMarriageRing();
                    if (ringObj == null) {
                        var itemid = getWeddingRingItemId(cm.getPlayer());

                        if (itemid != null) {
                            cm.sendOk("Ahí lo tienes, te he quitado tu antiguo anillo de bodas.");
                            cm.gainItem(itemid, -1);
                        } else if (hasEquippedWeddingRing(cm.getPlayer())) {
                            cm.sendOk("Si quieres que te quiten tu antiguo anillo de bodas, quítalo antes de hablar conmigo.");
                        } else {
                            cm.sendOk("No estás casado como para requerir el divorcio.");
                        }

                        cm.dispose();
                        return;
                    }

                    cm.sendYesNo("Entonces, ¿quieres divorciarte de tu pareja? Asegúrate de que este proceso#bno se puede revertir#kDe cualquier manera, se supone que es un ultimátum del cual tu anillo será destruido como consecuencia. Dicho esto, ¿tú#rrealmente quiero divorciarme#k?");
                    break;
            }
        } else if (status == 2) {
            if (cm.getMeso() < divorceFee) {
                cm.sendOk("No tienes la cantidad requerida de #r" + divorceFee + "mesos#k para los honorarios del divorcio.");
                cm.dispose();
                return;
            } else if (ringObj.equipped()) {
                cm.sendOk("Por favor, quítese el anillo antes de intentar divorciarse.");
                cm.dispose();
                return;
            }

            cm.gainMeso(-divorceFee);
            const RingActionHandler = Java.type('net.server.channel.handlers.RingActionHandler');
            RingActionHandler.breakMarriageRing(cm.getPlayer(), ringObj.getItemId());
            cm.gainItem(ringObj.getItemId(), -1);

            cm.sendOk("Te has divorciado de tu pareja.");
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