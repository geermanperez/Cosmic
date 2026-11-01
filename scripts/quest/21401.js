var status = -1;

function start(mode, type, selection) {
    status++;
    if (mode == 0 && type == 0) {
        status -= 2;
    } else if (mode != 1) {
        //if (mode == 0)
        qm.sendNext("#b(Necesitas pensar en esto por un segundo...)#k");
        qm.dispose();
        return;
    }

    if (status == 0) {
        qm.sendNext("¿Por qué me veo así, preguntas? No quiero hablar de eso, pero supongo que no puedo esconderme de ti ya que eres mi maestro.");
    } else if (status == 1) {
        qm.sendNextPrev("Mientras tú estuviste atrapado dentro del hielo durante cientos de años, yo también estuve congelado. Fue mucho tiempo estar lejos de ti. Fue entonces cuando la semilla de la oscuridad fue plantada en mi corazón.");
    } else if (status == 2) {
        qm.sendNextPrev("Pero desde que despertaste, pensé que la oscuridad se había ido. Pensé que las cosas volverían a ser como antes. Pero me equivoqué...");
    } else if (status == 3) {
        qm.sendAcceptDecline("Por favor, Arán. Por favor, evita que me enoje. Sólo tú puedes controlarme. Se me está yendo de las manos ahora. Por favor haz lo que sea necesario para#revita que me vuelva loco#k!");
    } else if (status == 4) {
        var em = qm.getEventManager("MahaBattle");
        if (!em.startInstance(qm.getPlayer())) {
            qm.sendOk("Actualmente hay alguien en este mapa, vuelve más tarde.");
        } else {
            qm.startQuest();
        }

        qm.dispose();
    }
}

function end(mode, type, selection) {
    status++;
    if (mode == 0 && type == 0) {
        status -= 2;
    } else if (mode != 1) {
        //if (mode == 0)
        qm.sendNext("#b(Necesitas pensar en esto por un segundo...)#k");
        qm.dispose();
        return;
    }

    if (status == 0) {
        qm.sendNext("Gracias Aran. Si no fuera por ti me habría enfurecido y quién sabe qué podría haber pasado. ¡Gracias, NO! Es sólo tu deber como mi maestro...");
    } else if (status == 1) {
        qm.sendYesNo("De todos modos, acabo de darme cuenta del alto nivel que has alcanzado. Si pudiste controlarme en mi estado de ira, creo que estás listo para manejar más habilidades.");
    } else if (status == 2) {
        if (!qm.isQuestCompleted(21401)) {
            if (!qm.canHold(1142132)) {
                qm.sendOk("Vaya, su inventario #bequip#k está lleno. Necesito que hagas al menos 1 espacio vacío para completar esta misión.");
                qm.dispose();
                return;
            }
            if (!qm.canHold(2280003, 1)) {
                qm.sendOk("Oye, tu inventario #buse#k está lleno. Necesito que hagas al menos 1 espacio vacío para completar esta misión.");
                qm.dispose();
                return;
            }

            qm.gainItem(1142132, true);
            qm.gainItem(2280003, 1);
            qm.changeJobById(2112);

            qm.completeQuest();
        }
        qm.sendNext("Tus habilidades han sido restauradas. Esas habilidades han estado inactivas durante tanto tiempo que tendrás que volver a entrenarte, pero estarás como nuevo una vez que completes tu entrenamiento.");
    } else if (status == 3) {
        qm.dispose();
    }
}

function spawnMob(x, y, id, map) {
    if (map.getMonsterById(id) != null) {
        return;
    }

    const LifeFactory = Java.type('server.life.LifeFactory');
    const Point = Java.type('java.awt.Point');
    var mob = LifeFactory.getMonster(id);
    map.spawnMonsterOnGroundBelow(mob, new Point(x, y));
}