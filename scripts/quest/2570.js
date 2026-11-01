var status = -1;

function end(mode, type, selection) {
    if (mode == 0 && type == 0) {
        status--;
    } else if (mode == -1) {
        qm.dispose();
        return;
    } else {
        status++;
    }
    if (status == 0) {
        qm.sendNext("Qué bueno verte, #h0#. Entonces... tú eres quien ayudó a Cutter a regresar. Vi que estabas herido cuando llegaste... ¿estás bien ahora? Debes estar hecho de material severo. No es de extrañar que Cutter te tenga en tan gran estima. Mi nombre es Kyrin. Soy el capitán del Nautilus y también el instructor de trabajo para piratas.");
    } else if (status == 1) {
        qm.sendNextPrev("Cutter te dijo que quiere que te conviertas en #bCannoneer#k, ¿verdad? Estoy de acuerdo con él, pero me preocupa que tu corazón no esté en ello. Quizás si supieras más sobre los piratas estarías más interesado. Déjame contarte un poco sobre nosotros.");
    } else if (status == 2) {
        qm.sendNextPrev("Reuní a los piratas para comenzar a trabajar contra el Mago Negro, el gran mal que amenaza a todo Maple World. ¡Resulta que el negocio de los héroes es más rentable que el saqueo y el pillaje!");
    } else if (status == 3) {
        qm.sendNextPrev("Si te conviertes en pirata, podrás ayudar a investigar los complots del mago negro y ayudar en la defensa de Maple World. Ten en cuenta que no te obligaré a hacer nada... Soy principalmente un instructor de trabajo y solo guío a los piratas en un sentido general.");
    } else if (status == 4) {
        qm.sendNextPrev("Pero sé que nos ayudarías a luchar contra el Mago Negro. Tienes ese brillo en tus ojos que tienen todos los héroes. De todos modos, ya he dicho mi parte.");
    } else if (status == 5) {
        qm.sendAcceptDecline("Ahora todo depende de ti. ¿Quieres unirte a los piratas? Me encantaría que te convirtieras en cañonero.");
    } else if (status == 6) {
        if (mode == 0 && qm.isQuestCompleted(2570)) {//decline
            qm.sendNext("Oh. Entonces… ¿quieres ser otra cosa? Lo entiendo... pero es posible que Cutter no...");
            qm.dispose();
        } else {
            if (!qm.isQuestCompleted(2570)) {
                qm.gainItem(1532000);
                qm.gainItem(1002610);
                qm.gainItem(1052095);
                qm.changeJobById(501);
                qm.forceCompleteQuest();
                qm.forceCompleteQuest(29900);
                qm.teachSkill(109, 1, 1, -1);
                qm.teachSkill(110, 0, -1, -1);//? blessing
                qm.teachSkill(111, 1, 1, -1);
                qm.showItemGain(1532000, 1002610, 1052095);
            }
            qm.sendNext("Bueno, ahora eres realmente uno de nosotros. Abre tu ventana de Habilidad y comprueba tus nuevas habilidades de Pirata. También te di algunos SP adicionales para que puedas seguir adelante y mejorar algunas de tus nuevas habilidades. Obtendrás más habilidades en niveles superiores, por lo que te sugiero que tengas un plan para tu entrenamiento.");
        }
    } else if (status == 7) {
        qm.sendNextPrev("Las habilidades por sí solas no te convierten en un gran pirata. ¡También tienes que distribuir tus estadísticas como un pirata! Si esperas convertirte en un cañonero, invierte mucho en STR para poder sostener ese pesado cañón tuyo. Y si no tienes idea, utiliza el#bdistribuir automáticamente#kopción. Sencillo y eficaz.");
    } else if (status == 8) {
        qm.sendNextPrev("Oh, también te di un regalito. Amplié algunos espacios en las pestañas de Equipo y Elementos ETC, ¡así que deberías tener mucho espacio para tu botín!");
    } else if (status == 9) {
        qm.sendNextPrev("Ahora bien, hay una última cosa que debes recordar. Más que nada, necesitas mantener tu HP alto. Si caes en batalla, perderás parte de tu EXP. Y estoy SEGURO que no quieres eso, ¿verdad?");
    } else if (status == 10) {
        qm.sendNextPrev("Bueno, ¡eso es todo! Te he enseñado todo lo que necesitas saber. También te di algunas armas decentes, así que úsalas bien. ¡Ahora, avanza, hazte más fuerte y patea a los secuaces del Mago Negro, si tienes la oportunidad!");
        qm.forceStartQuest(2945, "1");
    } else if (status == 11) {
        qm.dispose();//let them go back :P
    }
}