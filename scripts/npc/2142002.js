/*
    Ex-chief Stan - Henesys Ruins (Gate to the Future)
    NPC ID: 2142002
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
        cm.sendNext("Ah... *cough*... It hurts my old heart to see Henesys reduced to ash and rubble. I governed our peaceful village for decades, and yet...");
    } else if (status == 1) {
        cm.sendNextPrev("My son Alex has stepped up as the new chief. He has grown into a dependable leader, and I am proud of him.");
    } else if (status == 2) {
        cm.sendOk("Please help Alex and Athena Pierce protect what is left of our sanctuary. Maple World needs heroes now more than ever.");
        cm.dispose();
    }
}
