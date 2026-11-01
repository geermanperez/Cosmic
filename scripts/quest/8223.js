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
        qm.sendAcceptDecline("Oh, ¿Jack te envió aquí? Buen momento, estoy planeando junto con Jack y otros asaltar la Fortaleza y recuperar de manos de los Maestros Retorcidos lo que es nuestro por derecho. Pareces listo para luchar junto a nosotros, ¿verdad?");
    } else if (status == 1) {
        qm.sendOk("¡Excelente! Tu misión ahora es reducir algunos números de su ejército y debilitar sus defensas por todos los efectos. Derrota a 75 de cada uno: Windraider, Firebrand y Nightshadow, luego regresa conmigo para informarme.");
        qm.forceStartQuest();
    } else if (status == 2) {
        qm.dispose();
    }
}
