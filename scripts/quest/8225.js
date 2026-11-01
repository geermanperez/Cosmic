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
        qm.sendAcceptDecline("Oye, socio. Ahora que formas parte del equipo de Raven Claws, tengo una tarea para ti. ¿Estás levantado ahora?");
    } else if (status == 1) {
        qm.sendOk("Muy bien. Para demostrar tu valor entre nuestras filas, primero debes superar un pequeño desafío: tienes que poder moverte extraordinariamente bien por aquí, sabiendo todos los secretos que esconde este bosque. trazar un#bmapa del bosque fantasma#kEntonces ven a hablar conmigo. Entonces evaluaré si vales la pena estar con nosotros.");
        qm.forceStartQuest();
    } else if (status == 2) {
        qm.dispose();
    }
}
