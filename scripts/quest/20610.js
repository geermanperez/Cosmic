/*
 * Cygnus Skill -
 */

var status = -1;

function start(mode, type, selection) {
    status++;

    if (status == 0) {
        qm.sendAcceptDecline("¿Has estado dominando tus habilidades? Estoy seguro de que dominas todas tus habilidades, lo que significa... que es hora de que aprendas un#bnueva habilidad#k, ¿bien?");
    } else if (status == 1) {
        if (mode == 0) {
            qm.sendOk("Bueno, lo que estás haciendo ahora no te hace parecer alguien humilde. Simplemente pareces complaciente al hacer eso, y eso nunca es algo bueno.");
        } else {
            qm.forceStartQuest();
            qm.dispose();
        }
    } else if (status == 2) {
        qm.dispose();
    }
}

function end(mode, type, selection) {
    qm.dispose();
}