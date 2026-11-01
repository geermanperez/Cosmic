/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>
    Copyleft (L) 2016 - 2019 RonanLana (HeavenMS)

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
* @Author: Moogra, XxOsirisxX, Ronan
* @NPC:    2091005
* @Name:   So Gong
* @Map(s): Dojo Hall
*/

var disabled = false;
var belts = Array(1132000, 1132001, 1132002, 1132003, 1132004);
var belt_level = Array(25, 35, 45, 60, 75);
var belt_on_inventory;
var belt_points;

var status = -1;
var selectedMenu = -1;
var dojoWarp = 0;

function start() {
    if (disabled) {
        cm.sendOk("Mi maestro ha solicitado que el dojo sea #rclosed#k en este momento así que no puedo dejarte entrar.");
        cm.dispose();
        return;
    }

    const YamlConfig = Java.type('config.YamlConfig');
    belt_points = YamlConfig.config.server.USE_FAST_DOJO_UPGRADE ? Array(10, 90, 200, 460, 850) : Array(200, 1800, 4000, 9200, 17000);

    belt_on_inventory = [];
    for (var i = 0; i < belts.length; i++) {
        belt_on_inventory.push(cm.haveItemWithId(belts[i], true));
    }

    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.getPlayer().setDojoStage(dojoWarp);
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        }

        if (status == 0) {
            if (isRestingSpot(cm.getPlayer().getMap().getId())) {
                var text = "I'm surprised you made it this far! But it won't be easy from here on out. You still want the challenge?\r\n\r\n#b#L0#I want to continue#l\r\n#L1#I want to leave#l\r\n";

                const MapId = Java.type('constants.id.MapId');
                if (!MapId.isPartyDojo(cm.getPlayer().getMapId())) {
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
        } else {
            if (cm.getPlayer().getMap().getId() == 925020001) {
                if (mode >= 0) {
                    if (status == 1) {
                        selectedMenu = selection;
                    }
                    if (selectedMenu == 0) { //I want to challenge him alone.
                        if (!cm.getPlayer().hasEntered("dojang_Msg") && !cm.getPlayer().getFinishedDojoTutorial()) { //kind of hackish...
                            if (status == 1) {
                                cm.sendYesNo("¡Hola! ¡Tú! Esta es tu primera vez, ¿eh? Bueno, mi maestro no se reúne con cualquiera. Es un hombre ocupado. Y a juzgar por tu apariencia, no creo que se moleste. ¡Ja! Pero hoy es tu día de suerte... Te digo una cosa, si puedes derrotarme, te permitiré ver a mi Maestro. Entonces, ¿qué dices?");
                            } else if (status == 2) {
                                if (mode == 0) {
                                    cm.sendNext("¡Ja ja! ¿A quién intentas impresionar con un corazón como ese?\r\n¡Vuelve a casa, donde perteneces!");
                                    cm.dispose();

                                } else {
                                    var avDojo = cm.getClient().getChannelServer().ingressDojo(true, 0);

                                    if (avDojo < 0) {
                                        if (avDojo == -1) {
                                            cm.sendOk("Todos los Dojos ya se están utilizando. Espere un momento antes de volver a intentarlo.");
                                        } else {
                                            cm.sendOk("O tu grupo ya está usando el Dojo o el tiempo asignado a tu grupo en el Dojo aún no ha expirado. Espera a que terminen para entrar.");
                                        }
                                    } else {
                                        cm.getClient().getChannelServer().getMapFactory().getMap(925020010 + avDojo).resetMapObjects();

                                        cm.resetDojoEnergy();
                                        cm.warp(925020010 + avDojo, 0);
                                    }

                                    cm.dispose();

                                }
                            }
                        } else if (cm.getPlayer().getDojoStage() > 0) {
                            dojoWarp = cm.getPlayer().getDojoStage();
                            cm.getPlayer().setDojoStage(0);

                            var stageWarp = ((dojoWarp / 6) | 0) * 5;
                            cm.sendYesNo("La última vez que aceptaste el desafío tú solo, subiste a la ronda #b." + stageWarp + "#k. Puedo llevarte allí ahora mismo. ¿Quieres ir allí? (Seleccionar#rNo#k para borrar este registro.)");
                        } else {
                            var avDojo = cm.getClient().getChannelServer().ingressDojo(false, dojoWarp);

                            if (avDojo < 0) {
                                if (avDojo == -1) {
                                    cm.sendOk("Todos los Dojos ya se están utilizando. Espere un momento antes de volver a intentarlo.");
                                } else {
                                    cm.sendOk("O tu grupo ya está usando el Dojo o el tiempo asignado a tu grupo en el Dojo aún no ha expirado. Espera a que terminen para entrar.");
                                }

                                cm.getPlayer().setDojoStage(dojoWarp);
                            } else {
                                var warpDojoMap = 925020000 + (dojoWarp + 1) * 100 + avDojo;
                                cm.getClient().getChannelServer().resetDojoMap(warpDojoMap);

                                cm.resetDojoEnergy();
                                cm.warp(warpDojoMap, 0);
                            }

                            cm.dispose();

                        }
                    } else if (selectedMenu == 1) { //I want to challenge him with a party.
                        var party = cm.getPlayer().getParty();
                        if (party == null) {
                            cm.sendNext("¿Adónde crees que vas? ¡Ni siquiera eres el líder del partido! Ve y dile al líder de tu partido que hable conmigo.");
                            cm.dispose();
                            return;
                        }

                        if (party.getLeader().getId() != cm.getPlayer().getId()) {
                            cm.sendNext("¿Adónde crees que vas? ¡Ni siquiera eres el líder del partido! Ve y dile al líder de tu partido que hable conmigo.");
                            cm.dispose();

                        }

                            //else if (party.getMembers().size() == 1) {
                            //    cm.sendNext("¿Van a asumir el desafío como un solo hombre?");
                        //}

                        else if (!isBetween(party, 30)) {
                            cm.sendNext("Los rangos de nivel de tu grupo son demasiado amplios para ingresar. Por favor, asegúrese de que todos los miembros de su grupo estén dentro#r30 niveles#kel uno del otro.");
                            cm.dispose();

                        } else {
                            var avDojo = cm.getClient().getChannelServer().ingressDojo(true, cm.getParty(), 0);

                            if (avDojo < 0) {
                                if (avDojo == -1) {
                                    cm.sendOk("Todos los Dojos ya se están utilizando. Espere un momento antes de volver a intentarlo.");
                                } else {
                                    cm.sendOk("O tu grupo ya está usando el Dojo o el tiempo asignado a tu grupo en el Dojo aún no ha expirado. Espera a que terminen para entrar.");
                                }
                            } else {
                                cm.getClient().getChannelServer().resetDojoMap(925030100 + avDojo);

                                cm.resetPartyDojoEnergy();
                                cm.warpParty(925030100 + avDojo);
                            }

                            cm.dispose();

                        }

                    } else if (selectedMenu == 2) { //I want to receive a belt.
                        if (!cm.canHold(belts[0])) {
                            cm.sendNext("¡Haz espacio en tu inventario EQUIP antes de intentar reclamar un cinturón!");
                            cm.dispose();
                            return;
                        }
                        if (mode < 1) {
                            cm.dispose();
                            return;
                        }
                        if (status == 1) {
                            var selStr = "You have #b" + cm.getPlayer().getDojoPoints() + "#k training points. Master prefers those with great talent. If you obtain more points than the average, you can receive a belt depending on your score.\r\n";
                            for (var i = 0; i < belts.length; i++) {
                                if (belt_on_inventory[i]) {
                                    selStr += "\r\n#L" + i + "##i" + belts[i] + "# #t" + belts[i] + "# (Already on inventory)";
                                } else {
                                    selStr += "\r\n#L" + i + "##i" + belts[i] + "# #t" + belts[i] + "#";
                                }
                            }
                            cm.sendSimple(selStr);
                        } else if (status == 2) {
                            var belt = belts[selection];
                            var level = belt_level[selection];
                            var points = belt_points[selection];

                            var oldbelt = (selection > 0) ? belts[selection - 1] : -1;
                            var haveOldbelt = (oldbelt == -1 || cm.haveItemWithId(oldbelt, false));

                            if (selection > 0 && !belt_on_inventory[selection - 1]) {
                                sendBeltRequirements(belt, oldbelt, haveOldbelt, level, points);
                            } else if (cm.getPlayer().getDojoPoints() >= points) {
                                if (selection > 0 && !haveOldbelt) {
                                    sendBeltRequirements(belt, oldbelt, haveOldbelt, level, points);
                                } else if (cm.getPlayer().getLevel() > level) {
                                    if (selection > 0) {
                                        cm.gainItem(oldbelt, -1);
                                    }
                                    cm.gainItem(belt, 1);
                                    cm.getPlayer().setDojoPoints(cm.getPlayer().getDojoPoints() - points);
                                    cm.sendNext("Ahí está el #i" + belt + "# #b#t" + belt + "##k. Has demostrado tu valor para ascender en los rangos del Dojo. ¡Bien hecho!");
                                } else {
                                    sendBeltRequirements(belt, oldbelt, haveOldbelt, level, points);
                                }
                            } else {
                                sendBeltRequirements(belt, oldbelt, haveOldbelt, level, points);
                            }

                            cm.dispose();

                        }
                    } else if (selectedMenu == 3) { //I want to reset my training points.
                        if (status == 1) {
                            cm.sendYesNo("Sabes que si reinicias tus puntos de entrenamiento, vuelve a 0, ¿verdad? Aunque eso no siempre es malo. Si puedes comenzar a ganar puntos de entrenamiento nuevamente después de reiniciar, podrás recibir los cinturones una vez más. ¿Quieres restablecer tus puntos de entrenamiento ahora?");
                        } else if (status == 2) {
                            if (mode == 0) {
                                cm.sendNext("¿Necesitas reunirte o algo así? Vuelve después de respirar profundamente.");
                            } else {
                                cm.getPlayer().setDojoPoints(0);
                                cm.sendNext("¡Allá! Todos tus puntos de entrenamiento se han reiniciado. ¡Piensa en ello como un nuevo comienzo y entrena duro!");
                            }
                            cm.dispose();

                        }
                    } else if (selectedMenu == 4) { //I want to receive a medal.
                        if (status == 1 && cm.getPlayer().getVanquisherStage() <= 0) {
                            cm.sendYesNo("¿Aún no has intentado la medalla? Si derrotas a un tipo de monstruo en Mu Lung Dojo#b100 veces#kpuedes recibir un título llamado#b#t" + (1142033 + cm.getPlayer().getVanquisherStage()) + "##k. Parece que ni siquiera te has ganado el#b#t" + (1142033 + cm.getPlayer().getVanquisherStage()) + "##k... ¿Quieres probar para el#b#t" + (1142033 + cm.getPlayer().getVanquisherStage()) + "##k?");
                        } else if (status == 2 || cm.getPlayer().getVanquisherStage() > 0) {
                            if (mode == 0) {
                                cm.sendNext("Si no quieres, está bien.");
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

                        } else {
                            cm.dispose();

                        }
                    } else if (selectedMenu == 5) { //What is a Mu Lung Dojo?
                        cm.sendNext("Nuestro maestro es la persona más fuerte de Mu Lung. El lugar que construyó se llama Mu Lung Dojo, un edificio que es#r38 historias#k¡alto! Puedes entrenarte a medida que subes en cada nivel. Por supuesto, será difícil que alguien de tu nivel llegue a la cima.");
                        cm.dispose();

                    }
                } else {
                    cm.dispose();

                }
            } else if (isRestingSpot(cm.getPlayer().getMap().getId())) {
                if (selectedMenu == -1) {
                    selectedMenu = selection;
                }

                if (selectedMenu == 0) {
                    var hasParty = (cm.getParty() != null);

                    var firstEnter = false;
                    var avDojo = cm.getClient().getChannelServer().lookupPartyDojo(cm.getParty());
                    if (avDojo < 0) {
                        if (hasParty) {
                            if (!cm.isPartyLeader()) {
                                cm.sendOk("¡Tú no eres el líder! Llama al líder de tu partido para hablar conmigo si deseas continuar.");
                                cm.dispose();
                                return;
                            }

                            if (!isBetween(cm.getParty(), 35)) {
                                cm.sendOk("Los rangos de nivel de tu grupo son demasiado amplios para ingresar. Por favor, asegúrese de que todos los miembros de su grupo estén dentro#r35 niveles#kel uno del otro.");
                                cm.dispose();
                                return;
                            }
                        }

                        avDojo = cm.getClient().getChannelServer().ingressDojo(hasParty, cm.getParty(), Math.floor((cm.getPlayer().getMap().getId()) / 100) % 100);
                        firstEnter = true;
                    }

                    if (avDojo < 0) {
                        if (avDojo == -1) {
                            cm.sendOk("Todos los Dojos ya se están utilizando. Espere un momento antes de volver a intentarlo.");
                        } else {
                            cm.sendOk("Tu grupo ya se registró en el dojo. Espere a que finalice el tiempo de registro para volver a ingresar.");
                        }
                    } else {
                        var baseStg = hasParty ? 925030000 : 925020000;
                        var nextStg = Math.floor((cm.getPlayer().getMap().getId() + 100) / 100) % 100;

                        var dojoWarpMap = baseStg + (nextStg * 100) + avDojo;
                        if (firstEnter) {
                            cm.getClient().getChannelServer().resetDojoMap(dojoWarpMap);
                        }

                        //non-leader party members can progress whilst having the record saved if they don't command to enter the next stage
                        cm.getPlayer().setDojoStage(0);

                        if (!hasParty || !cm.isLeader()) {
                            cm.warp(dojoWarpMap, 0);
                        } else {
                            cm.warpParty(dojoWarpMap, 0);
                        }
                    }

                    cm.dispose();

                } else if (selectedMenu == 1) { //I want to leave
                    if (status == 1) {
                        cm.sendYesNo("¿Entonces te estás rindiendo? ¿De verdad te vas a ir?");
                    } else {
                        if (mode == 1) {
                            cm.warp(925020002, "st00");
                        }
                        cm.dispose();

                    }
                } else if (selectedMenu == 2) { //I want to record my score up to this point
                    if (status == 1) {
                        cm.sendYesNo("Si registra su puntuación, podrá comenzar donde lo dejó la próxima vez. ¿No es eso conveniente? ¿Quieres registrar tu puntuación actual?");
                    } else {
                        if (mode == 0) {
                            cm.sendNext("¿Crees que puedes llegar aún más alto? ¡Buena suerte!");
                        } else if (cm.getPlayer().getDojoStage() == Math.floor(cm.getMapId() / 100) % 100) {
                            cm.sendOk("Tu puntuación ya ha sido registrada. La próxima vez que desafíes al Dojo, podrás volver a este punto.");
                        } else {
                            cm.sendNext("Grabé tu puntuación. Si me dices que la próxima vez que subas podrás empezar donde lo dejaste. Tenga en cuenta que tendrá su#rregistro borrado#ksi eliges#bContinuar desafiando el Dojo.#k, así que elige con cuidado.");
                            cm.getPlayer().setDojoStage(Math.floor(cm.getMapId() / 100) % 100);
                        }
                        cm.dispose();

                    }
                }
            } else {
                if (mode == 0) {
                    cm.sendNext("¡Deja de cambiar de opinión! Pronto estarás llorando, rogándome que regrese.");
                } else if (mode == 1) {
                    var dojoMapId = cm.getPlayer().getMap().getId();

                    cm.warp(925020002, 0);
                    cm.getPlayer().message("Can you make up your mind please?");

                    cm.getClient().getChannelServer().freeDojoSectionIfEmpty(dojoMapId);
                }
                cm.dispose();
            }
        }
    }
}

function sendBeltRequirements(belt, oldbelt, haveOldbelt, level, points) {
    var beltReqStr = (oldbelt != -1) ? " you must have the #i" + oldbelt + "# belt in your inventory," : "";

    var pointsLeftStr = (points - cm.getPlayer().getDojoPoints() > 0) ? " you need #r" + (points - cm.getPlayer().getDojoPoints()) + "#k more training points" : "";
    var beltLeftStr = (!haveOldbelt) ? " you must have the needed belt unequipped and available in your EQP inventory" : "";
    var conjStr = (pointsLeftStr.length > 0 && beltLeftStr.length > 0) ? " and" : "";

    cm.sendNext("Para recibir #i" + belt + "# #b#t" + belt + "##k," + beltReqStr + "tienes que estar al menos por encima del nivel #b" + level + "#ky necesitas haber ganado al menos#b" + points + "puntos de entrenamiento#k.\r\n\r\nSi quieres obtener este cinturón," + beltLeftStr + conjStr + pointsLeftStr + ".");
}

function isRestingSpot(id) {
    return (Math.floor(id / 100) % 100) % 6 == 0 && id != 925020001;
}

function isBetween(party, range) {
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
    return (highest - lowest) <= range;
}
