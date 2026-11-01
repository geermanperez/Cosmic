/* ===========================================================
        @author Resonance
	NPC Name: 		Minister of Magic
	Map(s): 		Mushroom Castle: Corner of Mushroom Forest(106020000)
	Description: 	Quest -  Exploring Mushroom Forest(3)
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
            qm.sendOk("¿Por qué preguntaste si ibas a decir que no a esto?");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("Creo que he oído hablar de una poción que rompe este tipo de barreras. creo que se llama#bEsporas de hongos asesinos#k? Hmmm... afuera, encontrarás al Mushroom Scholar.#bScarrs#k esperando afuera.#bScarrs#k es un experto en setas, así que ve a hablar con él.");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.sendOk("Estoy seguro de que #kScarrs#k hará todo lo posible para ayudarle.");
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
        qm.sendOk("Ah, entonces eres el explorador del que hablaba la gente. Soy#bScarrs, el erudito real de los hongos#kRepresentando al Reino de los Hongos. Entonces necesitas algo#kEsporas de hongos asesinos#k?");
    } else if (status == 1) {
        qm.forceCompleteQuest();
        qm.gainExp(4200);
        qm.sendOk("#kEsporas de hongos asesinos#k... Creo que he oído hablar de ellos antes...");
    } else if (status == 2) {
        qm.dispose();
    }
}
	