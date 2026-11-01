/* ===========================================================
			Ronan Lana
	NPC Name: 		Jack, John
	Description: 	Quest - Lost in Translation
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
            qm.sendOk("¡Vamos, la ciudad realmente necesita que cooperes en esto!");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("¡Hola amigo! Buen momento. Hay un comunicado que pude obtener de los funcionarios de la Fortaleza, sin embargo, su información está encriptada. No tengo ningún uso para esto ya que es así. Entonces, ¿le transportarás esto a John y verás si puede decodificarlo?");
    } else if (status == 1) {
        if (qm.canHold(4032032, 1)) {
            qm.gainItem(4032032, 1);
            qm.sendOk("Muy bien, cuento contigo para esto.");
            qm.forceStartQuest();
        } else {
            qm.sendOk("Ey. No hay ningún espacio en su ETC.");
        }
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
        if (qm.haveItem(4032032, 1)) {
            qm.gainItem(4032032, -1);
            qm.sendOk("¡¿Trajiste una carta de la Fortaleza?! ¡Limpio! Déjame comprobar si puedo decodificar eso ahora mismo.");
            qm.forceCompleteQuest();
        } else {
            qm.sendOk("¿No trajiste la carta codificada que dijo Jack? ¡Vamos, chico, necesitamos eso para descifrar el siguiente paso de nuestros enemigos!");
        }
    } else if (status == 1) {
        qm.dispose();
    }
}
