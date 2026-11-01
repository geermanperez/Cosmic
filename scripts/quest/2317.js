/* ===========================================================
        @author Resonance
	NPC Name: 		Scarrs
	Map(s): 		Mushroom Castle: Corner of Mushroom Forest(106020000)
	Description: 	Quest -  Killer Mushroom Spores(1)
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
            qm.sendOk("Romper la barrera requerirá la gorra de hongo venenoso. Háblame cuando cambies de opinión.");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("¡Ah! Si no me equivoco, vi el#bEsporas de hongos asesinos#kHace mucho tiempo, cuando era niño en un libro. Ahora lo recuerdo... está hecho de extractos de poderosos venenos de hongos venenosos, lo que significa que necesitarás algunas cápsulas de hongos venenosos. Si puedes conseguirlos, creo que podré hacerlo.");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.sendOk("Por favor derrota#bHongos Venenosos#ky traer de vuelta#b100 cápsulas de hongos venenosos#ken cambio.");
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
        qm.sendOk("¿Has reunido las 100 cápsulas de hongos venenosos que te pedí?");
    } else if (status == 1) {
        qm.sendOk("Me sorprende que hayas podido reunir estas 100 cápsulas de hongos venenosos, lo cual se considera una hazaña difícil. Creo que podré hacer#bEsporas de hongos asesinos#knuestro de estos.");
    } else if (status == 2) {
        qm.forceCompleteQuest();
        qm.gainExp(13500);
        qm.gainItem(4000500, -100);
        qm.dispose();
    }
}
	