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
        qm.sendNext("Muy bien, ya he explicado suficiente por ahora. Pasemos a la siguiente etapa. ¿Cuál es la siguiente etapa, preguntas? Te lo acabo de decir. Entrena tan duro como puedas hasta que seas lo suficientemente fuerte como para derrotar al Mago Negro de un solo golpe.");
    } else if (status == 1) {
        qm.sendNextPrev("Puede que hayas sido un héroe en el pasado, pero eso fue hace cientos de años. Incluso si no fuera por la maldición del Mago Negro, todos esos años que pasaste congelado en el tiempo han endurecido tu cuerpo. Debes relajarte un poco y poco a poco recuperar tu agilidad. ¿Cómo se hace eso?, preguntas.");
    } else if (status == 2) {
        qm.sendAcceptDecline("¿No sabes que primero debes dominar los fundamentos? Así que lo más sensato es empezar con#bEntrenamiento Básico#k. Oh, claro, olvidé que perdiste la memoria. Bueno, por eso estoy aquí. Tendrás que experimentarlo tú mismo. ¿Empezamos?");
    } else if (status == 3) {
        if (mode == 0) {
            qm.sendNext("¿De qué dudas tanto? ¡Eres un héroe! ¡Tienes que golpear mientras el hierro está caliente! ¡Vamos, hagamos esto!");
            qm.dispose();
        } else {
            qm.forceStartQuest();
            qm.sendNext("Puede que la población de Rien esté compuesta principalmente de pingüinos, pero incluso esta isla tiene monstruos. encontraras#o0100131#si vas a#b#m140020000##k, situado en el margen derecho de la localidad. Por favor derrota#r10 de esos#o0100131#s#k. Estoy seguro de que no tendrás problemas para derrotar al#o0100131#Es que incluso los pingüinos más lentos de aquí pueden derrotar.", 1);
        }
    } else if (status == 4) {
        qm.showInfo("Effect/OnUserEff.img/guideEffect/aranTutorial/tutorialArrow3");
        qm.dispose();
    }
}