/* ===========================================================
			Ronan Lana
	NPC Name: 		Lita Lawless
	Description: 	Quest - Bounty Hunter - One Step A-Head
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
        var target = "is the Headless Horseman";
        qm.sendAcceptDecline("¡Oye, viajero! Necesito tu ayuda. Una nueva amenaza ha aparecido para los ciudadanos de New Leaf City. Actualmente estoy reclutando a alguien y esta vez el objetivo es #r." + target + "#k. ¿Estás dentro?");
    } else if (status == 1) {
        var reqs = "#r1 #t4031903##k";
        qm.sendOk("Muy bien. Consígueme #r" + reqs + "#k, lo antes posible. El NLC cuenta contigo.");
        qm.forceStartQuest();
    } else if (status == 2) {
        qm.dispose();
    }
}