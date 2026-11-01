var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.sendNext("¡Vaya, vaya! ¿Realmente estás rechazando mi oferta? Bueno, podrás#bsubir de nivel más rápido#kcon nuestra ayuda, así que avíseme si cambia de opinión. Incluso si has rechazado una misión, puedes recibirla nuevamente si vienes y hablas conmigo.");
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.sendNext("¡Vaya, vaya! ¿Realmente estás rechazando mi oferta? Bueno, podrás#bsubir de nivel más rápido#kcon nuestra ayuda, así que avíseme si cambia de opinión. Incluso si has rechazado una misión, puedes recibirla nuevamente si vienes y hablas conmigo.");
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            qm.sendNext("¡Bienvenidos a Ereve! ¿Y tú lo eres? Oh, tu eres#b#h ##k! \r\nEncantado de conocerte. He estado esperando. Has venido para convertirte en un Caballero Cygnus, ¿verdad? Mi nombre es Kimu y actualmente guío a nobles como tú a petición de la emperatriz Cygnus.");
        } else if (status == 1) {
            qm.sendNextPrev("Si quieres formar parte oficialmente de Cygnus Knights, primero debes conocer a la Emperatriz. Ella está en el centro de esta isla, acompañada por Shinsoo. A mis hermanos y a mí nos gustaría compartir con ustedes algunas cosas que se consideran#bConocimientos básicos#ken Maple World antes de irte. ¿Estaría bien?");
        } else if (status == 2) {
            qm.sendNextPrev("Oh, déjame advertirte que esto es una Búsqueda. Es posible que hayas notado que los NPC de Maple World ocasionalmente te piden varios favores. Un favor de ese tipo se llama #bQuest#k. Recibirás artículos de recompensa o EXP al completar misiones, por lo que te sugiero encarecidamente que cumplas diligentemente con los favores de los NPC de Maple.");
        } else if (status == 3) {
            qm.sendAcceptDecline("¿Le gustaría conocer a #bKizan#k, quién puede informarle sobre la caza? Puedes encontrar a Kizan siguiendo la flecha hacia la izquierda.");
        } else if (status == 4) {
            qm.forceStartQuest();
            qm.guideHint(2);
            qm.dispose();
        }
    }
}

function end(mode, type, selection) {
    status++;
    if (mode != 1) {
        qm.dispose();
    } else {
        if (status == 0) {
            qm.sendOk("¿Eres la Noblesse que envió mi hermano Kimu? ¡Encantado de conocerlo! Soy Kizan. Te daré la recompensa que Kimu me pidió que te diera. Recuerda que puedes consultar tu Inventario presionando el botón#byo clave#k. Las pociones rojas te ayudan a recuperar HP y las azules te ayudan a recuperar MP. Es una buena idea aprender a usarlos de antemano para estar preparado cuando esté en peligro.\r\n\r\n#fUI/UIWindow.img/Quest/reward#\r\n\r\n#v2000020# #z2000020# \r\n#v2000021# #z2000021# \r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0#15 exp");
        } else if (status == 1) {
            if (qm.canHold(2000022) && qm.canHold(2000023)) {
                if (!qm.isQuestCompleted(21010)) {
                    qm.gainItem(2000020, 5);
                    qm.gainItem(2000021, 5);
                    qm.gainExp(15);
                }
                qm.guideHint(3);
                qm.forceCompleteQuest();
            } else {
                qm.dropMessage(1, "Tu inventario está lleno");
            }

            qm.dispose();
        }
    }
}