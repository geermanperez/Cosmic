var status = -1;

function start(mode, type, selection) {
    var familyEntry = qm.getPlayer().getFamilyEntry();
    if (familyEntry != null && familyEntry.getJuniorCount() > 0) {
        qm.forceCompleteQuest();
        qm.gainExp(3000);
        qm.sendNext("¡Buen trabajo!");
    } else {
        qm.sendNext("Veo que no has conseguido encontrar un Junior, ¿vale?");
    }
    qm.dispose();
}

function end(mode, type, selection) {
    var familyEntry = qm.getPlayer().getFamilyEntry();
    if (familyEntry != null && familyEntry.getJuniorCount() > 0) {  // script found thanks to kvmba
        qm.forceCompleteQuest();
        qm.gainExp(3000);
        qm.sendNext("¡Buen trabajo!");
    } else {
        qm.sendNext("Veo que no has conseguido encontrar un Junior, ¿vale?");
    }
    qm.dispose();
}