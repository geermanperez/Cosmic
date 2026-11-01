/**
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Drago (MapleStorySA)
 2.0 - Second Version by Ronan (HeavenMS)
 3.0 - Third Version by Jayd - translated CPQ contents to English and added Pirate items
 Special thanks to 頼晏 (ryantpayton) for also stepping in to translate CPQ scripts.
 ---------------------------------------------------------------------------------------------------
 **/

var status = 0;
var rnk = -1;
var n1 = 50; //???
var n2 = 40; //??? ???
var n3 = 7; //35
var n4 = 10; //40
var n5 = 20; //50

var cpqMap = 980000000;
var cpqMinLvl = 30;
var cpqMaxLvl = 50;
var cpqMinAmt = 2;
var cpqMaxAmt = 6;

function start() {
    status = -1;

    const YamlConfig = Java.type('config.YamlConfig');
    if (!YamlConfig.config.server.USE_CPQ) {
        cm.sendOk("El Carnaval de Monstruos no está disponible actualmente.");
        cm.dispose();
        return;
    }

    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status >= 0 && mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        const YamlConfig = Java.type('config.YamlConfig');
        if (cm.getPlayer().getMapId() == 980000010) {
            if (status == 0) {
                cm.sendNext("¡Espero que te hayas divertido en el Monster Carnival!");
            } else if (status > 0) {
                cm.warp(980000000, 0);
                cm.dispose();
            }
        } else if (cm.getChar().getMap().isCPQLoserMap()) {
            if (status == 0) {
                if (cm.getChar().getParty() != null) {
                    var shiu = "";
                    if (cm.getPlayer().getFestivalPoints() >= 300) {
                        shiu += "#rA#k";
                        cm.sendOk("Desafortunadamente, empataste o perdiste la batalla a pesar de tu excelente desempeño. ¡La victoria puede ser tuya la próxima vez! \r\n\r\n#bYu resultado:" + shiu);
                        rnk = 10;
                    } else if (cm.getPlayer().getFestivalPoints() >= 100) {
                        shiu += "#rB#k";
                        rnk = 20;
                        cm.sendOk("Desafortunadamente, empataste o perdiste la batalla, incluso con tu desempeño final. ¡Solo un poquito y la victoria podría haber sido tuya! \r\n\r\n#bYu resultado:" + shiu);
                    } else if (cm.getPlayer().getFestivalPoints() >= 50) {
                        shiu += "#rC#k";
                        rnk = 30;
                        cm.sendOk("Desafortunadamente, o empataste o perdiste la batalla. La victoria es para los que se esfuerzan. Veo tus esfuerzos, por eso la victoria no está lejos de tu alcance. ¡Sigue así!\r\n\r\n#bTu resultado:" + shiu);
                    } else {
                        shiu += "#rD#k";
                        rnk = 40;
                        cm.sendOk("Desafortunadamente, empataste o perdiste la batalla, y tu desempeño se refleja claramente en ello. Espero más de ti la próxima vez. \r\n\r\n#bYu resultado:" + shiu);
                    }
                } else {
                    cm.warp(980000000, 0);
                    cm.dispose();
                }
            } else if (status == 1) {
                switch (rnk) {
                    case 10:
                        cm.warp(980000000, 0);
                        cm.gainExp(17500);
                        cm.dispose();
                        break;
                    case 20:
                        cm.warp(980000000, 0);
                        cm.gainExp(1200);
                        cm.dispose();
                        break;
                    case 30:
                        cm.warp(980000000, 0);
                        cm.gainExp(5000);
                        cm.dispose();
                        break;
                    case 40:
                        cm.warp(980000000, 0);
                        cm.gainExp(2500);
                        cm.dispose();
                        break;
                    default:
                        cm.warp(980000000, 0);
                        cm.dispose();
                        break;
                }
            }
        } else if (cm.getChar().getMap().isCPQWinnerMap()) {
            if (status == 0) {
                if (cm.getChar().getParty() != null) {
                    var shi = "";
                    if (cm.getPlayer().getFestivalPoints() >= 300) {
                        shi += "#rA#k";
                        rnk = 1;
                        cm.sendOk("Felicitaciones por tu victoria!!! ¡Qué actuación! ¡El grupo opuesto no pudo hacer nada! ¡Espero el mismo buen trabajo la próxima vez! \r\n\r\n#bYu resultado:" + shi);
                    } else if (cm.getPlayer().getFestivalPoints() >= 100) {
                        shi += "#rB#k";
                        rnk = 2;
                        cm.sendOk("¡Felicitaciones por tu victoria! ¡Eso fue increíble! ¡Hiciste un buen trabajo contra el grupo contrario! ¡Solo un poco más y definitivamente obtendrás una A la próxima vez! \r\n\r\n#bYu resultado:" + shi);
                    } else if (cm.getPlayer().getFestivalPoints() >= 50) {
                        shi += "#rC#k";
                        rnk = 3;
                        cm.sendOk("Felicitaciones por su victoria. Hiciste algunas cosas aquí y allá, pero eso no puede considerarse una buena victoria. Espero más de ti la próxima vez. \r\n\r\n#bYu resultado:" + shi);
                    } else {
                        shi += "#rD#k";
                        rnk = 4;
                        cm.sendOk("Felicitaciones por su victoria, aunque su desempeño no lo reflejó del todo. ¡Sé más activo en tu próxima participación en el Monster Carnival! \r\n\r\n#bYu resultado:" + shi);
                    }
                } else {
                    cm.warp(980000000, 0);
                    cm.dispose();
                }
            } else if (status == 1) {
                switch (rnk) {
                    case 1:
                        cm.warp(980000000, 0);
                        cm.gainExp(50000);
                        cm.dispose();
                        break;
                    case 2:
                        cm.warp(980000000, 0);
                        cm.gainExp(25500);
                        cm.dispose();
                        break;
                    case 3:
                        cm.warp(980000000, 0);
                        cm.gainExp(21000);
                        cm.dispose();
                        break;
                    case 4:
                        cm.warp(980000000, 0);
                        cm.gainExp(19505);
                        cm.dispose();
                        break;
                    default:
                        cm.warp(980000000, 0);
                        cm.dispose();
                        break;
                }
            }
        } else if (cm.getMapId() == cpqMap) {   // only CPQ1
            if (status == 0) {
                if (cm.getParty() == null) {
                    status = 10;
                    cm.sendOk("¡Primero debes crear un grupo antes de poder unirte a la batalla!");
                } else if (!cm.isLeader()) {
                    status = 10;
                    cm.sendOk("Si quieres comenzar la batalla, deja que el#blíder del partido#kháblame.");
                } else {
                    var party = cm.getParty().getMembers();
                    var inMap = cm.partyMembersInMap();
                    var lvlOk = 0;
                    var isOutMap = 0;
                    for (var i = 0; i < party.size(); i++) {
                        if (party.get(i).getLevel() >= cpqMinLvl && party.get(i).getLevel() <= cpqMaxLvl) {
                            lvlOk++;

                            if (party.get(i).getPlayer().getMapId() != cpqMap) {
                                isOutMap++;
                            }
                        }
                    }

                    if (party >= 1) {
                        status = 10;
                        cm.sendOk("No tienes suficientes personas en tu grupo. Necesitas una fiesta con #b" + cpqMinAmt + "#k - #r" + cpqMaxAmt + "Miembros #k y deberían estar en el mapa contigo.");
                    } else if (lvlOk != inMap) {
                        status = 10;
                        cm.sendOk("Asegúrate de que todos los miembros de tu grupo estén en los niveles correctos (" + cpqMinLvl + "~" + cpqMaxLvl + ")!");
                    } else if (isOutMap > 0) {
                        status = 10;
                        cm.sendOk("¡Hay algunos miembros del grupo que no están en el mapa!");
                    } else {
                        if (!cm.sendCPQMapLists()) {
                            cm.sendOk("¡Todos los campos de Monster Carnival están actualmente en uso! Vuelve a intentarlo más tarde.");
                            cm.dispose();
                        }
                    }
                }
            } else if (status == 1) {
                if (cm.fieldTaken(selection)) {
                    if (cm.fieldLobbied(selection)) {
                        cm.challengeParty(selection);
                        cm.dispose();
                    } else {
                        cm.sendOk("Actualmente la sala está llena.");
                        cm.dispose();
                    }
                } else {
                    var party = cm.getParty().getMembers();
                    if ((selection >= 0 && selection <= 3) && party.size() < (YamlConfig.config.server.USE_ENABLE_SOLO_EXPEDITIONS ? 1 : 2)) {
                        cm.sendOk("¡Necesitas al menos 2 jugadores para participar en la batalla!");
                    } else if ((selection >= 4 && selection <= 5) && party.size() < (YamlConfig.config.server.USE_ENABLE_SOLO_EXPEDITIONS ? 1 : 3)) {
                        cm.sendOk("¡Necesitas al menos 3 jugadores para participar en la batalla!");
                    } else {
                        cm.cpqLobby(selection);
                    }
                    cm.dispose();
                }
            } else if (status == 11) {
                cm.dispose();
            }
        } else {
            if (status == 0) {
                var talk = "What would you like to do? If you have never participate in the Monster Carnival, you will need to know a few things before participating! \r\n#b#L0# Go to the Monster Carnival 1.#l \r\n#L3# Go to the Monster Carnival 2.#l \r\n#L1# Learn about the Monster Carnival.#l\r\n#L2# Trade #t4001129#.#l";
                cm.sendSimple(talk);
            } else if (status == 1) {
                if (selection == 0) {
                    if ((cm.getLevel() > 29 && cm.getLevel() < 51) || cm.getPlayer().isGM()) {
                        cm.getChar().saveLocation("MONSTER_CARNIVAL");
                        cm.warp(980000000, 0);
                        cm.dispose();

                    } else if (cm.getLevel() < 30) {
                        cm.sendOk("Debes tener al menos el nivel 30 para participar en el Monster Carnival. Háblame cuando seas lo suficientemente fuerte.");
                        cm.dispose();

                    } else {
                        cm.sendOk("Lo siento, pero sólo los jugadores de nivel 30 ~ 50 pueden participar en Monster Carnival.");
                        cm.dispose();

                    }
                } else if (selection == 1) {
                    status = 60;
                    cm.sendSimple("¿Qué te gustaría hacer?\r\n#b#L0#¿Qué es el Carnaval de Monstruos?#l\r\n#L1#Descripción general del Carnaval de Monstruos.#l\r\n#L2#Información detallada sobre el Carnaval de Monstruos.#l\r\n#L3#Nada realmente, he cambiado de opinión.#l");
                } else if (selection == 2) {
                    cm.sendSimple("Recuerda, si tienes#t4001129#, puedes cambiar por artículos. ¡Selecciona el artículo que deseas cambiar!\r\n#b#L0# #t1122007# (" + n1 + "monedas)#l\r\n#L1# #t2041211# (" + n2 + "monedas)#l\r\n#L2#Armas para guerreros#l\r\n#L3#Armas para mago#l\r\n#L4#Armas para arqueros#l\r\n#L5#Armas para el ladrón#l\r\n#L6#Armas para pirata#l");
                } else if (selection == 3) {
                    cm.getChar().saveLocation("MONSTER_CARNIVAL");
                    cm.warp(980030000, 0);
                    cm.dispose();

                }
            } else if (status == 2) {
                select = selection;
                if (select == 0) {
                    if (cm.haveItem(4001129, n1) && cm.canHold(4001129)) {
                        cm.gainItem(1122007, 1);
                        cm.gainItem(4001129, -n1);
                        cm.dispose();
                    } else {
                        cm.sendOk("Comprueba y comprueba si te falta#b#t4001129##ko si su inventario EQUIP está lleno.");
                        cm.dispose();
                    }
                } else if (select == 1) {
                    if (cm.haveItem(4001129, n2) && cm.canHold(2041211)) {
                        cm.gainItem(2041211, 1);
                        cm.gainItem(4001129, -n2);
                        cm.dispose();
                    } else {
                        cm.sendOk("Comprueba y comprueba si te falta#b#t4001129##ko si su inventario USE está lleno.");
                        cm.dispose();
                    }
                } else if (select == 2) {//S2 Warrior 26 S3 Magician 6 S4 Bowman 6 S5 Thief 8
                    status = 10;
                    cm.sendSimple("Asegúrese de tener # t4001129 # para el arma que desea. Selecciona el arma que te gustaría intercambiar #t4001129#. Las opciones que tengo son realmente buenas, ¡y no soy yo quien le habla a la gente que lo dice!\r\n#b#L0# #z1302004# (" + n3 + "monedas)#l\r\n#L1# #z1402006# (" + n3 + "monedas)#l\r\n#L2# #z1302009# (" + n4 + "monedas)#l\r\n#L3# #z1402007# (" + n4 + "monedas)#l\r\n#L4# #z1302010# (" + n5 + "monedas)#l\r\n#L5# #z1402003# (" + n5 + "monedas)#l\r\n#L6# #z1312006# (" + n3 + "monedas)#l\r\n#L7# #z1412004# (" + n3 + "monedas)#l\r\n#L8# #z1312007# (" + n4 + "monedas)#l\r\n#L9# #z1412005# (" + n4 + "monedas)#l\r\n#L10# #z1312008# (" + n5 + "monedas)#l\r\n#L11# #z1412003# (" + n5 + "monedas)#l\r\n#L12#Continuar a la página siguiente (1/2)#l");
                } else if (select == 3) {
                    status = 20;
                    cm.sendSimple("Selecciona el arma que te gustaría intercambiar. Las armas que tengo aquí son sumamente atractivas. ¡Vea usted mismo!\r\n#b#L0# #z1372001# (" + n3 + "monedas)#l\r\n#L1# #z1382018# (" + n3 + "monedas)#l\r\n#L2# #z1372012# (" + n4 + "monedas)#l\r\n#L3# #z1382019# (" + n4 + "monedas)#l\r\n#L4# #z1382001# (" + n5 + "monedas)#l\r\n#L5# #z1372007# (" + n5 + "monedas)#l");
                } else if (select == 4) {
                    status = 30;
                    cm.sendSimple("Selecciona el arma que te gustaría intercambiar. Las armas que tengo aquí son sumamente atractivas. ¡Vea usted mismo!\r\n#b#L0# #z1452006# (" + n3 + "monedas)#l\r\n#L1# #z1452007# (" + n4 + "monedas)#l\r\n#L2# #z1452008# (" + n5 + "monedas)#l\r\n#L3# #z1462005# (" + n3 + "monedas)#l\r\n#L4# #z1462006# (" + n4 + "monedas)#l\r\n#L5# #z1462007# (" + n5 + "monedas)#l");
                } else if (select == 5) {
                    status = 40;
                    cm.sendSimple("Selecciona el arma por la que te gustaría intercambiar. Las armas que tengo son de la más alta calidad. ¡Selecciona el que más te atraiga!\r\n#b#L0# #z1472013# (" + n3 + "monedas)#l\r\n#L1# #z1472017# (" + n4 + "monedas)#l\r\n#L2# #z1472021# (" + n5 + "monedas)#l\r\n#L3# #z1332014# (" + n3 + "monedas)#l\r\n#L4# #z1332031# (" + n4 + "monedas)#l\r\n#L5# #z1332011# (" + n4 + "monedas)#l\r\n#L6# #z1332016# (" + n5 + "monedas)#l\r\n#L7# #z1332003# (" + n5 + "monedas)#l");
                } else if (select == 6) {
                    status = 50; //pirate rewards
                    cm.sendSimple("Selecciona el arma por la que te gustaría intercambiar. Las armas que tengo son de la más alta calidad. ¡Selecciona el que más te atraiga!\r\n#b#L0# #z1482005# (" + n3 + "monedas)#l \r\n#b#L1# #z1482006# (" + n4 + "monedas)#l \r\n#b#L2# #z1482007# (" + n5 + "monedas)#l \r\n#b#L3# #z1492005# (" + n3 + "monedas)#l \r\n#b#L4# #z1492006# (" + n4 + "monedas)#l \r\n#b#L5# #z1492007# (" + n5 + "monedas)#l");
                }
            } else if (status == 11) {
                if (selection == 12) {
                    cm.sendSimple("Selecciona el arma que te gustaría intercambiar. Las armas que tengo aquí son extremadamente útiles. ¡Echa un vistazo!\r\n#b#L0# #z1322015# (" + n3 + "monedas)#l\r\n#L1# #z1422008# (" + n3 + "monedas)#l\r\n#L2# #z1322016# (" + n4 + "monedas)#l\r\n#L3# #z1422007# (" + n4 + "monedas)#l\r\n#L4# #z1322017# (" + n5 + "monedas)#l\r\n#L5# #z1422005# (" + n5 + "monedas)#l\r\n#L6# #z1432003# (" + n3 + "monedas)#l\r\n#L7# #z1442003# (" + n3 + "monedas)#l\r\n#L8# #z1432005# (" + n4 + "monedas)#l\r\n#L9# #z1442009# (" + n4 + "monedas)#l\r\n#L10# #z1442005# (" + n5 + "monedas)#l\r\n#L11# #z1432004# (" + n5 + "monedas)#l\r\n#L12#Volver a la primera página (2/2)#l");
                } else {
                    var item = [1302004, 1402006, 1302009, 1402007, 1302010, 1402003, 1312006, 1412004, 1312007, 1412005, 1312008, 1412003];
                    var cost = [n3, n3, n4, n4, n5, n5, n3, n3, n4, n4, n5];
                    if (cm.haveItem(4001129, cost[selection]) && cm.canHold(item[selection])) {
                        cm.gainItem(item[selection], 1);
                        cm.gainItem(4001129, -cost[selection]);
                        cm.dispose();
                    } else {
                        cm.sendOk("no tienes suficiente#b#t4001129##k, o su inventario está lleno. Por favor verifique nuevamente.");
                        cm.dispose();
                    }
                }
            } else if (status == 12) {
                if (selection == 12) {
                    status = 10;
                    cm.sendSimple("Por favor asegúrese de tener#b#t4001129##kpara el arma que quieres. Selecciona el arma que te gustaría intercambiar.#t4001129#. Las opciones que tengo son realmente buenas, ¡y no soy yo quien le habla a la gente que lo dice!\r\n#b#L0# #z1302004# (" + n3 + "monedas)#l\r\n#L1# #z1402006# (" + n3 + "monedas)#l\r\n#L2# #z1302009# (" + n4 + "monedas)#l\r\n#L3# #z1402007# (" + n4 + "monedas)#l\r\n#L4# #z1302010# (" + n5 + "monedas)#l\r\n#L5# #z1402003# (" + n5 + "monedas)#l\r\n#L6# #z1312006# (" + n3 + "monedas)#l\r\n#L7# #z1412004# (" + n3 + "monedas)#l\r\n#L8# #z1312007# (" + n4 + "monedas)#l\r\n#L9# #z1412005# (" + n4 + "monedas)#l\r\n#L10# #z1312008# (" + n5 + "monedas)#l\r\n#L11# #z1412003# (" + n5 + "monedas)#l\r\n#L12#Continuar a la página siguiente(1/2)#l");
                } else {
                    var item = [1322015, 1422008, 1322016, 1422007, 1322017, 1422005, 1432003, 1442003, 1432005, 1442009, 1442005, 1432004];
                    var cost = [n3, n3, n4, n4, n5, n5, n3, n3, n4, n4, n5, n5];
                    if (cm.haveItem(4001129, cost[selection]) && cm.canHold(item[selection])) {
                        cm.gainItem(item[selection], 1);
                        cm.gainItem(4001129, -cost[selection]);
                        cm.dispose();
                    } else {
                        cm.sendOk("no tienes suficiente#b#t4001129##k, o su inventario está lleno. Por favor verifique nuevamente.");
                        cm.dispose();
                    }
                }
            } else if (status == 21) {
                var item = [1372001, 1382018, 1372012, 1382019, 1382001, 1372007];
                var cost = [n3, n3, n4, n4, n5, n5];
                if (cm.haveItem(4001129, cost[selection]) && cm.canHold(item[selection])) {
                    cm.gainItem(item[selection], 1);
                    cm.gainItem(4001129, -cost[selection]);
                    cm.dispose();
                } else {
                    cm.sendOk("no tienes suficiente#b#t4001129##k, o su inventario está lleno. Por favor verifique nuevamente.");
                    cm.dispose();
                }
            } else if (status == 31) {
                var item = [1452006, 1452007, 1452008, 1462005, 1462006, 1462007];
                var cost = [n3, n4, n5, n3, n4, n5];
                if (cm.haveItem(4001129, cost[selection]) && cm.canHold(item[selection])) {
                    cm.gainItem(item[selection], 1);
                    cm.gainItem(4001129, -cost[selection]);
                    cm.dispose();
                } else {
                    cm.sendOk("no tienes suficiente#b#t4001129##k, o su inventario está lleno. Por favor verifique nuevamente.");
                    cm.dispose();
                }
            } else if (status == 41) {
                var item = [1472013, 1472017, 1472021, 1332014, 1332031, 1332011, 1332016, 1332003];
                var cost = [n3, n4, n5, n3, n4, n4, n5, n5];
                if (cm.haveItem(4001129, cost[selection]) && cm.canHold(item[selection])) {
                    cm.gainItem(item[selection], 1);
                    cm.gainItem(4001129, -cost[selection]);
                    cm.dispose();
                } else {
                    cm.sendOk("no tienes suficiente#b#t4001129##k, o su inventario está lleno. Por favor verifique nuevamente.");
                    cm.dispose();
                }
            } else if (status == 51) {
                var item = [1482005, 1482006, 1482007, 1492005, 1492006, 1492007];
                var cost = [n3, n4, n5, n3, n4, n5];
                if (cm.haveItem(4001129, cost[selection]) && cm.canHold(item[selection])) {
                    cm.gainItem(item[selection], 1);
                    cm.gainItem(4001129, -cost[selection]);
                    cm.dispose();
                } else {
                    cm.sendOk("no tienes suficiente#b#t4001129##k, o su inventario está lleno. Por favor verifique nuevamente.");
                    cm.dispose();
                }
            } else if (status == 61) {
                select = selection;
                if (selection == 0) {
                    cm.sendNext("¡Ja ja! Soy Spiegelmann, el líder de este Carnaval de Monstruos. conseguí el primero#bCarnaval de monstruos#k¡Aquí, esperando que viajeros como tú participen en este espectáculo!");
                } else if (selection == 1) {
                    cm.sendNext("#bCarnaval de monstruos#kConsiste en 2 grupos que ingresan al campo de batalla y sueltan los monstruos invocados por la otra parte.#bUna brigada de combate que determina al vencedor por la cantidad de Carnival Points (CP) recibidos.#k.");
                } else if (selection == 2) {
                    cm.sendNext("Cuando ingreses al Carnival Field, verás aparecer la ventana Lista de monstruos. Todo lo que necesitas hacer es#bseleccione lo que desea utilizar y presione OK#k. Muy fácil, ¿verdad?");
                } else {
                    cm.dispose();
                }
            } else if (status == 62) {
                if (select == 0) {
                    cm.sendNext("Qué es#bCarnaval de monstruos#k? ¡Jajaja! ¡Digamos que es una experiencia que nunca olvidarás! ¡Es una batalla contra otros viajeros como tú!#k");
                } else if (select == 1) {
                    cm.sendNext("Al ingresar al Campo de Carnaval, tu tarea es#bRecibe CP matando a los monstruos del grupo opuesto y usando estos CP para distraer al grupo contrario de golpear a los monstruos.#k.");
                } else if (select == 2) {
                    cm.sendNext("Una vez que se acostumbre a los comandos, intente usar#bTAB y F1 ~ F12#k. #bTAB alterna entre Invocación de Monstruos / Habilidades / Protector#k, y,#bF1 ~ F12 le permite acceder a una de las ventanas directamente#k.");
                }
            } else if (status == 63) {
                if (select == 0) {
                    cm.sendNext("Sé que es demasiado peligroso para ustedes pelear entre sí usando armas reales; y yo no sugeriría un acto tan bárbaro. No amigo mío, lo que ofrezco a la competencia. La emoción de la batalla y la emoción de competir contra gente tan fuerte y motivada. Ofrezco la premisa de que tanto su grupo como el grupo opuesto#bInvoca a los monstruos y derrota a los monstruos invocados por el grupo contrario. Ésta es la esencia del Carnaval de Monstruos. ¡Además, puedes usar las Maple Coins obtenidas durante el Monster Carnival para obtener nuevos artículos y armas!#k");
                } else if (select == 1) {
                    cm.sendNext("Hay 3 formas de distraer al grupo contrario:#bInvocar un monstruo, habilidad y protector#k. ¡Te daré una mirada más profunda si quieres saber más sobre las 'instrucciones detalladas'!");
                } else if (select == 2) {
                    cm.sendNext("#bSummoning#k un Monstruo llama a un monstruo que ataca al oponente, bajo su control. Usa CP para traer un monstruo invocado, y aparecerá en la misma área, atacando al grupo contrario.");
                }
            } else if (status == 64) {
                if (select == 0) {
                    cm.sendNext("Por supuesto, no es tan simple. Hay otras formas de evitar que el otro grupo arroje monstruos, y depende de ti descubrir cómo hacerlo. ¿Qué opinas? ¿Interesado en una competición amistosa?");
                    cm.dispose();
                } else if (select == 1) {
                    cm.sendNext("Atención - Recuerde. Nunca es una buena idea conservar tus CP. #bLos CP que utilizaste ayudarán a determinar el ganador y el perdedor de Monster Carnival.");
                } else if (select == 2) {
                    cm.sendNext("#bAbility#k es una opción para usar habilidades como Oscuridad, Debilidad y otras para evitar que el grupo contrario mate a otros monstruos. No se necesitan muchos CP, pero vale la pena. El único problema es que no duran mucho. ¡Utiliza esta táctica sabiamente!");
                }
            } else if (status == 65) {
                if (select == 1) {
                    cm.sendNext("Ah, y no te preocupes por convertirte en fantasma. En el Carnaval de los Monstruos,#bno perderás EXP después de la muerte#k. ¡Así que es realmente una experiencia como ninguna otra!");
                    cm.dispose();
                } else if (select == 2) {
                    cm.sendNext("#bProtector#k es básicamente un elemento invocado que aumenta drásticamente las habilidades de los monstruos invocados por tu grupo. Protector funciona hasta que es demolido por el grupo contrario, así que espero que primero convoques a varios monstruos y luego traigas al Protector.");
                }
            } else if (status == 66) {
                cm.sendNext("Por último, mientras estás en el Carnaval de Monstruos,#bNo puedes usar objetos/pociones de recuperación que lleves contigo.#kMientras tanto, los monstruos dejaron caer estos objetos para siempre. cuando y cuando tu#bconsíguelos, el artículo se activará inmediatamente#k. Por eso es importante saber cuándo conseguir estos artículos.");
                cm.dispose();
            }
        }
    }
}