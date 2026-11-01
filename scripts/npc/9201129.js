var map = 677000000;
var quest = 28198;
var questItem = 4032495;
var status = -1;

function start(mode, type, selection) {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        if (cm.isQuestStarted(quest)) {
            if (cm.haveItem(questItem)) {
                cm.sendYesNo("¿Te gustaría mudarte a#b#m" + map + "##k?");
            } else {
                cm.sendOk("La entrada está bloqueada por una fuerza que sólo pueden levantar quienes portan un emblema.");
                cm.dispose();
            }
        } else {
            cm.sendOk("La entrada está bloqueada por una fuerza extraña.");
            cm.dispose();
        }
    } else {
        cm.warp(map, 0);
        cm.dispose();
    }
}