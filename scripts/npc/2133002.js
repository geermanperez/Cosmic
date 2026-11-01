var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        if (status == 0) {
            cm.dispose();
        }
        status--;
    }
    if (status == 0) {
        cm.sendYesNo("¿Le gustaría salir de esta instancia? Es posible que los miembros de tu grupo también tengan que abandonarlo, así que tenlo en cuenta.");
    } else if (status == 1) {
        cm.removeAll(4001163);
        cm.removeAll(4001169);
        cm.removeAll(2270004);
        cm.warp(930000800, 0);
        cm.dispose();
    }
}