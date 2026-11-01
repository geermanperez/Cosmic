var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (!cm.haveItem(4001163) || !cm.isEventLeader()) {
                cm.sendYesNo("Deja que el líder de tu grupo me muestre la Piedra Púrpura de la Magia desde aquí.\r\n\r\nO tal vez quieras#rdeja este bosque#k? Irse ahora significa abandonar a tus socios aquí, tenlo en cuenta.");
            } else {
                cm.sendNext("Genial, tienes la Piedra Púrpura de la Magia. Les mostraré chicos#bel camino que conduce al Altar de Piedra#k. Ven por aquí.");
            }
        } else if (status == 1) {
            if (!cm.haveItem(4001163)) {
                cm.warp(930000800, 0);
            } else {
                cm.getEventInstance().warpEventTeam(930000600);
            }

            cm.dispose();
        }
    }
}