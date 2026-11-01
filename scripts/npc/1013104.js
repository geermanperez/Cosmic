function start() {
    if (cm.isQuestStarted(22007)) {
        if (!cm.haveItem(4032451)) {
            cm.gainItem(4032451, true);
            cm.sendNext("#b(Has obtenido un huevo. Entrégalo a Utah).");
        } else {
            cm.sendNext("#b(Ya obtuviste un huevo. Toma el huevo que tienes y dáselo a Utah).");
        }
    } else {
        cm.sendNext("#b(No es necesario que tomes un huevo ahora).#k");
    }
    cm.dispose();
}