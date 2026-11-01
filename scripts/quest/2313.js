/* ===========================================================
        @author Resonance
	NPC Name: 		Head Patrol Officer
	Map(s): 		Mushroom Castle: Corner of Mushroom Forest(106020000)
	Description: 	Quest -  The Story Behind the Case
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
            qm.sendOk("No hay mucho tiempo. Por favor, date prisa.");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("Le he dicho a nuestro#bMinistro del Interior#kde tus habilidades. Por favor, vaya a visitarlo inmediatamente.");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.sendOk("¡Salva nuestro reino! ¡Creemos en ti!");
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
        qm.forceCompleteQuest();
        qm.gainExp(4000);
        qm.dispose();
    }
}
