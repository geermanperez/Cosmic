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
        qm.sendNext("Puaj. Esto no va a funcionar. Necesito algo más. Sin plantas. Sin carne. ¿Qué, no tienes idea? Pero tú eres el maestro y también eres mayor que yo. ¡Debes saber lo que sería bueno para mí!");
    } else if (status == 1) {
        qm.sendNextPrev("#bPero no lo hago. No es que la edad tenga nada que ver con esto...", 2);
    } else if (status == 2) {
        qm.sendAcceptDecline("Como eres mayor, también debes tener más experiencia en el mundo. Tiene sentido que sepas más que yo. Ah, bien. ¡Le preguntaré a alguien incluso mayor que usted, maestro!");
    } else if (status == 3) {
        if (mode == 0) {
            qm.sendNext("No sirve de nada tratar de encontrar una respuesta a esto por mi cuenta. Será mejor que busque#balguien mayor y más sabio que el maestro#k!");
        } else {
            qm.forceStartQuest();
            qm.sendNext("#b#b(Ya le preguntaste a papá una vez, pero no tienes mejores ideas. ¡Es hora de preguntarle de nuevo!)");
        }
    } else if (status == 4) {
        qm.dispose();
    }
}