var status = -1;

function start(mode, type, selection) {
    if (mode == -1 || mode == 0 && type > 0) {
        qm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        if (status == 6) {
            qm.sendNext("Sé que se necesita una increíble cantidad de fuerza y ​​voluntad para superar a tu instructor, pero no estabas destinado a dejarte marchitar. ¡Debes pasar a cosas más grandes y mejores! ¡Debes hacer todo lo que puedas para abrazar tu naturaleza heroica!");
            qm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        qm.sendNext("Tus habilidades realmente están comenzando a tomar forma. Me sorprende que un anciano como yo haya podido ayudarte. Estoy llorando sólo de pensar en lo feliz que me hace haberte ayudado. *Olfateo olfateo*");
    } else if (status == 1) {
        qm.sendNextPrev("#b(Ni siquiera entrenaste tanto tiempo con él... ¿Por qué llora?)#k", 2);
    } else if (status == 2) {
        qm.sendNextPrev("Muy bien, aquí está la tercera y última etapa del entrenamiento. Tu último oponente es...#r#o9300343#s#k! ¿Sabes algo sobre#o1210100#¿s?");
    } else if (status == 3) {
        qm.sendNextPrev('Bueno, un poquito...', 2);
    } else if (status == 4) {
        qm.sendNextPrev("¡Son guerreros naturales! Nacen con un apetito voraz por la comida. Devoran cualquier alimento que sea visible en el momento en que pasan. Aterrador, ¿no?");
    } else if (status == 5) {
        qm.sendNextPrev("#b(¿Es eso realmente cierto?)#k", 2);
    } else if (status == 6) {
        qm.sendAcceptDecline("Bien, ahora...#bIngresa nuevamente al Centro de Capacitación#k, fracaso#r30#k#o9300343#s, ¡y muéstrame de qué estás hecho! ¡Tendrás que emplear toda tu energía para derrotarlos! ¡Ve! Ve! Ve! ¡Levántate por encima de mí!");
    } else if (status == 7) {
        qm.forceStartQuest();
        qm.sendOk("¡Ahora ve y enfréntate a esos monstruosos #o9300343#!");
    } else if (status == 8) {
        qm.dispose();
    }
}

function end(mode, type, selection) {
    if (mode == -1 || mode == 0 && type > 0) {
        qm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        if (status == 2) {
            qm.sendNext("¿Eres reacio a dejar a tu instructor? *Sniff sniff* Estoy muy conmovido, pero no puedes detenerte aquí. ¡Estás destinado a cosas más grandes y mejores!");
            qm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        qm.sendNext("Ah, has regresado después de derrotar a los 30 #o9300343#. Sabía que lo tenías dentro... Aunque no tienes recuerdos y tienes pocas habilidades, ¡pude ver que eras diferente! ¿Cómo? ¡Porque llevas un arma de asta, obviamente!");
    } else if (status == 1) {
        qm.sendNextPrev("#b(¿Te está tomando el pelo?)#k'", 2);
    } else if (status == 2) {
        qm.sendYesNo("No tengo nada más que enseñarte, ya que has superado mi nivel de habilidad. ¡Vete ahora! ¡No mires atrás! Este anciano está feliz de haber sido su instructor.");
    } else if (status == 3) {
        if (qm.isQuestStarted(21703)) {
            qm.forceCompleteQuest();
            qm.teachSkill(21000000, qm.getPlayer().getSkillLevel(21000000), 10, -1);   // Combo Ability Skill
            qm.gainExp(2800);
        }
        qm.sendNext("(Recordaste el#bHabilidad combinada#k¡habilidad! Al principio te mostraste escéptico sobre el entrenamiento, ya que el anciano sufre de Alzheimer y todo eso, pero ¡vaya, fue efectivo!)", 2);
    } else if (status == 4) {
        qm.sendPrev("Ahora informe a #p1201000#. ¡Sé que estará encantada cuando vea el progreso que has logrado!");
    } else if (status == 5) {
        qm.dispose();
    }
}