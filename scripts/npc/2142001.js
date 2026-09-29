/*
    Chief Alex - Henesys Ruins (Gate to the Future)
    NPC ID: 2142001
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
        cm.sendNext("I am #bChief Alex#k, now responsible for the security and survival of Henesys Ruins after Elder Stan stepped down.");
    } else if (status == 1) {
        cm.sendNextPrev("When I was younger in Kerning City, I never imagined I would carry such a heavy burden. But watching my father Stan and our people suffer gave me the resolve to stand up.");
    } else if (status == 2) {
        cm.sendSimple("What would you like to know?\r\n#b#L0#How are the defenses holding up?#l\r\n#L1#How is Elder Stan doing?#l\r\n#L2#I will assist with the defense.#l");
    } else if (status == 3) {
        if (selection == 0) {
            cm.sendNext("Our barricades barely hold against the Mutated Snails, Slimes, and Ribbon Pigs roaming outside. We constantly need strong adventurers to thin out their numbers.");
        } else if (selection == 1) {
            cm.sendNext("My father is resting nearby. The tragedy broke his heart, but seeing that there are still heroes willing to help brings comfort to him.");
        } else if (selection == 2) {
            cm.sendOk("Thank you! Every helping hand matters in our fight for survival. Please speak to Athena Pierce and the other villagers as well.");
            cm.dispose();
            return;
        }
    } else if (status == 4) {
        cm.sendOk("May the winds favor you, traveler.");
        cm.dispose();
    }
}
