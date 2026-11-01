var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    var eim = cm.getEventInstance();
    if (eim != null && eim.getIntProperty("glpq6") == 3) {
        cm.sendOk("... Bien jugado. Superaste a los Maestros Retorcidos. Pasa por esa puerta para recibir tus premios.");
        cm.dispose();
        return;
    }

    if (!cm.isEventLeader()) {
        cm.sendNext("Deseo que su líder hable conmigo.");
        cm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        status--;
    }

    if (eim != null) {
        if (eim.getIntProperty("glpq6") == 0) {
            if (status == 0) {
                cm.sendNext("Bienvenido al Torreón de los Maestros Retorcidos. Seré tu anfitrión esta noche...");
            } else if (status == 1) {
                cm.sendNext("Esta noche, tenemos un festín de un escuadrón de Maplers... ajaja...");
            } else if (status == 2) {
                cm.sendNext("¡Deja que nuestros Maestros Guardianes especialmente capacitados te escolten!");
                cm.mapMessage(6, "Engarde! Master Guardians approach!");
                for (var i = 0; i < 10; i++) {
                    var mob = eim.getMonster(9400594);
                    const xPos = Math.floor(-1337 + (Math.random() * 1337))
                    cm.getMap().spawnMonsterOnGroundBelow(mob, new java.awt.Point(xPos, 276));
                }
                for (var i = 0; i < 20; i++) {
                    var mob = eim.getMonster(9400582);
                    const xPos = Math.floor(-1337 + (Math.random() * 1337))
                    cm.getMap().spawnMonsterOnGroundBelow(mob, new java.awt.Point(xPos, 276));
                }
                eim.setIntProperty("glpq6", 1);
                cm.dispose();
            }
        } else if (eim.getIntProperty("glpq6") == 1) {
            if (cm.getMap().countMonsters() == 0) {
                if (status == 0) {
                    cm.sendOk("Eh. ¿Qué es esto? ¿Los has derrotado?");
                } else if (status == 1) {
                    cm.sendNext("Bueno, ¡no importa! Los Twisted Masters estarán encantados de darte la bienvenida.");
                    cm.mapMessage(6, "Twisted Masters approach!");

                    //Margana
                    var mob = eim.getMonster(9400590);
                    cm.getMap().spawnMonsterOnGroundBelow(mob, new java.awt.Point(-22, 1));

                    //Red Nirg
                    var mob2 = eim.getMonster(9400591);
                    cm.getMap().spawnMonsterOnGroundBelow(mob2, new java.awt.Point(-22, 276));

                    //Hsalf
                    var mob4 = eim.getMonster(9400593);
                    cm.getMap().spawnMonsterOnGroundBelow(mob4, new java.awt.Point(496, 276));

                    //Rellik
                    var mob3 = eim.getMonster(9400592);
                    cm.getMap().spawnMonsterOnGroundBelow(mob3, new java.awt.Point(-496, 276));

                    eim.setIntProperty("glpq6", 2);
                    cm.dispose();
                }
            } else {
                cm.sendOk("No me hagas caso. ¡Los Maestros Guardianes te escoltarán!");
                cm.dispose();
            }
        } else if (eim.getIntProperty("glpq6") == 2) {
            if (cm.getMap().countMonsters() == 0) {
                cm.sendOk("¿QUÉ? Uf... esto no puede estar pasando.");
                cm.mapMessage(5, "The portal to the next stage has opened!");
                eim.setIntProperty("glpq6", 3);

                eim.showClearEffect(true);
                eim.giveEventPlayersStageReward(6);

                eim.clearPQ();
                cm.dispose();
            } else {
                cm.sendOk("No me hagas caso. ¡Los Maestros Retorcidos te acompañarán!");
                cm.dispose();
            }
        } else {
            cm.sendOk("... Bien jugado. Superaste a los Maestros Retorcidos. Pasa por esa puerta para recibir tus premios.");
            cm.dispose();
        }
    } else {
        cm.dispose();
    }
}