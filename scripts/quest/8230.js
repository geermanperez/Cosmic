/* ===========================================================
			Ronan Lana
	NPC Name: 		Jack
	Description: 	Quest - Stemming the Tide
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
        qm.sendAcceptDecline("¡Oye, viajero! Necesito tu ayuda. Una gran amenaza está a punto de poner en peligro a la gente de New Leaf City, tal como puedo verlo ahora. Estas criaturas deambulando por aquí de repente... Eso no puede ser bueno. ¿Te importa si escuchas lo que tengo que decir?");
    } else if (status == 1) {
        qm.sendOk("Esa es la cuestión: los Maestros Retorcidos, grandes figuras que actualmente controlan Crimsonwood Keep, han planeado un ataque a gran escala a New Leaf City, que podría ocurrir en los próximos días. No puedo simplemente quedarme aquí observando mientras se preparan para este ataque. Sin embargo, no puedo simplemente dejar esta posición, debo estar atento a sus movimientos a toda costa. Ahí es donde entras: ve a buscar a Lukan, el caballero del pasado Crimsonwood Keep, que actualmente se encuentra deambulando por el bosque, y recibe más órdenes de él, él sabe qué hacer.");
        qm.forceStartQuest();
    } else if (status == 2) {
        qm.dispose();
    }
}

function end(mode, type, selection) {
    status++;

    if (status == 0) {
        if (qm.haveItem(3992041)) {
            qm.sendOk("Ah, lograste la tarea que te encomendé. Bien hecho, ahora esos muchachos están ocupados recuperándose de esta ofensiva. Ahora recuerda:#besa clave debe usarse para acceder#kel Santuario Interior dentro de la Fortaleza. Mantenlo contigo en todo momento si alguna vez quieres ingresar allí.");
            qm.forceCompleteQuest();
        } else if (qm.getQuestStatus(8223) == 2) {
            qm.sendOk("¿Completaste la misión pero perdiste la llave? Eso es malo, NECESITAS esta llave para ingresar a las habitaciones interiores de la Fortaleza. Comprueba con Lukan qué deberías hacer a continuación, te necesitamos dentro de la Fortaleza.");
        } else {
            qm.sendOk("La gente de la ciudad cuenta contigo en este caso. Por favor, apresúrese.");
        }
    } else if (status == 1) {
        qm.dispose();
    }
}