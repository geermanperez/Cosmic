var status;

function playerNearby(chrpos, portalpos) {
    try {
        return Math.sqrt(Math.pow((portalpos.getX() - chrpos.getX()), 2) + Math.pow((portalpos.getY() - chrpos.getY()), 2)) < 77;
    } catch (err) {
        return false;
    }
}

function start() {
    status = -1;
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
            if (playerNearby(cm.getPlayer().getPosition(), cm.getMap().getPortal("chimney01").getPosition())) {
                cm.sendOk("Oye, oye~~ Por favor, no entres a escondidas en la casa de otra persona sin permiso, no querrás recibir un comentario travieso en la lista de Santa este año, ¿verdad?");
            } else {
                cm.sendOk("Hohoho~~ ¡Que tengas un gran año lleno de salud, realización y felicidad!");
            }
        } else {
            cm.dispose();
        }
    }
}