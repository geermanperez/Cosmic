/* ===========================================================
        @author Resonance
	NPC Name: 		Minister of Magic
	Map(s): 		Mushroom Castle: Corner of Mushroom Forest(106020000)
	Description: 	Quest -  Over the Castle Wall (1)
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
            qm.sendOk("Parece que no sigues bien las instrucciones. Ven a verme cuando estés listo.");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("Ahora podrás atravesar la barrera de enredaderas espinosas del Bosque Champiñón, pero antes de eso,#bMinistro del Interior#kquiere hablar contigo. Por favor ve a verlo inmediatamente.");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.sendOk("Buena suerte.");
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
        qm.sendOk("He estado al tanto de tu fabuloso trabajo. Soy consciente de que ha creado correctamente el#bEsporas de hongos asesinos#k, que penetra a través de la barrera impenetrable del bosque. ¡Felicidades!");
    } else if (status == 1) {
        qm.forceCompleteQuest();
        qm.gainExp(2500);
        qm.sendOk("El problema ahora es descubrir cómo entrar al castillo.");
    } else if (status == 2) {
        qm.dispose();
    }
}
	