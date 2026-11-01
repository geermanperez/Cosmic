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
        qm.sendAcceptDecline("¿Seguimos con tu Formación Básica? Antes de aceptar, asegúrese de haber equipado adecuadamente su espada y de que sus habilidades y pociones sean fácilmente accesibles.");
    } else if (status == 1) {
        if (mode == 0) {
            qm.sendNext("¿Aún no estás listo para cazar los #o0100132#? Continúe siempre si y sólo si está completamente preparado. No hay nada peor que participar en batallas sin la preparación suficiente.");
            qm.dispose();
        } else {
            qm.forceStartQuest();
            qm.sendNext("Está bien. Esta vez, vamos a derrotarte.#r#o0100132#s#k, que son ligeramente más potentes que#o0100131#s. Dirígete a#b#m140020100##ky derrota#r15#k de ellos. Eso debería ayudarte a desarrollar tu fuerza. ¡Está bien! ¡Hagamos esto!", 1);
        }
    } else if (status == 2) {
        qm.showInfo("Effect/OnUserEff.img/guideEffect/aranTutorial/tutorialArrow3");
        qm.dispose();
    }
}