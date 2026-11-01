/**
 * @author: Ronan
 * @npc: Chamberlain Eak
 * @map: Orbis - Tower of Goddess
 * @func: Orbis PQ
 */

var status = 0;
var em = null;

function isStatueComplete() {
    for (var i = 1; i <= 6; i++) {
        if (cm.getMap().getReactorByName("scar" + i).getState() < 1) {
            return false;
        }
    }

    return true;
}

function clearStage(stage, eim) {
    eim.setProperty("statusStg" + stage, "1");
    eim.showClearEffect(true);
}

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
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

        if (cm.getPlayer().getMapId() == 920011200) { //exit
            cm.warp(200080101);
            cm.dispose();
            return;
        }
        if (!cm.isEventLeader()) {
            if (cm.getPlayer().getMapId() == 920010000) {
                cm.warp(920010000, 2);
                cm.dispose();
                return;
            }

            cm.sendOk("¡Solo deseo hablar con tu líder!");
            cm.dispose();
            return;
        }

        var eim = cm.getEventInstance();

        switch (cm.getPlayer().getMapId()) {
            case 920010000:
                if (eim.getIntProperty("statusStg0") != 1) {
                    eim.warpEventTeamToMapSpawnPoint(920010000, 2);
                    eim.giveEventPlayersExp(3500);
                    clearStage(0, eim);

                    cm.sendNext("¡Por favor salva a Minerva, ha quedado atrapada en el sello por Papa Pixie, el terror de nuestra torre! ¡Perdió todas las piezas de nuestra estatua de Minerva y tenemos que recuperarlas todas! Oh, perdóname, soy el chambelán de la torre, Eak. Soy el sirviente real de Minerva.");
                } else {
                    cm.warp(920010000, 2);
                }
                cm.dispose();
                break;
            case 920010100:
                if (isStatueComplete()) {
                    if (eim.getIntProperty("statusStg7") == -1) {
                        eim.warpEventTeam(920010800);
                    } else if (eim.getIntProperty("statusStg8") == -1) {
                        cm.sendOk("¡Oh! ¡Trajiste el #t4001055#! ¡Por favor, déjalo caer en la base de la estatua para traer de vuelta a Minerva!");
                    } else {
                        cm.sendOk("¡Gracias por salvar a Minerva! Por favor, habla con ella...");
                    }
                } else {
                    cm.sendOk("¡Por favor, salva a Minerva! ¡Reúne las seis piezas de su estatua y luego habla conmigo para recuperar la pieza final!");
                }
                break;
            case 920010200: //walkway
                if (!cm.haveItem(4001050, 30)) {
                    cm.sendOk("¡Reúne las 30 piezas de estatuas de los monstruos en esta etapa y tráemelas para que pueda armarlas!");
                } else {
                    cm.sendOk("¡Los tienes todos! Aquí, la primera pieza de estatua.");
                    cm.removeAll(4001050);
                    cm.gainItem(4001044, 1); //first piece
                    eim.giveEventPlayersExp(3500);
                    clearStage(1, eim);
                }
                break;
            case 920010300: //storage
                if (eim.getIntProperty("statusStg2") != 1) {
                    if (cm.getMap().countMonsters() == 0 && cm.getMap().countItems() == 0) {
                        if (cm.canHold(4001045)) {
                            cm.sendOk("Oh, encontré la segunda pieza de estatua. Toma, tómalo.");
                            cm.gainItem(4001045, 1);
                            eim.giveEventPlayersExp(3500);
                            clearStage(2, eim);
                            eim.setProperty("statusStg2", "1");
                        } else {
                            cm.sendOk("Encontré la segunda pieza de estatua. Obtenga un espacio disponible en su inventario para tomarlo.");
                        }
                    } else {
                        cm.sendOk("Encuentra la segunda pieza de estatua que está escondida en esta habitación.");
                    }
                } else {
                    cm.sendOk("Bien hecho. Ve a buscar las otras piezas de la estatua.");
                }

                break;
            case 920010400: //lobby
                if (eim.getIntProperty("statusStg3") == -1) {
                    cm.sendOk("Por favor, busque el LP del día de la semana actual y colóquelo en el reproductor de música.\r\n#v4001056# Domingo\r\n#v4001057# Lunes\r\n#v4001058# martes\r\n#v4001059# miércoles\r\n#v4001060# jueves\r\n#v4001061# viernes\r\n#v4001062# sábado\r\n");
                } else if (eim.getIntProperty("statusStg3") == 0) {
                    cm.getMap().getReactorByName("stone3").forceHitReactor(1);
                    cm.sendOk("Oh, la música... Suena muy acorde con el ambiente. Bien hecho, ha aparecido una caja en el campo. ¡Recupera la parte de la estatua!");
                    eim.giveEventPlayersExp(3500);
                    clearStage(3, eim);
                    eim.setProperty("statusStg3", "2");

                } else {
                    cm.sendOk("¡Muchas gracias!");
                }
                break;
            case 920010500: //sealed
                if (eim.getIntProperty("statusStg4") == -1) {
                    var total = 3;
                    for (var i = 0; i < 2; i++) {
                        var rnd = Math.round(Math.random() * total);
                        total -= rnd;

                        eim.setProperty("stage4_" + i, rnd);
                    }
                    eim.setProperty("stage4_2", "" + total);

                    eim.setProperty("statusStg4", "0");
                }
                if (eim.getIntProperty("statusStg4") == 0) {
                    var players = Array();
                    var total = 0;
                    for (var i = 0; i < 3; i++) {
                        var z = cm.getMap().getNumPlayersInArea(i);
                        players.push(z);
                        total += z;
                    }
                    if (total != 3) {
                        cm.sendOk("Es necesario que haya exactamente 3 jugadores en estas plataformas.");
                    } else {
                        var num_correct = 0;
                        for (var i = 0; i < 3; i++) {
                            if (eim.getProperty("stage4_" + i) === ("" + players[i])) {
                                num_correct++;
                            }
                        }
                        if (num_correct == 3) {
                            cm.sendOk("¡Encontraste la combinación correcta! Ha aparecido una caja en la parte superior de este mapa, ¡ve a recuperar la pieza de la estatua!");
                            cm.getMap().getReactorByName("stone4").forceHitReactor(1);
                            eim.giveEventPlayersExp(3500);
                            clearStage(4, eim);
                        } else {
                            eim.showWrongEffect();
                            if (num_correct > 0) {
                                cm.sendOk("Una de las plataformas tiene el número correcto de jugadores.");
                            } else {
                                cm.sendOk("Todas las plataformas tienen la cantidad incorrecta de jugadores.");
                            }
                        }
                    }
                } else {
                    cm.sendOk("¡Bien hecho! ¡Por favor, ve a buscar las otras piezas y salva a Minerva!");
                }
                cm.dispose();
                break;
            case 920010600: //lounge
                if (eim.getIntProperty("statusStg5") == -1) {
                    if (!cm.haveItem(4001052, 40)) {
                        cm.sendOk("¡Reúne las 40 piezas de estatuas de los monstruos en esta etapa y tráemelas para que pueda armarlas!");
                    } else {
                        cm.sendOk("¡Los tienes todos! Aquí, la quinta pieza de la estatua.");
                        cm.removeAll(4001052);
                        cm.gainItem(4001048, 1); //fifth piece
                        eim.giveEventPlayersExp(3500);
                        clearStage(5, eim);
                        eim.setIntProperty("statusStg5", 1);
                    }
                } else {
                    cm.sendOk("Los tienes todos aquí. Ve a buscar en las otras habitaciones de la torre.");
                }
                break;
            case 920010700: //on the way up
                if (eim.getIntProperty("statusStg6") == -1) {
                    var rnd1 = Math.floor(Math.random() * 5);

                    var rnd2 = Math.floor(Math.random() * 5);
                    while (rnd2 == rnd1) {
                        rnd2 = Math.floor(Math.random() * 5);
                    }

                    if (rnd1 > rnd2) {
                        rnd1 = rnd1 ^ rnd2;
                        rnd2 = rnd1 ^ rnd2;
                        rnd1 = rnd1 ^ rnd2;
                    }

                    var comb = "";
                    for (var i = 0; i < rnd1; i++) {
                        comb += "0";
                    }
                    comb += "1";
                    for (var i = rnd1 + 1; i < rnd2; i++) {
                        comb += "0";
                    }
                    comb += "1";
                    for (var i = rnd2 + 1; i < 5; i++) {
                        comb += "0";
                    }

                    eim.setProperty("stage6_c", "" + comb);

                    eim.setProperty("statusStg6", "0");
                }

                var comb = eim.getProperty("stage6_c");

                if (eim.getIntProperty("statusStg6") == 0) {
                    var react = "";
                    var total = 0;
                    for (var i = 1; i <= 5; i++) {
                        if (cm.getMap().getReactorByName("" + i).getState() > 0) {
                            react += "1";
                            total += 1;
                        } else {
                            react += "0";
                        }
                    }

                    if (total != 2) {
                        cm.sendOk("Es necesario que haya exactamente 2 palancas presionadas en la parte superior del mapa.");
                    } else {
                        var num_correct = 0;
                        var psh_correct = 0;
                        for (var i = 0; i < 5; i++) {
                            if (react.charCodeAt(i) == comb.charCodeAt(i)) {
                                num_correct++;
                                if (react.charAt(i) == '1') {
                                    psh_correct++;
                                }
                            }
                        }
                        if (num_correct == 5) {
                            cm.sendOk("¡Encontraste la combinación correcta! ¡Recupera la pieza de la estatua del interior!");
                            cm.getMap().getReactorByName("stone6").forceHitReactor(1);
                            eim.giveEventPlayersExp(3500);
                            clearStage(6, eim);
                        } else {
                            eim.showWrongEffect();
                            if (psh_correct >= 1) {
                                cm.sendOk("Una de las palancas empujadas es correcta.");
                            } else {
                                cm.sendOk("Ambas palancas presionadas están equivocadas.");
                            }
                        }
                    }
                } else {
                    cm.sendOk("¡¡Bien hecho!! Ve a ver el resto de piezas.");
                }
                break;
            case 920010800:
                cm.sendNext("¡Por favor, encuentra una manera de derrotar a Papa Pixie! Una vez que hayas encontrado Dark Nependeath colocando semillas, ¡has encontrado a Papa Pixie! ¡¡¡Derrótalo y consigue la Raíz de la Vida para salvar a Minerva!!!");
                break;
            case 920010900:
                if (eim.getProperty("statusStg8") == "1") {
                    cm.sendNext("Esta es la cárcel de la torre. Es posible que encuentres algunas ventajas aquí, solo asegúrate de resolver los acertijos lo más rápido posible.");
                } else {
                    cm.sendNext("Allí abajo no encontrarás ninguna pieza de estatua. Sube la escalera para regresar a la torre central y busca en otro lugar. Puedes volver aquí para conseguir los obsequios que se encuentran allí una vez que hayas salvado a Minerva.");
                }
                break;
            case 920011000:
                if (cm.getMap().countMonsters() > 0) {
                    cm.sendNext("Esta es la habitación oculta de la torre. Después de eliminar a todos los monstruos en esta sala, habla conmigo para acceder a la sala del tesoro, dejando atrás el acceso a la torre central.");
                } else {
                    cm.warp(920011100, "st00");
                }
                break;
        }
        cm.dispose();
    }
}

function clear() {
    cm.showEffect(true, "quest/party/clear");
    cm.playSound(true, "Party1/Clear");
}