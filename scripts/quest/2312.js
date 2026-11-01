/* ===========================================================
        @author Resonance
	NPC Name: 		Head Patrol Officer
	Map(s): 		Mushroom Castle: Corner of Mushroom Forest(106020000)
	Description: 	Quest -  The Test
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
            qm.sendOk("Hmmm... debes estar inseguro de tus habilidades de combate. Estaremos aquí esperándote, así que ven a vernos cuando estés listo.");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("Necesitamos tu ayuda, noble explorador. Nuestro reino se enfrenta actualmente a una gran amenaza y necesitamos desesperadamente un explorador valiente dispuesto a luchar por nosotros, y así es como terminaste aquí. Sin embargo, comprenda que, dado que necesitamos depositar nuestra fe en usted, primero tendremos que probar sus habilidades antes de poder respaldarlo firmemente. ¿Estará bien que hagas esto por nosotros?");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.sendOk("Sigue adelante y verás#bEsporas renegadas#k, las Esporas que le dieron la espalda al Reino Champiñón. Le agradeceríamos que pudiera enseñarles una o dos lecciones y traerlas de vuelta.#b50 esporas mutadas#ken cambio.");
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
        qm.sendOk("¿Les diste una lección a esas esporas renegadas?");
    } else if (status == 1) {
        qm.forceCompleteQuest();
        qm.gainExp(11500);
        qm.gainItem(4000499, -50);
        qm.sendOk("Eso fue asombroso. Pido disculpas por dudar de tus habilidades. ¡Por favor salve nuestro Reino Champiñón de esta crisis!");
    } else if (status == 2) {
        qm.dispose();
    }
}
	