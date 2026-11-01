function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.sendNext("Disfruta tu viaje.");
        cm.dispose();
    } else {
        if (status == 0 && mode == 0) {
            cm.sendNext("Disfruta tu viaje.");
            cm.dispose();
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            cm.sendYesNo("¿Le gustaría saltarse los tutoriales e ir directamente a Lith Harbor?");
        } else if (status == 1) {
            cm.warp(104000000, 0);
            cm.dispose();
        }
    }
}