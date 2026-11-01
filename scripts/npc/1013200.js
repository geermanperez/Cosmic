function start() {
    if (!cm.isQuestStarted(22015)) {
        cm.sendOk("#b(Estás demasiado lejos del Piglet. Acércate para agarrarlo).");
    } else {
        cm.gainItem(4032449, true);
        cm.forceCompleteQuest(22015);
        cm.playerMessage(5, "Has rescatado al Piglet.");
    }
    cm.dispose();
}