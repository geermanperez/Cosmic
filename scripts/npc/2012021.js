// Intercity travel is immediate and still requires the original ticket.
function start() {
    if (cm.haveItem(4031331)) {
        cm.sendYesNo("Travel to #m240000100# now?");
    } else {
        cm.sendOk("You need a #t4031331# to travel.");
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
