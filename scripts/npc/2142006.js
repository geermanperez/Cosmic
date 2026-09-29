/*
    Camila - Henesys Ruins (Gate to the Future)
    NPC ID: 2142006
*/

var status = -1;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
        return;
    }
    if (mode == 0) {
        status--;
    } else {
        status++;
    }

    if (status == 0) {
        cm.sendNext("I can still remember when Utah and I would play on the pig farm under the blue sky...");
    } else if (status == 1) {
        cm.sendNextPrev("Now the sky is perpetually dark, and monstrous beasts lurk in the shadows. I pray every day that peace returns to our land.");
    } else if (status == 2) {
        cm.sendOk("Thank you for visiting us. Please be safe on your journey!");
        cm.dispose();
    }
}
