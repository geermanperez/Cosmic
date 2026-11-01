var status = -1;

function start(mode, type, selection) {
    if (mode == 0 && type == 0) {
        status--;
    } else if (mode == -1) {
        qm.dispose();
        return;
    } else {
        status++;
    }
    if (status == 0) {
        qm.sendNext("¡Lo sabía! ¡Sabía que estábamos conectados, maestro! Cuando tú te vuelves más fuerte, yo también me hago más fuerte. ¡Y cuando me haga más fuerte, podrás usar mi fuerza! Ese es nuestro pacto. ¡Sabía que elegí un buen maestro!");
    } else if (status == 1) {
        qm.sendNextPrev("#bI veo. ¿Cómo terminamos en este pacto de todos modos?", 2);
    } else if (status == 2) {
        qm.sendNextPrev("No sé. Yo era sólo un huevo. Realmente no puedo recordarlo... aunque recuerdo vagamente que usted, maestro, caminaba hacia mí en un bosque brumoso. Recuerdo tu sorpresa al verme. Y yo te estaba llamando a cambio.");
    } else if (status == 3) {
        qm.sendNextPrev("#b#b(¡Espera! Eso suena igual que ese sueño que tuviste... ¿Se conocieron ustedes dos en un sueño? ¿Es posible que el Dragón gigante que viste en ese sueño fuera...#p1013000#?)", 2);
    } else if (status == 4) {
        qm.sendNextPrev("Maestro, usted y yo somos uno en espíritu. Lo supe en el momento en que te vi. Por eso quería hacer el pacto contigo. Nadie más. Tenías que pagar el precio que yo puse, por supuesto.");
    } else if (status == 5) {
        qm.sendNextPrev("¿#bI pagó un precio?", 2);
    } else if (status == 6) {
        qm.sendNextPrev("¿No te acuerdas? ¿Cuándo me reconociste y me tocaste? Esa fue la única condición que puse. En el momento en que tocaste mi huevo, tú y yo nos volvimos uno en espíritu.");
    } else if (status == 7) {
        qm.sendNextPrev("#bUno en... ¿espíritu?", 2);
    } else if (status == 8) {
        qm.sendNextPrev("¡Sí! ¡El Pacto Espiritual! Tú y yo tenemos cuerpos separados, pero compartimos un mismo espíritu. ¡Por eso tú te vuelves más fuerte cuando yo me hago más fuerte, y viceversa! Impresionante, ¿verdad? Al menos eso creo.");
    } else if (status == 9) {
        qm.sendNextPrev("#bNo tengo idea de qué estás hablando, pero parece algo bastante importante.", 2);
    } else if (status == 10) {
        qm.sendNextPrev("¡Por supuesto que es gran cosa, maestro tonto! Nunca más tendrás que preocuparte por los monstruos. ¡Me tienes para protegerte ahora! Adelante, ponme a prueba. De hecho, ¡vámonos ahora mismo!");
    } else if (status == 11) {
        qm.sendNextPrev("#bPero aquí hay paz. No hay monstruos peligrosos alrededor.", 2);
    } else if (status == 12) {
        qm.sendNextPrev("¡¿QUÉ?! ¡Eso no es divertido! ¿No le gustan las aventuras, maestro? ¿Luchar contra monstruos en nombre de tu pueblo, derrotar al mal, rescatar a inocentes y todo eso? ¿No te gustan ese tipo de cosas?");
    } else if (status == 13) {
        qm.sendNextPrev("#bNo forma parte de mi plan quinquenal. Sólo estoy bromeando, pero en serio, soy hijo de un granjero...", 2);
    } else if (status == 14) {
        qm.sendAcceptDecline("Bah, pues déjame decirte esto. Es imposible que un Maestro Dragón viva una vida pacífica. Tendré muchas oportunidades de demostrar mis habilidades. Créame, nuestra vida será una gran aventura. Prométeme que te quedarás conmigo, ¿vale?\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 810 exp.");
    } else if (status == 15) {
        if (mode == 0) {
            qm.sendNext("Uh, estás bromeando, ¿verdad? ¡Dime que se te resbaló el dedo! Adelante, acepta la misión.");
        } else {
            if (!qm.isQuestCompleted(22507)) {
                qm.forceCompleteQuest();
                qm.gainExp(810);
            }
            qm.sendNext("Jejeje, está bien entonces, maestro. ¡Vamos a ello!");
        }
    } else if (status == 16) {
        qm.sendNextPrev("#b(Estás un poco confundido, pero ahora estás viajando con Mir el Dragón. Tal vez vayan juntos a una aventura, como él dijo.)", 2);
    } else if (status == 17) {
        qm.sendPrev("#b#b(Aún tienes un recado que hacer. Tu papá necesita hablar contigo, así que ve a verlo ahora).");
    } else if (status == 18) {
        qm.dispose();
    }
}