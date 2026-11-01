var status = -1;
var level = 1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (cm.getPlayer().getMapId() == 925100700) {
        cm.warp(251010404, 0);
        cm.dispose();
        return;
    }

    if (status == 1) {   // leaders cant withdraw
        cm.warp(251010404, 0);
        return;
    }

    if (!cm.isEventLeader()) {
        // Player chose "No" or "End Chat"
        if (mode <= 0) {
            cm.dispose();
        } else {
            cm.sendYesNo("Deseo que su líder hable conmigo. Alternativamente, es posible que desee dejar de fumar. ¿Vas a abandonar esta campaña?");
        }
    } else {
        var eim = cm.getEventInstance();
        if (eim == null) {
            cm.warp(251010404, 0);
            cm.sendNext("¿Cómo estás aquí sin estar registrado en una instancia?");
            cm.dispose();
            return;
        }

        level = eim.getProperty("level");

        switch (cm.getPlayer().getMapId()) {
            case 925100000:
                cm.sendNext("¡Nos dirigimos al Barco Pirata ahora! Para poder entrar, deberemos destruir a todos los monstruos que lo custodian.");
                cm.dispose();
                break;
            case 925100100:
                var emp = eim.getProperty("stage2");
                if (emp === "0") {
                    if (cm.haveItem(4001120, 20)) {
                        cm.sendNext("¡Excelente! Ahora búscame 20 medallas ascendentes.");
                        cm.gainItem(4001120, -20);
                        cm.getMap().killAllMonsters();
                        eim.setProperty("stage2", "1");
                    } else {
                        cm.sendNext("¡Nos dirigimos al Barco Pirata ahora! Para entrar debemos calificarnos como nobles piratas. Cazame 20 medallas de novato.");
                    }
                } else if (emp === "1") {
                    if (cm.haveItem(4001121, 20)) {
                        cm.sendNext("¡Excelente! Ahora búscame 20 medallas de veterano.");
                        cm.gainItem(4001121, -20);
                        cm.getMap().killAllMonsters();
                        eim.setProperty("stage2", "2");
                    } else {
                        cm.sendNext("¡Nos dirigimos al Barco Pirata ahora! Para entrar debemos calificarnos como nobles piratas. Cazame 20 medallas ascendentes.");
                    }
                } else if (emp === "2") {
                    if (cm.haveItem(4001122, 20)) {
                        cm.sendNext("¡Excelente! Ahora vámonos.");
                        cm.gainItem(4001122, -20);
                        cm.getMap().killAllMonsters();
                        eim.setProperty("stage2", "3");
                        eim.showClearEffect(cm.getMapId());
                    } else {
                        cm.sendNext("¡Nos dirigimos al Barco Pirata ahora! Para entrar debemos calificarnos como nobles piratas. Búscame 20 medallas de veterano.");
                    }
                } else {
                    cm.sendNext("Se ha abierto la siguiente etapa. ¡IR!");
                }
                cm.dispose();
                break;
            case 925100200:
            case 925100300:
                cm.sendNext("Para asaltar el barco pirata, primero debemos destruir a los guardias.");
                cm.dispose();
                break;
            case 925100201:
                if (cm.getMap().getMonsters().size() == 0) {
                    cm.sendNext("¡Ha aparecido el cofre del Señor Pirata! Si tienes una llave, déjala caer junto al cofre para revelar sus tesoros. Eso seguramente lo enojará.");
                    if (eim.getProperty("stage2a") == "0") {
                        cm.getMap().setReactorState();
                        eim.setProperty("stage2a", "1");
                    }
                } else {
                    cm.sendNext("Estas campanillas están escondidas. Debemos liberarlos.");
                }
                cm.dispose();
                break;
            case 925100301:
                if (cm.getMap().getMonsters().size() == 0) {
                    cm.sendNext("¡Ha aparecido el cofre del Señor Pirata! Si tienes una llave, déjala caer junto al cofre para revelar sus tesoros. Eso seguramente lo enojará.");
                    if (eim.getProperty("stage3a") === "0") {
                        cm.getMap().setReactorState();
                        eim.setProperty("stage3a", "1");
                    }
                } else {
                    cm.sendNext("Estas campanillas están escondidas. Debemos liberarlos.");
                }
                cm.dispose();
                break;
            case 925100202:
            case 925100302:
                cm.sendNext("Estos son los Capitanes y Krus que dedican sus vidas al Señor Pirata. Mátalos como mejor te parezca.");
                cm.dispose();
                break;
            case 925100400:
                cm.sendNext("Éstas son las fuentes de energía del barco. ¡Debemos sellarlo usando las Viejas Llaves de Metal en las puertas!");
                cm.dispose();
                break;
            case 925100500:
                if (cm.getMap().getMonsters().size() == 0) {
                    cm.sendNext("¡Gracias por salvar a nuestro líder! Estamos en deuda contigo.");
                } else {
                    cm.sendNext("¡Derrota a todos los monstruos! ¡Incluso los secuaces de Lord Pirate!");
                }
                cm.dispose();
                break;
        }
    }


}