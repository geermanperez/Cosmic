/*
    Maya - Henesys Ruins (Gate to the Future)
    NPC ID: 2142004
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
        cm.sendNext("Hello, traveler... *cough*... It is getting harder to breathe with the thick miasma surrounding our ruins.");
    } else if (status == 1) {
        cm.sendNextPrev("Even after all these years, my weak constitution remains, but seeing the brave resistance fight gives me strength.");
    } else if (status == 2) {
        cm.sendOk("Please take care when venturing outside the camp. The monsters are far more aggressive than they used to be.");
        cm.dispose();
    }
}
