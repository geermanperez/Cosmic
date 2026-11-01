/* ===========================================================
			Ronan Lana
	NPC Name: 		John, Elpam
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
        qm.sendAcceptDecline("Mmm, eso no está bien. Parece que no puedo hacer que estos Hyper Glyphs funcionen, maldita sea. ... ¡Ah, sí, el forastero! Es posible que conozca el idioma en el que está escrito este documento. Que Elpam intente leer esto, tal vez sepa algo.");
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
            qm.sendOk("Hola, nativo de este mundo. ¿Tienes un mensaje que necesita traducción? Mi gente en Versal es conocida por dominar muchos idiomas extranjeros, este bien puede ser alguno que conozcamos. Por favor espera...");
            qm.gainItem(4032032, -1);
            qm.forceCompleteQuest();
        } else {
            qm.sendOk("Me temo que no tiene consigo la carta que decía tener.");
        }
    } else if (status == 1) {
        qm.dispose();
    }
}
