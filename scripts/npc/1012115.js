function start() {
    var status = cm.getQuestStatus(20706);

    if (status == 0) {
        cm.sendNext("Parece que no hay nada sospechoso en la zona.");
    } else if (status == 1) {
        cm.forceCompleteQuest(20706);
        cm.sendNext("¡Has visto la sombra! Mejor informe a #p1103001#.");
    } else if (status == 2) {
        cm.sendNext("La sombra ya ha sido detectada. Mejor informe a #p1103001#.");
    }
    cm.dispose();
}