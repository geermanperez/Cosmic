// Intercity travel is immediate and still requires the original ticket.
function start() {
    if (cm.haveItem(4031074)) {
        cm.sendYesNo("¿Viaja a #m220000100# ahora?");
    } else {
        cm.sendOk("Necesitas un #t4031074# para viajar.");
        cm.dispose();
    }
}
function action(mode, type, selection) {
    if (mode == 1 && cm.haveItem(4031074)) {
        cm.gainItem(4031074, -1);
        cm.warp(220000100, 0);
    }
    cm.dispose();
}
