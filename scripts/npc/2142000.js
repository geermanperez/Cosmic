/*
    Athena Pierce - Henesys Ruins (Gate to the Future)
    NPC ID: 2142000
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
        cm.sendNext("Welcome to what remains of Henesys. As you can see, our beloved town has fallen into ruin after Empress Cygnus was corrupted by the Black Mage.");
    } else if (status == 1) {
        cm.sendNextPrev("We, the survivors and the resistance, are doing everything in our power to hold this safe haven and protect the innocent.");
    } else if (status == 2) {
        cm.sendSimple("Is there anything I can help you with?\r\n#b#L0#Tell me more about what happened here.#l\r\n#L1#How can I reach the Knight Stronghold?#l\r\n#L2#I am ready to fight!#l");
    } else if (status == 3) {
        if (selection == 0) {
            cm.sendNext("When the Empress was consumed by darkness, the Cygnus Knights turned against Victoria Island and destroyed our homes. We retreated here to build the final line of defense.");
        } else if (selection == 1) {
            cm.sendNext("To reach the Cygnus Knight Stronghold, head right through the ruins and into the Dark Ereve path. Be careful, the corrupted knights are extremely formidable.");
        } else if (selection == 2) {
            cm.sendOk("Your courage gives us hope, brave adventurer! Speak with Chief Alex and the others to assist in defending the ruins.");
            cm.dispose();
            return;
        }
    } else if (status == 4) {
        cm.sendOk("Please be careful out there. The darkness has infected even the surrounding wildlife.");
        cm.dispose();
    }
}
