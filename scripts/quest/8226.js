/* ===========================================================
			Ronan Lana
	NPC Name: 		Taggrin
	Description: 	Quest - The Right Path
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
        qm.sendAcceptDecline("Ahora que eres parte de nuestro equipo, escucha lo que tengo para decir. Nosotros, Raven Clan of Ninjas, estamos contratados para encargarnos de muchos asuntos, y para ello cada uno trabaja en diferentes sectores del continente, resolviendo problemas para nuestros empleadores. Estoy a punto de hablar sobre tu misión, ¿estás listo?");
    } else if (status == 1) {
        qm.sendOk("Tu próxima misión es: derrotar a los Elderwraiths que deambulan por este bosque. Sin embargo, son un grupo difícil, así que mantente alerta. Necesito que me traigas 100 #t4032010# como prueba de tu deber.");
        qm.forceStartQuest();
    } else if (status == 2) {
        qm.dispose();
    }
}
