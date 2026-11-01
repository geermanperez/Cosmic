/* ===========================================================
			Ronan Lana
	NPC Name: 		Jack
	Description: 	Quest - Mark of Heroism
=============================================================
Version 1.0 - Script Done.(11/7/2017)
=============================================================
*/

var status = -1;

function start(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 1 && mode == 0) {
            status -= 2;
        } else {
            qm.sendOk("Bien, entonces. Ya nos veremos.");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("¡Ya era hora! Necesitamos crearte una manera de viajar con seguridad a la cima del Valle Crimsonwood, o todo lo que hemos estado haciendo será en vano. Tienes que ponerle las manos encima#b#t3992039##k. ¿Estás listo para partir?");
    } else if (status == 1) {
        qm.sendOk("Bien, primero necesito que tengas estos artículos a mano:#b10 #t4010006##k, #b4 #t4032005##ky#b1 #t4004000##k. ¡Ir!");
        qm.forceStartQuest();
    } else if (status == 2) {
        qm.dispose();
    }
}
