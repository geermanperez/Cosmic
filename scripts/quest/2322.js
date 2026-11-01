/* ===========================================================
        @author Resonance
	NPC Name: 		Minister of Home Affairs
	Map(s): 		Mushroom Castle: Corner of Mushroom Forest(106020000)
	Description: 	Quest -  Over the Castle Wall (2)
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
            qm.sendNext("¿En realidad? ¿Hay otra forma de entrar al castillo? Si no conoces ninguno, entonces ven a verme.");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendYesNo("Como te dije, simplemente romper la barrera no puede ser motivo de celebración. Esto se debe a que nuestro castillo para el Reino Champiñón niega por completo la entrada a cualquier persona fuera de nuestro reino, por lo que será difícil para ti hacerlo. Hmmm... para encontrar una manera de entrar, ¿puedes... investigar primero los muros exteriores del castillo?");
    } else if (status == 1) {
        qm.sendNext("Pase por el bosque de hongos y cuando llegue al#bCamino dividido de elección#k, simplemente camina hacia el castillo. Buena suerte.");
    } else if (status == 2) {
        //qm.forceStartQuest();
        //qm.forceStartQuest(2322, "1");
        qm.gainExp(11000);
        qm.sendOk("Buen trabajo navegando por la zona.");
        qm.forceCompleteQuest();
    } else if (status == 3) {
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
        qm.sendOk("Hmmm ya veo... así que han cerrado completamente la entrada y todo.");
    } else if (status == 1) {
        qm.forceCompleteQuest();
        qm.gainExp(11000);
        qm.sendOk("Buen trabajo navegando por la zona.");
    } else if (status == 2) {
        qm.dispose();
    }
}
	