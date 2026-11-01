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
* @Author: Moogra, XxOsirisxX
* @NPC:    2091005
* @Name:   So Gong
* @Map(s): Dojo Hall
*/

var disabled = false;
var belts = Array(1132000, 1132001, 1132002, 1132003, 1132004);
var belt_level = Array(25, 35, 45, 60, 75);

/* var belt_points = Array(200, 1800, 4000, 9200, 17000); */
var belt_points = Array(5, 45, 100, 230, 425); /* Watered down version */

var status = -1;
var selectedMenu = -1;

function start() {
    if (disabled) {
        cm.sendOk("Mi maestro ha solicitado que el dojo sea #rclosed#k en este momento así que no puedo dejarte entrar.");
        cm.dispose();
        return;
    }

    if (isRestingSpot(cm.getPlayer().getMap().getId())) {
        var text = "I'm surprised you made it this far! But it won't be easy from here on out. You still want the challenge?\r\n\r\n#b#L0#I want to continue#l\r\n#L1#I want to leave#l\r\n";

        const GameConstants = Java.type('constants.game.GameConstants');
        if (!GameConstants.isDojoPartyArea(cm.getPlayer().getMapId())) {
            text += "#L2#I want to record my score up to this point#l";
        }
        cm.sendSimple(text);
    } else if (cm.getPlayer().getLevel() >= 25) {
        if (cm.getPlayer().getMap().getId() == 925020001) {
            cm.sendSimple("Mi maestro es la persona más fuerte de Mu Lung y ¿quieres desafiarlo? Bien, pero te arrepentirás más tarde.\r\n\r\n#b#L0#Quiero desafiarlo solo.#l\r\n#L1#Quiero desafiarlo con una fiesta.#l\r\n\r\n#L2#Quiero recibir un cinturón.#l\r\n#L3#Quiero restablecer mis puntos de entrenamiento.#l\r\n#L4#Quiero recibir una medalla.#l\r\n#L5#¿Qué es un Dojo Mu Lung?#l");
        } else {
            cm.sendYesNo("¿Qué, te estás rindiendo? ¡Solo necesitas pasar al siguiente nivel! ¿Realmente quieres renunciar e irte?");
        }
    } else {
        cm.sendOk("¡Ey! ¿Te estás burlando de mi maestro? ¿Quién crees que eres para desafiarlo? ¡Esto es una broma! Al menos deberías tener el nivel #b25#k.");
        cm.dispose();
    }
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else if (cm.getPlayer().getMap().getId() == 925020001) {
        if (mode >= 0) {
            if (status == -1) {
                selectedMenu = selection;
            }
            status++; //there is no prev.
            if (selectedMenu == 0) { //I want to challenge him alone.
                if (!cm.getPlayer().hasEntered("dojang_Msg") && !cm.getPlayer().getFinishedDojoTutorial()) { //kind of hackish...
                    if (status == 0) {
                        cm.sendYesNo("¡Hola! ¡Tú! Esta es tu primera vez, ¿eh? Bueno, mi maestro no se reúne con cualquiera. Es un hombre ocupado. Y a juzgar por tu apariencia, no creo que se moleste. ¡Ja! Pero hoy es tu día de suerte... Te digo una cosa, si puedes derrotarme, te permitiré ver a mi Maestro. Entonces, ¿qué dices?");
                    } else if (status == 1) {
                        if (mode == 0) {
                            cm.sendNext("¡Ja ja! ¿A quién intentas impresionar con un corazón como ese?\r\n¡Vuelve a casa, donde perteneces!");
                        } else {
                            if (cm.getClient().getChannelServer().getMapFactory().getMap(925020010).getCharacters().size() > 0) {
                                cm.sendOk("Alguien ya está en Dojo.");
                                cm.dispose();
                                return;
                            }
                            cm.warp(925020010, 0);
                            cm.getPlayer().setFinishedDojoTutorial();
                        }
                        cm.dispose();
                    }
                } else if (cm.getPlayer().getDojoStage() > 0) {
                    if (status == 0) {
                        cm.sendYesNo("La última vez que aceptaste el desafío tú solo, subiste de nivel." + cm.getPlayer().getDojoStage() + ". Puedo llevarte allí ahora mismo. ¿Quieres ir allí?");
                    } else {
                        cm.warp(mode == 1 ? 925020000 + cm.getPlayer().getDojoStage() * 100 : 925020100, 0);
                        cm.dispose();
                    }
                } else {
                    for (var i = 1; i < 39; i++) { //only 32 stages, but 38 maps
                        if (cm.getClient().getChannelServer().getMapFactory().getMap(925020000 + 100 * i).getCharacters().size() > 0) {
                            cm.sendOk("Alguien ya está en el Dojo." + i);
                            cm.dispose();
                            return;
                        }
                    }
                    cm.getClient().getChannelServer().getMapFactory().getMap(925020100).resetReactors();
                    cm.getClient().getChannelServer().getMapFactory().getMap(925020100).killAllMonsters();
                    cm.warp(925020100, 0);
                    cm.dispose();
                }
            } else if (selectedMenu == 1) { //I want to challenge him with a party.
                var party = cm.getPlayer().getParty();
                if (party == null) {
                    cm.sendNext("¿Adónde crees que vas? ¡Ni siquiera eres el líder del partido! Ve y dile al líder de tu partido que hable conmigo.");
                    cm.dispose();
                    return;
                }
                var lowest = cm.getPlayer().getLevel();
                var highest = lowest;
                for (var x = 0; x < party.getMembers().size(); x++) {
                    var lvl = party.getMembers().get(x).getLevel();
                    if (lvl > highest) {
                        highest = lvl;
                    } else if (lvl < lowest) {
                        lowest = lvl;
                    }
                }
                var isBetween30 = highest - lowest < 30;
                if (party.getLeader().getId() != cm.getPlayer().getId()) {
                    cm.sendNext("¿Adónde crees que vas? ¡Ni siquiera eres el líder del partido! Ve y dile al líder de tu partido que hable conmigo.");
                    cm.dispose();
                } else if (party.getMembers().size() == 1) {
                    cm.sendNext("¿Van a asumir el desafío como un solo hombre?");
                } else if (!isBetween30) {
                    cm.sendNext("Los rangos de nivel de tu grupo son demasiado amplios para ingresar. Por favor, asegúrese de que todos los miembros de su grupo estén dentro#r30 niveles#kel uno del otro.");
                } else {
                    for (var i = 1; i < 39; i++) { //only 32 stages, but 38 maps
                        if (cm.getClient().getChannelServer().getMapFactory().getMap(925020000 + 100 * i).getCharacters().size() > 0) {
                            cm.sendOk("Alguien ya está en el Dojo.");
                            cm.dispose();
                            return;
                        }
                    }
                    cm.getClient().getChannelServer().getMapFactory().getMap(925020100).resetReactors();
                    cm.getClient().getChannelServer().getMapFactory().getMap(925020100).killAllMonsters();
                    cm.warpParty(925020100);
                    cm.dispose();
                }
                cm.dispose();
            } else if (selectedMenu == 2) { //I want to receive a belt.
                if (mode < 1) {
                    cm.dispose();
                    return;
                }
                if (status == 0) {
                    var selStr = "You have #b" + cm.getPlayer().getDojoPoints() + "#k training points. Master prefers those with great talent. If you obtain more points than the average, you can receive a belt depending on your score.\r\n";
                    for (var i = 0; i < belts.length; i++) {
                        if (cm.haveItemWithId(belts[i], true)) {
                            selStr += "\r\n     #i" + belts[i] + "# #t" + belts[i] + "#(Obtain)";
                        } else {
                            selStr += "\r\n#L" + i + "##i" + belts[i] + "# #t" + belts[i] + "#l";
                        }
                    }
                    cm.sendSimple(selStr);
                } else if (status == 1) {
                    var belt = belts[selection];
                    var level = belt_level[selection];
                    var points = belt_points[selection];
                    if (cm.getPlayer().getDojoPoints() > points) {
                        if (cm.getPlayer().getLevel() > level) {
                            cm.gainItem(belt, 1);
                        } else {
                            cm.sendNext("Para recibir #i" + belt + "# #b#t" + belt + "##k, tienes que estar al menos por encima del nivel#b" + level + "#ky necesitas haber ganado al menos#b" + points + "puntos de entrenamiento#k.\r\n\r\nSi desea obtener este cinturón, necesita#r" + (points - cm.getPlayer().getDojoPoints()) + "#k más puntos de entrenamiento.");
                        }
                    } else {
                        cm.sendNext("Para recibir #i" + belt + "# #b#t" + belt + "##k, tienes que estar al menos por encima del nivel#b" + level + "#ky necesitas haber ganado al menos#b" + points + "puntos de entrenamiento#k.\r\n\r\nSi desea obtener este cinturón, necesita#r" + (points - cm.getPlayer().getDojoPoints()) + "#k más puntos de entrenamiento.");
                    }
                    cm.dispose();
                }
            } else if (selectedMenu == 3) { //I want to reset my training points.
                if (status == 0) {
                    cm.sendYesNo("Sabes que si reinicias tus puntos de entrenamiento, vuelve a 0, ¿verdad? Aunque eso no siempre es malo. Si puedes comenzar a ganar puntos de entrenamiento nuevamente después de reiniciar, podrás recibir los cinturones una vez más. ¿Quieres restablecer tus puntos de entrenamiento ahora?");
                } else if (status == 1) {
                    if (mode == 0) {
                        cm.sendNext("¿Necesitas reunirte o algo así? Vuelve después de respirar profundamente.");
                    } else {
                        cm.getPlayer().setDojoPoints(0);
                        cm.sendNext("¡Allá! Todos tus puntos de entrenamiento se han reiniciado. ¡Piensa en ello como un nuevo comienzo y entrena duro!");
                    }
                    cm.dispose();
                }
            } else if (selectedMenu == 4) { //I want to receive a medal.
                if (status == 0 && cm.getPlayer().getVanquisherStage() <= 0) {
                    cm.sendYesNo("¿Aún no has intentado la medalla? Si derrotas a un tipo de monstruo en Mu Lung Dojo#b100 veces#kpuedes recibir un título llamado#b#t" + (1142033 + cm.getPlayer().getVanquisherStage()) + "##k. Parece que ni siquiera te has ganado el#b#t" + (1142033 + cm.getPlayer().getVanquisherStage()) + "##k... ¿Quieres probar para el#b#t" + (1142033 + cm.getPlayer().getVanquisherStage()) + "##k?");
                } else if (status == 1 || cm.getPlayer().getVanquisherStage() > 0) {
                    if (mode == 0) {
                        cm.sendNext("Si no quieres, está bien.");
                        cm.dispose();
                    } else {
                        if (cm.getPlayer().getDojoStage() > 37) {
                            cm.sendNext("Has completado todos los desafíos de medallas.");
                        } else if (cm.getPlayer().getVanquisherKills() < 100 && cm.getPlayer().getVanquisherStage() > 0) {
                            cm.sendNext("Aún necesitas #b" + (100 - cm.getPlayer().getVanquisherKills()) + "#kpara poder obtener el#b#t" + (1142032 + cm.getPlayer().getVanquisherStage()) + "##k. Por favor, esfuérzate un poco más. Como recordatorio, sólo se consideran los monstruos que han sido convocados por nuestro Maestro en Mu Lung Dojo. ¡Ah, y asegúrate de no cazar monstruos y salir!#rSi no pasas al siguiente nivel después de derrotar al monstruo, no cuenta como victoria.#k.");
                        } else if (cm.getPlayer().getVanquisherStage() <= 0) {
                            cm.getPlayer().setVanquisherStage(1);
                        } else {
                            cm.sendNext("has obtenido#b#t" + (1142032 + cm.getPlayer().getVanquisherStage()) + "##k.");
                            cm.gainItem(1142033 + cm.getPlayer().getVanquisherStage(), 1);
                            cm.getPlayer().setVanquisherStage(cm.c.getPlayer().getVanquisherStage() + 1);
                            cm.getPlayer().setVanquisherKills(0);
                        }
                    }
                    cm.dispose();
                }
            } else if (selectedMenu == 5) { //What is a Mu Lung Dojo?
                cm.sendNext("Nuestro maestro es la persona más fuerte de Mu Lung. El lugar que construyó se llama Mu Lung Dojo, ¡un edificio de 38 pisos de altura! Puedes entrenarte a medida que subes en cada nivel. Por supuesto, será difícil que alguien de tu nivel llegue a la cima.");
                cm.dispose();
            }
        } else {
            cm.dispose();
        }
    } else if (isRestingSpot(cm.getPlayer().getMap().getId())) {
        if (selectedMenu == -1) {
            selectedMenu = selection;
        }
        status++;
        if (selectedMenu == 0) {
            cm.warp(cm.getPlayer().getMap().getId() + 100, 0);
            cm.dispose();
        } else if (selectedMenu == 1) { //I want to leave
            if (status == 0) {
                cm.sendAcceptDecline("¿Entonces te estás rindiendo? ¿De verdad te vas a ir?");
            } else {
                if (mode == 1) {
                    cm.warp(925020002, "st00");
                }
                cm.dispose();
            }
        } else if (selectedMenu == 2) { //I want to record my score up to this point
            if (status == 0) {
                cm.sendYesNo("Si registra su puntuación, podrá comenzar donde lo dejó la próxima vez. ¿No es eso conveniente? ¿Quieres registrar tu puntuación actual?");
            } else {
                if (mode == 0) {
                    cm.sendNext("¿Crees que puedes llegar aún más alto? ¡Buena suerte!");
                } else if (925020000 + cm.getPlayer().getDojoStage() * 100 == cm.getMapId()) {
                    cm.sendOk("Tu puntuación ya ha sido registrada. La próxima vez que desafíes al Dojo, podrás volver a este punto.");
                } else {
                    cm.sendNext("Grabé tu puntuación. Si me dices que la próxima vez que subas podrás empezar donde lo dejaste.");
                    cm.getPlayer().setDojoStage((cm.getMapId() - 925020000) / 100);
                }
                cm.dispose();
            }
        }
    } else {
        if (mode == 0) {
            cm.sendNext("¡Deja de cambiar de opinión! Pronto estarás llorando, rogándome que regrese.");
        } else if (mode == 1) {
            cm.warp(925020002, 0);
            cm.getPlayer().message("Can you make up your mind please?");
        }
        cm.dispose();
    }
}

function isRestingSpot(id) {
    return (id / 100 - 9250200) % 6 == 0;
}
