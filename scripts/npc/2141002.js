/*
	NPC Name: 		The Forgotten Temple Manager
	Map(s): 		Deep in the Shrine - Twilight of the gods
	Description: 		Pink Bean
 */

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        var eim = cm.getEventInstance();
        if (!eim.isEventCleared()) {
            if (status == 0) {
                cm.sendYesNo("¿Quieres salir ahora?");
            } else if (status == 1) {
                cm.warp(270050000, 0);
                cm.dispose();
            }

        } else {
            if (status == 0) {
                cm.sendYesNo("¡Había Rosa ha sido derrotada! ¡Seguro que sois verdaderos héroes de esta tierra! En poco tiempo, el Templo del Tiempo volverá a brillar más que nunca, ¡todo gracias a tus esfuerzos! ¡¡Hurra por nuestros héroes!! ¿Estás listo para partir ahora?");
            } else if (status == 1) {
                if (eim.giveEventReward(cm.getPlayer(), 1)) {
                    cm.warp(270050000);
                } else {
                    cm.sendOk("No puedes recibir un premio de instancia sin tener una habitación vacía en tu inventario de EQUIPAMIENTO, USO, CONFIGURACIÓN y ETC.");
                }

                cm.dispose();
            }
        }
    }
}