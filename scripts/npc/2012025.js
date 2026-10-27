// Intercity travel is immediate and still requires the original ticket.
function start() {
    if (cm.haveItem(4031576)) {
        cm.sendYesNo("Travel to #m260000100# now?");
    } else {
        cm.sendOk("You need a #t4031576# to travel.");
        cm.dispose();
    }
}
function action(mode, type, selection) {
    if (mode == 1 && cm.haveItem(4031576)) {
        cm.gainItem(4031576, -1);
        cm.warp(260000100, 0);
    }
    cm.dispose();
}
