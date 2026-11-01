/* ===========================================================
			Ronan Lana
	NPC Name: 		Lukan
	Description: 	Quest - Storming the Castle
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
        qm.sendAcceptDecline("Ahora es el momento, chico. Tenemos todos los preparativos completos para seguir investigando por qué han estado sucediendo todas estas rarezas últimamente. También debo presentarte a mi hermano, Jack.");
    } else if (status == 1) {
        qm.sendOk("Actualmente está deambulando por la Montaña Crimsonwood, pasando por el siniestro Bosque Fantasma, en el camino hacia Crimsonwood Keep. Tu próximo destino está allí, que tu viaje sea seguro.");
        qm.forceStartQuest();
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
            qm.sendOk("Bien, entonces. Ya nos veremos.");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendNext("¿Quién eres? Oh, ¿viniste aquí en lugar de mi hermano John? Excelente.");
    } else if (status == 1) {
        qm.sendOk("Parece que ayudaste a la gente de la ciudad con algunos recados, ¿no? Te valoraré muy bien. Echa un vistazo a esto: este es un mapa del Bosque Fantasma, que hice yo mismo después de explorar lo suficiente. Toma posesión de eso y#bse le concederá el paso#kpor caminos otras veces indescubribles. Recuerda bien#rnunca lo pierdas#k¡No volverás a tener eso!\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i3992040# #t3992040#\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 175000 EXP");
    } else if (status == 2) {
        if (qm.canHold(3992040, 1)) {
            qm.forceCompleteQuest();
            qm.gainItem(3992040, 1);
            qm.gainExp(175000);
            qm.dispose();
        } else {
            qm.sendOk("Oye, no tienes un espacio en tu inventario de CONFIGURACIÓN para lo que tengo para darte. Resuelve ese pequeño problema tuyo y luego habla conmigo.");
        }
    } else if (status == 3) {
        qm.dispose();
    }
}
