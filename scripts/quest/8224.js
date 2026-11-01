/* ===========================================================
			Ronan Lana
	NPC Name: 		Taggrin
	Description: 	Quest - The Fallen Woods
=============================================================
Version 1.0 - Script Done.(10/7/2017)
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
        qm.sendAcceptDecline("¡Oye viajero, ven aquí! Soy Taggrin, líder del Clan Ninja Cuervo. Actualmente somos mercenarios bajo la carga útil del condado de New Leaf City. Nuestro trabajo aquí es cazar a esas criaturas que han estado acechando por aquí estos días. ¿Estás interesado en hacernos un pequeño recado? Por supuesto, la recompensa será ventajosa para ambas partes.");
    } else if (status == 1) {
        qm.sendOk("De acuerdo. Necesito que caces#besos árboles falsos#ken el bosque y recoge 50 de sus gotas como prueba de que hiciste tu parte en esto.");
        qm.forceStartQuest();
    } else if (status == 2) {
        qm.dispose();
    }
}
