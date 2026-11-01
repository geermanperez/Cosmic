// Intercity travel is immediate and still requires the original ticket.
function start() {
    if (cm.haveItem(4031331)) {
        cm.sendYesNo("¿Viaja a #m240000100# ahora?");
    } else {
        cm.sendOk("Necesitas un #t4031331# para viajar.");
        cm.dispose();
    }
}
function action(mode, type, selection) {
    if (mode == 1 && cm.haveItem(4031331)) {
        cm.gainItem(4031331, -1);
        cm.warp(240000100, 0);
    }
    cm.dispose();
}
