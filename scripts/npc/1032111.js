/*
	NPC: Small Tree Stump
	MAP: Victoria Road - Top of the Tree That Grew (101010103)
	QUEST: Maybe it's Arwen! (20716)
*/

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status == 0)) {
        cm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }


    if (status == 0) {
        if (cm.isQuestStarted(20716)) {
            if (!cm.hasItem(4032142)) {
                if (cm.canHold(4032142)) {
                    cm.gainItem(4032142, 1);
                    cm.sendOk("Embotellaste un poco de la savia clara del árbol.  #i4032142#");
                } else {
                    cm.sendOk("Asegúrate de tener un lugar libre en tu inventario de ETC.");
                }
            } else {
                cm.sendOk("Un flujo interminable de savia sale de este pequeño tocón de árbol.");
            }
        } else {
            cm.sendOk("Un flujo interminable de savia sale de este pequeño tocón de árbol.");
        }
    } else if (status == 1) {
        cm.dispose();

    }
}