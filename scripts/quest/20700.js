/*
        NPC Name:               Nineheart
        Description:            Quest - Are you sure you can leave?
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1 || mode == 0 && type > 0) {
        qm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        if (status == 1) {
            qm.sendNext("¿Cuándo te darás cuenta de lo débil que eres... cuando te metas en problemas en la Isla Victoria?");
            qm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        qm.sendNext("Finalmente te has convertido en un Caballero en Entrenamiento. Me gustaría darte una misión de inmediato, pero todavía pareces estar a kilómetros de distancia de poder realizar una tarea por tu cuenta. ¿Estás seguro de que puedes ir a la Isla Victoria así?");
    } else if (status == 1) {
        qm.sendAcceptDecline("Depende de ti dirigirte a la Isla Victoria, pero un Caballero en Entrenamiento que no pueda cuidar de sí mismo en las batallas probablemente dañará la impecable reputación de la Emperatriz. Como jefe táctico de esta isla, no puedo permitir que eso suceda, punto. Quiero que sigas entrenando hasta que llegue el momento adecuado.");
    } else if (status == 2) {
        qm.forceCompleteQuest();
        qm.sendNext("#p1102000#, el instructor de entrenamiento, te ayudará a convertirte en un caballero útil. Una vez que alcances el nivel 13, te asignaré una misión o dos. Así que hasta entonces, sigue entrenando.");
    } else if (status == 3) {
        qm.sendPrev("Ah, ¿y eres consciente de que si entablas una conversación con #p1101001#, ella te dará una bendición? La bendición definitivamente te ayudará en tu viaje.");
    } else if (status == 4) {
        qm.dispose();
    }
}

function end(mode, type, selection) {
    qm.dispose();
}