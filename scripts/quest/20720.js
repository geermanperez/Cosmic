/*
	QUEST: Before the Mission in Perion Begins
	NPC: Neinheart
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status == 0)) {
        qm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }

    if (status == 0) {
        qm.sendAcceptDecline("¿Cómo va la subida de nivel hasta ahora? En este momento, es posible que puedas participar en Party Quest en #m103000000#. Subir de nivel es importante, sí, pero necesitamos que ahora asumas una misión como Cygnus Knight. Acabamos de recibir una nueva información que puede ayudarnos.");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.dispose();
    }
}

function end(mode, type, selection) {}