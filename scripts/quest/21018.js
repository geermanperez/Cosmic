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
        qm.sendNext("Ahora, te someterás a una prueba que determinará si estás en forma o no. Todo lo que tienes que hacer es enfrentarte al monstruo más poderoso de esta isla, #o0100134#s. Unos #r50#k de ellos serían suficientes, pero...");
    } else if (status == 1) {
        qm.sendAcceptDecline("No podemos permitir que elimines a toda la población de #o0100134#, ya que no hay muchos por ahí. ¿Qué tal 5 de ellos? Estás aquí para entrenar, no para destruir el ecosistema.");
    } else if (status == 2) {
        if (mode == 0 && type == 15) {
            qm.sendNext("Oh, ¿5 no son suficientes? Si sientes la necesidad de entrenar más, siéntete libre de matar más que eso. Si los matas a todos, tendré que mirar hacia otro lado aunque me rompa el corazón, ya que habrán sido sacrificados por una buena causa...");
            qm.dispose();
        } else {
            qm.forceStartQuest();
            qm.sendNext("#o0100134#s se pueden encontrar en partes más profundas de la isla. Continúe hacia la izquierda hasta llegar#b#m140010200##ky derrota#r5 #o0100134#s#k.");
        }
    } else if (status == 3) {
        qm.showInfo("Effect/OnUserEff.img/guideEffect/aranTutorial/tutorialArrow1");
        qm.dispose();
    }
}