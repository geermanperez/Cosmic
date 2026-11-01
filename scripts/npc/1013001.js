var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0 && type == 0) {
        status--;
    } else if (mode == -1) {
        cm.dispose();
        return;
    } else {
        status++;
    }
    if (status == 0) {
        cm.sendNext("Tú, que estás destinado a ser un Maestro Dragón... Finalmente has llegado.", 1);
    } else if (status == 1) {
        cm.sendNextPrev("Ve y cumple con tus deberes como Maestro Dragón...", 1);
    } else if (status == 2) {
        cm.warp(900090101, 0);
        cm.dispose();
    }
}