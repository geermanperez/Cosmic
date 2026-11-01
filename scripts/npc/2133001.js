/**
 * @author: Ronan
 * @npc: Ellin
 * @map: Ellin PQ
 * @func: Ellin PQ Coordinator
 */

var status = 0;
var mapid;

function start() {
    mapid = cm.getPlayer().getMapId();

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

        if (status == 0) {
            var ellinStr = ellinMapMessage(mapid);

            if (mapid == 930000000) {
                cm.sendNext(ellinStr);
            } else if (mapid == 930000300) {
                var eim = cm.getEventInstance();

                if (eim.getIntProperty("statusStg4") == 0) {
                    eim.showClearEffect(cm.getMap().getId());
                    eim.setIntProperty("statusStg4", 1);
                }

                cm.sendNext(ellinStr);
            } else if (mapid == 930000400) {
                if (cm.haveItem(4001169, 20)) {
                    if (cm.isEventLeader()) {
                        cm.sendNext("¡Oh, los has traído! Ahora podemos continuar, ¿continuamos?");
                    } else {
                        cm.sendOk("¡Los has traído, pero no eres el líder! Por favor, deja que el líder me entregue las canicas...");
                        cm.dispose();

                    }
                } else {
                    if (cm.getEventInstance().gridCheck(cm.getPlayer()) != 1) {
                        cm.sendNext(ellinStr);

                        cm.getEventInstance().gridInsert(cm.getPlayer(), 1);
                        status = -1;
                    } else {
                        var mobs = cm.getMap().countMonsters();

                        if (mobs > 0) {
                            if (!cm.haveItem(2270004)) {
                                if (cm.canHold(2270004, 10)) {
                                    cm.gainItem(2270004, 10);
                                    cm.sendOk("Toma 10#t2270004#. Primero,#rdebilitar el#o9300174##ky, una vez que tenga poca salud, usa el objeto que te di para capturarlos.");
                                    cm.dispose();

                                } else {
                                    cm.sendOk("¡Haga espacio en su inventario USE antes de recibir los purificadores!");
                                    cm.dispose();

                                }
                            } else {
                                cm.sendYesNo(ellinStr + "\r\n\r\npuede ser que lo seas#rdispuesto a renunciar#k? Piénselo dos veces, tal vez sus socios todavía estén probando esta instancia.");
                            }
                        } else {
                            cm.sendYesNo("Ustedes captaron todos los#o9300174#. Deja que el líder del partido entregue todo.#b20 #t4001169##ka mí para proceder." + "\r\n\r\npuede ser que lo seas#rdispuesto a renunciar#k? Piénselo dos veces, tal vez sus socios todavía estén probando esta instancia.");
                        }
                    }
                }
            } else {
                cm.sendYesNo(ellinStr + "\r\n\r\npuede ser que lo seas#rdispuesto a renunciar#k? Piénselo dos veces, tal vez sus socios todavía estén probando esta instancia.");
            }
        } else if (status == 1) {
            if (mapid == 930000000) {
            } else if (mapid == 930000300) {
                cm.getEventInstance().warpEventTeam(930000400);
            } else if (mapid == 930000400) {
                if (cm.haveItem(4001169, 20) && cm.isEventLeader()) {
                    cm.gainItem(4001169, -20);
                    cm.getEventInstance().warpEventTeam(930000500);
                } else {
                    cm.warp(930000800, 0);
                }
            } else {
                cm.warp(930000800, 0);
            }

            cm.dispose();
        }
    }
}

function ellinMapMessage(mapid) {
    switch (mapid) {
        case 930000000:
            return "Welcome to the Forest of Poison Haze. Proceed by entering the portal.";

        case 930000100:
            return "The #b#o9300172##k have taken the area. We have to eliminate all these contaminated monsters to proceed further.";

        case 930000200:
            return "A great spine has blocked the way ahead. To remove this barrier we must retrieve the poison the #b#o9300173##k carries to deter the overgrown spine. However, the poison in natural state can't be handled, as it is way too concentrated. Use the #bfountain#k over there to dilute it.";

        case 930000300:
            return "Oh great, you have reached me. We can now proceed further inside the forest.";

        case 930000400:
            return "The #b#o9300175##k took over this area. However they are not ordinary monsters, then regrow pretty fast, #rnormal weapon and magic does no harm to it#k at all. We have to purify all these contaminated monsters, using #b#t2270004##k! Let your group leader get me 20 Monster Marbles from them.";

        case 930000600:
            return "The root of all problems of the forest! Place the obtained Magic Stone on the Altar and prepare yourselves!";

        case 930000700:
            return "This is it, you guys did it! Thank you so much for purifying the forest!!";

    }
}