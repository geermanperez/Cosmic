/* ===========================================================
        @author Resonance
	NPC Name: 		Scarrs
	Map(s): 		Mushroom Castle: Corner of Mushroom Forest(106020000)
	Description: 	Quest -  Killer Mushroom Spores(3)
=============================================================
Version 1.0 - Script Done.(18/7/2010)
=============================================================
*/

var status = -1;

function start(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 1 && mode == 0) {
            status -= 2;
        } else {
            qm.sendOk("Sé que no es una tarea difícil, así que vuelve conmigo si estás listo.");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("¡Oh, casi lo olvido! ¿Qué estaba pensando? Necesito que me entregues esto#bMuestra de esporas de hongo asesino#ka#bMinistro de Magia#ky reportar los resultados.");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.gainItem(4032389, 1);
        qm.sendOk("El#bMinistro de Magia#kme dijo una vez el#bEsporas de hongos asesinos#kestá completo, que él también querrá una muestra. Te daré la muestra; Ahora ve, por favor entrégalo a nuestro#bMinistro de Magia.#k");
    } else if (status == 2) {
        qm.dispose();
    }
}

function end(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 1 && mode == 0) {
            status -= 2;
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendOk("son los#bEsporas de hongos asesinos#kfinalmente completado?");
    } else if (status == 1) {
        qm.forceCompleteQuest();
        qm.gainExp(4200);
        qm.gainItem(4032389, -1);
        qm.sendOk("Bien, entonces este es el#bEsporas de hongos asesinos.#kGracias, gracias y por favor dímelo.#bScarrs#k lo mismo.");
    } else if (status == 2) {
        qm.dispose();
    }
}
	