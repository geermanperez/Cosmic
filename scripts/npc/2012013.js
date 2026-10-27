// Intercity travel is immediate and still requires the original ticket.
function start() {
    if (cm.haveItem(4031074)) {
        cm.sendYesNo("Travel to #m220000100# now?");
    } else {
        cm.sendOk("You need a #t4031074# to travel.");
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
