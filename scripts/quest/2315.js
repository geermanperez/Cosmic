/* ===========================================================
        @author Resonance
	NPC Name: 		Minister of Home Affairs
	Map(s): 		Mushroom Castle: Corner of Mushroom Forest(106020000)
	Description: 	Quest -  Exploring Mushroom Forest(2)
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
            qm.sendOk("Por favor, no olvide nuestra petición de ayuda.");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("Una poderosa barrera mágica, ¿eh? Entonces ¿qué debemos hacer...? Si no podemos encontrar una manera de romper esa barrera, entonces no podremos salvar a la princesa. Si es imposible atravesarlo físicamente, como mencionaste, entonces ¿qué tal si solicitas ayuda a nuestro#bMinistro de Magia#k?");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.sendOk("Por favor ve a verlo inmediatamente. El#bMinistro de Magia#kPuede parecer un poco al límite, pero tiene mucho conocimiento y estoy seguro de que sabrá qué hacer.");
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
        qm.sendOk("¿Qué? ¿Investigaste la barrera en el Bosque de Hongos?");
    } else if (status == 1) {
        qm.forceCompleteQuest();
        qm.gainExp(4000);
        qm.sendOk("Mmmm... esto es interesante. Es una barrera creada por alguien con una poderosa fuerza mágica, lo que significa que no hay manera de que podamos atravesarla manualmente.");
    } else if (status == 2) {
        qm.dispose();
    }
}
	