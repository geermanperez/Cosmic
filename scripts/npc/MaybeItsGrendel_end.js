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
        cm.sendNext("...¿una figura negra y oscura salió y te atacó? ¿Cómo puede ocurrir esto en#b#p1032001##k¿La casa? Esto suena como una gran conspiración aquí...");
    } else if (status == 1) {
        cm.sendNextPrev("Tendré que ordenar todo esto en mi mente. Hablame en un rato.");
    } else if (status == 2) {
        cm.dispose();
    }
}