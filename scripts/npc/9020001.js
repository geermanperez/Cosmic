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
 * @author: Stereo, Moogra, Ronan
 * @npc: Cloto
 * @map: 1st Accompaniment - KPQ
 * @func: Kerning PQ
 */

var stage1Question = "Here's the question. What is 5 + 5? Collect exactly #b10 coupons#k and bring them to me to receive your pass.";
var stage1Answer = 10;

const Rectangle = Java.type('java.awt.Rectangle');
var stage2Rects = Array(new Rectangle(-755, -132, 4, 218), new Rectangle(-721, -340, 4, 166), new Rectangle(-586, -326, 4, 150), new Rectangle(-483, -181, 4, 222));
var stage3Rects = Array(new Rectangle(608, -180, 140, 50), new Rectangle(791, -117, 140, 45),
    new Rectangle(958, -180, 140, 50), new Rectangle(876, -238, 140, 45),
    new Rectangle(702, -238, 140, 45));
var stage4Rects = Array(new Rectangle(910, -236, 35, 5), new Rectangle(877, -184, 35, 5),
    new Rectangle(946, -184, 35, 5), new Rectangle(845, -132, 35, 5),
    new Rectangle(910, -132, 35, 5), new Rectangle(981, -132, 35, 5));

var stage2Combos = Array(Array(0, 1, 1, 1), Array(1, 0, 1, 1), Array(1, 1, 0, 1), Array(1, 1, 1, 0));
var stage3Combos = Array(Array(0, 0, 1, 1, 1), Array(0, 1, 0, 1, 1), Array(0, 1, 1, 0, 1),
    Array(0, 1, 1, 1, 0), Array(1, 0, 0, 1, 1), Array(1, 0, 1, 0, 1),
    Array(1, 0, 1, 1, 0), Array(1, 1, 0, 0, 1), Array(1, 1, 0, 1, 0),
    Array(1, 1, 1, 0, 0));
var stage4Combos = Array(Array(0, 0, 0, 1, 1, 1), Array(0, 0, 1, 0, 1, 1), Array(0, 0, 1, 1, 0, 1),
    Array(0, 0, 1, 1, 1, 0), Array(0, 1, 0, 0, 1, 1), Array(0, 1, 0, 1, 0, 1),
    Array(0, 1, 0, 1, 1, 0), Array(0, 1, 1, 0, 0, 1), Array(0, 1, 1, 0, 1, 0),
    Array(0, 1, 1, 1, 0, 0), Array(1, 0, 0, 0, 1, 1), Array(1, 0, 0, 1, 0, 1),
    Array(1, 0, 0, 1, 1, 0), Array(1, 0, 1, 0, 0, 1), Array(1, 0, 1, 0, 1, 0),
    Array(1, 0, 1, 1, 0, 0), Array(1, 1, 0, 0, 0, 1), Array(1, 1, 0, 0, 1, 0),
    Array(1, 1, 0, 1, 0, 0), Array(1, 1, 1, 0, 0, 0));

function clearStage(stage, eim, curMap) {
    eim.setProperty(stage + "stageclear", "true");
    eim.showClearEffect(true);

    eim.linkToNextStage(stage, "kpq", curMap);  //opens the portal to the next map
}

function rectangleStages(eim, property, areaCombos, areaRects) {
    var c = eim.getProperty(property);
    if (c == null) {
        c = Math.floor(Math.random() * areaCombos.length);
        eim.setProperty(property, c.toString());
    } else {
        c = parseInt(c);
    }

    // get player placement
    var players = eim.getPlayers();
    var playerPlacement = [0, 0, 0, 0, 0, 0];

    for (var i = 0; i < eim.getPlayerCount(); i++) {
        for (var j = 0; j < areaRects.length; j++) {
            if (areaRects[j].contains(players.get(i).getPosition())) {
                playerPlacement[j] += 1;
                break;
            }
        }
    }

    var curCombo = areaCombos[c];
    var accept = true;
    for (var j = 0; j < curCombo.length; j++) {
        if (curCombo[j] != playerPlacement[j]) {
            accept = false;
            break;
        }
    }

    return accept;
}

var status = -1;
var eim;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    eim = cm.getEventInstance();

    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            var curMap = cm.getMapId();
            var stage = curMap - 103000800 + 1;
            if (eim.getProperty(stage.toString() + "stageclear") != null) {
                if (stage < 5) {
                    cm.sendNext("¡Date prisa y pasa a la siguiente etapa, el portal se abrió!");
                    cm.dispose();
                } else {
                    cm.sendNext("¡Increíble! Has superado todas las etapas para llegar a este punto. Aquí tienes un pequeño premio por tu trabajo bien hecho. Sin embargo, antes de aceptarlo, asegúrese de que sus inventarios de uso, etc. tengan espacios vacíos disponibles.");
                }
            } else if (curMap == 103000800) {   // stage 1
                if (cm.isEventLeader()) {
                    var numpasses = eim.getPlayerCount() - 1;     // minus leader

                    if (cm.hasItem(4001008, numpasses)) {
                        cm.sendNext("te reuniste" + numpasses + "pasa! ¡Felicitaciones por despejar el escenario! Haré el portal que te enviará a la siguiente etapa. Hay un límite de tiempo para llegar allí, así que apúrate. ¡Mucha suerte a todos!");
                        clearStage(stage, eim, curMap);
                        eim.gridClear();
                        cm.gainItem(4001008, -numpasses);
                    } else {
                        cm.sendNext("Lo siento, pero te faltan pases. Tienes que darme el número correcto de pases; debe ser el número de miembros de tu grupo menos el líder, en este caso el total de" + numpasses + "para despejar el escenario. Dile a los miembros de tu grupo que resuelvan las preguntas, recojan los pases y te los entreguen.");
                    }
                } else {
                    var data = eim.gridCheck(cm.getPlayer());

                    if (data == 0) {
                        cm.sendNext("Gracias por traerme los cupones. Entregue el pase al líder de su grupo para continuar.");
                    } else if (data == -1) {
                        data = 1; // Every player receives the same easy question.
                        eim.gridInsert(cm.getPlayer(), data);

                        var question = stage1Question;
                        cm.sendNext(question);
                    } else {
                        var answer = stage1Answer;

                        if (cm.itemQuantity(4001007) == answer) {
                            cm.sendNext("¡Esa es la respuesta correcta! Para ello acaba de recibir un #bpass#k. Por favor, entrégaselo al líder del partido.");
                            cm.gainItem(4001007, -answer);
                            cm.gainItem(4001008, 1);
                            eim.gridInsert(cm.getPlayer(), 0);
                        } else {
                            var question = stage1Question;
                            cm.sendNext("Lo siento, ¡pero esa no es la respuesta correcta!\r\n" + question);
                        }
                    }
                }

                cm.dispose();
            } else if (curMap == 103000801) {   // stage 2
                var stgProperty = "stg2Property";
                var stgCombos = stage2Combos;
                var stgAreas = stage2Rects;

                var nthtext = "2nd", nthobj = "ropes", nthverb = "hang", nthpos = "hang on the ropes too low";
                var nextStgId = 103000802;

                if (!eim.isEventLeader(cm.getPlayer())) {
                    cm.sendOk("Siga las instrucciones dadas por el líder de su partido para pasar por esta etapa.");
                } else if (eim.getProperty(stgProperty) == null) {
                    cm.sendNext("Hola. Bienvenido a la" + nthtext + "escenario. A mi lado, verás una serie de" + nthobj + ". fuera de estos" + nthobj + ", #b3 están conectados al portal que te envía a la siguiente etapa#k. Todo lo que necesitas hacer es tener#b3 miembros del grupo encuentran el correcto" + nthobj + "y" + nthverb + "en ellos.#k\r\nBUT, no cuenta como respuesta si" + nthpos + "; por favor esté cerca del medio del" + nthobj + "para ser contado como una respuesta correcta. Además, solo se permiten 3 miembros de tu grupo en el" + nthobj + ". una vez que estén" + nthverb + "Al basarse en ellos, el líder del partido debe#bHaz doble clic en mí para comprobar y ver si la respuesta es correcta o no.#k. Ahora, encuentra el derecho" + nthobj + "a" + nthverb + "¡en!");
                    var c = Math.floor(Math.random() * stgCombos.length);
                    eim.setProperty(stgProperty, c.toString());
                } else {
                    var accept = rectangleStages(eim, stgProperty, stgCombos, stgAreas);

                    if (accept) {
                        clearStage(stage, eim, curMap);
                        cm.sendNext("¡Date prisa y pasa a la siguiente etapa, el portal se abrió!");
                    } else {
                        eim.showWrongEffect();
                        cm.sendNext("Parece que no has encontrado los 3" + nthobj + "todavía. Por favor piense en una combinación diferente de" + nthobj + ". Sólo 3 pueden" + nthverb + "en" + nthobj + ", y si tu" + nthpos + "Es posible que no cuente como respuesta, así que téngalo en cuenta. ¡Sigue adelante!");
                    }
                }

                cm.dispose();
            } else if (curMap == 103000802) {
                var stgProperty = "stg3Property";
                var stgCombos = stage3Combos;
                var stgAreas = stage3Rects;

                var nthtext = "3rd", nthobj = "platforms", nthverb = "stand", nthpos = "stand too close to the edges";
                var nextStgId = 103000803;

                if (!eim.isEventLeader(cm.getPlayer())) {
                    cm.sendOk("Siga las instrucciones dadas por el líder de su partido para pasar por esta etapa.");
                } else if (eim.getProperty(stgProperty) == null) {
                    cm.sendNext("Hola. Bienvenido a la" + nthtext + "escenario. A mi lado, verás una serie de" + nthobj + ". fuera de estos" + nthobj + ", #b3 están conectados al portal que te envía a la siguiente etapa#k. Todo lo que necesitas hacer es tener#b3 miembros del grupo encuentran el correcto" + nthobj + "y" + nthverb + "en ellos.#k\r\nBUT, no cuenta como respuesta si" + nthpos + "; por favor esté cerca del medio del" + nthobj + "para ser contado como una respuesta correcta. Además, solo se permiten 3 miembros de tu grupo en el" + nthobj + ". una vez que estén" + nthverb + "Al basarse en ellos, el líder del partido debe#bHaz doble clic en mí para comprobar y ver si la respuesta es correcta o no.#k. Ahora, encuentra el derecho" + nthobj + "a" + nthverb + "¡en!");
                    var c = Math.floor(Math.random() * stgCombos.length);
                    eim.setProperty(stgProperty, c.toString());
                } else {
                    var accept = rectangleStages(eim, stgProperty, stgCombos, stgAreas);

                    if (accept) {
                        clearStage(stage, eim, curMap);
                        cm.sendNext("¡Date prisa y pasa a la siguiente etapa, el portal se abrió!");
                    } else {
                        eim.showWrongEffect();
                        cm.sendNext("Parece que no has encontrado los 3" + nthobj + "todavía. Por favor piense en una combinación diferente de" + nthobj + ". Sólo 3 pueden" + nthverb + "en" + nthobj + ", y si tu" + nthpos + "Es posible que no cuente como respuesta, así que téngalo en cuenta. ¡Sigue adelante!");
                    }
                }

                cm.dispose();
            } else if (curMap == 103000803) {
                var stgProperty = "stg4Property";
                var stgCombos = stage4Combos;
                var stgAreas = stage4Rects;

                var nthtext = "4th", nthobj = "barrels", nthverb = "stand", nthpos = "stand too close to the edges";
                var nextStgId = 103000804;

                if (!eim.isEventLeader(cm.getPlayer())) {
                    cm.sendOk("Siga las instrucciones dadas por el líder de su partido para pasar por esta etapa.");
                } else if (eim.getProperty(stgProperty) == null) {
                    cm.sendNext("Hola. Bienvenido a la" + nthtext + "escenario. A mi lado, verás una serie de" + nthobj + ". fuera de estos" + nthobj + ", #b3 están conectados al portal que te envía a la siguiente etapa#k. Todo lo que necesitas hacer es tener#b3 miembros del grupo encuentran el correcto" + nthobj + "y" + nthverb + "en ellos.#k\r\nBUT, no cuenta como respuesta si" + nthpos + "; por favor esté cerca del medio del" + nthobj + "para ser contado como una respuesta correcta. Además, solo se permiten 3 miembros de tu grupo en el" + nthobj + ". una vez que estén" + nthverb + "Al basarse en ellos, el líder del partido debe#bHaz doble clic en mí para comprobar y ver si la respuesta es correcta o no.#k. Ahora, encuentra el derecho" + nthobj + "a" + nthverb + "¡en!");
                    var c = Math.floor(Math.random() * stgCombos.length);
                    eim.setProperty(stgProperty, c.toString());
                } else {
                    var accept = rectangleStages(eim, stgProperty, stgCombos, stgAreas);

                    if (accept) {
                        clearStage(stage, eim, curMap);
                        cm.sendNext("¡Date prisa y pasa a la siguiente etapa, el portal se abrió!");
                    } else {
                        eim.showWrongEffect();
                        cm.sendNext("Parece que no has encontrado los 3" + nthobj + "todavía. Por favor piense en una combinación diferente de" + nthobj + ". Sólo 3 pueden" + nthverb + "en" + nthobj + ", y si tu" + nthpos + "Es posible que no cuente como respuesta, así que téngalo en cuenta. ¡Sigue adelante!");
                    }
                }

                cm.dispose();
            } else if (curMap == 103000804) {
                if (eim.isEventLeader(cm.getPlayer())) {
                    if (cm.haveItem(4001008, 10)) {
                        cm.sendNext("Aquí está el portal que te lleva a la última etapa de bonificación. Es una etapa que te permite derrotar a los monstruos normales un poco más fácilmente. Se te dará una cantidad determinada de tiempo para cazar tanto como sea posible, pero siempre puedes abandonar el escenario en el medio a través del NPC. Nuevamente, felicidades por superar todas las etapas. Deje que su grupo hable conmigo para recibir sus premios, ya que se les permite pasar a la etapa de bonificación. Cuidarse...");
                        cm.gainItem(4001008, -10);

                        clearStage(stage, eim, curMap);
                        eim.clearPQ();
                    } else {
                        cm.sendNext("Hola. Bienvenidos a la quinta y última etapa. Camina por el mapa y podrás encontrar algunos monstruos Boss. Derrótalos a todos, reúnete.#blos pases#k, y por favor tráigamelos. Una vez que obtengas tu pase, el líder de tu grupo los recogerá y luego me los entregará una vez que#bpasses#k están recogidos. Puede que los monstruos te resulten familiares, pero pueden ser mucho más fuertes de lo que crees, así que ten cuidado. ¡Buena suerte!");
                    }
                } else {
                    cm.sendNext("Bienvenidos a la quinta y última etapa.  Camina por el mapa y podrás encontrar algunos monstruos Boss.  Derrótalos a todos, reúne los#bpasses#k, y#bdáselos a tu líder#k.  Una vez que hayas terminado, regresa conmigo para recoger tu recompensa.");
                }

                cm.dispose();
            }
        } else if (status == 1) {
            if (!eim.giveEventReward(cm.getPlayer())) {
                cm.sendNext("¡Primero haga espacio en su inventario!");
            } else {
                cm.warp(103000805, "st00");
            }

            cm.dispose();
        }
    }
}
