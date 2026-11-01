var map = 677000008;
var quest = 28219;
var questItem = 4032493;
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
        if (cm.haveItem(4032485, 1)) {
            cm.gainItem(4032485, -1);
        }
        if (cm.haveItem(4001355, 1)) {
            cm.gainItem(4001355, -1);
        }

        cm.warp(map, 0);
        cm.dispose();
    }
}