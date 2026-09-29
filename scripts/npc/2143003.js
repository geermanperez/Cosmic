/*
    Informant - Henesys Ruins (Gate to the Future)
    NPC ID: 2143003
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
        cm.sendSimple("Psst... looking for intel on the Knight Stronghold and the Empress?\r\n#b#L0#What information do you have on Empress Cygnus?#l\r\n#L1#What about the Cygnus Knight Chiefs?#l\r\n#L2#How do I bypass the Stronghold security?#l");
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendNext("Empress Cygnus resides deep within the Cygnus Garden inside the Knight Stronghold. She is protected by the Shinsoo and commands dark elemental forces.");
        } else if (selection == 1) {
            cm.sendNext("The five Knight Chiefs (Mihile, Oz, Irena, Eckhart, and Hawkeye) have all been corrupted. They guard different sectors of the stronghold with lethal combat skills.");
        } else if (selection == 2) {
            cm.sendNext("The Stronghold is heavily fortified. You will need strong allies and a Dream Key to gain entrance into the Garden of the Empress.");
        }
    } else if (status == 2) {
        cm.sendOk("Remember, in this ruined era, vigilance is the key to survival.");
        cm.dispose();
    }
}
