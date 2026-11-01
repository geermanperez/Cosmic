/*
  Growlie (that fatass uhh.. hungry lion or whatever)

  @author FightDesign (RageZONE)
  @author Ronan
  */

var status = 0;
var chosen = -1;

function clearStage(stage, eim) {
    eim.setProperty(stage + "stageclear", "true");
    eim.showClearEffect(true);

    eim.giveEventPlayersStageReward(stage);
}

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 0) {
        cm.dispose();

    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 0) {
            status += ((chosen == 2) ? 1 : -1);
        } else {
            status++;
        }

        if (status == 0) {
            if (cm.isEventLeader()) {
                cm.sendSimple("¡Gruñido! Soy Growlie, siempre lista para proteger este lugar. ¿Qué te trajo aquí?\r\n#b#L0#Por favor dime de qué se trata este lugar.#l\r\n#L1#he traído#t4001101#.#l\r\n#L2#Me gustaría dejar este lugar.#l");
            } else {
                cm.sendSimple("¡Gruñido! Soy Growlie, siempre lista para proteger este lugar. ¿Qué te trajo aquí?\r\n#b#L0#Por favor dime de qué se trata este lugar.#l\r\n#L2#Me gustaría dejar este lugar.#l");
            }
        } else if (status == 1) {
            if (chosen == -1) {
                chosen = selection;
            }
            if (chosen == 0) {
                cm.sendNext("Este lugar puede describirse mejor como el lugar privilegiado donde puedes probar los deliciosos pasteles de arroz hechos por Moon Bunny cada luna llena.");
            } else if (chosen == 1) {
                if (cm.haveItem(4001101, 10)) {
                    cm.sendNext("Oh... ¿este pastel de arroz no lo hizo Moon Bunny? Por favor, pásame el pastel de arroz. Mmmm... estos me parecen deliciosos. Por favor ven a verme la próxima vez para más#b#t4001101##k. ¡Que tengas un buen viaje a casa!");
                } else {
                    cm.sendOk("Te aconsejo que compruebes y te asegures de que efectivamente has recogido#b10 #t4001101#s#k.");
                    cm.dispose();
                }
            } else if (chosen == 2) {
                cm.sendYesNo("¿Estás seguro de que quieres irte?");
            } else {
                cm.dispose();

            }
        } else if (status == 2) {
            if (chosen == 0) {
                cm.sendNextPrev("Reúna las semillas de prímula de las hojas de prímula de toda esta área y plántelas al pie cerca de la luna creciente para ver florecer la prímula. Hay 6 tipos de prímulas y todas ellas requieren bases diferentes. Es imperativo que la base se ajuste a la semilla de la flor.");
            } else if (chosen == 1) {
                cm.gainItem(4001101, -10);

                var eim = cm.getEventInstance();
                clearStage(1, eim);

                var map = eim.getMapInstance(cm.getPlayer().getMapId());
                map.killAllMonstersNotFriendly();

                eim.clearPQ();
                cm.dispose();
            } else {
                if (mode == 1) {
                    cm.warp(910010300);
                } else {
                    cm.sendOk("Entonces será mejor que me recojas unos deliciosos pasteles de arroz, porque el tiempo se acaba, ¡Gruñido!");
                }
                cm.dispose();
            }
        } else if (status == 3) {
            if (chosen == 0) {
                cm.sendNextPrev("Cuando las flores de prímula florezcan, saldrá la luna llena, y será entonces cuando aparecerán los Conejitos Lunares y empezarán a golpear el molino. Tu tarea es luchar contra los monstruos para asegurarte de que Moon Bunny pueda concentrarse en hacer el mejor pastel de arroz posible.");
            }
        } else if (status == 4) {
            if (chosen == 0) {
                cm.sendNextPrev("Me gustaría que usted y los miembros de su grupo cooperaran y me consiguieran 10 pasteles de arroz. Te recomiendo encarecidamente que me consigas los pasteles de arroz dentro del tiempo asignado.");
            }
        } else {
            cm.dispose();
        }
    }
}