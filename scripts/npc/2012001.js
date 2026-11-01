// Intercity travel is immediate and still requires the original ticket.
function start() {
    if (cm.haveItem(4031047)) {
        cm.sendYesNo("¿Viaja a #m101000300# ahora?");
    } else {
        cm.sendOk("Necesitas un #t4031047# para viajar.");
        cm.dispose();
    }
}
function action(mode, type, selection) {
    if (mode == 1 && cm.haveItem(4031047)) {
        cm.gainItem(4031047, -1);
        cm.warp(101000300, 1);
    }
    cm.dispose();
}
