/*
	Trash Can 3
	Kerning Subway
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
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        } else if (mode == 0) {
            status--;
        } else {
            status++;
        }

        if (status == 0) {
            if (cm.isQuestStarted(20710)) {
                if (!cm.hasItem(4032136)) {
                    if (cm.canHold(4032136)) {
                        cm.gainItem(4032136, 1);
                        cm.sendNext("Has encontrado un#b#t4032136##ken el cubo de la basura!#i4032136#");
                    } else {
                        cm.sendOk("#i4032136# No hay suficiente espacio en su inventario de ETC.");
                    }
                } else {
                    cm.sendOk("Solo un bote de basura ahí.");
                }
            } else {
                cm.sendOk("Solo un bote de basura ahí.");
            }
        } else if (status == 1) {
            cm.dispose();
        }
    }
}