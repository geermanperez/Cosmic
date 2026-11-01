// Intercity travel is immediate and still requires the original ticket.
function start() {
    if (cm.haveItem(4031045)) {
        cm.sendYesNo("¿Viaja a #m200000100# ahora?");
    } else {
        cm.sendOk("Necesitas un #t4031045# para viajar.");
        cm.dispose();
    }
}
function action(mode, type, selection) {
    if (mode == 1 && cm.haveItem(4031045)) {
        cm.gainItem(4031045, -1);
        cm.warp(200000100, 0);
    }
    cm.dispose();
}
