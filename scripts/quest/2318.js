/* ===========================================================
        @author Resonance
	NPC Name: 		Scarrs
	Map(s): 		Mushroom Castle: Corner of Mushroom Forest(106020000)
	Description: 	Quest -  Killer Mushroom Spores(2)
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
            qm.sendOk("Entiendo que no es una tarea fácil, pero no puedo lograrlo.#bEsporas de hongos asesinos#ksin ellos. Por favor reconsidere.");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("Hmmm... Investigué cómo se fabricaban las esporas mientras recogías las cápsulas de hongos venenosos y me di cuenta de que necesitaremos más materiales para ello. Quiero que recojas un conjunto más de artículos. ¿Puedes hacerlo?");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.sendOk("Bien, quiero que derrotes a las Regenade Spores y traigas de vuelta#b50 esporas mutadas#ken cambio.");
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
        qm.sendOk("¿Reuniste todos los ingredientes necesarios para ello?")
    } else if (status == 1) {
        if (!qm.haveItem(4000499, 50)) {
            qm.sendOk("Primero reúna todos los ingredientes.");
            status = 2;
            return;
        }

        qm.sendNext("Estos deberían ser suficientes para mí para hacer el#bEsporas de hongos asesinos.#kPor favor espera un momento.");
    } else if (status == 2) {
        qm.sendOk("Bien, aquí están las esporas del hongo asesino. Con suerte, esto será suficiente para que salves a nuestra princesa y ayudes a recuperar nuestro reino. ¡Buena suerte!");
    } else if (status == 3) {
        qm.forceCompleteQuest();
        qm.gainExp(11500);
        qm.gainItem(4000499, -50);
        qm.gainItem(2430014, 1);
        qm.dispose();
    }
}
	