// Intercity travel is immediate and still requires the original ticket.
function start() {
    if (cm.haveItem(4031047)) {
        cm.sendYesNo("Travel to #m101000300# now?");
    } else {
        cm.sendOk("You need a #t4031047# to travel.");
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
