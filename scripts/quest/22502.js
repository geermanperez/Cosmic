var status = -1;

function start(mode, type, selection) {
    if (mode == 0 && type == 0) {
        status--;
    } else if (mode == -1) {
        qm.dispose();
        return;
    } else {
        status++;
    }
    if (status == 0) {
        qm.sendAcceptDecline("¿No disfrutaría un lagarto un#b#t4032452##k, como una vaca? Hay muchos#bHaystacks#Hay k cerca, así que intenta alimentarlo con eso.");
    } else if (status == 1) {
        if (mode == 0) {
            qm.sendNext("Hm, nunca se sabe a menos que lo intentes. Ese lagarto es lo suficientemente grande como para estar en Maple's Believe It Or Not. Podría comer heno.");
        } else {
            qm.forceStartQuest();
            qm.sendImage("UI/tutorial/evan/12/0");
        }
        qm.dispose();
    }
}
