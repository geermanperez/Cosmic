/*
    Jay - Henesys Ruins (Gate to the Future)
    NPC ID: 2142007
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
        cm.sendNext("I am #bJay#k. Ever since the catastrophe, I have dedicated myself to recording the tragic events unfolding in Maple World.");
    } else if (status == 1) {
        cm.sendNextPrev("Future generations must know the truth about how the Empress fell under the influence of darkness and how our people persevered.");
    } else if (status == 2) {
        cm.sendOk("If you uncover any relics or knowledge about the Black Mage's magic in the ruins, let us know. Knowledge is our sharpest blade.");
        cm.dispose();
    }
}
